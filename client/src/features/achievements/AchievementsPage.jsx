import RepresentativeImage from "../../components/ui/RepresentativeImage";
import { images } from "../../data/siteImages";

export default function AchievementsPage() {
  return (
<section className="achievements">
          <header className="achievement-title">
            <p className="eyebrow">Student Achievements</p>
            <h1 className="page-title">Celebrating every milestone.</h1>
            <p className="achievement-intro">Achievement is shaped by curiosity, dedication, creativity, participation and the determination to keep growing.</p>
          </header>
          <div className="achievement-gallery" aria-label="Illustrative awards and student recognition photographs">
            <figure>
              <RepresentativeImage src={images.achievementTrophy} alt="Gold trophy and medals displayed as representative achievement imagery; not a Siddhant High School award" />
              <figcaption><strong>Awards &amp; Trophies</strong><span>Recognising dedication, effort and excellence.</span></figcaption>
            </figure>
            <figure>
              <RepresentativeImage src={images.achievementRecognition} alt="Students receiving medals and certificates during a representative school award ceremony; not Siddhant High School students or an event" />
              <figcaption><strong>Student Recognition</strong><span>Celebrating the moments that make learning meaningful.</span></figcaption>
            </figure>
          </div>
          <p className="sample-note achievement-sample-note">Photographs and examples are illustrative and do not represent verified Siddhant High School achievements.</p>
          <section className="achievement-areas" aria-labelledby="achievement-areas-title">
            <p className="eyebrow">MORE THAN AWARDS</p>
            <h2 id="achievement-areas-title">Achievement takes many forms.</h2>
            <div className="achievement-areas-grid">
              <article><h3>Academic Progress</h3><p>Recognising curiosity, dedication, consistent effort and progress in learning.</p></article>
              <article><h3>Creative Accomplishments</h3><p>Celebrating imagination, artistic expression, experimentation and original ideas.</p></article>
              <article><h3>Participation &amp; Leadership</h3><p>Valuing teamwork, responsibility, collaboration and meaningful participation.</p></article>
            </div>
          </section>
          <section className="achievement-closing">
            <h2>Every step forward matters.</h2>
            <p>Progress is not measured only by awards. Every effort, new skill, creative idea and act of teamwork is worth recognising.</p>
          </section>
        </section>
  );
}
