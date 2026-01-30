import React from "react";

interface RatingDisplayProps {
  avgRating: number; // যেমন: 4.5
  maxRating?: number; // সর্বোচ্চ রেটিং (ডিফল্ট 5)
  starSize?: number;  // স্টারের সাইজ (ডিফল্ট 20 পিক্সেল)
}

const RatingDisplay: React.FC<RatingDisplayProps> = ({
  avgRating=0,
  maxRating = 5,
  starSize = 15,
}) => {
  // পূর্ণ স্টার
  const fullStars = Math.floor(avgRating);

  // হাফ স্টার আছে কিনা
  const hasHalfStar = avgRating - fullStars >= 0.5;

  // খালি স্টার এর সংখ্যা
  const emptyStars = maxRating - fullStars - (hasHalfStar ? 1 : 0);

  const starStyle = {
    width: starSize,
    height: starSize,
    color: "#FFD700", // গোল্ডেন (star) কালার
    marginRight: 2,
  };

  return (
    <div style={{ display: "flex", alignItems: "center" }}>
      {/* পূর্ণ স্টার */}
      {[...Array(fullStars)]?.map((_, i) => (
        <svg
          key={"full-" + i}
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="none"
          style={starStyle}
        >
          <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.62 12 2 9.19 8.63 2 9.24 7.45 13.97 5.82 21z" />
        </svg>
      ))}

      {/* হাফ স্টার */}
      {hasHalfStar && (
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 24 24"
          stroke="none"
          style={starStyle}
        >
          <defs>
            <linearGradient id="halfGradient">
              <stop offset="50%" stopColor="#FFD700" />
              <stop offset="50%" stopColor="transparent" />
            </linearGradient>
          </defs>
          <path
            fill="url(#halfGradient)"
            d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.62 12 2 9.19 8.63 2 9.24 7.45 13.97 5.82 21z"
          />
        </svg>
      )}

      {/* খালি স্টার */}
      {[...Array(emptyStars)].map((_, i) => (
        <svg
          key={"empty-" + i}
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          stroke="#FFD700"
          strokeWidth="2"
          viewBox="0 0 24 24"
          style={starStyle}
        >
          <path d="M12 17.27L18.18 21 16.54 13.97 22 9.24 14.81 8.62 12 2 9.19 8.63 2 9.24 7.45 13.97 5.82 21z" />
        </svg>
      ))}
    </div>
  );
};

export default RatingDisplay;
