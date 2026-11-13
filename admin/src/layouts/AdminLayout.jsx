import React, { useState, useRef, useEffect } from 'react';
import { useOutlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { adminNavItems, adminSearchableItems } from '../features/admin/mockData';
import PageTransition from '../components/motion/PageTransition';
import {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  FileText,
  Settings,
  LogOut,
  Search,
  Menu,
  X,
  ExternalLink,
  Command,
  ArrowRight,
  Sparkles,
  FileSpreadsheet,
  PlusCircle,
  Bell,
  Check,
} from 'lucide-react';

const iconMap = {
  LayoutDashboard,
  GraduationCap,
  MessageSquare,
  FileText,
  Settings,
  PlusCircle,
  ExternalLink,
};

export const AdminLayout = () => {
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [paletteQuery, setPaletteQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);

  const location = useLocation();
  const navigate = useNavigate();
  const currentOutlet = useOutlet();
  const contentScrollRef = useRef(null);
  const searchInputRef = useRef(null);

  // Command palette keyboard listener (Ctrl+K or Cmd+K)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen((prev) => !prev);
      } else if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  useEffect(() => {
    if (commandPaletteOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 50);
      setSelectedIndex(0);
    }
  }, [commandPaletteOpen]);

  const handleLogout = () => {
    localStorage.removeItem('shs_admin_token');
    localStorage.removeItem('vtx_admin_token');
    navigate('/admin/login');
  };

  const filteredPaletteItems = adminSearchableItems.filter((item) =>
    item.title.toLowerCase().includes(paletteQuery.toLowerCase()) ||
    item.type.toLowerCase().includes(paletteQuery.toLowerCase())
  );

  const handleExecutePaletteItem = (item) => {
    setCommandPaletteOpen(false);
    setPaletteQuery('');
    if (item.external) {
      window.open(item.path, '_blank');
    } else {
      navigate(item.path);
    }
  };

  const handlePaletteKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (filteredPaletteItems.length || 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredPaletteItems.length) % (filteredPaletteItems.length || 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (filteredPaletteItems[selectedIndex]) {
        handleExecutePaletteItem(filteredPaletteItems[selectedIndex]);
      }
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col lg:flex-row font-sans">
      {/* Mobile Top Header */}
      <div className="lg:hidden bg-slate-900 text-white p-4 flex items-center justify-between border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-white p-0.5 flex items-center justify-center shrink-0">
            <img src="/assets/logo.png" alt="Siddhant High School" className="w-full h-full object-contain" />
          </div>
          <span className="font-display font-bold text-base">Siddhant Admin OS</span>
        </div>
        <button
          type="button"
          onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
          className="p-1.5 rounded-lg bg-slate-800 text-slate-300"
        >
          {mobileSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Admin Sidebar (260px desktop) */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-64 bg-slate-900 text-slate-300 flex flex-col justify-between p-5 border-r border-slate-800 transition-transform duration-200 lg:translate-x-0 ${
          mobileSidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:static lg:h-screen lg:shrink-0`}
      >
        <div>
          {/* Header with Logo */}
          <div className="flex items-center gap-3 pb-6 border-b border-slate-800">
            <div className="w-10 h-10 rounded-lg bg-white p-1 flex items-center justify-center shrink-0 shadow-sm">
              <img src="/assets/logo.png" alt="Siddhant High School" className="w-full h-full object-contain" />
            </div>
            <div>
              <span className="font-display font-bold text-sm text-white block">Siddhant High School</span>
              <span className="text-[10px] uppercase tracking-wider text-emerald-400 font-semibold block">
                Super Admin OS
              </span>
            </div>
          </div>

          {/* Navigation Links with animated active pill indicator */}
          <nav className="mt-6 space-y-1">
            {adminNavItems.map((item) => {
              const Icon = iconMap[item.icon] || LayoutDashboard;
              const isActive = location.pathname === item.path;

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setMobileSidebarOpen(false)}
                  className={`relative flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-xs font-semibold transition-colors ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="adminNavActivePill"
                      className="absolute inset-0 bg-blue-600 rounded-[10px] shadow-sm -z-0"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                  <Icon className="w-4 h-4 shrink-0 relative z-10" />
                  <span className="relative z-10">{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer */}
        <div className="pt-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            target="_blank"
            className="flex items-center justify-between px-3 py-2 text-xs text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
          >
            <span>Live Public School Site</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3.5 py-2 text-xs font-semibold text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors text-left"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out Admin</span>
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div
        ref={contentScrollRef}
        className="flex-1 flex flex-col min-w-0 h-screen overflow-y-auto"
      >
        {/* Topbar (64px) with Clickable Quick Command Launcher */}
        <header className="h-16 bg-white border-b border-slate-200 px-6 flex items-center justify-between shrink-0 sticky top-0 z-30">
          <div className="flex items-center gap-4 flex-1 max-w-md">
            <button
              type="button"
              onClick={() => setCommandPaletteOpen(true)}
              className="relative w-full flex items-center justify-between pl-9 pr-3.5 py-1.5 text-xs bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-[8px] text-slate-400 transition-colors text-left cursor-pointer"
            >
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <span>Search candidate by name, #SHS ID, or command...</span>
              <kbd className="hidden sm:inline-flex items-center gap-1 font-mono text-[10px] bg-white border border-slate-200 px-1.5 py-0.5 rounded shadow-xs text-slate-500">
                <Command className="w-3 h-3" /> K
              </kbd>
            </button>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-[11px] text-slate-400 font-mono hidden md:inline">
              Session: 2026-27 Active
            </span>
            <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
              <div className="w-7 h-7 rounded-full bg-slate-900 text-amber-400 flex items-center justify-center font-bold text-xs">
                S
              </div>
              <span className="text-xs font-semibold text-slate-700 hidden sm:inline">Super Admin Desk</span>
            </div>
          </div>
        </header>

        {/* Page Content with Framer Motion Switch */}
        <div className="p-6 md:p-8 flex-1 flex flex-col">
          <PageTransition containerRef={contentScrollRef} showProgressBar={false}>
            {currentOutlet}
          </PageTransition>
        </div>
      </div>

      {/* Global Command Palette (Ctrl+K) */}
      <AnimatePresence>
        {commandPaletteOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden flex items-start justify-center pt-20 px-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs transition-opacity"
              onClick={() => setCommandPaletteOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: -10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ duration: 0.15 }}
              className="relative w-full max-w-xl bg-white rounded-card shadow-2xl border border-slate-200 overflow-hidden z-10"
            >
              {/* Search Bar in Modal */}
              <div className="relative border-b border-slate-100 flex items-center px-4 py-3.5">
                <Search className="w-4 h-4 text-slate-400 mr-3" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Type a candidate name, #SHS ID, or page..."
                  value={paletteQuery}
                  onChange={(e) => {
                    setPaletteQuery(e.target.value);
                    setSelectedIndex(0);
                  }}
                  onKeyDown={handlePaletteKeyDown}
                  className="w-full text-sm bg-transparent outline-none text-slate-800 placeholder-slate-400"
                />
                <button
                  type="button"
                  onClick={() => setCommandPaletteOpen(false)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded ml-2"
                >
                  ESC
                </button>
              </div>

              {/* Items List */}
              <div className="max-h-80 overflow-y-auto p-2 space-y-1">
                {filteredPaletteItems.length === 0 ? (
                  <div className="py-8 text-center text-xs text-slate-400">
                    No matching candidate, page, or quick action found.
                  </div>
                ) : (
                  filteredPaletteItems.map((item, idx) => {
                    const Icon = iconMap[item.iconName] || item.icon || LayoutDashboard;
                    const isSelected = selectedIndex === idx;
                    return (
                      <div
                        key={idx}
                        onClick={() => handleExecutePaletteItem(item)}
                        onMouseEnter={() => setSelectedIndex(idx)}
                        className={`flex items-center justify-between px-3 py-2.5 rounded-[8px] text-xs cursor-pointer transition-colors ${
                          isSelected ? 'bg-blue-50 text-brand-primary font-medium' : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div
                            className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                              isSelected ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-500'
                            }`}
                          >
                            <Icon className="w-3.5 h-3.5" />
                          </div>
                          <span>{item.title}</span>
                        </div>

                        <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-slate-100 text-slate-500 font-semibold">
                          {item.type}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Palette Footer */}
              <div className="px-4 py-2.5 bg-slate-50 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400 font-mono">
                <span>Navigation: ↑ ↓ to select &bull; Enter to jump</span>
                <span>Siddhant Admin OS</span>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminLayout;
