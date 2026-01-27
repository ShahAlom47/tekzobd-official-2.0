import { ObjectId } from "mongodb";
import { request } from "../apiRequests";
import {  UsersRequestData } from "@/Interfaces/userInterfaces";

export const getUserInfo = async (userEmail: string) => {
  return request("GET", `/user/user-info/${userEmail}`);
}


export const updateUserInfo = async (userEmail:string|ObjectId,data:UsersRequestData)=>{
  return request("PATCH",`/user/update-info/${userEmail}`,{...data})
}
