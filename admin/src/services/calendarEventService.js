
import api from "./api";

const normalizeEvent = (event) => ({
  id: event._id || event.id,
  title: event.title,
  date: event.event_date
    ? new Date(event.event_date).toISOString().slice(0, 10)
    : event.date,
  category: event.category,
});

const calendarEventService = {
  getAllEvents: async () => {
    const response = await api.get("/calendar-events");
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeEvent) : [];
  },

  createEvent: async (event) => {
    const response = await api.post("/calendar-events", {
      title: event.title,
      event_date: event.date,
      category: event.category,
    });

    return normalizeEvent(response.data?.data || response.data);
  },

  updateEvent: async (id, event) => {
    const response = await api.patch(`/calendar-events/${id}`, {
      title: event.title,
      event_date: event.date,
      category: event.category,
    });

    return normalizeEvent(response.data?.data || response.data);
  },

  deleteEvent: async (id) => {
    const response = await api.delete(`/calendar-events/${id}`);
    return response.data;
  },
};

export default calendarEventService;
