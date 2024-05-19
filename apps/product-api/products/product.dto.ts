import Joi from "joi";

export const createProductDto = Joi.object().keys({
  name: Joi.string().trim().required(),
  price: Joi.number().min(0).required(),
  category: Joi.string().trim().required(),
  description: Joi.string().trim().optional(),
  stock: Joi.number().min(0).default(0).required(),
  image: Joi.object({
    originalname: Joi.string().required(),
    mimetype: Joi.string().valid("image/jpeg", "image/png").required(),
    size: Joi.number().max(2000000).required().messages({
      "number.max": "image size must be less than or equal to 2 MB",
    }),
  }).required().unknown(true),
});

export const updateProductDto = Joi.object()
  .keys({
    name: Joi.string().trim(),
    price: Joi.number().min(0),
    category: Joi.string().trim(),
    description: Joi.string().trim().optional(),
    stock: Joi.number().min(0),
    image: Joi.object({
      originalname: Joi.string().required(),
      mimetype: Joi.string().valid("image/jpeg", "image/png").required(),
      size: Joi.number().max(2000000).required().messages({
        "number.max": "image size must be less than or equal to 2 MB",
      }),
    }).unknown(true),
  })
  .or("name", "price", "category", "description", "stock", "image");
