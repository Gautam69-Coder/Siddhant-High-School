import React, { useState } from 'react';
import InputField from '../../components/ui/InputField';
import Button from '../../components/ui/Button';
import GlassCard from '../../components/ui/GlassCard';
import { Save, Check } from 'lucide-react';
import { initialAdminSettings } from '../../features/admin/mockData';

export const AdminSettingsPage = () => {
  const [saved, setSaved] = useState(false);
  const [settings, setSettings] = useState(initialAdminSettings);

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-4xl">
      <div>
        <h1 className="text-2xl font-bold font-display text-slate-900">
          Platform Configuration &amp; Settings
        </h1>
        <p className="text-xs text-slate-500">
          Manage admission session dates, intake limits, and administrative defaults.
        </p>
      </div>

      <GlassCard className="p-6 sm:p-8 border-slate-200">
        <form onSubmit={handleSave} className="space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="School Official Title"
              value={settings.schoolName}
              onChange={(e) => setSettings({ ...settings, schoolName: e.target.value })}
            />
            <InputField
              label="Parent Education Society"
              value={settings.societyName}
              onChange={(e) => setSettings({ ...settings, societyName: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Active Academic Year"
              value={settings.academicYear}
              onChange={(e) => setSettings({ ...settings, academicYear: e.target.value })}
            />
            <InputField
              label="Annual Intake Seat Limit"
              type="number"
              value={settings.intakeLimit}
              onChange={(e) => setSettings({ ...settings, intakeLimit: e.target.value })}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <InputField
              label="Admissions Deadline Date"
              type="date"
              value={settings.admissionsDeadline}
              onChange={(e) => setSettings({ ...settings, admissionsDeadline: e.target.value })}
            />
            <InputField
              label="Admissions Inquiries Inbox"
              type="email"
              value={settings.contactEmail}
              onChange={(e) => setSettings({ ...settings, contactEmail: e.target.value })}
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
            {saved ? (
              <span className="text-xs font-semibold text-emerald-600 flex items-center gap-1.5">
                <Check className="w-4 h-4" /> Preferences saved successfully.
              </span>
            ) : <div />}

            <Button type="submit" variant="primary" icon={Save}>
              Save Preferences
            </Button>
          </div>
        </form>
      </GlassCard>
    </div>
  );
};

export default AdminSettingsPage;
