import AdmissionForm from "./AdmissionForm";
import EnquiryForm from "../enquiry/EnquiryForm";
import Arrow from "../../components/ui/Arrow";

export default function AdmissionsPage({ admissionTab, chooseAdmissionTab }) {
  return (
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
  );
}
