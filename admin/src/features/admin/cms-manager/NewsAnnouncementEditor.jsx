import React, { useState, useEffect } from 'react';
import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Pencil, Plus, Trash2, Loader2 } from 'lucide-react';
import adminStorageService from '../services/adminStorageService';
import newsAnnouncementService from '../../../services/newsAnnouncementService';

export const NewsAnnouncementEditor = () => {
  const [newsList, setNewsList] = useState(() => adminStorageService.getNews());
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Official');
  const [urgent, setUrgent] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Fetch announcements from backend on mount
  useEffect(() => {
    let active = true;
    const fetchLiveNews = async () => {
      try {
        const liveNews = await newsAnnouncementService.getAllNews();
        if (active && Array.isArray(liveNews) && liveNews.length > 0) {
          setNewsList(liveNews);
          adminStorageService.saveNews(liveNews);
        }
      } catch (err) {
        console.warn('Could not fetch announcements from server, using local storage cache:', err.message);
      }
    };

    fetchLiveNews();
    return () => {
      active = false;
    };
  }, []);

  const resetForm = () => {
    setTitle('');
    setCategory('Official');
    setUrgent(false);
    setEditingId(null);
    setErrorMessage('');
  };

  const handleAdd = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setIsSubmitting(true);
    setErrorMessage('');

    try {
      if (editingId !== null) {
        let updatedItem = { id: editingId, title, category, urgent, date: new Date().toISOString().split('T')[0] };
        try {
          const res = await newsAnnouncementService.updateNews(editingId, { title, category, urgent });
          if (res) updatedItem = res;
        } catch (apiErr) {
          console.warn('Backend update failed, falling back to local state:', apiErr.message);
        }

        const updatedNewsList = newsList.map((item) =>
          item.id === editingId ? { ...item, ...updatedItem } : item
        );
        adminStorageService.saveNews(updatedNewsList);
        setNewsList(updatedNewsList);
        resetForm();
        return;
      }

      let createdItem = {
        id: Date.now(),
        title,
        category,
        urgent,
        date: new Date().toISOString().split('T')[0],
      };

      try {
        const res = await newsAnnouncementService.createNews({ title, category, urgent });
        if (res) createdItem = res;
      } catch (apiErr) {
        console.warn('Backend creation failed, falling back to local state:', apiErr.message);
      }

      const updatedNewsList = [createdItem, ...newsList];
      adminStorageService.saveNews(updatedNewsList);
      setNewsList(updatedNewsList);
      resetForm();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to save notice. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      try {
        await newsAnnouncementService.deleteNews(id);
      } catch (apiErr) {
        console.warn('Backend delete failed, falling back to local storage:', apiErr.message);
      }

      const updatedNewsList = newsList.filter((n) => n.id !== id);
      adminStorageService.saveNews(updatedNewsList);
      setNewsList(updatedNewsList);
      if (editingId === id) resetForm();
    } catch (err) {
      setErrorMessage(err.message || 'Failed to delete notice.');
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setTitle(item.title);
    setCategory(item.category);
    setUrgent(Boolean(item.urgent));
  };

  const sortedNewsList = [...newsList].sort((a, b) => {
    const urgencyOrder = Number(Boolean(b.urgent)) - Number(Boolean(a.urgent));
    return urgencyOrder || (b.date || '').localeCompare(a.date || '');
  });

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-base">News &amp; Announcement Manager</h3>
        <Badge variant="brand" size="sm">Admin CMS</Badge>
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
              <option value="Cultural">Cultural</option>
            </select>
          </div>
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-600 font-medium">{errorMessage}</p>
        )}

        <div className="flex items-center justify-between pt-1">
          <label className="flex items-center gap-2 text-xs font-semibold text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={urgent}
              onChange={(e) => setUrgent(e.target.checked)}
              className="rounded text-brand-primary"
            />
            Mark as Urgent
          </label>

          <div className="flex items-center gap-2">
            {editingId !== null && (
              <Button type="button" variant="secondary" size="sm" onClick={resetForm} disabled={isSubmitting}>
                Cancel
              </Button>
            )}
            <Button
              type="submit"
              variant="primary"
              size="sm"
              icon={isSubmitting ? Loader2 : editingId !== null ? Pencil : Plus}
              disabled={isSubmitting}
            >
              {isSubmitting
                ? 'Saving...'
                : editingId !== null
                ? 'Save Changes'
                : 'Add Notice'}
            </Button>
          </div>
        </div>
      </form>

      {/* Published List */}
      <div className="divide-y divide-slate-100 pt-2">
        {sortedNewsList.map((item) => (
          <div key={item.id} className="py-3 flex items-center justify-between gap-3">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={item.urgent ? 'rejected' : 'neutral'} size="sm">
                  {item.category}
                </Badge>
                {item.urgent && <span className="text-[10px] text-rose-600 font-bold uppercase tracking-wider">Urgent</span>}
              </div>
              <p className="text-sm font-medium text-slate-800">{item.title}</p>
              <span className="text-[11px] text-slate-400">{item.date}</span>
            </div>
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleEdit(item)}
                className="text-slate-400 hover:text-brand-primary p-2 rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Edit notice"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="text-slate-400 hover:text-rose-600 p-2 rounded-lg hover:bg-slate-50 transition-colors"
                aria-label="Delete notice"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NewsAnnouncementEditor;
