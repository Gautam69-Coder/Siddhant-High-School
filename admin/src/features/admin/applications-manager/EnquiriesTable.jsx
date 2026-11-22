import React, { useState, useEffect } from 'react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import Modal from '../../../components/ui/Modal';
import {
  Mail,
  Check,
  MessageSquare,
  Search,
  Phone,
  Copy,
  CheckCheck,
  Send,
  X,
  AlertCircle,
  Eye,
  GraduationCap,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { adminStorageService } from '../services/adminStorageService';
import enquiryService from '../../../services/enquiryService';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EnquiriesTable = () => {
  const [enquiries, setEnquiries] = useState(() => adminStorageService.getEnquiries());
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [selectedEnquiry, setSelectedEnquiry] = useState(null);
  const [reviewEnquiry, setReviewEnquiry] = useState(null);
  const [reviewNotes, setReviewNotes] = useState('');
  const [savingNotes, setSavingNotes] = useState(false);
  const [emailSubject, setEmailSubject] = useState('');
  const [emailBody, setEmailBody] = useState('');
  const [markResolvedOnSend, setMarkResolvedOnSend] = useState(true);
  const [copiedText, setCopiedText] = useState(false);
  const [actionNotice, setActionNotice] = useState('');

  useEffect(() => {
    let isMounted = true;
    enquiryService.getAllEnquiries()
      .then((data) => {
        if (isMounted) {
          if (data && data.length > 0) {
            setEnquiries(data);
          } else {
            setEnquiries(adminStorageService.getEnquiries());
          }
        }
      })
      .catch((err) => {
        console.warn('Could not load live enquiries, using stored fallback:', err);
        if (isMounted) {
          setEnquiries(adminStorageService.getEnquiries());
        }
      });

    return () => { isMounted = false; };
  }, []);

  const saveEnquiries = (updatedEnquiries) => {
    try {
      adminStorageService.saveEnquiries(updatedEnquiries);
      return JSON.stringify(adminStorageService.getEnquiries()) === JSON.stringify(updatedEnquiries);
    } catch (error) {
      console.warn('Failed to save enquiry changes:', error);
      return false;
    }
  };

  const toggleResolved = async (id) => {
    const currentEnquiry = enquiries.find((e) => e.id === id);
    const newUiStatus = currentEnquiry?.status === 'approved' ? 'pending' : 'approved';
    const backendStatus = newUiStatus === 'approved' ? 'resolved' : 'pending';

    const updatedEnquiries = enquiries.map((e) =>
      e.id === id ? { ...e, status: newUiStatus, rawStatus: backendStatus } : e
    );
    setEnquiries(updatedEnquiries);
    saveEnquiries(updatedEnquiries);

    if (selectedEnquiry && selectedEnquiry.id === id) {
      setSelectedEnquiry({ ...selectedEnquiry, status: newUiStatus, rawStatus: backendStatus });
    }
    if (reviewEnquiry && reviewEnquiry.id === id) {
      setReviewEnquiry({ ...reviewEnquiry, status: newUiStatus, rawStatus: backendStatus });
    }

    try {
      await enquiryService.updateEnquiryStatus(id, backendStatus);
    } catch (err) {
      console.warn('Backend update notice for enquiry:', err.message);
    }

    const message = newUiStatus === 'approved' ? 'Enquiry marked as Resolved.' : 'Enquiry marked as Pending.';
    setActionNotice(message);
    setTimeout(() => setActionNotice(''), 3000);
  };

  const handleOpenReviewModal = (enq) => {
    setReviewEnquiry(enq);
    setReviewNotes(enq.responseNotes || enq.raw?.response_notes || '');
  };

  const handleSaveReviewNotes = async () => {
    if (!reviewEnquiry) return;
    setSavingNotes(true);
    try {
      await enquiryService.updateEnquiryStatus(
        reviewEnquiry.id,
        reviewEnquiry.rawStatus,
        reviewNotes
      );
      const updatedEnquiries = enquiries.map((e) =>
        e.id === reviewEnquiry.id
          ? { ...e, responseNotes: reviewNotes }
          : e
      );
      setEnquiries(updatedEnquiries);
      saveEnquiries(updatedEnquiries);
      setReviewEnquiry((prev) => prev ? { ...prev, responseNotes: reviewNotes } : null);
      setActionNotice('Administrative follow-up notes saved successfully.');
      setTimeout(() => setActionNotice(''), 3000);
    } catch (err) {
      console.warn('Could not save notes to backend:', err);
      const updatedEnquiries = enquiries.map((e) =>
        e.id === reviewEnquiry.id
          ? { ...e, responseNotes: reviewNotes }
          : e
      );
      setEnquiries(updatedEnquiries);
      saveEnquiries(updatedEnquiries);
      setActionNotice('Notes saved to local workspace.');
      setTimeout(() => setActionNotice(''), 3000);
    } finally {
      setSavingNotes(false);
    }
  };

  const handleOpenEmailModal = (enq) => {
    setSelectedEnquiry(enq);
    setEmailSubject(`Regarding your enquiry at Siddhant High School`);
    setEmailBody(
      `Dear ${enq.parentName},\n\nThank you for reaching out to Siddhant High School.\n\nIn response to your query: "${enq.message || 'admissions'}", we would like to provide you with the required information.\n\nPlease feel free to reply to this email or call our administrative desk if you have any further questions.\n\nWarm regards,\nAdmissions & Front Desk Office\nSiddhant High School`
    );
    setMarkResolvedOnSend(enq.status !== 'approved');
    setCopiedText(false);
  };

  const handleSendEmail = async () => {
    if (!selectedEnquiry) return;
    const emailTo = typeof selectedEnquiry.email === 'string' ? selectedEnquiry.email.trim() : '';

    if (emailTo && emailPattern.test(emailTo)) {
      const mailtoUrl = `mailto:${encodeURIComponent(emailTo)}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`;
      window.location.href = mailtoUrl;
    }

    if (markResolvedOnSend && selectedEnquiry.status !== 'approved') {
      await toggleResolved(selectedEnquiry.id);
    }
    setActionNotice(
      emailTo
        ? `Mail client opened for ${selectedEnquiry.parentName}.`
        : `Enquiry updated for ${selectedEnquiry.parentName}.`
    );
    setTimeout(() => setActionNotice(''), 3500);
    setSelectedEnquiry(null);
  };

  const handleCopyEmailText = () => {
    const fullText = `To: ${selectedEnquiry?.email || 'N/A'}\nSubject: ${emailSubject}\n\n${emailBody}`;
    navigator.clipboard?.writeText(fullText);
    setCopiedText(true);
    setTimeout(() => setCopiedText(false), 2000);
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch = !normalizedSearchQuery || [enq.parentName, enq.phone, enq.email, enq.category, enq.gradeInterested, enq.grade].some(
      (value) => typeof value === 'string' && value.toLowerCase().includes(normalizedSearchQuery)
    );
    const matchesStatus = statusFilter === 'All' ||
      (statusFilter === 'Pending' ? enq.status === 'pending' : enq.status === 'approved');

    return matchesSearch && matchesStatus;
  });

  const statusCounts = {
    All: enquiries.length,
    Pending: enquiries.filter((enq) => enq.status === 'pending').length,
    Resolved: enquiries.filter((enq) => enq.status === 'approved').length,
  };

  const isValidEmail = selectedEnquiry?.email && emailPattern.test(selectedEnquiry.email.trim());

  return (
    <div className="space-y-4">
      {/* Toast Notice */}
      {actionNotice && (
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-card text-xs flex items-center justify-between"
        >
          <span className="font-semibold flex items-center gap-2">
            <Check className="w-4 h-4 text-emerald-600" /> {actionNotice}
          </span>
          <button type="button" onClick={() => setActionNotice('')} aria-label="Dismiss notice">
            <X className="w-4 h-4 text-emerald-600" />
          </button>
        </motion.div>
      )}

      <div className="bg-white border border-slate-200 rounded-card shadow-subtle overflow-hidden">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between">
          <h4 className="font-bold text-slate-900 text-sm">Parent &amp; Visitor Enquiries</h4>
          <span className="text-xs text-slate-400">{enquiries.length} total messages</span>
        </div>

        <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
            {['All', 'Pending', 'Resolved'].map((status) => (
              <button
                key={status}
                type="button"
                aria-pressed={statusFilter === status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors ${
                  statusFilter === status
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                {status}
                <span className="ml-1.5 opacity-70 text-[10px]">{statusCounts[status]}</span>
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="search"
              aria-label="Search enquiries by parent name, phone number, or email address"
              placeholder="Search by name, phone, or email..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="pl-8 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-[8px] focus:outline-none focus:border-brand-interactive w-full"
            />
          </div>
        </div>

        <div className="divide-y divide-slate-100">
          {filteredEnquiries.length === 0 ? (
            <div className="p-8 text-center text-xs text-slate-400">
              No enquiries match your search filter.
            </div>
          ) : (
            filteredEnquiries.map((enq) => (
              <div key={enq.id} className="p-5 hover:bg-slate-50/70 transition-colors">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
                  <div className="flex items-center gap-3">
                    <span
                      onClick={() => handleOpenReviewModal(enq)}
                      className="font-semibold text-slate-900 text-sm hover:text-brand-interactive cursor-pointer transition-colors"
                      title="Click to review enquiry"
                    >
                      {enq.parentName}
                    </span>
                    <span className="text-xs text-slate-400 font-mono">{enq.phone}</span>
                    <Badge variant={enq.status === 'approved' ? 'approved' : 'pending'} size="sm">
                      {enq.status === 'approved' ? 'Resolved' : 'Needs Response'}
                    </Badge>
                  </div>
                  <span className="text-xs text-slate-400">{enq.date}</span>
                </div>

                <p
                  onClick={() => handleOpenReviewModal(enq)}
                  className="text-xs text-slate-600 mb-3 cursor-pointer hover:text-slate-800 transition-colors"
                  title="Click to review enquiry"
                >
                  {enq.message}
                </p>

                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Eye}
                    onClick={() => handleOpenReviewModal(enq)}
                  >
                    Review
                  </Button>
                  <Button
                    variant={enq.status === 'approved' ? 'secondary' : 'primary'}
                    size="sm"
                    onClick={() => toggleResolved(enq.id)}
                    icon={Check}
                  >
                    {enq.status === 'approved' ? 'Mark Pending' : 'Mark Resolved'}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Mail}
                    onClick={() => handleOpenEmailModal(enq)}
                  >
                    Email Parent
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Enquiry Scrutiny & Review Pop-up Modal */}
      {reviewEnquiry && (
        <Modal
          isOpen={!!reviewEnquiry}
          onClose={() => setReviewEnquiry(null)}
          title={`Enquiry Review: ${reviewEnquiry.parentName}`}
          subtitle={`Ref: #ENQ-${String(reviewEnquiry.id).slice(-6)} • Received ${reviewEnquiry.date}`}
          maxWidth="max-w-2xl"
          zIndex="z-[60]"
        >
          <div className="space-y-5">
            {/* Enquiry Particulars Bento */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Parent / Inquirer
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
                  {reviewEnquiry.parentName}
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5">
                  Ref: #ENQ-{String(reviewEnquiry.id).slice(-6)}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Grade &amp; Category
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block">
                  {reviewEnquiry.gradeInterested || reviewEnquiry.grade || 'General Inquiry'}
                </span>
                <span className="text-slate-500 text-[11px] block mt-0.5 truncate" title={reviewEnquiry.category}>
                  {reviewEnquiry.category || 'General Information'}
                </span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Phone Contact
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-semibold text-slate-800 text-xs">
                    {reviewEnquiry.phone || 'N/A'}
                  </span>
                  {reviewEnquiry.phone && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(reviewEnquiry.phone);
                        setActionNotice('Phone copied to clipboard');
                        setTimeout(() => setActionNotice(''), 2500);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Copy phone"
                      aria-label="Copy phone"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <span className="text-slate-400 text-[10px] block mt-0.5">Verified Contact Line</span>
              </div>

              <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Email Address
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-semibold text-slate-800 text-xs truncate" title={reviewEnquiry.email}>
                    {reviewEnquiry.email || 'None Provided'}
                  </span>
                  {reviewEnquiry.email && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(reviewEnquiry.email);
                        setActionNotice('Email copied to clipboard');
                        setTimeout(() => setActionNotice(''), 2500);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Copy email"
                      aria-label="Copy email"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
                <Badge variant={reviewEnquiry.status === 'approved' ? 'approved' : 'pending'} size="sm" className="mt-1">
                  {reviewEnquiry.status === 'approved' ? 'Resolved' : 'Needs Response'}
                </Badge>
              </div>
            </div>

            {/* Parent Message Card */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                  <MessageSquare className="w-4 h-4 text-brand-interactive" />
                  Received Enquiry Message
                </h4>
                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {reviewEnquiry.date}
                </span>
              </div>
              <div className="p-4 bg-slate-50 rounded-card border border-slate-200 text-xs text-slate-800 leading-relaxed font-sans shadow-inner">
                "{reviewEnquiry.message || 'No specific text included in this enquiry submission.'}"
              </div>
            </div>

            {/* Administrative Follow-Up Notes */}
            <div className="space-y-2 pt-1">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold uppercase tracking-wider text-slate-800">
                  Administrative Follow-Up &amp; Resolution Notes
                </label>
                <span className="text-[10px] text-slate-400">Internal tracking log</span>
              </div>
              <textarea
                rows={3}
                value={reviewNotes}
                onChange={(e) => setReviewNotes(e.target.value)}
                placeholder="Record administrative actions, call notes, or follow-up status here..."
                className="w-full p-3 text-xs bg-white border border-slate-200 rounded-[8px] focus:outline-none focus:border-brand-interactive text-slate-800 leading-relaxed font-sans"
              />
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleSaveReviewNotes}
                  disabled={savingNotes}
                  className="px-3 py-1.5 text-xs font-semibold rounded-[8px] bg-slate-900 hover:bg-slate-800 text-white transition-colors cursor-pointer disabled:opacity-50"
                >
                  {savingNotes ? 'Saving Notes...' : 'Save Follow-Up Notes'}
                </button>
              </div>
            </div>

            {/* Modal Determination Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant={reviewEnquiry.status === 'approved' ? 'secondary' : 'primary'}
                  size="sm"
                  className={reviewEnquiry.status !== 'approved' ? 'bg-emerald-600 hover:bg-emerald-700 border-emerald-600 text-white' : ''}
                  onClick={async () => {
                    await toggleResolved(reviewEnquiry.id);
                  }}
                  icon={Check}
                >
                  {reviewEnquiry.status === 'approved' ? 'Mark as Pending' : 'Mark as Resolved'}
                </Button>

                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  icon={Mail}
                  onClick={() => {
                    const enq = reviewEnquiry;
                    setReviewEnquiry(null);
                    handleOpenEmailModal(enq);
                  }}
                >
                  Email Parent &amp; Reply
                </Button>
              </div>

              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => setReviewEnquiry(null)}
              >
                Close Review
              </Button>
            </div>
          </div>
        </Modal>
      )}

      {/* Email Parent & Direct Composer Pop-up Modal */}
      {selectedEnquiry && (
        <Modal
          isOpen={!!selectedEnquiry}
          onClose={() => setSelectedEnquiry(null)}
          title={`Email Parent: ${selectedEnquiry.parentName}`}
          subtitle="Direct parent correspondence & enquiry response tracking"
          maxWidth="max-w-2xl"
          zIndex="z-[60]"
        >
          <div className="space-y-5">
            {/* Parent Particulars Card */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 text-xs">
              <div className="p-3 bg-slate-50 rounded-card border border-slate-200">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Parent Name
                </span>
                <span className="font-bold text-slate-800 text-sm mt-0.5 block truncate">
                  {selectedEnquiry.parentName}
                </span>
              </div>
              <div className="p-3 bg-slate-50 rounded-card border border-slate-200">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Phone Number
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-semibold text-slate-800 text-xs">
                    {selectedEnquiry.phone || 'N/A'}
                  </span>
                  {selectedEnquiry.phone && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(selectedEnquiry.phone);
                        setActionNotice('Phone number copied to clipboard');
                        setTimeout(() => setActionNotice(''), 2500);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Copy phone"
                      aria-label="Copy phone number"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
              <div className="p-3 bg-slate-50 rounded-card border border-slate-200">
                <span className="text-slate-400 block font-semibold uppercase tracking-wider text-[10px]">
                  Email Address
                </span>
                <div className="flex items-center justify-between mt-0.5">
                  <span className="font-mono font-semibold text-slate-800 text-xs truncate" title={selectedEnquiry.email}>
                    {selectedEnquiry.email || 'No email provided'}
                  </span>
                  {selectedEnquiry.email && (
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard?.writeText(selectedEnquiry.email);
                        setActionNotice('Email copied to clipboard');
                        setTimeout(() => setActionNotice(''), 2500);
                      }}
                      className="text-slate-400 hover:text-slate-600 p-1"
                      title="Copy email"
                      aria-label="Copy email address"
                    >
                      <Copy className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Email warning banner if invalid or missing */}
            {!isValidEmail && (
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-[8px] text-xs text-amber-800 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
                <span>Parent has not provided a valid email address. You can copy the drafted response below to send via SMS or WhatsApp ({selectedEnquiry.phone}).</span>
              </div>
            )}

            {/* Original Parent Message Card */}
            <div className="p-3.5 bg-slate-50 rounded-card border border-slate-200 space-y-1">
              <div className="flex items-center justify-between text-[11px] text-slate-500 font-semibold">
                <span className="flex items-center gap-1.5 uppercase tracking-wider text-[10px] text-slate-400">
                  <MessageSquare className="w-3.5 h-3.5 text-brand-interactive" /> Received Message
                </span>
                <Badge variant={selectedEnquiry.status === 'approved' ? 'approved' : 'pending'} size="sm">
                  {selectedEnquiry.status === 'approved' ? 'Resolved' : 'Needs Response'}
                </Badge>
              </div>
              <p className="text-xs text-slate-700 leading-relaxed italic pt-1">
                "{selectedEnquiry.message || 'No specific inquiry message included.'}"
              </p>
            </div>

            {/* Email Composer Form */}
            <div className="space-y-3 pt-1">
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Email Subject
                </label>
                <input
                  type="text"
                  value={emailSubject}
                  onChange={(e) => setEmailSubject(e.target.value)}
                  className="w-full px-3 py-2 text-xs bg-white border border-slate-200 rounded-[8px] focus:outline-none focus:border-brand-interactive text-slate-800"
                  placeholder="Subject..."
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="block text-xs font-semibold text-slate-700">
                    Response Message
                  </label>
                  {/* Quick Template Buttons */}
                  <div className="flex items-center gap-1.5 text-[10px]">
                    <button
                      type="button"
                      onClick={() =>
                        setEmailBody(
                          `Dear ${selectedEnquiry.parentName},\n\nThank you for your interest in Siddhant High School. We would be pleased to welcome you for a personalized campus tour and consultation with our academic counselors.\n\nPlease let us know what date and time would be convenient for you.\n\nWarm regards,\nAdmissions Office\nSiddhant High School`
                        )
                      }
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      + Campus Tour
                    </button>
                    <button
                      type="button"
                      onClick={() =>
                        setEmailBody(
                          `Dear ${selectedEnquiry.parentName},\n\nThank you for reaching out to Siddhant High School. In response to your enquiry regarding admissions for the 2026-27 academic session, our admissions desk is actively reviewing candidates.\n\nYou can find our fee structure and curriculum details on our official portal, or reply directly to this email.\n\nWarm regards,\nAdmissions Office\nSiddhant High School`
                        )
                      }
                      className="px-2 py-0.5 rounded bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
                    >
                      + Admissions Info
                    </button>
                  </div>
                </div>
                <textarea
                  rows={5}
                  value={emailBody}
                  onChange={(e) => setEmailBody(e.target.value)}
                  className="w-full p-3 text-xs bg-white border border-slate-200 rounded-[8px] focus:outline-none focus:border-brand-interactive text-slate-800 font-sans resize-y leading-relaxed"
                  placeholder="Type your official reply message here..."
                />
              </div>

              {/* Status Resolution Checkbox */}
              <label className="flex items-center gap-2 cursor-pointer select-none pt-1">
                <input
                  type="checkbox"
                  checked={markResolvedOnSend}
                  onChange={(e) => setMarkResolvedOnSend(e.target.checked)}
                  className="rounded text-brand-interactive focus:ring-brand-interactive w-4 h-4"
                />
                <span className="text-xs text-slate-700 font-medium">
                  Automatically mark this enquiry as <strong className="text-emerald-700">Resolved</strong> upon sending
                </span>
              </label>
            </div>

            {/* Modal Actions */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-3 border-t border-slate-100">
              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={handleCopyEmailText}
                  icon={copiedText ? CheckCheck : Copy}
                >
                  {copiedText ? 'Copied' : 'Copy Response'}
                </Button>
                {selectedEnquiry.status !== 'approved' && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={async () => {
                      await toggleResolved(selectedEnquiry.id);
                      setSelectedEnquiry(null);
                    }}
                    icon={Check}
                  >
                    Mark Resolved Only
                  </Button>
                )}
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => setSelectedEnquiry(null)}
                >
                  Cancel
                </Button>
                <Button
                  type="button"
                  variant="primary"
                  size="sm"
                  onClick={handleSendEmail}
                  icon={Send}
                  className="bg-brand-interactive hover:bg-brand-primary"
                >
                  {isValidEmail ? 'Open in Mail & Send' : 'Save & Mark Handled'}
                </Button>
              </div>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
};

export default EnquiriesTable;