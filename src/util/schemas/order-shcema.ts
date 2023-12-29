import Joi from 'joi';

export const getOrderSchema = Joi.object({
  name: Joi.string(),
  telephone: Joi.string(),
  address: Joi.string(),
  city: Joi.string(),
  country: Joi.string(),
  province: Joi.string(),
  postcode: Joi.string(),
});
