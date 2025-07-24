/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getList = async () => {
  return await baseURL.get(`/api/v1/templates/list`);
};

export const create = async (data: any) => {
  const response = await baseURL.post(
    "/api/v1/templates/create-template",
    data
  );
  return response.data;
};

export const deletetemplates = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/templates/${id}`);
  return response.data;
};

export const updateStatus = async (id: any, data: any) => {
  const response = await baseURL.patch(
    `/api/v1/templates/updte-status/${id}`,
    data
  );
  return response.data;
};

export const updatetemplates = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/templates/update/${id}`, data);
  return response.data;
};

export const gettemplatesById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/templates/${id}`);
  return response.data;
};
export const archiveTemp = async (id: any, data: any) => {
  const response = await baseURL.patch(`/api/v1/templates/archive/${id}`, data);
  return response.data;
};
