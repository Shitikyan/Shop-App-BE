import Joi from "joi";
import { validProductSizes } from '../constants/constant-variables';

export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .max(25)
    .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/, "password")
    .required(),
});


  export const signupSchema = Joi.object({
    username:Joi.string().alphanum().min(3).max(10).required(),
    email: Joi.string().email().required(),
    password: Joi.string()
      .min(8)
      .max(25)
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%#*?&])[A-Za-z\d@$!%#*?&]{8,}$/, "password")
      .required(),
  });

  export const addToCardSchema = Joi.object({
    product:Joi.string().hex().length(24).required(),
    count:Joi.number().positive().required(),
    size:Joi.string().valid(...validProductSizes).required(),
  });

  export const removeCardSchema = Joi.object({
    id: Joi.string().hex().length(24).required(),
    size:Joi.string().valid(...validProductSizes).required(),
  });
