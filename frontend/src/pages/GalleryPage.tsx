import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Video, Play, Maximize2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { GalleryModal } from '../components/GalleryModal';
import { GalleryItem } from '../types';
import { api } from '../utils/api';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState('All');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'social'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Hospital', 'Facilities', 'Events', 'Medical Team', 'Celebrations'];

  useEffect(() => {
    async function fetchGallery() {
      try {
        setLoading(true);
        const queryParams = new URLSearchParams();
        if (category !== 'All') queryParams.append('category', category);
        const res = await api.get<{ items?: GalleryItem[]; gallery?: GalleryItem[] }>(`/gallery?${queryParams.toString()}`);
        const galleryList = res.items || res.gallery || [];
        setItems(galleryList);
      } catch (err) {
        console.error('Failed to load gallery items:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchGallery();
  }, [category]);

  const filteredItems = items.filter((item) => {
    if (mediaFilter === 'image') return item.media_type === 'image';
    if (mediaFilter === 'video') {
      return item.media_type === 'video' || item.media_type === 'youtube';
    }
    if (mediaFilter === 'social') {
      return ['youtube', 'instagram', 'facebook'].includes(item.media_type || '') || !!item.embed_code;
    }
    return true;
  });

  return (
    <div className="sr-section" style={{ paddingTop: 40 }}>
      <div className="sr-container">
        <Breadcrumbs items={[{ label: 'Visual Gallery' }]} />

        {/* Heading */}
        <div className="sr-heading-row mb-12">
          <div>
            <span className="sr-kicker">Life at Sreemantha</span>
            <h1 className="sr-display sr-heading mt-2">
              Hospital Media Gallery,<br />
              <em>milestones of hope.</em>
            </h1>
          </div>
          <p className="sr-copy max-w-md">
            Explore photographs of our cleanroom embryology laboratories, neonatal intensive care unit, maternity rooms, and community health events in Khammam.
          </p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-10 pb-6 border-b border-[rgba(22,55,76,0.12)]">
          <div className="flex flex-wrap items-center gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold transition cursor-pointer ${
                  category === cat
                    ? 'bg-[var(--deep)] text-white'
                    : 'bg-white text-[#5a7d92] border border-[rgba(22,55,76,0.12)] hover:border-[var(--teal)]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={() => setMediaFilter('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition ${
                mediaFilter === 'all'
                  ? 'bg-[var(--deep)] text-white'
                  : 'bg-white text-[#5a7d92] border border-[rgba(22,55,76,0.12)]'
              }`}
            >
              All Media
            </button>
            <button
              onClick={() => setMediaFilter('image')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1 ${
                mediaFilter === 'image'
                  ? 'bg-[var(--deep)] text-white'
                  : 'bg-white text-[#5a7d92] border border-[rgba(22,55,76,0.12)]'
              }`}
            >
              <ImageIcon size={13} />
              Photos
            </button>
            <button
              onClick={() => setMediaFilter('video')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1 ${
                mediaFilter === 'video'
                  ? 'bg-[var(--deep)] text-white'
                  : 'bg-white text-[#5a7d92] border border-[rgba(22,55,76,0.12)]'
              }`}
            >
              <Video size={13} />
              Videos
            </button>
            <button
              onClick={() => setMediaFilter('social')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium cursor-pointer transition flex items-center gap-1 ${
                mediaFilter === 'social'
                  ? 'bg-[var(--deep)] text-white'
                  : 'bg-white text-[#5a7d92] border border-[rgba(22,55,76,0.12)]'
              }`}
            >
              Social / Embeds
            </button>
          </div>
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="sr-grid sr-grid--three">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="sr-skeleton" style={{ height: 260 }}>
                <div className="sr-skeleton-image" style={{ height: 180 }} />
                <div className="sr-skeleton-line" />
              </div>
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="sr-empty">
            <div>
              <h3>No gallery items found</h3>
              <p>Try switching to another category or clearing media filters.</p>
            </div>
            <button
              onClick={() => {
                setCategory('All');
                setMediaFilter('all');
              }}
              className="sr-button sr-button--outline text-xs"
            >
              Show all media
            </button>
          </div>
        ) : (
          <div className="sr-grid sr-grid--three">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                data-testid="gallery-card"
                onClick={() => setSelectedItem(item)}
                className="sr-card cursor-pointer group"
              >
                <div className="sr-media" style={{ height: 240 }}>
                  <img
                    src={item.thumbnail_url || item.media_url}
                    alt={item.title}
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-black/25 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white pointer-events-none">
                    {item.media_type === 'video' || item.media_type === 'youtube' ? (
                      <div className="w-12 h-12 rounded-full bg-white/80 text-[var(--ink)] flex items-center justify-center pl-1 shadow-lg">
                        <Play size={22} fill="var(--teal)" />
                      </div>
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-white/80 text-[var(--ink)] flex items-center justify-center shadow-lg">
                        <Maximize2 size={18} />
                      </div>
                    )}
                  </div>
                  {item.category && (
                    <span
                      style={{
                        position: 'absolute',
                        left: 12,
                        top: 12,
                        padding: '4px 9px',
                        borderRadius: 4,
                        background: 'rgba(24, 63, 61, 0.85)',
                        color: '#f8f5ec',
                        fontSize: 9,
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {item.category}
                    </span>
                  )}
                </div>

                <div className="sr-card-body" style={{ padding: 18 }}>
                  <h3 style={{ fontSize: 15 }} className="line-clamp-1">{item.title}</h3>
                  {item.caption && (
                    <p className="sr-copy text-xs line-clamp-2 mt-1">
                      {item.caption}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Lightbox Modal */}
        <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    </div>
  );
};
