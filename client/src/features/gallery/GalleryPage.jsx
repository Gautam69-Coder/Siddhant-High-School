import { useMemo, useState } from "react";

export default function GalleryPage({
  galleryCategory,
  setGalleryCategory,
  galleryList = [],
  galleryLoading = false,
  galleryError = "",
  onRetry,
}) {
  const [failedImageIds, setFailedImageIds] = useState(() => new Set());

  const categories = useMemo(() => {
    const unique = [];
    const seen = new Set();
    for (const item of galleryList) {
      if (item.category && !seen.has(item.category)) {
        seen.add(item.category);
        unique.push(item.category);
      }
    }
    return ["All", ...unique];
  }, [galleryList]);

  const activeCategory = categories.includes(galleryCategory) ? galleryCategory : "All";
  const filteredItems = useMemo(
    () =>
      galleryList.filter(
        (item) => activeCategory === "All" || item.category === activeCategory
      ),
    [activeCategory, galleryList]
  );

  const handleImageError = (itemKey) => {
    setFailedImageIds((prev) => {
      if (prev.has(itemKey)) return prev;
      const next = new Set(prev);
      next.add(itemKey);
      return next;
    });
  };

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
          Photographs published by Siddhant High School showcasing campus spaces, learning,
          sports, cultural events, and student activities.
        </p>
      </div>

      {categories.length > 1 && (
        <div className="gallery-filters" role="group" aria-label="Filter gallery images">
          {categories.map((category) => (
            <button
              type="button"
              key={category}
              aria-pressed={activeCategory === category}
              className={activeCategory === category ? "active" : ""}
              onClick={() => setGalleryCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
      )}

      {galleryLoading ? (
        <p className="upcoming-empty-state" role="status">
          Loading gallery photographs...
        </p>
      ) : galleryError ? (
        <div className="upcoming-empty-state" role="alert">
          <p>{galleryError}</p>
          {onRetry && (
            <button
              type="button"
              className="button outline-blue"
              style={{ marginTop: "12px" }}
              onClick={onRetry}
            >
              Retry
            </button>
          )}
        </div>
      ) : filteredItems.length === 0 ? (
        <p className="upcoming-empty-state">
          No gallery photographs have been published yet.
        </p>
      ) : (
        <div className="gallery-grid">
          {filteredItems.map((item, index) => {
            const itemKey = item.id || `${item.title}-${index}`;
            const isBroken = !item.src || failedImageIds.has(itemKey);

            return (
              <figure key={itemKey}>
                {isBroken ? (
                  <div
                    className="image-fallback"
                    role="img"
                    aria-label={`${item.title} image unavailable`}
                    style={{
                      width: "100%",
                      height: "100%",
                      minHeight: "220px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      background: "#e2e8f0",
                      color: "#334155",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    <span>Image unavailable</span>
                  </div>
                ) : (
                  <img
                    src={item.src}
                    alt={item.title}
                    loading="lazy"
                    onError={() => handleImageError(itemKey)}
                  />
                )}
                <figcaption>
                  <span>{index + 1 < 10 ? `0${index + 1}` : index + 1}</span>
                  <p>
                    {item.title} <small>{item.category}</small>
                  </p>
                </figcaption>
              </figure>
            );
          })}
        </div>
      )}
    </section>
  );
}
