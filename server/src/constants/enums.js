const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMISSIONS_OFFICER: "ADMISSIONS_OFFICER",
  CMS_EDITOR: "CMS_EDITOR",
};

const AUDIT_ACTIONS = {
  STATUS_CHANGE: "STATUS_CHANGE",
  DOCUMENT_VERIFY: "DOCUMENT_VERIFY",
  CMS_PUBLISH: "CMS_PUBLISH",
};

const ADMISSION_STATUS = {
  PENDING: "pending",
  UNDER_REVIEW: "under_review",
  APPROVED: "approved",
  REJECTED: "rejected",
};

const GENDERS = ["Male", "Female", "Non-Binary", "Prefer not to say"];

const ENQUIRY_CATEGORIES = [
  "Admission process",
  "School visit",
  "Academics",
  "Facilities",
  "General information",
];

const ENQUIRY_STATUS = {
  PENDING: "pending",
  IN_PROGRESS: "in_progress",
  RESOLVED: "resolved",
};

const NEWS_CATEGORIES = ["Official", "Innovation", "Academic", "Cultural", "Sports"];

const NEWS_STATUS = {
  DRAFT: "draft",
  PUBLISHED: "published",
  ARCHIVED: "archived",
};

const EVENT_CATEGORIES = ["Academic", "Robotics & STEM", "Cultural", "Sports"];

const MEDIA_TYPES = ["image", "video"];

const GALLERY_CATEGORIES = ["Campus", "Robotics & STEM", "Sports", "Cultural"];

const FACULTY_DEPARTMENTS = ["Leadership", "Robotics", "Academics", "Sports"];

const WINGS = ["Primary", "Middle", "Senior"];

const PILLAR_NAMES = ["Robotics & AI", "Academic Mastery", "Sports"];

module.exports = {
  ROLES,
  AUDIT_ACTIONS,
  ADMISSION_STATUS,
  GENDERS,
  ENQUIRY_CATEGORIES,
  ENQUIRY_STATUS,
  NEWS_CATEGORIES,
  NEWS_STATUS,
  EVENT_CATEGORIES,
  MEDIA_TYPES,
  GALLERY_CATEGORIES,
  FACULTY_DEPARTMENTS,
  WINGS,
  PILLAR_NAMES,
};