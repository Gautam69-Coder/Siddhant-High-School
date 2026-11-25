import assert from 'node:assert/strict';
import { test } from 'node:test';
import { CSRF_RETRY_FLAG, retryCsrfRequestOnce } from '../src/services/csrfRetry.js';

test('retries a CSRF-specific state-changing request once after clearing the cached token', async () => {
  let clearCount = 0;
  let requestCount = 0;
  let retryConfig;
  const api = {
    request: async (config) => {
      requestCount += 1;
      retryConfig = config;
      return { retried: true };
    },
  };
  const error = {
    config: { method: 'patch', url: '/news-announcements/123' },
    response: { status: 403, data: { message: 'CSRF token missing or invalid' } },
  };

  const result = await retryCsrfRequestOnce({ api, error, clearToken: () => { clearCount += 1; } });
  assert.deepEqual(result, { retried: true });
  assert.equal(clearCount, 1);
  assert.equal(requestCount, 1);
  assert.equal(retryConfig[CSRF_RETRY_FLAG], true);

  const secondFailure = { ...error, config: retryConfig };
  assert.equal(retryCsrfRequestOnce({ api, error: secondFailure, clearToken: () => { clearCount += 1; } }), null);
  assert.equal(clearCount, 1);
  assert.equal(requestCount, 1);
});

test('does not retry unrelated forbidden responses or safe requests', () => {
  const api = { request: () => { throw new Error('must not retry'); } };
  const clearToken = () => { throw new Error('must not clear'); };
  const genericForbidden = {
    config: { method: 'post' },
    response: { status: 403, data: { message: 'Role is not authorized' } },
  };
  const safeRequest = {
    config: { method: 'get' },
    response: { status: 403, data: { message: 'CSRF token missing or invalid' } },
  };

  assert.equal(retryCsrfRequestOnce({ api, error: genericForbidden, clearToken }), null);
  assert.equal(retryCsrfRequestOnce({ api, error: safeRequest, clearToken }), null);
});
