import { Router } from 'express';
import authenticateToken from '../../middleware/auth.middleware';
import { getConfig, createPaymentIntent } from '../../services/payment.service';

const router = Router();

router.get('/config', authenticateToken, getConfig);
router.post('/create-payment-intent', authenticateToken, createPaymentIntent);

export default router;
