

import { request } from "../apiRequests";
import { AddRequestWistDataType,} from "@/Interfaces/wishListInterfaces";



export const addWishList = async (data:AddRequestWistDataType) => {
  return request("POST", "/wishList/add", { ...data }, );
}
export const removeWishData = async (productId:string,userEmail:string) => {
  return request("DELETE", `/wishList/removeWishListData`,{productId,userEmail} );
}
export const syncWishlist = async (productIds:string[],userEmail:string) => {
  return request("POST", `/wishList/sync-wishlist`,{productIds,userEmail} );
}
export const getUserWishList = async (userEmail: string) => {
  return request("GET", `/wishList/user-wishlist?userEmail=${userEmail}`);
}
export const getWishListProductByIds = async (wishIds:string[]) => {
  return request("POST", `/wishList/products`,{wishListIds:wishIds} );
}


