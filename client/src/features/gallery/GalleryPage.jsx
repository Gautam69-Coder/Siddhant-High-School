export default function GalleryPage({ galleryCategory, setGalleryCategory, galleryList }) {
  return (
<section className="gallery-section section" id="gallery">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">Gallery</p>
              <h1 className="page-title">
                A glimpse of <em>school life.</em>
              </h1>
            </div>
            <p>
              Moments of learning, movement, creativity and community. Representative photography is
              shown where original school images are not yet available.
            </p>
          </div>
          <div className="gallery-filters" role="group" aria-label="Filter gallery images">{["All", "Campus", "Academics", "Student Activities", "Sports", "Cultural Activities", "Innovation"].map((category) => <button type="button" key={category} aria-pressed={galleryCategory === category} className={galleryCategory === category ? "active" : ""} onClick={() => setGalleryCategory(category)}>{category}</button>)}</div>
          <div className="gallery-grid">
            {galleryList.filter((item) => galleryCategory === "All" || item.category === galleryCategory).map((item, index) => (
              <figure key={item.id || item.title || index}>
                <img src={item.src} alt={item.title} />
                <figcaption>
                  <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                  <p>{item.title} <small>{item.category}</small></p>
                </figcaption>
              </figure>
            ))}
          </div>
        </section>
  );
}
