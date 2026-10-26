import React, { useCallback, useEffect, useState } from 'react';
import {
  Upload,
  Search,
  Trash2,
  Copy,
  Check,
  Film,
  Image as ImageIcon,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  Eye,
  X,
} from 'lucide-react';
import { api, getAuthToken } from '../../utils/api';
import { MediaAssetItem } from '../../components/MediaPickerModal';

export const AdminMediaAssetsPage: React.FC = () => {
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [uploading, setUploading] = useState(false);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [previewAsset, setPreviewAsset] = useState<MediaAssetItem | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notification, setNotification] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  const showToast = useCallback(
    (message: string, type: 'success' | 'error' = 'success') => {
      setNotification({ message, type });
      setTimeout(() => setNotification(null), 3500);
    },
    []
  );

  const loadAssets = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.get<{ assets: MediaAssetItem[] }>('/media');
      if (res.assets) {
        setAssets(res.assets);
      }
    } catch (err: any) {
      console.error('Failed to load media assets:', err);
      showToast('Failed to load media assets from database.', 'error');
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    let active = true;

    api
      .get<{ assets: MediaAssetItem[] }>('/media')
      .then((res) => {
        if (active && res.assets) setAssets(res.assets);
      })
      .catch((err) => {
        if (!active) return;
        console.error('Failed to load media assets:', err);
        showToast('Failed to load media assets from database.', 'error');
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [showToast]);

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);

    const token = getAuthToken();
    let uploadCount = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/media/upload', {
          method: 'POST',
          headers: token ? { Authorization: `Bearer ${token}` } : {},
          body: formData,
        });

        if (!response.ok) {
          const errData = await response.json();
          throw new Error(errData.error || 'Upload failed');
        }

        uploadCount++;
      } catch (err: any) {
        console.error('File upload error:', err);
        showToast(err.message || 'Error uploading media file', 'error');
      }
    }

    setUploading(false);
    if (uploadCount > 0) {
      showToast(`${uploadCount} file${uploadCount > 1 ? 's' : ''} uploaded and converted to WebP successfully.`);
      await loadAssets();
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(window.location.origin + url);
    setCopiedUrl(url);
    showToast('Asset URL copied to clipboard.');
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  const handleDelete = async (id: number) => {
    try {
      setDeleting(true);
      await api.delete(`/media/${id}`);
      showToast('Media asset deleted permanently from database.');
      setDeleteConfirmId(null);
      if (previewAsset?.id === id) setPreviewAsset(null);
      await loadAssets();
    } catch (err: any) {
      console.error('Delete media error:', err);
      showToast('Failed to delete media asset.', 'error');
    } finally {
      setDeleting(false);
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes) return '—';
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  };

  const filtered = assets.filter((item) => {
    const term = search.toLowerCase();
    const matchSearch =
      (item.original_name || '').toLowerCase().includes(term) ||
      (item.filename || '').toLowerCase().includes(term);
    const matchType = filterType === 'all' || item.media_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      {/* Toast Notification */}
      {notification && (
        <div
          className={`fixed top-4 right-4 z-50 px-4 py-3 rounded-2xl shadow-xl flex items-center gap-2 text-xs font-bold animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'error'
              ? 'bg-rose-600 text-white'
              : 'bg-[var(--teal)] text-white'
          }`}
        >
          <CheckCircle2 className="w-4 h-4" />
          {notification.message}
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[rgba(22,55,76,0.1)]">
        <div>
          <h2 className="text-xl font-bold text-[var(--ink)] font-display flex items-center gap-2">
            <ImageIcon className="w-5 h-5 text-[var(--coral)]" />
            Media Assets Library
          </h2>
          <p className="text-xs text-[#5a7d92] mt-0.5">
            Centralized repository for all hospital photos, procedures, and video assets. Uploaded images are automatically converted to high-performance WebP.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAssets}
            disabled={loading}
            className="btn btn-soft text-xs py-2 px-3.5 flex items-center gap-1.5"
            title="Reload Media from Database"
          >
            <RefreshCw size={14} className={loading ? 'animate-spin' : ''} />
            Refresh
          </button>

          <label className="btn btn-primary text-xs py-2 px-4 cursor-pointer flex items-center gap-1.5 shadow-md">
            <Upload size={14} />
            <span>Upload New Asset</span>
            <input
              name="media-files"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        </div>
      </div>

      {/* Drag & Drop Quick Dropzone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={(e) => {
          e.preventDefault();
          handleFileUpload(e.dataTransfer.files);
        }}
        className="p-6 rounded-3xl border-2 border-dashed border-[rgba(22,55,76,0.18)] hover:border-[var(--teal)] transition-all bg-[var(--cream)]/40 flex flex-col sm:flex-row items-center justify-between gap-4"
      >
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-12 h-12 rounded-2xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shrink-0 shadow-xs">
            <Upload size={22} />
          </div>
          <div>
            <h4 className="text-sm font-bold text-[var(--ink)]">
              Drop images or videos here to upload
            </h4>
            <p className="text-xs text-[#5a7d92] mt-0.5">
              Images are automatically optimized and converted to lightweight WebP format for fast web delivery.
            </p>
          </div>
        </div>

        {uploading ? (
          <div className="text-xs font-bold text-[var(--teal)] animate-pulse flex items-center gap-2">
            <RefreshCw size={14} className="animate-spin" />
            Optimizing and storing...
          </div>
        ) : (
          <label className="btn btn-soft text-xs py-2 px-4 cursor-pointer whitespace-nowrap">
            <span>Select Files</span>
            <input
              name="bulk-media-files"
              type="file"
              multiple
              accept="image/*,video/*"
              onChange={(e) => handleFileUpload(e.target.files)}
              className="hidden"
            />
          </label>
        )}
      </div>

      {/* Filter / Search Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-[#8ba2b1] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            name="search"
            type="text"
            placeholder="Search media by filename or title..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-white border border-[rgba(22,55,76,0.12)] rounded-full pl-10 pr-4 py-2 text-xs text-[var(--ink)] placeholder-[#8ba2b1] focus:outline-none focus:ring-2 focus:ring-[#006c93]"
          />
        </div>

        <div className="flex items-center gap-1.5">
          {(['all', 'image', 'video'] as const).map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold capitalize transition-all cursor-pointer ${
                filterType === type
                  ? 'bg-[var(--deep)] text-white shadow-xs'
                  : 'bg-[var(--cream)] text-[#5a7d92] hover:text-[var(--ink)] border border-[rgba(22,55,76,0.08)]'
              }`}
            >
              {type === 'all' ? `All Assets (${assets.length})` : `${type}s`}
            </button>
          ))}
        </div>
      </div>

      {/* Media Assets Grid */}
      {loading ? (
        <div className="py-20 text-center text-[#5a7d92] text-xs animate-pulse">
          Loading media repository from MySQL database...
        </div>
      ) : filtered.length === 0 ? (
        <div className="py-20 text-center text-[#5a7d92] bg-white rounded-3xl border border-[rgba(22,55,76,0.1)]">
          <ImageIcon className="w-12 h-12 text-[#9bb0bc] mx-auto mb-2" />
          <p className="text-sm font-bold text-[var(--ink)]">No media assets found</p>
          <p className="text-xs text-[#5a7d92] mt-0.5">Upload a new image or video to get started.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((item) => {
            const isVideo = item.media_type === 'video';

            return (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-[rgba(22,55,76,0.12)] overflow-hidden shadow-xs hover:shadow-lg hover:border-[var(--teal)] transition-all flex flex-col"
              >
                {/* Visual Thumbnail */}
                <div
                  onClick={() => setPreviewAsset(item)}
                  className="relative aspect-video bg-[var(--mint)] overflow-hidden cursor-pointer flex items-center justify-center"
                >
                  {isVideo ? (
                    <div className="w-full h-full bg-[#073d59] flex items-center justify-center text-white">
                      <Film className="w-10 h-10 opacity-70 group-hover:scale-110 transition-transform" />
                    </div>
                  ) : (
                    <img
                      src={item.url}
                      alt={item.original_name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                    />
                  )}

                  {/* Format Badge */}
                  <div className="absolute top-2 left-2 bg-black/60 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider">
                    {isVideo ? 'VIDEO' : item.mime_type?.split('/')[1] || 'WEBP'}
                  </div>

                  {/* Hover Preview Indicator */}
                  <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                    <Eye size={22} className="drop-shadow-md" />
                  </div>
                </div>

                {/* Metadata & Actions */}
                <div className="p-3.5 flex flex-col justify-between flex-1 gap-3">
                  <div>
                    <h4
                      className="text-xs font-bold text-[var(--ink)] truncate"
                      title={item.original_name || item.filename}
                    >
                      {item.original_name || item.filename}
                    </h4>
                    <div className="flex items-center gap-2 text-[10px] text-[#5a7d92] mt-1 font-medium">
                      <span>{formatSize(item.file_size)}</span>
                      {item.width && item.height && (
                        <>
                          <span>•</span>
                          <span>
                            {item.width} × {item.height}
                          </span>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Card Action Buttons */}
                  <div className="flex items-center justify-between pt-2 border-t border-[rgba(22,55,76,0.08)]">
                    <button
                      onClick={() => handleCopyUrl(item.url)}
                      className="text-[11px] font-bold text-[var(--teal)] hover:text-[var(--deep)] flex items-center gap-1 cursor-pointer"
                      title="Copy Public Asset URL"
                    >
                      {copiedUrl === item.url ? (
                        <>
                          <Check size={12} className="text-emerald-600" />
                          <span className="text-emerald-600">Copied</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>Copy URL</span>
                        </>
                      )}
                    </button>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => setPreviewAsset(item)}
                        className="w-7 h-7 rounded-lg hover:bg-[var(--cream)] text-[#5a7d92] hover:text-[var(--ink)] flex items-center justify-center transition-colors cursor-pointer"
                        title="Preview Asset"
                      >
                        <Eye size={13} />
                      </button>

                      <button
                        onClick={() => setDeleteConfirmId(item.id)}
                        className="w-7 h-7 rounded-lg hover:bg-rose-50 text-rose-500 hover:text-rose-700 flex items-center justify-center transition-colors cursor-pointer"
                        title="Delete from Media Library"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="fixed inset-0 z-50 bg-[rgba(7,61,89,0.6)] backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] p-6 max-w-sm w-full shadow-2xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <AlertTriangle className="w-6 h-6 shrink-0" />
              <h3 className="text-base font-bold text-[var(--ink)] font-display">
                Delete Media Asset?
              </h3>
            </div>
            <p className="text-xs text-[#5a7d92] leading-relaxed">
              Are you sure you want to permanently delete this media asset? Any pages or articles referencing this file may experience broken links.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmId(null)}
                className="btn btn-soft text-xs py-2 px-4 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteConfirmId)}
                disabled={deleting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer disabled:opacity-60"
              >
                {deleting ? 'Deleting...' : 'Confirm Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* High-Resolution Preview Modal */}
      {previewAsset && (
        <div className="fixed inset-0 z-50 bg-[rgba(7,61,89,0.8)] backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] shadow-2xl max-w-3xl w-full overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[rgba(22,55,76,0.1)] flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-[var(--ink)] truncate max-w-md">
                  {previewAsset.original_name || previewAsset.filename}
                </h3>
                <span className="text-[11px] text-[#5a7d92]">
                  {formatSize(previewAsset.file_size)} • {previewAsset.mime_type}
                </span>
              </div>
              <button
                onClick={() => setPreviewAsset(null)}
                className="w-8 h-8 rounded-full bg-[var(--cream)] hover:bg-[var(--mint)] text-[#5a7d92] hover:text-[var(--ink)] flex items-center justify-center"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-4 bg-slate-900 flex items-center justify-center min-h-[300px] max-h-[60vh] overflow-hidden">
              {previewAsset.media_type === 'video' ? (
                <video src={previewAsset.url} controls autoPlay className="max-h-[55vh] max-w-full rounded-lg" />
              ) : (
                <img
                  src={previewAsset.url}
                  alt={previewAsset.original_name}
                  className="max-h-[55vh] max-w-full object-contain rounded-lg"
                />
              )}
            </div>

            <div className="px-6 py-3 border-t border-[rgba(22,55,76,0.1)] bg-[var(--cream)]/30 flex items-center justify-between">
              <span className="text-xs text-[#5a7d92] truncate max-w-sm">
                URL: <code className="bg-white px-2 py-0.5 rounded border border-[rgba(22,55,76,0.1)] text-[10px]">{previewAsset.url}</code>
              </span>
              <button
                onClick={() => handleCopyUrl(previewAsset.url)}
                className="btn btn-primary text-xs py-1.5 px-3 flex items-center gap-1.5"
              >
                <Copy size={13} />
                Copy URL
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminMediaAssetsPage;
