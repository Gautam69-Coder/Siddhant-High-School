import React, { useState } from 'react';
import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Plus, Trash2, UserCheck } from 'lucide-react';
import { initialFacultyProfiles } from '../mockData';

export const FacultyDirectoryManager = () => {
  const [facultyList, setFacultyList] = useState(initialFacultyProfiles);

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('Academics');
  const [qualifications, setQualifications] = useState('');

  const handleAdd = (e) => {
    e.preventDefault();
    if (!name || !role) return;

    setFacultyList([
      ...facultyList,
      { id: Date.now(), name, role, dept, qualifications: qualifications || 'M.Sc, B.Ed' },
    ]);
    setName('');
    setRole('');
    setQualifications('');
  };

  const handleDelete = (id) => {
    setFacultyList(facultyList.filter((f) => f.id !== id));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-base">Faculty Directory Manager</h3>
        <Badge variant="brand" size="sm">Staff CMS</Badge>
      </div>

      <form onSubmit={handleAdd} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Faculty Name"
            placeholder="Dr. Full Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <InputField
            label="Designation / Role"
            placeholder="e.g. Lead Physics Mentor"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Qualifications"
            placeholder="e.g. Ph.D. Physics, B.Ed"
            value={qualifications}
            onChange={(e) => setQualifications(e.target.value)}
          />
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1.5">Department</label>
            <select
              value={dept}
              onChange={(e) => setDept(e.target.value)}
              className="w-full h-11 px-3.5 py-2.5 rounded-[10px] bg-white border border-slate-300 text-sm outline-none"
            >
              <option value="Leadership">Leadership</option>
              <option value="Robotics">Robotics &amp; Innovation</option>
              <option value="Academics">Academics &amp; Science</option>
              <option value="Humanities">Humanities &amp; Languages</option>
              <option value="Sports">Sports Directorate</option>
            </select>
          </div>
        </div>

        <Button type="submit" variant="primary" icon={Plus}>
          Add Faculty Profile
        </Button>
      </form>

      <div className="divide-y divide-slate-100 pt-2">
        {facultyList.map((f) => (
          <div key={f.id} className="py-3 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-sm text-slate-900">{f.name}</span>
                <Badge variant="neutral" size="sm">{f.dept}</Badge>
              </div>
              <p className="text-xs text-slate-600">{f.role} &bull; <span className="text-slate-400">{f.qualifications}</span></p>
            </div>
            <button
              type="button"
              onClick={() => handleDelete(f.id)}
              className="text-slate-400 hover:text-rose-600 p-2"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDirectoryManager;

