import { images } from "../../data/siteImages";

export default function NewsPage({
  newsList = [],
  latestAnnouncement,
  newsLoading = false,
  newsError = "",
  onRetry,
}) {
  return (
    <section className="news section" id="news">
      <div className="section-heading split-heading">
        <div>
          <p className="eyebrow">School announcements</p>
          <h1>News &amp; Announcements</h1>
        </div>
        <p>Official notices, academic updates, and announcements published by Siddhant High School.</p>
      </div>

      <div className="news-feature">
        <img
          src={images.newsFeature}
          alt="Students learning in a Siddhant High School classroom"
        />
        <div>
          <span className="tag">School Updates</span>
          <h2>Updates for a connected school community</h2>
          <p>
            Stay informed with the latest official circulars, event highlights, and academic
            notices from our school administration.
          </p>
        </div>
      </div>

      {newsLoading ? (
        <p className="upcoming-empty-state" role="status">
          Loading school announcements...
        </p>
      ) : newsError ? (
        <div className="upcoming-empty-state" role="alert">
          <p>{newsError}</p>
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
      ) : newsList.length === 0 ? (
        <p className="upcoming-empty-state">
          There are no announcements published at the moment.
        </p>
      ) : (
        <div className="announcement-list">
          {newsList.map((item) => {
            const isLatest = item.id === latestAnnouncement?.id;
            return (
              <article
                key={item.id}
                id={isLatest ? "latest-announcement" : undefined}
                className={isLatest ? "announcement-article is-latest" : "announcement-article"}
                tabIndex={isLatest ? -1 : undefined}
                aria-label={isLatest ? "Latest school announcement" : undefined}
              >
                <div>
                  <span className="tag">{item.category}</span>
                  {isLatest && <span className="latest-announcement-label">Latest</span>}
                  {item.is_urgent && (
                    <span
                      className="latest-announcement-label"
                      style={{ backgroundColor: "#e11d48", color: "#fff", marginLeft: "6px" }}
                    >
                      Urgent
                    </span>
                  )}
                  <time>{item.date}</time>
                </div>
                <section>
                  <h2>{item.title}</h2>
                  <p>{item.summary || item.content}</p>
                </section>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
