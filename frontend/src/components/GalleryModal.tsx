import React, { useEffect } from 'react';
import { X, ExternalLink } from 'lucide-react';
import { GalleryItem } from '../types';

interface GalleryModalProps {
  item: GalleryItem | null;
  onClose: () => void;
}

export const GalleryModal: React.FC<GalleryModalProps> = ({ item, onClose }) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (item) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    }
    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [item, onClose]);

  if (!item) return null;

  const isVideo = item.media_type === 'video' || /\.(mp4|webm|mov)$/i.test(item.media_url);
  const isYouTube = item.media_type === 'youtube' || /youtube\.com|youtu\.be/i.test(item.media_url);
  const isInstagram = item.media_type === 'instagram' || /instagram\.com/i.test(item.media_url);
  const isFacebook = item.media_type === 'facebook' || /facebook\.com/i.test(item.media_url);

  const getYouTubeEmbedUrl = (url: string) => {
    let videoId = '';
    if (url.includes('youtu.be/')) {
      videoId = url.split('youtu.be/')[1]?.split('?')[0];
    } else {
      const match = url.match(/[?&]v=([^&]+)/);
      if (match) videoId = match[1];
    }
    return videoId ? `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0` : url;
  };

  return (
    <div
      className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 bg-black/85 backdrop-blur-md overflow-y-auto"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        className="relative bg-[var(--deep)] border border-white/20 rounded-2xl max-w-4xl w-full my-auto max-h-[92vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/15 bg-[var(--deep)] text-white shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            {item.category && (
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-[var(--mint)] text-[var(--teal)] shrink-0">
                {item.category}
              </span>
            )}
            <h3 className="font-display font-bold text-base text-white truncate">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            title="Close (Esc)"
            className="p-1.5 rounded-full text-white/70 hover:text-white hover:bg-white/10 transition cursor-pointer shrink-0 ml-3"
            aria-label="Close Preview"
          >
            <X size={20} />
          </button>
        </div>

        {/* Media Container */}
        <div className="flex-1 bg-black/70 flex items-center justify-center p-4 min-h-0 max-h-[70vh] overflow-hidden">
          {isYouTube ? (
            <div className="w-full aspect-video max-h-[66vh] rounded-xl overflow-hidden shadow-2xl">
              <iframe
                src={getYouTubeEmbedUrl(item.media_url)}
                title={item.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : isVideo ? (
            <video
              src={item.media_url}
              controls
              autoPlay
              className="max-h-[66vh] max-w-full rounded-xl shadow-2xl"
            >
              Your browser does not support HTML5 video.
            </video>
          ) : (
            <img
              src={item.media_url}
              alt={item.title}
              className="max-h-[66vh] w-auto max-w-full object-contain rounded-xl shadow-2xl mx-auto"
            />
          )}
        </div>

        {/* Caption bar */}
        {item.caption && (
          <div className="px-6 py-3 border-t border-white/15 bg-[#052b3e] text-xs text-white/90 shrink-0">
            <p className="m-0 leading-relaxed font-medium">{item.caption}</p>
          </div>
        )}
      </div>
    </div>
  );
};
