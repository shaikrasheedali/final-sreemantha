const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  },
});

const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|webp|svg|gif|mp4|webm|mov/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype;

  if (allowedTypes.test(ext) || allowedTypes.test(mime)) {
    cb(null, true);
  } else {
    cb(new Error('Only image (jpeg, jpg, png, webp, svg, gif) and video (mp4, webm, mov) files are permitted.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit
  fileFilter,
});

function handleUpload(req, res) {
  if (!req.file) {
    return res.status(400).json({ error: 'No media file was uploaded.' });
  }

  // Construct URL
  const fileUrl = `/uploads/${req.file.filename}`;
  const isVideo = /mp4|webm|mov/.test(req.file.mimetype) || /mp4|webm|mov/.test(path.extname(req.file.originalname));

  return res.json({
    message: 'File uploaded successfully',
    url: fileUrl,
    filename: req.file.filename,
    originalName: req.file.originalname,
    size: req.file.size,
    mimetype: req.file.mimetype,
    mediaType: isVideo ? 'video' : 'image',
  });
}

module.exports = {
  upload,
  handleUpload,
  uploadDir,
};
