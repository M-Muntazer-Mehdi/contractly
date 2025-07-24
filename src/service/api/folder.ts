/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getFolderList = async (id: any) => {
  console.log(id, "id");

  return await baseURL.get(`/api/v1/folders/list-folder/${id}`);
};

export const createFolder = async (data: any) => {
  const response = await baseURL.post("/api/v1/folders/create-folder", data);
  return response.data;
};

export const UploadFiles = async (data: any) => {
  const response = await baseURL.post("/api/v1/folders/upload", data);
  return response.data;
};

export const deleteFolder = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/folders/folders/${id}`);
  return response.data;
};

export const deleteFile = async (folderId: string, fileId: string) => {
  const response = await baseURL.delete(
    `/api/v1/folders/${folderId}/files/${fileId}`
  );
  return response.data;
};

export const updateFolder = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/folders/update/${id}`, data);
  return response.data;
};

export const getCategoryById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/folders/${id}`);
  return response.data;
};
