import { BookQueryType, BookType } from "@/types";
import qs from "qs";
import request from "@/utils/request";

export async function getBookList(params?: BookQueryType) {
  // https://apifoxmock.com/m1/4562274-4210740-default/api/books?name=xx&author=xx&category=xx
  return request.get(`/api/books?${qs.stringify(params)}`); // 返回一个Promise对象
}

export async function addBook(params: BookType) {
  return request.post(`/api/books`, params);
}

export async function deleteBook(id: string) {
  return request.delete(`/api/books/${id}`);
}

export async function getBookDetail(id: string) {
  return request.get(`/api/books/${id}`);
}

export async function updateBook(params: Partial<BookType>) {
  return request.put(`/api/books/${params._id}`, params);
}
