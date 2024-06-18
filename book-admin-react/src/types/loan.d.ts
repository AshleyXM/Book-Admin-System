import { BookType } from "./book";

export interface LoanQueryType {
  name?: string;
  status?: string;
  borrower?: string;
  current?: number;
  pageSize?: number;
}

export interface LoanType {
  _id: string;
  book: BookType;
  user: UserType;
  status: "on" | "off";
  loanedAt: number;
  returnedAt: number;
}
