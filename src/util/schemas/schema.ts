import Joi from "joi";

export const getPaginatedDataSchema = Joi.object({
  page: Joi.number().integer().positive().required(),
  perPage: Joi.number().integer().positive(),
});

export const checkDataIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const searchSchema = Joi.object({
  name: Joi.string().allow(""),
  page: Joi.number().integer().positive().required(),
  perPage: Joi.number().integer().positive(),
});
