"use client";

import React, { useState } from "react";
import SafeImage from "./SafeImage";
import { CgPlayButton } from "react-icons/cg";
import { MediaItem } from "@/Interfaces/productInterfaces";
import ZoomImage from "../ui/ZoomImage";
import SafeVideo from "./SafeVideo";

interface MediaGalleryProps {
  media: MediaItem[];
}

const MediaGallery: React.FC<MediaGalleryProps> = ({ media }) => {
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(
    media.length > 0 ? media[0] : null
  );
  if (!activeMedia) {
    return null;
  }

  return (
    <div className="space-y-6">
      {/* Main Preview */}
      <div
        className={`w-full ${
          activeMedia.type === "image" ? "h-auto" : "aspect-[16/9]"
        } rounded overflow-hidden shadow-lg bg-white`}
      >
        {activeMedia.type === "image" ? (
          <ZoomImage
            src={activeMedia.url}
            alt="active-media"
            width={600}
            height={300}
            className="w-full h-auto max-h-[450px] object-contain"
          />
        ) : (
          <SafeVideo
            url={activeMedia.url}
            className="w-full h-full object-cover"
          />
        )}
      </div>

      {/* Thumbnail Gallery */}
      <div className="flex gap-3 overflow-x-auto scroll-hide">
        {media
          .filter((item) => !!item.url && item.url.trim() !== "")
          .map((item, index) => {
            const isActive = item.url === activeMedia.url;
            return (
              <div
                key={index}
                onClick={() => setActiveMedia(item)}
                className={`relative cursor-pointer rounded overflow-hidden border-2 min-w-[80px] aspect-video group
                transition-transform duration-200 ${
                  isActive
                    ? "border-brandPrimary scale-105"
                    : "border-transparent hover:border-gray-300"
                }`}
              >
                {item.type === "image" ? (
                  <SafeImage
                    src={item.url}
                    alt={`media-thumb-${index}`}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                ) : (
                  <div className="relative w-full h-full bg-black">
                    <SafeVideo
                      url={item.url || "/video-placeholder.jpg"}
                      className="object-cover opacity-70 group-hover:opacity-100"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <CgPlayButton className="text-white text-3xl" />
                    </div>
                  </div>
                )}
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default MediaGallery;
