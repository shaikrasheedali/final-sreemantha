import React, { useEffect, useState } from 'react';
import { Image as ImageIcon, Video, Play, Maximize2, Filter } from 'lucide-react';
import { YoutubeIcon, InstagramIcon, FacebookIcon } from '../components/SocialIcons';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { GalleryModal } from '../components/GalleryModal';
import { GalleryItem } from '../types';
import { api } from '../utils/api';

export const GalleryPage: React.FC = () => {
  const [items, setItems] = useState<GalleryItem[]>([]);
  const [category, setCategory] = useState('All');
  const [mediaFilter, setMediaFilter] = useState<'all' | 'image' | 'video' | 'embed'>('all');
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = ['All', 'Hospital', 'Facilities', 'Events', 'Medical Team', 'Awareness Programs', 'Celebrations'];

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
    if (mediaFilter === 'video') return item.media_type === 'video';
    if (mediaFilter === 'embed') {
      return ['youtube', 'instagram', 'facebook'].includes(item.media_type) || Boolean(item.embed_code);
    }
    return true;
  });

  return (
    <div className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Media Gallery' }]} />

        {/* Page Header */}
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="eyebrow mb-2">Hospital Moments & Infrastructure</span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#073d59] font-heading">
              Photo & Video Gallery
            </h1>
            <p className="text-sm text-[#637371] max-w-2xl mt-2 leading-relaxed">
              Explore photographs of our IVF laboratories, advanced neonatal care units, healthcare awareness workshops, and patient celebration moments at Sreemantha Hospital.
            </p>
          </div>

          {/* Media Type Filter Tabs */}
          <div className="flex items-center gap-1.5 bg-white p-1 rounded-full border border-slate-200 shadow-xs self-start md:self-auto">
            <button
              onClick={() => setMediaFilter('all')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                mediaFilter === 'all' ? 'bg-[#006c93] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setMediaFilter('image')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                mediaFilter === 'image' ? 'bg-[#006c93] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ImageIcon className="w-3.5 h-3.5" /> Photos
            </button>
            <button
              onClick={() => setMediaFilter('video')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                mediaFilter === 'video' ? 'bg-[#006c93] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Video className="w-3.5 h-3.5" /> Videos
            </button>
            <button
              onClick={() => setMediaFilter('embed')}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1 ${
                mediaFilter === 'embed' ? 'bg-[#006c93] text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <InstagramIcon className="w-3.5 h-3.5 text-pink-600" /> Social / Embeds
            </button>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-4 py-2 rounded-full text-xs font-semibold transition-all ${
                category === cat
                  ? 'bg-[#073d59] text-white shadow-md'
                  : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Gallery Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="h-64 bg-white rounded-2xl animate-pulse border border-slate-200" />
            ))}
          </div>
        ) : filteredItems.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 p-8 shadow-sm">
            <ImageIcon className="w-12 h-12 text-slate-300 mx-auto mb-3" />
            <h3 className="text-lg font-bold text-slate-800">No media found</h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No photographs or videos match this category filter. Try selecting 'All'.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredItems.map((item) => {
              const isVideo = item.media_type === 'video' || /\.(mp4|webm|mov)$/i.test(item.media_url);
              const isSocial = ['youtube', 'instagram', 'facebook'].includes(item.media_type) || Boolean(item.embed_code);

              return (
                <div
                  key={item.id}
                  data-testid="gallery-card"
                  onClick={() => setSelectedItem(item)}
                  className="group relative bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-xl transition-all duration-300 cursor-pointer flex flex-col"
                >
                  <div className="relative aspect-4/3 overflow-hidden bg-slate-900">
                    <img
                      src={
                        item.thumbnail_url ||
                        (item.media_type === 'image' ? item.media_url : 'https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=600&q=80')
                      }
                      alt={item.title || 'Sreemantha Hospital Gallery'}
                      className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500 opacity-90 group-hover:opacity-100"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />

                    {/* Media Type Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-md text-white text-[10px] font-semibold">
                      {item.media_type === 'video' ? (
                        <>
                          <Video className="w-3 h-3 text-emerald-400" /> Video
                        </>
                      ) : item.media_type === 'youtube' ? (
                        <>
                          <YoutubeIcon className="w-3 h-3 text-red-500" /> YouTube
                        </>
                      ) : item.media_type === 'instagram' ? (
                        <>
                          <InstagramIcon className="w-3 h-3 text-pink-400" /> Instagram
                        </>
                      ) : item.media_type === 'facebook' ? (
                        <>
                          <FacebookIcon className="w-3 h-3 text-blue-400" /> Facebook
                        </>
                      ) : (
                        <>
                          <ImageIcon className="w-3 h-3 text-amber-300" /> Photo
                        </>
                      )}
                    </div>

                    {/* Center Action Icon for video/embed */}
                    {(isVideo || isSocial) && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-[#fa7830]/90 text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                          <Play className="w-5 h-5 fill-white translate-x-0.5" />
                        </div>
                      </div>
                    )}

                    {/* Hover Expand Icon */}
                    <div className="absolute bottom-3 right-3 w-8 h-8 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" />
                    </div>
                  </div>

                  {/* Caption & Title */}
                  <div className="p-4 flex-1 flex flex-col justify-between">
                    <div>
                      <span className="text-[10px] font-bold text-[#006c93] tracking-wide uppercase">
                        {item.category || 'General'}
                      </span>
                      <h4 className="text-xs font-bold text-slate-900 group-hover:text-[#006c93] transition-colors mt-0.5 line-clamp-1">
                        {item.title || 'Hospital Gallery Item'}
                      </h4>
                      {item.caption && (
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-1 leading-snug">
                          {item.caption}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Gallery Interactive Modal */}
        <GalleryModal item={selectedItem} onClose={() => setSelectedItem(null)} />
      </div>
    </div>
  );
};
