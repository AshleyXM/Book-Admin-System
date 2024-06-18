import { USER_ROLE, USER_SEX, USER_STATUS } from "@/constant/user";

export interface UserQueryType {
  name?: string;
  status?: USER_STATUS;
  current?: number;
  pageSize?: number;
  all?: boolean;
}

export interface UserType {
  _id: string;
  account: string;
  name: string;
  password: string;
  status: USER_STATUS;
  sex: USER_SEX;
  role: USER_ROLE;
}
