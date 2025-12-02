export type GetAllDataResponse<T> = {
  data: T;
  total: number;
  limit: number;
  offset: number;
};

export type QueryDataParams = {
  limit?: number;
  offset?: number;
  search?: string;
  [key: string]: unknown;
};
