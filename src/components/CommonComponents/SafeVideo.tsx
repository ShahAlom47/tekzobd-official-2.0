import React from "react";

type SafeVideoProps = {
  url: string; // required video url
  width?: number | string; // width default 100%
  height?: number | string; // height default 400
  className?: string; // optional external classes
  muted?: boolean; // muted default false
  playsInline?: boolean; // playsInline default true
  title?: string; // accessibility title
  poster?: string; // optional poster for video tag
  aspectRatio?: string; // padding bottom % for iframe container, default 56.25% (16:9)
  loading?: "lazy" | "eager"; // iframe loading attribute, default lazy
} & React.VideoHTMLAttributes<HTMLVideoElement>;

const SafeVideo: React.FC<SafeVideoProps> = ({
  url,
  width = "100%",
  height = 400,
  className = "",
  playsInline = true,
  muted = false,
  title = "Video player",
  poster,
  aspectRatio = "56.25%", // 16:9 ratio default
  loading = "lazy",
  ...rest
}) => {
  // Extract 'src' from rest to avoid conflicts with iframe or video src prop
  const { ...restWithoutSrc } = rest;

  // Helper function to extract YouTube video ID from URL
  const getYouTubeId = (url: string) => {
    try {
      const urlObj = new URL(url);
      if (urlObj.hostname === "youtu.be") {
        return urlObj.pathname.slice(1);
      } else if (urlObj.hostname.includes("youtube.com")) {
        return urlObj.searchParams.get("v") || "";
      }
      return "";
    } catch {
      return "";
    }
  };

  // Check if url is a YouTube link
  const isYouTube = /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be)\//.test(url);
  const videoId = isYouTube ? getYouTubeId(url) : "";

  if (isYouTube && videoId) {
    const embedUrl = `https://www.youtube.com/embed/${videoId}`;

    // Only pass div-appropriate props
    const divProps: React.HTMLAttributes<HTMLDivElement> = {
      className: `relative ${className}`,
      style: { paddingBottom: aspectRatio, height: 0 },
    };

    return (
      <div {...divProps}>
        <iframe
          src={embedUrl}
          title={title}
          allowFullScreen
          frameBorder="0"
          loading={loading}
          className="absolute top-0 left-0 w-full h-full rounded"
          width={width}
          height={height}
        />
      </div>
    );
  }

  // If not YouTube or failed to extract videoId, fallback link
  if (isYouTube && !videoId) {
    return (
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className={`text-blue-600 underline ${className}`}
      >
        Watch Video
      </a>
    );
  }

  // Normal HTML5 video player
  return (
    <video
      controls
      src={url}
      width={typeof width === "number" ? width : undefined}
      height={typeof height === "number" ? height : undefined}
      className={className}
      playsInline={playsInline}
      muted={muted}
      poster={poster}
      preload="metadata"
      title={title}
      {...restWithoutSrc}
    />
  );
};

export default SafeVideo;
