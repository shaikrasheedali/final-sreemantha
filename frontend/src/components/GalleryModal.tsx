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

  // Helper to extract YouTube ID
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
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn"
      onClick={onClose}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-label={item.title}
        className="relative bg-[#073d59] border border-white/20 rounded-3xl max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-[#073d59]/90 text-white">
          <div className="flex items-center gap-3">
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold uppercase tracking-wider bg-[#05a5ea]/20 text-[#05a5ea] border border-[#05a5ea]/30">
              {item.category}
            </span>
            <h3 className="text-base font-bold truncate max-w-md font-heading text-white">
              {item.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition"
            aria-label="Close modal"
            title="Close (Esc)"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Media Content Display */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 flex items-center justify-center bg-black/40">
          {item.embed_code ? (
            <div
              className="w-full flex justify-center aspect-video max-h-[60vh]"
              dangerouslySetInnerHTML={{ __html: item.embed_code }}
            />
          ) : isYouTube ? (
            <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <iframe
                src={getYouTubeEmbedUrl(item.media_url)}
                title={item.title}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : isInstagram ? (
            <div className="w-full max-w-md h-[480px] rounded-2xl overflow-hidden bg-white">
              <iframe
                src={`${item.media_url.replace(/\/$/, '')}/embed`}
                className="w-full h-full border-0"
                title={item.title}
              />
            </div>
          ) : isFacebook ? (
            <div className="w-full max-w-lg aspect-video rounded-2xl overflow-hidden bg-white">
              <iframe
                src={`https://www.facebook.com/plugins/video.php?height=476&href=${encodeURIComponent(item.media_url)}&show_text=false&width=476&t=0`}
                className="w-full h-full border-0"
                title={item.title}
                allowFullScreen
              />
            </div>
          ) : isVideo ? (
            <video
              src={item.media_url}
              controls
              autoPlay
              className="max-h-[65vh] w-auto max-w-full rounded-2xl shadow-xl"
            />
          ) : (
            <img
              src={item.media_url}
              alt={item.title}
              className="max-h-[65vh] w-auto max-w-full object-contain rounded-2xl shadow-xl"
            />
          )}
        </div>

        {/* Caption & Metadata Footer */}
        {item.caption && (
          <div className="px-6 py-4 bg-[#073d59] border-t border-white/10 text-slate-300 text-xs sm:text-sm leading-relaxed flex items-center justify-between">
            <p className="flex-1 pr-4">{item.caption}</p>
            {item.media_url.startsWith('http') && (
              <a
                href={item.media_url}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-[#05a5ea] hover:underline flex items-center gap-1 shrink-0 font-medium"
              >
                <span>Original Link</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
