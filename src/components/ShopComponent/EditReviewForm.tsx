"use client";

import React, { useState } from "react";
import { ReviewsType } from "@/Interfaces/reviewInterfaces";
import { toast } from "react-hot-toast";
import { editReview } from "@/lib/allApiRequest/reviewRequest/reviewRequest";
import { queryClient } from "@/Providers/QueryProvider";
import { FaStar } from "react-icons/fa";

interface EditReviewFormProps {
  review: ReviewsType | null;
  onClose: () => void;
  onSuccess?: () => void;
}

const EditReviewForm: React.FC<EditReviewFormProps> = ({
  review,
  onClose,
  onSuccess,
}) => {
  const [comment, setComment] = useState(review?.comment || "");
  const [rating, setRating] = useState(review?.rating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!review) return <p className="text-red-500">Review data not found.</p>;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      setError("Please give a rating.");
      return;
    }

    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await editReview({
        reviewId: review._id,
        comment,
        rating,
        productId: review.productId,
        userEmail: review.userEmail,
      });

      if (res.success) {
        toast.success("Review updated!");
        queryClient.invalidateQueries({
          queryKey: ["reviews", review.productId],
        });
        onClose();
        onSuccess?.();
      } else {
        setError(res.message || "Update failed");
      }
    } catch {
      setError("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      {error && <p className="text-sm text-red-500">{error}</p>}

      {/* Star Rating */}
      <div>
        <label className="block text-sm font-medium mb-1">Rating</label>
        <div className="flex gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <FaStar
              key={star}
              size={28}
              className={`cursor-pointer transition-colors duration-200 ${
                (hoverRating || rating) >= star ? "text-yellow-400" : "text-gray-300"
              }`}
              onClick={() => setRating(star)}
              onMouseEnter={() => setHoverRating(star)}
              onMouseLeave={() => setHoverRating(0)}
            />
          ))}
        </div>
      </div>

      {/* Comment */}
      <div>
        <label className="block text-sm font-medium mb-1">Comment</label>
        <textarea
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full my-input"
          rows={4}
          placeholder="Update your review..."
        />
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 border border-gray-300 text-sm rounded hover:bg-gray-100"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
        >
          {loading ? "Updating..." : "Update Review"}
        </button>
      </div>
    </form>
  );
};

export default EditReviewForm;
