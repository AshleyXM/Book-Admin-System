import { LoanQueryType, LoanType } from "@/types";
import qs from "qs";
import request from "@/utils/request";

export async function getLoanList(params?: LoanQueryType) {
  // https://apifoxmock.com/m1/4562274-4210740-default/api/loans?name=xx&author=xx&category=xx
  return request.get(`/api/loans?${qs.stringify(params)}`); // 返回一个Promise对象
}

export async function addLoan(params: LoanType) {
  return request.post(`/api/loans`, params);
}

export async function deleteLoan(id: string) {
  return request.delete(`/api/loans/${id}`);
}

export async function updateLoan(id: string, params: Partial<LoanType>) {
  return request.put(`/api/loans/${id}`, params);
}
