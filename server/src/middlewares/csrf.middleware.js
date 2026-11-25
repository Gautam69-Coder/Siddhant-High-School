const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const ApiError = require("../utils/apiError");

const CSRF_TOKEN_TTL_SECONDS = 15 * 60;

const isProduction = () => process.env.NODE_ENV === "production";
const getCsrfCookieName = () =>
  isProduction() ? "__Host-shs_csrf_nonce" : "shs_csrf_nonce";

const getCsrfCookieOptions = () => ({
  httpOnly: true,
  secure: isProduction(),
  sameSite: isProduction() ? "none" : "lax",
  path: "/",
  maxAge: 7 * 24 * 60 * 60 * 1000,
});

const signNonce = (sessionToken, nonce, expiresAt) =>
  crypto
    .createHmac("sha256", process.env.JWT_SECRET)
    .update(`shs-csrf-session-v1:${sessionToken}:${nonce}:${expiresAt}`)
    .digest("base64url");

const getSessionExpiration = (sessionToken) => jwt.decode(sessionToken)?.exp;

const createCsrfToken = (sessionToken, sessionExpiresAt = getSessionExpiration(sessionToken)) => {
  const now = Math.floor(Date.now() / 1000);
  const expiresAt = Number.isFinite(sessionExpiresAt)
    ? Math.min(now + CSRF_TOKEN_TTL_SECONDS, sessionExpiresAt)
    : now + CSRF_TOKEN_TTL_SECONDS;
  if (expiresAt <= now) {
    throw new ApiError(401, "Unauthorized request: Invalid or expired session");
  }

  const nonce = crypto.randomBytes(32).toString("base64url");
  return `${nonce}.${expiresAt}.${signNonce(sessionToken, nonce, expiresAt)}`;
};

const isValidCsrfToken = (sessionToken, token, sessionExpiresAt = getSessionExpiration(sessionToken)) => {
  if (typeof token !== "string") return false;
  const [nonce, expirationValue, signature, ...extra] = token.split(".");
  if (!nonce || !expirationValue || !signature || extra.length) return false;
  if (!/^\d+$/.test(expirationValue)) return false;
  const expiresAt = Number(expirationValue);
  const now = Math.floor(Date.now() / 1000);
  if (!Number.isSafeInteger(expiresAt) || expiresAt <= now) return false;
  if (Number.isFinite(sessionExpiresAt) && expiresAt > sessionExpiresAt) return false;

  const expected = signNonce(sessionToken, nonce, expiresAt);
  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);
  return (
    receivedBuffer.length === expectedBuffer.length &&
    crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  );
};

const tokensMatch = (left, right) => {
  if (typeof left !== "string" || typeof right !== "string") return false;
  const leftBuffer = Buffer.from(left);
  const rightBuffer = Buffer.from(right);
  return (
    leftBuffer.length === rightBuffer.length &&
    crypto.timingSafeEqual(leftBuffer, rightBuffer)
  );
};

const setCsrfCookie = (res, sessionToken, sessionExpiresAt = getSessionExpiration(sessionToken)) => {
  const token = createCsrfToken(sessionToken, sessionExpiresAt);
  const expiresAt = Number(token.split(".")[1]);
  const maxAge = Math.max(0, expiresAt - Math.floor(Date.now() / 1000)) * 1000;
  res.cookie(getCsrfCookieName(), token, { ...getCsrfCookieOptions(), maxAge });
  return token;
};

const clearCsrfCookie = (res) => {
  const clearOptions = getCsrfCookieOptions();
  delete clearOptions.maxAge;
  return res.clearCookie(getCsrfCookieName(), clearOptions);
};

const getCsrfToken = (req, res, next) => {
  res.set("Cache-Control", "no-store");

  if (req.authMethod !== "cookie") {
    return res.status(200).json({
      success: true,
      data: { required: false, token: null },
      message: "CSRF token not required for Bearer authentication",
    });
  }

  let token = req.cookies?.[getCsrfCookieName()];
  if (!isValidCsrfToken(req.authToken, token, req.authExpiresAt)) {
    token = setCsrfCookie(res, req.authToken, req.authExpiresAt);
  }

  return res.status(200).json({
    success: true,
    data: { required: true, token },
    message: "CSRF token retrieved successfully",
  });
};

const requireCsrfToken = (req, res, next) => {
  // Bearer credentials are explicitly supplied by the caller and are not ambient cookies.
  if (req.authMethod !== "cookie") return next();

  const cookieToken = req.cookies?.[getCsrfCookieName()];
  const headerToken = req.get("X-CSRF-Token");
  if (
    !isValidCsrfToken(req.authToken, cookieToken, req.authExpiresAt) ||
    !isValidCsrfToken(req.authToken, headerToken, req.authExpiresAt) ||
    !tokensMatch(cookieToken, headerToken)
  ) {
    return next(new ApiError(403, "CSRF token missing or invalid"));
  }

  return next();
};

module.exports = {
  clearCsrfCookie,
  getCsrfCookieName,
  getCsrfToken,
  requireCsrfToken,
  setCsrfCookie,
};
