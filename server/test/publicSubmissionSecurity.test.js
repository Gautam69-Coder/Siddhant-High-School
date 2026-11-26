const { after, before, test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../src/app');

let server;
let baseUrl;

before(async () => {
  server = app.listen(0);
  await new Promise((resolve) => server.once('listening', resolve));
  baseUrl = `http://127.0.0.1:${server.address().port}`;
});

after(async () => {
  if (server) await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

test('public submission limits use the connection IP and cannot be bypassed with forwarded headers', async () => {
  assert.equal(app.get('trust proxy'), false);

  for (let index = 0; index < 10; index += 1) {
    const response = await fetch(`${baseUrl}/api/v1/admissions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': `198.51.100.${index + 1}`,
      },
      body: JSON.stringify({}),
    });
    assert.equal(response.status, 400, `admission request ${index + 1} should reach validation`);
  }
  const limitedAdmission = await fetch(`${baseUrl}/api/v1/admissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.99' },
    body: JSON.stringify({}),
  });
  assert.equal(limitedAdmission.status, 429);
  assert.equal(limitedAdmission.headers.get('ratelimit-limit'), '10');

  for (let index = 0; index < 20; index += 1) {
    const response = await fetch(`${baseUrl}/api/v1/enquiries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Forwarded-For': `192.0.2.${index + 1}`,
      },
      body: JSON.stringify({}),
    });
    assert.equal(response.status, 400, `enquiry request ${index + 1} should reach validation`);
  }
  const limitedEnquiry = await fetch(`${baseUrl}/api/v1/enquiries`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Forwarded-For': '203.0.113.99' },
    body: JSON.stringify({}),
  });
  assert.equal(limitedEnquiry.status, 429);
  assert.equal(limitedEnquiry.headers.get('ratelimit-limit'), '20');
});
