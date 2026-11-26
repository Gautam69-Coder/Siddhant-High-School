import { images } from "../../data/siteImages";

export default function InfrastructurePage() {
  return (
<section className="facilities section" id="facilities">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Infrastructure &amp; Facilities</p>
              <h1 className="page-title">
                Designed for <em>discovery.</em>
              </h1>
            </div>
            <p>
              Thoughtfully planned learning spaces create room for concentration, collaboration,
              movement and imagination.
            </p>
          </div>
          <p className="sample-note">The descriptions below and the photographs are representative examples only. They do not confirm that any specific facility is available at Siddhant High School.</p>
          <div className="facility-showcase">
            {[
              [images.campusLearningSpaces, "Campus & Learning Spaces", "Siddhant High School campus building", "Welcoming settings can support focused study, collaboration and the everyday rhythm of school life."],
              [images.science, "Science & Discovery", "Representative science image", "Practical learning spaces may help students observe, investigate questions and test ideas."],
              [images.computing, "Digital Learning & Technology", "Representative digital learning image", "Age-appropriate digital resources can help learners research, create and develop technology skills."],
              [images.facilityLibrary, "Library & Reading Resources", "Students reading together in a school library", "A reading environment can encourage independent learning, communication and a lasting interest in books."],
              [images.facilitySports, "Sports & Recreation", "Students taking part in an outdoor school race", "Spaces for movement can support physical wellbeing, participation and teamwork."],
              [images.facilityArts, "Arts & Creative Spaces", "Students working together on art", "Creative environments can make room for visual expression, music, performance and making."],
            ].map(([src, title, alt, description], index) => (
              <article key={title}>
                <figure><img src={src} alt={alt} /><figcaption>Illustrative image &middot; facility pending confirmation</figcaption></figure>
                <div><span>0{index + 1}</span><h2>{title}</h2><p>{description}</p></div>
              </article>
            ))}
          </div>
        </section>
  );
}
