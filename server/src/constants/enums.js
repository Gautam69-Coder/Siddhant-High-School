const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN",
  ADMISSIONS_OFFICER: "ADMISSIONS_OFFICER",
  CMS_EDITOR: "CMS_EDITOR",
};

const AUDIT_ACTIONS = {
  STATUS_CHANGE: "STATUS_CHANGE",
  DOCUMENT_VERIFY: "DOCUMENT_VERIFY",
  CMS_PUBLISH: "CMS_PUBLISH",
  CMS_DELETE: "CMS_DELETE",
  MEDIA_UPLOAD: "MEDIA_UPLOAD",
  MEDIA_DELETE: "MEDIA_DELETE",
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

const GALLERY_CATEGORIES = [
  "Campus",
  "Robotics & STEM",
  "STEM",
  "Sports",
  "Cultural",
  "Arts",
  "Academics",
  "Events",
  "Student Activities",
  "Cultural Activities",
  "Innovation",
];

const FACULTY_DEPARTMENTS = ["Leadership", "Robotics", "Academics", "Sports"];

const WINGS = ["Primary", "Middle", "Senior"];

const PILLAR_NAMES = ["Robotics & AI", "Academic Mastery", "Sports"];

const CLASS_AGE_CRITERIA = {
  "Nursery": { minAge: 3, maxAge: 5 },
  "Junior KG": { minAge: 4, maxAge: 6 },
  "Senior KG": { minAge: 5, maxAge: 7 },
  "Class 1": { minAge: 6, maxAge: 8 },
  "Class 2": { minAge: 7, maxAge: 9 },
  "Class 3": { minAge: 8, maxAge: 10 },
  "Class 4": { minAge: 9, maxAge: 11 },
  "Class 5": { minAge: 10, maxAge: 12 },
  "Class 6": { minAge: 11, maxAge: 13 },
  "Class 7": { minAge: 12, maxAge: 14 },
  "Class 8": { minAge: 13, maxAge: 15 },
  "Class 9": { minAge: 14, maxAge: 16 },
  "Class 10": { minAge: 15, maxAge: 18 },
};

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
  CLASS_AGE_CRITERIA,
};