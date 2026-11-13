import { useState } from "react";
import logo from "./assets/siddhant-school-logo.jpg";

const images = {
  hero: "https://images.unsplash.com/photo-1786013522160-00ac876da3ab?auto=format&fit=crop&w=2200&q=90",
  classroom:
    "https://images.unsplash.com/photo-1709290749293-c6152a187b14?auto=format&fit=crop&w=1400&q=85",
  campus:
    "https://images.unsplash.com/photo-1764025851527-78f9d7c52bc5?auto=format&fit=crop&w=1600&q=85",
  architecture:
    "https://images.unsplash.com/photo-1787151892072-4f69130f7241?auto=format&fit=crop&w=1400&q=85",
  sports:
    "https://images.unsplash.com/photo-1789215724846-e8b8b44cb860?auto=format&fit=crop&w=1400&q=85",
  culture:
    "https://images.unsplash.com/photo-1774437679833-d3b36d338f71?auto=format&fit=crop&w=1400&q=85",
  community:
    "https://images.unsplash.com/photo-1524069290683-0457abfe42c3?auto=format&fit=crop&w=1400&q=85",
  robotics:
    "https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?auto=format&fit=crop&w=1600&q=85",
};

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

const nav = [
  ["About", "welcome"],
  ["Vision & Values", "vision"],
  ["Academics", "academics"],
  ["Campus", "facilities"],
  ["Activities", "activities"],
  ["Gallery", "gallery"],
  ["Admissions", "admissions"],
];

function SuccessPanel({ title, message, reference, onReset }) {
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
      {reference && (
        <div className="application-reference">
          <small>Application ID</small>
          <strong>{reference}</strong>
          <span>Please save this number for future reference.</span>
        </div>
      )}
      <button className="button primary" type="button" onClick={onReset}>
        {reference ? "Submit another application" : "Send another enquiry"} <Arrow />
      </button>
    </div>
  );
}

function AdmissionForm() {
  const [applicationId, setApplicationId] = useState("");
  const [fileError, setFileError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    const uploads = Array.from(event.currentTarget.querySelectorAll('input[type="file"]')).flatMap(
      (input) => Array.from(input.files ?? []),
    );
    if (uploads.some((file) => file.size > 5 * 1024 * 1024)) {
      setFileError("Please select files smaller than 5 MB.");
      return;
    }
    setFileError("");
    const suffix = Date.now().toString(36).slice(-5) + Math.random().toString(36).slice(2, 6);
    setApplicationId(`SHS-${new Date().getFullYear()}-${suffix.toUpperCase()}`);
  };

  if (applicationId) {
    return (
      <SuccessPanel
        title="Application submitted successfully."
        message="Thank you for applying to Siddhant High School. The admissions team will review the information provided and contact you regarding the next step."
        reference={applicationId}
        onReset={() => setApplicationId("")}
      />
    );
  }

  return (
    <form className="admission-form premium-form" onSubmit={submit}>
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
              minLength={3}
              placeholder="As per official records"
            />
          </label>
          <label>
            Date of birth <b>*</b>
            <input
              name="dateOfBirth"
              type="date"
              required
              max={new Date().toISOString().split("T")[0]}
            />
          </label>
          <label>
            Gender <b>*</b>
            <select name="gender" required defaultValue="">
              <option value="" disabled>
                Select
              </option>
              <option>Female</option>
              <option>Male</option>
              <option>Prefer not to say</option>
            </select>
          </label>
          <label>
            Class applying for <b>*</b>
            <select name="class" required defaultValue="">
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
              minLength={3}
              placeholder="Full name"
            />
          </label>
          <label>
            Relationship <b>*</b>
            <select name="relationship" required defaultValue="">
              <option value="" disabled>
                Select
              </option>
              <option>Mother</option>
              <option>Father</option>
              <option>Legal guardian</option>
            </select>
          </label>
          <label>
            Contact number <b>*</b>
            <input
              name="phone"
              type="tel"
              autoComplete="tel"
              required
              pattern="[0-9+\s-]{10,15}"
              placeholder="+91 98765 43210"
            />
          </label>
          <label className="wide">
            Email address <b>*</b>
            <input
              name="email"
              type="email"
              autoComplete="email"
              required
              placeholder="parent@example.com"
            />
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
            />
          </label>
          <label>
            City <b>*</b>
            <input name="city" autoComplete="address-level2" required placeholder="City" />
          </label>
          <label>
            State <b>*</b>
            <input name="state" autoComplete="address-level1" required placeholder="State" />
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
            />
          </label>
        </div>
      </fieldset>

      <fieldset onChange={() => setFileError("")}>
        <legend>
          <span>04</span>
          Supporting documents
        </legend>
        <p className="field-note">
          Upload clear JPG, PNG or PDF files. Each selected file should be no larger than 5 MB.
        </p>
        {fileError && (
          <p className="form-error" role="alert">
            {fileError}
          </p>
        )}
        <div className="form-grid upload-grid">
          <label>
            Student photograph <b>*</b>
            <input name="studentPhoto" type="file" required accept=".jpg,.jpeg,.png" />
          </label>
          <label>
            Birth certificate <b>*</b>
            <input name="birthCertificate" type="file" required accept=".jpg,.jpeg,.png,.pdf" />
          </label>
          <label className="wide">
            Previous school report
            <input name="schoolReport" type="file" accept=".jpg,.jpeg,.png,.pdf" />
          </label>
        </div>
      </fieldset>

      <label className="consent">
        <input type="checkbox" required />
        <span>
          I confirm that the information provided is accurate and may be reviewed by the school
          admissions team.
        </span>
      </label>
      <button className="button primary form-submit" type="submit">
        Submit Application <Arrow />
      </button>
      <p className="form-disclaimer">
        Prototype form: information and documents are validated in your browser but are not stored
        or transmitted.
      </p>
    </form>
  );
}

function EnquiryForm() {
  const [submitted, setSubmitted] = useState(false);

  if (submitted) {
    return (
      <SuccessPanel
        title="Your enquiry has been submitted."
        message="Thank you for contacting Siddhant High School. A member of the school team will respond using the contact details provided."
        onReset={() => setSubmitted(false)}
      />
    );
  }

  return (
    <form
      className="enquiry-form premium-form"
      onSubmit={(event) => {
        event.preventDefault();
        setSubmitted(true);
      }}
    >
      <div className="form-grid">
        <label>
          Parent name <b>*</b>
          <input
            name="parentName"
            autoComplete="name"
            required
            minLength={3}
            placeholder="Full name"
          />
        </label>
        <label>
          Contact number <b>*</b>
          <input
            name="contactNumber"
            type="tel"
            autoComplete="tel"
            required
            pattern="[0-9+\s-]{10,15}"
            placeholder="+91 98765 43210"
          />
        </label>
        <label>
          Email <b>*</b>
          <input
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="parent@example.com"
          />
        </label>
        <label>
          Interested class <b>*</b>
          <select name="interestedClass" required defaultValue="">
            <option value="" disabled>
              Select class
            </option>
            <option>Pre-Primary</option>
            <option>Primary School</option>
            <option>Middle School</option>
            <option>High School</option>
          </select>
        </label>
        <label className="wide">
          Enquiry category <b>*</b>
          <select name="enquiryCategory" required defaultValue="">
            <option value="" disabled>
              Select category
            </option>
            <option>Admission process</option>
            <option>School visit</option>
            <option>Academics</option>
            <option>Facilities</option>
            <option>General information</option>
          </select>
        </label>
        <label className="full">
          Message <b>*</b>
          <textarea
            name="message"
            required
            minLength={10}
            maxLength={1000}
            rows={5}
            placeholder="How can we help you?"
          />
        </label>
      </div>
      <button className="button primary form-submit" type="submit">
        Submit Enquiry <Arrow />
      </button>
      <p className="form-disclaimer">
        Prototype form: information is validated in your browser but is not stored or transmitted.
      </p>
    </form>
  );
}

export default function App() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [admissionTab, setAdmissionTab] = useState("enquiry");

  const openAdmissions = (tab) => {
    setAdmissionTab(tab);
    setMenuOpen(false);
    window.setTimeout(
      () => document.querySelector("#admissions")?.scrollIntoView({ behavior: "smooth" }),
      0,
    );
  };

  return (
    <div className="min-h-screen bg-white text-[#13213b]">
      <div className="topbar">
        <p>Operated by Shubham Education &amp; Welfare Society</p>
        <div>
          <a href="#news">Announcements</a>
          <span /> <a href="#footer">Contact Us</a>
        </div>
      </div>

      <header className="site-header">
        <a className="brand" href="#top" aria-label="Siddhant High School home">
          <img src={logo} alt="Original Siddhant High School logo" />
          <span className="brand-copy">
            <strong>Siddhant High School</strong>
            <small>Knowledge · Character · Purpose</small>
          </span>
        </a>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {nav.map(([label, id]) => (
            <a key={id} href={`#${id}`}>
              {label}
            </a>
          ))}
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
            {nav.map(([label, id]) => (
              <a key={id} href={`#${id}`} onClick={() => setMenuOpen(false)}>
                {label}
              </a>
            ))}
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
        <section className="hero">
          <img src={images.hero} alt="A spacious contemporary education campus" />
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
              <a className="button white" href="#welcome">
                Discover More <Arrow />
              </a>
              <button
                className="text-link light-link"
                onClick={() => openAdmissions("application")}
              >
                Begin your journey <Arrow />
              </button>
            </div>
          </div>
          <a href="#welcome" className="scroll-cue" aria-label="Scroll to welcome section">
            <span>Explore</span>
            <i />
          </a>
        </section>

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
            <p className="eyebrow">A place to become</p>
            <h2>
              Education that sees
              <br />
              the <em>whole child.</em>
            </h2>
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
            <a className="arrow-link" href="#academics">
              Our approach to learning <Arrow />
            </a>
          </div>
        </section>

        <section className="vision-values" id="vision">
          <div className="vision-panel">
            <p className="eyebrow light">Our direction</p>
            <div className="vision-block">
              <span>01</span>
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
              <span>02</span>
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
        </section>

        <section className="academics section-blue" id="academics">
          <div className="section-heading centered light-heading">
            <p className="eyebrow light">Learning at Siddhant</p>
            <h2>
              A foundation for <em>every future.</em>
            </h2>
            <p>
              Balanced learning experiences help students develop understanding, confidence and the
              habits of thoughtful inquiry.
            </p>
          </div>
          <div className="academic-grid">
            {[
              [
                "01",
                "book",
                "Strong Foundations",
                "Conceptual clarity, language development and numeracy are approached with patience and purpose.",
              ],
              [
                "02",
                "flask",
                "Scientific Inquiry",
                "Hands-on exploration encourages learners to ask better questions and test ideas thoughtfully.",
              ],
              [
                "03",
                "palette",
                "Creative Expression",
                "Art, performance and communication give each student room to discover their individual voice.",
              ],
              [
                "04",
                "globe",
                "Responsible Citizenship",
                "Values, awareness and collaboration prepare students to contribute with empathy and confidence.",
              ],
            ].map(([n, icon, title, text]) => (
              <article className="academic-card" key={title}>
                <span className="card-number">{n}</span>
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{text}</p>
                <a href="#admissions" aria-label={`Explore ${title}`}>
                  <Arrow />
                </a>
              </article>
            ))}
          </div>
        </section>

        <section className="management section" id="management">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Management &amp; faculty</p>
              <h2>
                Guided by <em>care and purpose.</em>
              </h2>
            </div>
            <p>
              Our school community is supported by committed educators and administrators who place
              student growth, safety and meaningful learning at the centre of their work.
            </p>
          </div>
          <div className="management-grid">
            {[
              [
                "01",
                "School Management",
                "Strategic direction and responsible stewardship under Shubham Education & Welfare Society.",
              ],
              [
                "02",
                "Academic Leadership",
                "Curriculum planning, teaching quality and a consistent culture of learning.",
              ],
              [
                "03",
                "Teaching Faculty",
                "Subject knowledge, thoughtful guidance and attention to individual learning needs.",
              ],
              [
                "04",
                "Student Support",
                "Pastoral care, family communication and support for student wellbeing.",
              ],
            ].map(([number, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="sample-note">
            Leadership and faculty profiles will be published when official school information is
            available.
          </p>
        </section>

        <section className="facilities section" id="facilities">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Spaces that inspire</p>
              <h2>
                Designed for <em>discovery.</em>
              </h2>
            </div>
            <p>
              Thoughtfully planned learning spaces create room for concentration, collaboration,
              movement and imagination.
            </p>
          </div>
          <div className="facility-editorial">
            <figure className="facility-large">
              <img src={images.architecture} alt="Contemporary campus architecture" />
              <figcaption>
                <span>01</span>
                <div>
                  <h3>Campus &amp; Learning Spaces</h3>
                  <p>Welcoming settings for focused learning and meaningful exchange.</p>
                </div>
              </figcaption>
            </figure>
            <figure className="facility-small">
              <img src={images.classroom} alt="Students in a classroom" />
              <figcaption>
                <span>02</span>
                <div>
                  <h3>Classrooms &amp; Laboratories</h3>
                  <p>Spaces that make ideas visible and learning active.</p>
                </div>
              </figcaption>
            </figure>
          </div>
          <div className="facility-list" aria-label="Infrastructure and facilities">
            {[
              ["Learning", "Classrooms designed for focused and collaborative work"],
              ["Science", "Practical spaces for observation and experimentation"],
              ["Technology", "Digital learning and age-appropriate innovation resources"],
              ["Library", "A quiet environment for reading and independent study"],
              ["Sports", "Spaces that encourage movement, teamwork and wellbeing"],
              ["Arts", "Room for visual expression, music and performance"],
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
        </section>

        <section className="student-life" id="activities">
          <div className="life-intro">
            <p className="eyebrow light">Beyond the classroom</p>
            <h2>
              Life at Siddhant is
              <br />
              <em>full of possibility.</em>
            </h2>
            <p>
              Movement, expression and shared experiences are an essential part of a complete
              education.
            </p>
            <a className="arrow-link on-dark" href="#gallery">
              Explore the gallery <Arrow />
            </a>
          </div>
          <div className="life-gallery">
            {[
              [images.sports, "Sport & Wellbeing", "Teamwork in motion"],
              [images.culture, "Arts & Culture", "Expression with purpose"],
              [images.community, "Events & Community", "Moments that connect"],
            ].map(([src, title, subtitle], i) => (
              <figure className={`life-card life-${i + 1}`} key={title}>
                <img src={src} alt={title} />
                <div>
                  <span>0{i + 1}</span>
                  <h3>{title}</h3>
                  <p>{subtitle}</p>
                </div>
              </figure>
            ))}
          </div>
        </section>

        <section className="activities-detail section">
          <div className="section-heading centered">
            <p className="eyebrow">Student activities</p>
            <h2>
              Experiences that build <em>confidence.</em>
            </h2>
            <p className="activities-intro">
              A varied activity programme gives students opportunities to collaborate, perform,
              compete, create and serve their community.
            </p>
          </div>
          <div className="activity-cards">
            {[
              ["Sports & Fitness", "Team games, movement and healthy habits."],
              ["Visual & Performing Arts", "Creative practice, presentation and expression."],
              ["Clubs & Interests", "Shared interests explored beyond the timetable."],
              ["Community Events", "School occasions that bring students and families together."],
              ["Leadership", "Age-appropriate responsibility and student voice."],
              ["Innovation", "Making, design challenges and problem-solving."],
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
        </section>

        <section className="innovation section">
          <div className="innovation-image">
            <img src={images.robotics} alt="A student exploring robotics technology" />
            <span className="vertical-label">Ideas into action</span>
          </div>
          <div className="innovation-copy">
            <p className="eyebrow">Robotics &amp; innovation</p>
            <h2>
              Learning to make,
              <br />
              test and <em>imagine.</em>
            </h2>
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
          </div>
        </section>

        <section className="gallery-section section" id="gallery">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Gallery</p>
              <h2>
                A glimpse of <em>school life.</em>
              </h2>
            </div>
            <p>
              Moments of learning, movement, creativity and community. Representative photography is
              shown where original school images are not yet available.
            </p>
          </div>
          <div className="gallery-grid">
            {[
              [images.classroom, "Learning together"],
              [images.architecture, "Campus spaces"],
              [images.sports, "Sport and teamwork"],
              [images.culture, "Creative expression"],
              [images.robotics, "Innovation in action"],
              [images.community, "Community moments"],
            ].map(([src, title], index) => (
              <figure key={title}>
                <img src={src} alt={title} />
                <figcaption>
                  <span>0{index + 1}</span>
                  <p>{title}</p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>

        <section className="achievements">
          <div className="achievement-title">
            <Icon name="trophy" />
            <p className="eyebrow">Celebrating progress</p>
            <h2>
              Every achievement
              <br />
              begins with <em>effort.</em>
            </h2>
          </div>
          <div className="achievement-list">
            {[
              ["Academic Growth", "Recognising persistence, curiosity and thoughtful learning."],
              [
                "Creative Endeavour",
                "Celebrating student expression across art, ideas and performance.",
              ],
              ["Sportsmanship", "Valuing discipline, teamwork, courage and respect."],
            ].map(([title, text], i) => (
              <article key={title}>
                <span>0{i + 1}</span>
                <div>
                  <h3>{title}</h3>
                  <p>{text}</p>
                </div>
                <Arrow />
              </article>
            ))}
          </div>
        </section>

        <section className="news section" id="news">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Stay connected</p>
              <h2>
                News &amp; <em>events.</em>
              </h2>
            </div>
            <p>
              School notices, important dates and stories from our learning community will be shared
              here.
            </p>
          </div>
          <div className="news-grid">
            <article className="news-feature">
              <img src={images.community} alt="Students enjoying a community activity" />
              <div>
                <span className="tag">School Life</span>
                <h3>Discover what makes a school day meaningful</h3>
                <p>Explore the experiences that shape learning, friendship and belonging.</p>
                <a href="#admissions">
                  Read the story <Arrow />
                </a>
              </div>
            </article>
            <div className="updates">
              <article>
                <span className="tag">Admissions</span>
                <h3>Admission enquiries are welcome</h3>
                <p>
                  Connect with our team to learn more about the school and the admission process.
                </p>
                <button onClick={() => openAdmissions("enquiry")}>
                  Enquire now <Arrow />
                </button>
              </article>
              <article>
                <span className="tag">Announcements</span>
                <h3>Latest school updates</h3>
                <p>New notices and upcoming event information will be published here.</p>
                <a href="#footer">
                  Contact the school <Arrow />
                </a>
              </article>
            </div>
          </div>
        </section>

        <section className="admissions-section" id="admissions">
          <div className="admissions-intro">
            <div>
              <p className="eyebrow light">Admissions &amp; enquiry</p>
              <h2>
                Begin a meaningful
                <br />
                <em>learning journey.</em>
              </h2>
            </div>
            <p>
              Apply online or ask our school team a question. Choose the form that best matches what
              you would like to do today.
            </p>
          </div>
          <div className="form-shell">
            <div className="form-tabs" role="tablist" aria-label="Admissions forms">
              <button
                role="tab"
                aria-selected={admissionTab === "application"}
                className={admissionTab === "application" ? "active" : ""}
                onClick={() => setAdmissionTab("application")}
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
                onClick={() => setAdmissionTab("enquiry")}
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
                    : "Complete the six fields below and our team will respond to your enquiry."}
                </p>
              </div>
              {admissionTab === "application" ? <AdmissionForm /> : <EnquiryForm />}
            </div>
          </div>
        </section>
      </main>

      <footer id="footer">
        <div className="footer-main">
          <div className="footer-brand">
            <img src={logo} alt="Siddhant High School logo" />
            <div>
              <h3>Siddhant High School</h3>
              <p>
                Operated by Shubham Education
                <br />
                &amp; Welfare Society
              </p>
            </div>
          </div>
          <div>
            <h4>Explore</h4>
            {nav.slice(0, 5).map(([label, id]) => (
              <a key={id} href={`#${id}`}>
                {label}
              </a>
            ))}
          </div>
          <div>
            <h4>Information</h4>
            <button onClick={() => openAdmissions("application")}>Online Application</button>
            <button onClick={() => openAdmissions("enquiry")}>General Enquiry</button>
            <a href="#news">News &amp; Events</a>
            <a href="#footer">Contact</a>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>
              For address, telephone and visiting hours, please contact the school administration.
            </p>
            <button onClick={() => openAdmissions("enquiry")}>
              Send an enquiry <Arrow />
            </button>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Siddhant High School</span>
          <span>Shubham Education &amp; Welfare Society</span>
        </div>
      </footer>
    </div>
  );
}
