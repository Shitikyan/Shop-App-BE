import mongoose, { Document, Schema } from 'mongoose';
import {
  ValidProductColors,
  ValidProductSizes,
  ValidProductTypes,
  validProductColors,
  validProductSizes,
  validProductTypes,
  ValidProductBrands,
  validProductBrands,
} from '../util/constants/constant-variables';

interface ISizes {
  size: ValidProductSizes;
  count: number;
}

export interface IProduct extends Document {
  name: string;
  type: ValidProductTypes;
  price: number;
  color: ValidProductColors;
  sizes: ISizes[];
  brand: ValidProductBrands | null;
  description: string | null;
  similarProducts: mongoose.Schema.Types.ObjectId[];
  createdAt?: string;
  updatedAt?: string;
  __v?: number;
}

const productSchema = new Schema(
  {
    name: String,
    type: {
      type: String,
      enum: validProductTypes,
    },
    price: Number,
    brand: {
      type: String,
      enum: validProductBrands,
      required: false,
    },
    description: {
      type: String,
      required: false,
    },
    productsCollection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ProductCollection',
      required: false,
    },

    color: {
      type: String,
      enum: validProductColors,
    },
    sizes: [
      {
        size: {
          type: String,
          enum: validProductSizes,
          required: true,
        },
        count: {
          type: Number,
          required: true,
        },
      },
    ],
    images: [
      {
        type: String,
      },
    ],
  },
  { timestamps: true }
);

const ProductModel = mongoose.model<IProduct>('Product', productSchema);
export default ProductModel;
