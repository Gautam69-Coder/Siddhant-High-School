import api, { getFileUrl } from "./api";

const normalizeGallery = (item) => ({
  id: item._id || item.id,
  title: item.title,
  category: item.category,
  url: item.media_url ? getFileUrl(item.media_url) : item.url,
  rawUrl: item.media_url || item.url,
  fileKey: item.media_url || item.id,
  storageId: item._id || item.id,
  createdAt: item.created_at || item.createdAt,
});

const galleryMediaService = {
  getAllMedia: async () => {
    const response = await api.get("/gallery");
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeGallery) : [];
  },

  uploadImages: async (files, category = "Campus") => {
    const formData = new FormData();
    files.forEach((file) => {
      formData.append("images", file);
    });
    formData.append("category", category);

    const response = await api.post("/gallery/upload", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    const data = response.data?.data || response.data || [];
    return Array.isArray(data)
      ? data.map(normalizeGallery)
      : [normalizeGallery(data)];
  },

  deleteMedia: async (id) => {
    const response = await api.delete(`/gallery/${id}`);
    return response.data;
  },
};

export default galleryMediaService;
