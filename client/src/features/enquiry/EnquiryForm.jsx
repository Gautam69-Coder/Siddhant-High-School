import { useRef, useState } from "react";
import enquiryService from "../../services/enquiryService";
import Arrow from "../../components/ui/Arrow";
import SuccessPanel from "../../components/forms/SuccessPanel";
import FieldError from "../../components/forms/FieldError";
import { fieldAccessibility, getFormErrors, sanitizePhoneInput } from "./enquiryValidation";

export default function EnquiryForm() {
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