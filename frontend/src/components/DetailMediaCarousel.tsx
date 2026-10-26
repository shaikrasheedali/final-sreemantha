import React, { useState, useEffect, useRef } from 'react';
import { ChevronLeft, ChevronRight, Film, Image as ImageIcon } from 'lucide-react';
import { parseMediaList } from '../utils/media';

function isVideoUrl(url: string): boolean {
  if (!url) return false;
  const clean = url.split('?')[0].toLowerCase();
  return clean.endsWith('.mp4') || clean.endsWith('.webm') || clean.endsWith('.mov') || clean.includes('/video-');
}

interface DetailMediaCarouselProps {
  media: string | string[] | null | undefined;
  title: string;
  className?: string;
}

export const DetailMediaCarousel: React.FC<DetailMediaCarouselProps> = ({
  media,
  title,
  className = '',
}) => {
  const items = parseMediaList(media);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<any>(null);

  // Auto-sliding with generous 5-second interval
  useEffect(() => {
    if (items.length <= 1 || isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % items.length);
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [items.length, isPaused]);

  if (items.length === 0) {
    return null;
  }

  const nextSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % items.length);
  };

  const prevSlide = () => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length);
  };

  const currentMedia = items[currentIndex];
  const isVideo = isVideoUrl(currentMedia);

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto aspect-[4/3] rounded-3xl overflow-hidden shadow-xl border border-[rgba(22,55,76,0.12)] bg-[var(--mint)] mb-14 select-none group ${className}`}
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      role="region"
      aria-label={`${title} Media Showcase`}
    >
      {/* Current Media Render */}
      <div className="w-full h-full relative">
        {isVideo ? (
          <video
            key={currentMedia}
            src={currentMedia}
            controls
            autoPlay
            muted
            playsInline
            loop
            className="w-full h-full object-cover"
          />
        ) : (
          <img
            key={currentMedia}
            src={currentMedia}
            alt={`${title} - view ${currentIndex + 1}`}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.02]"
          />
        )}
      </div>

      {/* Multiple items controls */}
      {items.length > 1 && (
        <>
          {/* Subtle vignette gradient for overlay legibility */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-black/20" />

          {/* Previous Button */}
          <button
            onClick={prevSlide}
            aria-label="Previous image"
            className="absolute left-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[var(--ink)] backdrop-blur-md shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer z-20"
          >
            <ChevronLeft size={22} />
          </button>

          {/* Next Button */}
          <button
            onClick={nextSlide}
            aria-label="Next image"
            className="absolute right-4 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-white/80 hover:bg-white text-[var(--ink)] backdrop-blur-md shadow-lg flex items-center justify-center transition-all opacity-80 hover:opacity-100 hover:scale-110 cursor-pointer z-20"
          >
            <ChevronRight size={22} />
          </button>

          {/* Slide Counter Badge */}
          <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-md text-white px-3 py-1 rounded-full text-xs font-bold tracking-wider z-20 flex items-center gap-1.5 shadow-md">
            {isVideo ? <Film size={12} /> : <ImageIcon size={12} />}
            <span>
              {currentIndex + 1} / {items.length}
            </span>
          </div>

          {/* Dot Navigation Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex items-center gap-2 z-20 bg-black/40 backdrop-blur-md px-3.5 py-1.5 rounded-full">
            {items.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                aria-label={`Go to slide ${idx + 1}`}
                className={`transition-all rounded-full cursor-pointer ${
                  currentIndex === idx
                    ? 'w-6 h-2 bg-white'
                    : 'w-2 h-2 bg-white/50 hover:bg-white/80'
                }`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
};
