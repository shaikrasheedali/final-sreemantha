const { logger } = require('../utils/logger');
const { query } = require('../config/db');
const { slugify } = require('../utils/helpers');
const { recordAudit } = require('../middleware/auth');

async function getAllInsights(req, res) {
  try {
    const { status, category, featured, search } = req.query;
    let sql = 'SELECT * FROM blog_posts WHERE 1=1';
    const params = [];

    if (!req.user && status !== 'all') {
      sql += ' AND status = \'published\'';
    } else if (status && status !== 'all') {
      sql += ' AND status = ?';
      params.push(status);
    }

    if (category && category !== 'All') {
      sql += ' AND category = ?';
      params.push(category);
    }

    if (featured === 'true' || featured === '1') {
      sql += ' AND featured = 1';
    }

    if (search) {
      sql += ' AND (title LIKE ? OR summary LIKE ? OR content LIKE ?)';
      params.push(`%${search}%`, `%${search}%`, `%${search}%`);
    }

    sql += ' ORDER BY published_at DESC, id DESC';
    const items = await query(sql, params);

    return res.json({ insights: items });
  } catch (err) {
    logger.error('Get insights error:', err, 'INSIGHTS');
    return res.status(500).json({ error: 'Failed to retrieve insights/blog posts.' });
  }
}

async function getInsightBySlug(req, res) {
  try {
    const { slug } = req.params;
    const items = await query('SELECT * FROM blog_posts WHERE slug = ? OR id = ? LIMIT 1', [slug, slug]);

    if (items.length === 0) {
      return res.status(404).json({ error: 'Article/Insight not found.' });
    }

    const item = items[0];

    // Fetch related articles
    const related = await query(
      'SELECT id, slug, title, category, summary, image_url, published_at FROM blog_posts WHERE id != ? AND status = \'published\' ORDER BY published_at DESC LIMIT 3',
      [item.id]
    );

    return res.json({
      insight: item,
      relatedInsights: related,
    });
  } catch (err) {
    logger.error('Get insight error:', err, 'INSIGHTS');
    return res.status(500).json({ error: 'Failed to retrieve article details.' });
  }
}

async function createInsight(req, res) {
  try {
    const {
      title,
      slug,
      category,
      author,
      read_time,
      summary,
      content,
      image_url,
      published_at,
      featured,
      status,
    } = req.body;

    if (!title) {
      return res.status(400).json({ error: 'Title is required.' });
    }

    const postSlug = (slug || slugify(title)).trim();
    const existing = await query('SELECT id FROM blog_posts WHERE slug = ?', [postSlug]);
    if (existing.length > 0) {
      return res.status(409).json({ error: 'An article with this slug already exists.' });
    }

    const dateStr = published_at || new Date().toISOString().split('T')[0];

    const result = await query(
      `INSERT INTO blog_posts (
        slug, title, category, author, read_time, summary, content,
        image_url, published_at, featured, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        postSlug,
        title.trim(),
        category || 'Fertility & Reproductive Health',
        author || 'Clinical Editorial Team',
        read_time || '5 min read',
        summary || '',
        content || '',
        image_url || '',
        dateStr,
        featured ? 1 : 0,
        status || 'published',
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'CREATE', 'insights', result.insertId, { title, slug: postSlug });

    return res.status(201).json({
      message: 'Article created successfully.',
      id: result.insertId,
      slug: postSlug,
    });
  } catch (err) {
    logger.error('Create insight error:', err, 'INSIGHTS');
    return res.status(500).json({ error: 'Failed to create article.' });
  }
}

async function updateInsight(req, res) {
  try {
    const { id } = req.params;
    const {
      title,
      slug,
      category,
      author,
      read_time,
      summary,
      content,
      image_url,
      published_at,
      featured,
      status,
    } = req.body;

    const existing = await query('SELECT id, title FROM blog_posts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    const postSlug = slug ? slugify(slug) : slugify(title || existing[0].title);
    const dateStr = published_at || new Date().toISOString().split('T')[0];

    await query(
      `UPDATE blog_posts SET
        slug = ?, title = ?, category = ?, author = ?, read_time = ?,
        summary = ?, content = ?, image_url = ?, published_at = ?,
        featured = ?, status = ?
      WHERE id = ?`,
      [
        postSlug,
        title,
        category || 'Fertility & Reproductive Health',
        author || 'Clinical Editorial Team',
        read_time || '5 min read',
        summary || '',
        content || '',
        image_url || '',
        dateStr,
        featured ? 1 : 0,
        status || 'published',
        id,
      ]
    );

    await recordAudit(req.user?.username || 'Admin', 'UPDATE', 'insights', id, { title, slug: postSlug });

    return res.json({ message: 'Article updated successfully.', id, slug: postSlug });
  } catch (err) {
    logger.error('Update insight error:', err, 'INSIGHTS');
    return res.status(500).json({ error: 'Failed to update article.' });
  }
}

async function deleteInsight(req, res) {
  try {
    const { id } = req.params;
    const existing = await query('SELECT id, title FROM blog_posts WHERE id = ?', [id]);
    if (existing.length === 0) {
      return res.status(404).json({ error: 'Article not found.' });
    }

    await query('DELETE FROM blog_posts WHERE id = ?', [id]);
    await recordAudit(req.user?.username || 'Admin', 'DELETE', 'insights', id, { title: existing[0].title });

    return res.json({ message: 'Article deleted successfully.' });
  } catch (err) {
    logger.error('Delete insight error:', err, 'INSIGHTS');
    return res.status(500).json({ error: 'Failed to delete article.' });
  }
}

module.exports = {
  getAllInsights,
  getInsightBySlug,
  createInsight,
  updateInsight,
  deleteInsight,
};
