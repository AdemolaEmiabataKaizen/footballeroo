import rateLimit from 'express-rate-limit';
import { API_CONFIG } from '@footballeroo/shared';

export const generalLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: API_CONFIG.RATE_LIMIT_PER_MINUTE,
  message: {
    success: false,
    error: 'Too many requests, please try again later.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

export const generationLimiter = rateLimit({
  windowMs: 60 * 1000,
  max: API_CONFIG.GENERATION_RATE_LIMIT_PER_MINUTE,
  message: {
    success: false,
    error: 'Generation rate limit exceeded. Please wait before generating more dishes.',
  },
  standardHeaders: true,
  legacyHeaders: false,
});
