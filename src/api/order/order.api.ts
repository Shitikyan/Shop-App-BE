import { Router } from 'express';
import { order } from '../../services/order.service';
import { getOrderSchema } from '../../util/schemas/order-shcema';
import authenticateToken from '../../middleware/auth.middleware';
import validator, { RequestPart } from '../../middleware/validation.middleware';

const router = Router();

router.post(
  '/add-order',
  validator(getOrderSchema, RequestPart.BODY),
  authenticateToken,
  order
);

export default router;
