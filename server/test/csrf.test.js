const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const crypto = require('node:crypto');
const jwt = require('jsonwebtoken');
const fs = require('node:fs');

process.env.JWT_SECRET = 'csrf-test-secret-used-only-by-local-tests';
process.env.NODE_ENV = 'test';

const { AdminUser, AdmissionApplication, AuditLog, FacultyMember, GeneralEnquiry } = require('../src/models');
const app = require('../src/app');
const { getCsrfCookieName, setCsrfCookie } = require('../src/middlewares/csrf.middleware');
const { ROLES } = require('../src/constants/enums');

const adminOne = {
  _id: 'csrf-admin-one', role: ROLES.SUPER_ADMIN, is_active: true,
  email: 'admin-one@example.test', isPasswordCorrect: async (value) => value === 'CurrentPassword123!',
  save: async () => {},
};
const adminTwo = { _id: 'csrf-admin-two', role: ROLES.SUPER_ADMIN, is_active: true, email: 'admin-two@example.test' };
const admissionsOfficer = { _id: 'csrf-admissions-officer', role: ROLES.ADMISSIONS_OFFICER, is_active: true };
const cmsEditor = { _id: 'csrf-cms-editor', role: ROLES.CMS_EDITOR, is_active: true };
const originalMethods = {};
let server;
let baseUrl;
let registrationCreates = 0;
let enquiryCreates = 0;
let admissionCreates = 0;

const signedToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '5m' });
const getCookieValue = (response, cookieName) => {
  const allCookies = response.headers.getSetCookie?.() || [response.headers.get('set-cookie') || ''];
  const cookie = allCookies.find((value) => value.startsWith(`${cookieName}=`));
  assert.ok(cookie, `expected ${cookieName} cookie`);
  return cookie.split(';', 1)[0];
};
const cookiesFor = (jwtToken, csrfCookie) => [
  `accessToken=${jwtToken}`,
  csrfCookie,
].filter(Boolean).join('; ');
const registerPayload = (email = 'new-staff@example.test') => ({
  email,
  password: 'TwelveChars!1',
  full_name: 'Test Staff',
  role: ROLES.CMS_EDITOR,
});
const callRegister = (options = {}) => fetch(`${baseUrl}/api/v1/auth/register`, {
  method: 'POST',
  headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
  body: JSON.stringify(options.body || registerPayload()),
});

before(async () => {
  originalMethods.findById = AdminUser.findById;
  originalMethods.findOne = AdminUser.findOne;
  originalMethods.create = AdminUser.create;
  originalMethods.auditCreate = AuditLog.create;
  originalMethods.enquiryCreate = GeneralEnquiry.create;
  originalMethods.admissionCreate = AdmissionApplication.create;
  originalMethods.admissionFind = AdmissionApplication.find;
  originalMethods.admissionFindOne = AdmissionApplication.findOne;
  originalMethods.admissionDeleteOne = AdmissionApplication.findOneAndDelete;
  originalMethods.admissionFindByIdDelete = AdmissionApplication.findByIdAndDelete;
  originalMethods.enquiryFind = GeneralEnquiry.find;
  originalMethods.enquiryFindById = GeneralEnquiry.findById;
  originalMethods.enquiryFindByIdDelete = GeneralEnquiry.findByIdAndDelete;
  originalMethods.facultyCreate = FacultyMember.create;
  originalMethods.facultyFind = FacultyMember.find;
  originalMethods.facultyFindById = FacultyMember.findById;
  originalMethods.facultyUpdate = FacultyMember.findByIdAndUpdate;
  originalMethods.facultyDelete = FacultyMember.findByIdAndDelete;

  AdminUser.findById = (id) => {
    const user = new Map([
      [adminTwo._id, adminTwo],
      [admissionsOfficer._id, admissionsOfficer],
      [cmsEditor._id, cmsEditor],
    ]).get(id) || adminOne;
    return {
      select: async () => user,
      then: (resolve, reject) => Promise.resolve(user).then(resolve, reject),
    };
  };
  AdminUser.findOne = async () => null;
  AdminUser.create = async (record) => {
    registrationCreates += 1;
    return { ...record, _id: `created-${registrationCreates}`, toObject() { return { ...this }; } };
  };
  AuditLog.create = async () => ({});
  GeneralEnquiry.create = async (record) => {
    enquiryCreates += 1;
    return { _id: `enquiry-${enquiryCreates}`, ...record };
  };
  AdmissionApplication.create = async (record) => {
    admissionCreates += 1;
    return { _id: `admission-${admissionCreates}`, ...record, toObject() { return { ...this }; } };
  };
  const applicationRecord = {
    application_number: 'SHS-TEST-123',
    documents: {},
    status: 'pending',
    save: async () => {},
  };
  AdmissionApplication.find = () => ({ sort: async () => [] });
  AdmissionApplication.findOne = async () => applicationRecord;
  AdmissionApplication.findOneAndDelete = async () => applicationRecord;
  AdmissionApplication.findByIdAndDelete = async () => applicationRecord;
  GeneralEnquiry.find = () => ({ sort: async () => [] });
  const enquiryRecord = { status: 'pending', save: async () => {} };
  GeneralEnquiry.findById = async () => enquiryRecord;
  GeneralEnquiry.findByIdAndDelete = async () => enquiryRecord;
  FacultyMember.create = async (record) => ({ _id: 'faculty-created', ...record });
  FacultyMember.find = () => ({ sort: async () => [] });
  FacultyMember.findById = async () => ({ _id: '507f1f77bcf86cd799439011', faculty_name: 'Test Faculty' });
  FacultyMember.findByIdAndUpdate = async () => ({ _id: '507f1f77bcf86cd799439011', faculty_name: 'Updated Faculty' });
  FacultyMember.findByIdAndDelete = async () => ({ _id: '507f1f77bcf86cd799439011' });

  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
  AdminUser.findById = originalMethods.findById;
  AdminUser.findOne = originalMethods.findOne;
  AdminUser.create = originalMethods.create;
  AuditLog.create = originalMethods.auditCreate;
  GeneralEnquiry.create = originalMethods.enquiryCreate;
  AdmissionApplication.create = originalMethods.admissionCreate;
  AdmissionApplication.find = originalMethods.admissionFind;
  AdmissionApplication.findOne = originalMethods.admissionFindOne;
  AdmissionApplication.findOneAndDelete = originalMethods.admissionDeleteOne;
  AdmissionApplication.findByIdAndDelete = originalMethods.admissionFindByIdDelete;
  GeneralEnquiry.find = originalMethods.enquiryFind;
  GeneralEnquiry.findById = originalMethods.enquiryFindById;
  GeneralEnquiry.findByIdAndDelete = originalMethods.enquiryFindByIdDelete;
  FacultyMember.create = originalMethods.facultyCreate;
  FacultyMember.find = originalMethods.facultyFind;
  FacultyMember.findById = originalMethods.facultyFindById;
  FacultyMember.findByIdAndUpdate = originalMethods.facultyUpdate;
  FacultyMember.findByIdAndDelete = originalMethods.facultyDelete;
});

test('cookie session obtains a CSRF token and accepts it for registration', async () => {
  const session = signedToken(adminOne._id);
  const response = await fetch(`${baseUrl}/api/v1/auth/csrf`, { headers: { Cookie: `accessToken=${session}` } });
  assert.equal(response.status, 200);
  assert.equal(response.headers.get('cache-control'), 'no-store');
  const data = await response.json();
  assert.equal(data.data.required, true);
  assert.equal(typeof data.data.token, 'string');
  const csrfExpiresAt = Number(data.data.token.split('.')[1]);
  assert.ok(csrfExpiresAt > Math.floor(Date.now() / 1000));
  assert.ok(csrfExpiresAt <= jwt.decode(session).exp);
  const csrfCookie = getCookieValue(response, getCsrfCookieName());

  const mutation = await callRegister({
    headers: {
      Cookie: cookiesFor(session, csrfCookie),
      'X-CSRF-Token': data.data.token,
    },
  });
  assert.equal(mutation.status, 201);
  assert.equal(registrationCreates, 1);
});

test('cookie-authenticated registration rejects missing, invalid and cross-session tokens', async () => {
  const sessionA = signedToken(adminOne._id);
  const sessionB = signedToken(adminTwo._id);
  const csrfAResponse = await fetch(`${baseUrl}/api/v1/auth/csrf`, { headers: { Cookie: `accessToken=${sessionA}` } });
  const csrfA = (await csrfAResponse.json()).data.token;
  const csrfCookieA = getCookieValue(csrfAResponse, getCsrfCookieName());
  const csrfBResponse = await fetch(`${baseUrl}/api/v1/auth/csrf`, { headers: { Cookie: `accessToken=${sessionB}` } });
  const csrfB = (await csrfBResponse.json()).data.token;
  const csrfCookieB = getCookieValue(csrfBResponse, getCsrfCookieName());

  const missing = await callRegister({ headers: { Cookie: cookiesFor(sessionA, csrfCookieA) } });
  const invalid = await callRegister({
    headers: { Cookie: cookiesFor(sessionA, csrfCookieA), 'X-CSRF-Token': 'invalid-token' },
  });
  const crossSession = await callRegister({
    headers: { Cookie: cookiesFor(sessionA, csrfCookieB), 'X-CSRF-Token': csrfB },
  });
  const otherSignature = await callRegister({
    headers: { Cookie: cookiesFor(sessionA, csrfCookieA), 'X-CSRF-Token': csrfA },
  });

  for (const response of [missing, invalid, crossSession]) assert.equal(response.status, 403);
  assert.equal(otherSignature.status, 201);
  assert.equal(registrationCreates, 2);
});

test('expired CSRF tokens and expired JWT sessions are rejected', async () => {
  const session = signedToken(adminOne._id);
  const nonce = crypto.randomBytes(32).toString('base64url');
  const expiresAt = Math.floor(Date.now() / 1000) - 1;
  const signature = crypto.createHmac('sha256', process.env.JWT_SECRET)
    .update(`shs-csrf-session-v1:${session}:${nonce}:${expiresAt}`)
    .digest('base64url');
  const expiredCsrfToken = `${nonce}.${expiresAt}.${signature}`;
  const expiredCsrf = await callRegister({
    headers: {
      Cookie: cookiesFor(session, `shs_csrf_nonce=${expiredCsrfToken}`),
      'X-CSRF-Token': expiredCsrfToken,
    },
  });
  assert.equal(expiredCsrf.status, 403);

  const refreshed = await fetch(`${baseUrl}/api/v1/auth/csrf`, {
    headers: { Cookie: cookiesFor(session, `shs_csrf_nonce=${expiredCsrfToken}`) },
  });
  assert.equal(refreshed.status, 200);
  const refreshedToken = (await refreshed.json()).data.token;
  assert.notEqual(refreshedToken, expiredCsrfToken);
  const refreshedCookie = getCookieValue(refreshed, getCsrfCookieName());
  const retriedMutation = await callRegister({
    headers: {
      Cookie: cookiesFor(session, refreshedCookie),
      'X-CSRF-Token': refreshedToken,
    },
  });
  assert.equal(retriedMutation.status, 201);

  const expiredSession = jwt.sign({ id: adminOne._id }, process.env.JWT_SECRET, { expiresIn: -1 });
  const expiredAuth = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${expiredSession}` },
  });
  assert.equal(expiredAuth.status, 401);
});

test('protected registration rejects unauthenticated requests', async () => {
  const response = await callRegister();
  assert.equal(response.status, 401);
});

test('Admissions, Enquiries, and Faculty routes enforce authentication and roles', async () => {
  const validObjectId = '507f1f77bcf86cd799439011';
  const routes = [
    { method: 'GET', path: '/api/v1/admissions', allowed: ROLES.ADMISSIONS_OFFICER, denied: ROLES.CMS_EDITOR, status: 200 },
    { method: 'GET', path: '/api/v1/admissions/SHS-TEST-123', allowed: ROLES.ADMISSIONS_OFFICER, denied: ROLES.CMS_EDITOR, status: 200 },
    { method: 'PATCH', path: '/api/v1/admissions/SHS-TEST-123/status', body: { status: 'approved' }, allowed: ROLES.ADMISSIONS_OFFICER, denied: ROLES.CMS_EDITOR, status: 200 },
    { method: 'DELETE', path: '/api/v1/admissions/SHS-TEST-123', allowed: ROLES.ADMISSIONS_OFFICER, denied: ROLES.CMS_EDITOR, status: 200 },
    { method: 'GET', path: '/api/v1/enquiries', allowed: ROLES.ADMISSIONS_OFFICER, denied: ROLES.CMS_EDITOR, status: 200 },
    { method: 'PATCH', path: `/api/v1/enquiries/${validObjectId}/status`, body: { status: 'resolved' }, allowed: ROLES.ADMISSIONS_OFFICER, denied: ROLES.CMS_EDITOR, status: 200 },
    { method: 'DELETE', path: `/api/v1/enquiries/${validObjectId}`, allowed: ROLES.ADMISSIONS_OFFICER, denied: ROLES.CMS_EDITOR, status: 200 },
    { method: 'POST', path: '/api/v1/faculty', body: { faculty_name: 'Test Faculty' }, allowed: ROLES.CMS_EDITOR, denied: ROLES.ADMISSIONS_OFFICER, status: 201 },
    { method: 'PUT', path: `/api/v1/faculty/${validObjectId}`, body: { faculty_name: 'Updated Faculty' }, allowed: ROLES.CMS_EDITOR, denied: ROLES.ADMISSIONS_OFFICER, status: 200 },
    { method: 'DELETE', path: `/api/v1/faculty/${validObjectId}`, allowed: ROLES.CMS_EDITOR, denied: ROLES.ADMISSIONS_OFFICER, status: 200 },
  ];

  const send = async (route, id) => fetch(`${baseUrl}${route.path}`, {
    method: route.method,
    headers: {
      ...(route.body ? { 'Content-Type': 'application/json' } : {}),
      ...(id ? { Authorization: `Bearer ${signedToken(id)}` } : {}),
    },
    ...(route.body ? { body: JSON.stringify(route.body) } : {}),
  });

  for (const route of routes) {
    assert.equal((await send(route)).status, 401, `${route.method} ${route.path} without authentication`);
    const deniedId = route.denied === ROLES.ADMISSIONS_OFFICER ? admissionsOfficer._id : cmsEditor._id;
    assert.equal((await send(route, deniedId)).status, 403, `${route.method} ${route.path} with insufficient role`);
    const allowedId = route.allowed === ROLES.ADMISSIONS_OFFICER ? admissionsOfficer._id : cmsEditor._id;
    assert.equal((await send(route, allowedId)).status, route.status, `${route.method} ${route.path} with allowed role`);
  }
});

test('public faculty GET and public admission/enquiry POST routes remain accessible', async () => {
  const faculty = await fetch(`${baseUrl}/api/v1/faculty`);
  assert.equal(faculty.status, 200);
  const facultyById = await fetch(`${baseUrl}/api/v1/faculty/507f1f77bcf86cd799439011`);
  assert.equal(facultyById.status, 200);
});

test('Bearer-only registration works without a CSRF token', async () => {
  const response = await callRegister({ headers: { Authorization: `Bearer ${signedToken(adminOne._id)}` } });
  assert.equal(response.status, 201);
  assert.equal(registrationCreates, 4);

  const csrfStatus = await fetch(`${baseUrl}/api/v1/auth/csrf`, {
    headers: { Authorization: `Bearer ${signedToken(adminOne._id)}` },
  });
  assert.deepEqual((await csrfStatus.json()).data, { required: false, token: null });
});

test('production CSRF cookie uses secure host-only cross-site settings', () => {
  const originalNodeEnv = process.env.NODE_ENV;
  process.env.NODE_ENV = 'production';
  let cookie;
  try {
    setCsrfCookie({ cookie: (...args) => { cookie = args; } }, signedToken(adminOne._id));
  } finally {
    process.env.NODE_ENV = originalNodeEnv;
  }
  assert.equal(cookie[0], '__Host-shs_csrf_nonce');
  assert.equal(cookie[2].httpOnly, true);
  assert.equal(cookie[2].secure, true);
  assert.equal(cookie[2].sameSite, 'none');
  assert.equal(cookie[2].path, '/');
  assert.equal('domain' in cookie[2], false);
});

test('CORS continues to allow the configured admin origin and reject an unapproved origin', async () => {
  const preflight = await fetch(`${baseUrl}/api/v1/auth/csrf`, {
    method: 'OPTIONS',
    headers: {
      Origin: 'https://admin-shs.pages.dev',
      'Access-Control-Request-Method': 'POST',
      'Access-Control-Request-Headers': 'content-type,x-csrf-token',
    },
  });
  assert.equal(preflight.status, 204);
  assert.equal(preflight.headers.get('access-control-allow-origin'), 'https://admin-shs.pages.dev');
  assert.match(preflight.headers.get('access-control-allow-headers') || '', /x-csrf-token/i);

  const rejected = await fetch(`${baseUrl}/api/v1/auth/csrf`, {
    headers: { Origin: 'https://unapproved.example.test' },
  });
  assert.equal(rejected.status, 403);
});

test('logout and password change require cookie CSRF tokens and preserve Bearer compatibility', async () => {
  const session = signedToken(adminOne._id);
  const csrfResponse = await fetch(`${baseUrl}/api/v1/auth/csrf`, { headers: { Cookie: `accessToken=${session}` } });
  const csrfToken = (await csrfResponse.json()).data.token;
  const csrfCookie = getCookieValue(csrfResponse, getCsrfCookieName());
  const cookie = cookiesFor(session, csrfCookie);

  const blockedLogout = await fetch(`${baseUrl}/api/v1/auth/logout`, {
    method: 'POST', headers: { Cookie: cookie },
  });
  assert.equal(blockedLogout.status, 403);

  const changed = await fetch(`${baseUrl}/api/v1/auth/change-password`, {
    method: 'PUT',
    headers: { Cookie: cookie, 'X-CSRF-Token': csrfToken, 'Content-Type': 'application/json' },
    body: JSON.stringify({ currentPassword: 'CurrentPassword123!', newPassword: 'NewPassword123!' }),
  });
  assert.equal(changed.status, 200);

  const logout = await fetch(`${baseUrl}/api/v1/auth/logout`, {
    method: 'POST', headers: { Cookie: cookie, 'X-CSRF-Token': csrfToken },
  });
  assert.equal(logout.status, 200);
  const clearedCookies = logout.headers.getSetCookie?.() || [logout.headers.get('set-cookie') || ''];
  assert.ok(clearedCookies.some((value) => value.startsWith(`${getCsrfCookieName()}=`) && /Expires=Thu, 01 Jan 1970/i.test(value)));
  assert.ok(clearedCookies.some((value) => value.startsWith('accessToken=') && /Expires=Thu, 01 Jan 1970/i.test(value)));
  assert.ok(clearedCookies.some((value) => value.startsWith('shs_admin_token=') && /Expires=Thu, 01 Jan 1970/i.test(value)));

  const bearerLogout = await fetch(`${baseUrl}/api/v1/auth/logout`, {
    method: 'POST', headers: { Authorization: `Bearer ${signedToken(adminOne._id)}` },
  });
  assert.equal(bearerLogout.status, 200);
});

test('public enquiry and admission submissions remain available without CSRF tokens', async () => {
  const enquiry = await fetch(`${baseUrl}/api/v1/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      parent_name: 'Test Parent', email: 'parent@example.test', phone: '9876543210',
      category: 'General information', message: 'Test submission',
    }),
  });
  assert.equal(enquiry.status, 201);
  assert.equal(enquiryCreates, 1);

  const originalMkdir = fs.promises.mkdir;
  fs.promises.mkdir = async (...args) => {
    if (String(args[0]).includes('private_uploads')) return undefined;
    return originalMkdir(...args);
  };
  try {
    const admission = await fetch(`${baseUrl}/api/v1/admissions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        student_name: 'Test Student', dob: '2015-02-28', gender: 'Female',
        grade_applying: 'Class 5', parent_name: 'Test Parent',
        parent_email: 'parent@example.test', parent_phone: '9876543210',
        address: '12 Example Street', city: 'Mumbai', pincode: '400001',
      }),
    });
    assert.equal(admission.status, 201);
    assert.equal(admissionCreates, 1);
  } finally {
    fs.promises.mkdir = originalMkdir;
  }
});

test('login response structure and Bearer-authenticated profile remain compatible', async () => {
  const loginUser = {
    _id: crypto.randomUUID(),
    email: 'admin@example.test',
    role: ROLES.SUPER_ADMIN,
    is_active: true,
    last_login_at: null,
    save: async () => {},
    isPasswordCorrect: async (value) => value === 'ValidPassword123!',
    generateToken() { return signedToken(this._id); },
    toObject() { return { _id: this._id, email: this.email, role: this.role, password_hash: 'not-returned' }; },
  };
  AdminUser.findOne = async () => loginUser;

  const login = await fetch(`${baseUrl}/api/v1/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@example.test', password: 'ValidPassword123!' }),
  });
  assert.equal(login.status, 200);
  const loginBody = await login.json();
  assert.ok(loginBody.data.user);
  assert.equal(typeof loginBody.data.token, 'string');
  assert.equal('password_hash' in loginBody.data.user, false);
  assert.ok((login.headers.getSetCookie?.() || [login.headers.get('set-cookie') || '']).some((value) => value.startsWith('accessToken=')));
  assert.ok((login.headers.getSetCookie?.() || [login.headers.get('set-cookie') || '']).some((value) => value.startsWith(`${getCsrfCookieName()}=`)));

  const profile = await fetch(`${baseUrl}/api/v1/auth/me`, {
    headers: { Authorization: `Bearer ${loginBody.data.token}` },
  });
  assert.equal(profile.status, 200);
});
