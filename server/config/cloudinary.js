import { v2 as cloudinary } from 'cloudinary';
import dotenv from 'dotenv';

dotenv.config();

const cloudName = (process.env.CLOUDINARY_CLOUD_NAME || '').trim();
const apiKey = (process.env.CLOUDINARY_API_KEY || '').trim();
const apiSecret = (process.env.CLOUDINARY_API_SECRET || '').trim();

const missing = [];
if (!cloudName) missing.push('CLOUDINARY_CLOUD_NAME');
if (!apiKey) missing.push('CLOUDINARY_API_KEY');
if (!apiSecret) missing.push('CLOUDINARY_API_SECRET');

if (missing.length > 0) {
  throw new Error(
    `Missing required Cloudinary environment variables: ${missing.join(', ')}. Please configure them in your environment.`
  );
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
  secure: true,
});

export default cloudinary;
