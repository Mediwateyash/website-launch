import cloudinary from '../config/cloudinary.js';

/**
 * Cloudinary Storage Handler:
 * Streams uploaded files (PDFs, DOCX, Images) directly to Cloudinary.
 * Returns the permanent secure HTTPS URL from Cloudinary CDN.
 */
export const saveUploadedFile = async (file, folder = 'resumes') => {
  if (!file || !file.buffer) {
    return { url: '', fileName: '' };
  }

  const originalName = file.originalname || 'document.pdf';
  const cleanBase = originalName.replace(/[^a-zA-Z0-9._-]/g, '_');
  const ext = originalName.split('.').pop().toLowerCase();
  const baseWithoutExt = cleanBase.replace(/\.[^/.]+$/, '');
  const isDoc = ext === 'doc' || ext === 'docx';
  const publicId = isDoc
    ? `${folder}_${Date.now()}_${baseWithoutExt}.${ext}`
    : `${folder}_${Date.now()}_${baseWithoutExt}`;

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `interskill/${folder}`,
        public_id: publicId,
        resource_type: isDoc ? 'raw' : 'auto',
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary Upload Error]:', error);
          return reject(new Error(error.message || 'Failed to upload document to Cloudinary'));
        }
        resolve({
          url: result.secure_url,
          fileName: originalName,
          publicId: result.public_id,
        });
      }
    );

    uploadStream.end(file.buffer);
  });
};

/**
 * Generates an authenticated signed download URL for private or restricted Cloudinary assets (such as PDFs)
 */
export const getSignedCloudinaryUrl = (url) => {
  if (!url || !url.includes('cloudinary.com')) return null;
  const isImage = url.includes('/image/upload/');
  const match = url.match(/\/upload\/(?:[a-zA-Z0-9_,]+\/)?(?:v\d+\/)?(.+)$/);
  if (!match) return null;
  const path = match[1];

  let publicId = path;
  let format = undefined;
  const resourceType = isImage ? 'image' : 'raw';

  if (isImage) {
    const lastDot = path.lastIndexOf('.');
    if (lastDot !== -1) {
      publicId = path.substring(0, lastDot);
      format = path.substring(lastDot + 1);
    } else {
      format = 'pdf';
    }
  }

  return cloudinary.utils.private_download_url(publicId, format, {
    resource_type: resourceType,
    type: 'upload',
    expires_at: Math.floor(Date.now() / 1000) + 3600,
  });
};
