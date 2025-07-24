/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getList = async () => {
  return await baseURL.get(`/api/v1/role/list-role`);
};

export const create = async (data: any) => {
  const response = await baseURL.post("/api/v1/role/createOrUpdateRole", data);
  return response.data;
};

export const deleterole = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/role/${id}`);
  return response.data;
};

export const updateStatus = async (id: any, data: any) => {
  const response = await baseURL.patch(`/api/v1/role/updte-status/${id}`, data);
  return response.data;
};

export const updaterole = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/role/update/${id}`, data);
  return response.data;
};

export const getroleById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/role/${id}`);
  return response.data;
};
