"use client";

import DashPageTitle from "@/components/DashPageTitle";
import { CustomTable } from "@/components/ui/CustomTable";
import { DashPaginationButton } from "@/components/ui/DashPaginationButton";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import { useAppSelector } from "@/redux/hooks/reduxHook";
import Loading from "@/app/loading";
import ErrorComponent from "@/app/error";
import { NewsletterSubscriberType } from "@/Interfaces/newsLetterInterface";
import {
  getAllNewsLetterSubscribers,
  deleteNewsLetterSubscriber,
  updateSubscriberStatus,
} from "@/lib/allApiRequest/newsLetterRequest/newsLetterRequest";
import { useConfirm } from "@/hooks/useConfirm";
import toast from "react-hot-toast";
import { ObjectId } from "mongodb";

const ManageNewsletter = () => {
  const { confirm, ConfirmModal } = useConfirm();
  const searchValue = useAppSelector((state) => state.dashSearch.dashSearchValue);
  const [page, setPage] = useState(1);
  const limit = 10;

  const {
    data: newsLetters,
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ["getAllNewsLetterSubscriber", searchValue, page],
    queryFn: async () => {
      const response = await getAllNewsLetterSubscribers({
        currentPage: page,
        limit,
        searchTrim: searchValue,
      });
      if (!response || !response.success) {
        throw new Error(response.message || "Failed to fetch newsletter data");
      }
      return response;
    },
    refetchOnWindowFocus: false,
  });


  const handleDelete = async (id: string | ObjectId) => {
    const ok = await confirm({
      title: "Delete Subscriber",
      message: "Are you sure you want to delete this subscriber?",
      confirmText: "Yes, Delete",
      cancelText: "Cancel",
    });

    if (ok) {
      const res = await deleteNewsLetterSubscriber(id);
      if (res?.success) {
        toast.success("Subscriber deleted!");
        refetch();
      } else {
        toast.error(res?.message || "Failed to delete");
      }
    }
  };
const handleStatusToggle = async (id: string | ObjectId, currentStatus: boolean) => {
  const ok = await confirm({
    title: "Change Status",
    message: `Are you sure you want to mark this subscriber as ${!currentStatus ? "Active" : "Inactive"}?`,
    confirmText: `Yes, ${!currentStatus ? "Activate" : "Deactivate"}`,
    cancelText: "Cancel",
  });

  if (!ok) return;

  const res = await updateSubscriberStatus(id, !currentStatus);
  if (res?.success) {
    toast.success(`Subscriber status updated to ${!currentStatus ? "Active" : "Inactive"}`);
    refetch();
  } else {
    toast.error(res?.message || "Failed to update status");
  }
};


  const columns = [
    { header: "Email", accessor: "email" },
    { header: "Status", accessor: "status" },
    { header: "Delete", accessor: "delete" },
  ];

  const data =
    (newsLetters?.data as NewsletterSubscriberType[] | undefined)?.map((item) => ({
      email: item.email,
      status: (
        <button
          className={`text-sm font-medium px-3 py-1 rounded ${
            item.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"
          } hover:opacity-80`}
          onClick={() => handleStatusToggle(item?._id?item._id:'', item.isActive)}
        >
          {item.isActive ? "Active" : "Inactive"}
        </button>
      ),
      delete: (
        <button
          className="btn-bordered border-red-700 hover:bg-red-700 h-6 py-0"
          onClick={() => handleDelete(item?._id?item._id:'')}
        >
          Delete
        </button>
      ),
    })) || [];

  return (
    <div>
      <div className="flex justify-between mb-4">
        <DashPageTitle>Manage Newsletter Subscribers</DashPageTitle>
      </div>

      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorComponent />
      ) : (
        <>
          <CustomTable columns={columns} data={data} className="shadow-md" />
          <DashPaginationButton
            currentPage={page}
            totalPages={newsLetters?.totalPages || 1}
            onPageChange={(newPage) => setPage(newPage)}
            className="mt-4"
          />
        </>
      )}

      {ConfirmModal}
    </div>
  );
};

export default ManageNewsletter;
