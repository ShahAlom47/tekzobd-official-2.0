
import { request } from "../apiRequests";
import { ObjectId } from "mongodb";
import { GetAllProductParams, ProductType } from "@/Interfaces/productInterfaces";



export const addProduct = async (data:ProductType) => {
  return request("POST", "/product/addProduct", { ...data }, );
}



export const getAllProduct = async (params: GetAllProductParams) => {
  const {
    currentPage,
    limit,
    searchTrim,
    sort,
    minPrice,
    maxPrice,
    category,
    brand,
    rating,
    offerOnly,
    isDashboardRequest,
    stock,
  } = params;

  const queryParams = new URLSearchParams();

  queryParams.set("currentPage", String(currentPage));
  queryParams.set("pageSize", String(limit));

  if (searchTrim) queryParams.set("searchTrim", searchTrim);
  if (sort) queryParams.set("sort", sort);
  if (minPrice) queryParams.set("minPrice", String(minPrice));
  if (maxPrice) queryParams.set("maxPrice", String(maxPrice));
  if (category) queryParams.set("category", category);
  if (brand) queryParams.set("brand", brand);
  if (rating) queryParams.set("rating", String(rating));
  if (offerOnly) queryParams.set("offerOnly", "true");
  if (stock) queryParams.set("stock", stock);

  const url = `/product/getAllProducts?${queryParams.toString()}`;

  // ✅ Only set customHeaders if isDashboardRequest is true
  const customHeaders: Record<string, string> | undefined = isDashboardRequest ? { "x-from-dashboard": "true" } : undefined;

  return request("GET", url, undefined, undefined, customHeaders);
};



export const getSingleProduct = async (id:string|ObjectId,)=>{
  return request("GET",`/product/${id}`)
}
export const getSingleProductBySlug = async (slug:string)=>{
  return request("GET",`/product/details/${slug}`)
}

export const updateProduct = async (id:string|ObjectId,data:ProductType)=>{
  return request("PATCH",`/product/${id}`,{...data})
}

export const deleteProduct= async (id: string|ObjectId ) => {
  return request("DELETE", `/product/deleteProduct/${id}`);
}
export const getRecentProductsByIds = async (ids: string[]) => {
  const query = ids.map((id) => `ids=${id}`).join("&");
  return request("GET", `/product/resentViewProducts?${query}`);
};

export const getRelatedProductsById = async (id: string) => {
  return request("GET", `/product/relatedProducts?id=${id}`);
};
