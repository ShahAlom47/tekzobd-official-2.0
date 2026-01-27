

import { ReviewFormInput, ReviewsType } from "@/Interfaces/reviewInterfaces";
import { request } from "../apiRequests";



export const addReview = async (data:ReviewsType) => {
  return request("POST", "/review/add", { ...data }, );
}
export const getReviewByProductId = async (productId:string) => {
  return request("GET", `/review/productReviews?productId=${productId}` );
}
export const deleteReview = async (reviewId:string) => {
  return request("DELETE", `/review/delete?reviewId=${reviewId}` );
}
export const editReview = async (data:ReviewFormInput) => {
  return request("PATCH", `/review/edit`,{ ...data } );
}

// export const getAllCategories = async ({ currentPage, limit, searchTrim }: GetAllCategoryParams) => {
//   const url = `/category/getAllCategory?currentPage=${currentPage}&pageSize=${limit}` +
//               (searchTrim ? `&searchTrim=${encodeURIComponent(searchTrim)}` : "");

//   return request("GET", url);
// };

// export const getSingleCategory = async (id:string|ObjectId,)=>{
//   return request("GET",`/category/getSingleCategory/${id}`)
// }

// export const updateCategory = async (id:string|ObjectId,data:CategoryType)=>{
//   return request("PATCH",`/category/updateCategory/${id}`,{...data})
// }

// export const deleteCategory= async (id: string|ObjectId ) => {
//   return request("DELETE", `/category/deleteCategory/${id}`);
// }
