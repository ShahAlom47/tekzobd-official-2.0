"use client";
import React, { useState } from "react";
import { ProductType } from "@/Interfaces/productInterfaces";
import { CartItem } from "@/Interfaces/cartInterface";
import { useCartSummary } from "@/hooks/useCartSummary";
import { BiSolidDownArrow, BiSolidUpArrow } from "react-icons/bi";
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";
import { useUser } from "@/hooks/useUser";
import { useDispatch } from "react-redux";
import { useRouter } from "next/navigation";
import { setCheckoutData } from "@/redux/features/checkoutSlice/checkoutSlice";
import CouponChecker from "./CouponChecker";
import LoginMsgModal from "../ui/LoginMsgModal";

interface CartSummaryProps {
  cartItems: CartItem[];
  products: ProductType[];
  couponDiscountPercent?: number;
}

const CartSummary = ({ cartItems, products }: CartSummaryProps) => {
  const { user } = useUser();
  const [openLoginModal, setOpenLoginModal] = useState(false);
  const dispatch = useDispatch();
  const router = useRouter();


  // State to manage coupon and summary visibility
  const [showSummary, setShowSummary] = useState<boolean>(false);
  const [coupon, setCoupon] = useState<{
    code: string;
    discountPercent: number;
  } | null>(null);

  const {
    subtotal,
    totalDiscount,
    totalAfterDiscount,
    couponDiscountAmount,
    grandTotal,
    totalQuantity,
    cartProducts,
  } = useCartSummary(cartItems, products, coupon?.discountPercent || 0);

  const handleCheckOut = () => {
    if (!user || !user.email) {
      setOpenLoginModal(true);
      return;
    }

    const data: CheckoutDataType = {
      cartProducts: cartProducts,
      coupon: !coupon
        ? null
        : {
            code: coupon?.code,
            discountPercent: coupon?.discountPercent,
            discountAmount: couponDiscountAmount,
          },
      pricing: {
        subtotal,
        totalDiscount,
        totalAfterDiscount,
        couponDiscountAmount,
        grandTotal,
        totalQuantity,
      },
      shippingInfo: undefined,
      paymentInfo: undefined,
      meta: {
        checkoutAt: new Date().toISOString(),
        userEmail: user.email,
        userId: user.id,
        userName: user.name || "",
        orderStatus: "pending",
      },
    };

  
    dispatch(setCheckoutData(data));

    router.push("/checkout");
  };
 


  return (
    <div className=" relative p-4  border-t mt-4 bg-white rounded shadow-sm text-black w-full  border border-brandPrimary ">
      <button
        onClick={() => setShowSummary(!showSummary)}
        className="absolute top-2 left-1/2 btn-base rounded-none p-0 mt-0 h-4 px-4 rounded-b-lg mb-auto flex items-center text-white"
      >
        {showSummary ? <BiSolidDownArrow /> : <BiSolidUpArrow />}
      </button>
      <div
        className={` ${
          showSummary ? "h-fit translate-y-0 " : "h-0 translate-y-10"
        } transition-all duration-500 font-semibold overflow-y-hidden`}
      >
        <CouponChecker onCouponValidated={(data) => setCoupon(data)} />
        <p>Total Items: {totalQuantity}</p>
        <p>Subtotal: TK {subtotal.toLocaleString()}</p>
        <p>Discount: TK {totalDiscount.toLocaleString()}</p>
        <p>After Discount: TK {totalAfterDiscount.toLocaleString()}</p>

        {coupon && (
          <>
            <p>
              Coupon <span className="font-semibold">{coupon.code}</span>{" "}
              Applied
            </p>
            <p>
              Coupon Discount ({coupon.discountPercent}%): TK{" "}
              {couponDiscountAmount.toLocaleString()}
            </p>
          </>
        )}
      </div>
      {/* begin: cart summary */}
      <div
        className={` flex justify-between items-center  gap-2 border-brandPrimary ${
          showSummary ? " border-t-2 mt-3" : " border-t-0"
        } transition-all duration-200 overflow-hidden`}
      >
        <p className="font-semibold text-lg ">
          Grand Total: TK {grandTotal.toLocaleString()}
        </p>

        <button className=" btn-base  text-center" onClick={handleCheckOut}>
          Checkout
        </button>
      </div>

      {/* login modal */}
      <LoginMsgModal open={openLoginModal} setOpen={setOpenLoginModal} />
    </div>
  );
};

export default CartSummary;
