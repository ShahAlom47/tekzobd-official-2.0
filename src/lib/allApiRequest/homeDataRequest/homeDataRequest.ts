import { request } from "../apiRequests";


export const getHomeData = async () => {
  return request("GET", `/home`);
}