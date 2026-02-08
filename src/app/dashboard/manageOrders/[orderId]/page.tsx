"use client";

import React from "react";
import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";
import { getSingleOrder } from "@/lib/allApiRequest/orderRequest/orderRequest";
import Loading from "@/app/loading";
import Error from "@/app/error";
import OrderDetailsContent from "@/components/OrderDetailsContent";
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";
import DashPageTitle from "@/components/DashPageTitle";

const OrderDetails = () => {
  const { orderId } = useParams();

  const {
    data: order,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["order-details", orderId],
    queryFn: async () =>{
        const res = await getSingleOrder(orderId?.toString() || "");
        return res?.data  as CheckoutDataType;
    },
    enabled: !!orderId,
  });

  if (isLoading) return <Loading />;

  if (isError)
    return (
      <Error
      />
    );

  return (
    <div className="p-4">
    <DashPageTitle > Order Details</DashPageTitle>
      {order ? (
        <OrderDetailsContent order={order} />
      ) : (
        <div>No order details found.</div>
      )}
    </div>
  );
};

export default OrderDetails;
