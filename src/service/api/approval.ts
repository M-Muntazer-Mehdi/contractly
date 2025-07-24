/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getList = async () => {
  return await baseURL.get(`/api/v1/approvals/list`);
};

export const create = async (data: any) => {
  const response = await baseURL.post("/api/v1/approvals/create", data);
  return response.data;
};

export const deleteapprovals = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/approvals/delete/${id}`);
  return response.data;
};

export const updateStatus = async (id: any, data: any) => {
  const response = await baseURL.patch(
    `/api/v1/approvals/updte-status/${id}`,
    data
  );
  return response.data;
};

export const updateapprovals = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/approvals/update/${id}`, data);
  return response.data;
};

export const getapprovalsById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/approvals/${id}`);
  return response.data;
};
