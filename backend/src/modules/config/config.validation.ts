import * as Joi from 'joi';

export const configValidationSchema = Joi.object({
  NODE_ENV: Joi.string()
    .valid('development', 'production', 'test')
    .default('development'),
  PORT: Joi.number().port().default(3000),
  BASE_URL: Joi.string().uri().optional(),
  DATABASE_URL: Joi.string().required(),

  THROTTLE_TTL: Joi.number().positive().default(60000),
  THROTTLE_LIMIT: Joi.number().positive().default(100),
  CREATE_URL_LIMIT: Joi.number().positive().default(50),
  REDIRECT_LIMIT: Joi.number().positive().default(200),
  STATS_LIMIT: Joi.number().positive().default(100),

  SLUG_LENGTH: Joi.number().positive().default(6),
  MAX_SLUG_LENGTH: Joi.number().positive().default(20),
  MIN_SLUG_LENGTH: Joi.number().positive().default(4),

  CORS_ORIGINS: Joi.string().default('*'),
  JWT_SECRET: Joi.string().min(32).default('stoik'),

  LOG_LEVEL: Joi.string()
    .valid('error', 'warn', 'info', 'debug', 'verbose')
    .default('info'),
});
