// fileUploadController.js
const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 50 * 1024 * 1024, // 50MB limit for documents
    files: 2, // Only allow 1 file and 1 image
  },
  fileFilter: (req, file, cb) => {
    // Allowed file types
    const allowedDocs = ['application/pdf', 'application/msword'];
    const allowedImages = ['image/jpeg', 'image/jpg'];

    if (allowedDocs.includes(file.mimetype)) {
      cb(null, true);
    } else if (allowedImages.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type'), false);
    }
  },
}).fields([
  { name: 'fileDoc', maxCount: 1 },
  { name: 'fileImage', maxCount: 1 },
]);

const fileUploadController = {
  async uploadFiles(req, res) {
    try {
      upload(req, res, (err) => {
        if (err) {
          return res.status(400).json({ message: err.message });
        }

        // Extract the uploaded file data from the request
        const { user, key, fileAccess, expirationTime } = req.body;
        const fileDoc = req.files.fileDoc?.[0];
        const fileImage = req.files.fileImage?.[0];

        // Validate the input data
        if (!user || !key || !fileDoc || !fileImage || !expirationTime) {
          return res.status(400).json({ message: 'Please fill in all required fields.' });
        }

        if (key.length !== 4 || isNaN(key)) {
          return res.status(400).json({ message: 'The "Enter Key" field must be a 4-digit number.' });
        }

        // Process the uploaded files and store the data
        // You can add your logic here to store the file details in the database or perform any other necessary operations

        return res.status(200).json({ message: 'Files uploaded successfully.' });
      });
    } catch (error) {
      console.error('Error uploading files:', error);
      return res.status(500).json({ message: 'Error uploading files. Please try again.' });
    }
  },
};

module.exports = fileUploadController;