import { images } from "../../data/siteImages";

export default function NewsPage({ newsList, latestAnnouncement }) {
  return (
<section className="news section" id="news">
          <div className="section-heading split-heading">
            <div>
              <p className="eyebrow">School announcements</p>
              <h1>News &amp; Announcements</h1>
            </div>
            <p>Illustrative sample stories show how future verified school notices and updates may be presented.</p>
          </div>
          <p className="sample-note">Sample announcements and dates below are illustrative, not confirmed school notices.</p>
          <div className="news-feature"><img src={images.newsFeature} alt="Illustrative classroom learning scene; not a verified Siddhant High School classroom"/><div><span className="tag">Illustrative editorial image</span><h2>Updates for a connected school community</h2><p>When official information is supplied, this space can bring together useful notices, learning updates and community news.</p></div></div>
          <div className="announcement-list">{newsList.map((item) => {
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
          })}</div>
        </section>
  );
}
