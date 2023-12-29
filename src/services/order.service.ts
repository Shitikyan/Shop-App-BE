import { Response, Request } from 'express';
import { ObjectId } from 'mongodb';
import logger from '../main';
import UserModel from '../models/user.model';
import OrderModel from '../models/order.model';
import ProductModel from '../models/product.model';
import { ErrorMessage } from '../util/error/errorMessages';
import { HttpStatusCodes } from '../util/constants/httpStatusCode';
import { SuccessMessage } from '../util/success/successMessages';

export const order = async (req: Request, res: Response) => {
  const { user, name, telephone, address, city, country, province, postcode } =
    req.body;
  const userObjectId = new ObjectId(user.id);

  try {
    const instance = await UserModel.findById(userObjectId, [
      'purchasedProducts',
    ]).exec();

    if (!instance) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.data_not_found });
    }

    instance.purchasedProducts;

    const payload = {
      name,
      telephone,
      address,
      city,
      country,
      province,
      postcode,
      user: userObjectId,
      purchasedProducts: instance.purchasedProducts,
    };

    for (const purchasedProduct of instance.purchasedProducts) {
      const product = await ProductModel.findById(purchasedProduct.product);

      if (product) {
        const sizeIndex = product.sizes.findIndex(
          (s) => s.size === purchasedProduct.size
        );

        if (sizeIndex !== -1) {
          product.sizes[sizeIndex].count = Math.max(
            0,
            product.sizes[sizeIndex].count - purchasedProduct.count
          );

          await product.save();
        }
      }
    }

    const order = new OrderModel(payload);
    instance.purchasedProducts = [];
    await order.save();
    await instance.save();

    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, message: SuccessMessage.SUCCESS });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};
