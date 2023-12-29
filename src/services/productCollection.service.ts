import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import logger from '../main';
import ProductCollectionModel from '../models/productCollection.module';


import { ErrorMessage } from '../util/error/errorMessages';
import { HttpStatusCodes } from '../util/constants/httpStatusCode';

export const getProductCollection = async (req: Request, res: Response) => {
  const { name } = req.params;

  try {
    const collection = await ProductCollectionModel.findOne({
        name
    }).populate('products').exec();

    if (!collection) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.data_not_found });
    }

    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, data: collection });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

