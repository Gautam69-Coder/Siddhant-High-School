import React, { useEffect, useRef, useState } from 'react';
import FileDropzone from '../../../components/ui/FileDropzone';
import Badge from '../../../components/ui/Badge';
import { AlertCircle, Image, Trash2 } from 'lucide-react';
import { initialGalleryUploads } from '../mockData';
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

const createGalleryImageId = () => (
  globalThis.crypto?.randomUUID?.()
  || `gallery-${Date.now()}-${Math.random().toString(36).slice(2)}`
);

export const GalleryUploadManager = () => {
  const [galleryItems, setGalleryItems] = useState(initialGalleryUploads);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [failedPreviewIds, setFailedPreviewIds] = useState(() => new Set());
  const [galleryMessage, setGalleryMessage] = useState('');
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

  useEffect(() => {
    let active = true;
    mountedRef.current = true;

    const loadSavedImages = async () => {
      try {
        const records = await getGalleryImageRecords();
        const deletedDemoIds = new Set(
          records.filter((record) => record.kind === 'deleted-demo').map((record) => record.demoId)
        );
        const uploadedRecords = records.filter((record) => (
          record.kind === 'upload' && record.blob instanceof Blob
        ));
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
        if (active) setGalleryMessage('Saved images could not be loaded from this browser.');
      }
    };

    loadSavedImages();
    return () => {
      active = false;
      mountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const displayedUrls = new Set(
      galleryItems.filter((item) => item.url.startsWith('blob:')).map((item) => item.url)
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

  const handleUpload = async (files, { addedFiles = [] } = {}) => {
    const uploadFiles = addedFiles;
    uploadFiles.forEach((file) => {
      const fileKey = getFileKey(file);
      uploadingKeysRef.current.add(fileKey);
    });

    updateSelectedFiles(files);
    setGalleryMessage('');

    const savedItems = [];
    const failedKeys = new Set();
    const failedNames = [];

    for (const file of uploadFiles) {
      const id = createGalleryImageId();
      const fileKey = getFileKey(file);
      try {
        await saveGalleryImageRecord({
          id,
          kind: 'upload',
          title: file.name.replace(/\.[^/.]+$/, ''),
          category: 'Campus',
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
            category: 'Campus',
            url,
            fileKey,
            storageId: id,
          });
        }
      } catch {
        failedKeys.add(fileKey);
        failedNames.push(file.name);
      } finally {
        uploadingKeysRef.current.delete(fileKey);
      }
    }

    if (!mountedRef.current) return;

    if (savedItems.length > 0) {
      updateGalleryItems([...savedItems, ...galleryItemsRef.current]);
    }
    if (failedKeys.size > 0) {
      updateSelectedFiles(selectedFilesRef.current.filter((file) => !failedKeys.has(getFileKey(file))));
      setGalleryMessage(`Could not save ${failedNames.join(', ')} to this browser. Please try again.`);
    }
  };

  const handleDelete = async (item) => {
    if (!window.confirm('Are you sure you want to permanently delete this image from this browser?')) return;

    try {
      if (item.storageId) {
        await deleteGalleryImageRecord(item.storageId);
      } else {
        await saveDeletedDemoImage(item.id);
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
      setGalleryMessage('The image could not be deleted from this browser. Please try again.');
    }
  };

  const showPreviewFallback = (id) => {
    setFailedPreviewIds((ids) => new Set(ids).add(id));
  };

  return (
    <div className="bg-white border border-slate-200 rounded-card p-6 shadow-subtle space-y-6">
      <div className="flex items-center justify-between border-b border-slate-100 pb-4">
        <h3 className="font-bold text-slate-900 text-base">Campus Gallery &amp; Media Manager</h3>
        <Badge variant="brand" size="sm">Browser Only</Badge>
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
        onFilesSelected={handleUpload}
      />

      {galleryMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1" role="alert">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{galleryMessage}</span>
        </div>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4">
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
              <span className="text-[10px] font-semibold truncate">{item.title}</span>
              <button
                type="button"
                onClick={() => handleDelete(item)}
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
