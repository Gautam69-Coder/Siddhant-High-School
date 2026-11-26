import Arrow from "../../components/ui/Arrow";
import Icon from "../../components/ui/Icon";
import { RouteLink } from "../../routing/NavigationContext";

export default function VisionMissionPage() {
  return (
<section className="vision-values" id="vision">
          <p className="sample-note vision-sample-note">Illustrative vision, mission and values wording pending review and approval by the school.</p>
          <header className="vision-page-heading"><p className="eyebrow">Vision &amp; Mission</p><h1>A thoughtful direction for learning and growth.</h1><p>Learning shaped by curiosity, character and care for each learner's potential.</p></header>
          <div className="vision-panel">
            <p className="eyebrow light">Our direction</p>
            <div className="vision-block">
              <span className="vision-icon"><Icon name="light" /></span>
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
              <span className="vision-icon"><Icon name="globe" /></span>
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
          <section className="educational-philosophy" aria-labelledby="philosophy-title">
            <div><p className="eyebrow">Educational philosophy &middot; illustrative</p><h2 id="philosophy-title">Learn with curiosity, <em>practice and reflection.</em></h2></div>
            <p>Build understanding, explore ideas, and reflect on what comes next. This sample wording is pending school review.</p>
          </section>
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
          <div className="vision-next-step"><p>See how these ideas inform the learning approach.</p><RouteLink className="arrow-link" to="/academics">Explore Academics &amp; Curriculum <Arrow /></RouteLink></div>
        </section>
  );
}
