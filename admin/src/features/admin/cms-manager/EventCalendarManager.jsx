import React, { useState } from 'react';
import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Plus, Trash2, Calendar } from 'lucide-react';
import { initialCalendarEvents } from '../mockData';

export const EventCalendarManager = () => {
  const [events, setEvents] = useState(initialCalendarEvents);

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [category, setCategory] = useState('Academic');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title || !date) return;

    setEvents([...events, { id: Date.now(), title, date, category }]);
    setTitle('');
    setDate('');
  };

  const handleDelete = (id) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-base">Events &amp; Smart Calendar Manager</h3>
        <Badge variant="brand" size="sm">Schedule Sync</Badge>
      </div>

      <form onSubmit={handleAdd} className="grid grid-cols-1 sm:grid-cols-12 gap-3">
        <div className="sm:col-span-6">
          <InputField
            placeholder="Event title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-3">
          <InputField
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            required
          />
        </div>
        <div className="sm:col-span-3 flex items-end">
          <Button type="submit" variant="primary" icon={Plus} className="w-full justify-center">
            Add Event
          </Button>
        </div>
      </form>

      <div className="divide-y divide-slate-100">
        {events.map((evt) => (
          <div key={evt.id} className="py-3 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xs font-semibold text-brand-primary">{evt.date}</span>
              <span className="text-sm font-medium text-slate-800">{evt.title}</span>
              <Badge variant="neutral" size="sm">{evt.category}</Badge>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(evt.id)}
              className="text-slate-400 hover:text-rose-600 p-1.5"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EventCalendarManager;

