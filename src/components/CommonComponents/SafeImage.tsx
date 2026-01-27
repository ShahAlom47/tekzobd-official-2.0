import Image, { ImageProps, StaticImageData } from "next/image";
import React from "react";
import defaultImage from "@/assets/image/default-image.jpg";
import { StaticImport } from "next/dist/shared/lib/get-img-props";

type LocalOrRemoteSrc = string | StaticImageData | null | undefined;

type Props = {
  key?: React.Key;
  src?: LocalOrRemoteSrc | StaticImageData | StaticImport;
  alt: string;
  width?: number;
  height?: number;
  fallback?: LocalOrRemoteSrc;
  className?: string;
} & Omit<ImageProps, "src" | "alt" | "width" | "height" | "className">;

const SafeImage: React.FC<Props> = ({
  key,
  src,
  alt,
  width,
  height,
  fallback = defaultImage,
  className,
  ...rest
}) => {
  // Check if src is a non-empty string or StaticImageData object
  const isValidSrc = (val: unknown): val is string | StaticImageData => {
    if (typeof val === "string") {
      return val.trim().length > 0;
    }
    // StaticImageData check (next/image static import)
    if (typeof val === "object" && val !== null && "src" in val) {
      return true;
    }
    return false;
  };

  // Determine which src to use
  const finalSrc = isValidSrc(src) ? src : isValidSrc(fallback) ? fallback : defaultImage;

  return (
    <Image
      key={key}
      src={finalSrc}
      alt={alt}
      width={width}
      height={height}
      className={className}
      loading="lazy"
      {...rest}
    />
  );
};

export default SafeImage;
