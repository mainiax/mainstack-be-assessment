import { Document, FilterQuery, Schema } from "mongoose";
import { PaginationParams, PaginationResult } from "../../types";

export function paginationPlugin<T extends Document>(schema: Schema<T>) {
  schema.statics.paginate = async function (
    filter: FilterQuery<T> = {},
    paginationParams: PaginationParams = {}
  ): Promise<PaginationResult<T>> {
    let { limit = 10, page = 1 } = paginationParams;

    limit = Math.max(1, limit);
    page = Math.max(1, page);

    const count = await this.countDocuments(filter);
    const totalPages = Math.max(Math.ceil(count / limit), 1);

    const skipBy = page - 1;

    const data = await this.find(filter)
      .limit(limit)
      .skip(skipBy * limit)
      .sort([["createdAt", -1]])
      .exec();

    return {
      data,
      count: data.length,
      total: count,
      totalPages,
      currentPage: page,
    };
  };
}
