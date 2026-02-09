import React, { useState, useEffect } from "react";

interface DiscountDisplayProps {
  price?: number; // main price (optional)
  discountPercent?: number; // discount %
  initialDiscountPrice?: number; // manual discount price (optional)
}

const DiscountDisplay: React.FC<DiscountDisplayProps> = ({
  price,
  discountPercent,
  initialDiscountPrice,
}) => {
  const [manualDiscountPrice, setManualDiscountPrice] = useState<number | 0>(
    initialDiscountPrice || 0
  );

  const calculatedDiscountPrice =
    price !== undefined && discountPercent !== undefined
      ? Number((price - (price * discountPercent) / 100).toFixed(2))
      : 0;

  const finalPrice =
    price !== undefined && discountPercent !== undefined
      ? calculatedDiscountPrice
      : manualDiscountPrice;

  const discountAmount =
    price !== undefined && discountPercent !== undefined
      ? price - calculatedDiscountPrice
      : undefined;

  return (
    <div className="border p-3 rounded-md bg-gray-50 max-w-md">
      {price && discountPercent? (
        <>
          <p>
            Main Price: <span className="font-medium">{price} TK</span>
          </p>
          <p>
            Discount ({discountPercent}%):{" "}
            <span className="font-medium">{discountAmount?.toFixed(2)} TK</span>
          </p>
          <p>
            Final Price:{" "}
            <span className="font-medium">
              {!isNaN(finalPrice) ? finalPrice.toFixed(2) : "—"}TK
            </span>
          </p>
        </>
      ) : (
        <>
          <p>
            Discount :{" "}
            <span className="font-medium">{discountPercent || 0}%</span> -- 
        
            <span className="font-medium">Save:{discountPercent && ((manualDiscountPrice / (1 - discountPercent / 100)) - manualDiscountPrice).toFixed(2)} TK</span>
          </p>
          <div className="flex items-center gap-2 mt-2">
            <label>Discount Price (manual):</label>
            <input
              type="number"
              value={manualDiscountPrice}
              onChange={(e) => setManualDiscountPrice(Number(e.target.value))}
              className="my-input w-32"
            />
          </div>
          <p className="mt-2">
            Main Price :{" "}
            <span className="font-medium">
              {discountPercent
                ? manualDiscountPrice
                  ? (manualDiscountPrice / (1 - discountPercent / 100)).toFixed(2)
                  : "—"
                : "—"}{" "}
              TK
            </span>
          </p>
        </>
      )}
    </div>
  );
};

export default DiscountDisplay;
