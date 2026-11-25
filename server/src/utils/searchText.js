const MAX_SEARCH_LENGTH = 100;

const escapeRegexLiteral = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

const getSearchTerm = (value) => {
  if (value === undefined) return "";
  if (typeof value !== "string") return null;
  const term = value.trim();
  if (term.length > MAX_SEARCH_LENGTH) return null;
  return term;
};

const parsePositiveInteger = (value) => {
  if (typeof value === "number") {
    return Number.isSafeInteger(value) && value > 0 ? value : null;
  }
  if (typeof value !== "string" || !/^[1-9]\d*$/.test(value)) return null;
  const parsed = Number(value);
  return Number.isSafeInteger(parsed) ? parsed : null;
};

module.exports = { MAX_SEARCH_LENGTH, escapeRegexLiteral, getSearchTerm, parsePositiveInteger };
