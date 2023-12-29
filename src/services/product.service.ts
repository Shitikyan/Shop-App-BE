import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import logger from '../main';
import ProductModel from '../models/product.model';
import { ErrorMessage } from '../util/error/errorMessages';
import { HttpStatusCodes } from '../util/constants/httpStatusCode';
import { paginate } from '../util/helpers';
import { SortOrderValues } from '../util/constants/constant-variables';
import { SortOrderFilter } from '../util/types';

export const getProduct = async (req: Request, res: Response) => {
  const { id } = req.params;
  const objectId = new ObjectId(id);

  try {
    const product = await ProductModel.findOne({
      _id: objectId,
    }).exec();


    if (!product) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.data_not_found });
    }

    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, data: product });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

export const getProducts = async (req: Request, res: Response) => {
  const { page, perPage, min, max, sizes, colors, brands, sortOrder, type } =
    req.query;
  try {
    const sortOrderFilter: SortOrderFilter = {};
    const filter: Record<string, unknown> = {};
    if (min && max) {
      filter.price = {
        $gte: Number(min),
        $lte: Number(max),
      };
    }

    if(type){
      filter.type = type
    }

    if (brands && typeof brands === 'string') {
      const brandsArray = brands.split(',');
      filter.brand = {
        $in: brandsArray,
      };
    }

    if (colors && typeof colors === 'string') {
      const colorsArray = colors.split(',');
      filter.color = {
        $in: colorsArray,
      };
    }

    if (sizes && typeof sizes === 'string') {
      const sizesArray = sizes.split(',');
      filter.sizes = {
        $elemMatch: { size: { $in: sizesArray }, count: { $gte: 0 } },
      };
    } else {
      filter.sizes = {
        $elemMatch: { count: { $gte: 0 } },
      };
    }
    if (sortOrder && sortOrder === SortOrderValues.DESC) {
      sortOrderFilter.createdAt = SortOrderValues.DESC;
    }

    const products = await paginate(
      ProductModel,
      Number(page),
      Number(perPage),
      filter,
      '',
      {}
    );

    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, data: products });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};
