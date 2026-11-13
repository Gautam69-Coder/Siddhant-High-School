import React from 'react';
import EnquiriesTable from '../../features/admin/applications-manager/EnquiriesTable';

export const AdminEnquiriesPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">
          Parent &amp; Community Enquiries
        </h1>
        <p className="text-xs text-slate-500">
          Track queries submitted via the public contact and information forms.
        </p>
      </div>

      <EnquiriesTable />
    </div>
  );
};

export default AdminEnquiriesPage;

