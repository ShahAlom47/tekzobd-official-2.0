"use client";

import { useEffect, useState } from "react";
import { useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

import CategoryForm from "./CategoryForm";
import { getSingleCategory, updateCategory } from "@/lib/allApiRequest/categoryRequest/categoryRequest";
import { CategoryType } from "@/Interfaces/categoryInterfaces";

interface EditCategoryProps {
  id: string;
  setOpenModal?: (open: boolean) => void;
}

const EditCategory: React.FC<EditCategoryProps> = ({ id, setOpenModal }) => {
  const [defaultValues, setDefaultValues] = useState<Partial<CategoryType> | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const queryClient = useQueryClient();

  useEffect(() => {
    const fetchCategory = async () => {
      setLoading(true);
      try {
        const res = await getSingleCategory(id);
        if (res?.success && res.data) {
          setDefaultValues(res.data);
        } else {
          toast.error("Failed to load category data");
        }
      } catch (error) {
        console.error("Fetch category error:", error);
        toast.error("Error fetching category data");
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchCategory();
    }
  }, [id]);

 const handleUpdate = async (data: CategoryType) => {
  setLoading(true);
  try {
   
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { _id, ...updateData } = data;

    const res = await updateCategory(id, updateData);
    if (res?.success) {
      toast.success("Category updated successfully");
      queryClient.invalidateQueries({ queryKey: ["getAllCategories"] });
      if (setOpenModal) setOpenModal(false);
    } else {
      toast.error(res.message || "Update failed");
    }
  } catch (error) {
    console.error("Update category error:", error);
    toast.error("Something went wrong");
  } finally {
    setLoading(false);
  }
};


  if (loading || !defaultValues) {
    return <p className="text-center py-4">Loading...</p>;
  }

  return (
    <CategoryForm
      defaultValues={defaultValues}
      onSubmit={handleUpdate}
      submitText="Update Category"
      loading={loading}
    />
  );
};

export default EditCategory;
