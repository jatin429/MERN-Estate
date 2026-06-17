import express from 'express';
import multer from 'multer';
import { verifyToken } from '../utils/verifyUser.js';
import { uploadImages } from '../controller/upload.controller.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

const upload = multer({ storage });

router.post('/', verifyToken, upload.array('images', 6), uploadImages);

export default router;
