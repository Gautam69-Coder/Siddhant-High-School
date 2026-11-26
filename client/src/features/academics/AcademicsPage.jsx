import Arrow from "../../components/ui/Arrow";
import Icon from "../../components/ui/Icon";
import { images } from "../../data/siteImages";
import { learningPillars } from "../../data/siteContent";

export default function AcademicsPage() {
  return (
<section className="academics section" id="academics">
          <div className="section-heading centered academics-heading">
            <p className="eyebrow">Academics &amp; Curriculum</p>
            <h1 className="page-title">
              A foundation for <em>every future.</em>
            </h1>
            <p>
              Balanced learning experiences help students develop understanding, confidence and the
              habits of thoughtful inquiry.
            </p>
          </div>
          <div className="academic-grid">
            {learningPillars.map(([n, icon, title, text]) => (
              <article className="academic-card" key={title}>
                <span className="card-number">{n}</span>
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{text}</p>
                <span className="academic-card-mark" aria-hidden="true"><Arrow /></span>
              </article>
            ))}
          </div>
          <div className="learning-areas"><p className="eyebrow">Illustrative learning areas &middot; pending school confirmation</p><div>{[["01", "Reading & communication"], ["02", "Science & inquiry"], ["03", "Digital exploration"], ["04", "Creative practice & collaboration"]].map(([number, title]) => <span key={title}><b>{number}</b>{title}</span>)}</div></div>
          <div className="academics-photo-row"><figure><img src={images.library} alt="Representative library and reading space"/><figcaption>Reading &amp; independent learning</figcaption></figure><figure><img src={images.science} alt="Representative hands-on science activity"/><figcaption>Inquiry &amp; exploration</figcaption></figure></div>
          <section className="academics-detail" aria-labelledby="academic-practice-title">
            <div className="academics-detail-heading"><p className="sample-note">Illustrative approach; no board, syllabus, class structure or examination system is specified.</p><h2 id="academic-practice-title">How learning is <em>supported.</em></h2><p>Teaching, feedback and wider experiences each play a part in helping learners make progress.</p></div>
            <div className="academic-practice">
              <article className="academic-practice-feature"><figure><img src={images.academicsClassroom} alt="Teacher leading a classroom lesson"/><figcaption>Illustrative classroom image</figcaption></figure><div><Icon name="book"/><h3>Teaching &amp; learning</h3><p>A balanced approach may combine clear explanation, guided practice, discussion, inquiry and opportunities to create.</p></div></article>
              <div className="academic-practice-list">{[["Progress & feedback", "light", "Regular feedback and reflection can help learners understand progress and identify next steps; assessment arrangements await official details."], ["Academic support", "globe", "Responsive guidance and communication with families can help address different learning needs."], ["Co-curricular learning", "palette", "Learning can extend through projects, reading, arts, sports and shared activities beyond lessons."]].map(([title, icon, text], index) => <article key={title}><span>0{index + 2}</span><Icon name={icon}/><div><h3>{title}</h3><p>{text}</p></div></article>)}</div>
            </div>
          </section>
        </section>
  );
}
