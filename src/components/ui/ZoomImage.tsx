"use client";
import React, { useState } from "react";
import SafeImage from "../SafeImage";
import { StaticImageData } from "next/image";

type LocalOrRemoteSrc = string | StaticImageData | null | undefined;

type Props = {
  src?: LocalOrRemoteSrc;
  alt: string;
  width?: number;
  height?: number;
  fallback?: LocalOrRemoteSrc;
  className?: string;
};

const ZoomImage: React.FC<Props> = ({
  src,
  alt,
  width,
  height,
  fallback,
  className,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const isValidSrc = (val: unknown): val is string | StaticImageData => {
    if (typeof val === "string") return val.trim().length > 0;
    if (typeof val === "object" && val !== null && "src" in val) return true;
    return false;
  };

  const finalSrc = isValidSrc(src) ? src : fallback;
  if (!finalSrc) return null;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setPosition({ x, y });
  };

  return (
    <div
      className={`relative overflow-hidden group w-full h-full ${className}`}
      onMouseEnter={() => setIsZoomed(true)}
      onMouseLeave={() => setIsZoomed(false)}
      onMouseMove={handleMouseMove}
    >
      <SafeImage
        alt={alt}
        src={finalSrc}
        width={width}
        height={height}
        className={`transition-transform duration-300 ease-in-out object-contain w-full h-auto ${
          isZoomed ? "scale-150" : "scale-100"
        }`}
        style={{
          transformOrigin: `${position.x}% ${position.y}%`,
        }}
      />
    </div>
  );
};

export default ZoomImage;
