import { useEffect, useRef, useState } from "react";
import admissionService from "../../services/admissionService";
import Arrow from "../../components/ui/Arrow";
import SuccessPanel from "../../components/forms/SuccessPanel";
import FieldError from "../../components/forms/FieldError";
import { fieldAccessibility, getAgeOnDate, getFormErrors, sanitizePhoneInput, CLASS_AGE_CRITERIA } from "./admissionValidation";

export default function AdmissionForm() {
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