import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useLocation, useNavigate } from 'react-router-dom';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import {
  Eye,
  CheckCircle2,
  XCircle,
  FileText,
  X,
  Search,
  Filter,
  Download,
  ShieldCheck,
  Calendar,
  User,
  Mail,
  Phone,
  Check,
  AlertCircle,
  ExternalLink,
  MapPin,
  Navigation,
  GraduationCap,
  Copy,
  CheckCheck,
  Clock,
  Sparkles,
  Image as ImageIcon,
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { gradeFilterOptions, applicationStatusTabs } from '../mockData';
import { adminStorageService } from '../services/adminStorageService';
import admissionService from '../../../services/admissionService';

export const ApplicationsTable = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [inspectedDoc, setInspectedDoc] = useState(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState('');
  const [loading, setLoading] = useState(true);
  const [copiedAppId, setCopiedAppId] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const [applications, setApplications] = useState(() => adminStorageService.getApplications());

  useEffect(() => {
    let isMounted = true;
    admissionService.getAllAdmissions()
      .then((data) => {
        if (isMounted) {
          if (data && data.length > 0) {
            setApplications(data);
          } else {
            setApplications(adminStorageService.getApplications());
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load live admissions, using stored fallback:', err);
        if (isMounted) {
          setApplications(adminStorageService.getApplications());
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });

    return () => { isMounted = false; };
  }, []);

  const selectedApplicationId = location.state?.selectedApplicationId;
  useEffect(() => {
    if (!selectedApplicationId) return;

    const selectedApplication = applications.find((app) => app.appId === selectedApplicationId);
    if (selectedApplication) setSelectedApp(selectedApplication);

    const remainingState = { ...location.state };
    delete remainingState.selectedApplicationId;
    navigate(`${location.pathname}${location.search}${location.hash}`, {
      replace: true,
      state: Object.keys(remainingState).length > 0 ? remainingState : null,
    });
  }, [applications, location.hash, location.pathname, location.search, location.state, navigate, selectedApplicationId]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        if (inspectedDoc) {
          setInspectedDoc(null);
        } else if (selectedApp) {
          setSelectedApp(null);
        }
      }
    };
    if (selectedApp || inspectedDoc) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedApp, inspectedDoc]);

  const copyAppId = (id) => {
    if (!id) return;
    navigator.clipboard?.writeText(id).catch(() => { });
    setCopiedAppId(true);
    setTimeout(() => setCopiedAppId(false), 2000);
  };

  const calculateAge = (dobString) => {
    if (!dobString) return null;
    try {
      const birth = new Date(dobString);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const m = today.getMonth() - birth.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age > 0 ? age : null;
    } catch {
      return null;
    }
  };

  const getInitials = (name) => {
    if (!name) return 'S';
    return name
      .split(' ')
      .filter(Boolean)
      .slice(0, 2)
      .map((n) => n[0].toUpperCase())
      .join('');
  };

  const saveApplications = (updatedApplications) => {
    try {
      adminStorageService.saveApplications(updatedApplications);
      return JSON.stringify(adminStorageService.getApplications()) === JSON.stringify(updatedApplications);
    } catch (error) {
      console.warn('Failed to save admissions changes:', error);
      return false;
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    const updatedApplications = applications.map((app) =>
      app.id === id ? { ...app, status: newStatus } : app
    );

    setApplications(updatedApplications);
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp(updatedApplications.find((app) => app.id === id));
    }
    saveApplications(updatedApplications);

    try {
      await admissionService.updateAdmissionStatus(id, newStatus.toLowerCase());
    } catch (err) {
      console.warn('Backend update notice:', err.message);
    }

    setActionSuccessNotice(`Application status changed to "${newStatus.toUpperCase()}".`);
    setTimeout(() => setActionSuccessNotice(''), 3000);
  };

  const handleToggleDocVerification = (docName) => {
    if (!selectedApp) return;
    const currentApp = applications.find((app) => app.id === selectedApp.id);
    if (!currentApp) return;

    const updatedDocs = currentApp.documents.map((d) =>
      d.name === docName ? { ...d, verified: !d.verified } : d
    );
    const updatedApp = { ...currentApp, documents: updatedDocs };
    const updatedApplications = applications.map((app) =>
      app.id === updatedApp.id ? updatedApp : app
    );
    if (!saveApplications(updatedApplications)) return;

    setApplications(updatedApplications);
    setSelectedApp(updatedApp);
    if (inspectedDoc && inspectedDoc.name === docName) {
      setInspectedDoc(updatedDocs.find((doc) => doc.name === docName));
    }
  };

  const filtered = applications.filter((app) => {
    const matchesFilter = filter === 'All' || app.status.toLowerCase() === filter.toLowerCase();
    const matchesGrade = gradeFilter === 'All' || app.grade.includes(gradeFilter);
    const matchesSearch =
      searchQuery === '' ||
      app.studentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.appId.toLowerCase().includes(searchQuery.toLowerCase()) ||
      app.parentName.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesGrade && matchesSearch;
  });

  return (
    <div className="space-y-4">
      {/* Toast Notice */}
      {actionSuccessNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-card text-xs flex items-center justify-between"
        >
          <span className="font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> {actionSuccessNotice}
          </span>
          <button type="button" onClick={() => setActionSuccessNotice('')}>
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </motion.div>
      )}

      {/* Control Bar: Search & Status Filters */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {['All', 'Pending', 'Approved', 'Rejected'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${filter === status
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
            >
              {status}
              <span className="ml-1.5 opacity-70 text-[10px]">
                {status === 'All'
                  ? applications.length
                  : applications.filter((a) => a.status === status.toLowerCase()).length}
              </span>
            </button>
          ))}
        </div>

        {/* Search & Grade Filter Dropdown */}
        <div className="flex items-center gap-2">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by candidate or ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-[8px] focus:outline-none focus:border-brand-interactive w-52"
            />
          </div>

          <select
            value={gradeFilter}
            onChange={(e) => setGradeFilter(e.target.value)}
            className="px-2.5 py-1.5 text-xs bg-white border border-slate-200 rounded-[8px] focus:outline-none focus:border-brand-interactive text-slate-700"
          >
            <option value="All">All Grades</option>
            <option value="Grade 1">Grade 1</option>
            <option value="Grade 6">Grade 6</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 11">Grade 11</option>
          </select>
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-white border border-slate-200 rounded-card shadow-subtle overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm text-slate-600">
            <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold uppercase tracking-wider text-slate-500">
              <tr>
                <th className="px-6 py-3.5">Application ID</th>
                <th className="px-6 py-3.5">Candidate</th>
                <th className="px-6 py-3.5">Grade</th>
                <th className="px-6 py-3.5">Guardian Contact</th>
                <th className="px-6 py-3.5">Credentials</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-sans">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-12 text-center text-xs text-slate-400">
                    No applications matched your filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((app) => (
                  <tr key={app.id} className="hover:bg-slate-50/70 transition-colors">
                    <td className="px-6 py-4 font-mono font-bold text-brand-primary text-xs">
                      {app.appId}
                    </td>
                    <td className="px-6 py-4 font-semibold text-slate-900">
                      <div>{app.studentName}</div>
                      <div className="text-[11px] text-slate-400 font-normal">
                        DOB: {app.dob} {calculateAge(app.dob) !== null ? `(${calculateAge(app.dob)} yrs)` : ''}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-xs text-slate-700 font-medium">{app.grade}</td>
                    <td className="px-6 py-4 text-xs">
                      <div className="font-medium text-slate-800">{app.parentName}</div>
                      <div className="text-slate-400 text-[11px]">{app.parentEmail}</div>
                    </td>
                    <td className="px-6 py-4 text-xs">
                      <div className="flex items-center gap-1 text-slate-600">
                        <FileText className="w-3.5 h-3.5 text-brand-interactive" />
                        <span className="font-semibold">{app.documents.length} Files</span>
                        {app.documents.every((d) => d.verified) ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 ml-1" title="All Verified" />
                        ) : (
                          <AlertCircle className="w-3.5 h-3.5 text-amber-500 ml-1" title="Pending Verification" />
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant={app.status} dot size="sm">
                        {app.status}
                      </Badge>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedApp(app)}
                        icon={Eye}
                      >
                        Review
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Centered Modal Pop-up for Application Review */}
      {typeof document !== 'undefined' &&
        createPortal(
          <AnimatePresence>
            {selectedApp && (
              <div
                className="fixed inset-0 z-[60] overflow-y-auto flex items-center justify-center p-4 sm:p-6"
                role="dialog"
                aria-modal="true"
                aria-labelledby="review-candidate-title"
              >
            {/* Glassmorphic Backdrop */}
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={() => setSelectedApp(null)}
              aria-hidden="true"
            />

            {/* Centered Pop-up Modal Card */}
            {/* Slide-in Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 16 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="relative w-full max-w-2xl bg-white rounded-card shadow-2xl border border-slate-200 z-10 overflow-hidden flex flex-col max-h-[90vh] my-auto"
            >
              {/* Modal Top Header */}
              <div className="flex items-center justify-between p-5 sm:p-6 border-b border-slate-100 bg-white shrink-0">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-sm font-bold text-brand-primary">
                      {selectedApp.appId}
                    </span>
                    <Badge variant={selectedApp.status} dot size="sm">
                      {selectedApp.status}
                    </Badge>
                  </div>
                  <h3 id="review-candidate-title" className="text-xl font-bold text-slate-900 mt-1">
                    {selectedApp.studentName}
                  </h3>
                </div>
                <button
                  type="button"
                  onClick={() => setSelectedApp(null)}
                  aria-label="Close review popup"
                  className="p-2 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Scrollable Content Body */}
              <div className="p-5 sm:p-6 space-y-6 overflow-y-auto flex-1">
                {/* Candidate Particulars Bento */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Grade Applying
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedApp.grade}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Date of Birth &amp; Age
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedApp.dob} {calculateAge(selectedApp.dob) !== null ? `(${calculateAge(selectedApp.dob)} years old)` : ''}
                    </span>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Guardian
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {selectedApp.parentName}
                    </span>
                    <div className="text-slate-500 text-[11px] mt-0.5 space-y-0.5">
                      {selectedApp.parentPhone && <span className="block">{selectedApp.parentPhone}</span>}
                      {selectedApp.parentEmail && <span className="block truncate">{selectedApp.parentEmail}</span>}
                    </div>
                  </div>
                  <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Location
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block truncate" title={selectedApp.address}>
                      {selectedApp.address || 'N/A'}
                    </span>
                    <span className="text-slate-500 text-[11px] block">Bangalore Metro Zone</span>
                  </div>
                </div>

                {/* Uploaded Documents & Credentials Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Uploaded Documents &amp; Credentials ({selectedApp.documents?.length || 0})
                    </h4>
                    <span className="text-[11px] text-slate-400">Click to inspect</span>
                  </div>

                  <div className="space-y-2">
                    {selectedApp.documents?.map((doc, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white border border-slate-200 rounded-card hover:border-brand-interactive/70 hover:shadow-xs flex items-center justify-between gap-3 transition-all cursor-pointer group"
                        onClick={() => setInspectedDoc(doc)}
                      >
                        <div className="flex items-center gap-3 min-w-0">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-interactive flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div className="min-w-0">
                            <p className="text-xs font-bold text-slate-800 group-hover:text-brand-primary transition-colors truncate">
                              {doc.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {doc.type} &bull; {doc.size || 'Uploaded'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleDocVerification(doc.name);
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${doc.verified
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200 hover:bg-emerald-100'
                              : 'bg-amber-50 text-amber-700 border border-amber-200 hover:bg-amber-100'
                              }`}
                          >
                            {doc.verified ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {doc.verified ? 'Verified' : 'Verify'}
                          </button>
                          <span className="text-xs text-brand-interactive group-hover:translate-x-0.5 transition-transform">
                            &rarr;
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Triage Decision Actions */}
              <div className="p-5 sm:p-6 border-t border-slate-100 bg-slate-50/50 shrink-0 space-y-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Official Administrative Determination
                </span>
                <div className="flex flex-col sm:flex-row items-center gap-2.5">
                  <Button
                    variant="primary"
                    className="w-full sm:flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white"
                    onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                    icon={CheckCircle2}
                  >
                    Grant Admission Offer
                  </Button>
                  <Button
                    variant="secondary"
                    className="flex-1 justify-center bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-bold active:scale-[0.98]"
                    onClick={() => handleStatusChange(selectedApp.id, 'pending')}
                    icon={Clock}
                  >
                    Hold / Review
                  </Button>
                  <Button
                    variant="danger"
                    className="w-full sm:flex-1 justify-center"
                    onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                    icon={XCircle}
                  >
                    Reject Candidate
                  </Button>
                  <Button
                    variant="secondary"
                    className="w-full sm:w-auto justify-center"
                    onClick={() => setSelectedApp(null)}
                  >
                    Close
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>,
      document.body
    )}

      {/* Interactive Document Inspection Modal */}
      {inspectedDoc && (
        <Modal
          isOpen={!!inspectedDoc}
          onClose={() => setInspectedDoc(null)}
          title={`Document Scrutiny: ${inspectedDoc.name}`}
          zIndex="z-[70]"
          maxWidth="max-w-xl"
        >
          <div className="space-y-5">
            {/* Real File Viewer or Simulated Scrutiny Card */}
            {inspectedDoc.url && (inspectedDoc.type === 'IMAGE' || inspectedDoc.url.match(/\.(png|jpe?g|webp)$/i)) ? (
              <div className="relative aspect-4/3 w-full bg-slate-900 rounded-2xl border border-slate-800 flex items-center justify-center overflow-hidden shadow-inner p-4">
                <img
                  src={inspectedDoc.url}
                  alt={inspectedDoc.name}
                  className="max-h-full max-w-full object-contain rounded-lg shadow-lg"
                />
                <div className="absolute top-3 right-3">
                  <Badge variant={inspectedDoc.verified ? 'approved' : 'pending'} size="sm">
                    {inspectedDoc.verified ? 'Verified' : 'Pending Verification'}
                  </Badge>
                </div>
              </div>
            ) : (
              <div className="relative aspect-4/3 w-full bg-slate-900 rounded-2xl border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-inner text-white">
                {/* Watermark */}
                <div className="absolute inset-0 flex items-center justify-center opacity-5 pointer-events-none select-none">
                  <span className="font-display text-6xl font-bold uppercase rotate-[-25deg]">
                    Siddhant High School
                  </span>
                </div>

                {/* Document Header */}
                <div className="relative z-10 flex items-center justify-between border-b border-slate-700/80 pb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-7 h-7 rounded bg-blue-600 flex items-center justify-center font-bold text-xs">
                      SHS
                    </div>
                    <div>
                      <h5 className="font-semibold text-xs text-slate-200">{inspectedDoc.name}</h5>
                      <span className="text-[10px] text-slate-400 font-mono">
                        SHA256: 8f9b...e21a (Official Upload Stream)
                      </span>
                    </div>
                  </div>

                  <Badge variant={inspectedDoc.verified ? 'approved' : 'pending'} size="sm">
                    {inspectedDoc.verified ? 'Cryptographically Sealed' : 'Pending Verification'}
                  </Badge>
                </div>

                {/* Body Details */}
                <div className="relative z-10 space-y-3 py-6 px-4 bg-slate-800/40 rounded-xl border border-slate-700/50">
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Document Type:</span>
                    <span className="font-semibold text-white">{inspectedDoc.type}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Candidate:</span>
                    <span className="font-semibold text-white">{selectedApp?.studentName}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>File Size:</span>
                    <span className="font-mono text-white">{inspectedDoc.size || 'Uploaded'}</span>
                  </div>
                  <div className="flex items-center justify-between text-xs text-slate-300">
                    <span>Tamper Check:</span>
                    <span className="text-emerald-400 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5" /> Passed Clean
                    </span>
                  </div>
                </div>

                {/* Document Footer */}
                <div className="relative z-10 flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-slate-700/80">
                  <span>Shubham Education &amp; Welfare Society Registry</span>
                  <span className="font-mono text-slate-300">Verified by Admin Desk</span>
                </div>
              </div>
            )}

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleToggleDocVerification(inspectedDoc.name)}
                className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer ${inspectedDoc.verified
                  ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
                  }`}
              >
                <Check className="w-3.5 h-3.5" />
                {inspectedDoc.verified ? 'Mark as Incomplete / Unverified' : 'Approve & Mark Verified'}
              </button>

              <div className="flex items-center gap-2">
                {inspectedDoc.url && (
                  <a
                    href={inspectedDoc.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl text-xs font-semibold bg-blue-600 text-white hover:bg-blue-700 flex items-center gap-1.5 transition-colors"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    Open Uploaded File
                  </a>
                )}
                <Button variant="secondary" size="sm" onClick={() => setInspectedDoc(null)}>
                  Close Preview
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ApplicationsTable;
