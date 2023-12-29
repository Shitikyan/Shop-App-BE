import { Router } from 'express';
import validator, { RequestPart } from '../../middleware/validation.middleware';
import { getProductCollection } from '../../services/productCollection.service';
import { getProductsCollectionSchema } from '../../util/schemas/product-collection-shcema';

const router = Router();

router.get(
  '/:name',
  validator(getProductsCollectionSchema, RequestPart.PARAMS),
  getProductCollection
);



export default router;
