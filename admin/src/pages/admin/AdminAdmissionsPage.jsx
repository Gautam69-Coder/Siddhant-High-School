import React from 'react';
import ApplicationsTable from '../../features/admin/applications-manager/ApplicationsTable';
import DataExportBar from '../../features/admin/reports/DataExportBar';
import { adminStorageService } from '../../features/admin/services/adminStorageService';

export const AdminAdmissionsPage = () => {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Admissions Application Directorate
          </h1>
          <p className="text-xs text-slate-500">
            Review applicant credentials, verify uploaded documents, and issue acceptance offers.
          </p>
        </div>
      </div>

      {/* Export Bar */}
      <DataExportBar
        data={() => adminStorageService.getApplications()}
        title="Export All 2026-27 Candidates"
        filename="siddhant_admissions_2026.csv"
      />

      {/* Triage Data Table */}
      <ApplicationsTable />
    </div>
  );
};

export default AdminAdmissionsPage;
