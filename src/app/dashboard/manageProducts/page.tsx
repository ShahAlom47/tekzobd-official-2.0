"use client";

import ErrorComponent from "@/app/error";
import Loading from "@/app/loading";
import { CustomTable } from "@/components/ui/CustomTable";
import { DashPaginationButton } from "@/components/ui/DashPaginationButton";
import { useConfirm } from "@/hooks/useConfirm";
import { useAppSelector } from "@/redux/hooks/reduxHook";
import {
  deleteProduct,
  getAllProduct,
} from "@/lib/allApiRequest/productRequest/productRequest";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { queryClient } from "@/Providers/QueryProvider";
import { ObjectId } from "mongodb";
import { ProductType } from "@/Interfaces/productInterfaces";
import { FaPlus } from "react-icons/fa";
import { MdDeleteSweep } from "react-icons/md";
import { useCategories } from "@/hooks/useCategory";
import DashPageTitle from "@/components/Dashboard/DashCommonComponent/DashPageTitle";
import PrimaryButton from "@/components/CommonComponents/PrimaryButton";

const ManageProduct = () => {
    
  const {getCategoryNameById}= useCategories()
  const { ConfirmModal, confirm } = useConfirm();
  const [page, setPage] = useState(1);
  const limit = 10;
  const searchValue = useAppSelector(
    (state) => state.dashSearch.dashSearchValue
  );



  const {
    data: product,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["getAllProduct", searchValue,page],
    queryFn: async () => {
      const response = await getAllProduct({
        currentPage: page,
        limit,
        searchTrim: searchValue,
        isDashboardRequest:true,
      });
      if (!response || !response.success) {
        throw new Error(response.message || "Failed to fetch product data");
      }
      return response;
    },
    refetchOnWindowFocus: false,
  });

  const productData = (product?.data as ProductType[]) || [];
  const totalPages = product?.totalPages || 1;

  const handleDelete = async (id: ObjectId | string | undefined) => {
    const ok = await confirm({
      title: "Delete Product",
      message: "Are you sure you want to delete this product?",
      confirmText: "Yes",
      cancelText: "No",
    });

    if (ok) {
      if (!id) {
        toast.error("Invalid product ID");
        return;
      }
      try {
        const deleteResponse = await deleteProduct(id);
        if (!deleteResponse || !deleteResponse.success) {
          throw new Error(deleteResponse.message || "Failed to delete product");
        }
        toast.success(
          deleteResponse.message || "Product deleted successfully!"
        );
        queryClient.invalidateQueries({ queryKey: ["getAllProduct"] });
      } catch (error) {
        toast.error("Error deleting product");
        console.error(error);
      }
    }
  };

  const columns = [
    { header: "Title", accessor: "title", isSummary: true },
    { header: "Price", accessor: "price" },
    { header: "Discount", accessor: "discount" },
    { header: "Dis Price", accessor: "discountedPrice" },

    { header: "Stock", accessor: "stock" },
    { header: "Category", accessor: "category" },
    { header: "Edit", accessor: "edit" },
    { header: "Delete", accessor: "delete" },
  ];

  const data = productData?.map((item) => ({
    title: item.title.slice(0, 20),
    price: `${item.price} TK`,

    discount: `${item.discount || 0}%`,
    discountedPrice: `${item.price - (item.price * (item.discount || 0)) / 100} TK`,
    stock: item.stock,
    category: getCategoryNameById(item?.categoryId),
    edit: (
      <Link
        href={`/dashboard/manageProducts/${item._id}`}
        className="btn-bordered"
      >
        View & Edit
      </Link>
    ),
    delete: (
      <button
        onClick={() => handleDelete(item._id)}
        className=" text-red-500 hover:text-red-600 text-xl "
      >
      <MdDeleteSweep />
      </button>
    ),
  }));

  return (
    <div className="p-4 max-w min-h-screen">
      <div className="flex justify-between mb-4">
        <DashPageTitle>Manage Products</DashPageTitle>
        <PrimaryButton
          href={"/dashboard/manageProducts/addProducts"}
          className=" rounded-sm text-sm h-8"
        >
          <FaPlus></FaPlus> Add Products
        </PrimaryButton>
      </div>
      {isLoading ? (
        <Loading />
      ) : error ? (
        <ErrorComponent />
      ) : (
        <>
          <CustomTable
            columns={columns}
            data={data}
            className=""
          />
          <DashPaginationButton
            currentPage={page}
            totalPages={totalPages}
            onPageChange={(newPage) => setPage(newPage)}
            className="mt-4"
          />
        </>
      )}
      {ConfirmModal}
    </div>
  );
};

export default ManageProduct;
