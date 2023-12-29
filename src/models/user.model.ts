import mongoose, { Document, Schema } from 'mongoose';
import { IProduct } from './product.model';

export interface IPurchasedProduct {
  product: IProduct;
  count: number;
  size: string;
}

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  createdAt?: string;
  updatedAt?: string;
  purchasedProducts: IPurchasedProduct[];
  __v?: number;
}

const userSchema = new Schema(
  {
    username: String,
    password: String,
    email: String,
    signupTimestamp: String,
    purchasedProducts: [{
      _id: false,
      product: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
      },
      count: {
        type: Number,
        required: true,
      },
      size: {
        type: String,
        required: true,
      },
    }],
  },
  { timestamps: true }
);

const UserModel = mongoose.model<IUser>('User', userSchema);
export default UserModel;
