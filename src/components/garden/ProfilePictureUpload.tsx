'use client';

import { useState, useRef, useEffect } from 'react';

interface ProfilePictureUploadProps {
  currentImage: string;
  onImageChange: (imageUrl: string) => void;
}

/**
 * Convert file to base64 data URL
 */
const convertFileToBase64 = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

/**
 * ProfilePictureUpload - Upload and crop profile pictures
 * Allows users to upload new profile images
 */
export const ProfilePictureUpload = ({ currentImage, onImageChange }: ProfilePictureUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [imageError, setImageError] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  console.log('📸 Profile Picture Upload component initialized');
  console.log('📸 Current image source:', currentImage.substring(0, 100) + '...');
  console.log('📸 Current image type:', currentImage.startsWith('data:') ? 'base64' : currentImage.startsWith('blob:') ? 'blob' : 'url');

  // Reset image error state when currentImage changes
  useEffect(() => {
    setImageError(false);
  }, [currentImage]);

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    console.log('📁 File selected:', file.name, file.size, file.type);

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file');
      return;
    }

    // Validate file size (max 2MB for base64 storage)
    if (file.size > 2 * 1024 * 1024) {
      alert('Image must be smaller than 2MB for storage');
      return;
    }

    setIsUploading(true);

    try {
      // Create a local URL for immediate preview
      const localUrl = URL.createObjectURL(file);
      
      // Convert image to base64 for storage in database
      const base64Url = await convertFileToBase64(file);
      
      console.log('🔄 Base64 conversion complete, length:', base64Url.length);
      console.log('🔄 Base64 preview:', base64Url.substring(0, 100) + '...');
      
      // Use base64 URL for permanent storage
      onImageChange(base64Url);
      
      console.log('✅ Profile picture updated and converted to base64');
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
            onError={(e) => {
              console.error('❌ Image load error:', e);
              console.error('❌ Failed image src:', currentImage.substring(0, 100) + '...');
              setImageError(true);
            }}
            onLoad={() => {
              console.log('✅ Image loaded successfully');
              setImageError(false);
            }}
          />
          
          {/* Loading overlay */}
          {isUploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <div className="w-8 h-8 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            </div>
          )}
          
          {/* Error fallback */}
          {imageError && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800">
              <div className="text-center text-white">
                <div className="text-4xl mb-2">📷</div>
                <div className="text-sm">Image failed to load</div>
              </div>
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
          📸 Upload a square image for best results (max 2MB)
        </p>
      </div>
    </div>
  );
}; 