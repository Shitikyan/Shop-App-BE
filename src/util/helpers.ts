import { Model, Document, Query, PopulateOptions } from "mongoose";
import { PaginationResult } from './types';
import env from "./constants/env";

type PopulateFields = string | PopulateOptions | (string | PopulateOptions)[];

export async function paginate<T extends Document>(
  model: Model<T>,
  page: number,
  perPage: number,
  payload: Record<string, unknown> = {},
  populateFields: PopulateFields,
  sortOptions: Record<string, "asc" | "desc"> = {}
): Promise<PaginationResult<T>> {
  const perPageNumber = perPage ? perPage : Number(env.DEFAULT_PAGINATION_NUMBER);
  const skip = (page - 1) * perPageNumber;
  let query: Query<T[], T> = model
    .find(payload)
    .skip(skip)
    .limit(perPageNumber)
    .populate(populateFields as string);

  if (Object.keys(sortOptions).length > 0) {
    query = query.sort(sortOptions);
  }

  const results = await query.exec();
  const total = await model.countDocuments(payload).exec();
  const totalPages = Math.ceil(total / perPageNumber);

  return {
    page: page,
    perPage: perPageNumber,
    total: total,
    totalPages: totalPages,
    data: results,
  };
}
