// Admin Local Data Persistence Service
// Reads from localStorage with automatic fallback to admin mock data

import {
  initialApplications,
  initialEnquiries,
  initialNewsAnnouncements,
  initialCalendarEvents,
  initialFacultyProfiles,
  initialGalleryUploads,
  initialAdminSettings,
} from '../mockData';

const KEYS = {
  APPLICATIONS: 'shs_admin_applications',
  ENQUIRIES: 'shs_admin_enquiries',
  NEWS: 'shs_admin_news',
  EVENTS: 'shs_admin_events',
  FACULTY: 'shs_admin_faculty',
  GALLERY: 'shs_admin_gallery',
  SETTINGS: 'shs_admin_settings',
};

const getStored = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

const setStored = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn(`Failed to persist ${key} in localStorage:`, err);
  }
};

export const adminStorageService = {
  getApplications: () => getStored(KEYS.APPLICATIONS, initialApplications),
  saveApplications: (data) => setStored(KEYS.APPLICATIONS, data),

  getEnquiries: () => getStored(KEYS.ENQUIRIES, initialEnquiries),
  saveEnquiries: (data) => setStored(KEYS.ENQUIRIES, data),

  getNews: () => getStored(KEYS.NEWS, initialNewsAnnouncements),
  saveNews: (data) => setStored(KEYS.NEWS, data),

  getEvents: () => getStored(KEYS.EVENTS, initialCalendarEvents),
  saveEvents: (data) => setStored(KEYS.EVENTS, data),

  getFaculty: () => getStored(KEYS.FACULTY, initialFacultyProfiles),
  saveFaculty: (data) => setStored(KEYS.FACULTY, data),

  getGallery: () => getStored(KEYS.GALLERY, initialGalleryUploads),
  saveGallery: (data) => setStored(KEYS.GALLERY, data),

  getSettings: () => getStored(KEYS.SETTINGS, initialAdminSettings),
  saveSettings: (data) => setStored(KEYS.SETTINGS, data),

  resetToDefaults: () => {
    Object.values(KEYS).forEach((k) => localStorage.removeItem(k));
  },
};

export default adminStorageService;

