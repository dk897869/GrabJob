const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Storage engine
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, '_');
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${uniqueSuffix}-${sanitizedName}`);
  },
});

// File filter: PDF, DOCX, DOC, TXT, RTF, Images (Max 10MB)
const resumeFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.txt', '.rtf', '.png', '.jpg', '.jpeg'];
  const ext = path.extname(file.originalname).toLowerCase();

  if (
    allowedExtensions.includes(ext) ||
    file.mimetype.includes('pdf') ||
    file.mimetype.includes('word') ||
    file.mimetype.includes('document') ||
    file.mimetype.includes('text') ||
    file.mimetype.startsWith('image/') ||
    file.mimetype === 'application/octet-stream'
  ) {
    cb(null, true);
  } else {
    cb(
      new Error('Please upload a PDF, DOCX, DOC, or TXT document (Max 10MB).'),
      false
    );
  }
};

const uploadResume = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: resumeFileFilter,
});

// Chat file filter: PDF, DOCX, Images, TXT up to 10MB
const chatFileFilter = (req, file, cb) => {
  const allowedExtensions = ['.pdf', '.docx', '.doc', '.png', '.jpg', '.jpeg', '.webp', '.txt'];
  const ext = path.extname(file.originalname).toLowerCase();
  if (allowedExtensions.includes(ext) || file.mimetype.startsWith('image/') || file.mimetype.includes('pdf')) {
    cb(null, true);
  } else {
    cb(new Error('Only document (PDF/DOCX/TXT) and image files are supported in chat.'), false);
  }
};

const uploadChatFile = multer({
  storage,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: chatFileFilter,
});

module.exports = { uploadResume, uploadChatFile };

