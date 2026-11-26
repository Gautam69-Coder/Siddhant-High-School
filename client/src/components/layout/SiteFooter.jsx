import Arrow from "../ui/Arrow";
import { footerExplorePages, footerSchoolLifePages } from "../../data/navigation";
import { logo } from "../../data/siteImages";
import { RouteLink } from "../../routing/NavigationContext";

export default function SiteFooter() {
  return (
    <footer id="footer">
      <div className="footer-main">
        <div className="footer-identity">
          <RouteLink className="footer-brand" to="/" aria-label="Siddhant High School home">
            <img src={logo} alt="Siddhant High School logo" />
            <span>
              <strong>Siddhant High School</strong>
              <small>Knowledge &middot; Character &middot; Purpose</small>
            </span>
          </RouteLink>
          <p className="footer-introduction">
            An environment where curiosity is encouraged, character is nurtured and every learner is inspired to grow.
          </p>
        </div>

        <nav className="footer-column" aria-label="Explore">
          <h4>Explore</h4>
          <div className="footer-link-list">
            {footerExplorePages.map(([label, path]) => (
              <RouteLink key={path} to={path}>{label}</RouteLink>
            ))}
          </div>
        </nav>

        <nav className="footer-column" aria-label="School Life">
          <h4>School Life</h4>
          <div className="footer-link-list">
            {footerSchoolLifePages.map(([label, path]) => (
              <RouteLink key={path} to={path}>{label}</RouteLink>
            ))}
          </div>
        </nav>

        <div className="footer-column footer-contact">
          <h4>Contact &amp; Admissions</h4>
          <div className="footer-link-list">
            <RouteLink to="/contact">Contact Us</RouteLink>
            <RouteLink to="/admissions">Admissions</RouteLink>
            <RouteLink to="/admissions?form=application">Online Admission</RouteLink>
            <RouteLink to="/admissions?form=enquiry">General Enquiry</RouteLink>
          </div>
          <p className="footer-office-hours"><span>Office hours</span>8:00 AM &ndash; 2:00 PM</p>
          <div className="footer-admissions-cta">
            <p>Begin your journey with Siddhant High School.</p>
            <div>
              <RouteLink className="footer-action-primary" to="/admissions?form=application">Apply for Admission <Arrow /></RouteLink>
              <RouteLink className="footer-action-secondary" to="/admissions?form=enquiry">Send an Enquiry <Arrow /></RouteLink>
            </div>
          </div>
        </div>
      </div>
      <div className="footer-bottom">
        <span>&copy; 2026 Siddhant High School. All rights reserved.</span>
        <span>Operated by Shubham Education &amp; Welfare Society.</span>
      </div>
    </footer>
  );
}
