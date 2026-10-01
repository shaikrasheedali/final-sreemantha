import React, { useEffect, useState } from 'react';
import {
  Plus, Search, Edit3, Trash2, Eye, X, Upload,
  Image as ImageIcon, Video, AlertCircle, Save, Check
} from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '../../components/SocialIcons';
import { GalleryModal } from '../../components/GalleryModal';
import { MediaPickerModal } from '../../components/MediaPickerModal';
import { GalleryItem } from '../../types';
import { api } from '../../utils/api';

export const AdminGalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);
  const [previewItem, setPreviewItem] = useState<GalleryItem | null>(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  // Form
  const [formData, setFormData] = useState({
    title: '',
    caption: '',
    category: 'Hospital',
    media_type: 'image',
    media_url: '',
    embed_code: '',
    thumbnail_url: '',
    status: 'published'
  });

  const categories = ['Hospital', 'Facilities', 'Events', 'Medical Team', 'Awareness Programs', 'Celebrations'];

  const loadItems = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ items?: GalleryItem[]; gallery?: GalleryItem[] }>('/gallery');
      const galleryList = res.items || res.gallery || [];
      setItems(galleryList);
    } catch (err: any) {
      console.error('Failed to load gallery items:', err);
      showNotice('Failed to load gallery items.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadItems();
  }, []);

  const showNotice = (message: string, type: 'success' | 'error') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const handleCreateNew = () => {
    setFormData({
      title: '',
      caption: '',
      category: 'Hospital',
      media_type: 'image',
      media_url: '',
      embed_code: '',
      thumbnail_url: '',
      status: 'published'
    });
    setSelectedItem(null);
    setIsEditing(true);
  };

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item);
    setFormData({
      title: item.title || '',
      caption: item.caption || '',
      category: item.category || 'Hospital',
      media_type: item.media_type || 'image',
      media_url: item.media_url || '',
      embed_code: item.embed_code || '',
      thumbnail_url: item.thumbnail_url || '',
      status: item.status || 'published'
    });
    setIsEditing(true);
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const uploadForm = new FormData();
      uploadForm.append('file', file);

      const token = localStorage.getItem('sreemantha_auth_token');
      const response = await fetch('/api/media/upload', {
        method: 'POST',
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: uploadForm
      });
      const data = await response.json();
      if (data.url) {
        setFormData((prev) => ({
          ...prev,
          media_url: data.url,
          media_type: file.type.startsWith('video') ? 'video' : 'image',
          thumbnail_url: prev.thumbnail_url || data.url
        }));
        showNotice('Media uploaded successfully.', 'success');
      } else {
        throw new Error(data.message || 'Upload failed');
      }
    } catch (err: any) {
      console.error('File upload error:', err);
      showNotice(err?.message || 'File upload failed.', 'error');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      if (selectedItem?.id) {
        await api.put(`/gallery/${selectedItem.id}`, formData);
        showNotice('Gallery item updated.', 'success');
      } else {
        await api.post('/gallery', formData);
        showNotice('New gallery item published.', 'success');
      }
      setIsEditing(false);
      setSelectedItem(null);
      await loadItems();
    } catch (err: any) {
      console.error('Save failed:', err);
      showNotice(err?.message || 'Failed to save gallery item.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: number) => {
    try {
      await api.delete(`/gallery/${id}`);
      showNotice('Item removed from gallery.', 'success');
      setDeleteConfirmId(null);
      await loadItems();
    } catch (err: any) {
      console.error('Delete failed:', err);
      showNotice('Failed to delete item.', 'error');
    }
  };

  const filteredItems = items.filter((item) => {
    const term = search.toLowerCase();
    return (
      (item.title || '').toLowerCase().includes(term) ||
      (item.category || '').toLowerCase().includes(term) ||
      (item.media_type || '').toLowerCase().includes(term)
    );
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      {notification && (
        <div
          className={`p-4 rounded-2xl flex items-center justify-between text-xs font-bold shadow-lg animate-in fade-in ${
            notification.type === 'success' ? 'bg-emerald-600 text-white' : 'bg-rose-600 text-white'
          }`}
        >
          <span>{notification.message}</span>
          <button onClick={() => setNotification(null)} className="p-1 hover:opacity-80">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-[var(--coral)] uppercase tracking-wider block mb-1">
            Media & Embed Lightbox Manager
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-[var(--ink)] font-display">
            Gallery Management
          </h1>
          <p className="text-xs text-[#5a7d92] mt-1">
            Upload images & videos or embed interactive iframes from Instagram, YouTube, and Facebook.
          </p>
        </div>

        {!isEditing && (
          <button
            onClick={handleCreateNew}
            className="self-start sm:self-auto px-5 py-2.5 rounded-xl bg-[#fa7830] hover:bg-[#e06622] text-white text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer"
            style={{ color: '#ffffff' }}
          >
            <Plus className="w-4 h-4 text-white" /> Add Gallery Media
          </button>
        )}
      </div>

      {isEditing ? (
        /* Create / Edit Form */
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] p-6 sm:p-8 shadow-xl">
          <div className="flex items-center justify-between pb-4 border-b border-[rgba(22,55,76,0.12)] mb-6">
            <h2 className="text-lg font-bold text-[var(--ink)] font-display">
              {selectedItem ? 'Edit Gallery Item' : 'New Gallery Upload / Embed'}
            </h2>
            <button
              onClick={() => setIsEditing(false)}
              className="p-2 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:bg-[var(--mint)] text-[#5a7d92] transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          <form onSubmit={handleSave} className="space-y-6">
            {/* Title & Category */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                  Item Title <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Advanced Embryology Laboratory"
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                  Category
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                >
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Media Type Selector */}
            <div>
              <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                Media Source & Type
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                {[
                  { id: 'image', label: 'Image', icon: ImageIcon },
                  { id: 'video', label: 'Video', icon: Video },
                  { id: 'youtube', label: 'YouTube', icon: YoutubeIcon },
                  { id: 'instagram', label: 'Instagram', icon: InstagramIcon },
                  { id: 'facebook', label: 'Facebook', icon: FacebookIcon }
                ].map((type) => {
                  const Icon = type.icon;
                  return (
                    <button
                      key={type.id}
                      type="button"
                      onClick={() => setFormData({ ...formData, media_type: type.id })}
                      className={`flex items-center justify-center gap-2 p-3 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        formData.media_type === type.id
                          ? 'bg-[#006c93] border-[#006c93] text-white shadow-md'
                          : 'bg-[var(--cream)] border-[rgba(22,55,76,0.12)] text-[#5a7d92] hover:text-white hover:bg-white'
                      }`}
                    >
                      <Icon className="w-4 h-4" /> {type.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Upload or URL depending on type */}
            {(formData.media_type === 'image' || formData.media_type === 'video') && (
              <div className="p-4 bg-[var(--cream)]/80 rounded-2xl border border-[rgba(22,55,76,0.12)] space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-bold text-[#5a7d92]">File Upload &amp; Media Selection</span>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsPickerOpen(true)}
                      className="px-3.5 py-2 bg-[var(--cream)] hover:bg-[var(--mint)] text-[var(--teal)] rounded-xl text-xs font-bold cursor-pointer transition-colors border border-[rgba(22,55,76,0.15)] flex items-center gap-1.5"
                    >
                      <ImageIcon className="w-3.5 h-3.5 text-[var(--coral)]" />
                      <span>Pick from Media Assets</span>
                    </button>

                    <label className="px-4 py-2 bg-white hover:bg-[var(--mint)] text-[var(--ink)] rounded-xl text-xs font-bold cursor-pointer transition-colors border border-slate-600 flex items-center gap-2">
                      <Upload className="w-3.5 h-3.5" />
                      <span>{uploading ? 'Uploading...' : 'Choose File from Computer'}</span>
                      <input
                        type="file"
                        accept={formData.media_type === 'video' ? 'video/*' : 'image/*'}
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5a7d92] mb-1">
                    Or Direct Media URL
                  </label>
                  <input
                    type="text"
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    placeholder="https://example.com/media.jpg or /uploads/..."
                    className="w-full bg-slate-950 border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>
              </div>
            )}

            {/* Social Embeds: YouTube, Instagram, Facebook */}
            {['youtube', 'instagram', 'facebook'].includes(formData.media_type) && (
              <div className="p-4 bg-[var(--cream)]/80 rounded-2xl border border-[rgba(22,55,76,0.12)] space-y-4">
                <div>
                  <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                    {formData.media_type.toUpperCase()} Video / Post URL or Iframe Code
                  </label>
                  <input
                    type="text"
                    value={formData.media_url}
                    onChange={(e) => setFormData({ ...formData, media_url: e.target.value })}
                    placeholder={
                      formData.media_type === 'youtube'
                        ? 'https://www.youtube.com/watch?v=...'
                        : formData.media_type === 'instagram'
                        ? 'https://www.instagram.com/p/...'
                        : 'https://www.facebook.com/...'
                    }
                    className="w-full bg-slate-950 border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold text-[#5a7d92] mb-1">
                    Raw Iframe Embed Code (Optional override)
                  </label>
                  <textarea
                    rows={2}
                    value={formData.embed_code}
                    onChange={(e) => setFormData({ ...formData, embed_code: e.target.value })}
                    placeholder="<iframe src=... allowfullscreen></iframe>"
                    className="w-full bg-slate-950 border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] font-mono focus:outline-none focus:ring-2 focus:ring-[#006c93]"
                  />
                </div>
              </div>
            )}

            {/* Thumbnail URL */}
            <div>
              <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                Poster / Thumbnail Image URL (Recommended for Videos and Embeds)
              </label>
              <input
                type="text"
                value={formData.thumbnail_url}
                onChange={(e) => setFormData({ ...formData, thumbnail_url: e.target.value })}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2.5 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>

            {/* Caption */}
            <div>
              <label className="block text-xs font-bold text-[#5a7d92] uppercase tracking-wider mb-2">
                Caption & Description
              </label>
              <textarea
                rows={2}
                value={formData.caption}
                onChange={(e) => setFormData({ ...formData, caption: e.target.value })}
                placeholder="Brief description displayed under the media when clicked in the modal lightbox..."
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl px-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>

            {/* Form actions */}
            <div className="pt-4 border-t border-[rgba(22,55,76,0.12)] flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-5 py-2.5 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:bg-[var(--mint)] text-[#5a7d92] text-xs font-bold transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={saving}
                className="px-6 py-2.5 rounded-xl bg-[#fa7830] hover:bg-[#e06622] text-[var(--ink)] text-xs font-bold transition-all shadow-md flex items-center gap-2 cursor-pointer disabled:opacity-60"
              >
                <Save className="w-4 h-4" /> {saving ? 'Publishing...' : 'Save Gallery Item'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        /* Gallery Table Listing */
        <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-xl">
          <div className="p-4 sm:p-6 border-b border-[rgba(22,55,76,0.12)] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#5a7d92] absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search gallery..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full bg-[var(--cream)] border border-[rgba(22,55,76,0.12)] rounded-xl pl-10 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center text-[#5a7d92] text-xs animate-pulse">
              Loading gallery media from database...
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="py-20 text-center text-[#5a7d92]">
              <ImageIcon className="w-12 h-12 text-slate-600 mx-auto mb-2" />
              <p className="text-sm font-bold text-[#5a7d92]">No media items found</p>
              <p className="text-xs text-[#8ba2b1] mt-1">Click "Add Gallery Media" to upload photos or embed videos.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[var(--cream)] text-[#5a7d92] uppercase tracking-wider text-xs font-bold border-b border-[rgba(22,55,76,0.12)]">
                  <tr>
                    <th className="px-6 py-4">Media</th>
                    <th className="px-6 py-4">Title &amp; Caption</th>
                    <th className="px-6 py-4">Type &amp; Category</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[rgba(22,55,76,0.08)]">
                  {filteredItems.map((item) => (
                    <tr key={item.id} className="hover:bg-[var(--cream)]/60 transition-colors">
                      <td className="px-6 py-3.5">
                        <div
                          onClick={() => setPreviewItem(item)}
                          className="w-16 h-14 rounded-xl bg-[var(--cream)] overflow-hidden border border-[rgba(22,55,76,0.12)] cursor-pointer relative group shrink-0"
                        >
                          <img
                            src={item.thumbnail_url || item.media_url}
                            alt=""
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform"
                          />
                          <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                            <Eye className="w-4 h-4 text-white" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 max-w-xs">
                        <div className="font-bold text-[var(--ink)] text-sm truncate">{item.title}</div>
                        <p className="text-xs text-[#5a7d92] truncate mt-0.5">{item.caption || 'No caption'}</p>
                      </td>
                      <td className="px-6 py-3.5">
                        <div className="flex items-center gap-2">
                          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-[var(--mint)] text-[var(--teal)] border border-[var(--teal)]/20 uppercase">
                            {item.media_type}
                          </span>
                          <span className="text-[var(--ink)] text-sm font-medium">{item.category}</span>
                        </div>
                      </td>
                      <td className="px-6 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setPreviewItem(item)}
                            title="Preview in Modal"
                            className="p-2 rounded-xl bg-[var(--cream)] hover:bg-[var(--mint)] text-[var(--teal)] transition-colors cursor-pointer"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleEdit(item)}
                            title="Edit"
                            className="p-2 rounded-xl bg-[#006c93]/10 hover:bg-[#006c93]/20 text-[#006c93] transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => setDeleteConfirmId(item.id)}
                            title="Delete"
                            className="p-2 rounded-xl bg-rose-50 hover:bg-rose-100 text-[var(--coral)] transition-colors cursor-pointer"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.12)] p-6 max-w-sm w-full text-center shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto mb-3">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-base font-bold text-[var(--ink)] font-display">Delete Gallery Media?</h3>
            <p className="text-xs text-[#5a7d92] mt-1 mb-6">
              This media item will be removed permanently from the public gallery and lightboxes.
            </p>
            <div className="flex items-center justify-center gap-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-[var(--cream)] text-[#5a7d92] border border-[rgba(22,55,76,0.12)] text-[#5a7d92] text-xs font-bold cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-[var(--ink)] text-xs font-bold cursor-pointer"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Preview */}
      <GalleryModal item={previewItem} onClose={() => setPreviewItem(null)} />

      {/* Media Picker Modal */}
      <MediaPickerModal
        isOpen={isPickerOpen}
        onClose={() => setIsPickerOpen(false)}
        onSelect={(urls) => {
          if (urls && urls[0]) {
            setFormData({ ...formData, media_url: urls[0] });
          }
        }}
        allowMultiple={false}
        title="Pick Media for Gallery Item"
      />
    </div>
  );
};
