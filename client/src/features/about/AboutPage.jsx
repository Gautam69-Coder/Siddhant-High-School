import Arrow from "../../components/ui/Arrow";
import { RouteLink } from "../../routing/NavigationContext";
import { images } from "../../data/siteImages";

export default function AboutPage() {
  return (
    <>
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
<section className="about-commitment section">
            <div className="about-commitment-heading"><p className="eyebrow">Growing as a whole person</p><h2>Learning shaped by <em>curiosity, care and purpose.</em></h2><p>These illustrative themes preview the values-led approach described on the Vision &amp; Mission page.</p></div>
            <div className="about-principles">{[["01", "Curiosity", "Ask thoughtful questions, explore ideas and keep a lifelong interest in learning."], ["02", "Character", "Practice integrity, respect and compassion in everyday choices."], ["03", "Belonging", "Learn with others, share responsibility and contribute to a supportive community."]].map(([number, title, text]) => <article key={title}><span>{number}</span><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
            <RouteLink className="arrow-link" to="/vision-mission">Explore Vision &amp; Mission <Arrow /></RouteLink>
          </section>
    </>
  );
}
