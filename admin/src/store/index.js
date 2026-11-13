import { configureStore } from '@reduxjs/toolkit';

// Auth slice
const authInitialState = {
  adminUser: null,
  token: localStorage.getItem('shs_admin_token') || null,
  isAuthenticated: !!localStorage.getItem('shs_admin_token'),
  loading: false,
  error: null,
};

const authReducer = (state = authInitialState, action) => {
  switch (action.type) {
    case 'auth/loginSuccess':
      return {
        ...state,
        isAuthenticated: true,
        token: action.payload.token,
        adminUser: action.payload.user,
      };
    case 'auth/logout':
      return {
        ...state,
        isAuthenticated: false,
        token: null,
        adminUser: null,
      };
    default:
      return state;
  }
};

// UI slice
const uiInitialState = {
  isMobileDrawerOpen: false,
  isAssistantOpen: false,
  themeMode: 'light',
  searchModalOpen: false,
};

const uiReducer = (state = uiInitialState, action) => {
  switch (action.type) {
    case 'ui/toggleMobileDrawer':
      return { ...state, isMobileDrawerOpen: !state.isMobileDrawerOpen };
    case 'ui/toggleAssistant':
      return { ...state, isAssistantOpen: !state.isAssistantOpen };
    case 'ui/setSearchModal':
      return { ...state, searchModalOpen: action.payload };
    default:
      return state;
  }
};

// CMS slice
const cmsInitialState = {
  news: [],
  events: [],
  gallery: [],
  faculty: [],
  loading: false,
};

const cmsReducer = (state = cmsInitialState, action) => {
  switch (action.type) {
    case 'cms/setNews':
      return { ...state, news: action.payload };
    case 'cms/setEvents':
      return { ...state, events: action.payload };
    default:
      return state;
  }
};

export const store = configureStore({
  reducer: {
    auth: authReducer,
    ui: uiReducer,
    cms: cmsReducer,
  },
  devTools: process.env.NODE_ENV !== 'production',
});

export default store;

