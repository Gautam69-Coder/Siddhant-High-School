import React, { useState } from 'react';
import InputField from '../../../components/ui/InputField';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Pencil, Plus, Trash2 } from 'lucide-react';
import adminStorageService from '../services/adminStorageService';

export const FacultyDirectoryManager = () => {
  const [facultyList, setFacultyList] = useState(() => adminStorageService.getFaculty());

  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [dept, setDept] = useState('Academics');
  const [qualifications, setQualifications] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [fieldErrors, setFieldErrors] = useState({});

  const resetForm = (resetDepartment = true) => {
    setName('');
    setRole('');
    if (resetDepartment) setDept('Academics');
    setQualifications('');
    setEditingId(null);
    setFieldErrors({});
  };

  const handleSave = (e) => {
    e.preventDefault();
    const wasEditing = editingId !== null;
    const errors = {
      name: name.trim() ? '' : 'Please enter the faculty name.',
      role: role.trim() ? '' : 'Please enter a designation or role.',
      qualifications: qualifications.trim() ? '' : 'Please enter faculty qualifications.',
    };
    setFieldErrors(errors);
    if (errors.name || errors.role || errors.qualifications) return;

    const updatedFacultyList = editingId !== null
      ? facultyList.map((faculty) => faculty.id === editingId
        ? { ...faculty, name: name.trim(), role: role.trim(), dept, qualifications: qualifications.trim() }
        : faculty)
      : [
        ...facultyList,
        {
          id: Date.now(),
          name: name.trim(),
          role: role.trim(),
          dept,
          qualifications: qualifications.trim(),
        },
      ];

    adminStorageService.saveFaculty(updatedFacultyList);
    setFacultyList(updatedFacultyList);
    resetForm(wasEditing);
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this faculty profile?')) return;

    const updatedFacultyList = facultyList.filter((faculty) => faculty.id !== id);
    adminStorageService.saveFaculty(updatedFacultyList);
    setFacultyList(updatedFacultyList);
    if (editingId === id) resetForm();
  };

  const handleEdit = (faculty) => {
    setEditingId(faculty.id);
    setName(faculty.name);
    setRole(faculty.role);
    setDept(faculty.dept);
    setQualifications(faculty.qualifications || '');
    setFieldErrors({});
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-base">Faculty Directory Manager</h3>
        <Badge variant="brand" size="sm">Staff CMS</Badge>
      </div>

      <form onSubmit={handleSave} noValidate className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Faculty Name"
            placeholder="Dr. Full Name"
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              if (fieldErrors.name) setFieldErrors((errors) => ({ ...errors, name: '' }));
            }}
            error={fieldErrors.name}
            required
          />
          <InputField
            label="Designation / Role"
            placeholder="e.g. Lead Physics Mentor"
            value={role}
            onChange={(e) => {
              setRole(e.target.value);
              if (fieldErrors.role) setFieldErrors((errors) => ({ ...errors, role: '' }));
            }}
            error={fieldErrors.role}
            required
          />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <InputField
            label="Qualifications"
            placeholder="e.g. Ph.D. Physics, B.Ed"
            value={qualifications}
            onChange={(e) => {
              setQualifications(e.target.value);
              if (fieldErrors.qualifications) {
                setFieldErrors((errors) => ({ ...errors, qualifications: '' }));
              }
            }}
            error={fieldErrors.qualifications}
            required
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

        <div className="flex items-center gap-2">
          {editingId !== null && (
            <Button type="button" variant="secondary" onClick={resetForm}>
              Cancel
            </Button>
          )}
          <Button type="submit" variant="primary" icon={editingId !== null ? Pencil : Plus}>
            {editingId !== null ? 'Save Changes' : 'Add Faculty Profile'}
          </Button>
        </div>
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
            <div className="flex items-center">
              <button
                type="button"
                onClick={() => handleEdit(f)}
                className="text-slate-400 hover:text-brand-primary p-2"
                aria-label="Edit faculty profile"
              >
                <Pencil className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => handleDelete(f.id)}
                className="text-slate-400 hover:text-rose-600 p-2"
                aria-label="Delete faculty profile"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default FacultyDirectoryManager;

