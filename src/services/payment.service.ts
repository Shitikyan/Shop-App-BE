import { Response, Request } from 'express';
import logger from '../main';
import { ErrorMessage } from '../util/error/errorMessages';
import { ObjectId } from 'mongodb';
import { HttpStatusCodes } from '../util/constants/httpStatusCode';
import env from '../util/constants/env';
import stripe from 'stripe';
import UserModel from '../models/user.model';

export const getConfig = async (req: Request, res: Response) => {
  try {
    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, data: env.STRIPE_PUBLISHABLE_KEY });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

export const createPaymentIntent = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const userObjectId = new ObjectId(user.id);
    let total = 0;

    const instance = await UserModel.findById(userObjectId, [
      'purchasedProducts',
    ])
      .populate('purchasedProducts.product')
      .exec();

    if (instance) {
      total = instance.purchasedProducts.reduce(
        (accumulator, currentValue) =>
          accumulator + currentValue.product.price * currentValue.count,
        total
      );
    }

    const stripObject = new stripe(env.STRIPE_SECRET_KEY, {
      apiVersion: '2023-10-16',
    });

    const paymentIntent = await stripObject.paymentIntents.create({
      currency: 'EUR',
      amount: total,
      automatic_payment_methods: { enabled: true },
    });

    return res
      .status(HttpStatusCodes.OK)
      .json({ success: true, data: paymentIntent.client_secret });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};
