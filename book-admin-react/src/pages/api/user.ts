import { UserQueryType, UserType } from "@/types";
import qs from "qs";
import request from "@/utils/request";

export async function getUserList(params?: UserQueryType) {
  return request.get(`/api/users?${qs.stringify(params)}`); // 返回一个Promise对象
}

export async function addUser(params: UserType) {
  return request.post(`/api/users`, params);
}

export async function deleteUser(id: string) {
  return request.delete(`/api/users/${id}`);
}

export async function getUserDetail(id: string) {
  return request.get(`/api/users/${id}`);
}

export async function updateUser(id: string, params: Partial<UserType>) {
  return request.put(`/api/users/${id}`, params);
}

export async function login(params: Pick<UserType, "name" | "password">) {
  return request.post(`/api/users/login`, params);
}
