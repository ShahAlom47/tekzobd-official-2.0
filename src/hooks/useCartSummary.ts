import { CartItem } from "@/Interfaces/cartInterface";
import { ProductType } from "@/Interfaces/productInterfaces";

interface CartProductSummary {
  productId: string;
  productName: string;
  quantity: number;
  productColor: string | null;
  priceAtPurchase: number;
  discountedPrice: number;
}

export const useCartSummary = (
  cartItems: CartItem[],
  products: ProductType[],
  couponDiscountPercent: number = 0
) => {
  // Helper: check if product offer is currently active
  const isOfferActive = (offer?: { isActive: boolean; startDate?: string; endDate?: string }) => {
    if (!offer?.isActive || !offer.startDate || !offer.endDate) return false;

    const now = new Date();
    const start = new Date(offer.startDate);
    const end = new Date(offer.endDate);

    return now >= start && now <= end;
  };

  // Helper: calculate discounted (effective) price
  const getEffectivePrice = (product: ProductType): number => {
    const offerActive = isOfferActive(product.offer);
    const price = product.price;
    const discountPercent = product.discount;

    if (offerActive && discountPercent > 0) {
      return Math.round(price - (price * discountPercent) / 100);
    }

    return price;
  };

  // Summary variables
  let subtotal = 0;
  let totalDiscount = 0;
  let totalAfterDiscount = 0;
  let totalQuantity = 0;

  // Main calculation loop
  for (const item of cartItems) {
    const product = products.find((p) => p._id === item.productId && p.stock > 0);
    if (!product) continue;

    const price = product.price;
    const effectivePrice = getEffectivePrice(product);

    subtotal += price * item.quantity;
    totalDiscount += (price - effectivePrice) * item.quantity;
    totalAfterDiscount += effectivePrice * item.quantity;
    totalQuantity += item.quantity;
  }

  // Apply coupon discount if any
  const couponDiscountAmount = (totalAfterDiscount * couponDiscountPercent) / 100;
  const grandTotal = totalAfterDiscount - couponDiscountAmount;

  // Prepare cart item summary for order/checkout
  const cartProducts = cartItems
    .map((item) => {
      const product = products.find((p) => p._id === item.productId && p.stock > 0);
      if (!product) return null;

      const effectivePrice = getEffectivePrice(product);

      return {
        productId: product._id.toString(),
        productName: product.title,
        productColor: item && typeof item.color !== "undefined" ? item.color : null,
        quantity: Number(item.quantity),
        priceAtPurchase: product.price,
        discountedPrice: effectivePrice,
      } as CartProductSummary;
    })
    .filter((item): item is CartProductSummary => item !== null); // Type-safe filter

  return {
    subtotal,
    totalDiscount,
    totalAfterDiscount,
    couponDiscountAmount,
    grandTotal,
    totalQuantity,
    cartProducts,
  };
};
