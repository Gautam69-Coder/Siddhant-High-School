import api, { getFileUrl } from "./api";

const normalizeFacultyMember = (member) => ({
  id: member._id || member.id,
  full_name: member.full_name,
  designation: member.designation,
  department: member.department,
  qualifications: member.qualifications || "",
  bio: member.bio || "",
  avatar_url: member.avatar_url ? getFileUrl(member.avatar_url) : null,
  display_order: member.display_order ?? 0,
});

const facultyService = {
  getAllFaculty: async () => {
    const response = await api.get("/faculty");
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeFacultyMember) : [];
  },
};

export default facultyService;
