import React from 'react';
import Button from '../../../components/ui/Button';
import { exportToCSV } from '../../../utils/csvExporter';
import { Download, FileSpreadsheet } from 'lucide-react';

export const DataExportBar = ({
  data = [],
  filename = 'siddhant-admissions-export.csv',
  title = 'Export Admission & Enquiry Records',
}) => {
  const handleExportCSV = () => {
    exportToCSV(data, filename);
  };

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 bg-slate-50 border border-slate-200 rounded-card">
      <div className="flex items-center gap-2.5">
        <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
        <div>
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-800">{title}</h4>
          <p className="text-[11px] text-slate-500">Download formatted CSV reports for offline compliance &amp; audits</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button
          variant="secondary"
          size="sm"
          icon={Download}
          onClick={handleExportCSV}
        >
          Export CSV Spreadsheet
        </Button>
      </div>
    </div>
  );
};

export default DataExportBar;
