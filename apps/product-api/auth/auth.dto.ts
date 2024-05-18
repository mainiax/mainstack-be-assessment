import Joi from "joi";

export const loginDto = Joi.object().keys({
  email: Joi.string().trim().required(),
  password: Joi.string().trim().required(),
});
