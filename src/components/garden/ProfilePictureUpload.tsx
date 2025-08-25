'use client';

import { useState, useRef } from 'react';

interface ProfilePictureUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
}

/**
 * ProfilePictureUpload - Upload and crop profile pictures
 * Allows users to upload new profile images
 */
export const ProfilePictureUpload = ({ currentImage, onImageChange }: ProfilePictureUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('📸 Profile Picture Upload component initialized');

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 File selected:', file.name, file.size);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('Image must be smaller than 5MB');
      return;
    }

    setIsUploading(true);

    try {
      // Create a local URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      
      // TODO: Upload to cloud storage
      // const uploadedUrl = await uploadToCloudStorage(file);
      
      // For now, use the local URL
      onImageChange(localUrl);
      
      console.log('✅ Profile picture updated');
    } catch (error) {
      console.error('❌ Failed to upload image:', error);
      alert('Failed to upload image. Please try again.');
    } finally {
      setIsUploading(false);
      
      // Reset the input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="relative">
      {/* Current Image */}
      <div className="relative w-full max-w-sm mx-auto">
        <div className="aspect-square rounded-lg overflow-hidden">
          <img
            src={currentImage}
            alt="Profile picture"
            className={`w-full h-full object-cover transition-opacity ${
              isUploading ? 'opacity-50' : 'opacity-100'
            }`}
          />
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
        </div>
        
        {/* Upload button */}
        <button
          onClick={handleUploadClick}
          disabled={isUploading}
          className="absolute bottom-2 right-2 bg-gray-800/80 hover:bg-gray-700/80 rounded-full px-3 py-2 transition-colors disabled:opacity-50"
        >
          <div className="flex items-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
              <path d="M14.5 3a2.5 2.5 0 0 0-2.4 1.9l-.85 4.2a.5.5 0 0 1-.49.4H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-4.75a.5.5 0 0 1-.49-.4l-.85-4.2A2.5 2.5 0 0 0 14.5 3z"/>
              <circle cx="12" cy="15" r="2"/>
            </svg>
            <span className="text-white text-xs">
              {isUploading ? 'Uploading...' : 'Change photo'}
            </span>
          </div>
        </button>
      </div>

      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />

      {/* Upload instructions */}
      <div className="mt-4 text-center">
        <p className="text-gray-400 text-xs">
          📸 Upload a square image for best results (max 5MB)
        </p>
      </div>
    </div>
  );
}; 