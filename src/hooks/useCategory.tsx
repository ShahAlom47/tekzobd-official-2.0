
import { useEffect, useState, useCallback } from "react";
import { getAllCategories } from "@/lib/allApiRequest/categoryRequest/categoryRequest";
import { useAppDispatch, useAppSelector } from "@/redux/hooks/reduxHook";
import { setCategories } from "@/redux/features/category/categorySlice";
import { CategoryType } from "@/Interfaces/categoryInterfaces";

export const useCategories = () => {
  const dispatch = useAppDispatch();
  const categories = useAppSelector((state) => state.categories.list);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // ✅ Load categories only once if not cached
  const loadCategories = useCallback(async () => {
    if (categories.length === 0) {
      setLoading(true);
      try {
        const response = await getAllCategories({
          currentPage: 1,
          limit: 100,
          searchTrim: "",
        });

        if (!response?.data || !Array.isArray(response.data)) {
          throw new Error("Invalid response from server.");
        }

        dispatch(setCategories(response.data as CategoryType[]));
        setError(null);
      } catch (err: unknown) {
        if (err instanceof Error) {
          setError(err.message);
        } else if (typeof err === "string") {
          setError(err);
        } else {
          setError("Unexpected error occurred while fetching categories.");
        }
      } finally {
        setLoading(false);
      }
    }
  }, [categories.length, dispatch]);

  // ✅ Forcefully refetch categories even if cached
  const restoreCategories = useCallback(async () => {
    setLoading(true);
    try {
      const response = await getAllCategories({
        currentPage: 1,
        limit: 100,
        searchTrim: "",
      });

      if (!response?.data || !Array.isArray(response.data)) {
        throw new Error("Invalid response from server.");
      }

      dispatch(setCategories(response.data as CategoryType[]));
      setError(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else if (typeof err === "string") {
        setError(err);
      } else {
        setError("Unexpected error occurred while restoring categories.");
      }
    } finally {
      setLoading(false);
    }
  }, [dispatch]);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  // ✅ Helpers
  const getCategoryById = (id: string): CategoryType | undefined =>
    categories.find((item) => item._id === id);

  const getCategoryNameById = (id: string): string =>
    getCategoryById(id)?.name || "Unknown Category";

  return {
    categories,
    loading,
    error,
    getCategoryById,
    getCategoryNameById,
    loadCategories,
    restoreCategories,
  };
};
