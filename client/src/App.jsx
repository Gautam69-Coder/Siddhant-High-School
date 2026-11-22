import { createContext, useContext, useEffect, useRef, useState } from "react";
import logo from "./assets/siddhant-school-logo.jpg";
import homepageSchoolBuilding from "./assets/homepage-school-building.jpeg";
import newsClassroom from "./assets/news-classroom.jpeg";
import academicsClassroom from "./assets/academics-curriculum-classroom.jpeg";
import facultyGroup from "./assets/faculty-group.jpeg";
import homepageLearning from "./assets/homepage-learning-with-purpose.jpeg";
import homepageAchievement from "./assets/homepage-student-achievements.jpeg";
import homepageSportsCultural from "./assets/homepage-sports-cultural.jpeg";
import facilityArts from "./assets/infrastructure-arts-creative-spaces.jpeg";
import facilityLibrary from "./assets/infrastructure-library-reading.jpeg";
import facilitySports from "./assets/infrastructure-sports-recreation.jpeg";
import campusLearningSpaces from "./assets/campus-learning-spaces.jpeg";
import communityMoments from "./assets/community-moments.jpeg";
import principalMessage from "./assets/principal-office.jpeg";
import roboticsInnovation from "./assets/robotics-innovation-hero.jpeg";
import sportsCulturalDance from "./assets/sports-cultural-dance.jpeg";
import studentClubs from "./assets/student-activities-clubs.jpeg";
import studentCommunity from "./assets/student-activities-community-events.jpeg";
import studentLeadership from "./assets/student-activities-leadership.jpeg";
import studentPerformingArts from "./assets/student-activities-performing-arts.jpeg";
import studentSportsFitness from "./assets/student-activities-sports-fitness.jpeg";
import NewsTicker from "./components/NewsTicker";
import admissionService from "./services/admissionService";
import enquiryService from "./services/enquiryService";
import calendarEventService from "./services/calendarEventService";
import newsService from "./services/newsService";
import galleryService from "./services/galleryService";

const images = {
  hero: homepageSchoolBuilding,
  learningWithPurpose: homepageLearning,
  homepageAchievement,
  homepageSportsCultural,
  campusLearningSpaces,
  communityMoments,
  academicsClassroom,
  facultyGroup,
  facilityArts,
  facilityLibrary,
  facilitySports,
  principalMessage,
  roboticsInnovation,
  sportsCulturalDance,
  studentClubs,
  studentCommunity,
  studentLeadership,
  studentPerformingArts,
  studentSportsFitness,
  classroom:
    "https://images.unsplash.com/photo-1709290749293-c6152a187b14?auto=format&fit=crop&w=1400&q=85",
  campus:
    "https://images.unsplash.com/photo-1764025851527-78f9d7c52bc5?auto=format&fit=crop&w=1600&q=85",
  architecture:
    "https://images.unsplash.com/photo-1787151892072-4f69130f7241?auto=format&fit=crop&w=1400&q=85",
  sports:
    "https://images.unsplash.com/photo-1769348193442-6d3b1655266d?auto=format&fit=crop&w=1400&q=85",
  culture:
    "https://images.unsplash.com/flagged/photo-1561476589-e1f20238b297?auto=format&fit=crop&w=1400&q=85",
  community:
    "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=1400&q=85",
  robotics:
    "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=1600&q=85",
  library:
    "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&w=1400&q=85",
  science:
    "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=1400&q=85",
  computing:
    "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1400&q=85",
  arts:
    "https://images.unsplash.com/photo-1513364776144-60967b0f800f?auto=format&fit=crop&w=1400&q=85",
  campusDetail:
    "https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=1400&q=85",
  sportsDetail:
    "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=1400&q=85",
  schoolEvent:
    "https://images.unsplash.com/photo-1528605248644-14dd04022da1?auto=format&fit=crop&w=1400&q=85",
  newsFeature: newsClassroom,
  educator:
    "https://images.unsplash.com/photo-1758685848142-06e158cf64bc?auto=format&fit=crop&w=1200&q=85",
  achievementTrophy:
    "https://images.pexels.com/photos/10435674/pexels-photo-10435674.jpeg?auto=compress&cs=tinysrgb&w=1200",
  achievementRecognition:
    "https://images.pexels.com/photos/31772913/pexels-photo-31772913/free-photo-of-students-receiving-awards-at-school-ceremony.jpeg?auto=compress&cs=tinysrgb&w=1200",
};

const learningPillars = [
  ["01", "book", "Strong Foundations", "Conceptual clarity, language development and numeracy are approached with patience and purpose."],
  ["02", "flask", "Scientific Inquiry", "Hands-on exploration encourages learners to ask better questions and test ideas thoughtfully."],
  ["03", "palette", "Creative Expression", "Art, performance and communication give each student room to discover their individual voice."],
  ["04", "globe", "Responsible Citizenship", "Values, awareness and collaboration prepare students to contribute with empathy and confidence."],
];
const sampleNews = [
  { id: "learning-community", date: "Sample · 12 August 2026", category: "General School Notices", title: "Discover what makes a school day meaningful", summary: "A look at the questions, creative work and connections that can shape a day of learning." },
  { id: "admission-enquiries", date: "Sample · 04 August 2026", category: "Admissions Notices", title: "Admission enquiries are welcome", summary: "Families may use the website demonstration form to explore the enquiry process. This sample is not an open-admissions notice." },
  { id: "academic-announcement", date: "Sample · 28 July 2026", category: "Academic Announcements", title: "A note on learning progress", summary: "An example of how a future verified academic update could be shared with families." },
  { id: "examination-notice", date: "Sample · 18 July 2026", category: "Examination Notices", title: "Assessment information", summary: "This sample illustrates where confirmed assessment guidance may appear; it gives no actual exam dates." },
  { id: "holiday-notice", date: "Sample · 10 July 2026", category: "Holiday Notices", title: "School calendar updates", summary: "Official holiday dates will be posted after the school confirms its calendar." },
  { id: "school-activities", date: "Sample · 02 July 2026", category: "School Activities", title: "Ideas for shared learning", summary: "A sample item about learning and participation across the school community." },
  { id: "event-announcement", date: "Sample · 24 June 2026", category: "Event Announcements", title: "Upcoming community gathering", summary: "An illustrative event announcement; no event is currently confirmed by this sample." },
];
const galleryItems = [
  [images.classroom, "Learning together", "Academics"],
  [images.campusDetail, "Campus learning environment", "Campus"],
  [images.sportsDetail, "Sport and teamwork", "Sports"],
  [images.arts, "Creative expression", "Cultural Activities"],
  [images.robotics, "Innovation in action", "Innovation"],
  [images.communityMoments, "Community moments", "Student Activities"],
  [images.library, "Reading and discovery", "Academics"],
  [images.science, "Scientific exploration", "Innovation"],
];

function Arrow({ className = "" }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14M14 7l5 5-5 5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function Icon({ name }) {
  const paths = {
    book: (
      <>
        <path d="M4 5.5c3-1 5.6-.4 8 1.5v12c-2.4-1.9-5-2.5-8-1.5v-12Z" />
        <path d="M20 5.5c-3-1-5.6-.4-8 1.5v12c2.4-1.9 5-2.5 8-1.5v-12Z" />
      </>
    ),
    flask: (
      <>
        <path d="M9 3h6M10 3v5l-5 9a2.7 2.7 0 0 0 2.4 4h9.2a2.7 2.7 0 0 0 2.4-4l-5-9V3" />
        <path d="M7.5 15h9" />
      </>
    ),
    palette: (
      <>
        <path d="M12 3a9 9 0 1 0 0 18h1.3a1.8 1.8 0 0 0 .5-3.5 1.8 1.8 0 0 1 .5-3.5H17a4 4 0 0 0 4-4c0-3.9-4-7-9-7Z" />
        <path d="M7.5 10h.01M10 6.8h.01M14 6.5h.01M17.2 9h.01" />
      </>
    ),
    globe: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.4 2.5 3.6 5.5 3.6 9S14.4 18.5 12 21M12 3C9.6 5.5 8.4 8.5 8.4 12S9.6 18.5 12 21" />
      </>
    ),
    light: (
      <>
        <path d="M9 18h6M10 21h4M8.5 14.5a6 6 0 1 1 7 0c-.9.7-1.5 1.8-1.5 2.5h-4c0-.7-.6-1.8-1.5-2.5Z" />
      </>
    ),
    trophy: (
      <>
        <path d="M8 4h8v4a4 4 0 0 1-8 0V4ZM12 12v5M8 21h8M9 17h6" />
        <path d="M8 6H4v1a4 4 0 0 0 4 4M16 6h4v1a4 4 0 0 1-4 4" />
      </>
    ),
  };
  return (
    <svg className="icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
      {paths[name]}
    </svg>
  );
}

function RepresentativeImage({ src, alt, className = "" }) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return (
      <div className={`image-fallback ${className}`} role="img" aria-label={`${alt} Image unavailable`}>
        <span>Representative image unavailable</span>
      </div>
    );
  }
  return (
    <img
      className={`representative-image ${className}`}
      src={src}
      alt={alt}
      loading="lazy"
      decoding="async"
      onError={() => setFailed(true)}
    />
  );
}

const pages = [
  ["Home", "/"],
  ["About Us", "/about"],
  ["Vision & Mission", "/vision-mission"],
  ["Principal's Message", "/principal-message"],
  ["Management & Faculty", "/management-faculty"],
  ["Academics & Curriculum", "/academics"],
  ["Infrastructure & Facilities", "/infrastructure"],
  ["Student Activities", "/student-activities"],
  ["Sports & Cultural Activities", "/sports-cultural"],
  ["Student Achievements", "/achievements"],
  ["Robotics & Innovation", "/robotics-innovation"],
  ["News & Announcements", "/news"],
  ["Events & Calendar", "/events"],
  ["Gallery", "/gallery"],
  ["Admissions", "/admissions"],
  ["Contact Us", "/contact"],
];

const footerExplorePages = pages.slice(0, 5);
const footerSchoolLifePages = [
  ["Academics & Curriculum", "/academics"],
  ["Infrastructure & Facilities", "/infrastructure"],
  ["Student Activities", "/student-activities"],
  ["Sports & Cultural Activities", "/sports-cultural"],
  ["Student Achievements", "/achievements"],
  ["Robotics & Innovation", "/robotics-innovation"],
  ["News & Announcements", "/news"],
  ["Events & Calendar", "/events"],
  ["Gallery", "/gallery"],
];

const knownRoutes = new Set(pages.map(([, path]) => path));
const NavigationContext = createContext(() => {});

function RouteLink({ to, onClick, children, ...props }) {
  const navigate = useContext(NavigationContext);
  return (
    <a
      href={to}
      {...props}
      onClick={(event) => {
        onClick?.(event);
        if (
          event.defaultPrevented ||
          event.button !== 0 ||
          event.metaKey ||
          event.ctrlKey ||
          event.shiftKey ||
          event.altKey ||
          props.target === "_blank"
        ) {
          return;
        }
        event.preventDefault();
        navigate(to);
      }}
    >
      {children}
    </a>
  );
}

function SuccessPanel({ title, message, resetLabel, onReset, note }) {
  return (
    <div className="form-success" role="status" aria-live="polite">
      <span className="success-mark">
        <svg viewBox="0 0 24 24" fill="none">
          <path d="m6 12 4 4 8-9" stroke="currentColor" strokeWidth="1.8" />
        </svg>
      </span>
      <p className="eyebrow">Submission received</p>
      <h3>{title}</h3>
      <p>{message}</p>
      {note && <p className="success-note">{note}</p>}
      <button className="button primary" type="button" onClick={onReset}>
        {resetLabel} <Arrow />
      </button>
    </div>
  );
}

function getLocalDateInputValue() {
  const now = new Date();
  const offset = now.getTimezoneOffset();
  return new Date(now.getTime() - offset * 60_000).toISOString().slice(0, 10);
}

function getAgeOnDate(dateValue, referenceDate = getLocalDateInputValue()) {
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

export const CLASS_AGE_CRITERIA = {
  "Nursery": { minAge: 3, maxAge: 5, label: "3 to 4 years" },
  "Junior KG": { minAge: 4, maxAge: 6, label: "4 to 5 years" },
  "Senior KG": { minAge: 5, maxAge: 7, label: "5 to 6 years" },
  "Class 1": { minAge: 6, maxAge: 8, label: "6 to 7 years" },
  "Class 2": { minAge: 7, maxAge: 9, label: "7 to 8 years" },
  "Class 3": { minAge: 8, maxAge: 10, label: "8 to 9 years" },
  "Class 4": { minAge: 9, maxAge: 11, label: "9 to 10 years" },
  "Class 5": { minAge: 10, maxAge: 12, label: "10 to 11 years" },
  "Class 6": { minAge: 11, maxAge: 13, label: "11 to 12 years" },
  "Class 7": { minAge: 12, maxAge: 14, label: "12 to 13 years" },
  "Class 8": { minAge: 13, maxAge: 15, label: "13 to 14 years" },
  "Class 9": { minAge: 14, maxAge: 16, label: "14 to 15 years" },
  "Class 10": { minAge: 15, maxAge: 18, label: "15 to 16 years" },
};

const getFieldError = (field) => {
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

function sanitizePhoneInput(event) {
  event.target.value = event.target.value.replace(/\D/g, "").slice(0, 10);
}

const getFormErrors = (form) => Object.fromEntries(
  Array.from(form.elements)
    .filter((field) => field.name && field.willValidate)
    .map((field) => [field.name, getFieldError(field)])
    .filter(([, error]) => error),
);

function FieldError({ name, errors, touched }) {
  const error = touched[name] && errors[name];
  return error ? (
    <span className="field-error" id={`${name}-error`} role="alert">
      {error}
    </span>
  ) : null;
}

function fieldAccessibility(name, errors, touched) {
  const hasError = Boolean(touched[name] && errors[name]);
  return {
    "aria-invalid": hasError,
    "aria-describedby": hasError ? `${name}-error` : undefined,
  };
}

function AdmissionForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formReady, setFormReady] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState({});
  const [studentPhotoFile, setStudentPhotoFile] = useState(null);
  const [studentPhotoPreview, setStudentPhotoPreview] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [applyingClass, setApplyingClass] = useState("");
  const [submittingState, setSubmittingState] = useState(false);
  const [serverError, setServerError] = useState("");
  const [applicationNumber, setApplicationNumber] = useState("");
  const submitting = useRef(false);

  useEffect(() => {
    if (!studentPhotoFile) {
      setStudentPhotoPreview("");
      return undefined;
    }
    const previewUrl = URL.createObjectURL(studentPhotoFile);
    setStudentPhotoPreview(previewUrl);
    return () => URL.revokeObjectURL(previewUrl);
  }, [studentPhotoFile]);

  const updateValidation = (form, fieldName, markTouched = false) => {
    const nextErrors = getFormErrors(form);
    setErrors(nextErrors);
    if (markTouched && fieldName) {
      setTouched((current) => {
        const next = { ...current, [fieldName]: true };
        if (
          (fieldName === "dateOfBirth" || fieldName === "class") &&
          form.elements.dateOfBirth?.value &&
          form.elements.class?.value
        ) {
          next.dateOfBirth = true;
          next.class = true;
        }
        return next;
      });
    }
    setFormReady(Object.keys(nextErrors).length === 0);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const nextErrors = getFormErrors(form);
    setErrors(nextErrors);
    setTouched(
      Object.fromEntries(
        Array.from(form.elements)
          .filter((field) => field.name)
          .map((field) => [field.name, true]),
      ),
    );
    setFormReady(Object.keys(nextErrors).length === 0);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = Array.from(form.elements).find((field) => nextErrors[field.name]);
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus({ preventScroll: true });
      }
      return;
    }
    submitting.current = true;
    setSubmittingState(true);
    setServerError("");

    const fd = new FormData();
    fd.append("student_name", form.elements.studentName.value.trim());
    fd.append("dob", form.elements.dateOfBirth.value);
    fd.append("gender", form.elements.gender.value);
    fd.append("grade_applying", form.elements.class.value);
    fd.append("previous_school", form.elements.currentSchool?.value?.trim() || "");
    fd.append("parent_name", form.elements.parentName.value.trim());
    fd.append("parent_email", form.elements.email.value.trim());
    fd.append("parent_phone", form.elements.phone.value.trim());
    fd.append("address", form.elements.address.value.trim());
    fd.append("city", form.elements.city.value.trim());
    fd.append("pincode", form.elements.postalCode.value.trim());

    if (form.elements.studentPhoto?.files?.[0]) {
      fd.append("student_photo", form.elements.studentPhoto.files[0]);
    }
    if (form.elements.birthCertificate?.files?.[0]) {
      fd.append("birth_certificate", form.elements.birthCertificate.files[0]);
    }
    if (form.elements.schoolReport?.files?.[0]) {
      fd.append("previous_school_report", form.elements.schoolReport.files[0]);
    }

    try {
      const response = await admissionService.submitAdmission(fd);
      const appNum =
        response?.data?.application_number ||
        response?.application_number ||
        "Application Registered";
      setApplicationNumber(appNum);
      setSubmitted(true);
    } catch (err) {
      setServerError(
        err.message ||
          "Failed to submit admission application. Please check your information and try again."
      );
    } finally {
      submitting.current = false;
      setSubmittingState(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setErrors({});
    setTouched({});
    setFormReady(false);
    setSelectedFiles({});
    setStudentPhotoFile(null);
    setDateOfBirth("");
    setApplyingClass("");
    setServerError("");
    setApplicationNumber("");
    submitting.current = false;
    setSubmittingState(false);
  };

  if (submitted) {
    return (
      <SuccessPanel
        title="Application submitted successfully!"
        message="Thank you for choosing Siddhant High School. Your admission application has been registered in the school admissions directorate."
        resetLabel="Submit Another Application"
        note={`Your Application Number is: ${applicationNumber}. Please save this for all future correspondence.`}
        onReset={resetForm}
      />
    );
  }

  return (
    <form
      className="admission-form premium-form"
      noValidate
      onSubmit={submit}
      onBlur={(event) => {
        if (event.target.name) updateValidation(event.currentTarget, event.target.name, true);
      }}
      onChange={(event) => {
        if (["phone", "contactNumber"].includes(event.target.name)) sanitizePhoneInput(event);
        if (event.target.name === "dateOfBirth") setDateOfBirth(event.target.value);
        if (event.target.name === "class") setApplyingClass(event.target.value);
        if (event.target.type === "file") {
          if (event.target.name === "studentPhoto") setStudentPhotoFile(event.target.files?.[0] || null);
          setSelectedFiles((current) => ({
            ...current,
            [event.target.name]: event.target.files?.[0]?.name || "",
          }));
        }
        updateValidation(event.currentTarget, event.target.name, Boolean(event.target.name));
      }}
    >
      <fieldset>
        <legend>
          <span>01</span>
          Student information
        </legend>
        <div className="form-grid">
          <label className="wide">
            Student full name <b>*</b>
            <input
              name="studentName"
              autoComplete="name"
              required
              placeholder="As per official records"
              {...fieldAccessibility("studentName", errors, touched)}
            />
            <FieldError name="studentName" errors={errors} touched={touched} />
          </label>
          <label>
            Date of birth <b>*</b>
            <input
              name="dateOfBirth"
              type="date"
              required
              max={getLocalDateInputValue()}
              {...fieldAccessibility("dateOfBirth", errors, touched)}
            />
            <FieldError name="dateOfBirth" errors={errors} touched={touched} />
            {dateOfBirth && getAgeOnDate(dateOfBirth) !== null && !(touched.dateOfBirth && errors.dateOfBirth) && (
              <span className="field-note age-calculation" aria-live="polite">
                Calculated age: {getAgeOnDate(dateOfBirth)} years old as of today
              </span>
            )}
          </label>
          <label>
            Gender <b>*</b>
            <select name="gender" required defaultValue="" {...fieldAccessibility("gender", errors, touched)}>
              <option value="" disabled>
                Select
              </option>
              <option>Female</option>
              <option>Male</option>
              <option>Prefer not to say</option>
            </select>
            <FieldError name="gender" errors={errors} touched={touched} />
          </label>
          <label>
            Class applying for <b>*</b>
            <select name="class" required defaultValue="" {...fieldAccessibility("class", errors, touched)}>
              <option value="" disabled>
                Select class
              </option>
              {[
                "Nursery",
                "Junior KG",
                "Senior KG",
                "Class 1",
                "Class 2",
                "Class 3",
                "Class 4",
                "Class 5",
                "Class 6",
                "Class 7",
                "Class 8",
                "Class 9",
                "Class 10",
              ].map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
            <FieldError name="class" errors={errors} touched={touched} />
            {dateOfBirth && applyingClass && getAgeOnDate(dateOfBirth) !== null && !(touched.class && errors.class) && (
              (() => {
                const age = getAgeOnDate(dateOfBirth);
                const criteria = CLASS_AGE_CRITERIA[applyingClass];
                const isValid = criteria && age >= criteria.minAge && age <= criteria.maxAge;
                if (isValid) {
                  return (
                    <span className="field-note age-calculation age-valid" aria-live="polite">
                      ✓ Age eligible: {age} years as of today (Criteria: {criteria.minAge}–{criteria.maxAge} years).
                    </span>
                  );
                }
                return null;
              })()
            )}
            {!dateOfBirth && applyingClass && CLASS_AGE_CRITERIA[applyingClass] && (
              <span className="field-note age-calculation" aria-live="polite">
                Eligible age: {CLASS_AGE_CRITERIA[applyingClass].minAge}–{CLASS_AGE_CRITERIA[applyingClass].maxAge} years ({CLASS_AGE_CRITERIA[applyingClass].label}).
              </span>
            )}
          </label>
          <label>
            Current school
            <input name="currentSchool" placeholder="If applicable" />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span>02</span>
          Parent / guardian information
        </legend>
        <div className="form-grid">
          <label className="wide">
            Parent / guardian full name <b>*</b>
            <input
              name="parentName"
              autoComplete="name"
              required
              placeholder="Full name"
              {...fieldAccessibility("parentName", errors, touched)}
            />
            <FieldError name="parentName" errors={errors} touched={touched} />
          </label>
          <label>
            Relationship <b>*</b>
            <select name="relationship" required defaultValue="" {...fieldAccessibility("relationship", errors, touched)}>
              <option value="" disabled>
                Select
              </option>
              <option>Mother</option>
              <option>Father</option>
              <option>Legal guardian</option>
            </select>
            <FieldError name="relationship" errors={errors} touched={touched} />
          </label>
          <label>
            Contact number <b>*</b>
            <div className="phone-field">
              <span aria-hidden="true">+91</span>
              <input
                name="phone"
                type="tel"
                autoComplete="tel-national"
                inputMode="numeric"
                maxLength={10}
                required
                pattern="[0-9]{10}"
                placeholder="Enter 10-digit mobile number"
                {...fieldAccessibility("phone", errors, touched)}
              />
            </div>
            <FieldError name="phone" errors={errors} touched={touched} />
          </label>
          <label className="wide">
            Email address <b>*</b>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="parent@example.com"
              {...fieldAccessibility("email", errors, touched)}
            />
            <FieldError name="email" errors={errors} touched={touched} />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span>03</span>
          Address details
        </legend>
        <div className="form-grid">
          <label className="full">
            Residential address <b>*</b>
            <textarea
              name="address"
              autoComplete="street-address"
              required
              minLength={10}
              rows={3}
              placeholder="House number, street and locality"
              {...fieldAccessibility("address", errors, touched)}
            />
            <FieldError name="address" errors={errors} touched={touched} />
          </label>
          <label>
            City <b>*</b>
            <input
              name="city"
              autoComplete="address-level2"
              required
              placeholder="City"
              {...fieldAccessibility("city", errors, touched)}
            />
            <FieldError name="city" errors={errors} touched={touched} />
          </label>
          <label>
            State <b>*</b>
            <input
              name="state"
              autoComplete="address-level1"
              required
              placeholder="State"
              {...fieldAccessibility("state", errors, touched)}
            />
            <FieldError name="state" errors={errors} touched={touched} />
          </label>
          <label>
            Postal code <b>*</b>
            <input
              name="postalCode"
              inputMode="numeric"
              autoComplete="postal-code"
              required
              pattern="[0-9]{6}"
              placeholder="6-digit PIN"
              {...fieldAccessibility("postalCode", errors, touched)}
            />
            <FieldError name="postalCode" errors={errors} touched={touched} />
          </label>
        </div>
      </fieldset>

      <fieldset>
        <legend>
          <span>04</span>
          Supporting documents
        </legend>
        <p className="field-note">
          Upload clear JPG, PNG or PDF files. Each selected file should be no larger than 5 MB.
        </p>
        <div className="form-grid upload-grid">
          <label>
            Student photograph <b>*</b>
            <input
              name="studentPhoto"
              type="file"
              required
              accept=".jpg,.jpeg,.png"
              {...fieldAccessibility("studentPhoto", errors, touched)}
            />
            {selectedFiles.studentPhoto && (
              <span className="selected-file student-photo-preview-trigger" tabIndex={0}>
                Selected file: {selectedFiles.studentPhoto}
                {studentPhotoPreview && <img className="student-photo-preview" src={studentPhotoPreview} alt="Selected student photograph preview" />}
              </span>
            )}
            <FieldError name="studentPhoto" errors={errors} touched={touched} />
          </label>
          <label>
            Birth certificate <b>*</b>
            <input
              name="birthCertificate"
              type="file"
              required
              accept=".jpg,.jpeg,.png,.pdf"
              {...fieldAccessibility("birthCertificate", errors, touched)}
            />
            {selectedFiles.birthCertificate && (
              <span className="selected-file">Selected file: {selectedFiles.birthCertificate}</span>
            )}
            <FieldError name="birthCertificate" errors={errors} touched={touched} />
          </label>
          <label className="wide">
            Previous school report
            <input
              name="schoolReport"
              type="file"
              accept=".jpg,.jpeg,.png,.pdf"
              {...fieldAccessibility("schoolReport", errors, touched)}
            />
            {selectedFiles.schoolReport && (
              <span className="selected-file">Selected file: {selectedFiles.schoolReport}</span>
            )}
            <FieldError name="schoolReport" errors={errors} touched={touched} />
          </label>
        </div>
      </fieldset>

      <label className="consent">
        <input type="checkbox" name="consent" required {...fieldAccessibility("consent", errors, touched)} />
        <span>
          I confirm that the information provided is accurate and may be reviewed by the school
          admissions team.
          <FieldError name="consent" errors={errors} touched={touched} />
        </span>
      </label>
      {serverError && (
        <div
          role="alert"
          style={{
            color: "#b91c1c",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "13px",
            marginBottom: "12px",
          }}
        >
          {serverError}
        </div>
      )}
      <button className="button primary form-submit" type="submit" disabled={submittingState}>
        {submittingState ? "Submitting Application..." : <>Submit Application <Arrow /></>}
      </button>
      {!formReady && (
        <p className="form-hint" aria-live="polite">
          Submit the form to check required fields and see any errors.
        </p>
      )}
    </form>
  );
}

function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [formReady, setFormReady] = useState(false);
  const [submittingState, setSubmittingState] = useState(false);
  const [serverError, setServerError] = useState("");
  const submitting = useRef(false);

  const updateValidation = (form, fieldName, markTouched = false) => {
    const nextErrors = getFormErrors(form);
    setErrors(nextErrors);
    if (markTouched && fieldName) setTouched((current) => ({ ...current, [fieldName]: true }));
    setFormReady(Object.keys(nextErrors).length === 0);
  };

  const submit = async (event) => {
    event.preventDefault();
    if (submitting.current) return;
    const form = event.currentTarget;
    const nextErrors = getFormErrors(form);
    setErrors(nextErrors);
    setTouched(
      Object.fromEntries(
        Array.from(form.elements)
          .filter((field) => field.name)
          .map((field) => [field.name, true]),
      ),
    );
    setFormReady(Object.keys(nextErrors).length === 0);
    if (Object.keys(nextErrors).length) {
      const firstInvalid = Array.from(form.elements).find((field) => nextErrors[field.name]);
      if (firstInvalid) {
        firstInvalid.scrollIntoView({ behavior: "smooth", block: "center" });
        firstInvalid.focus({ preventScroll: true });
      }
      return;
    }
    submitting.current = true;
    setSubmittingState(true);
    setServerError("");

    const data = {
      parent_name: form.elements.parentName.value.trim(),
      phone: form.elements.contactNumber.value.trim(),
      email: form.elements.email.value.trim(),
      grade_interested: form.elements.interestedClass?.value || null,
      category: form.elements.enquiryCategory.value,
      message: form.elements.message?.value?.trim() || null,
    };

    try {
      await enquiryService.submitEnquiry(data);
      setSubmitted(true);
    } catch (err) {
      setServerError(err.message || "Failed to submit enquiry. Please try again.");
    } finally {
      submitting.current = false;
      setSubmittingState(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setErrors({});
    setTouched({});
    setFormReady(false);
    setServerError("");
    submitting.current = false;
    setSubmittingState(false);
  };

  if (submitted) {
    return (
      <SuccessPanel
        title="Thank you for your enquiry!"
        message="Your enquiry has been submitted successfully to Siddhant High School. Our admissions desk will reach out to you shortly."
        resetLabel="Submit Another Enquiry"
        onReset={resetForm}
      />
    );
  }

  return (
    <form
      className="enquiry-form premium-form"
      noValidate
      onSubmit={submit}
      onBlur={(event) => {
        if (event.target.name) updateValidation(event.currentTarget, event.target.name, true);
      }}
      onChange={(event) => {
        if (["phone", "contactNumber"].includes(event.target.name)) sanitizePhoneInput(event);
        updateValidation(event.currentTarget, event.target.name, Boolean(event.target.name));
      }}
    >
      <div className="form-grid">
        <label>
          Parent Name <b>*</b>
          <input
            name="parentName"
            autoComplete="name"
            required
            placeholder="Full name"
            {...fieldAccessibility("parentName", errors, touched)}
          />
          <FieldError name="parentName" errors={errors} touched={touched} />
        </label>
        <label>
          Contact Number <b>*</b>
          <div className="phone-field">
            <span aria-hidden="true">+91</span>
            <input
              name="contactNumber"
              type="tel"
              autoComplete="tel-national"
              inputMode="numeric"
              maxLength={10}
              required
              pattern="[0-9]{10}"
              placeholder="Enter 10-digit mobile number"
              {...fieldAccessibility("contactNumber", errors, touched)}
            />
          </div>
          <FieldError name="contactNumber" errors={errors} touched={touched} />
        </label>
        <label>
          Email <b>*</b>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="parent@example.com"
            {...fieldAccessibility("email", errors, touched)}
          />
          <FieldError name="email" errors={errors} touched={touched} />
        </label>
        <label>
          Interested class
          <select
            name="interestedClass"
            defaultValue=""
            {...fieldAccessibility("interestedClass", errors, touched)}
          >
            <option value="" disabled>
              Select class
            </option>
            <option>Pre-Primary</option>
            <option>Primary School</option>
            <option>Middle School</option>
            <option>High School</option>
          </select>
          <FieldError name="interestedClass" errors={errors} touched={touched} />
        </label>
        <label className="wide">
          Enquiry category <b>*</b>
          <select
            name="enquiryCategory"
            required
            defaultValue=""
            {...fieldAccessibility("enquiryCategory", errors, touched)}
          >
            <option value="" disabled>
              Select category
            </option>
            <option>Admission process</option>
            <option>School visit</option>
            <option>Academics</option>
            <option>Facilities</option>
            <option>General information</option>
          </select>
          <FieldError name="enquiryCategory" errors={errors} touched={touched} />
        </label>
        <label className="full">
          Message
          <textarea
            name="message"
            minLength={10}
            maxLength={1000}
            rows={5}
            placeholder="How can we help you?"
            {...fieldAccessibility("message", errors, touched)}
          />
          <FieldError name="message" errors={errors} touched={touched} />
        </label>
      </div>
      {serverError && (
        <div
          role="alert"
          style={{
            color: "#b91c1c",
            backgroundColor: "#fef2f2",
            border: "1px solid #fecaca",
            borderRadius: "8px",
            padding: "10px 14px",
            fontSize: "13px",
            marginBottom: "12px",
          }}
        >
          {serverError}
        </div>
      )}
      <button className="button primary form-submit" type="submit" disabled={submittingState}>
        {submittingState ? "Submitting Enquiry..." : <>Submit Enquiry <Arrow /></>}
      </button>
      {!formReady && (
        <p className="form-hint" aria-live="polite">
          Submit the form to check required fields and see any errors.
        </p>
      )}
    </form>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopMoreRef = useRef(null);
  const mobileMoreRef = useRef(null);
  const [galleryCategory, setGalleryCategory] = useState("All");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const initialPath = window.location.pathname.replace(/\/+$/, "") || "/";
  const [location, setLocation] = useState({ pathname: initialPath, search: window.location.search });
  const page = location.pathname;
  const [admissionTab, setAdmissionTab] = useState(() =>
    new URLSearchParams(window.location.search).get("form") === "application" ? "application" : "enquiry",
  );


  const [calendarEvents, setCalendarEvents] = useState([]);
  const [newsList, setNewsList] = useState(sampleNews);
  const [galleryList, setGalleryList] = useState(() =>
    galleryItems.map(([src, title, category]) => ({ src, title, category }))
  );
  const latestAnnouncement = newsList[0] || null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await calendarEventService.getAllEvents();
        setCalendarEvents(events);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      }
    };

    const fetchNews = async () => {
      try {
        const liveNews = await newsService.getAllNews();
        if (Array.isArray(liveNews) && liveNews.length > 0) {
          setNewsList(liveNews);
        }
      } catch (err) {
        console.warn("Using sample announcements:", err.message);
      }
    };

    const fetchGallery = async () => {
      try {
        const liveMedia = await galleryService.getAllGallery();
        if (Array.isArray(liveMedia) && liveMedia.length > 0) {
          setGalleryList(liveMedia);
        }
      } catch (err) {
        console.warn("Using sample gallery:", err.message);
      }
    };

    fetchEvents();
    fetchNews();
    fetchGallery();
  }, []);

  const navigate = (to, { replace = false } = {}) => {
    const url = new URL(to, window.location.origin);
    const pathname = url.pathname.replace(/\/+$/, "") || "/";
    const nextLocation = `${pathname}${url.search}`;
    window.history[replace ? "replaceState" : "pushState"]({}, "", nextLocation);
    setLocation({ pathname, search: url.search });
    setMenuOpen(false);
    desktopMoreRef.current?.removeAttribute("open");
    mobileMoreRef.current?.removeAttribute("open");
    if (pathname === "/admissions") {
      setAdmissionTab(url.searchParams.get("form") === "application" ? "application" : "enquiry");
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  useEffect(() => {
    const handlePopState = () => {
      const pathname = window.location.pathname.replace(/\/+$/, "") || "/";
      setLocation({ pathname, search: window.location.search });
      setMenuOpen(false);
      desktopMoreRef.current?.removeAttribute("open");
      mobileMoreRef.current?.removeAttribute("open");
      if (pathname === "/admissions") {
        setAdmissionTab(
          new URLSearchParams(window.location.search).get("form") === "application"
            ? "application"
            : "enquiry",
        );
      }
      window.scrollTo({ top: 0, behavior: "auto" });
    };
    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  useEffect(() => {
    const closeMoreOnOutsideClick = (event) => {
      [desktopMoreRef.current, mobileMoreRef.current].forEach((menu) => {
        if (menu?.open && !menu.contains(event.target)) menu.removeAttribute("open");
      });
    };
    const closeMoreOnEscape = (event) => {
      if (event.key !== "Escape") return;
      [desktopMoreRef.current, mobileMoreRef.current].forEach((menu) => {
        if (menu?.open) {
          menu.removeAttribute("open");
          menu.querySelector("summary")?.focus();
        }
      });
    };
    document.addEventListener("pointerdown", closeMoreOnOutsideClick);
    document.addEventListener("keydown", closeMoreOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMoreOnOutsideClick);
      document.removeEventListener("keydown", closeMoreOnEscape);
    };
  }, []);

  useEffect(() => {
    const pageLabel = pages.find(([, path]) => path === page)?.[0] ?? "Page not found";
    document.title = `${pageLabel} | Siddhant High School`;
  }, [page]);

  useEffect(() => {
    const highlightLatest = page === "/news" && new URLSearchParams(location.search).get("highlight") === "latest";
    if (!highlightLatest || !latestAnnouncement) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const article = document.getElementById("latest-announcement");
      if (!article) return;
      article.scrollIntoView({ block: "center" });
      article.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.search, page]);

  const openAdmissions = (tab) => {
    navigate(`/admissions?form=${tab}`);
  };

  const chooseAdmissionTab = (tab) => {
    setAdmissionTab(tab);
    const params = new URLSearchParams(location.search);
    params.set("form", tab);
    const search = `?${params.toString()}`;
    window.history.replaceState({}, "", `/admissions${search}`);
    setLocation((current) => ({ ...current, search }));
  };

  const primaryPaths = new Set([
    "/",
    "/about",
    "/vision-mission",
    "/academics",
    "/infrastructure",
    "/gallery",
    "/admissions",
    "/contact",
  ]);
  const primaryPages = pages.filter(([, path]) => primaryPaths.has(path));
  const morePages = pages.filter(([, path]) => path !== "/" && !primaryPaths.has(path));
  const isMorePageActive = morePages.some(([, path]) => path === page);
  const monthLabel = calendarMonth.toLocaleDateString("en", { month: "long", year: "numeric" });
  const selectedEvent = calendarEvents.find(
  (event) => event.date === selectedDate
);

const upcomingEvents = calendarEvents
  .filter((event) => event.date >= getLocalDateInputValue())
  .sort((first, second) => first.date.localeCompare(second.date));
  const calendarLeadingDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const calendarDayCount = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarDates = Array.from({ length: calendarDayCount }, (_, index) => {
    const day = index + 1;
    return `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });

  return (
    <NavigationContext.Provider value={navigate}>
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <div className="topbar">
        <p className="topbar-society">Operated by Shubham Education &amp; Welfare Society</p>
        <NewsTicker onNavigate={navigate} announcements={newsList} />
        <RouteLink className="topbar-urgent-badge" to="/news?highlight=latest" aria-label="Urgent notice. View the latest announcement">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 8v4h4l6 4V4L7 8H3Zm4 4 1.2 4h2L9 12m6-5a4 4 0 0 1 0 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></svg>
          Urgent Notice
        </RouteLink>
      </div>

      <header className="site-header">
        <RouteLink className="brand" to="/" aria-label="Siddhant High School home">
          <img src={logo} alt="Original Siddhant High School logo" />
          <span className="brand-copy">
            <strong>Siddhant High School</strong>
            <small>Knowledge · Character · Purpose</small>
          </span>
        </RouteLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryPages.map(([label, path]) => (
            <RouteLink key={path} to={path} className={page === path ? "active" : ""} aria-current={page === path ? "page" : undefined}>
              {label}
            </RouteLink>
          ))}
          <details className={`desktop-more ${isMorePageActive ? "is-active" : ""}`} ref={desktopMoreRef}>
            <summary aria-label="More pages" aria-current={isMorePageActive ? "page" : undefined}>More</summary>
            <div>
              {morePages.map(([label, path]) => (
                <RouteLink
                  key={path}
                  to={path}
                  className={page === path ? "active" : ""}
                  aria-current={page === path ? "page" : undefined}
                  onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
                >
                  {label}
                </RouteLink>
              ))}
            </div>
          </details>
        </nav>
        <button className="button primary header-cta" onClick={() => openAdmissions("enquiry")}>
          Admission Enquiry <Arrow />
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {primaryPages.map(([label, path]) => (
              <RouteLink key={path} to={path} className={page === path ? "active" : ""} aria-current={page === path ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                {label}
              </RouteLink>
            ))}
            <details className={`mobile-more ${isMorePageActive ? "is-active" : ""}`} ref={mobileMoreRef}>
              <summary aria-label="More pages" aria-current={isMorePageActive ? "page" : undefined}>More</summary>
              <div>
                {morePages.map(([label, path]) => (
                  <RouteLink key={path} to={path} className={page === path ? "active" : ""} aria-current={page === path ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                    {label}
                  </RouteLink>
                ))}
              </div>
            </details>
            <button
              className="button primary"
              onClick={() => {
                openAdmissions("enquiry");
              }}
            >
              Admission Enquiry
            </button>
          </nav>
        )}
      </header>

      <main id="top">
        {page === "/" && (
        <section className="hero">
          <img src={images.hero} alt="Representative school building and grounds; not verified as Siddhant High School" />
          <div className="hero-overlay" />
          <div className="hero-content">
            <p className="eyebrow light">Welcome to Siddhant High School</p>
            <h1>
              Cultivating Individuality
              <br />
              and Academic <em>Excellence.</em>
            </h1>
            <p className="hero-intro">
              A thoughtful learning environment where young minds are encouraged to question, create
              and grow with confidence.
            </p>
            <div className="hero-actions">
              <RouteLink className="button primary" to="/about">
                About Us <Arrow />
              </RouteLink>
              <button
                className="button outline-blue"
                onClick={() => openAdmissions("application")}
              >
                Admissions <Arrow />
              </button>
            </div>
          </div>
          <RouteLink to="/about" className="scroll-cue" aria-label="About Siddhant High School">
            <span>Explore</span>
            <i />
          </RouteLink>
        </section>
        )}

        {page === "/" && (
          <>
            <section className="home-welcome section">
              <div className="home-welcome-image"><img src={images.learningWithPurpose} alt="Teacher guiding students through a creative learning activity" /></div>
              <div className="home-welcome-copy">
                <p className="eyebrow">Welcome to Siddhant High School</p>
                <h2>Learning with purpose, <em>growing with confidence.</em></h2>
                <p className="lead">We believe education should build strong understanding while making room for curiosity, creativity, character and the individual potential of every learner.</p>
                <p>This introduction describes an educational approach; official school history and further institutional details will be added when provided.</p>
                <RouteLink className="arrow-link" to="/about">Discover More <Arrow /></RouteLink>
              </div>
            </section>
            <section className="home-learning section-blue">
              <div className="section-heading centered light-heading"><p className="eyebrow light">Our approach to learning</p><h2>Curiosity for today, <em>confidence for tomorrow.</em></h2><p>Four connected learning pillars offer a concise view of the school's illustrative educational approach.</p></div>
              <div className="academic-grid">{learningPillars.map(([n, icon, title, text]) => <article className="academic-card" key={title}><span className="card-number">{n}</span><Icon name={icon} /><h3>{title}</h3><p>{text}</p></article>)}</div>
              <div className="centered-action"><RouteLink className="button white" to="/academics">Academics &amp; Curriculum <Arrow /></RouteLink></div>
            </section>
            <section className="home-beyond section">
              <div className="section-heading split-heading"><div><p className="eyebrow">Beyond academics</p><h2>Room to explore, <em>express and connect.</em></h2></div><p>Student development can grow through shared interests, physical activity and cultural expression. These illustrative previews link to the dedicated pages.</p></div>
              <div className="home-feature-grid"><RouteLink to="/student-activities"><img src={images.community} alt="Representative student group activity"/><span>Student Activities</span></RouteLink><RouteLink to="/sports-cultural"><img src={images.homepageSportsCultural} alt="Students taking part in sports and cultural performances"/><span>Sports &amp; Cultural Activities</span></RouteLink><RouteLink to="/achievements"><img src={images.homepageAchievement} alt="Students receiving achievement certificates"/><span>Student Achievements</span></RouteLink></div>
              <RouteLink className="arrow-link" to="/student-activities">Explore Student Activities <Arrow /></RouteLink>
            </section>
            <section className="home-campus"><img src={images.campus} alt="Representative campus courtyard image"/><div><p className="eyebrow light">Discover our campus</p><h2>A welcoming setting for <em>learning and discovery.</em></h2><p>Explore examples of spaces that can support focused study, movement and creative work. Images and facility descriptions are representative and await school confirmation.</p><RouteLink className="button white" to="/infrastructure">Infrastructure &amp; Facilities <Arrow /></RouteLink></div></section>
            <section className="home-updates section">
  <div className="section-heading split-heading">
    <div>
      <p className="eyebrow">Stay connected</p>
      <h2>Latest news &amp; <em>upcoming events.</em></h2>
    </div>
    <p>Read the latest school updates and see upcoming events.</p>
  </div>

  <div className="home-update-grid">
    <div>
      <h3>News &amp; Announcements <span>Sample content</span></h3>
      {sampleNews.slice(0, 2).map((item) => (
        <article key={item.id}>
          <small>{item.date} · {item.category}</small>
          <h4>{item.title}</h4>
          <p>{item.summary}</p>
        </article>
      ))}
      <RouteLink className="arrow-link" to="/news">
        News &amp; Announcements <Arrow />
      </RouteLink>
    </div>

    <div>
      <h3>Upcoming Events <span>Live events</span></h3>
      {calendarEvents
        .filter((event) => event.date >= getLocalDateInputValue())
        .sort((a, b) => a.date.localeCompare(b.date))
        .slice(0, 2)
        .map((event) => (
          <article key={event.id}>
            <small>{event.date} · {event.category}</small>
            <h4>{event.title}</h4>
            <p>{event.description || "More details will be shared by the school."}</p>
          </article>
        ))}

      <RouteLink className="arrow-link" to="/events">
        Events &amp; Calendar <Arrow />
      </RouteLink>
    </div>
  </div>
</section>
            <section className="home-admissions"><p className="eyebrow light">Admissions &amp; enquiries</p><h2>Take the next step in <em>your school journey.</em></h2><p>Use the frontend demonstration forms to explore an application or send an enquiry. No information is transmitted or stored.</p><div><button className="button white" onClick={() => openAdmissions("application")}>Apply for Admission <Arrow /></button><button className="button outline-light" onClick={() => openAdmissions("enquiry")}>Send an Enquiry <Arrow /></button></div></section>
          </>
        )}

        {page === "/about" && (
        <section className="welcome section" id="welcome">
          <div className="welcome-images reveal">
            <img
              className="welcome-main"
              src={images.classroom}
              alt="Students learning together in a bright classroom"
            />
            <div className="welcome-detail">
              <img src={images.campus} alt="A modern campus courtyard" />
              <span className="image-number">01</span>
            </div>
          </div>
          <div className="welcome-copy">
            <p className="eyebrow">About Us</p>
            <h1 className="page-title">
              Education that sees
              <br />
              the <em>whole child.</em>
            </h1>
            <div className="red-rule" />
            <p className="lead">
              At Siddhant High School, learning extends beyond the classroom. We seek to nurture
              curiosity, integrity and a lifelong love of discovery.
            </p>
            <p>
              Operated by Shubham Education &amp; Welfare Society, the school brings together
              purposeful academics and rich experiences designed to help every learner find their
              voice.
            </p>
            <RouteLink className="arrow-link" to="/academics">
              Academics &amp; Curriculum <Arrow />
            </RouteLink>
          </div>
        </section>
        )}

        {page === "/about" && (
          <section className="about-commitment section">
            <div className="about-commitment-heading"><p className="eyebrow">Growing as a whole person</p><h2>Learning shaped by <em>curiosity, care and purpose.</em></h2><p>These illustrative themes preview the values-led approach described on the Vision &amp; Mission page.</p></div>
            <div className="about-principles">{[["01", "Curiosity", "Ask thoughtful questions, explore ideas and keep a lifelong interest in learning."], ["02", "Character", "Practice integrity, respect and compassion in everyday choices."], ["03", "Belonging", "Learn with others, share responsibility and contribute to a supportive community."]].map(([number, title, text]) => <article key={title}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
            <RouteLink className="arrow-link" to="/vision-mission">Explore Vision &amp; Mission <Arrow /></RouteLink>
          </section>
        )}

        {page === "/vision-mission" && (
        <section className="vision-values" id="vision">
          <p className="sample-note vision-sample-note">Illustrative vision, mission and values wording pending review and approval by the school.</p>
          <header className="vision-page-heading"><p className="eyebrow">Vision &amp; Mission</p><h1>A thoughtful direction for learning and growth.</h1><p>Learning shaped by curiosity, character and care for each learner's potential.</p></header>
          <div className="vision-panel">
            <p className="eyebrow light">Our direction</p>
            <div className="vision-block">
              <span className="vision-icon"><Icon name="light" /></span>
              <div>
                <small>Vision</small>
                <h2>Young people who learn with purpose and lead with character.</h2>
                <p>
                  To create a nurturing school culture where every learner is encouraged to think
                  independently, act responsibly and pursue excellence with humility.
                </p>
              </div>
            </div>
            <div className="vision-block">
              <span className="vision-icon"><Icon name="globe" /></span>
              <div>
                <small>Mission</small>
                <h2>Meaningful education for a changing world.</h2>
                <p>
                  To provide balanced learning experiences that strengthen academic understanding,
                  creativity, wellbeing and the confidence to contribute positively to society.
                </p>
              </div>
            </div>
          </div>
          <section className="educational-philosophy" aria-labelledby="philosophy-title">
            <div><p className="eyebrow">Educational philosophy &middot; illustrative</p><h2 id="philosophy-title">Learn with curiosity, <em>practice and reflection.</em></h2></div>
            <p>Build understanding, explore ideas, and reflect on what comes next. This sample wording is pending school review.</p>
          </section>
          <div className="values-panel">
            <p className="eyebrow">Principles &amp; values</p>
            <h2>
              What guides us,
              <br />
              <em>every day.</em>
            </h2>
            <div className="value-list">
              {[
                ["Curiosity", "We encourage thoughtful questions and the courage to explore."],
                ["Integrity", "We value honesty, responsibility and doing what is right."],
                ["Respect", "We listen, include and recognise the dignity of every person."],
                ["Excellence", "We pursue meaningful progress through consistent effort."],
                ["Compassion", "We act with empathy and care for our shared community."],
              ].map(([title, text], index) => (
                <article key={title}>
                  <span>0{index + 1}</span>
                  <div>
                    <h3>{title}</h3>
                    <p>{text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
          <div className="vision-next-step"><p>See how these ideas inform the learning approach.</p><RouteLink className="arrow-link" to="/academics">Explore Academics &amp; Curriculum <Arrow /></RouteLink></div>
        </section>

        )}

        {page === "/academics" && (
        <section className="academics section" id="academics">
          <div className="section-heading centered academics-heading">
            <p className="eyebrow">Academics &amp; Curriculum</p>
            <h1 className="page-title">
              A foundation for <em>every future.</em>
            </h1>
            <p>
              Balanced learning experiences help students develop understanding, confidence and the
              habits of thoughtful inquiry.
            </p>
          </div>
          <div className="academic-grid">
            {learningPillars.map(([n, icon, title, text]) => (
              <article className="academic-card" key={title}>
                <span className="card-number">{n}</span>
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="academic-card-mark" aria-hidden="true"><Arrow /></span>
              </article>
            ))}
          </div>
          <div className="learning-areas"><p className="eyebrow">Illustrative learning areas &middot; pending school confirmation</p><div>{[["01", "Reading & communication"], ["02", "Science & inquiry"], ["03", "Digital exploration"], ["04", "Creative practice & collaboration"]].map(([number, title]) => <span key={title}><b>{number}</b>{title}</span>)}</div></div>
          <div className="academics-photo-row"><figure><img src={images.library} alt="Representative library and reading space"/><figcaption>Reading &amp; independent learning</figcaption></figure><figure><img src={images.science} alt="Representative hands-on science activity"/><figcaption>Inquiry &amp; exploration</figcaption></figure></div>
          <section className="academics-detail" aria-labelledby="academic-practice-title">
            <div className="academics-detail-heading"><p className="sample-note">Illustrative approach; no board, syllabus, class structure or examination system is specified.</p><h2 id="academic-practice-title">How learning is <em>supported.</em></h2><p>Teaching, feedback and wider experiences each play a part in helping learners make progress.</p></div>
            <div className="academic-practice">
              <article className="academic-practice-feature"><figure><img src={images.academicsClassroom} alt="Teacher leading a classroom lesson"/><figcaption>Illustrative classroom image</figcaption></figure><div><Icon name="book"/><h3>Teaching &amp; learning</h3><p>A balanced approach may combine clear explanation, guided practice, discussion, inquiry and opportunities to create.</p></div></article>
              <div className="academic-practice-list">{[["Progress & feedback", "light", "Regular feedback and reflection can help learners understand progress and identify next steps; assessment arrangements await official details."], ["Academic support", "globe", "Responsive guidance and communication with families can help address different learning needs."], ["Co-curricular learning", "palette", "Learning can extend through projects, reading, arts, sports and shared activities beyond lessons."]].map(([title, icon, text], index) => <article key={title}><span>0{index + 2}</span><Icon name={icon}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
            </div>
          </section>
        </section>

        )}

        {page === "/management-faculty" && (
        <section className="management section" id="management">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Management &amp; Faculty</p>
              <h1 className="page-title">
                Guided by <em>care and purpose.</em>
              </h1>
            </div>
            <p>
              Our school community is supported by committed educators and administrators who place
              student growth, safety and meaningful learning at the centre of their work.
            </p>
          </div>
          <div className="management-showcase">
          <figure className="management-visual"><img src={images.facultyGroup} alt="Group of faculty members gathered together"/><figcaption>Faculty group photograph</figcaption></figure>
          <div className="management-grid">
            {[
              [
                "01",
                "globe",
                "School Management",
                "Strategic direction and responsible stewardship under Shubham Education & Welfare Society.",
              ],
              [
                "02",
                "book",
                "Academic Leadership",
                "Curriculum planning, teaching quality and a consistent culture of learning.",
              ],
              [
                "03",
                "light",
                "Teaching Faculty",
                "Subject knowledge, thoughtful guidance and attention to individual learning needs.",
              ],
              [
                "04",
                "trophy",
                "Student Support",
                "Pastoral care, family communication and support for student wellbeing.",
              ],
            ].map(([number, icon, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="sample-note">
            Leadership and faculty profiles will be published when official school information is
            available.
          </p>
          </div>
        </section>

        )}

        {page === "/infrastructure" && (
        <section className="facilities section" id="facilities">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Infrastructure &amp; Facilities</p>
              <h1 className="page-title">
                Designed for <em>discovery.</em>
              </h1>
            </div>
            <p>
              Thoughtfully planned learning spaces create room for concentration, collaboration,
              movement and imagination.
            </p>
          </div>
          <p className="sample-note">The descriptions below and the photographs are representative examples only. They do not confirm that any specific facility is available at Siddhant High School.</p>
          <div className="facility-showcase">
            {[
              [images.campusLearningSpaces, "Campus & Learning Spaces", "Siddhant High School campus building", "Welcoming settings can support focused study, collaboration and the everyday rhythm of school life."],
              [images.science, "Science & Discovery", "Representative science image", "Practical learning spaces may help students observe, investigate questions and test ideas."],
              [images.computing, "Digital Learning & Technology", "Representative digital learning image", "Age-appropriate digital resources can help learners research, create and develop technology skills."],
              [images.facilityLibrary, "Library & Reading Resources", "Students reading together in a school library", "A reading environment can encourage independent learning, communication and a lasting interest in books."],
              [images.facilitySports, "Sports & Recreation", "Students taking part in an outdoor school race", "Spaces for movement can support physical wellbeing, participation and teamwork."],
              [images.facilityArts, "Arts & Creative Spaces", "Students working together on art", "Creative environments can make room for visual expression, music, performance and making."],
            ].map(([src, title, alt, description], index) => (
              <article key={title}>
                <figure><img src={src} alt={alt} /><figcaption>Illustrative image &middot; facility pending confirmation</figcaption></figure>
                <div><span>0{index + 1}</span><h2>{title}</h2><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>

        )}

        {page === "/sports-cultural" && (
        <section className="student-life" id="activities">
          <div className="sports-intro-layout">
          <div className="life-intro">
            <p className="eyebrow light">Beyond the classroom</p>
            <p className="sports-page-label">Sports &amp; Cultural Activities</p>
            <h1 className="page-title">
              Life at Siddhant is
              <br />
              <em>full of possibility.</em>
            </h1>
            <p>
              Movement, expression and shared experiences are an essential part of a complete
              education.
            </p>
            <RouteLink className="arrow-link on-dark" to="/gallery">
              Explore the gallery <Arrow />
            </RouteLink>
          </div>
          <figure className="sports-hero-image">
            <div className="sports-hero-pair">
              <RepresentativeImage src={images.sportsDetail} alt="Representative school sports activity on a football field; not a Siddhant High School event" />
              <RepresentativeImage src={images.sportsCulturalDance} alt="Students performing a cultural dance on stage" />
            </div>
            <figcaption>Representative sports and cultural activity imagery</figcaption>
          </figure>
          </div>
          <p className="sample-note sports-sample-note">Activity examples and photographs are representative. They do not confirm a specific Siddhant High School programme or event.</p>
          <div className="sports-details"><div className="sports-detail-grid">{[["trophy", "Sports & physical wellbeing", "Movement and age-appropriate physical activity can support health, confidence and enjoyment."], ["globe", "Teamwork & participation", "Team games create opportunities to cooperate, show respect and learn through shared effort."], ["palette", "Cultural celebrations", "Shared cultural occasions can help students encounter traditions and learn from one another."], ["light", "Music, dance & performance", "Performance offers a space to practise, express ideas and enjoy creative collaboration."], ["palette", "Creative expression", "Art and making allow learners to experiment with materials, form and personal ideas."], ["globe", "Community participation", "School gatherings can bring students, families and educators together in a supportive community."]].map(([icon, title, text]) => <article key={title}><Icon name={icon}/><h3>{title}</h3><p>{text}</p></article>)}</div></div>
        </section>

        )}

        {page === "/student-activities" && (
        <section className="activities-detail section">
          <div className="section-heading centered">
            <p className="eyebrow">Student Activities</p>
            <h1 className="page-title">
              Experiences that build <em>confidence.</em>
            </h1>
            <p className="activities-intro">
              Sports, creative practice and shared projects can offer students ways to collaborate,
              perform, create and contribute. Examples on this page are illustrative.
            </p>
          </div>
          <div className="activity-cards">
            {[
              ["trophy", "Sports & Fitness", "Team games and movement can build coordination, persistence and respect for others. Specific sports offered by the school await confirmation.", images.studentSportsFitness, "Students taking part in a group fitness activity"],
              ["palette", "Visual & Performing Arts", "Creative practice gives learners ways to develop ideas, share their work and express themselves through different forms.", images.studentPerformingArts, "Students performing on stage"],
              ["book", "Clubs & Interests", "Interest-led groups can give students time to explore a subject, exchange ideas and learn alongside others.", images.studentClubs, "Students reading together in a library"],
              ["globe", "Community Events", "Shared school occasions can help students and families connect and contribute to a welcoming community.", images.studentCommunity, "Students sharing a creative project"],
              ["light", "Leadership", "Opportunities to listen, take responsibility and support a group can help students practise leadership.", images.studentLeadership, "Students taking part in a school leadership ceremony"],
              ["flask", "Innovation", "Making and design challenges encourage learners to test possibilities, learn from setbacks and improve an idea.", images.robotics, "Illustrative robotics project"],
            ].map(([icon, title, text, src, alt], index) => (
              <article key={title}>
                <figure><RepresentativeImage src={src} alt={`${alt}; representative only, not a verified Siddhant programme`} /><figcaption>Illustrative example</figcaption></figure>
                <div className="activity-card-copy"><span>0{index + 1}</span><Icon name={icon} /><h3>{title}</h3><p>{text}</p></div>
              </article>
            ))}
          </div>
          <p className="sample-note">These are illustrative activity examples. The school's current clubs and programme details are pending confirmation.</p>
          <RouteLink className="arrow-link activities-next-step" to="/sports-cultural">Explore Sports &amp; Cultural Activities <Arrow /></RouteLink>
        </section>

        )}

        {page === "/robotics-innovation" && (
        <section className="innovation section">
          <div className="innovation-image">
            <RepresentativeImage src={images.roboticsInnovation} alt="Teacher and students exploring an educational robot" />
            <span className="vertical-label">Ideas into action</span>
          </div>
          <div className="innovation-copy">
            <p className="eyebrow">Robotics &amp; Innovation</p>
            <h1 className="page-title">
              Learning to make,
              <br />
              test and <em>imagine.</em>
            </h1>
            <p className="lead">Innovation begins with the courage to ask, “What if?”</p>
            <p>
              Through age-appropriate technology, design thinking and collaborative problem-solving,
              students can explore how ideas become useful solutions.
            </p>
            <div className="innovation-points">
              <div>
                <Icon name="light" />
                <span>
                  <strong>Creative thinking</strong>
                  <small>From open questions to original ideas</small>
                </span>
              </div>
              <div>
                <Icon name="globe" />
                <span>
                  <strong>Future readiness</strong>
                  <small>Skills for a changing world</small>
                </span>
              </div>
            </div>
            <p className="sample-note">Illustrative learning topics and project examples; specific facilities and programmes are pending school confirmation.</p>
            <div className="innovation-topic-grid">{[["Robotics & coding", "Explore instructions, simple systems and computational thinking."], ["Experimentation", "Ask questions, test ideas, observe results and reflect."], ["Design thinking", "Understand a challenge, imagine options and refine a solution."], ["Project showcases", "Example projects may include a simple moving model or a sensor-based prototype; these are illustrative only."]].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
          </div>
        </section>

        )}

        {page === "/gallery" && (
        <section className="gallery-section section" id="gallery">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Gallery</p>
              <h1 className="page-title">
                A glimpse of <em>school life.</em>
              </h1>
            </div>
            <p>
              Moments of learning, movement, creativity and community. Representative photography is
              shown where original school images are not yet available.
            </p>
          </div>
          <div className="gallery-filters" role="group" aria-label="Filter gallery images">{["All", "Campus", "Academics", "Student Activities", "Sports", "Cultural Activities", "Innovation"].map((category) => <button type="button" key={category} aria-pressed={galleryCategory === category} className={galleryCategory === category ? "active" : ""} onClick={() => setGalleryCategory(category)}>{category}</button>)}</div>
          <div className="gallery-grid">
            {galleryList.filter((item) => galleryCategory === "All" || item.category === galleryCategory).map((item, index) => (
              <figure key={item.id || item.title || index}>
                <img src={item.src} alt={item.title} />
                <figcaption>
                  <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                  <p>{item.title} <small>{item.category}</small></p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        )}

        {page === "/achievements" && (
        <section className="achievements">
          <header className="achievement-title">
            <p className="eyebrow">Student Achievements</p>
            <h1 className="page-title">Celebrating every milestone.</h1>
            <p className="achievement-intro">Achievement is shaped by curiosity, dedication, creativity, participation and the determination to keep growing.</p>
          </header>
          <div className="achievement-gallery" aria-label="Illustrative awards and student recognition photographs">
            <figure>
              <RepresentativeImage src={images.achievementTrophy} alt="Gold trophy and medals displayed as representative achievement imagery; not a Siddhant High School award" />
              <figcaption><strong>Awards &amp; Trophies</strong><span>Recognising dedication, effort and excellence.</span></figcaption>
            </figure>
            <figure>
              <RepresentativeImage src={images.achievementRecognition} alt="Students receiving medals and certificates during a representative school award ceremony; not Siddhant High School students or an event" />
              <figcaption><strong>Student Recognition</strong><span>Celebrating the moments that make learning meaningful.</span></figcaption>
            </figure>
          </div>
          <p className="sample-note achievement-sample-note">Photographs and examples are illustrative and do not represent verified Siddhant High School achievements.</p>
          <section className="achievement-areas" aria-labelledby="achievement-areas-title">
            <p className="eyebrow">MORE THAN AWARDS</p>
            <h2 id="achievement-areas-title">Achievement takes many forms.</h2>
            <div className="achievement-areas-grid">
              <article><h3>Academic Progress</h3><p>Recognising curiosity, dedication, consistent effort and progress in learning.</p></article>
              <article><h3>Creative Accomplishments</h3><p>Celebrating imagination, artistic expression, experimentation and original ideas.</p></article>
              <article><h3>Participation &amp; Leadership</h3><p>Valuing teamwork, responsibility, collaboration and meaningful participation.</p></article>
            </div>
          </section>
          <section className="achievement-closing">
            <h2>Every step forward matters.</h2>
            <p>Progress is not measured only by awards. Every effort, new skill, creative idea and act of teamwork is worth recognising.</p>
          </section>
        </section>
        )}

        {page === "/news" && (
        <section className="news section" id="news">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">School announcements</p>
              <h1>News &amp; Announcements</h1>
            </div>
            <p>Illustrative sample stories show how future verified school notices and updates may be presented.</p>
          </div>
          <p className="sample-note">Sample announcements and dates below are illustrative, not confirmed school notices.</p>
          <div className="news-feature"><img src={images.newsFeature} alt="Illustrative classroom learning scene; not a verified Siddhant High School classroom"/><div><span className="tag">Illustrative editorial image</span><h2>Updates for a connected school community</h2><p>When official information is supplied, this space can bring together useful notices, learning updates and community news.</p></div></div>
          <div className="announcement-list">{newsList.map((item) => {
            const isLatest = item.id === latestAnnouncement?.id;
            return (
              <article
                key={item.id}
                id={isLatest ? "latest-announcement" : undefined}
                className={isLatest ? "announcement-article is-latest" : "announcement-article"}
                tabIndex={isLatest ? -1 : undefined}
                aria-label={isLatest ? "Latest school announcement" : undefined}
              >
                <div>
                  <span className="tag">{item.category}</span>
                  {isLatest && <span className="latest-announcement-label">Latest</span>}
                  {item.is_urgent && (
                    <span
                      className="latest-announcement-label"
                      style={{ backgroundColor: "#e11d48", color: "#fff", marginLeft: "6px" }}
                    >
                      Urgent
                    </span>
                  )}
                  <time>{item.date}</time>
                </div>
                <section>
                  <h2>{item.title}</h2>
                  <p>{item.summary || item.content}</p>
                </section>
              </article>
            );
          })}</div>
        </section>

        )}

        {page === "/admissions" && (
        <section className="admissions-section" id="admissions">
          <div className="admissions-intro">
            <div>
              <p className="eyebrow light">Admissions</p>
              <h1 className="page-title">
                Begin a meaningful
                <br />
                <em>learning journey.</em>
              </h1>
            </div>
            <p>
              Apply online or ask our school team a question. Choose the form that best matches what
              you would like to do today.
            </p>
          </div>
          <div className="admissions-guidance"><div><article><span>01</span><h3>Choose a form</h3><p>Select Online Admission Form to provide student and parent details, class choice, address and supporting documents.</p></article><article><span>02</span><h3>Prepare documents</h3><p>Have the requested supporting documents ready. Accepted formats and per-file limits are shown beside the upload fields.</p></article><article><span>03</span><h3>Review before submitting</h3><p>Check that details are complete and accurate. Class options are listed in the application form; ask the school to confirm any questions.</p></article></div></div>
          <p className="form-demo-note">Demonstration only: submissions are not transmitted or stored. A unique Application ID requires a future school submission system.</p>
          <div className="form-shell">
            <div className="form-tabs" role="tablist" aria-label="Admissions forms">
              <button
                role="tab"
                aria-selected={admissionTab === "application"}
                className={admissionTab === "application" ? "active" : ""}
                onClick={() => chooseAdmissionTab("application")}
              >
                <span>01</span>
                <div>
                  <strong>Online Admission Form</strong>
                  <small>Complete a student application</small>
                </div>
              </button>
              <button
                role="tab"
                aria-selected={admissionTab === "enquiry"}
                className={admissionTab === "enquiry" ? "active" : ""}
                onClick={() => chooseAdmissionTab("enquiry")}
              >
                <span>02</span>
                <div>
                  <strong>General Enquiry Form</strong>
                  <small>Ask the school team a question</small>
                </div>
              </button>
            </div>
            <div className="form-content" role="tabpanel">
              <div className="form-content-heading">
                <p className="eyebrow">
                  {admissionTab === "application" ? "Online application" : "General enquiry"}
                </p>
                <h2>
                  {admissionTab === "application"
                    ? "Student admission application"
                    : "How may we help?"}
                </h2>
                <p>
                  {admissionTab === "application"
                    ? "Complete all required fields and attach the supporting documents before submitting."
                    : "Complete the six fields in this demonstration form. Your enquiry will not be sent to the school."}
                </p>
              </div>
              {admissionTab === "application" ? <AdmissionForm /> : <EnquiryForm />}
            </div>
          </div>
        </section>
        )}

        {page === "/principal-message" && (
          <section className="principal-page section">
            <figure className="principal-portrait"><img src={images.principalMessage} alt="Male school principal seated at his office desk"/><figcaption>Principal speaking at a school event</figcaption></figure>
            <article><p className="eyebrow">Principal's Message</p><h1>A welcoming message to every learner and family.</h1><p className="sample-note">Illustrative message pending review and approval by the school. The accompanying educator portrait is representative and does not depict the principal.</p><blockquote className="principal-quote">“Every learner should feel encouraged to ask questions, discover strengths and treat others with respect.”</blockquote><p className="lead">Dear Students and Families,</p><p>Welcome to Siddhant High School. Education is a shared journey built on curiosity, care and the confidence to keep learning. We hope every student finds encouragement to ask questions, develop their strengths and treat others with respect.</p><p>Our school community can make each day meaningful when students, families and educators work together. We look forward to supporting young people as they learn, grow and discover ways to contribute with purpose.</p><p>With warm wishes,</p><p className="principal-signature"><strong>Principal</strong><br/>Siddhant High School</p></article>
          </section>
        )}

        {page === "/events" && (
          <section className="events-page section">
            <div className="events-heading">
              <div><p className="eyebrow">Events &amp; Calendar</p><h1>School dates &amp; <em>gatherings.</em></h1></div>
              <p>Events published by the school are shown here.</p>
            </div>
            <div className="calendar-layout">
              <section className="calendar-panel" id="events-calendar" aria-label="Monthly calendar">
                <div className="calendar-toolbar">
                  <button type="button" aria-label="Previous month" onClick={() => { setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)); setSelectedDate(null); }}>Previous</button>
                  <h2>{monthLabel}</h2>
                  <button type="button" aria-label="Next month" onClick={() => { setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)); setSelectedDate(null); }}>Next</button>
                </div>
                <div className="calendar-weekdays">{"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => <span key={day}>{day}</span>)}</div>
                <div className="calendar-grid">
                  {Array.from({ length: calendarLeadingDays }, (_, index) => <span className="calendar-empty" aria-hidden="true" key={`empty-${index}`} />)}
                  {calendarDates.map((date) => {
                    const event = calendarEvents.find((item) => item.date === date);
                    const day = Number(date.slice(-2));
                    return <button type="button" className={`calendar-date ${event ? "has-event" : ""} ${selectedDate === date ? "selected" : ""}`} aria-pressed={selectedDate === date} aria-label={`${date}${event ? `, event: ${event.title}` : ", no event"}`} key={date} onClick={() => setSelectedDate(date)}><span>{day}</span>{event && <i aria-hidden="true" />}</button>;
                  })}
                </div>
                <p className="calendar-legend"><i aria-hidden="true" /> Event date</p>
              </section>
              <aside className="calendar-detail" aria-live="polite" aria-label="Selected date details">
                <p className="eyebrow">Selected date</p>
                {selectedDate ? <time className="calendar-detail-date">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</time> : <p className="calendar-empty-state">Choose a date to view its details.</p>}
                {selectedEvent ? <><span className="calendar-sample-tag">School event</span><h2>{selectedEvent.title}</h2><p className="calendar-category">{selectedEvent.category}</p><p>{selectedEvent.description || "More details will be shared by the school."}</p></> : selectedDate ? <p className="calendar-empty-state">No event is scheduled for this date.</p> : null}
              </aside>
            </div>
            <section className="upcoming-events" aria-labelledby="upcoming-events-title">
              <div className="upcoming-events-heading"><div><p className="eyebrow">Plan ahead</p><h2 id="upcoming-events-title">Upcoming events</h2></div><p>Events added by the school will appear here.</p></div>
              {upcomingEvents.length ? (
                <div className="upcoming-event-list">
                  {upcomingEvents.map((event) => (
                    <article className={selectedDate === event.date ? "is-selected" : ""} key={event.date}>
                      <time dateTime={event.date}>{new Date(`${event.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
                      <div><span className="upcoming-event-category">{event.category}</span><h3>{event.title}</h3><p>{event.description || "More details will be shared by the school."}</p></div>
                      <button type="button" aria-pressed={selectedDate === event.date} aria-label={`Show ${event.title} on the calendar`} onClick={() => { const date = new Date(`${event.date}T12:00:00`); setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1)); setSelectedDate(event.date); document.getElementById("events-calendar")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" }); }}>View in calendar <Arrow /></button>
                    </article>
                  ))}
                </div>
              ) : <p className="upcoming-empty-state">There are no upcoming events at the moment.</p>}
            </section>
          </section>
        )}
        {page === "/contact" && (
          <section className="section contact-page">
            <div className="section-heading">
              <p className="eyebrow">Contact Us</p>
              <h1>Contact Siddhant High School</h1>
              <p>Get in touch with Siddhant High School using the information provided by the school.</p>
            </div>
            <div className="contact-page-layout">
              <div className="contact-school-brand">
                <img src={logo} alt="Siddhant High School logo" />
                <h2>Siddhant High School</h2>
                <p>Operated by Shubham Education &amp; Welfare Society</p>
              </div>
              <dl className="contact-details">
                <div><dt>Phone</dt><dd>[Official contact number to be provided]</dd></div>
                <div><dt>Email</dt><dd>[Official school email to be provided]</dd></div>
                <div><dt>Address</dt><dd>[Official school address to be provided]</dd></div>
                <div><dt>Office hours</dt><dd>[Office hours to be confirmed]</dd></div>
              </dl>
            </div>
            <div className="location-placeholder" role="img" aria-label="Map location placeholder">
              <strong>Location map</strong><span>Official school location and map to be provided by Siddhant High School.</span>
            </div>
            <button className="button primary" type="button" onClick={() => openAdmissions("enquiry")}>
              Send an Enquiry <Arrow />
            </button>
          </section>
        )}

        {!knownRoutes.has(page) && (
          <section className="section placeholder-page not-found-page">
            <p className="eyebrow">Page not found</p>
            <h1>We couldn't find that page.</h1>
            <RouteLink className="button primary" to="/">Return to Home <Arrow /></RouteLink>
          </section>
        )}
      </main>

      <footer id="footer">
        <div className="footer-main">
          <div className="footer-identity">
            <RouteLink className="footer-brand" to="/" aria-label="Siddhant High School home">
              <img src={logo} alt="Siddhant High School logo" />
              <span>
                <strong>Siddhant High School</strong>
                <small>Knowledge &middot; Character &middot; Purpose</small>
              </span>
            </RouteLink>
            <p className="footer-introduction">
              An environment where curiosity is encouraged, character is nurtured and every learner is inspired to grow.
            </p>
          </div>

          <nav className="footer-column" aria-label="Explore">
            <h4>Explore</h4>
            <div className="footer-link-list">
              {footerExplorePages.map(([label, path]) => (
                <RouteLink key={path} to={path}>{label}</RouteLink>
              ))}
            </div>
          </nav>

          <nav className="footer-column" aria-label="School Life">
            <h4>School Life</h4>
            <div className="footer-link-list">
              {footerSchoolLifePages.map(([label, path]) => (
                <RouteLink key={path} to={path}>{label}</RouteLink>
              ))}
            </div>
          </nav>

          <div className="footer-column footer-contact">
            <h4>Contact &amp; Admissions</h4>
            <div className="footer-link-list">
              <RouteLink to="/contact">Contact Us</RouteLink>
              <RouteLink to="/admissions">Admissions</RouteLink>
              <RouteLink to="/admissions?form=application">Online Admission</RouteLink>
              <RouteLink to="/admissions?form=enquiry">General Enquiry</RouteLink>
            </div>
            <p className="footer-office-hours"><span>Office hours</span>8:00 AM &ndash; 2:00 PM</p>
            <div className="footer-admissions-cta">
              <p>Begin your journey with Siddhant High School.</p>
              <div>
                <RouteLink className="footer-action-primary" to="/admissions?form=application">Apply for Admission <Arrow /></RouteLink>
                <RouteLink className="footer-action-secondary" to="/admissions?form=enquiry">Send an Enquiry <Arrow /></RouteLink>
              </div>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>&copy; 2026 Siddhant High School. All rights reserved.</span>
          <span>Operated by Shubham Education &amp; Welfare Society.</span>
        </div>
      </footer>
    </div>
    </NavigationContext.Provider>
  );
}
