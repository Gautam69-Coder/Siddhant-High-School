const { test } = require('node:test');
const assert = require('node:assert/strict');
const bcrypt = require('bcryptjs');
const { AdminUser } = require('../src/models');
const { login } = require('../src/controllers/auth.controller');
const {
  validateChangePassword,
  validateLogin,
  validateRegister,
} = require('../src/validations/auth.validation');
const { validateEnquiry } = require('../src/validations/enquiry.validation');
const { validateAdmission } = require('../src/validations/admission.validation');
const {
  validateCreateNewsAnnouncement,
  validateUpdateNewsAnnouncement,
} = require('../src/validations/newsAnnouncement.validation');
const { validateUpdateGalleryMedia } = require('../src/validations/galleryMedia.validation');
const { isValidAdminPassword } = require('../src/utils/adminPasswordPolicy');
const { escapeRegexLiteral, getSearchTerm } = require('../src/utils/searchText');
const { getGallerySignatureMimeType } = require('../src/middlewares/galleryUpload.middleware');

const validate = (middleware, body) => new Promise((resolve) => {
  middleware({ body }, {}, (error) => resolve(error || null));
});

test('admin password policy avoids bcrypt 72-byte truncation while retaining 12-character minimum', async () => {
  const bcryptBoundaryPassword = 'a'.repeat(72);
  const tooLongPassword = `${bcryptBoundaryPassword}b`;
  assert.equal(isValidAdminPassword('Abcdefghij12'), true);
  assert.equal(isValidAdminPassword('😀'.repeat(12)), true);
  assert.equal(isValidAdminPassword('Abcdefghij1'), false);
  assert.equal(isValidAdminPassword(tooLongPassword), false);
  assert.equal(bcrypt.truncates(tooLongPassword), true);
  assert.equal(bcrypt.truncates(bcryptBoundaryPassword), false);

  assert.equal((await validate(validateRegister, {
    email: 'staff@example.test', password: tooLongPassword, full_name: 'Staff',
  })).statusCode, 400);
  assert.equal((await validate(validateChangePassword, {
    currentPassword: 'ExistingPassword!', newPassword: tooLongPassword,
  })).statusCode, 400);
});

test('malformed authentication and public form bodies return validation errors instead of throwing', async () => {
  assert.equal((await validate(validateLogin, undefined)).statusCode, 400);
  assert.equal((await validate(validateLogin, { email: ['a@b.test'], password: {} })).statusCode, 400);
  assert.equal((await validate(validateChangePassword, undefined)).statusCode, 400);
  assert.equal((await validate(validateEnquiry, { parent_name: 42, email: {}, phone: [], category: 'General information' })).statusCode, 400);
  assert.equal((await validate(validateCreateNewsAnnouncement, { title: {}, category: 'Official' })).statusCode, 400);
  assert.equal((await validate(validateUpdateNewsAnnouncement, undefined)).statusCode, 400);
  assert.equal((await validate(validateUpdateGalleryMedia, undefined)).statusCode, 400);
});

test('admission request validation accepts valid form data and rejects missing, malformed, or oversized values', async () => {
  const validAdmission = {
    student_name: 'Student Example', dob: '2015-02-28', gender: 'Female',
    grade_applying: 'Class 5', previous_school: '', parent_name: 'Parent Example',
    parent_email: 'parent@example.test', parent_phone: '9876543210',
    address: '12 Example Street', city: 'Mumbai', pincode: '400001',
  };
  assert.equal(await validate(validateAdmission, validAdmission), null);
  assert.equal((await validate(validateAdmission, {})).statusCode, 400);
  assert.equal((await validate(validateAdmission, { ...validAdmission, parent_email: 'invalid' })).statusCode, 400);
  assert.equal((await validate(validateAdmission, { ...validAdmission, student_name: 'x'.repeat(151) })).statusCode, 400);
  assert.equal((await validate(validateAdmission, { ...validAdmission, dob: '2015-02-30' })).statusCode, 400);
  assert.equal((await validate(validateAdmission, { ...validAdmission, pincode: '12-3456' })).statusCode, 400);
  assert.equal((await validate(validateAdmission, { ...validAdmission, parent_phone: [] })).statusCode, 400);
});

test('public search treats input as literal text and rejects malformed or oversized values', () => {
  assert.equal(escapeRegexLiteral('(a+)+$'), '\\(a\\+\\)\\+\\$');
  assert.equal(getSearchTerm('  school  '), 'school');
  assert.equal(getSearchTerm(['school']), null);
  assert.equal(getSearchTerm('x'.repeat(101)), null);
});

test('gallery upload signature checker accepts only matching image signatures', () => {
  assert.equal(getGallerySignatureMimeType(Buffer.from([0xff, 0xd8, 0xff, 0x00])), 'image/jpeg');
  assert.equal(getGallerySignatureMimeType(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])), 'image/png');
  assert.equal(getGallerySignatureMimeType(Buffer.from('RIFF0000WEBP')), 'image/webp');
  assert.equal(getGallerySignatureMimeType(Buffer.from('%PDF-1.7')), null);
  assert.equal(getGallerySignatureMimeType(Buffer.from('<html>')), null);
});

test('inactive and unknown login accounts return the same generic response', async () => {
  const originalFindOne = AdminUser.findOne;
  const inactiveAccount = {
    is_active: false,
    email: 'inactive@example.test',
  };
  AdminUser.findOne = async ({ email }) => email === inactiveAccount.email ? inactiveAccount : null;

  const invokeLogin = (email) => new Promise((resolve) => {
    login({ body: { email, password: 'ExamplePassword123!' } }, {}, resolve);
  });

  try {
    const inactiveError = await invokeLogin(inactiveAccount.email);
    const unknownError = await invokeLogin('unknown@example.test');
    assert.equal(inactiveError.statusCode, 401);
    assert.equal(inactiveError.message, 'Invalid institutional email or password');
    assert.equal(unknownError.statusCode, inactiveError.statusCode);
    assert.equal(unknownError.message, inactiveError.message);
  } finally {
    AdminUser.findOne = originalFindOne;
  }
});
