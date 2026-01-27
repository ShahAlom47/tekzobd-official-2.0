import { useMemo } from "react";

interface Offer {
  isActive: boolean;
  startDate?: string;
  endDate?: string;
}

interface UseProductPriceManageParams {
  price: number | string;
  discount: number | string;
  offer?: Offer;
  stock: number | string;
}

export function useProductPriceManage({
  price,
  discount,
  offer,
  stock,
}: UseProductPriceManageParams) {
  const originalPrice = Number(price);
  const discountPercent = Number(discount);
  const stockNumber = Number(stock);

  const isOfferActive = useMemo(() => {
    if (!offer?.isActive || !offer?.startDate || !offer?.endDate) return false;

    const now = Date.now();
    const start = new Date(offer.startDate).getTime();
    const end = new Date(offer.endDate).getTime();

    return now >= start && now <= end;
  }, [offer]);

  const hasDiscount = isOfferActive && discountPercent > 0;

  const discountedPrice = useMemo(() => {
    if (hasDiscount) {
      return Math.round(originalPrice - (originalPrice * discountPercent) / 100);
    }
    return originalPrice;
  }, [originalPrice, discountPercent, hasDiscount]);

  const isOutOfStock = useMemo(() => stockNumber <= 0, [stockNumber]);

  return {
    originalPrice,
    discountPercent,
    isOfferActive,
    hasDiscount,
    discountedPrice,
    isOutOfStock,
  };
}
