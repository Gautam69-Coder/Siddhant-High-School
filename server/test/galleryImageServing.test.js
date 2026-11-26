const { after, before, test } = require("node:test");
const assert = require("node:assert/strict");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");
process.env.JWT_SECRET = "gallery-image-serving-test-only";

const {
  AdminUser,
  AuditLog,
  FacultyMember,
  GalleryMedia,
  SchoolSettings,
} = require("../src/models");
const app = require("../src/app");
const { ROLES } = require("../src/constants/enums");

const cmsEditor = {
  _id: "cms-editor-gallery-test",
  role: ROLES.CMS_EDITOR,
  is_active: true,
};

const originalMethods = {};
const storedGalleryDocs = new Map();
let server;
let baseUrl;

const sampleJpegBytes = Buffer.from([
  0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01,
  0x01, 0x00, 0x48, 0x00, 0x48, 0x00, 0x00, 0xff, 0xd9,
]);

const signedCmsToken = () =>
  jwt.sign({ id: cmsEditor._id }, process.env.JWT_SECRET, { expiresIn: "5m" });

const buildQuery = (resolver) => ({
  populate() {
    return this;
  },
  sort() {
    return this;
  },
  skip() {
    return this;
  },
  limit() {
    return this;
  },
  select() {
    return this;
  },
  then(resolve, reject) {
    return Promise.resolve(resolver()).then(resolve, reject);
  },
});

before(async () => {
  originalMethods.adminFindById = AdminUser.findById;
  originalMethods.auditCreate = AuditLog.create;
  originalMethods.galleryInsertMany = GalleryMedia.insertMany;
  originalMethods.galleryFind = GalleryMedia.find;
  originalMethods.galleryCount = GalleryMedia.countDocuments;
  originalMethods.galleryFindById = GalleryMedia.findById;
  originalMethods.galleryFindOne = GalleryMedia.findOne;
  originalMethods.facultyFind = FacultyMember.find;
  originalMethods.settingsFindOne = SchoolSettings.findOne;

  AdminUser.findById = () => ({ select: async () => cmsEditor });
  AuditLog.create = async () => ({});

  GalleryMedia.insertMany = async (docs) =>
    docs.map((doc) => {
      const saved = {
        ...doc,
        toObject() {
          return { ...this };
        },
      };
      storedGalleryDocs.set(String(doc._id), saved);
      return saved;
    });

  GalleryMedia.find = () =>
    buildQuery(() =>
      Array.from(storedGalleryDocs.values()).map((doc) => {
        const copy = { ...doc };
        delete copy.image_data;
        return copy;
      })
    );

  GalleryMedia.countDocuments = async () => storedGalleryDocs.size;

  GalleryMedia.findById = (id) =>
    buildQuery(() => storedGalleryDocs.get(String(id)) || null);

  GalleryMedia.findOne = (filter) =>
    buildQuery(() => {
      for (const doc of storedGalleryDocs.values()) {
        if (filter?.media_url && doc.media_url === filter.media_url) {
          return doc;
        }
      }
      return null;
    });

  FacultyMember.find = (filter) =>
    buildQuery(() => {
      const records = [
        {
          _id: "fac-1",
          full_name: "Divya Shetty",
          designation: "HOD",
          department: "Academics",
          email: "divya@example.test",
          is_active: true,
        },
        {
          _id: "fac-2",
          full_name: "Inactive Staff",
          designation: "Teacher",
          department: "Sports",
          email: "inactive@example.test",
          is_active: false,
        },
      ];
      return filter?.is_active === true
        ? records.filter((item) => item.is_active)
        : records;
    });

  SchoolSettings.findOne = () =>
    buildQuery(() => ({
      school_name: "Siddhant High School",
      society_name: "Shubham Education & Welfare Society",
      academic_year: "2026-2027",
      contact_email: "info@siddhanthighschool.edu",
      epabx_lines: "+91 20 1234 5678",
      campus_address: "Pune, Maharashtra",
      office_hours: "8:00 AM – 2:00 PM",
    }));

  server = app.listen(0);
  await new Promise((resolve) => server.once("listening", resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) =>
      server.close((err) => (err ? reject(err) : resolve()))
    );
  }
  AdminUser.findById = originalMethods.adminFindById;
  AuditLog.create = originalMethods.auditCreate;
  GalleryMedia.insertMany = originalMethods.galleryInsertMany;
  GalleryMedia.find = originalMethods.galleryFind;
  GalleryMedia.countDocuments = originalMethods.galleryCount;
  GalleryMedia.findById = originalMethods.galleryFindById;
  GalleryMedia.findOne = originalMethods.galleryFindOne;
  FacultyMember.find = originalMethods.facultyFind;
  SchoolSettings.findOne = originalMethods.settingsFindOne;
});

test("gallery upload persists image binary and serves a valid image over HTTP", async () => {
  storedGalleryDocs.clear();
  // Seed an orphaned dead disk record to verify it is excluded from public listing
  storedGalleryDocs.set("507f1f77bcf86cd799439099", {
    _id: "507f1f77bcf86cd799439099",
    title: "Orphaned Disk Image",
    category: "Campus",
    media_url: "/uploads/gallery/non-existent-file-12345.jpg",
    has_binary: false,
  });

  const formData = new FormData();
  const blob = new Blob([sampleJpegBytes], { type: "image/jpeg" });
  formData.append("images", blob, "campus-building.jpg");
  formData.append("category", "Campus");

  const uploadRes = await fetch(`${baseUrl}/api/v1/gallery/upload`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${signedCmsToken()}`,
    },
    body: formData,
  });

  assert.equal(uploadRes.status, 201);
  const uploadJson = await uploadRes.json();
  assert.equal(uploadJson.success, true);
  assert.equal(uploadJson.data.length, 1);
  const uploadedItem = uploadJson.data[0];
  assert.equal("image_data" in uploadedItem, false);
  assert.match(uploadedItem.media_url, /^\/api\/v1\/gallery\/[a-f0-9]{24}\/image$/);

  // Public gallery listing omits broken orphaned disk record and returns uploaded item
  const listRes = await fetch(`${baseUrl}/api/v1/gallery`);
  assert.equal(listRes.status, 200);
  const listJson = await listRes.json();
  assert.equal(listJson.data.length, 1);
  assert.equal(listJson.data[0].media_url, uploadedItem.media_url);
  assert.equal("image_data" in listJson.data[0], false);

  // Fetch the actual image URL returned by the backend
  const imageRes = await fetch(`${baseUrl}${uploadedItem.media_url}`);
  assert.equal(imageRes.status, 200);
  assert.equal(imageRes.headers.get("content-type"), "image/jpeg");
  assert.equal(
    imageRes.headers.get("cross-origin-resource-policy"),
    "cross-origin"
  );
  const receivedBytes = Buffer.from(await imageRes.arrayBuffer());
  assert.deepEqual(receivedBytes, sampleJpegBytes);
});

test("missing gallery image returns 404 JSON cleanly", async () => {
  const missingId = crypto.randomBytes(12).toString("hex");
  const res = await fetch(`${baseUrl}/api/v1/gallery/${missingId}/image`);
  assert.equal(res.status, 404);
});

test("public faculty endpoint omits email and inactive members while public settings endpoint returns contact info", async () => {
  const publicFacultyRes = await fetch(`${baseUrl}/api/v1/faculty`);
  assert.equal(publicFacultyRes.status, 200);
  const publicFacultyJson = await publicFacultyRes.json();
  assert.equal(publicFacultyJson.data.length, 1);
  assert.equal(publicFacultyJson.data[0].full_name, "Divya Shetty");
  assert.equal("email" in publicFacultyJson.data[0], false);

  const settingsRes = await fetch(`${baseUrl}/api/v1/settings`);
  assert.equal(settingsRes.status, 200);
  const settingsJson = await settingsRes.json();
  assert.equal(settingsJson.data.contact_email, "info@siddhanthighschool.edu");
  assert.equal(settingsJson.data.epabx_lines, "+91 20 1234 5678");
  assert.equal(settingsJson.data.office_hours, "8:00 AM – 2:00 PM");
});
