import React, { useState } from 'react';
import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Plus, Trash2 } from 'lucide-react';
import { initialNewsAnnouncements } from '../mockData';

export const NewsAnnouncementEditor = () => {
  const [newsList, setNewsList] = useState(initialNewsAnnouncements);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Official');
  const [urgent, setUrgent] = useState(false);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    const newItem = {
      id: Date.now(),
      title,
      category,
      urgent,
      date: new Date().toISOString().split('T')[0],
    };

    setNewsList([newItem, ...newsList]);
    setTitle('');
  };

  const handleDelete = (id) => {
    setNewsList(newsList.filter((n) => n.id !== id));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-base">News &amp; Announcement Publisher</h3>
        <Badge variant="brand" size="sm">Live CMS</Badge>
      </div>

      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3">
          <div className="sm:col-span-8">
            <InputField
              placeholder="Notice headline..."
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="sm:col-span-4">
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full h-11 px-3.5 py-2.5 rounded-[10px] bg-white text-slate-900 border border-slate-300 text-sm focus:border-brand-interactive outline-none"
            >
              <option value="Official">Official Notice</option>
              <option value="Academic">Academic</option>
              <option value="Innovation">Innovation</option>
              <option value="Sports">Sports</option>
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="rounded text-brand-primary"
            />
            Broadcast as Urgent Alert on News Ticker
          </label>

          <Button type="submit" variant="primary" size="sm" icon={Plus}>
            Publish Notice
          </Button>
        </div>
      </form>

      {/* Published List */}
      <div className="divide-y divide-slate-100 pt-2">
        {newsList.map((item) => (
          <div key={item.id} className="py-3 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={item.urgent ? 'rejected' : 'neutral'} size="sm">
                  {item.category}
                </Badge>
                {item.urgent && <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Ticker Active</span>}
              </div>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <span className="text-[11px] text-slate-400">{item.date}</span>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(item.id)}
              className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
              aria-label="Delete notice"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsAnnouncementEditor;
