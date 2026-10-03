import React, { useState, useEffect } from 'react';
import {
  X,
  Upload,
  Search,
  Check,
  Film,
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle,
  Plus,
} from 'lucide-react';
import { api, getAuthToken } from '../utils/api';

export interface MediaAssetItem {
  id: number;
  filename: string;
  original_name: string;
  url: string;
  file_size: number;
  mime_type: string;
  media_type: 'image' | 'video';
  width?: number | null;
  height?: number | null;
  created_at?: string;
}

interface MediaPickerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (selectedUrls: string[]) => void;
  allowMultiple?: boolean;
  initialSelected?: string[];
  title?: string;
}

export const MediaPickerModal: React.FC<MediaPickerModalProps> = ({
  isOpen,
  onClose,
  onSelect,
  allowMultiple = true,
  initialSelected = [],
  title = 'Select Media Assets',
}) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const [assets, setAssets] = useState<MediaAssetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'image' | 'video'>('all');
  const [selectedUrls, setSelectedUrls] = useState<string[]>(initialSelected);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  const loadAssets = async () => {
    try {
      setLoading(true);
      const res = await api.get<{ assets: MediaAssetItem[] }>('/media');
      if (res.assets) {
        setAssets(res.assets);
      }
    } catch (err) {
      console.error('Failed to load media assets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      loadAssets();
      setSelectedUrls(initialSelected);
      setUploadError(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const toggleSelect = (url: string) => {
    if (allowMultiple) {
      if (selectedUrls.includes(url)) {
        setSelectedUrls(selectedUrls.filter((u) => u !== url));
      } else {
        setSelectedUrls([...selectedUrls, url]);
      }
    } else {
      setSelectedUrls([url]);
    }
  };

  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setUploadError(null);

    const token = getAuthToken();
    const newUrls: string[] = [];

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

        const data = await response.json();
        const uploadedUrl = data.url || data.asset?.url;
        if (uploadedUrl) {
          newUrls.push(uploadedUrl);
        }
      } catch (err: any) {
        console.error('Upload error:', err);
        setUploadError(err.message || 'Error uploading file');
      }
    }

    setUploading(false);
    await loadAssets();

    if (newUrls.length > 0) {
      if (allowMultiple) {
        setSelectedUrls((prev) => [...prev, ...newUrls]);
      } else {
        setSelectedUrls([newUrls[newUrls.length - 1]]);
      }
      setActiveTab('gallery');
    }
  };

  const handleConfirm = () => {
    onSelect(selectedUrls);
    onClose();
  };

  const filteredAssets = assets.filter((item) => {
    const term = search.toLowerCase();
    const matchSearch =
      (item.original_name || '').toLowerCase().includes(term) ||
      (item.filename || '').toLowerCase().includes(term);
    const matchType = filterType === 'all' || item.media_type === filterType;
    return matchSearch && matchType;
  });

  return (
    <div className="fixed inset-0 z-50 bg-[rgba(7,61,89,0.7)] backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl border border-[rgba(22,55,76,0.15)] shadow-2xl max-w-4xl w-full flex flex-col max-h-[85vh] overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-[rgba(22,55,76,0.1)] flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-[var(--ink)] font-display flex items-center gap-2">
              <ImageIcon className="w-5 h-5 text-[var(--coral)]" />
              {title}
            </h3>
            <p className="text-xs text-[#5a7d92] mt-0.5">
              Choose from existing assets or upload high-performance WebP media
            </p>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-[var(--cream)] hover:bg-[var(--mint)] text-[#5a7d92] hover:text-[var(--ink)] flex items-center justify-center transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-6 pt-3 pb-2 border-b border-[rgba(22,55,76,0.08)] flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setActiveTab('gallery')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'gallery'
                  ? 'bg-[var(--deep)] text-white shadow-xs'
                  : 'bg-[var(--cream)] text-[#5a7d92] hover:text-[var(--ink)]'
              }`}
            >
              Browse Media Assets ({assets.length})
            </button>
            <button
              onClick={() => setActiveTab('upload')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                activeTab === 'upload'
                  ? 'bg-[var(--deep)] text-white shadow-xs'
                  : 'bg-[var(--cream)] text-[#5a7d92] hover:text-[var(--ink)]'
              }`}
            >
              <Upload size={13} />
              Upload New (WebP Auto-Convert)
            </button>
          </div>

          {activeTab === 'gallery' && (
            <div className="flex items-center gap-2">
              {/* Type Filter */}
              <select
                value={filterType}
                onChange={(e: any) => setFilterType(e.target.value)}
                className="bg-white border border-[rgba(22,55,76,0.15)] rounded-xl px-2.5 py-1.5 text-xs text-[var(--ink)]"
              >
                <option value="all">All Types</option>
                <option value="image">Images</option>
                <option value="video">Videos</option>
              </select>

              {/* Search */}
              <div className="relative">
                <Search size={14} className="text-[#8ba2b1] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Search assets..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-white border border-[rgba(22,55,76,0.15)] rounded-xl pl-8 pr-3 py-1.5 text-xs text-[var(--ink)] w-36 sm:w-48"
                />
              </div>
            </div>
          )}
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto flex-1">
          {activeTab === 'upload' ? (
            <div className="max-w-md mx-auto text-center py-8">
              <div
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  handleFileUpload(e.dataTransfer.files);
                }}
                className="border-2 border-dashed border-[rgba(22,55,76,0.2)] rounded-3xl p-8 hover:border-[var(--teal)] transition-all bg-[var(--cream)]/40 flex flex-col items-center justify-center gap-3"
              >
                <div className="w-14 h-14 rounded-2xl bg-[var(--mint)] text-[var(--teal)] flex items-center justify-center shadow-xs">
                  <Upload size={26} />
                </div>
                <div>
                  <h4 className="font-bold text-[var(--ink)] text-sm">
                    Drag and drop image or video here
                  </h4>
                  <p className="text-xs text-[#5a7d92] mt-1">
                    Images automatically converted to highly-performant WebP.
                    Supports JPEG, PNG, WEBP, SVG, MP4, WEBM.
                  </p>
                </div>

                <label className="mt-2 btn btn-primary text-xs py-2 px-5 cursor-pointer">
                  <span>Browse Device Files</span>
                  <input
                    type="file"
                    multiple
                    accept="image/*,video/*"
                    onChange={(e) => handleFileUpload(e.target.files)}
                    className="hidden"
                  />
                </label>

                {uploading && (
                  <div className="text-xs text-[var(--teal)] font-bold animate-pulse mt-2">
                    Processing with Sharp &amp; uploading to database...
                  </div>
                )}

                {uploadError && (
                  <div className="text-xs text-rose-600 font-medium flex items-center gap-1 mt-2">
                    <AlertCircle size={14} /> {uploadError}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div>
              {loading ? (
                <div className="text-center py-16 text-xs text-[#5a7d92] animate-pulse">
                  Loading media library...
                </div>
              ) : filteredAssets.length === 0 ? (
                <div className="text-center py-16 text-[#5a7d92]">
                  <ImageIcon className="w-10 h-10 mx-auto text-[#9bb0bc] mb-2" />
                  <p className="text-xs font-bold text-[var(--ink)]">No media assets found</p>
                  <p className="text-[11px] text-[#5a7d92] mt-0.5">
                    Upload an asset or try a different search query.
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                  {filteredAssets.map((asset) => {
                    const isSelected = selectedUrls.includes(asset.url);
                    const isVideo = asset.media_type === 'video';

                    return (
                      <div
                        key={asset.id}
                        onClick={() => toggleSelect(asset.url)}
                        className={`group relative rounded-2xl border overflow-hidden cursor-pointer transition-all aspect-square flex flex-col justify-end p-2.5 ${
                          isSelected
                            ? 'border-[var(--coral)] ring-3 ring-[var(--coral)]/30 shadow-md'
                            : 'border-[rgba(22,55,76,0.12)] hover:border-[var(--teal)] hover:shadow-sm'
                        }`}
                      >
                        {/* Background Media Preview */}
                        {isVideo ? (
                          <div className="absolute inset-0 bg-[#073d59] flex items-center justify-center">
                            <Film className="w-8 h-8 text-white/50" />
                          </div>
                        ) : (
                          <img
                            src={asset.url}
                            alt={asset.original_name}
                            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        )}

                        {/* Dark Gradient Overlay for labels */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent pointer-events-none" />

                        {/* Selection Checkmark */}
                        <div
                          className={`absolute top-2 right-2 w-6 h-6 rounded-full flex items-center justify-center transition-all shadow-sm ${
                            isSelected
                              ? 'bg-[var(--coral)] text-white scale-100'
                              : 'bg-black/40 text-transparent hover:text-white/60 scale-90'
                          }`}
                        >
                          <Check size={14} className={isSelected ? 'text-white' : 'hidden'} />
                        </div>

                        {/* Type & Format Badge */}
                        <div className="relative z-10 flex items-center justify-between text-white text-[10px] font-bold">
                          <span className="truncate max-w-[80%] drop-shadow-xs">
                            {asset.original_name || asset.filename}
                          </span>
                          <span className="uppercase text-[9px] bg-white/20 backdrop-blur-xs px-1.5 py-0.5 rounded">
                            {isVideo ? 'VIDEO' : asset.mime_type?.split('/')[1] || 'WEBP'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-[rgba(22,55,76,0.1)] flex items-center justify-between bg-[var(--cream)]/30">
          <div className="text-xs text-[#5a7d92]">
            <strong>{selectedUrls.length}</strong> asset{selectedUrls.length !== 1 ? 's' : ''} selected
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="btn btn-soft text-xs py-2 px-4 cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleConfirm}
              className="btn btn-primary text-xs py-2 px-5 cursor-pointer flex items-center gap-1.5"
            >
              <Check size={14} />
              Confirm Selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
