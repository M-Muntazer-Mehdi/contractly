/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getList = async () => {
  return await baseURL.get(`/api/v1/tags/list-tags`);
};

export const create = async (data: any) => {
  const response = await baseURL.post("/api/v1/tags/create", data);
  return response.data;
};

export const deleteTags = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/tags/${id}`);
  return response.data;
};

export const updateStatus = async (id: any, data: any) => {
  const response = await baseURL.patch(`/api/v1/tags/updte-status/${id}`, data);
  return response.data;
};

export const updateTags = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/tags/update/${id}`, data);
  return response.data;
};

export const getTagsById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/tags/${id}`);
  return response.data;
};
