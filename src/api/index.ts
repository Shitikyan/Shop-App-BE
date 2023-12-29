import { Express } from 'express';
import user from './user/user.api';
import product from './product/product.api';
import productsCollection from './productCollection/productCollection.api';
import payment from './payment/payment.api';
import order from './order/order.api';

export const apiV1 = (app: Express): void => {
  app.use('/user', user);
  app.use('/product', product);
  app.use('/product-collection', productsCollection);
  app.use('/payment', payment);
  app.use('/order', order);
};
