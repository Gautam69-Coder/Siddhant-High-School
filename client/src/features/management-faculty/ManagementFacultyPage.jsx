import Icon from "../../components/ui/Icon";
import { images } from "../../data/siteImages";

export default function ManagementFacultyPage() {
  return (
<section className="management section" id="management">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Management &amp; Faculty</p>
              <h1 className="page-title">
                Guided by <em>care and purpose.</em>
              </h1>
            </div>
            <p>
              Our school community is supported by committed educators and administrators who place
              student growth, safety and meaningful learning at the centre of their work.
            </p>
          </div>
          <div className="management-showcase">
          <figure className="management-visual"><img src={images.facultyGroup} alt="Group of faculty members gathered together"/><figcaption>Faculty group photograph</figcaption></figure>
          <div className="management-grid">
            {[
              [
                "01",
                "globe",
                "School Management",
                "Strategic direction and responsible stewardship under Shubham Education & Welfare Society.",
              ],
              [
                "02",
                "book",
                "Academic Leadership",
                "Curriculum planning, teaching quality and a consistent culture of learning.",
              ],
              [
                "03",
                "light",
                "Teaching Faculty",
                "Subject knowledge, thoughtful guidance and attention to individual learning needs.",
              ],
              [
                "04",
                "trophy",
                "Student Support",
                "Pastoral care, family communication and support for student wellbeing.",
              ],
            ].map(([number, icon, title, text]) => (
              <article key={title}>
                <span>{number}</span>
                <Icon name={icon} />
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            ))}
          </div>
          <p className="sample-note">
            Leadership and faculty profiles will be published when official school information is
            available.
          </p>
          </div>
        </section>
  );
}
