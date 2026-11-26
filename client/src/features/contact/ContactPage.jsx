import Arrow from "../../components/ui/Arrow";
import { logo } from "../../data/siteImages";

export default function ContactPage({ openAdmissions }) {
  return (
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
  );
}
