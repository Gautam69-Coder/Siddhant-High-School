import React, { useState } from 'react';
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
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  initialApplications,
  gradeFilterOptions,
  applicationStatusTabs,
} from '../mockData';

export const ApplicationsTable = () => {
  const [filter, setFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [gradeFilter, setGradeFilter] = useState('All');
  const [selectedApp, setSelectedApp] = useState(null);
  const [inspectedDoc, setInspectedDoc] = useState(null);
  const [actionSuccessNotice, setActionSuccessNotice] = useState('');

  const [applications, setApplications] = useState(initialApplications);

  const handleStatusChange = (id, newStatus) => {
    setApplications(
      applications.map((app) => (app.id === id ? { ...app, status: newStatus } : app))
    );
    if (selectedApp && selectedApp.id === id) {
      setSelectedApp({ ...selectedApp, status: newStatus });
    }
    setActionSuccessNotice(`Application #${id} status changed to "${newStatus.toUpperCase()}".`);
    setTimeout(() => setActionSuccessNotice(''), 3000);
  };

  const handleToggleDocVerification = (docName) => {
    if (!selectedApp) return;
    const updatedDocs = selectedApp.documents.map((d) =>
      d.name === docName ? { ...d, verified: !d.verified } : d
    );
    const updatedApp = { ...selectedApp, documents: updatedDocs };
    setSelectedApp(updatedApp);
    setApplications(applications.map((a) => (a.id === selectedApp.id ? updatedApp : a)));
    if (inspectedDoc && inspectedDoc.name === docName) {
      setInspectedDoc({ ...inspectedDoc, verified: !inspectedDoc.verified });
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
              className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                filter === status
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
                      <div className="text-[11px] text-slate-400 font-normal">DOB: {app.dob}</div>
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

      {/* Slide-over Drawer for Application Inspection */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 overflow-hidden" role="dialog" aria-modal="true">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
              onClick={() => setSelectedApp(null)}
            />

            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="fixed inset-y-0 right-0 max-w-xl w-full bg-white shadow-2xl p-6 sm:p-8 flex flex-col justify-between overflow-y-auto"
            >
              <div className="space-y-6">
                {/* Drawer Top Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-sm font-bold text-brand-primary">
                        {selectedApp.appId}
                      </span>
                      <Badge variant={selectedApp.status} dot size="sm">
                        {selectedApp.status}
                      </Badge>
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 mt-1">
                      {selectedApp.studentName}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedApp(null)}
                    className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                {/* Candidate Particulars Bento */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-card border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Grade Applying
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedApp.grade}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-card border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Date of Birth
                    </span>
                    <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                      {selectedApp.dob}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-card border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Guardian
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block">
                      {selectedApp.parentName}
                    </span>
                    <span className="text-slate-500 text-[11px] block">{selectedApp.parentPhone}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-card border border-slate-200">
                    <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                      Location
                    </span>
                    <span className="font-semibold text-slate-800 mt-0.5 block truncate">
                      {selectedApp.address}
                    </span>
                    <span className="text-slate-500 text-[11px] block">Bangalore Metro Zone</span>
                  </div>
                </div>

                {/* Document Verification & Inspection Matrix */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Uploaded Documents &amp; Credentials ({selectedApp.documents.length})
                    </h4>
                    <span className="text-[11px] text-slate-400">Click to inspect</span>
                  </div>

                  <div className="space-y-2">
                    {selectedApp.documents.map((doc, i) => (
                      <div
                        key={i}
                        className="p-3 bg-white border border-slate-200 rounded-card hover:border-brand-interactive/70 flex items-center justify-between gap-3 transition-all cursor-pointer group"
                        onClick={() => setInspectedDoc(doc)}
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-interactive flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800 group-hover:text-brand-primary transition-colors">
                              {doc.name}
                            </p>
                            <p className="text-[11px] text-slate-400">
                              {doc.type} &bull; {doc.size}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <span
                            onClick={(e) => {
                              e.stopPropagation();
                              handleToggleDocVerification(doc.name);
                            }}
                            className={`px-2 py-1 rounded text-[10px] font-semibold flex items-center gap-1 cursor-pointer transition-colors ${
                              doc.verified
                                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                : 'bg-amber-50 text-amber-700 border border-amber-200'
                            }`}
                          >
                            {doc.verified ? <Check className="w-3 h-3" /> : <AlertCircle className="w-3 h-3" />}
                            {doc.verified ? 'Verified' : 'Verify'}
                          </span>
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
              <div className="pt-6 border-t border-slate-100 space-y-2 mt-6">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-slate-400 block">
                  Official Administrative Determination
                </span>
                <div className="flex items-center gap-2">
                  <Button
                    variant="primary"
                    className="flex-1 justify-center bg-emerald-600 hover:bg-emerald-700 border-emerald-600"
                    onClick={() => handleStatusChange(selectedApp.id, 'approved')}
                    icon={CheckCircle2}
                  >
                    Grant Admission Offer
                  </Button>
                  <Button
                    variant="danger"
                    className="flex-1 justify-center"
                    onClick={() => handleStatusChange(selectedApp.id, 'rejected')}
                    icon={XCircle}
                  >
                    Reject Candidate
                  </Button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Interactive Document Inspection Modal */}
      {inspectedDoc && (
        <Modal
          isOpen={!!inspectedDoc}
          onClose={() => setInspectedDoc(null)}
          title={`Document Scrutiny: ${inspectedDoc.name}`}
          size="lg"
        >
          <div className="space-y-5">
            {/* Simulated Document Viewer Card */}
            <div className="relative aspect-4/3 w-full bg-slate-900 rounded-card border border-slate-800 p-6 flex flex-col justify-between overflow-hidden shadow-inner text-white">
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

              {/* Body Placeholder Simulation */}
              <div className="relative z-10 space-y-3 py-6 px-4 bg-slate-800/40 rounded-lg border border-slate-700/50">
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
                  <span className="font-mono text-white">{inspectedDoc.size}</span>
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

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <button
                type="button"
                onClick={() => handleToggleDocVerification(inspectedDoc.name)}
                className={`px-4 py-2 rounded-[10px] text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
                  inspectedDoc.verified
                    ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                <Check className="w-3.5 h-3.5" />
                {inspectedDoc.verified ? 'Mark as Incomplete / Unverified' : 'Approve & Mark Verified'}
              </button>

              <div className="flex items-center gap-2">
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
