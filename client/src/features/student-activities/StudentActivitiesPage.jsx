import Arrow from "../../components/ui/Arrow";
import Icon from "../../components/ui/Icon";
import RepresentativeImage from "../../components/ui/RepresentativeImage";
import { RouteLink } from "../../routing/NavigationContext";
import { images } from "../../data/siteImages";

export default function StudentActivitiesPage() {
  return (
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
  );
}
