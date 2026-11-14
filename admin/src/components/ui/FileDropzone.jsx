import React, { useState, useRef } from 'react';
import { UploadCloud, File, X, CheckCircle2, AlertCircle } from 'lucide-react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const FileDropzone = ({
  onFilesSelected,
  selectedFiles,
  validateFile,
  getFileKey,
  existingFileKeys = [],
  duplicateFileMessage = 'This image is already selected.',
  initialFiles = [],
  accept = '.pdf,.jpg,.jpeg,.png',
  maxSizeMB = 5,
  multiple = false,
  label = 'Upload Credentials & Certificates',
  description = 'Drag & drop student academic records, birth certificate, or photos (PDF, PNG, JPG up to 5MB)',
  className = '',
}) => {
  const [dragActive, setDragActive] = useState(false);
  const [fileList, setFileList] = useState(initialFiles);
  const [errorMessage, setErrorMessage] = useState('');
  const inputRef = useRef(null);
  const isControlled = selectedFiles !== undefined;
  const currentFiles = isControlled ? selectedFiles : fileList;

  const handleFiles = (incomingFiles) => {
    setErrorMessage('');
    const validFiles = [];
    const maxSizeBytes = maxSizeMB * 1024 * 1024;

    if (validateFile) {
      const rejectedFiles = [];
      const existingKeys = new Set(
        [
          ...currentFiles.map((file) => getFileKey?.(file)),
          ...existingFileKeys,
        ].filter(Boolean)
      );

      for (let i = 0; i < incomingFiles.length; i++) {
        const file = incomingFiles[i];
        const validationMessage = file.size > maxSizeBytes
          ? `File exceeds the ${maxSizeMB}MB limit.`
          : validateFile(file);
        const fileKey = getFileKey?.(file);

        if (validationMessage) {
          rejectedFiles.push({ file, reason: validationMessage });
        } else if (fileKey && existingKeys.has(fileKey)) {
          rejectedFiles.push({ file, reason: duplicateFileMessage });
        } else {
          validFiles.push(file);
          if (fileKey) existingKeys.add(fileKey);
        }
      }

      const updated = multiple ? [...currentFiles, ...validFiles] : validFiles;
      if (!isControlled) setFileList(updated);
      if (onFilesSelected) {
        onFilesSelected(updated, { addedFiles: validFiles, removedFiles: [], rejectedFiles });
      }
      if (rejectedFiles.length > 0) {
        setErrorMessage(rejectedFiles
          .map(({ file, reason }) => `${file.name}: ${reason}`)
          .join(' '));
      }
      return;
    }

    for (let i = 0; i < incomingFiles.length; i++) {
      const file = incomingFiles[i];
      if (file.size > maxSizeBytes) {
        setErrorMessage(`File "${file.name}" exceeds maximum allowed size of ${maxSizeMB}MB.`);
        return;
      }
      validFiles.push(file);
    }

    const updated = multiple ? [...currentFiles, ...validFiles] : validFiles;
    if (!isControlled) setFileList(updated);
    if (onFilesSelected) onFilesSelected(updated);
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleRemove = (index) => {
    const removedFile = currentFiles[index];
    const updated = currentFiles.filter((_, i) => i !== index);
    if (!isControlled) setFileList(updated);
    if (onFilesSelected) {
      if (validateFile) {
        onFilesSelected(updated, { addedFiles: [], removedFiles: [removedFile], rejectedFiles: [] });
      } else {
        onFilesSelected(updated);
      }
    }
  };

  return (
    <div className={twMerge('w-full flex flex-col gap-2', className)}>
      {label && <span className="text-sm font-medium text-slate-700">{label}</span>}

      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={clsx(
          'relative border-2 border-dashed rounded-card p-6 flex flex-col items-center justify-center text-center cursor-pointer transition-all duration-200',
          dragActive
            ? 'border-brand-interactive bg-blue-50/60'
            : 'border-slate-300 bg-slate-50/60 hover:bg-slate-100/60 hover:border-slate-400'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          multiple={multiple}
          className="hidden"
          onChange={(e) => {
            if (e.target.files) handleFiles(e.target.files);
            if (validateFile) e.target.value = '';
          }}
        />

        <div className="w-12 h-12 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-interactive mb-3">
          <UploadCloud className="w-6 h-6" />
        </div>

        <p className="text-sm font-semibold text-slate-800">
          Click to upload <span className="font-normal text-slate-500">or drag and drop</span>
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-sm">{description}</p>
      </div>

      {errorMessage && (
        <div className="flex items-center gap-1.5 text-xs text-rose-600 mt-1">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {/* Selected files preview pills */}
      {currentFiles.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {currentFiles.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 px-3 py-1.5 bg-white border border-slate-200 rounded-[8px] text-xs shadow-sm"
            >
              <File className="w-3.5 h-3.5 text-brand-interactive" />
              <span className="font-medium text-slate-800 max-w-[180px] truncate">{file.name}</span>
              <span className="text-slate-400">({(file.size / 1024 / 1024).toFixed(1)}MB)</span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemove(idx);
                }}
                className="text-slate-400 hover:text-rose-600 transition-colors ml-1"
                aria-label={`Remove ${file.name}`}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default FileDropzone;

