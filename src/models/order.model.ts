import mongoose, { Document, Schema } from 'mongoose';

export interface IOrder extends Document {
  name: string;
  telephone: string;
  address: string;
  city: string;
  country: string;
  province: string;
  postcode: string;
  user: mongoose.Schema.Types.ObjectId;
  products: mongoose.Schema.Types.ObjectId[];
}

const orderSchema = new Schema(
  {
    name: String,
    telephone: String,
    address: String,
    city: String,
    country: String,
    province: String,
    postcode: String,
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    purchasedProducts: [
      {
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
      },
    ],
  },
  { timestamps: true }
);

const OrderModel = mongoose.model<IOrder>(
  'OrderCollection',
  orderSchema
);
export default OrderModel;
