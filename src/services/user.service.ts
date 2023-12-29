import { Response, Request, NextFunction } from 'express';
import { ObjectId } from 'mongodb';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import logger from '../main';
import UserModel from '../models/user.model';
import env from '../util/constants/env';
import { ErrorMessage } from '../util/error/errorMessages';
import { HttpStatusCodes } from '../util/constants/httpStatusCode';
import { SuccessMessage } from '../util/success/successMessages';

export const signup = async (req: Request, res: Response) => {
  const { username, password, email } = req.body;
  try {
    const instance = await UserModel.find(
      {
        email: email,
      },
      ['email']
    ).exec();

    if (instance.length) {
      return res
        .status(HttpStatusCodes.CONFLICT)
        .json({ error: ErrorMessage.existingUser });
    } else if (instance.length === 0) {
      const salt = await bcrypt.genSalt();
      const hashedPassword = await bcrypt.hash(password, salt);

      const payload = {
        username,
        email,
        password: hashedPassword,
      };

      const userModel = new UserModel(payload);

      const user = await userModel.save();
      const accessToken = jwt.sign({ id: user.id }, env.ACCESS_TOKEN_SECRET);

      return res
        .cookie('token', accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          domain: env.DOMAIN,
        })
        .status(HttpStatusCodes.CREATED)
        .json({
          message: SuccessMessage.SIGNUP,
          success: true,
        });
    }
  } catch (error) {
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

export const signin = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;

  try {
    const user = await UserModel.findOne({ email }).exec();

    if (!user) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.wrongCredentials });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (isPasswordValid) {
      const accessToken = jwt.sign({ id: user.id }, env.ACCESS_TOKEN_SECRET);

      return res
        .cookie('token', accessToken, {
          httpOnly: true,
          secure: true,
          sameSite: 'strict',
          path: '/',
          domain: env.DOMAIN,
        })
        .status(HttpStatusCodes.OK)
        .json({
          message: SuccessMessage.SUCCESS,
          success: true,
        });
    } else {
      logger.warn(`Invalid password for user ${email}`);
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.wrongCredentials });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

export const signout = (req: Request, res: Response) => {
  try {
    res.clearCookie('token', {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      domain: env.DOMAIN,
    });

    logger.info('User signed out');
    return res
      .status(HttpStatusCodes.OK)
      .json({ message: SuccessMessage.SIGNOUT, success: true });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

export const getOwnData = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const userObjectId = new ObjectId(user.id);

    const instance = await UserModel.findById(userObjectId, [
      'email',
      'username',
    ]).exec();

    if (instance) {
      return res
        .status(HttpStatusCodes.OK)
        .json({ data: instance, success: true });
    } else {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.userNotFound });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

export const getCardData = async (req: Request, res: Response) => {
  try {
    const { user } = req.body;
    const userObjectId = new ObjectId(user.id);

    const instance = await UserModel.findById(userObjectId, [
      'purchasedProducts',
    ])
      .populate('purchasedProducts.product')
      .exec();

    if (instance) {
      return res
        .status(HttpStatusCodes.OK)
        .json({ data: instance, success: true });
    } else {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.userNotFound });
    }
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

export const addToCard = async (req: Request, res: Response) => {
  try {
    const { user, product, count, size } = req.body;
    const userObjectId = new ObjectId(user.id);

    const instance = await UserModel.findById(userObjectId)
      .populate('purchasedProducts.product')
      .exec();

    if (!instance) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.userNotFound });
    }
    const boughtProduct = instance.purchasedProducts.find(
      (value) => value.product._id == product
    );
    if (boughtProduct && size === boughtProduct.size) {
      const newCount = count + boughtProduct.count;
      const totalCount = boughtProduct.product.sizes.find(
        (value) => value.size == size
      );

      if (totalCount?.count && totalCount?.count >= newCount) {
        boughtProduct.count = newCount;
      }else{
        return res
        .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
        .json({ error: ErrorMessage.unsavedData });
      }
      instance.save();
    } else {
      instance.purchasedProducts.push({ product, count, size });
      instance.save();
    }

    return res
      .status(HttpStatusCodes.OK)
      .json({ message: SuccessMessage.SUCCESS, success: true });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};

export const removeFromCard = async (req: Request, res: Response) => {
  try {
    const { user,id, size} = req.body;
    const userObjectId = new ObjectId(user.id);
    const productObjectId = new Object(id);

    const result = await UserModel.updateOne(
      { _id: userObjectId },
      { $pull: { purchasedProducts: { product: productObjectId ,size}} }
    );

    if (result.modifiedCount === 0) {
      return res
        .status(HttpStatusCodes.NOT_FOUND)
        .json({ error: ErrorMessage.data_not_found });
    }

    return res
      .status(HttpStatusCodes.OK)
      .json({ message: SuccessMessage.SUCCESS, success: true });
  } catch (error) {
    logger.error(error);
    return res
      .status(HttpStatusCodes.INTERNAL_SERVER_ERROR)
      .json({ error: ErrorMessage.internalError });
  }
};


