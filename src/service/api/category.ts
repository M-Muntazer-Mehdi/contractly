/* eslint-disable @typescript-eslint/no-explicit-any */
import baseURL from "./axiosInstance";

export const getCategoryList = async (id: any) => {
  console.log(id, "id");

  return await baseURL.get(`/api/v1/categories/list-category/${id}`);
};
export const createCategory = async (data: any) => {
  const response = await baseURL.post("/api/v1/categories/create", data);
  return response.data;
};

export const deleteCategoey = async (id: string) => {
  const response = await baseURL.delete(`/api/v1/categories/${id}`);
  return response.data;
};

export const deleteSubCategory = async (
  categoryId: string,
  subcategoryId: string
) => {
  const response = await baseURL.delete(
    `/api/v1/categories/${categoryId}/subcategories/${subcategoryId}`
  );

  return response.data;
};

export const updateStatus = async (id: any, data: any) => {
  const response = await baseURL.patch(
    `/api/v1/categories/updte-status/${id}`,
    data
  );
  return response.data;
};

export const updateCategory = async (id: any, data: any) => {
  const response = await baseURL.put(`/api/v1/categories/update/${id}`, data);
  return response.data;
};

export const getCategoryById = async (id: any) => {
  const response = await baseURL.get(`/api/v1/categories/${id}`);
  return response.data;
};
