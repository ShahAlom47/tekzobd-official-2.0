"use client";

import { useSelector } from "react-redux";
import { Suspense, useState } from "react";
import toast from "react-hot-toast";
import { RootState } from "@/redux/store/store";
import PageHeading from "@/components/PageHeading";
import CustomModal from "@/components/ui/CustomModal";
import OrderSuccessContent from "@/components/OrderSuccessContent";
import { clearCheckoutData } from "@/redux/features/checkoutSlice/checkoutSlice";
import { useAppDispatch } from "@/redux/hooks/reduxHook";
import { useRouter } from "next/navigation";
import { CheckoutDataType, ShippingInfoFormType } from "@/Interfaces/checkoutDataInterface";
import { useCart } from "@/hooks/useCart";
import { addOrder } from "@/lib/allApiRequest/orderRequest/orderRequest";
import { useUser } from "@/hooks/useUser";
import { useNotifications } from "@/hooks/useNotifications";

import bkashQR from "@/assets/image/bkashQR.jpg";
import bkashQRinfo from "@/assets/image/bkashQRinfo.jpg";
import SafeImage from "@/components/SafeImage";
import { useGAnalytics } from "@/hooks/useGAnalytics";
import ShippingInfoForm from "@/components/ShippingInfoForm";
// import { Metadata } from "next";
// import { checkoutMetadata } from "@/utils/seo/staticMetadata";

// export const metadata: Metadata = checkoutMetadata;

const COD_EXTRA_CHARGE = 10; // Cash on Delivery extra charge

export const dynamic = "force-dynamic";

const CheckoutPage = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user } = useUser();
  const { event } = useGAnalytics();
  const checkoutData = useSelector(
    (state: RootState) => state.checkout.checkoutData
  );
  const { clearCart } = useCart();
  const [successModalOpen, setSuccessModalOpen] = useState(false);
  const [finalOrder, setFinalOrder] = useState<CheckoutDataType | null>(null);

  const { sendNewNotification } = useNotifications();
  const [shippingInfoErrors, setShippingInfoErrors] = useState<boolean>(false);
  const [shippingInfo, setShippingInfo] = useState<ShippingInfoFormType>({
    name: "",
    phone: "",
    address: "",
    city: "",
    zipCode: "",
    deliveryMethod: "home-delivery",
  });

  const [paymentMethod, setPaymentMethod] = useState<"full" | "cod">("cod");
  const [transactionId, setTransactionId] = useState("");
  const [bkashNumber, setBkashNumber] = useState("");

  // New delivery option state
  const [deliveryOption, setDeliveryOption] = useState<"inside" | "outside" | "">("");

  // Confirm Order function
  const handleConfirmOrder = () => {
    if (shippingInfoErrors) return;
    const phoneRegex = /^01[0-9]{9}$/;

    // Validation for shipping info
    if (!shippingInfo.name || !shippingInfo.phone || !shippingInfo.address) {
      toast.error("দয়া করে সমস্ত শিপিং তথ্য পূরণ করুন");
      return;
    }

    if (!phoneRegex.test(shippingInfo.phone)) {
      toast.error("দয়া করে সঠিক ১১ সংখ্যার বাংলাদেশি ফোন নাম্বার লিখুন");
      return;
    }

    // Delivery option validation
    if (!deliveryOption) {
      toast.error("দয়া করে ডেলিভারি পছন্দ করুন");
      return;
    }

    // Validation for Bkash payment (only if full payment selected)
    if (paymentMethod === "full") {
      if (!transactionId || !bkashNumber) {
        toast.error("দয়া করে Bkash নাম্বার এবং Transaction ID প্রদান করুন");
        return;
      }

      if (!phoneRegex.test(bkashNumber)) {
        toast.error("দয়া করে সঠিক ১১ সংখ্যার Bkash নাম্বার লিখুন");
        return;
      }
    }

    // Determine delivery charge
    const DELIVERY_CHARGE = deliveryOption === "inside" ? 80 : 120;

    // Calculate grand total including delivery and COD charges
    const grandTotal =
      (checkoutData?.pricing?.grandTotal ?? 0) +
      DELIVERY_CHARGE +
      (paymentMethod === "cod" ? COD_EXTRA_CHARGE : 0);

    const order: CheckoutDataType = {
      cartProducts: checkoutData?.cartProducts ?? [],
      coupon: checkoutData?.coupon ?? null,
      pricing: {
        subtotal: checkoutData?.pricing?.subtotal ?? 0,
        totalDiscount: checkoutData?.pricing?.totalDiscount ?? 0,
        totalAfterDiscount: checkoutData?.pricing?.totalAfterDiscount ?? 0,
        couponDiscountAmount: checkoutData?.pricing?.couponDiscountAmount ?? 0,
        totalQuantity: checkoutData?.pricing?.totalQuantity ?? 0,
        grandTotal,
      },
      shippingInfo: {
        ...shippingInfo,
        deliveryMethod: deliveryOption === "inside" ? "inside-dhaka" : "outside-dhaka",
      },
      paymentInfo: {
        method: paymentMethod === "full" ? "bkash" : "cash-on-delivery",
        paymentStatus: paymentMethod === "full" ? "paid" : "unpaid",
        transactionId: paymentMethod === "full" ? transactionId : undefined,
        paymentMethodDetails:
          paymentMethod === "full" ? { bkashNumber } : undefined,
      },
      meta: {
        checkoutAt: new Date().toISOString(),
        userName: user?.name || "Guest",
        userEmail: user?.email || "guest@example.com",
        userId: user?.id ? user.id.toString() : "",
        orderStatus: "pending",
      },
    };

    event({
      action: "checkout",
      category: "ecommerce",
      value: 1,
    });

    setFinalOrder(order);
    setSuccessModalOpen(true);
  };

  const handleModalConfirm = async () => {
    if (!finalOrder) {
      toast.error("No order data available");
      return;
    }
    try {
      const response = await addOrder(finalOrder);
      if (response?.success && response?.insId) {
        toast.success("✅ Order placed successfully!");
        router.push("/shop");
        dispatch(clearCheckoutData());
        clearCart();
        setSuccessModalOpen(false);

        const insId = response?.insId;
        await handleSendNotification(insId);
      }
    } catch (error) {
      console.error("Error placing order:", error);
      toast.error("❌ Something went wrong while placing order.");
    }
  };

  const handleSendNotification = async (orderId: string) => {
    sendNewNotification({
      title: "New Order Placed",
      message: `Customer Name: ${finalOrder?.shippingInfo?.name}\nOrder ID: ${
        orderId || "N/A"
      }\nTotal Amount: ${finalOrder?.pricing?.grandTotal} BDT\nDate: ${new Date(
        finalOrder?.meta?.checkoutAt || ""
      ).toLocaleString()}`,
      type: "order_placed",
      link: `/dashboard/manageOrders/${orderId}`,
      relatedId: orderId,
    });
  };

  if (!checkoutData) {
    return <div className="text-center py-10">No checkout data found.</div>;
  }

  // Determine delivery charge for display
  const DELIVERY_CHARGE = deliveryOption === "inside" ? 80 : 120;

  return (
    <div className="max-w-4xl mx-auto p-4">
      <Suspense fallback={<div>Loading...</div>}>
        <PageHeading />
      </Suspense>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
        {/* Shipping Info */}
        <ShippingInfoForm
          shippingInfo={shippingInfo}
          setShippingInfo={setShippingInfo}
          setShippingInfoErrors={setShippingInfoErrors}
        />

        {/* Order Summary & Payment */}
        <div>
          <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
          <div className="text-sm font-medium space-y-1 bg-gray-100 p-4 rounded border">
            <p>Subtotal: {checkoutData.pricing?.subtotal} TK</p>
            <p>Discount: -{checkoutData.pricing?.totalDiscount} TK</p>
            <p>After Discount: {checkoutData.pricing?.totalAfterDiscount} TK</p>
            <p>
              Coupon Discount: -{checkoutData.pricing?.couponDiscountAmount} TK
            </p>
            <p className="font-semibold">
              Delivery Charge: +{deliveryOption ? DELIVERY_CHARGE : 0} TK
            </p>
            {paymentMethod === "cod" && (
              <p className="font-semibold text-red-600">
                Cash on Delivery Charge: +{COD_EXTRA_CHARGE} TK
              </p>
            )}
            <p className="font-semibold">
              Total Quantity: {checkoutData?.pricing?.totalQuantity || 0}
            </p>
            <p className="font-bold text-lg">
              Grand Total:{" "}
              {(checkoutData.pricing?.grandTotal || 0) +
                (deliveryOption ? DELIVERY_CHARGE : 0) +
                (paymentMethod === "cod" ? COD_EXTRA_CHARGE : 0)}{" "}
              TK
            </p>
          </div>

          {/* Delivery Option */}
          <div className="mt-4 space-y-2">
            <h3 className="font-medium">ডেলিভারি পছন্দ করুন:</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  value="inside"
                  checked={deliveryOption === "inside"}
                  onChange={() => setDeliveryOption("inside")}
                />
                ঢাকার ভিতরে (80 TK)
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="delivery"
                  value="outside"
                  checked={deliveryOption === "outside"}
                  onChange={() => setDeliveryOption("outside")}
                />
                ঢাকার বাইরে (120 TK)
              </label>
            </div>
          </div>

          {/* Payment */}
          <div className="mt-6 space-y-2">
            <h3 className="font-medium">Payment Method:</h3>
            <div className="flex gap-4">
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === "cod"}
                  onChange={() => setPaymentMethod("cod")}
                />
                Cash on Delivery
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="radio"
                  name="payment"
                  value="full"
                  checked={paymentMethod === "full"}
                  onChange={() => setPaymentMethod("full")}
                />
                Full Bkash Payment
              </label>
            </div>

            {paymentMethod === "full" && (
              <div className="mt-4 space-y-2">
                <div className="grid grid-cols-1 md:grid-cols-2 my-3">
                  <SafeImage
                    src={bkashQR}
                    alt="Bkash Logo"
                    width={400}
                    height={400}
                  />
                  <SafeImage
                    src={bkashQRinfo}
                    alt="Bkash Info"
                    width={400}
                    height={400}
                  />
                </div>
                <p className="text-lg font-medium text-gray-700">
                  Pay to: <span className="font-bold">01773133145</span>
                </p>
                <input
                  type="text"
                  placeholder="Transaction ID"
                  value={transactionId}
                  onChange={(e) => setTransactionId(e.target.value)}
                  className="w-full my-input"
                />
                <input
                  type="text"
                  placeholder="Your Bkash Number"
                  value={bkashNumber}
                  onChange={(e) => setBkashNumber(e.target.value)}
                  className="w-full my-input"
                />
              </div>
            )}
          </div>

          <button className="btn-base w-full mt-6" onClick={handleConfirmOrder}>
            Submit
          </button>
        </div>
      </div>

      {/* Success Modal */}
      <CustomModal
        open={successModalOpen}
        onOpenChange={setSuccessModalOpen}
        title="Order Successful"
        description="Your order has been placed successfully."
        className="w-11/12 md:w-8/12 lg:w-6/12 xl:w-5/12 2xl:w-4/12 h-full max-h-[90vh] overflow-y-scroll"
      >
        {finalOrder && (
          <OrderSuccessContent
            orderData={finalOrder}
            onConfirm={() => handleModalConfirm()}
          />
        )}
      </CustomModal>
    </div>
  );
};

export default CheckoutPage;
