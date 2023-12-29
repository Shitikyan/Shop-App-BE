import { Router } from 'express';
import validator, { RequestPart } from '../../middleware/validation.middleware';
import {
  signup,
  signin,
  signout,
  getOwnData,
  addToCard,
  removeFromCard,
  getCardData,
} from '../../services/user.service';
import { addToCardSchema, loginSchema, removeCardSchema, signupSchema } from '../../util/schemas/user-schema';
import authenticateToken from '../../middleware/auth.middleware';

const router = Router();

router.post('/signup', validator(signupSchema, RequestPart.BODY), signup);
router.post('/signin', validator(loginSchema, RequestPart.BODY), signin);
router.post('/signout', authenticateToken, signout);
router.get('/getOwnData', authenticateToken, getOwnData);
router.get('/getCardData', authenticateToken, getCardData);
router.post(
  '/addToCard',
  validator(addToCardSchema, RequestPart.BODY),
  authenticateToken,
  addToCard
);
router.put(
  '/removeFromCard',
  validator(removeCardSchema, RequestPart.BODY),
  authenticateToken,
  removeFromCard
);

export default router;
