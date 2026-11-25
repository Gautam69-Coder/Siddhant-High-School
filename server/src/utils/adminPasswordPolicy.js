const MIN_PASSWORD_CHARACTERS = 12;
const MAX_BCRYPT_PASSWORD_BYTES = 72;

const getPasswordCharacterCount = (password) => Array.from(password).length;
const getPasswordByteCount = (password) => Buffer.byteLength(password, "utf8");
const isValidAdminPassword = (password) =>
  typeof password === "string" &&
  getPasswordCharacterCount(password) >= MIN_PASSWORD_CHARACTERS &&
  getPasswordByteCount(password) <= MAX_BCRYPT_PASSWORD_BYTES;

module.exports = {
  MAX_BCRYPT_PASSWORD_BYTES,
  MIN_PASSWORD_CHARACTERS,
  getPasswordByteCount,
  getPasswordCharacterCount,
  isValidAdminPassword,
};
