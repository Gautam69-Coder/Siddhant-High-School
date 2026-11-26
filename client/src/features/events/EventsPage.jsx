import Arrow from "../../components/ui/Arrow";
import { getLocalDateInputValue } from "../../components/forms/formValidation";

export default function EventsPage({ calendarMonth, setCalendarMonth, selectedDate, setSelectedDate, calendarEvents }) {
  const monthLabel = calendarMonth.toLocaleDateString("en", { month: "long", year: "numeric" });
  const selectedEvent = calendarEvents.find((event) => event.date === selectedDate);
  const upcomingEvents = calendarEvents
    .filter((event) => event.date >= getLocalDateInputValue())
    .sort((first, second) => first.date.localeCompare(second.date));
  const calendarLeadingDays = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth(), 1).getDay();
  const calendarDayCount = new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 0).getDate();
  const calendarDates = Array.from({ length: calendarDayCount }, (_, index) => {
    const day = index + 1;
    return `${calendarMonth.getFullYear()}-${String(calendarMonth.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
  });

  return (
<section className="events-page section">
            <div className="events-heading">
              <div><p className="eyebrow">Events &amp; Calendar</p><h1>School dates &amp; <em>gatherings.</em></h1></div>
              <p>Events published by the school are shown here.</p>
            </div>
            <div className="calendar-layout">
              <section className="calendar-panel" id="events-calendar" aria-label="Monthly calendar">
                <div className="calendar-toolbar">
                  <button type="button" aria-label="Previous month" onClick={() => { setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() - 1, 1)); setSelectedDate(null); }}>Previous</button>
                  <h2>{monthLabel}</h2>
                  <button type="button" aria-label="Next month" onClick={() => { setCalendarMonth(new Date(calendarMonth.getFullYear(), calendarMonth.getMonth() + 1, 1)); setSelectedDate(null); }}>Next</button>
                </div>
                <div className="calendar-weekdays">{"Sun Mon Tue Wed Thu Fri Sat".split(" ").map((day) => <span key={day}>{day}</span>)}</div>
                <div className="calendar-grid">
                  {Array.from({ length: calendarLeadingDays }, (_, index) => <span className="calendar-empty" aria-hidden="true" key={`empty-${index}`} />)}
                  {calendarDates.map((date) => {
                    const event = calendarEvents.find((item) => item.date === date);
                    const day = Number(date.slice(-2));
                    return <button type="button" className={`calendar-date ${event ? "has-event" : ""} ${selectedDate === date ? "selected" : ""}`} aria-pressed={selectedDate === date} aria-label={`${date}${event ? `, event: ${event.title}` : ", no event"}`} key={date} onClick={() => setSelectedDate(date)}><span>{day}</span>{event && <i aria-hidden="true" />}</button>;
                  })}
                </div>
                <p className="calendar-legend"><i aria-hidden="true" /> Event date</p>
              </section>
              <aside className="calendar-detail" aria-live="polite" aria-label="Selected date details">
                <p className="eyebrow">Selected date</p>
                {selectedDate ? <time className="calendar-detail-date">{new Date(`${selectedDate}T12:00:00`).toLocaleDateString("en", { weekday: "long", month: "long", day: "numeric", year: "numeric" })}</time> : <p className="calendar-empty-state">Choose a date to view its details.</p>}
                {selectedEvent ? <><span className="calendar-sample-tag">School event</span><h2>{selectedEvent.title}</h2><p className="calendar-category">{selectedEvent.category}</p><p>{selectedEvent.description || "More details will be shared by the school."}</p></> : selectedDate ? <p className="calendar-empty-state">No event is scheduled for this date.</p> : null}
              </aside>
            </div>
            <section className="upcoming-events" aria-labelledby="upcoming-events-title">
              <div className="upcoming-events-heading"><div><p className="eyebrow">Plan ahead</p><h2 id="upcoming-events-title">Upcoming events</h2></div><p>Events added by the school will appear here.</p></div>
              {upcomingEvents.length ? (
                <div className="upcoming-event-list">
                  {upcomingEvents.map((event) => (
                    <article className={selectedDate === event.date ? "is-selected" : ""} key={event.date}>
                      <time dateTime={event.date}>{new Date(`${event.date}T12:00:00`).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</time>
                      <div><span className="upcoming-event-category">{event.category}</span><h3>{event.title}</h3><p>{event.description || "More details will be shared by the school."}</p></div>
                      <button type="button" aria-pressed={selectedDate === event.date} aria-label={`Show ${event.title} on the calendar`} onClick={() => { const date = new Date(`${event.date}T12:00:00`); setCalendarMonth(new Date(date.getFullYear(), date.getMonth(), 1)); setSelectedDate(event.date); document.getElementById("events-calendar")?.scrollIntoView({ behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth", block: "center" }); }}>View in calendar <Arrow /></button>
                    </article>
                  ))}
                </div>
              ) : <p className="upcoming-empty-state">There are no upcoming events at the moment.</p>}
            </section>
          </section>
  );
}
