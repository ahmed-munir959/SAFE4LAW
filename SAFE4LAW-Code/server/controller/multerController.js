const multer = require('multer');
const path = require('path');

// Define allowed file types
const DOC_FILE_TYPES = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
const IMAGE_FILE_TYPES = ['image/jpeg', 'image/jpg'];

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Set different destinations based on file type
    if (file.fieldname === 'fileDoc') {
      cb(null, 'uploads/documents/');
    } else if (file.fieldname === 'fileImage') {
      cb(null, 'uploads/images/');
    }
  },
  filename: function (req, file, cb) {
    // Create unique filename with original extension
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

// File filter function
const fileFilter = (req, file, cb) => {
  if (file.fieldname === 'fileDoc') {
    if (DOC_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid document format. Only PDF and DOC files are allowed!'), false);
    }
  } else if (file.fieldname === 'fileImage') {
    if (IMAGE_FILE_TYPES.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid image format. Only JPEG and JPG files are allowed!'), false);
    }
  } else {
    cb(new Error('Unexpected field'), false);
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: {
      fileDoc: 50 * 1024 * 1024, // 50MB for documents
      fileImage: 5 * 1024 * 1024  // 5MB for images
    }
  }
});

// Export multer middleware
module.exports = upload;