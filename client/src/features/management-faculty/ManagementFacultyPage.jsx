import Icon from "../../components/ui/Icon";
import { images } from "../../data/siteImages";

const departmentIcons = {
  Leadership: "globe",
  Robotics: "light",
  Academics: "book",
  Sports: "trophy",
};

export default function ManagementFacultyPage({
  facultyList = [],
  facultyLoading = false,
  facultyError = "",
  onRetry,
}) {
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
        <figure className="management-visual">
          <img src={images.facultyGroup} alt="Group of faculty members gathered together" />
          <figcaption>Siddhant High School Faculty &amp; Leadership</figcaption>
        </figure>

        {facultyLoading ? (
          <p className="upcoming-empty-state" role="status">
            Loading faculty profiles...
          </p>
        ) : facultyError ? (
          <div className="upcoming-empty-state" role="alert">
            <p>{facultyError}</p>
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
        ) : facultyList.length === 0 ? (
          <p className="upcoming-empty-state">
            Faculty profiles are currently being updated by the school.
          </p>
        ) : (
          <div className="management-grid">
            {facultyList.map((member, index) => {
              const number = index + 1 < 10 ? `0${index + 1}` : `${index + 1}`;
              const iconName = departmentIcons[member.department] || "book";
              return (
                <article key={member.id || `${member.full_name}-${index}`}>
                  <span>{number}</span>
                  {member.avatar_url ? (
                    <img
                      src={member.avatar_url}
                      alt={member.full_name}
                      style={{
                        width: "44px",
                        height: "44px",
                        borderRadius: "9999px",
                        objectFit: "cover",
                        marginTop: "12px",
                      }}
                    />
                  ) : (
                    <Icon name={iconName} />
                  )}
                  <h3>{member.full_name}</h3>
                  <p style={{ fontWeight: 600, color: "#0F172A", marginBottom: "6px" }}>
                    {member.designation} &middot; {member.department}
                  </p>
                  {member.qualifications && (
                    <p style={{ marginBottom: "6px" }}>{member.qualifications}</p>
                  )}
                  {member.bio && <p>{member.bio}</p>}
                </article>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
