import api from './api';

const ADMISSION_DOCUMENT_FIELDS = new Set([
  'student_photo',
  'birth_certificate',
  'previous_school_report',
]);

/**
 * Normalizes backend Admission document for frontend consumption in ApplicationsTable
 * @param {Object} raw
 */
export const normalizeAdmission = (raw) => {
  if (!raw) return null;

  const docs = [];
  if (raw.documents?.student_photo) {
    docs.push({
      name: 'Student Photograph',
      type: 'IMAGE',
      size: 'Uploaded',
      verified: true,
      accessField: 'student_photo',
    });
  }
  if (raw.documents?.birth_certificate) {
    const isPdf = raw.document_mime_types?.birth_certificate === 'application/pdf' || raw.documents.birth_certificate.toLowerCase().endsWith('.pdf');
    docs.push({
      name: 'Birth Certificate',
      type: isPdf ? 'PDF' : 'IMAGE',
      size: 'Uploaded',
      verified: true,
      accessField: 'birth_certificate',
    });
  }
  if (raw.documents?.previous_school_report) {
    const isPdf = raw.document_mime_types?.previous_school_report === 'application/pdf' || raw.documents.previous_school_report.toLowerCase().endsWith('.pdf');
    docs.push({
      name: 'Previous School Report',
      type: isPdf ? 'PDF' : 'IMAGE',
      size: 'Uploaded',
      verified: false,
      accessField: 'previous_school_report',
    });
  }

  // Format DOB string
  let dobFormatted = raw.dob || '';
  if (raw.dob) {
    try {
      dobFormatted = new Date(raw.dob).toISOString().split('T')[0];
    } catch {
      dobFormatted = raw.dob;
    }
  }

  return {
    id: raw._id || raw.id,
    appId: raw.application_number || raw.appId || raw._id,
    studentName: raw.student_name || raw.studentName || 'Unnamed Student',
    dob: dobFormatted,
    gender: raw.gender || '',
    grade: raw.grade_applying || raw.grade || 'Not Specified',
    previousSchool: raw.previous_school || raw.previousSchool || '',
    parentName: raw.parent_name || raw.parentName || 'Parent',
    parentEmail: raw.parent_email || raw.parentEmail || '',
    parentPhone: raw.parent_phone || raw.parentPhone || '',
    address: raw.address
      ? `${raw.address}${raw.city ? ', ' + raw.city : ''}${raw.pincode ? ' - ' + raw.pincode : ''}`
      : raw.city || '',
    status: raw.status || 'pending',
    submittedAt: raw.submitted_at || raw.createdAt || new Date().toISOString(),
    documents: docs.length > 0 ? docs : (Array.isArray(raw.documents) ? raw.documents : []),
    internalNotes: raw.internal_notes || '',
    raw,
  };
};

export const admissionService = {
  /**
   * Get all admission applications
   */
  getAllAdmissions: async () => {
    const response = await api.get('/admissions');
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeAdmission) : [];
  },

  /**
   * Get one admission application by ID or application number
   * @param {string} id
   */
  getAdmissionById: async (id) => {
    const response = await api.get(`/admissions/${id}`);
    const data = response.data?.data || response.data;
    return normalizeAdmission(data);
  },

  getAdmissionDocument: async (id, field) => {
    if (!ADMISSION_DOCUMENT_FIELDS.has(field)) {
      throw new Error('Admission document not found.');
    }
    const response = await api.get(
      `/admissions/${encodeURIComponent(id)}/documents/${field}`,
      { responseType: 'blob' }
    );
    return response.data;
  },

  /**
   * Update admission status
   * @param {string} id
   * @param {string} status - 'pending' | 'under_review' | 'approved' | 'rejected'
   */
  updateAdmissionStatus: async (id, status) => {
    const response = await api.patch(`/admissions/${id}/status`, { status });
    const data = response.data?.data || response.data;
    return normalizeAdmission(data);
  },

  /**
   * Delete an admission application
   * @param {string} id
   */
  deleteAdmission: async (id) => {
    const response = await api.delete(`/admissions/${id}`);
    return response.data;
  },
};

export default admissionService;
