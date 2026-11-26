import { useCallback, useEffect, useState } from "react";

import calendarEventService from "./services/calendarEventService";
import newsService from "./services/newsService";
import galleryService from "./services/galleryService";
import facultyService from "./services/facultyService";
import settingsService from "./services/settingsService";
import Arrow from "./components/ui/Arrow";
import { CLASS_AGE_CRITERIA } from "./data/admission";
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
  const [newsList, setNewsList] = useState([]);
  const [newsLoading, setNewsLoading] = useState(true);
  const [newsError, setNewsError] = useState("");
  const [galleryList, setGalleryList] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryError, setGalleryError] = useState("");
  const [facultyList, setFacultyList] = useState([]);
  const [facultyLoading, setFacultyLoading] = useState(true);
  const [facultyError, setFacultyError] = useState("");
  const [schoolSettings, setSchoolSettings] = useState(null);
  const [settingsLoading, setSettingsLoading] = useState(true);
  const latestAnnouncement = newsList[0] || null;

  const fetchNews = useCallback(async () => {
    setNewsLoading(true);
    setNewsError("");
    try {
      const liveNews = await newsService.getAllNews();
      setNewsList(Array.isArray(liveNews) ? liveNews : []);
    } catch (err) {
      console.error("Failed to fetch announcements:", err);
      setNewsError("Unable to load school announcements right now.");
    } finally {
      setNewsLoading(false);
    }
  }, []);

  const fetchGallery = useCallback(async () => {
    setGalleryLoading(true);
    setGalleryError("");
    try {
      const liveMedia = await galleryService.getAllGallery();
      setGalleryList(Array.isArray(liveMedia) ? liveMedia : []);
    } catch (err) {
      console.error("Failed to fetch gallery media:", err);
      setGalleryError("Unable to load gallery images right now.");
    } finally {
      setGalleryLoading(false);
    }
  }, []);

  const fetchFaculty = useCallback(async () => {
    setFacultyLoading(true);
    setFacultyError("");
    try {
      const liveFaculty = await facultyService.getAllFaculty();
      setFacultyList(Array.isArray(liveFaculty) ? liveFaculty : []);
    } catch (err) {
      console.error("Failed to fetch faculty directory:", err);
      setFacultyError("Unable to load faculty profiles right now.");
    } finally {
      setFacultyLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const events = await calendarEventService.getAllEvents();
        setCalendarEvents(events);
      } catch (error) {
        console.error("Failed to fetch calendar events:", error);
      }
    };

    const fetchSettings = async () => {
      setSettingsLoading(true);
      try {
        const settings = await settingsService.getSettings();
        setSchoolSettings(settings);
      } catch (err) {
        console.error("Failed to fetch school settings:", err);
      } finally {
        setSettingsLoading(false);
      }
    };

    fetchEvents();
    fetchNews();
    fetchGallery();
    fetchFaculty();
    fetchSettings();
  }, [fetchFaculty, fetchGallery, fetchNews]);

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
      <SiteHeader page={page} announcements={newsList} schoolSettings={schoolSettings} onOpenAdmissions={openAdmissions} />

      <main id="top">
        {page === "/" && <HomePage openAdmissions={openAdmissions} calendarEvents={calendarEvents} newsList={newsList} newsLoading={newsLoading} />}

        {page === "/about" && <AboutPage />}


        {page === "/vision-mission" && <VisionMissionPage />}

        {page === "/academics" && <AcademicsPage />}

        {page === "/management-faculty" && (
          <ManagementFacultyPage
            facultyList={facultyList}
            facultyLoading={facultyLoading}
            facultyError={facultyError}
            onRetry={fetchFaculty}
          />
        )}

        {page === "/infrastructure" && <InfrastructurePage />}

        {page === "/sports-cultural" && <SportsCulturalPage />}

        {page === "/student-activities" && <StudentActivitiesPage />}

        {page === "/robotics-innovation" && <RoboticsInnovationPage />}

        {page === "/gallery" && (
          <GalleryPage
            galleryCategory={galleryCategory}
            setGalleryCategory={setGalleryCategory}
            galleryList={galleryList}
            galleryLoading={galleryLoading}
            galleryError={galleryError}
            onRetry={fetchGallery}
          />
        )}

        {page === "/achievements" && <AchievementsPage />}

        {page === "/news" && (
          <NewsPage
            newsList={newsList}
            latestAnnouncement={latestAnnouncement}
            newsLoading={newsLoading}
            newsError={newsError}
            onRetry={fetchNews}
          />
        )}

        {page === "/admissions" && <AdmissionsPage admissionTab={admissionTab} chooseAdmissionTab={chooseAdmissionTab} />}

        {page === "/principal-message" && <PrincipalMessagePage />}

        {page === "/events" && <EventsPage calendarMonth={calendarMonth} setCalendarMonth={setCalendarMonth} selectedDate={selectedDate} setSelectedDate={setSelectedDate} calendarEvents={calendarEvents} />}
        {page === "/contact" && <ContactPage openAdmissions={openAdmissions} schoolSettings={schoolSettings} settingsLoading={settingsLoading} />}

        {!knownRoutes.has(page) && (
          <section className="section placeholder-page not-found-page">
            <p className="eyebrow">Page not found</p>
            <h1>We couldn't find that page.</h1>
            <RouteLink className="button primary" to="/">Return to Home <Arrow /></RouteLink>
          </section>
        )}
      </main>

      <SiteFooter schoolSettings={schoolSettings} />
    </div>
    </NavigationProvider>
  );
}
