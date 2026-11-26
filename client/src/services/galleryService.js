import api, { getFileUrl } from "./api";

const normalizeGalleryItem = (item) => ({
  id: item._id || item.id,
  title: item.title || "Campus Photograph",
  category: item.category || "Campus",
  src: item.media_url ? getFileUrl(item.media_url) : item.url || item.src || "",
  thumbnailSrc: item.thumbnail_url ? getFileUrl(item.thumbnail_url) : "",
  media_url: item.media_url,
});

const galleryService = {
  getAllGallery: async () => {
    const response = await api.get("/gallery");
    const data = response.data?.data || response.data || [];
    return Array.isArray(data) ? data.map(normalizeGalleryItem) : [];
  },
};

export default galleryService;
