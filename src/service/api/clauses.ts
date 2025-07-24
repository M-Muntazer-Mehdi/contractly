/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getList = async () => {
  return await baseURL.get(`/api/v1/clauses/list-clauses`);
};

export const create = async (data: any) => {
  const response = await baseURL.post("/api/v1/clauses/create", data);
  return response.data;
};

export const deleteClauses = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/clauses/${id}`);
  return response.data;
};

export const updateStatus = async (id: any, data: any) => {
  const response = await baseURL.patch(
    `/api/v1/clauses/updte-status/${id}`,
    data
  );
  return response.data;
};

export const updateClauses = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/clauses/update/${id}`, data);
  return response.data;
};

export const getClausesById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/clauses/${id}`);
  return response.data;
};
