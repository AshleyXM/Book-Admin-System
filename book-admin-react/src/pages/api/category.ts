import { CategoryQueryType, CategoryType } from "@/types";
import qs from "qs";
import request from "@/utils/request";

export async function getCategoryList(params?: CategoryQueryType) {
  // https://apifoxmock.com/m1/4562274-4210740-default/api/categories?name=xx&author=xx&category=xx
  return request.get(`/api/categories?${qs.stringify(params)}`); // 返回一个Promise对象
}

export async function addCategory(params: CategoryType) {
  return request.post(`/api/categories`, params);
}

export async function deleteCategory(id: string) {
  return request.delete(`/api/categories/${id}`);
}

export async function getCategoryDetail(id: string) {
  return request.get(`/api/categories/${id}`);
}

export async function updateCategory(id: string, params: CategoryType) {
  return request.put(`/api/categories/${id}`, params);
}
