import { SortOrderValues } from './constants/constant-variables';

export interface PaginationResult<T> {
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  data: T[];
}

export interface SortOrderFilter {
  createdAt?: SortOrderValues;
}
