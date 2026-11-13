import React, { useState } from 'react';
import FileDropzone from '../../../components/ui/FileDropzone';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { Image, Trash2, CloudUpload } from 'lucide-react';
import { initialGalleryUploads } from '../mockData';

export const GalleryUploadManager = () => {
  const [galleryItems, setGalleryItems] = useState(initialGalleryUploads);

  const handleUpload = (files) => {
    // In production uploads to Cloudinary via uploadService.uploadFile
    const newItems = Array.from(files).map((file, i) => ({
      id: Date.now() + i,
      title: file.name.replace(/\.[^/.]+$/, ''),
      category: 'Campus',
      url: URL.createObjectURL(file),
    }));
    setGalleryItems([...newItems, ...galleryItems]);
  };

  const handleDelete = (id) => {
    setGalleryItems(galleryItems.filter((item) => item.id !== id));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-base">Campus Gallery &amp; Media Manager</h3>
        <Badge variant="brand" size="sm">Cloudinary CDN</Badge>
      </div>

      <FileDropzone
        multiple
        label="Bulk Image Upload"
        description="Drag & drop high-resolution campus photos (JPG, PNG up to 10MB)"
        onFilesSelected={handleUpload}
      />

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
        {galleryItems.map((item) => (
          <div key={item.id} className="relative group rounded-card overflow-hidden border border-slate-200 shadow-sm aspect-video">
            <img src={item.url} alt={item.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
              <span className="text-[10px] font-semibold truncate">{item.title}</span>
              <button
                type="button"
                onClick={() => handleDelete(item.id)}
                className="self-end p-1 rounded bg-rose-600 hover:bg-rose-700 text-white"
                aria-label="Delete image"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryUploadManager;

