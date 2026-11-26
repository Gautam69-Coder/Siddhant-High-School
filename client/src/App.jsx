import { useCallback, useEffect, useState } from "react";

import calendarEventService from "./services/calendarEventService";
import newsService from "./services/newsService";
import galleryService from "./services/galleryService";
import Arrow from "./components/ui/Arrow";
import { CLASS_AGE_CRITERIA } from "./data/admission";
import { galleryItems, sampleNews } from "./data/siteContent";
import SiteHeader from "./components/layout/SiteHeader";
import SiteFooter from "./components/layout/SiteFooter";
import { NavigationProvider, RouteLink } from "./routing/NavigationContext";
import useClientNavigation from "./routing/useClientNavigation";
import { knownRoutes, pages } from "./data/navigation";
import VisionMissionPage from "./features/vision-mission/VisionMissionPage";
import PrincipalMessagePage from "./features/principal-message/PrincipalMessagePage";
import ManagementFacultyPage from "./features/management-faculty/ManagementFacultyPage";
import AcademicsPage from "./features/academics/AcademicsPage";
import InfrastructurePage from "./features/infrastructure/InfrastructurePage";
import StudentActivitiesPage from "./features/student-activities/StudentActivitiesPage";
import SportsCulturalPage from "./features/sports-cultural/SportsCulturalPage";
import AchievementsPage from "./features/achievements/AchievementsPage";
import RoboticsInnovationPage from "./features/robotics/RoboticsInnovationPage";
import ContactPage from "./features/contact/ContactPage";
import HomePage from "./features/home/HomePage";
import AboutPage from "./features/about/AboutPage";
import GalleryPage from "./features/gallery/GalleryPage";
import AdmissionsPage from "./features/admissions/AdmissionsPage";
import EventsPage from "./features/events/EventsPage";
import NewsPage from "./features/news/NewsPage";

export { CLASS_AGE_CRITERIA };

export default function App() {
  const [galleryCategory, setGalleryCategory] = useState("All");
  const [calendarMonth, setCalendarMonth] = useState(() => new Date(2026, 10, 1));
  const [selectedDate, setSelectedDate] = useState(null);
  const [admissionTab, setAdmissionTab] = useState(() =>
    new URLSearchParams(window.location.search).get("form") === "application" ? "application" : "enquiry",
  );
  const handleLocationChange = useCallback(({ pathname, search }) => {
    if (pathname === "/admissions") {
      setAdmissionTab(new URLSearchParams(search).get("form") === "application" ? "application" : "enquiry");
    }
  }, []);
  const { location, navigate, replaceLocation, registerNavigationCleanup } = useClientNavigation(handleLocationChange);
  const page = location.pathname;

  const [calendarEvents, setCalendarEvents] = useState([]);
  const [newsList, setNewsList] = useState(sampleNews);
  const [galleryList, setGalleryList] = useState(() =>
    galleryItems.map(([src, title, category]) => ({ src, title, category }))
  );
  const latestAnnouncement = newsList[0] || null;

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await calendarEventService.getAllEvents();
        setCalendarEvents(events);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      }
    };

    const fetchNews = async () => {
      try {
        const liveNews = await newsService.getAllNews();
        if (Array.isArray(liveNews) && liveNews.length > 0) {
          setNewsList(liveNews);
        }
      } catch (err) {
        console.warn("Using sample announcements:", err.message);
      }
    };

    const fetchGallery = async () => {
      try {
        const liveMedia = await galleryService.getAllGallery();
        if (Array.isArray(liveMedia) && liveMedia.length > 0) {
          setGalleryList(liveMedia);
        }
      } catch (err) {
        console.warn("Using sample gallery:", err.message);
      }
    };

    fetchEvents();
    fetchNews();
    fetchGallery();
  }, []);

  useEffect(() => {
    const pageLabel = pages.find(([, path]) => path === page)?.[0] ?? "Page not found";
    document.title = `${pageLabel} | Siddhant High School`;
  }, [page]);

  useEffect(() => {
    const highlightLatest = page === "/news" && new URLSearchParams(location.search).get("highlight") === "latest";
    if (!highlightLatest || !latestAnnouncement) return undefined;

    const frame = window.requestAnimationFrame(() => {
      const article = document.getElementById("latest-announcement");
      if (!article) return;
      article.scrollIntoView({ block: "center" });
      article.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(frame);
  }, [location.search, page]);

  const openAdmissions = (tab) => {
    navigate(`/admissions?form=${tab}`);
  };

  const chooseAdmissionTab = (tab) => {
    setAdmissionTab(tab);
    const params = new URLSearchParams(location.search);
    params.set("form", tab);
    replaceLocation("/admissions?" + params.toString());
  };
  return (
    <NavigationProvider value={{ navigate, registerNavigationCleanup }}>
    <div className="min-h-screen bg-[#F8FAFC] text-[#0F172A]">
      <SiteHeader page={page} announcements={newsList} onOpenAdmissions={openAdmissions} />

      <main id="top">
        {page === "/" && <HomePage openAdmissions={openAdmissions} calendarEvents={calendarEvents} />}

        {page === "/about" && <AboutPage />}


        {page === "/vision-mission" && <VisionMissionPage />}

        {page === "/academics" && <AcademicsPage />}

        {page === "/management-faculty" && <ManagementFacultyPage />}

        {page === "/infrastructure" && <InfrastructurePage />}

        {page === "/sports-cultural" && <SportsCulturalPage />}

        {page === "/student-activities" && <StudentActivitiesPage />}

        {page === "/robotics-innovation" && <RoboticsInnovationPage />}

        {page === "/gallery" && <GalleryPage galleryCategory={galleryCategory} setGalleryCategory={setGalleryCategory} galleryList={galleryList} />}

        {page === "/achievements" && <AchievementsPage />}

        {page === "/news" && <NewsPage newsList={newsList} latestAnnouncement={latestAnnouncement} />}

        {page === "/admissions" && <AdmissionsPage admissionTab={admissionTab} chooseAdmissionTab={chooseAdmissionTab} />}

        {page === "/principal-message" && <PrincipalMessagePage />}

        {page === "/events" && <EventsPage calendarMonth={calendarMonth} setCalendarMonth={setCalendarMonth} selectedDate={selectedDate} setSelectedDate={setSelectedDate} calendarEvents={calendarEvents} />}
        {page === "/contact" && <ContactPage openAdmissions={openAdmissions} />}

        {!knownRoutes.has(page) && (
          <section className="section placeholder-page not-found-page">
            <p className="eyebrow">Page not found</p>
            <h1>We couldn't find that page.</h1>
            <RouteLink className="button primary" to="/">Return to Home <Arrow /></RouteLink>
          </section>
        )}
      </main>

      <SiteFooter />
    </div>
    </NavigationProvider>
  );
}
