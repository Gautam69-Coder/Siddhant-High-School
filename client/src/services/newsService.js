import api from "./api";

const normalizeNews = (item) => {
  const rawDate = item.publish_date || item.date;
  let formattedDate = "";
  if (rawDate) {
    try {
      const d = new Date(rawDate);
      formattedDate = !Number.isNaN(d.getTime())
        ? d.toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })
        : rawDate;
    } catch {
      formattedDate = rawDate;
    }
  }

  return {
    id: item._id || item.id,
    title: item.title,
    summary: item.content || item.summary || item.title,
    content: item.content || item.title,
    category: item.category,
    is_urgent: Boolean(item.is_urgent !== undefined ? item.is_urgent : item.urgent),
    date: formattedDate || "Recent Notice",
    publish_date: item.publish_date,
  };
};

const newsService = {
  getAllNews: async () => {
    const response = await api.get("/news-announcements");
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeNews) : [];
  },

  getNewsById: async (id) => {
    const response = await api.get(`/news-announcements/${id}`);
    const data = response.data?.data || response.data;
    return normalizeNews(data);
  },
};

export default newsService;
