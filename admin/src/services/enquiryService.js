import api from './api';

/**
 * Normalizes backend GeneralEnquiry document for frontend consumption in EnquiriesTable
 * @param {Object} raw
 */
export const normalizeEnquiry = (raw) => {
  if (!raw) return null;

  let formattedDate = raw.created_at || raw.createdAt || '';
  if (formattedDate) {
    try {
      formattedDate = new Date(formattedDate).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });
    } catch {
      formattedDate = raw.created_at;
    }
  }

  // EnquiriesTable uses 'pending' and 'approved' for its toggle filter
  const uiStatus = raw.status === 'resolved' ? 'approved' : raw.status || 'pending';

  return {
    id: raw._id || raw.id,
    parentName: raw.parent_name || raw.parentName || 'Anonymous Parent',
    email: raw.email || '',
    phone: raw.phone || '',
    gradeInterested: raw.grade_interested || raw.gradeInterested || 'General',
    category: raw.category || 'General information',
    message: raw.message || '',
    status: uiStatus,
    rawStatus: raw.status || 'pending',
    date: formattedDate || 'Recent',
    responseNotes: raw.response_notes || '',
    raw,
  };
};

export const enquiryService = {
  /**
   * Get all enquiries
   */
  getAllEnquiries: async () => {
    const response = await api.get('/enquiries');
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeEnquiry) : [];
  },

  /**
   * Update enquiry status
   * @param {string} id
   * @param {string} status - 'pending' | 'in_progress' | 'resolved'
   * @param {string} responseNotes
   */
  updateEnquiryStatus: async (id, status, responseNotes) => {
    const response = await api.patch(`/enquiries/${id}/status`, {
      status,
      response_notes: responseNotes,
    });
    const data = response.data?.data || response.data;
    return normalizeEnquiry(data);
  },

  /**
   * Delete an enquiry
   * @param {string} id
   */
  deleteEnquiry: async (id) => {
    const response = await api.delete(`/enquiries/${id}`);
    return response.data;
  },
};

export default enquiryService;
