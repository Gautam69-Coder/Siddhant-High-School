import { useEffect, useRef, useState } from "react";
import Arrow from "../ui/Arrow";
import NewsTicker from "../NewsTicker";
import { logo } from "../../data/siteImages";
import { pages } from "../../data/navigation";
import { RouteLink, useNavigation } from "../../routing/NavigationContext";

const primaryPaths = new Set([
  "/",
  "/about",
  "/vision-mission",
  "/academics",
  "/infrastructure",
  "/gallery",
  "/admissions",
  "/contact",
]);
const primaryPages = pages.filter(([, path]) => primaryPaths.has(path));
const morePages = pages.filter(([, path]) => path !== "/" && !primaryPaths.has(path));

export default function SiteHeader({ page, announcements, onOpenAdmissions }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const desktopMoreRef = useRef(null);
  const mobileMoreRef = useRef(null);
  const { navigate, registerNavigationCleanup } = useNavigation();
  const isMorePageActive = morePages.some(([, path]) => path === page);

  useEffect(() => registerNavigationCleanup(() => {
    setMenuOpen(false);
    desktopMoreRef.current?.removeAttribute("open");
    mobileMoreRef.current?.removeAttribute("open");
  }), [registerNavigationCleanup]);

  useEffect(() => {
    const closeMoreOnOutsideClick = (event) => {
      [desktopMoreRef.current, mobileMoreRef.current].forEach((menu) => {
        if (menu?.open && !menu.contains(event.target)) menu.removeAttribute("open");
      });
    };
    const closeMoreOnEscape = (event) => {
      if (event.key !== "Escape") return;
      [desktopMoreRef.current, mobileMoreRef.current].forEach((menu) => {
        if (menu?.open) {
          menu.removeAttribute("open");
          menu.querySelector("summary")?.focus();
        }
      });
    };
    document.addEventListener("pointerdown", closeMoreOnOutsideClick);
    document.addEventListener("keydown", closeMoreOnEscape);
    return () => {
      document.removeEventListener("pointerdown", closeMoreOnOutsideClick);
      document.removeEventListener("keydown", closeMoreOnEscape);
    };
  }, []);

  return (
    <>
      <div className="topbar">
        <p className="topbar-society">Operated by Shubham Education &amp; Welfare Society</p>
        <NewsTicker onNavigate={navigate} announcements={announcements} />
        <RouteLink className="topbar-urgent-badge" to="/news?highlight=latest" aria-label="Urgent notice. View the latest announcement">
          <svg viewBox="0 0 20 20" aria-hidden="true" focusable="false"><path d="M3 8v4h4l6 4V4L7 8H3Zm4 4 1.2 4h2L9 12m6-5a4 4 0 0 1 0 6" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" /></svg>
          Urgent Notice
        </RouteLink>
      </div>

      <header className="site-header">
        <RouteLink className="brand" to="/" aria-label="Siddhant High School home">
          <img src={logo} alt="Original Siddhant High School logo" />
          <span className="brand-copy">
            <strong>Siddhant High School</strong>
            <small>Knowledge Â· Character Â· Purpose</small>
          </span>
        </RouteLink>
        <nav className="desktop-nav" aria-label="Primary navigation">
          {primaryPages.map(([label, path]) => (
            <RouteLink key={path} to={path} className={page === path ? "active" : ""} aria-current={page === path ? "page" : undefined}>
              {label}
            </RouteLink>
          ))}
          <details className={`desktop-more ${isMorePageActive ? "is-active" : ""}`} ref={desktopMoreRef}>
            <summary aria-label="More pages" aria-current={isMorePageActive ? "page" : undefined}>More</summary>
            <div>
              {morePages.map(([label, path]) => (
                <RouteLink
                  key={path}
                  to={path}
                  className={page === path ? "active" : ""}
                  aria-current={page === path ? "page" : undefined}
                  onClick={(event) => event.currentTarget.closest("details")?.removeAttribute("open")}
                >
                  {label}
                </RouteLink>
              ))}
            </div>
          </details>
        </nav>
        <button className="button primary header-cta" onClick={() => onOpenAdmissions("enquiry")}>
          Admission Enquiry <Arrow />
        </button>
        <button
          className="menu-button"
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
        >
          <span />
          <span />
          <span />
        </button>
        {menuOpen && (
          <nav className="mobile-nav" aria-label="Mobile navigation">
            {primaryPages.map(([label, path]) => (
              <RouteLink key={path} to={path} className={page === path ? "active" : ""} aria-current={page === path ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                {label}
              </RouteLink>
            ))}
            <details className={`mobile-more ${isMorePageActive ? "is-active" : ""}`} ref={mobileMoreRef}>
              <summary aria-label="More pages" aria-current={isMorePageActive ? "page" : undefined}>More</summary>
              <div>
                {morePages.map(([label, path]) => (
                  <RouteLink key={path} to={path} className={page === path ? "active" : ""} aria-current={page === path ? "page" : undefined} onClick={() => setMenuOpen(false)}>
                    {label}
                  </RouteLink>
                ))}
              </div>
            </details>
            <button
              className="button primary"
              onClick={() => {
                onOpenAdmissions("enquiry");
              }}
            >
              Admission Enquiry
            </button>
          </nav>
        )}
      </header>
    </>
  );
}
