"use client";

import { useCallback, useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { useUser } from "./useUser";
import { useAppDispatch } from "@/redux/hooks/reduxHook";
import {
  setWishlistRedux,
  clearWishlistRedux,
} from "@/redux/features/wishList/wishlistSlice";

import { WishlistType } from "@/Interfaces/wishListInterfaces";
import { ProductType } from "@/Interfaces/productInterfaces";
import { useQuery } from "@tanstack/react-query";
import { queryClient } from "@/Providers/QueryProvider";
import { addWishList, getUserWishList, getWishListProductByIds, removeWishData } from "@/lib/allApiRequest/wishListRequest/wishListRequest";

export const useWishlist = () => {
  const { user } = useUser();
  const userEmail: string | undefined = user?.email ?? undefined;
  const dispatch = useAppDispatch();

  // ✅ Fetch only productId list
  const {
    data: fetchedWishlist,
    isLoading: isWishlistLoading,
    isError: isWishlistError,
    refetch: refetchWishlist,
  } = useQuery<WishlistType>({
    queryKey: ["wishlistIdList", userEmail],
    queryFn: async () => {
      if (!userEmail) throw new Error("User not logged in");
      const result = await getUserWishList(userEmail);
      if (!result?.data) throw new Error("No wishlist data found");
      return result.data as WishlistType;
    },
    enabled: !!userEmail,
    staleTime: 1000 * 60 * 5,
  });

  // Handle Redux state update based on query result

  useEffect(() => {
    if (fetchedWishlist) {
      dispatch(setWishlistRedux(fetchedWishlist));
    } else if (isWishlistError) {
      dispatch(clearWishlistRedux());
    }
  }, [fetchedWishlist, isWishlistError, dispatch]);

  // ✅ Memoized productId list
  const productIdList: string[] = useMemo(() => {
    return fetchedWishlist?.products.map((p) => p.productId) || [];
  }, [fetchedWishlist]);



  // ✅ Fetch actual product data

  const stableProductIdList = useMemo(() => productIdList, [productIdList]);

  const {
    data: wishlistProducts = [],
    isLoading: isProductsLoading,
    isError: isProductsError,
    refetch: refetchProducts,
  } = useQuery<ProductType[]>({
    queryKey: ["wishlistData", stableProductIdList],
    queryFn: async (): Promise<ProductType[]> => {
      if (stableProductIdList.length === 0) return [];
      const res = await getWishListProductByIds(stableProductIdList);
      return res.data as ProductType[];
    },
    enabled: false,
    staleTime: 1000 * 60 * 5,
  });



  // ✅ Add item
  const addToWishlist = useCallback(
    async (productId: string) => {
      if (!userEmail) return toast.error("Login required to add wishlist");

      const exists = fetchedWishlist?.products.some(
        (p) => p.productId === productId
      );
      if (exists) return toast("Already in wishlist");

      try {
        const res = await addWishList({
          productId,
          addedAt: new Date().toISOString(),
          userEmail,
        });

        if (res?.success) {
          await refetchWishlist();
          toast.success(res.message || "Added to wishlist");
        }
      } catch {
        toast.error("Failed to add to wishlist");
      }
    },
    [userEmail, fetchedWishlist, refetchWishlist]
  );

  // ✅ Remove item
  const removeFromWishlist = useCallback(
    async (productId: string) => {
      if (!userEmail) {
        toast.error("Login required");
        return;
      }

      try {
        const res = await removeWishData(productId, userEmail);

        if (res?.success) {
          // Refetch local query data
          await refetchWishlist();

          // Invalidate query so cache resets (globally or individually)
          queryClient.invalidateQueries({
            queryKey: ["wishlistData", userEmail],
          });

          toast.success(res.message || "Removed from wishlist");
        } else {
          toast.error(res?.message || "Failed to remove from wishlist");
        }
      } catch (error) {
        toast.error("Something went wrong while removing from wishlist");
        console.error(error);
      }
    },
    [userEmail, refetchWishlist, ]
  );

  // ✅ Toggle wishlist state
  const toggleWishlist = useCallback(
    async (productId: string) => {
      const exists = fetchedWishlist?.products.some(
        (p) => p.productId === productId
      );
      if (exists) {
        await removeFromWishlist(productId);
      } else {
        await addToWishlist(productId);
      }
    },
    [fetchedWishlist, addToWishlist, removeFromWishlist]
  );

  // ✅ Check if product is wishlisted
  const isWishlisted = useCallback(
    (productId: string): boolean =>
      fetchedWishlist?.products.some((p) => p.productId === productId) || false,
    [fetchedWishlist]
  );

  // ✅ Clear wishlist data manually
  const clearWishlist = useCallback(() => {
    dispatch(clearWishlistRedux());
    queryClient.invalidateQueries({ queryKey: ["wishlistData"] });
  }, [dispatch]);

  return {
    productIdList,
    wishlistProducts,
    isLoading: isWishlistLoading,
    isProductsLoading,
    isProductsError,
    addToWishlist,
    removeFromWishlist,
    toggleWishlist,
    isWishlisted,
    clearWishlist,
    refetchProducts,
    stableProductIdList,
  };
};
