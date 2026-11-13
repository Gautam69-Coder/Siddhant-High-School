import React, { useState } from 'react';
import NewsAnnouncementEditor from '../../features/admin/cms-manager/NewsAnnouncementEditor';
import EventCalendarManager from '../../features/admin/cms-manager/EventCalendarManager';
import FacultyDirectoryManager from '../../features/admin/cms-manager/FacultyDirectoryManager';
import GalleryUploadManager from '../../features/admin/cms-manager/GalleryUploadManager';
import { Newspaper, Calendar, Users, Image } from 'lucide-react';

export const AdminContentCmsPage = () => {
  const [activeTab, setActiveTab] = useState('news');

  const tabs = [
    { id: 'news', label: 'News & Announcements', icon: Newspaper },
    { id: 'events', label: 'Events Calendar', icon: Calendar },
    { id: 'faculty', label: 'Faculty Directory', icon: Users },
    { id: 'gallery', label: 'Campus Media Gallery', icon: Image },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">
          Website Content Management (CMS)
        </h1>
        <p className="text-xs text-slate-500">
          Directly publish and update public website data, tickers, faculty profiles, and media.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 overflow-x-auto pb-1">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-2.5 text-xs font-semibold rounded-t-lg transition-colors border-b-2 ${
                isActive
                  ? 'border-brand-primary text-brand-primary bg-blue-50/50'
                  : 'border-transparent text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab Panels */}
      <div>
        {activeTab === 'news' && <NewsAnnouncementEditor />}
        {activeTab === 'events' && <EventCalendarManager />}
        {activeTab === 'faculty' && <FacultyDirectoryManager />}
        {activeTab === 'gallery' && <GalleryUploadManager />}
      </div>
    </div>
  );
};

export default AdminContentCmsPage;

