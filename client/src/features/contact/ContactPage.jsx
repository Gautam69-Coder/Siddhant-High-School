import Arrow from "../../components/ui/Arrow";
import { logo } from "../../data/siteImages";

export default function ContactPage({
  openAdmissions,
  schoolSettings,
  settingsLoading = false,
}) {
  const schoolName = schoolSettings?.school_name || "Siddhant High School";
  const societyName = schoolSettings?.society_name || "Shubham Education & Welfare Society";
  const phone = schoolSettings?.epabx_lines;
  const email = schoolSettings?.contact_email;
  const address = schoolSettings?.campus_address;
  const officeHours = schoolSettings?.office_hours;
  const affiliation = schoolSettings?.affiliation_number;
  const mapUrl = schoolSettings?.map_embed_url;

  return (
    <section className="section contact-page">
      <div className="section-heading">
        <p className="eyebrow">Contact Us</p>
        <h1>Contact {schoolName}</h1>
        <p>Get in touch with {schoolName} using our official school contact details.</p>
      </div>
      <div className="contact-page-layout">
        <div className="contact-school-brand">
          <img src={logo} alt={`${schoolName} logo`} />
          <h2>{schoolName}</h2>
          <p>Operated by {societyName}</p>
          {affiliation && <p>Affiliation No.: {affiliation}</p>}
        </div>
        <dl className="contact-details">
          <div>
            <dt>Phone</dt>
            <dd>
              {settingsLoading ? (
                "Loading..."
              ) : phone ? (
                <a href={`tel:${phone.replace(/[^+\d]/g, "")}`}>{phone}</a>
              ) : (
                "Available upon school confirmation"
              )}
            </dd>
          </div>
          <div>
            <dt>Email</dt>
            <dd>
              {settingsLoading ? (
                "Loading..."
              ) : email ? (
                <a href={`mailto:${email}`}>{email}</a>
              ) : (
                "Available upon school confirmation"
              )}
            </dd>
          </div>
          <div>
            <dt>Address</dt>
            <dd>
              {settingsLoading
                ? "Loading..."
                : address || "Available upon school confirmation"}
            </dd>
          </div>
          <div>
            <dt>Office hours</dt>
            <dd>
              {settingsLoading
                ? "Loading..."
                : officeHours || "8:00 AM – 2:00 PM"}
            </dd>
          </div>
        </dl>
      </div>

      {mapUrl ? (
        <div className="location-placeholder">
          <iframe
            src={mapUrl}
            title={`${schoolName} campus location map`}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            style={{ width: "100%", height: "320px", border: 0, borderRadius: "12px" }}
          />
        </div>
      ) : (
        <div className="location-placeholder" role="region" aria-label="Campus address">
          <strong>Campus Location</strong>
          <span>
            {address || `${schoolName} campus address will appear here once updated by the school.`}
          </span>
        </div>
      )}

      <button className="button primary" type="button" onClick={() => openAdmissions("enquiry")}>
        Send an Enquiry <Arrow />
      </button>
    </section>
  );
}
