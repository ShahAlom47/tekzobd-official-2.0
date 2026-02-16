import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";
import React from "react";
import { format } from "date-fns";
import OrderStatusSelect from "./OrderStatus";
import { MdDeleteSweep } from "react-icons/md";
import { useConfirm } from "@/hooks/useConfirm";
import { deleteOrder } from "@/lib/allApiRequest/orderRequest/orderRequest";
import toast from "react-hot-toast";
import { queryClient } from "@/Providers/QueryProvider";
import { ObjectId } from "mongodb";
import { useRouter } from "next/navigation";
import OrderTrackingSection from "./OrderTrackingSection";

const OrderDetailsContent = ({ order }: { order: CheckoutDataType }) => {
  const { _id, cartProducts, pricing, shippingInfo, paymentInfo, meta } = order;

  const { ConfirmModal, confirm } = useConfirm();
  const router = useRouter();

  const handleDelete = async (id: ObjectId | string | undefined) => {
    const ok = await confirm({
      title: "Delete Order",
      message: "Are you sure you want to delete this order?",
      confirmText: "Yes",
      cancelText: "No",
    });

    if (ok && id) {
      try {
        // Replace this with your deleteOrder API
        const deleteResponse = await deleteOrder(id);
        if (deleteResponse.success) {
          toast.success("Order deleted successfully");
          router?.push("/dashboard/manageOrders/");
        } else {
          toast.error("Failed to delete order");
        }
        queryClient.invalidateQueries({ queryKey: ["getAllOrders"] });
      } catch (error) {
        toast.error("Error deleting order");
        console.error(error);
      }
    }
  };

  return (
    <div className="space-y-6 py-3">
      {/* Order Summary */}
      <div className=" p-6 rounded shadow border bg-gray-200 border-brandPrimary">
        <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <p>
            <strong>Order ID:</strong> {_id?.toString()}
          </p>
          <div className="">
            <strong>Status: </strong>
            <OrderStatusSelect
              status={meta?.orderStatus}
              id={_id?.toString() ?? ""}
               cancelledByUser={order.meta.cancelledByUser}
            />
          </div>
          <p>
            <strong>Ordered On:</strong>{" "}
            {format(new Date(meta?.checkoutAt), "PPP p")}
          </p>
          <p>
            <strong>Email:</strong> {meta?.userEmail}
          </p>
          <p>
            <strong>User:</strong> {meta?.userName || "Guest"}
          </p>
        </div>
      </div>

      {/* Shipping Info */}
      {shippingInfo && (
        <div className="bg-gray-200 p-6 rounded shadow border border-brandPrimary">
          <h2 className="text-lg font-semibold mb-2">Shipping Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <p>
              <strong>Name:</strong> {shippingInfo.name}
            </p>
            <p>
              <strong>Phone:</strong> {shippingInfo.phone}
            </p>
            <p>
              <strong>City:</strong> {shippingInfo.city}
            </p>
            <p>
              <strong>Delivery:</strong> {shippingInfo.deliveryMethod}
            </p>
            <p>
              <strong>Address:</strong> {shippingInfo.address}
            </p>
            {shippingInfo.zipCode && (
              <p>
                <strong>Zip:</strong> {shippingInfo.zipCode}
              </p>
            )}
          </div>
        </div>
      )}

      {/* Payment Info */}
      {paymentInfo && (
        <div className="bg-gray-200 p-6 rounded shadow border border-brandPrimary">
          <h2 className="text-lg font-semibold mb-2">Payment Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <p>
              <strong>Method:</strong> {paymentInfo.method}
            </p>
            <p>
              <strong>Status:</strong> {paymentInfo.paymentStatus}
            </p>
            {paymentInfo.transactionId && (
            <>
              <p>
                <strong>Transaction ID:</strong> {paymentInfo.transactionId}
              </p>
              <p>
                <strong>BKash Number:</strong> {paymentInfo.paymentMethodDetails?.bkashNumber || "N/A"}
              </p>
            </>
            )}
          </div>
        </div>
      )}

      {/* Pricing Summary */}
      <div className="bg-gray-200 p-6 rounded shadow border border-brandPrimary">
        <h2 className="text-lg font-semibold mb-2">Pricing Summary</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <p>
            <strong>Subtotal:</strong> ৳{pricing.subtotal}
          </p>
          <p>
            <strong>Product Discount:</strong> ৳{pricing.totalDiscount}
          </p>
          <p>
            <strong>Coupon Discount:</strong> ৳{pricing.couponDiscountAmount}
          </p>
          <p>
            <strong>Total Quantity:</strong> {pricing.totalQuantity}
          </p>
          <p className="font-bold text-lg">
            <strong>Grand Total:</strong> ৳{pricing.grandTotal}
          </p>
        </div>
      </div>

      {/* Product List */}
      <div className="bg-gray-200 p-6 rounded shadow border border-brandPrimary">
        <h2 className="text-lg font-semibold mb-4">Products</h2>
        <div className="space-y-4">
          {cartProducts.map((item, idx) => (
            <div key={idx} className="flex justify-between border-b pb-2">
              <div>
                <p className="font-medium">{item.productName}</p>
                <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                <p className="text-sm text-gray-500"> Product Color: {item.productColor || "N/A"}</p>
              </div>
              <div className="text-right">
                <p>
                  ৳{item.discountedPrice}{" "}
                  <span className="text-sm text-gray-400 line-through ml-1">
                    ৳{item.priceAtPurchase}
                  </span>
                </p>
                <p className="text-sm text-gray-600">
                  Total: ৳{item.discountedPrice * item.quantity}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Order Tracking Section */}
      <OrderTrackingSection order={order} />

      {/* Action Buttons */}
      <button
        onClick={() => handleDelete(order._id)}
        className=" text-white  px-2 py-1  rounded-sm bg-red-500 hover:bg-red-600 text-xl  flex gap-2 items-center justify-end ml-auto"
      >
        <MdDeleteSweep /> Delete Order
      </button>

      {ConfirmModal}
    </div>
  );
};

export default OrderDetailsContent;
