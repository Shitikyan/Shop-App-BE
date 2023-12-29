import Joi from "joi";
import { sortOrderValues,validProductTypes } from '../constants/constant-variables';

export const getFilteredProductsSchema = Joi.object({
    page: Joi.number().integer().positive().required(),
    perPage: Joi.number().integer().positive().required(),
    min:Joi.number().integer().positive().allow(0),
    max:Joi.number().integer().positive().greater(Joi.ref('min')),
    sizes: Joi.string(),
    colors:Joi.string(),
    brands:Joi.string(),
    sortOrder:Joi.string().valid(...sortOrderValues),
    type:Joi.string().valid(...validProductTypes),
  });