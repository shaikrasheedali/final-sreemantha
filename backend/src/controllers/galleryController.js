const { query } = require('../config/db');
const { recordAudit } = require('../middleware/auth');

function processMediaUrl(type, url, embedCode) {
  let cleanType = (type || 'image').toLowerCase();
  let finalUrl = (url || '').trim();
  let finalEmbed = (embedCode || '').trim();

  // YouTube normalization
  if (finalUrl.includes('youtube.com/watch?v=') || finalUrl.includes('youtu.be/')) {
    cleanType = 'youtube';
    let videoId = '';
    if (finalUrl.includes('youtu.be/')) {
      videoId = finalUrl.split('youtu.be/')[1]?.split('?')[0];
    } else {
      const match = finalUrl.match(/[?&]v=([^&]+)/);
      if (match) videoId = match[1];
    }
    if (videoId) {
      finalEmbed = `<iframe width="100%" height="450" src="https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>`;
    }
  }

  // Instagram URL normalization
  if (finalUrl.includes('instagram.com/p/') || finalUrl.includes('instagram.com/reel/')) {
    cleanType = 'instagram';
    let postUrl = finalUrl.split('?')[0];
    if (!postUrl.endsWith('/')) postUrl += '/';
    finalEmbed = `<iframe src="${postUrl}embed" width="100%" height="480" frameborder="0" scrolling="no" allowtransparency="true"></iframe>`;
  }

  // Facebook normalization
  if (finalUrl.includes('facebook.com') && !finalEmbed) {
    cleanType = 'facebook';
    const encodedUrl = encodeURIComponent(finalUrl);
    finalEmbed = `<iframe src="https://www.facebook.com/plugins/video.php?height=476&href=${encodedUrl}&show_text=false&width=476&t=0" width="100%" height="480" style="border:none;overflow:hidden" scrolling="no" frameborder="0" allowfullscreen="true" allow="autoplay; clipboard-write; encrypted-media; picture-in-picture; web-share" allowFullScreen="true"></iframe>`;
  }

  return { cleanType, finalUrl, finalEmbed };
}

async function getAllGallery(req, res) {
  try {
    const { category, media_type, search } = req.query;
    let sql = 'SELECT * FROM gallery_items WHERE 1=1';
    const params = [];

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (media_type && media_type !== 'All') {
      sql += ' AND media_type = ?';
      params.push(media_type);
    }

    if (search) {
      sql += ' AND (title LIKE ? OR caption LIKE ?)';
      params.push(`%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY display_order ASC, id DESC';
    const items = await query(sql, params);

    return res.json({ gallery: items, items: items });
  } catch (err) {
    console.error('Get gallery error:', err);
    return res.status(500).json({ error: 'Failed to retrieve gallery items.' });
  }
}

async function getGalleryById(req, res) {
  try {
    const { id } = req.params;
    const items = await query('SELECT * FROM gallery_items WHERE id = ? LIMIT 1', [id]);

    if (items.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found.' });
    }

    return res.json({ galleryItem: items[0] });
  } catch (err) {
    console.error('Get gallery item error:', err);
    return res.status(500).json({ error: 'Failed to retrieve gallery item.' });
  }
}

async function createGalleryItem(req, res) {
  try {
    const { title, category, media_type, media_url, embed_code, thumbnail_url, caption, display_order } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const { cleanType, finalUrl, finalEmbed } = processMediaUrl(media_type, media_url, embed_code);

    const result = await query(
      `INSERT INTO gallery_items (
        title, category, media_type, media_url, embed_code, thumbnail_url, caption, display_order
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        title.trim(),
        category || 'Hospital',
        cleanType,
        finalUrl,
        finalEmbed,
        thumbnail_url || finalUrl || '',
        caption || '',
        display_order || 0,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'gallery', result.insertId, { title, media_type: cleanType });

    return res.status(201).json({
      message: 'Gallery item created successfully.',
      id: result.insertId,
    });
  } catch (err) {
    console.error('Create gallery item error:', err);
    return res.status(500).json({ error: 'Failed to create gallery item.' });
  }
}

async function updateGalleryItem(req, res) {
  try {
    const { id } = req.params;
    const { title, category, media_type, media_url, embed_code, thumbnail_url, caption, display_order } = req.body;

    const existing = await query('SELECT id, title FROM gallery_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found.' });
    }

    const { cleanType, finalUrl, finalEmbed } = processMediaUrl(media_type, media_url, embed_code);

    await query(
      `UPDATE gallery_items SET
        title = ?, category = ?, media_type = ?, media_url = ?, embed_code = ?,
        thumbnail_url = ?, caption = ?, display_order = ?
      WHERE id = ?`,
      [
        title,
        category || 'Hospital',
        cleanType,
        finalUrl,
        finalEmbed,
        thumbnail_url || finalUrl || '',
        caption || '',
        display_order || 0,
        id,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'gallery', id, { title, media_type: cleanType });

    return res.json({ message: 'Gallery item updated successfully.', id });
  } catch (err) {
    console.error('Update gallery item error:', err);
    return res.status(500).json({ error: 'Failed to update gallery item.' });
  }
}

async function deleteGalleryItem(req, res) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title FROM gallery_items WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Gallery item not found.' });
    }

    await query('DELETE FROM gallery_items WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'gallery', id, { title: existing[0].title });

    return res.json({ message: 'Gallery item deleted successfully.' });
  } catch (err) {
    console.error('Delete gallery item error:', err);
    return res.status(500).json({ error: 'Failed to delete gallery item.' });
  }
}

module.exports = {
  getAllGallery,
  getGalleryById,
  createGalleryItem,
  updateGalleryItem,
  deleteGalleryItem,
};
