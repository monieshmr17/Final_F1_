import React, { useState, useEffect } from 'react';
import { MediaAttribution } from '../data/f1MediaAndProfiles';

interface VerifiedMediaImageProps {
  media: MediaAttribution;
  alt: string;
  accentColor?: string;
  badgeText?: string;
  fallbackType?: 'driver' | 'car' | 'circuit' | 'tech';
  className?: string;
  containerClassName?: string;
  imgClassName?: string;
  objectPosition?: string;
  showAttributionBar?: boolean;
  gradientOverlayClassName?: string;
}

export function resolveWikimediaCdnUrl(rawUrl: string): string {
  if (!rawUrl || rawUrl.includes('/thumb/') || rawUrl.endsWith('.svg')) {
    return rawUrl;
  }
  const match = rawUrl.match(
    /^https:\/\/upload\.wikimedia\.org\/wikipedia\/commons\/([a-f0-9]\/[a-f0-9]{2})\/([^/]+)$/
  );
  if (!match) {
    return rawUrl;
  }
  const dir = match[1];
  const filename = match[2];
  const w330 = ['Sergio_P%C3%A9rez_2019_%28cropped%29.jpg'];
  const w500 = [
    'Pierre_Gasly_2017_Malaysia.jpg',
    '2025_Japan_GP_-_Aston_Martin_-_Fernando_Alonso_-_Fanzone_Stage_%28cropped%29.jpg',
    'Kimi_Antonelli_at_the_2025_US_Grand_Prix_in_Austin%2C_TX_%28cropped%29.jpg',
    'Abbi_Pulling_Singapore_2024_%28cropped%29.jpg',
    'Lia_Block_Singapore_2025.jpg',
    'Pin_Silverstone_2026_portrait.jpg',
  ];
  const width = w330.includes(filename) ? 330 : w500.includes(filename) ? 500 : 960;
  return `https://thumb.wikimedia.org/wikipedia/commons/thumb/${dir}/${filename}/${width}px-${filename}`;
}

export const VerifiedMediaImage: React.FC<VerifiedMediaImageProps> = ({
  media,
  alt,
  accentColor = '#E10600',
  badgeText = 'F1',
  fallbackType = 'driver',
  className = 'w-full h-56',
  containerClassName,
  imgClassName = 'object-cover',
  objectPosition = '50% 14%',
  showAttributionBar = true,
  gradientOverlayClassName,
}) => {
  const resolvedUrl = resolveWikimediaCdnUrl(media.imageUrl);
  const [imgError, setImgError] = useState<boolean>(!resolvedUrl);

  useEffect(() => {
    setImgError(!resolvedUrl);
  }, [resolvedUrl]);

  return (
    <div className={`relative overflow-hidden bg-[#080B11] select-none ${containerClassName ?? className}`}>
      {!imgError && resolvedUrl ? (
        <img
          src={resolvedUrl}
          alt={alt}
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={() => setImgError(true)}
          style={{ objectPosition }}
          className={`w-full h-full transition-transform duration-700 ease-out group-hover:scale-105 ${imgClassName}`}
        />
      ) : (
        <div
          className="w-full h-full flex flex-col justify-between p-4 relative"
          style={{
            background: `radial-gradient(circle at 80% 20%, ${accentColor}40 0%, #090C12 75%)`,
          }}
        >
          <svg
            viewBox="0 0 400 220"
            className="absolute inset-0 w-full h-full opacity-35 pointer-events-none"
            aria-hidden="true"
          >
            {fallbackType === 'driver' ? (
              <>
                <circle cx="300" cy="95" r="52" fill="none" stroke={accentColor} strokeWidth="2.5" />
                <path
                  d="M 255 90 Q 300 72 345 92 L 338 112 Q 300 100 262 112 Z"
                  fill={accentColor}
                  opacity="0.6"
                />
                <path
                  d="M 225 210 C 235 155 365 155 375 210"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="3"
                />
              </>
            ) : fallbackType === 'car' ? (
              <>
                <path
                  d="M 45 145 L 125 140 L 185 112 L 265 110 L 335 128 L 365 145 Z"
                  fill="none"
                  stroke={accentColor}
                  strokeWidth="3"
                />
                <circle cx="110" cy="148" r="24" fill="#111" stroke={accentColor} strokeWidth="4" />
                <circle cx="315" cy="148" r="24" fill="#111" stroke={accentColor} strokeWidth="4" />
              </>
            ) : (
              <path
                d="M 40 165 Q 120 45 220 115 T 360 85"
                fill="none"
                stroke={accentColor}
                strokeWidth="3.5"
                strokeDasharray="6 4"
              />
            )}
          </svg>
          <div className="relative z-10 flex justify-end items-start">
            <span
              className="px-2.5 py-0.5 rounded text-xs font-bold text-black uppercase"
              style={{ backgroundColor: accentColor }}
            >
              {badgeText}
            </span>
          </div>
        </div>
      )}

      {/* Subtle Ambient Team Glow */}
      <div
        className="absolute inset-0 pointer-events-none opacity-35 mix-blend-screen"
        style={{
          background: `radial-gradient(circle at 85% 15%, ${accentColor}44, transparent 60%)`,
        }}
      />

      {/* Cinematic Gradient Overlay */}
      <div
        className={
          gradientOverlayClassName ??
          'absolute inset-0 bg-gradient-to-t from-[#07090E] via-[#07090E]/30 to-transparent pointer-events-none'
        }
      />

      {showAttributionBar && (
        <div className="absolute top-2.5 right-2.5 z-10 f1-glass-pill px-2 py-0.5 rounded-md text-[10px] text-gray-200 max-w-[75%] truncate pointer-events-none">
          <span>
            {media.author} • {media.license}
          </span>
        </div>
      )}
    </div>
  );
};
