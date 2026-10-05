const { logger } = require('../utils/logger');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const sharp = require('sharp');
const { query } = require('../config/db');

const uploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Memory storage so we can process through Sharp before persisting to disk
const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedExts = /jpeg|jpg|png|webp|svg|gif|mp4|webm|mov/;
  const ext = path.extname(file.originalname).toLowerCase().replace('.', '');
  const mime = file.mimetype.toLowerCase();

  if (allowedExts.test(ext) || allowedExts.test(mime) || mime.startsWith('image/') || mime.startsWith('video/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image (jpeg, jpg, png, webp, svg, gif) and video (mp4, webm, mov) files are permitted.'));
  }
};

const upload = multer({
  storage,
  limits: { fileSize: 80 * 1024 * 1024 }, // 80MB max
  fileFilter,
});

async function handleUpload(req, res) {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No media file was uploaded.' });
    }

    const originalName = req.file.originalname;
    const ext = path.extname(originalName).toLowerCase();
    const isSvg = ext === '.svg' || req.file.mimetype.includes('svg');
    const isVideo = /mp4|webm|mov/.test(ext) || req.file.mimetype.startsWith('video/');

    let savedFilename = '';
    let mimeType = req.file.mimetype;
    let mediaType = isVideo ? 'video' : 'image';
    let width = null;
    let height = null;
    let fileSize = req.file.size;

    if (isVideo) {
      // Store video directly in uploads
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      savedFilename = `video-${uniqueSuffix}${ext || '.mp4'}`;
      const filePath = path.join(uploadDir, savedFilename);
      fs.writeFileSync(filePath, req.file.buffer);
    } else if (isSvg) {
      // SVG: store without raster conversion to preserve vector paths
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      savedFilename = `vector-${uniqueSuffix}.svg`;
      const filePath = path.join(uploadDir, savedFilename);
      fs.writeFileSync(filePath, req.file.buffer);
      mimeType = 'image/svg+xml';
    } else {
      // Standard image: Convert to highly-performant WebP using sharp with auto-rotate and bounded dimensions
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      savedFilename = `asset-${uniqueSuffix}.webp`;
      const filePath = path.join(uploadDir, savedFilename);

      const pipeline = sharp(req.file.buffer)
        .rotate() // Automatically orient image according to EXIF data from phones/cameras
        .resize({
          width: 2400,
          height: 2400,
          fit: 'inside',
          withoutEnlargement: true,
        })
        .webp({ quality: 84, effort: 3, smartSubsample: true });

      const meta = await pipeline.metadata().catch(() => ({}));
      width = meta.width || null;
      height = meta.height || null;

      const info = await pipeline.toFile(filePath);

      fileSize = info.size;
      width = info.width || width;
      height = info.height || height;
      mimeType = 'image/webp';
    }

    const fileUrl = `/uploads/${savedFilename}`;

    // Store in media_assets table
    const result = await query(
      `INSERT INTO media_assets (filename, original_name, url, file_size, mime_type, media_type, width, height)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [savedFilename, originalName, fileUrl, fileSize, mimeType, mediaType, width, height]
    );

    return res.status(201).json({
      message: 'File uploaded and converted successfully',
      url: fileUrl,
      asset: {
        id: result.insertId,
        url: fileUrl,
        filename: savedFilename,
        original_name: originalName,
        file_size: fileSize,
        mime_type: mimeType,
        media_type: mediaType,
        width,
        height,
      },
    });
  } catch (err) {
    logger.error('Media upload error:', err, 'MEDIA');
    return res.status(500).json({ error: 'Failed to process and store media asset: ' + err.message });
  }
}

async function getAllMedia(req, res) {
  try {
    const { media_type, search } = req.query;
    let sql = 'SELECT * FROM media_assets WHERE 1=1';
    const params = [];

    if (media_type && media_type !== 'All' && media_type !== 'all') {
      sql += ' AND media_type = ?';
      params.push(media_type);
    }

    if (search) {
      sql += ' AND (original_name LIKE ? OR filename LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY id DESC';
    const assets = await query(sql, params);
    return res.json({ assets });
  } catch (err) {
    logger.error('Get media assets error:', err, 'MEDIA');
    return res.status(500).json({ error: 'Failed to retrieve media assets.' });
  }
}

async function deleteMedia(req, res) {
  try {
    const { id } = req.params;
    const rows = await query('SELECT * FROM media_assets WHERE id = ?', [id]);

    if (rows.length === 0) {
      return res.status(404).json({ error: 'Media asset not found.' });
    }

    const asset = rows[0];

    // If local file in uploads, remove from disk
    if (asset.url && asset.url.startsWith('/uploads/')) {
      const localPath = path.join(__dirname, '../../', asset.url);
      if (fs.existsSync(localPath)) {
        try {
          fs.unlinkSync(localPath);
        } catch (fsErr) {
          console.warn('Could not remove file on disk:', fsErr.message);
        }
      }
    }

    await query('DELETE FROM media_assets WHERE id = ?', [id]);
    return res.json({ message: 'Media asset permanently deleted.' });
  } catch (err) {
    logger.error('Delete media asset error:', err, 'MEDIA');
    return res.status(500).json({ error: 'Failed to delete media asset.' });
  }
}

module.exports = {
  upload,
  handleUpload,
  getAllMedia,
  deleteMedia,
  uploadDir,
};
