import express from 'express';
import multer from 'multer';
import Tesseract from 'tesseract.js';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Setup storage for uploaded files
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const uploadPath = 'uploads/';
    if (!fs.existsSync(uploadPath)) fs.mkdirSync(uploadPath);
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// OCR Endpoint: Upload file and extract Survey Number
router.post('/extract', upload.single('document'), async (req, res) => {
  if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

  try {
    const { data: { text } } = await Tesseract.recognize(req.file.path, 'eng');
    
    // Simple logic to find a Survey Number (e.g., SY/2026/1847)
    const surveyMatch = text.match(/SY\/\d{4}\/\d{4}/);
    const surveyNumber = surveyMatch ? surveyMatch[0] : 'Not Found';

    res.json({ 
      text: text.substring(0, 500), // Return first 500 chars for preview
      extractedSurveyNumber: surveyNumber,
      filePath: req.file.path 
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
