
import api from "./api";

const calendarEventService = {
  getAllEvents: async () => {
    const response = await api.get("/calendar-events");
    const data = response.data?.data || response.data || [];

    return Array.isArray(data)
      ? data.map((event) => ({
          id: event._id,
          date: new Date(event.event_date).toISOString().slice(0, 10),
          title: event.title,
          category: event.category,
          description: event.description || "",
        }))
      : [];
  },
};

export default calendarEventService;
