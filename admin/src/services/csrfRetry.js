export const CSRF_RETRY_FLAG = '_csrfRetry';
const CSRF_FAILURE_MESSAGE = 'CSRF token missing or invalid';
const STATE_CHANGING_METHODS = new Set(['post', 'put', 'patch', 'delete']);

export const retryCsrfRequestOnce = ({ api, error, clearToken }) => {
  const config = error?.config;
  const method = (config?.method || 'get').toLowerCase();
  const isCsrfFailure =
    error?.response?.status === 403 &&
    error.response.data?.message === CSRF_FAILURE_MESSAGE;

  if (
    !isCsrfFailure ||
    !config ||
    config[CSRF_RETRY_FLAG] ||
    !STATE_CHANGING_METHODS.has(method)
  ) {
    return null;
  }

  clearToken();
  return api.request({ ...config, [CSRF_RETRY_FLAG]: true });
};
