// Cloudinary configuration and utilities
const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'your_cloud_name';
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || 'your_upload_preset';

/**
 * Upload file to Cloudinary
 * @param {File} file - The file to upload
 * @returns {Promise<string>} - Cloudinary URL of uploaded image
 */
export const uploadToCloudinary = async (file) => {
  if (!file) {
    throw new Error('No file provided');
  }

  if (!file.type.startsWith('image/')) {
    throw new Error('File must be an image');
  }

  const formData = new FormData();
  formData.append('file', file);
  formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

  try {
    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    return data.secure_url; // Return the secure HTTPS URL
  } catch (error) {
    console.error('Cloudinary upload error:', error);
    throw error;
  }
};

/**
 * Generate preview URL for uploaded image
 * @param {string} url - Cloudinary URL
 * @returns {string} - URL to display
 */
export const getPreviewUrl = (url) => {
  if (!url) return null;
  if (url.startsWith('data:')) {
    return url; // Already a data URL
  }
  if (url.startsWith('http')) {
    return url; // Already a full URL
  }
  // Assume it's a Cloudinary URL
  return url;
};

/**
 * Validate image before upload
 * @param {File} file - The file to validate
 * @param {number} maxSizeMB - Maximum file size in MB
 * @returns {Object} - { valid: boolean, error: string }
 */
export const validateImage = (file, maxSizeMB = 5) => {
  if (!file) {
    return { valid: false, error: 'No file selected' };
  }

  if (!file.type.startsWith('image/')) {
    return { valid: false, error: 'File must be an image' };
  }

  const maxSizeBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxSizeBytes) {
    return { valid: false, error: `File size must not exceed ${maxSizeMB}MB` };
  }

  return { valid: true };
};
