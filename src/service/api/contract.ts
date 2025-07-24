/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getList = async (id: any) => {
  return await baseURL.get(`/api/v1/contracts/list-contract/${id}`);
};
export const getListTemlate = async (id: any) => {
  return await baseURL.get(`/api/v1/contracts/list-contractTemplate/${id}`);
};

export const create = async (data: any) => {
  const response = await baseURL.post("/api/v1/contracts/create", data);
  return response.data;
};

export const deletecontract = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/contracts/${id}`);
  return response.data;
};

export const updateDocument = async (id: any, data: any) => {
  const response = await baseURL.put(
    `/api/v1/contracts/updateDocument/${id}`,
    data
  );
  return response.data;
};

export const updatecontract = async (id: any, data: any) => {
  const response = await baseURL.patch(
    `/api/v1/contracts/createUpdate/${id}`,
    data
  );
  return response.data;
};

export const getcontractById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/contracts/${id}`);
  return response.data;
};
