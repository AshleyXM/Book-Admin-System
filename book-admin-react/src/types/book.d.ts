export interface BookQueryType {
  name?: string;
  author?: string;
  category?: number;
  current?: number;
  pageSize?: number;
  all?: boolean; // 当设置了all参数说明要查询所有的书籍，不做分页
}

export interface BookType {
  _id: string;
  name: string;
  author: string;
  category: number;
  cover: string;
  publishedAt: number;
  stock: number;
  description: string;
}
