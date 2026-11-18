import api from "./api";

export const admissionService = {
  /**
   * Submit an admission application with multipart/form-data
   * @param {FormData} formData
   */
  submitAdmission: async (formData) => {
    const response = await api.post("/admissions", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  /**
   * Get admission application status by Application ID or MongoDB _id
   * @param {string} id
   */
  getAdmissionById: async (id) => {
    const response = await api.get(`/admissions/${id}`);
    return response.data;
  },
};

export default admissionService;
