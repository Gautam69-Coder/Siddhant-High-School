const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const jwt = require('jsonwebtoken');
process.env.JWT_SECRET = 'public-content-security-test-only';

const { AdminUser, GalleryMedia, NewsAnnouncement } = require('../src/models');
const app = require('../src/app');
const { ROLES } = require('../src/constants/enums');
const cmsEditor = { _id: 'cms-editor-public-test', role: ROLES.CMS_EDITOR, is_active: true };
const originalMethods = {};
let server;
let baseUrl;
const observed = { newsQuery: null, newsOneQuery: null, newsPopulate: null, galleryPopulate: null };

const queryResult = (value, onPopulate) => ({
  populate(field, projection) { onPopulate?.(field, projection); return this; },
  sort() { return this; },
  skip() { return this; },
  limit() { return this; },
  then(resolve, reject) { return Promise.resolve(value).then(resolve, reject); },
});
const signedCmsToken = () => jwt.sign({ id: cmsEditor._id }, process.env.JWT_SECRET, { expiresIn: '5m' });

before(async () => {
  originalMethods.adminFindById = AdminUser.findById;
  originalMethods.newsFind = NewsAnnouncement.find;
  originalMethods.newsFindOne = NewsAnnouncement.findOne;
  originalMethods.newsCount = NewsAnnouncement.countDocuments;
  originalMethods.galleryFind = GalleryMedia.find;
  originalMethods.galleryCount = GalleryMedia.countDocuments;

  AdminUser.findById = () => ({ select: async () => cmsEditor });
  NewsAnnouncement.find = (query) => {
    observed.newsQuery = query;
    return queryResult([{ _id: 'published-item', status: 'published', author_id: { full_name: 'School Editor' } }],
      (field, projection) => { observed.newsPopulate = { field, projection }; });
  };
  NewsAnnouncement.findOne = (query) => {
    observed.newsOneQuery = query;
    const item = query.status === 'published'
      ? { _id: query._id, status: 'published', author_id: { full_name: 'School Editor' } }
      : { _id: query._id, status: 'draft', author_id: { full_name: 'School Editor' } };
    return queryResult(item, (field, projection) => { observed.newsPopulate = { field, projection }; });
  };
  NewsAnnouncement.countDocuments = async () => 1;
  GalleryMedia.find = () => queryResult([
    { _id: 'gallery-item', uploaded_by: { full_name: 'School Uploader' } },
  ], (field, projection) => { observed.galleryPopulate = { field, projection }; });
  GalleryMedia.countDocuments = async () => 1;

  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  AdminUser.findById = originalMethods.adminFindById;
  NewsAnnouncement.find = originalMethods.newsFind;
  NewsAnnouncement.findOne = originalMethods.newsFindOne;
  NewsAnnouncement.countDocuments = originalMethods.newsCount;
  GalleryMedia.find = originalMethods.galleryFind;
  GalleryMedia.countDocuments = originalMethods.galleryCount;
});

test('public News list cannot request drafts and omits staff email and role', async () => {
  const response = await fetch(`${baseUrl}/api/v1/news-announcements?status=draft`);
  assert.equal(response.status, 200);
  assert.equal(observed.newsQuery.status, 'published');
  assert.deepEqual(observed.newsPopulate, { field: 'author_id', projection: 'full_name' });
  const body = await response.json();
  assert.equal(body.data[0].author_id.full_name, 'School Editor');
  assert.equal('email' in body.data[0].author_id, false);
  assert.equal('role' in body.data[0].author_id, false);
});

test('public News detail cannot retrieve a draft, while CMS staff can request one', async () => {
  const publicResponse = await fetch(`${baseUrl}/api/v1/news-announcements/507f1f77bcf86cd799439011`);
  assert.equal(publicResponse.status, 200);
  assert.equal(observed.newsOneQuery.status, 'published');

  const staffResponse = await fetch(`${baseUrl}/api/v1/news-announcements/507f1f77bcf86cd799439011`, {
    headers: { Authorization: `Bearer ${signedCmsToken()}` },
  });
  assert.equal(staffResponse.status, 200);
  assert.equal(observed.newsOneQuery.status, undefined);
  assert.deepEqual(observed.newsPopulate, { field: 'author_id', projection: 'full_name' });
});

test('public Gallery responses omit staff email addresses', async () => {
  const response = await fetch(`${baseUrl}/api/v1/gallery`);
  assert.equal(response.status, 200);
  assert.deepEqual(observed.galleryPopulate, { field: 'uploaded_by', projection: 'full_name' });
  const body = await response.json();
  assert.equal(body.data[0].uploaded_by.full_name, 'School Uploader');
  assert.equal('email' in body.data[0].uploaded_by, false);
});
