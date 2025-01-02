import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

const storage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, cb) => {
        // Keep original filename with extension
        cb(null, file.originalname);
    }
});

const upload = multer({ storage: storage });

export default upload.single('photo');