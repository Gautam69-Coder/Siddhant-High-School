import React, { useState, useEffect } from 'react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Mail, Check, MessageSquare, Search } from 'lucide-react';
import { adminStorageService } from '../services/adminStorageService';
import enquiryService from '../../../services/enquiryService';

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const EnquiriesTable = () => {
  const [enquiries, setEnquiries] = useState(() => adminStorageService.getEnquiries());
  const [emailErrorId, setEmailErrorId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

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

    try {
      await enquiryService.updateEnquiryStatus(id, backendStatus);
    } catch (err) {
      console.warn('Backend update notice for enquiry:', err.message);
    }
  };

  const handleEmailParent = (event, email, id) => {
    const normalizedEmail = typeof email === 'string' ? email.trim() : '';
    if (!emailPattern.test(normalizedEmail)) {
      event.preventDefault();
      setEmailErrorId(id);
      return;
    }

    setEmailErrorId(null);
  };

  const normalizedSearchQuery = searchQuery.trim().toLowerCase();
  const filteredEnquiries = enquiries.filter((enq) => {
    const matchesSearch = !normalizedSearchQuery || [enq.parentName, enq.phone, enq.email].some(
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

  return (
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
        {filteredEnquiries.map((enq) => (
          <div key={enq.id} className="p-5 hover:bg-slate-50/70 transition-colors">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-2">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-slate-900 text-sm">{enq.parentName}</span>
                <span className="text-xs text-slate-400 font-mono">{enq.phone}</span>
                <Badge variant={enq.status === 'approved' ? 'approved' : 'pending'} size="sm">
                  {enq.status === 'approved' ? 'Resolved' : 'Needs Response'}
                </Badge>
              </div>
              <span className="text-xs text-slate-400">{enq.date}</span>
            </div>

            <p className="text-xs text-slate-600 mb-3">{enq.message}</p>

            <div className="flex items-center gap-2">
              <Button
                variant={enq.status === 'approved' ? 'secondary' : 'primary'}
                size="sm"
                onClick={() => toggleResolved(enq.id)}
                icon={Check}
              >
                {enq.status === 'approved' ? 'Mark Pending' : 'Mark Resolved'}
              </Button>
              <a
                href={`mailto:${typeof enq.email === 'string' ? enq.email.trim() : ''}`}
                onClick={(event) => handleEmailParent(event, enq.email, enq.id)}
              >
                <Button variant="ghost" size="sm" icon={Mail}>
                  Email Parent
                </Button>
              </a>
              {emailErrorId === enq.id && (
                <span className="px-2 py-1 bg-rose-50 border border-rose-200 rounded-[8px] text-xs text-rose-700" role="alert">
                  Email address unavailable.
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnquiriesTable;

