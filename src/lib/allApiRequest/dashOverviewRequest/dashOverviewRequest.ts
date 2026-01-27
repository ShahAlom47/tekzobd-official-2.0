import { request } from "../apiRequests";

export const getAllTrafficInfo = async ({ filter }:{filter:string}) => {
  const url = `/analytics/allData?filter=${filter}`;

  return request("GET", url);
};

export const getAllOverview = async ({ filter }:{filter:string}) => {
  const url = `/overview?filter=${filter}`;
  return request("GET", url);
};
