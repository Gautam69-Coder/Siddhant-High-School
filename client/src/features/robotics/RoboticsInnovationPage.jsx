import Icon from "../../components/ui/Icon";
import RepresentativeImage from "../../components/ui/RepresentativeImage";
import { images } from "../../data/siteImages";

export default function RoboticsInnovationPage() {
  return (
<section className="innovation section">
          <div className="innovation-image">
            <RepresentativeImage src={images.roboticsInnovation} alt="Teacher and students exploring an educational robot" />
            <span className="vertical-label">Ideas into action</span>
          </div>
          <div className="innovation-copy">
            <p className="eyebrow">Robotics &amp; Innovation</p>
            <h1 className="page-title">
              Learning to make,
              <br />
              test and <em>imagine.</em>
            </h1>
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
            <p className="sample-note">Illustrative learning topics and project examples; specific facilities and programmes are pending school confirmation.</p>
            <div className="innovation-topic-grid">{[["Robotics & coding", "Explore instructions, simple systems and computational thinking."], ["Experimentation", "Ask questions, test ideas, observe results and reflect."], ["Design thinking", "Understand a challenge, imagine options and refine a solution."], ["Project showcases", "Example projects may include a simple moving model or a sensor-based prototype; these are illustrative only."]].map(([title, text]) => <article key={title}><h3>{title}</h3><p>{text}</p></article>)}</div>
          </div>
        </section>
  );
}
