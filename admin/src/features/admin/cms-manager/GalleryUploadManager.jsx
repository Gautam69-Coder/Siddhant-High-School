import React, { useEffect, useRef, useState } from 'react';
import FileDropzone from '../../../components/ui/FileDropzone';
import Button from '../../../components/ui/Button';
import Badge from '../../../components/ui/Badge';
import { AlertCircle, Image, Trash2, UploadCloud, CheckCircle2 } from 'lucide-react';
import { initialGalleryUploads } from '../mockData';
import galleryMediaService from '../../../services/galleryMediaService';
import {
  deleteGalleryImageRecord,
  getGalleryImageRecords,
  saveDeletedDemoImage,
  saveGalleryImageRecord,
} from '../services/galleryImageDb';

const MAX_IMAGE_SIZE = 10 * 1024 * 1024;
const ALLOWED_IMAGE_TYPES = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
};

const getFileKey = (file) => JSON.stringify([
  file.name,
  file.size,
  file.type.toLowerCase(),
  file.lastModified,
]);

const validateImageFile = (file) => {
  if (file.size > MAX_IMAGE_SIZE) return 'Images must be 10MB or smaller.';

  const extension = file.name.slice(file.name.lastIndexOf('.')).toLowerCase();
  const expectedType = ALLOWED_IMAGE_TYPES[extension];
  if (!expectedType || (file.type && file.type.toLowerCase() !== expectedType)) {
    return 'Choose a JPG, PNG, or WebP image.';
  }

  return '';
};

export const GalleryUploadManager = () => {
  const [galleryItems, setGalleryItems] = useState(initialGalleryUploads);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [category, setCategory] = useState('Campus');
  const [failedPreviewIds, setFailedPreviewIds] = useState(() => new Set());
  const [galleryMessage, setGalleryMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const galleryItemsRef = useRef(initialGalleryUploads);
  const selectedFilesRef = useRef([]);
  const objectUrlsRef = useRef(new Set());
  const uploadingKeysRef = useRef(new Set());
  const mountedRef = useRef(false);

  const updateGalleryItems = (items) => {
    galleryItemsRef.current = items;
    setGalleryItems(items);
  };

  const updateSelectedFiles = (files) => {
    selectedFilesRef.current = files;
    setSelectedFiles(files);
  };

  // Fetch gallery media from backend on mount
  useEffect(() => {
    let active = true;
    mountedRef.current = true;

    const loadImages = async () => {
      try {
        const liveItems = await galleryMediaService.getAllMedia();
        if (active && Array.isArray(liveItems) && liveItems.length > 0) {
          updateGalleryItems(liveItems);
          return;
        }
      } catch (err) {
        console.warn('Backend gallery fetch failed, checking local IndexedDB cache:', err.message);
      }

      // Fallback to IndexedDB / initial mock uploads
      try {
        const records = await getGalleryImageRecords();
        const deletedDemoIds = new Set(
          records.filter((record) => record.kind === 'deleted-demo').map((record) => record.demoId)
        );
        const uploadedRecords = records.filter(
          (record) => record.kind === 'upload' && record.blob instanceof Blob
        );
        const restoredFiles = [];
        const restoredItems = uploadedRecords.map((record) => {
          const file = new File([record.blob], record.fileName, {
            type: record.type,
            lastModified: record.lastModified,
          });
          const url = URL.createObjectURL(record.blob);
          objectUrlsRef.current.add(url);
          restoredFiles.push(file);

          return {
            id: record.id,
            title: record.title,
            category: record.category,
            url,
            fileKey: record.fileKey || getFileKey(file),
            storageId: record.id,
          };
        });

        if (!active) {
          restoredItems.forEach((item) => {
            URL.revokeObjectURL(item.url);
            objectUrlsRef.current.delete(item.url);
          });
          return;
        }

        const demoItems = initialGalleryUploads.filter((item) => !deletedDemoIds.has(item.id));
        updateGalleryItems([...restoredItems, ...demoItems]);
        updateSelectedFiles(restoredFiles);
      } catch {
        if (active) setGalleryMessage('Initial demo images loaded.');
      }
    };

    loadImages();
    return () => {
      active = false;
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const displayedUrls = new Set(
      galleryItems.filter((item) => item.url?.startsWith('blob:')).map((item) => item.url)
    );

    objectUrlsRef.current.forEach((url) => {
      if (!displayedUrls.has(url)) {
        URL.revokeObjectURL(url);
        objectUrlsRef.current.delete(url);
      }
    });
  }, [galleryItems]);

  useEffect(() => () => {
    objectUrlsRef.current.forEach((url) => URL.revokeObjectURL(url));
    objectUrlsRef.current.clear();
  }, []);

  // Submit staged files to the server
  const handleSubmitUpload = async (e) => {
    if (e) e.preventDefault();
    if (selectedFiles.length === 0 || isUploading) return;

    const uploadFiles = [...selectedFiles];
    uploadFiles.forEach((file) => {
      const fileKey = getFileKey(file);
      uploadingKeysRef.current.add(fileKey);
    });

    setGalleryMessage('');
    setSuccessMessage('');
    setIsUploading(true);

    try {
      // Send files to backend API with chosen category
      const uploadedMedia = await galleryMediaService.uploadImages(uploadFiles, category);
      if (mountedRef.current && Array.isArray(uploadedMedia) && uploadedMedia.length > 0) {
        updateGalleryItems([...uploadedMedia, ...galleryItemsRef.current]);
        updateSelectedFiles([]);
        setSuccessMessage(`Successfully submitted ${uploadedMedia.length} image(s) to ${category} gallery.`);
      }
    } catch (err) {
      console.warn('Backend upload failed, attempting local browser storage:', err.message);
      // Graceful fallback to IndexedDB if backend is unreachable
      const savedItems = [];
      for (const file of uploadFiles) {
        const id = `local-${Date.now()}-${Math.random().toString(36).slice(2)}`;
        const fileKey = getFileKey(file);
        try {
          await saveGalleryImageRecord({
            id,
            kind: 'upload',
            title: file.name.replace(/\.[^/.]+$/, ''),
            category,
            fileName: file.name,
            size: file.size,
            type: file.type,
            lastModified: file.lastModified,
            fileKey,
            blob: file,
          });

          if (mountedRef.current) {
            const url = URL.createObjectURL(file);
            objectUrlsRef.current.add(url);
            savedItems.push({
              id,
              title: file.name.replace(/\.[^/.]+$/, ''),
              category,
              url,
              fileKey,
              storageId: id,
            });
          }
        } catch {
          // ignore local fallback error
        }
      }

      if (mountedRef.current && savedItems.length > 0) {
        updateGalleryItems([...savedItems, ...galleryItemsRef.current]);
        updateSelectedFiles([]);
        setSuccessMessage(`Saved ${savedItems.length} image(s) to local storage.`);
      } else {
        setGalleryMessage(`Upload failed: ${err.message || 'Please check your connection and try again.'}`);
      }
    } finally {
      uploadFiles.forEach((file) => {
        uploadingKeysRef.current.delete(getFileKey(file));
      });
      if (mountedRef.current) setIsUploading(false);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to permanently delete this image?')) return;

    try {
      try {
        await galleryMediaService.deleteMedia(item.id);
      } catch (apiErr) {
        console.warn('Server delete failed or demo item, attempting local cleanup:', apiErr.message);
        if (item.storageId && String(item.storageId).startsWith('local-')) {
          await deleteGalleryImageRecord(item.storageId);
        } else {
          await saveDeletedDemoImage(item.id);
        }
      }

      updateGalleryItems(galleryItemsRef.current.filter((galleryItem) => galleryItem.id !== item.id));
      if (item.fileKey) {
        updateSelectedFiles(selectedFilesRef.current.filter((file) => getFileKey(file) !== item.fileKey));
      }
      setFailedPreviewIds((ids) => {
        const nextIds = new Set(ids);
        nextIds.delete(item.id);
        return nextIds;
      });
      setGalleryMessage('');
    } catch {
      setGalleryMessage('The image could not be deleted. Please try again.');
    }
  };

  const showPreviewFallback = (id) => {
    setFailedPreviewIds((ids) => new Set(ids).add(id));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <div>
          <h3 className="font-bold text-slate-900 text-base">Campus Gallery &amp; Media Manager</h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Stage campus photos, select a category, and submit to publish directly to the live gallery.
          </p>
        </div>
        <Badge variant="brand" size="sm">Admin CMS</Badge>
      </div>

      <FileDropzone
        multiple
        selectedFiles={selectedFiles}
        getFileKey={getFileKey}
        existingFileKeys={[
          ...galleryItems.map((item) => item.fileKey).filter(Boolean),
          ...uploadingKeysRef.current,
        ]}
        duplicateFileMessage="This image is already in the gallery or upload selection."
        validateFile={validateImageFile}
        accept=".jpg,.jpeg,.png,.webp,image/jpeg,image/png,image/webp"
        maxSizeMB={10}
        label="Bulk Image Upload"
        description="Drag & drop campus photos (JPG, PNG, WebP up to 10MB)"
        onFilesSelected={(files) => {
          updateSelectedFiles(files);
          setGalleryMessage('');
          setSuccessMessage('');
        }}
      />

      {/* Submit Action Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-1 pb-2 border-b border-slate-100">
        <div className="flex items-center gap-3">
          <label htmlFor="gallery-category-select" className="text-xs font-semibold text-slate-700 whitespace-nowrap">
            Category:
          </label>
          <select
            id="gallery-category-select"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-10 px-3.5 py-2 rounded-[10px] bg-white text-slate-900 border border-slate-300 text-xs focus:border-brand-interactive outline-none font-medium transition-colors"
          >
            <option value="Campus">Campus</option>
            <option value="Robotics & STEM">Robotics &amp; STEM</option>
            <option value="Sports">Sports</option>
            <option value="Cultural">Cultural</option>
            <option value="Academics">Academics</option>
            <option value="Innovation">Innovation</option>
            <option value="Student Activities">Student Activities</option>
          </select>
          {selectedFiles.length > 0 && (
            <span className="text-xs text-slate-500 font-medium">
              {selectedFiles.length} file{selectedFiles.length > 1 ? 's' : ''} staged
            </span>
          )}
        </div>

        <div className="flex items-center gap-2 justify-end">
          {selectedFiles.length > 0 && (
            <Button
              type="button"
              variant="secondary"
              size="sm"
              disabled={isUploading}
              onClick={() => {
                updateSelectedFiles([]);
                setGalleryMessage('');
                setSuccessMessage('');
              }}
            >
              Clear
            </Button>
          )}
          <Button
            type="button"
            variant="primary"
            size="sm"
            icon={UploadCloud}
            loading={isUploading}
            disabled={selectedFiles.length === 0 || isUploading}
            onClick={handleSubmitUpload}
          >
            {isUploading
              ? 'Uploading...'
              : selectedFiles.length > 0
              ? `Submit ${selectedFiles.length} Image${selectedFiles.length > 1 ? 's' : ''}`
              : 'Submit Images'}
          </Button>
        </div>
      </div>

      {successMessage && (
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 font-medium" role="status">
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          <span>{successMessage}</span>
        </div>
      )}

      {galleryMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 font-medium" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{galleryMessage}</span>
        </div>
      )}

      {/* Gallery Cards Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2">
        {galleryItems.map((item) => (
          <div key={item.id} className="relative group rounded-card overflow-hidden border border-slate-200 shadow-sm aspect-video">
            {failedPreviewIds.has(item.id) ? (
              <div className="w-full h-full flex flex-col items-center justify-center gap-2 bg-slate-100 text-slate-500">
                <Image className="w-6 h-6" aria-hidden="true" />
                <span className="text-xs">Preview unavailable</span>
              </div>
            ) : (
              <img
                src={item.url}
                alt={item.title}
                className="w-full h-full object-cover"
                onError={() => showPreviewFallback(item.id)}
              />
            )}
            <div className="absolute inset-0 bg-slate-900/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-between text-white">
              <div>
                <span className="text-[10px] font-semibold truncate block">{item.title}</span>
                {item.category && (
                  <span className="text-[9px] text-slate-300 font-normal uppercase tracking-wider">{item.category}</span>
                )}
              </div>
              <button
                type="button"
                onClick={() => handleDelete(item)}
                className="self-end p-1.5 rounded bg-rose-600 hover:bg-rose-700 text-white transition-colors"
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
