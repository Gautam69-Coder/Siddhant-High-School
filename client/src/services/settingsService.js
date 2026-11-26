import api from "./api";

const settingsService = {
  getSettings: async () => {
    const response = await api.get("/settings");
    return response.data?.data || response.data || null;
  },
};

export default settingsService;
