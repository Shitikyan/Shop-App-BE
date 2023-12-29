import mongoose, { Document, Schema } from 'mongoose';

export interface IProductCollection extends Document {
  name: string;
  products: mongoose.Schema.Types.ObjectId[];
}

const productCollectionSchema = new Schema(
  {
    name: String,
    products: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
      },
    ],
  },
  { timestamps: true }
);

const ProductCollectionModel = mongoose.model<IProductCollection>('ProductCollection', productCollectionSchema);
export default ProductCollectionModel;
