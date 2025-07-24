/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getList = async () => {
  return await baseURL.get(`/api/v1/customFields/list`);
};
export const getfeildList = async () => {
  return await baseURL.get(`/api/v1/customFields/list`);
};

export const create = async (data: any) => {
  const response = await baseURL.post("/api/v1/customFields/create", data);
  return response.data;
};

export const deletecustomFields = async (id: string) => {
  const response = await baseURL.delete(
    `/api/v1/customFields/custom-field/${id}`
  );
  return response.data;
};

export const updateStatus = async (id: any, data: any) => {
  const response = await baseURL.patch(
    `/api/v1/customFields/updte-status/${id}`,
    data
  );
  return response.data;
};

export const updatecustomFields = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/customFields/update/${id}`, data);
  return response.data;
};

export const getcustomFieldsById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/customFields/${id}`);
  return response.data;
};
