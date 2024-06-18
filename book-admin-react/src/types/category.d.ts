export interface CategoryQueryType {
  name?: string;
  level?: number;
  current?: number;
  pageSize?: number;
  all?: boolean; // 表示不分页，取全部数据（获取LevelOneList时）
}

export interface CategoryType {
  _id: string;
  name: string;
  level: 1 | 2;
  parent: CategoryType;
}
