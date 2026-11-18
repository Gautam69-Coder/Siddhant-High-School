
import React, { useEffect, useState } from 'react';
import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import calendarEventService from '../../../services/calendarEventService';

const isValidEventDate = (value) => {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match.map(Number);
  const parsedDate = new Date(Date.UTC(year, month - 1, day));

  return parsedDate.getUTCFullYear() === year
    && parsedDate.getUTCMonth() === month - 1
    && parsedDate.getUTCDate() === day;
};

const getEventDateValue = (value) => {
  if (!isValidEventDate(value)) return null;

  const [year, month, day] = value.split('-').map(Number);
  return Date.UTC(year, month - 1, day);
};

export const EventCalendarManager = () => {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Academic');
  const [editingId, setEditingId] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Fetch events from MongoDB
  const fetchEvents = async () => {
    try {
      setLoading(true);
      const data = await calendarEventService.getAllEvents();
      setEvents(data);
      setValidationMessage('');
    } catch (error) {
      setValidationMessage(error.message || 'Failed to load events.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const resetForm = () => {
    setTitle('');
    setDate('');
    setCategory('Academic');
    setEditingId(null);
    setValidationMessage('');
  };

  // Create or update event
  const handleSave = async (e) => {
    e.preventDefault();

    if (!title.trim()) {
      setValidationMessage('Please enter an event title.');
      return;
    }

    if (!isValidEventDate(date)) {
      setValidationMessage('Please choose a valid event date.');
      return;
    }

    try {
      setSaving(true);
      setValidationMessage('');

      const eventData = {
        title: title.trim(),
        date,
        category,
      };

      if (editingId !== null) {
        await calendarEventService.updateEvent(editingId, eventData);
      } else {
        await calendarEventService.createEvent(eventData);
      }

      await fetchEvents();
      resetForm();
    } catch (error) {
      setValidationMessage(error.message || 'Failed to save event.');
    } finally {
      setSaving(false);
    }
  };

  // Delete event
  const handleDelete = async (id) => {
    try {
      setValidationMessage('');
      await calendarEventService.deleteEvent(id);

      setEvents((previousEvents) =>
        previousEvents.filter((event) => event.id !== id)
      );

      if (editingId === id) resetForm();
    } catch (error) {
      setValidationMessage(error.message || 'Failed to delete event.');
    }
  };

  // Edit event
  const handleEdit = (event) => {
    setEditingId(event.id);
    setTitle(event.title);
    setDate(event.date);
    setCategory(event.category);
    setValidationMessage('');
  };

  const today = new Date();
  const todayValue = Date.UTC(
    today.getFullYear(),
    today.getMonth(),
    today.getDate()
  );

  const orderedEvents = [...events].sort((a, b) => {
    const aDate = getEventDateValue(a.date);
    const bDate = getEventDateValue(b.date);

    const aIsUpcoming = aDate !== null && aDate >= todayValue;
    const bIsUpcoming = bDate !== null && bDate >= todayValue;

    if (aIsUpcoming !== bIsUpcoming) {
      return aIsUpcoming ? -1 : 1;
    }

    if (aDate === null || bDate === null) {
      if (aDate === bDate) return 0;
      return aDate === null ? 1 : -1;
    }

    return aIsUpcoming ? aDate - bDate : bDate - aDate;
  });

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-base">
          Events &amp; Smart Calendar Manager
        </h3>
        <Badge variant="brand" size="sm">Database</Badge>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-5">
          <InputField
            placeholder="Event title..."
            value={title}
            onChange={(e) => {
              setTitle(e.target.value);
              setValidationMessage('');
            }}
          />
        </div>

        <div className="sm:col-span-3">
          <InputField
            type="date"
            value={date}
            onChange={(e) => {
              setDate(e.target.value);
              setValidationMessage('');
            }}
          />
        </div>

        <div className="sm:col-span-4">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full h-11 px-3.5 py-2.5 rounded-[10px] bg-white text-slate-900 border border-slate-300 text-sm focus:border-brand-interactive outline-none"
          >
            <option value="Academic">Academic</option>
            <option value="Robotics & STEM">Robotics &amp; STEM</option>
            <option value="Cultural">Cultural</option>
            <option value="Sports">Sports</option>
          </select>
        </div>

        {validationMessage && (
          <p className="sm:col-span-12 text-xs text-rose-600" role="alert">
            {validationMessage}
          </p>
        )}

        <div className="sm:col-span-12 flex justify-end">
          <div className="flex items-center gap-2">
            {editingId !== null && (
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={resetForm}
              >
                Cancel
              </Button>
            )}

            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={editingId !== null ? Pencil : Plus}
              disabled={saving}
            >
              {saving
                ? 'Saving...'
                : editingId !== null
                  ? 'Save Changes'
                  : 'Add Event'}
            </Button>
          </div>
        </div>
      </form>

      <div className="divide-y divide-slate-100">
        {loading ? (
          <p className="py-4 text-sm text-slate-500">Loading events...</p>
        ) : orderedEvents.length === 0 ? (
          <p className="py-4 text-sm text-slate-500">No events found.</p>
        ) : (
          orderedEvents.map((evt) => (
            <div
              key={evt.id}
              className="py-3 flex items-center justify-between gap-3"
            >
              <div className="flex items-center gap-3 min-w-0 flex-wrap">
                <span className="font-mono text-xs font-semibold text-brand-primary">
                  {evt.date}
                </span>

                <span className="text-sm font-medium text-slate-800">
                  {evt.title}
                </span>

                <Badge variant="neutral" size="sm">
                  {evt.category}
                </Badge>
              </div>

              <div className="flex items-center shrink-0">
                <button
                  type="button"
                  onClick={() => handleEdit(evt)}
                  className="text-slate-400 hover:text-brand-primary p-1.5"
                  aria-label="Edit event"
                >
                  <Pencil className="w-4 h-4" />
                </button>

                <button
                  type="button"
                  onClick={() => handleDelete(evt.id)}
                  className="text-slate-400 hover:text-rose-600 p-1.5"
                  aria-label="Delete event"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EventCalendarManager;
