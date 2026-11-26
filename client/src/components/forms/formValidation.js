import { CLASS_AGE_CRITERIA } from "../../data/admission";

export function getLocalDateInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

export function getAgeOnDate(dateValue, referenceDate = getLocalDateInputValue()) {
  const parseDate = (value) => {
    const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value || "");
    if (!match) return null;
    const [, year, month, day] = match.map(Number);
    const parsed = new Date(Date.UTC(year, month - 1, day));
    if (parsed.getUTCFullYear() !== year || parsed.getUTCMonth() !== month - 1 || parsed.getUTCDate() !== day) return null;
    return { year, month, day };
  };
  const birth = parseDate(dateValue);
  const today = parseDate(referenceDate);
  if (!birth || !today) return null;
  if (dateValue > referenceDate) return null;
  return today.year - birth.year - (
    today.month < birth.month || (today.month === birth.month && today.day < birth.day) ? 1 : 0
  );
}

export const getFieldError = (field) => {
  const { name, validity, type, files } = field;
  const requiredMessages = {
    studentName: "Student full name is required.",
    dateOfBirth: "Date of birth is required.",
    gender: "Please select a gender.",
    class: "Please select a class.",
    parentName: "Parent/Guardian Name is required.",
    relationship: "Please select a relationship.",
    phone: "Mobile Number is required.",
    contactNumber: "Mobile Number is required.",
    email: "Email Address is required.",
    address: "Residential Address is required.",
    city: "City is required.",
    state: "State is required.",
    postalCode: "Postal code is required.",
    studentPhoto: "Student photograph is required.",
    birthCertificate: "Birth certificate is required.",
    enquiryCategory: "Please select an enquiry category.",
  };
  if (type === "file" && files?.length) {
    const file = files[0];
    const allowed = {
      studentPhoto: ["jpg", "jpeg", "png"],
      birthCertificate: ["jpg", "jpeg", "png", "pdf"],
      schoolReport: ["jpg", "jpeg", "png", "pdf"],
    }[name];
    const extension = file.name.split(".").pop()?.toLowerCase();
    const acceptedMimeTypes = {
      jpg: ["image/jpeg", "image/jpg"],
      jpeg: ["image/jpeg", "image/jpg"],
      png: ["image/png"],
      pdf: ["application/pdf"],
    };
    const validType = allowed?.includes(extension)
      && (!file.type || acceptedMimeTypes[extension]?.includes(file.type));
    if (!validType) {
      if (name === "studentPhoto") return "Student photograph must be a JPG or PNG file.";
      if (name === "birthCertificate") return "Birth certificate must be a PDF, JPG or PNG file.";
      return "Previous school report must be a PDF, JPG or PNG file.";
    }
    if (file.size > 5 * 1024 * 1024) return "File must be 5 MB or smaller.";
    return "";
  }
  if (!field.required && typeof field.value === "string" && !field.value.trim()) return "";
  if (field.required && typeof field.value === "string" && !field.value.trim()) {
    return requiredMessages[name] || "This field is required.";
  }
  if (["studentName", "parentName"].includes(name) && field.value.trim()) {
    const namePattern = /^[\p{L}\p{M}]+(?:[ .'\u2019-]+[\p{L}\p{M}]+)*\.?$/u;
    if (!namePattern.test(field.value.trim())) return "Enter a name using letters, spaces, apostrophes or hyphens.";
  }
  if (name === "address" && field.value.replace(/\s/g, "").length < 10) {
    return "Enter a complete address with at least 10 non-space characters.";
  }
  if (["phone", "contactNumber"].includes(name) && field.value && !/^\d{10}$/.test(field.value)) {
    return "Enter exactly 10 digits.";
  }
  if (name === "dateOfBirth" && field.value) {
    if (field.value > getLocalDateInputValue()) {
      return "Date of birth cannot be in the future.";
    }
    const age = getAgeOnDate(field.value);
    if (age === null) {
      return "Enter a valid date of birth.";
    }
    if (age < 3) {
      return "Student must be at least 3 years old for school admission.";
    }
    if (age > 18) {
      return "Student must be 18 years or younger for school admission.";
    }
    const selectedClass = field.form?.elements?.class?.value;
    if (selectedClass && CLASS_AGE_CRITERIA[selectedClass]) {
      const criteria = CLASS_AGE_CRITERIA[selectedClass];
      if (age < criteria.minAge) {
        return `Student must be at least ${criteria.minAge} years old for ${selectedClass} (current age: ${age} years).`;
      }
      if (age > criteria.maxAge) {
        return `Student exceeds maximum age of ${criteria.maxAge} years for ${selectedClass} (current age: ${age} years).`;
      }
    }
  }
  if (name === "class" && field.value) {
    const dobValue = field.form?.elements?.dateOfBirth?.value;
    if (dobValue && dobValue <= getLocalDateInputValue()) {
      const age = getAgeOnDate(dobValue);
      const criteria = CLASS_AGE_CRITERIA[field.value];
      if (criteria && age !== null) {
        if (age < criteria.minAge) {
          return `Student must be at least ${criteria.minAge} years old for ${field.value} (current age: ${age} years).`;
        }
        if (age > criteria.maxAge) {
          return `Student exceeds maximum age of ${criteria.maxAge} years for ${field.value} (current age: ${age} years).`;
        }
      }
    }
  }
  if (validity.valueMissing) {
    if (type === "checkbox") return "Please confirm this before submitting.";
    return requiredMessages[name] || "This field is required.";
  }
  if (validity.typeMismatch && type === "email") return "Enter a valid email address.";
  if (validity.patternMismatch) {
    if (name === "postalCode") return "Enter a valid 6-digit PIN code.";
    return "Use the requested format.";
  }
  if (validity.tooShort) return `Enter at least ${field.minLength} characters.`;
  if (validity.tooLong) return `Enter no more than ${field.maxLength} characters.`;
  if (validity.badInput) return "Enter a valid value.";
  return "";
};

export function sanitizePhoneInput(event) {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
}

export const getFormErrors = (form) => Object.fromEntries(
  Array.from(form.elements)
    .filter((field) => field.name && field.willValidate)
    .map((field) => [field.name, getFieldError(field)])
    .filter(([, error]) => error),
);

export function fieldAccessibility(name, errors, touched) {
  const hasError = Boolean(touched[name] && errors[name]);
  return {
    "aria-invalid": hasError,
    "aria-describedby": hasError ? `${name}-error` : undefined,
  };
}
