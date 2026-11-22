import api from "./api";

const normalizeNews = (item) => ({
  id: item._id || item.id,
  title: item.title,
  content: item.content || item.title,
  category: item.category,
  urgent: Boolean(item.is_urgent !== undefined ? item.is_urgent : item.urgent),
  date: item.publish_date
    ? new Date(item.publish_date).toISOString().slice(0, 10)
    : item.date || new Date().toISOString().slice(0, 10),
  status: item.status || "published",
});

const newsAnnouncementService = {
  getAllNews: async () => {
    const response = await api.get("/news-announcements");
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeNews) : [];
  },

  createNews: async (newsItem) => {
    const response = await api.post("/news-announcements", {
      title: newsItem.title,
      content: newsItem.content || newsItem.title,
      category: newsItem.category,
      is_urgent: Boolean(newsItem.urgent),
      publish_date: newsItem.date || new Date().toISOString().slice(0, 10),
    });
    return normalizeNews(response.data?.data || response.data);
  },

  updateNews: async (id, newsItem) => {
    const response = await api.patch(`/news-announcements/${id}`, {
      title: newsItem.title,
      content: newsItem.content || newsItem.title,
      category: newsItem.category,
      is_urgent: Boolean(newsItem.urgent),
      publish_date: newsItem.date,
    });
    return normalizeNews(response.data?.data || response.data);
  },

  deleteNews: async (id) => {
    const response = await api.delete(`/news-announcements/${id}`);
    return response.data;
  },
};

export default newsAnnouncementService;
