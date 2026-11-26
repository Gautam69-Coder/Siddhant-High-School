import Arrow from "../../components/ui/Arrow";
import Icon from "../../components/ui/Icon";
import RepresentativeImage from "../../components/ui/RepresentativeImage";
import { RouteLink } from "../../routing/NavigationContext";
import { images } from "../../data/siteImages";

export default function SportsCulturalPage() {
  return (
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
  );
}
