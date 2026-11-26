import Arrow from "../../components/ui/Arrow";
import Icon from "../../components/ui/Icon";
import { RouteLink } from "../../routing/NavigationContext";
import { sampleNews, learningPillars } from "../../data/siteContent";
import { images } from "../../data/siteImages";
import { getLocalDateInputValue } from "../../components/forms/formValidation";

export default function HomePage({ openAdmissions, calendarEvents }) {
  return (
    <>
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
    </>
  );
}
