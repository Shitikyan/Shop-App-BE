import Joi from 'joi';

export const getProductsCollectionSchema = Joi.object({
  name: Joi.string().min(3).max(10).required(),
});
