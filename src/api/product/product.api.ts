import { Router } from 'express';
import validator, { RequestPart } from '../../middleware/validation.middleware';
import { getProduct, getProducts } from '../../services/product.service';
import {
  checkDataIdSchema,
} from '../../util/schemas/schema';
import { getFilteredProductsSchema } from '../../util/schemas/product-schema';

const router = Router();

router.get(
  '/get-product/:id',
  validator(checkDataIdSchema, RequestPart.PARAMS),
  getProduct
);

router.get(
  '/get-products',
  validator(getFilteredProductsSchema, RequestPart.QUERY),
  getProducts
);

export default router;
