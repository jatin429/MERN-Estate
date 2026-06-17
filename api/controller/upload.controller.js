import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
import { errorHandler } from '../utils/error.js';

export const uploadImages = async (req, res, next) => {
  try {
    if (!req.files || req.files.length === 0) {
      return next(errorHandler(400, 'No files uploaded'));
    }

    console.log('uploadImages - received files:', req.files.map(f=>({originalname:f.originalname,size:f.size,mimetype:f.mimetype,path:f.path}))); 

    const uploadPromises = req.files.map(async (file) => {
      try {
        const result = await cloudinary.uploader.upload(file.path, { folder: 'listings' });
        try { fs.unlinkSync(file.path); } catch (e) {}
        return result.secure_url;
      } catch (e) {
        try { fs.unlinkSync(file.path); } catch (er) {}
        console.error(`Cloudinary upload failed for ${file.originalname}:`, e);
        throw new Error('Image upload failed');
      }
    });

    const urls = await Promise.all(uploadPromises);

    return res.status(200).json({ urls });
  } catch (error) {
    console.error('uploadImages error:', error);
    next(errorHandler(500, 'Image upload failed'));
  }
};
