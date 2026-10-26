import React from 'react';
import { ArrowUpRight, MapPin, Navigation } from 'lucide-react';

export const HOSPITAL_MAP_LINK =
  'https://www.google.com/maps/place/sreemantha+hospital+khammam/data=!4m2!3m1!1s0x3a345911b67355c5:0x5209b6d9472bf0b2?sa=X&ved=1t:242&ictx=111';

export const HOSPITAL_MAP_EMBED_SRC =
  'https://www.google.com/maps?q=Sreemantha%20Fertility%20Women%20And%20Chil%20Care%20Hospital,%20Khammam,%20Telangana&ll=17.249826,80.14765&z=17&output=embed';

interface LocationMapProps {
  compact?: boolean;
  className?: string;
}

export const LocationMap: React.FC<LocationMapProps> = ({ compact = false, className = '' }) => {
  return (
    <div
      className={`location-map${compact ? ' location-map--compact' : ''}${
        className ? ` ${className}` : ''
      }`}
    >
      <iframe
        title="Sreemantha Hospital location on Google Maps"
        src={HOSPITAL_MAP_EMBED_SRC}
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />
      <div className="map-footer">
        <span>
          <MapPin size={14} aria-hidden="true" />
          Nehru Nagar, Khammam
        </span>
        <a
          href={HOSPITAL_MAP_LINK}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Open Sreemantha Hospital location in Google Maps"
        >
          <Navigation size={14} aria-hidden="true" />
          <span>Open in Google Maps</span>
          <ArrowUpRight size={14} aria-hidden="true" />
        </a>
      </div>
    </div>
  );
};
