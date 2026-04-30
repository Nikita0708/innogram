import Joi from 'joi';

export const loginSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(6).required().messages({
    'string.min': 'Password must be at least 6 characters',
    'any.required': 'Password is required',
  }),
});

export const registerSchema = Joi.object({
  email: Joi.string().email().required().messages({
    'string.email': 'Invalid email format',
    'any.required': 'Email is required',
  }),
  password: Joi.string().min(8).required().messages({
    'string.min': 'Password must be at least 8 characters',
    'any.required': 'Password is required',
  }),
  username: Joi.string().min(3).max(30).required().messages({
    'string.min': 'Username must be at least 3 characters',
    'string.max': 'Username must be 30 characters or less',
    'any.required': 'Username is required',
  }),
  display_name: Joi.string().min(1).max(100).required().messages({
    'any.required': 'Display name is required',
  }),
  birthday: Joi.string()
    .pattern(/^\d{4}-\d{2}-\d{2}$/)
    .required()
    .messages({
      'string.pattern.base': 'Birthday must be in YYYY-MM-DD format',
      'any.required': 'Birthday is required',
    }),
  bio: Joi.string().max(1000).optional().allow(''),
  avatar_url: Joi.string().uri().max(500).optional().allow(''),
});

export const refreshTokenSchema = Joi.object({
  refreshToken: Joi.string().required().messages({
    'any.required': 'refreshToken is required',
  }),
});

export const validateTokenSchema = Joi.object({
  accessToken: Joi.string().required().messages({
    'any.required': 'accessToken is required',
  }),
});

export const oauthExchangeSchema = Joi.object({
  code: Joi.string().required().messages({
    'any.required': 'code is required',
  }),
  provider: Joi.string().valid('google').required().messages({
    'any.only': 'Unsupported provider',
    'any.required': 'provider is required',
  }),
});
