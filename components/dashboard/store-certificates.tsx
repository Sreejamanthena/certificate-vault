'use client';

import * as React from 'react';

import { useAuth } from '@/components/auth-provider';

import {
  Upload,
  File,
  X,
  Loader2,
  CheckCircle,
  AlertCircle,
  CloudUpload,
} from 'lucide-react';

import { Button } from '@/components/ui/button';

// FIREBASE
import {
  collection,
  addDoc,
  serverTimestamp,
} from 'firebase/firestore';

import { db } from '@/lib/firebase';

const ALLOWED_TYPES = [
  'application/pdf',
  'image/png',
  'image/jpeg',
  'image/jpg',
];

const MAX_SIZE = 10 * 1024 * 1024; // 10MB

export function StoreCertificates() {
  const { user } = useAuth();

  const [dragActive, setDragActive] =
    React.useState(false);

  const [uploading, setUploading] =
    React.useState(false);

  const [uploadProgress, setUploadProgress] =
    React.useState(0);

  const [selectedFile, setSelectedFile] =
    React.useState<File | null>(null);

  const [preview, setPreview] =
    React.useState<string | null>(null);

  // Form fields
  const [certName, setCertName] =
    React.useState('');

  const [category, setCategory] =
    React.useState('');

  const [issuer, setIssuer] =
    React.useState('');

  const [success, setSuccess] =
    React.useState(false);

  const [error, setError] =
    React.useState<string | null>(null);

  const categories = [
    'Academic',
    'Professional',
    'Technical',
    'Language',
    'Creative',
    'Personal',
    'Other',
  ];

  const handleDrag = (
    e: React.DragEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    if (
      e.type === 'dragenter' ||
      e.type === 'dragover'
    ) {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const validateFile = (
    file: File
  ): string | null => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      return 'Only PDF, PNG, JPG, and JPEG files are allowed';
    }

    if (file.size > MAX_SIZE) {
      return 'File size must be less than 10MB';
    }

    return null;
  };

  const handleFile = (file: File) => {
    setError(null);
    setSuccess(false);

    const validationError =
      validateFile(file);

    if (validationError) {
      setError(validationError);
      return;
    }

    setSelectedFile(file);

    setCertName(
      file.name.replace(/\.[^/.]+$/, '')
    );

    // Preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();

      reader.onloadend = () => {
        setPreview(reader.result as string);
      };

      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  const handleDrop = (
    e: React.DragEvent
  ) => {
    e.preventDefault();
    e.stopPropagation();

    setDragActive(false);

    if (
      e.dataTransfer.files &&
      e.dataTransfer.files[0]
    ) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  // REAL CLOUDINARY + FIREBASE UPLOAD
  const handleUpload = async () => {
    if (
      !selectedFile ||
      !user ||
      !certName.trim()
    ) {
      setError(
        'Please fill in all required fields'
      );

      return;
    }

    setUploading(true);
    setError(null);
    setUploadProgress(0);

    try {
      // Create FormData
      const formData = new FormData();

      formData.append('file', selectedFile);

      setUploadProgress(25);

      // Upload to backend API
      const uploadRes = await fetch(
        '/api/upload',
        {
          method: 'POST',
          body: formData,
        }
      );

      if (!uploadRes.ok) {
        throw new Error('Upload failed');
      }

      const uploadData =
        await uploadRes.json();

      /*
        uploadData contains:
        public_id
        asset_id
        secure_url
      */

      setUploadProgress(60);

      // Save metadata to Firestore
      await addDoc(
        collection(db, 'certificates'),
        {
          userId: user.uid,

          certificateName:
            certName.trim(),

          category:
            category || 'Other',

          issuer: issuer.trim(),

          publicId:
            uploadData.public_id,

          assetId:
            uploadData.asset_id,

          fileType:
            selectedFile.type,

          originalFileName:
            selectedFile.name,

          createdAt:
            serverTimestamp(),
        }
      );

      setUploadProgress(100);

      setSuccess(true);

      // Reset form
      setTimeout(() => {
        setSelectedFile(null);
        setPreview(null);
        setCertName('');
        setCategory('');
        setIssuer('');
        setUploadProgress(0);
        setSuccess(false);
      }, 2000);
    } catch (err) {
      console.error(err);

      setError(
        'Failed to upload certificate. Please try again.'
      );
    } finally {
      setUploading(false);
    }
  };

  const clearFile = () => {
    setSelectedFile(null);
    setPreview(null);
    setCertName('');
    setCategory('');
    setIssuer('');
    setError(null);
    setSuccess(false);
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-foreground">
          Store Certificates
        </h1>

        <p className="text-muted-foreground">
          Upload and manage your certificates securely
        </p>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        {/* Upload Area */}
        <div className="space-y-6">
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            className={`
              relative rounded-2xl border-2 border-dashed transition-all duration-200
              ${
                dragActive
                  ? 'border-violet-500 bg-violet-50 dark:bg-violet-950/30'
                  : 'border-border hover:border-violet-400'
              }
              ${selectedFile ? 'p-4' : 'p-12'}
            `}
          >
            {!selectedFile ? (
              <div className="text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950 dark:to-purple-950 mb-4">
                  <CloudUpload className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                </div>

                <p className="text-lg font-medium text-foreground mb-2">
                  Drag and drop your certificate
                </p>

                <p className="text-sm text-muted-foreground mb-4">
                  Supports PDF, PNG, JPG,
                  JPEG (max 10MB)
                </p>

                <label className="cursor-pointer">
                  <input
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg,image/png,image/jpeg,application/pdf"
                    onChange={(e) =>
                      e.target.files?.[0] &&
                      handleFile(
                        e.target.files[0]
                      )
                    }
                    className="hidden"
                  />

                  <span className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white font-semibold shadow-lg shadow-violet-500/25 transition-all duration-200">
                    <Upload className="w-4 h-4" />
                    Browse Files
                  </span>
                </label>
              </div>
            ) : (
              <div className="flex items-start gap-4">
                <div className="relative shrink-0">
                  {preview ? (
                    <img
                      src={preview}
                      alt="Preview"
                      className="w-24 h-24 rounded-xl object-cover"
                    />
                  ) : (
                    <div className="w-24 h-24 rounded-xl bg-gradient-to-br from-violet-100 to-purple-100 dark:from-violet-950 dark:to-purple-950 flex items-center justify-center">
                      <File className="w-8 h-8 text-violet-600 dark:text-violet-400" />
                    </div>
                  )}

                  <button
                    onClick={clearFile}
                    className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 text-white flex items-center justify-center shadow-lg"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-medium text-foreground truncate">
                    {selectedFile.name}
                  </p>

                  <p className="text-sm text-muted-foreground">
                    {(
                      selectedFile.size / 1024
                    ).toFixed(2)}{' '}
                    KB
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Progress */}
          {uploading && (
            <div className="space-y-2">
              <div className="h-2 rounded-full bg-muted overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-violet-600 to-purple-500 transition-all duration-300"
                  style={{
                    width: `${uploadProgress}%`,
                  }}
                />
              </div>

              <p className="text-sm text-muted-foreground text-center">
                Uploading... {uploadProgress}%
              </p>
            </div>
          )}

          {/* Success */}
          {success && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/30 border border-emerald-200 dark:border-emerald-800">
              <CheckCircle className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />

              <p className="text-sm text-emerald-600 dark:text-emerald-400">
                Certificate uploaded successfully!
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-800">
              <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />

              <p className="text-sm text-red-600 dark:text-red-400">
                {error}
              </p>
            </div>
          )}
        </div>

        {/* Form */}
        <div className="backdrop-blur-xl bg-white/70 dark:bg-white/5 border border-white/50 dark:border-white/10 rounded-2xl p-6 shadow-lg space-y-6">
          <h2 className="text-lg font-semibold text-foreground">
            Certificate Details
          </h2>

          <div className="space-y-4">
            {/* Name */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Certificate Name{' '}
                <span className="text-red-500">
                  *
                </span>
              </label>

              <input
                type="text"
                placeholder="e.g., AWS Certificate"
                value={certName}
                onChange={(e) =>
                  setCertName(e.target.value)
                }
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>

            {/* Category */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Category
              </label>

              <select
                value={category}
                onChange={(e) =>
                  setCategory(e.target.value)
                }
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all appearance-none"
              >
                <option value="">
                  Select category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat}
                    value={cat}
                  >
                    {cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Issuer */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Issuer / Organization
              </label>

              <input
                type="text"
                placeholder="e.g., Google"
                value={issuer}
                onChange={(e) =>
                  setIssuer(e.target.value)
                }
                className="w-full px-4 py-2.5 rounded-xl border border-input bg-background focus:outline-none focus:ring-2 focus:ring-violet-500 transition-all"
              />
            </div>
          </div>

          <Button
            onClick={handleUpload}
            disabled={
              !selectedFile ||
              uploading ||
              !certName.trim()
            }
            className="w-full bg-gradient-to-r from-violet-600 to-purple-500 hover:from-violet-700 hover:to-purple-600 text-white border-0 disabled:opacity-50"
          >
            {uploading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="w-4 h-4 mr-2" />
                Upload Certificate
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}