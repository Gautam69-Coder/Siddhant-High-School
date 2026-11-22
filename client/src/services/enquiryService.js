import api from "./api";

export const enquiryService = {
  /**
   * Submit a general enquiry
   * @param {Object} data
   */
  submitEnquiry: async (data) => {
    const response = await api.post("/enquiries", data);
    return response.data;
  },
};

export default enquiryService;
