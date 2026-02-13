"use client";

import { useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import { addCategory } from "@/lib/allApiRequest/categoryRequest/categoryRequest";
import { CategoryType } from "@/Interfaces/categoryInterfaces";

const AddCategory: React.FC = () => {
  const [loading, setLoading] = useState<boolean>(false);
  const queryClient = useQueryClient();

  const handleAdd = async (data: CategoryType) => {
    try {
      setLoading(true);
      const res = await addCategory(data);

      if (res?.success) {
        toast.success(res.message || "Category added!");
        queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
      } else {
        toast.error(res.message || "Failed to add category");
      }
    } catch (error) {
      console.error("AddCategory error:", error);
      toast.error("Error adding category");
    } finally {
      setLoading(false);
    }
  };

  return (
    <CategoryForm
      onSubmit={handleAdd}
      loading={loading}
      submitText="Add Category"
    />
  );
};

export default AddCategory;
