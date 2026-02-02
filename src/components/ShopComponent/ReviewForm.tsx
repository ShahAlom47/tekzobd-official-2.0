"use client";

import React, { useState } from "react";
import { useSession } from "next-auth/react";
import { addReview } from "@/lib/allApiRequest/reviewRequest/reviewRequest";
import toast from "react-hot-toast";
import { queryClient } from "@/Providers/QueryProvider";

interface ReviewFormProps {
  productId: string;
}

const stars = [1, 2, 3, 4, 5];

const ReviewForm: React.FC<ReviewFormProps> = ({ productId }) => {
  const { data: session, status } = useSession();
  const userEmail = session?.user?.email ?? null;
  const userName = session?.user?.name ?? null;

  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const isAuthenticated = status === "authenticated" && userEmail;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!isAuthenticated) {
      setError("You must be logged in to submit a review.");
      return;
    }
    if (rating === 0) {
      setError("Please provide a rating.");
      return;
    }
    if (comment.trim().length < 10) {
      setError("Comment must be at least 10 characters.");
      return;
    }

    setLoading(true);

    const data = {
      productId,
      userEmail: userEmail!,
      userName: userName,
      rating,
      comment,
    };

    try {
      const res = await addReview(data);
      if (res.success) {
        setRating(0);
        setComment("");
        toast.success("Review submitted successfully!");
        queryClient.invalidateQueries({
           queryKey: ["reviews", productId],
        });
      } else {
        setError(res.message || "Failed to submit review.");
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="  py-4  bg-white">
      <h3 className="text-lg font-semibold mb-3">Leave a Review</h3>
      <div className=" ">
        {!isAuthenticated && (
          <p className="text-center text-red-600 mb-3">
            You must be logged in to submit a review.
          </p>
        )}

        <div className="flex items-center mb-3 ">
          {stars.map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => isAuthenticated && setRating(star)}
              onMouseEnter={() => isAuthenticated && setHoverRating(star)}
              onMouseLeave={() => isAuthenticated && setHoverRating(0)}
              className={`text-3xl cursor-pointer ${
                (hoverRating || rating) >= star
                  ? "text-yellow-400"
                  : "text-gray-300"
              } transition-colors`}
              aria-label={`${star} Star`}
              disabled={!isAuthenticated || loading}
            >
              ★
            </button>
          ))}
        </div>

        <div className="p-4 flex md:flex-row flex-col items-end gap-2 bg-slate-200 rounded-md ">
          <textarea
            value={comment}
            onChange={(e) => isAuthenticated && setComment(e.target.value)}
            rows={4}
            placeholder={
              isAuthenticated
                ? "Write your review here..."
                : "Login to write a review"
            }
            className="w-full  flex-1 bg-transparent outline-none "
            disabled={!isAuthenticated || loading}
          ></textarea>

          {error && <p className="text-red-600 mt-2">{error}</p>}

          <button
            type="submit"
            disabled={!isAuthenticated || loading}
            className=" btn-bordered h-fit rounded-full"
          >
            {loading ? "Submitting..." : "Submit Review"}
          </button>
        </div>
      </div>
    </form>
  );
};

export default ReviewForm;
