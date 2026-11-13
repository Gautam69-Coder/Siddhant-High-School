import React, { useState } from 'react';
import Badge from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Mail, Check, MessageSquare } from 'lucide-react';
import { initialEnquiries } from '../mockData';

export const EnquiriesTable = () => {
  const [enquiries, setEnquiries] = useState(initialEnquiries);

  const toggleResolved = (id) => {
    setEnquiries(
      enquiries.map((e) =>
        e.id === id ? { ...e, status: e.status === 'approved' ? 'pending' : 'approved' } : e
      )
    );
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card shadow-subtle overflow-hidden">
      <div className="p-4 border-b border-slate-100 flex items-center justify-between">
        <h4 className="font-bold text-slate-900 text-sm">Parent &amp; Visitor Enquiries</h4>
        <span className="text-xs text-slate-400">{enquiries.length} total messages</span>
      </div>

      <div className="divide-y divide-slate-100">
        {enquiries.map((enq) => (
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
              <a href={`mailto:${enq.email}`}>
                <Button variant="ghost" size="sm" icon={Mail}>
                  Email Parent
                </Button>
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default EnquiriesTable;

