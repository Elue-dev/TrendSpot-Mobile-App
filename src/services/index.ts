import axios from "axios";

export const httpRequest = axios.create({
  // baseURL: "https://trendspot-server.cyclic.cloud/api/v1",
  // baseURL: "https://trendspot-server-production.up.railway.app/api/v1",
  baseURL: "http://172.20.10.10:8000/api/v1",
});
