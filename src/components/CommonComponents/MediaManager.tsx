// components/MediaManager.tsx
"use client";

import React, { useState } from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { FaCheckCircle } from "react-icons/fa";
import { CiWarning } from "react-icons/ci";
import { uploadToCloudinary } from "@/utils/cloudinaryUpload";
import toast from "react-hot-toast";
import { useConfirm } from "@/hooks/useConfirm";
import { ObjectId } from "mongodb";
import PrimaryButton from "./PrimaryButton";
import SafeImage from "./SafeImage";

export interface MediaItem {
  type: "image" | "video";
  url: string;
  thumbnail?: string;
  publicId?: string;
}

interface Props {
  onChange: (media: MediaItem[]) => void;
  defaultMedia?: MediaItem[];
  folderName?: string; // Optional folder name for organization
  dataId?: string | ObjectId | undefined | number;
  mediaCategory?: "portfolioMedia" | "blogMedia" | "productMedia"; //like portfolioMedia ,blogMedia, userMedia etc
}

const MediaManager: React.FC<Props> = ({
  onChange,
  defaultMedia = [],
  folderName,
  dataId,
  mediaCategory,
}) => {
  // Ensure every media item has all required fields with default values on initialization
  const [mediaList, setMediaList] = useState<MediaItem[]>(
    defaultMedia.map((item) => ({
      type: item.type ?? "image",
      url: item.url ?? "",
      thumbnail: item.thumbnail ?? "",
      publicId: item.publicId ?? "",
    }))
  );

  const [loadingIndexes, setLoadingIndexes] = useState<number[]>([]);
  const [uploadStatus, setUploadStatus] = useState<
    Record<number, "success" | "error" | null>
  >({});
  const { confirm, ConfirmModal } = useConfirm();

  // Add new media item with all required properties initialized
  const handleAddMedia = () => {
    setMediaList([
      ...mediaList,
      {
        type: "image",
        url: "",
        thumbnail: "",
        publicId: "",
      },
    ]);
  };

  // Replace entire media item on type change to avoid partial undefined states
  const handleTypeChange = (index: number, type: "image" | "video") => {
    const newList = [...mediaList];
    newList[index] = {
      type,
      url: "",
      thumbnail: "",
      publicId: "",
    };
    setMediaList(newList);
    onChange(newList);
  };

  // Upload image to Cloudinary and update status

  // Then inside your MediaManager component:
  const handleImageUpload = async (index: number, file: File) => {
    setLoadingIndexes((prev) => [...prev, index]);
    setUploadStatus((prev) => ({ ...prev, [index]: null }));

    const localUrl = URL.createObjectURL(file);
    const newList = [...mediaList];
    newList[index].url = localUrl;
    setMediaList(newList);

    const result = await uploadToCloudinary(file, folderName);

    if (result.success) {
      newList[index].url = result.data.secure_url;
      newList[index].publicId = result.data.public_id;
      setUploadStatus((prev) => ({ ...prev, [index]: "success" }));
    } else {
      console.error("Image upload failed:", result.error);
      setUploadStatus((prev) => ({ ...prev, [index]: "error" }));
    }

    setMediaList(newList);
    onChange(newList);

    setLoadingIndexes((prev) => prev.filter((i) => i !== index));
  };

  // Handle video URL input and thumbnail extraction
  const handleVideoUrl = (index: number, url: string) => {
    const videoId = extractYouTubeId(url);
    const newList = [...mediaList];
    newList[index].url = url;
    if (videoId) {
      newList[
        index
      ].thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
    } else {
      newList[index].thumbnail = "";
    }
    setMediaList(newList);
    onChange(newList);
  };

  // Extract YouTube video ID from URL
  const extractYouTubeId = (url: string) => {
    const regExp = /^.*(?:youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return match && match[1].length === 11 ? match[1] : "";
  };

  // Remove media item and delete image from Cloudinary if needed

  const handleRemove = async (index: number) => {
    const ok = await confirm({
      title: "Delete ",
      message: "Are you sure you want to delete this item?",
      confirmText: "Yes",
      cancelText: "No",
    });
    if (!ok) return;

    const media = mediaList[index];

    if (media.type === "image" && media.publicId) {
      try {
        const res = await fetch("/api/manageMedia/deleteCloudImage", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            publicId: media.publicId,
            dataId,
            mediaCategory,
          }),
        });

        const data = await res.json();

        if (res.ok && data.success) {
          toast.success(data.message || "Image deleted successfully");
        } else {
          toast.error(data.message || "Failed to delete image");
          return; // error হলে ফাংশন থামাবে, আর mediaList থেকে remove করবে না
        }
      } catch (error) {
        toast.error("Something went wrong while deleting the image");
        console.error(error);
        return; // error হলে থামাবে
      }
    }

    // Delete সফল হলে বা media টাইপ অন্য কিছু হলে list থেকে remove করো
    const newList = mediaList.filter((_, i) => i !== index);
    setMediaList(newList);
    onChange(newList);
  };

  return (
    <div className="space-y-4">
      {mediaList.map((media, index) => (
        <div
          key={index}
          className="border p-4 rounded-md flex flex-col gap-2 relative my-inpu"
        >
          <div className="flex gap-4 items-center">
            <select
              value={media.type}
              onChange={(e) =>
                handleTypeChange(index, e.target.value as "image" | "video")
              }
              className="selec select-bordered bg-transparent w-fit my-input "
            >
              <option value="image">Image</option>
              <option value="video">Video</option>
            </select>

            <button
              onClick={() => handleRemove(index)}
              className="ml-auto text-red-500 hover:text-red-700"
              type="button"
              aria-label="Remove media"
            >
              <AiOutlineDelete size={20} />
            </button>
          </div>

          {media.type === "image" ? (
            <input
              type="file"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files?.[0])
                  handleImageUpload(index, e.target.files[0]);
              }}
              className="my-input w-full"
            />
          ) : (
            <input
              type="text"
              placeholder="Enter YouTube URL"
              value={media.url ?? ""}
              onChange={(e) => handleVideoUrl(index, e.target.value)}
              className="my-input w-full"
            />
          )}

          {/* Show image preview with loading and status */}
          {media.type === "image" && media.url && (
            <div className="relative w-fit">
              <SafeImage
              unoptimized
                src={media.url}
                alt="Preview"
                width={100}
                height={60}
                className="rounded-lg  md:w-32 h-12 w-20 md:h-20"
              />
              {loadingIndexes.includes(index) && (
                <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-sm">
                  Uploading...
                </div>
              )}
              {uploadStatus[index] === "success" &&
                !loadingIndexes.includes(index) && (
                  <FaCheckCircle
                    className="absolute top-2 right-2 text-green-500 bg-white rounded-full"
                    size={20}
                  />
                )}
              {uploadStatus[index] === "error" &&
                !loadingIndexes.includes(index) && (
                  <span className="absolute inset-0 bg-gray-300/80 font-bold text-red-500 flex gap-2 justify-center items-center">
                    <CiWarning /> Failed...
                  </span>
                )}
            </div>
          )}

          {media.type === "video" && media.url && (
            <div className="aspect-vide">
              <iframe
                className="  rounded-md"
                src={`https://www.youtube.com/embed/${extractYouTubeId(
                  media.url
                )}`}
                title="YouTube Video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      ))}

    
      <PrimaryButton type="button" onClick={handleAddMedia}> + Add Media </PrimaryButton>

      {ConfirmModal}
    </div>
  );
};

export default MediaManager;
