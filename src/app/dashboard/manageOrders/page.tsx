"use client";

import ErrorComponent from "@/app/error";
import Loading from "@/app/loading";
import { CustomTable } from "@/components/ui/CustomTable";
import { DashPaginationButton } from "@/components/ui/DashPaginationButton";
import { useConfirm } from "@/hooks/useConfirm";
import { useAppSelector } from "@/redux/hooks/reduxHook";
import { deleteOrder, getAllOrders } from "@/lib/allApiRequest/orderRequest/orderRequest";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { queryClient } from "@/Providers/QueryProvider";
import { ObjectId } from "mongodb";
import { CheckoutDataType } from "@/Interfaces/checkoutDataInterface";
import { MdDeleteSweep } from "react-icons/md";
import Link from "next/link";
import OrderFilters from "@/components/OrdersFilteringSec";
import OrderStatus from "@/components/OrderStatus";

const ManageOrders = () => {
  const { ConfirmModal, confirm } = useConfirm();
  const [page, setPage] = useState(1);
  const limit = 10;

    const [filters, setFilters] = useState({
    orderStatus: "",
    paymentMethod: "",
    deliveryMethod: "",
    fromDate: "",
    toDate: "",
  });

  const searchValue = useAppSelector(
    (state) => state.dashSearch.dashSearchValue
  );

  const {
    data: orderRes,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getAllOrders", filters, page,searchValue],
    queryFn: async () => {
      const response = await getAllOrders({
        currentPage: page,
        limit,
        search: searchValue,
        orderStatus: filters.orderStatus,
        paymentMethod: filters.paymentMethod,
        deliveryMethod: filters.deliveryMethod,
        fromDate: filters.fromDate,
        toDate: filters.toDate,
        isDashboardRequest: true,
      });
      if (!response || !response.success) {
        throw new Error(response.message || "Failed to fetch orders");
      }
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const orderData = (orderRes?.data as CheckoutDataType[]) || [];
  const totalPages = orderRes?.totalPages || 1;


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
        if(deleteResponse.success) {
          toast.success("Order deleted successfully");
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

  const columns = [
    { header: "User", accessor: "user" },
    { header: "Customer", accessor: "customer" },
    { header: "Email", accessor: "email" },
    { header: "Phone", accessor: "phone" },
    { header: "Qty", accessor: "quantity" },
    { header: "Delivery Methods", accessor: "deliveryMethods" },
    { header: "Delivery Type", accessor: "deliveryType" },
    { header: "Total", accessor: "total" },
    { header: "Status", accessor: "status" },
    { header: "Date", accessor: "date" },
    { header: "Action", accessor: "action" },
  ];

  const data = orderData.map((order) => {
    const {
      meta,
      shippingInfo,
      pricing,
      paymentInfo,
      // cartProducts,
    } = order;

    return {
      user: meta.userName  || "Guest",
      customer :shippingInfo?.name || "Guest",
      email: meta.userEmail || "N/A",
      phone: shippingInfo?.phone || "N/A",
      quantity: pricing.totalQuantity,
      deliveryMethods: paymentInfo?.method || "N/A",
      deliveryType:  shippingInfo?.deliveryMethod || "N/A",
      total: `${pricing.grandTotal.toFixed(2)} TK`,
      status: (<OrderStatus status={meta?.orderStatus} cancelledByUser={meta?.cancelledByUser} id={order._id?.toString() || "" } />),
      date: new Date(meta.checkoutAt).toLocaleDateString("en-GB"),
      action: (
        <div className="flex gap-2 items-center">
          <Link
            href={
              order?._id
                ? `/dashboard/manageOrders/${order._id.toString()}`
                : "#"
            }
            className="text-blue-600 hover:underline"
          >
            View
          </Link>
          <button
            onClick={() => handleDelete(order._id)}
            className="text-red-500 hover:text-red-600 text-xl"
          >
            <MdDeleteSweep />
          </button>
        </div>
      ),
    };
  });



  return (
    <div className="p-4 min-h-screen">
     
         {/* Filter section added here */}
      <OrderFilters onFilterChange={(newFilters) => {
        setFilters(newFilters);
        setPage(1); 
      }} />
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorComponent />
      ) : (
        <>
          <CustomTable columns={columns} data={data} />
          <DashPaginationButton
            currentPage={page}
            totalPages={totalPages}
            onPageChange={setPage}
            className="mt-4"
          />
        </>
      )}
      {ConfirmModal}
    </div>
  );
};

export default ManageOrders;
