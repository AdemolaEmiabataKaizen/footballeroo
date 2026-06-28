import dotenv from 'dotenv';

dotenv.config();

export const env = {
  // Server
  PORT: parseInt(process.env.PORT || '4000', 10),
  NODE_ENV: process.env.NODE_ENV || 'development',
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:3000',

  // Database
  DATABASE_URL: process.env.DATABASE_URL || 'postgresql://localhost:5432/footballeroo',

  // Redis
  REDIS_URL: process.env.REDIS_URL || 'redis://localhost:6379',

  // OpenAI
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',

  // Auth
  JWT_SECRET: process.env.JWT_SECRET || 'dev-secret-change-in-production',
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'dev-secret-change-in-production',

  // External APIs
  FOOTBALL_API_KEY: process.env.FOOTBALL_API_KEY || '',

  // Feature Flags
  MOCK_FOOTBALL_DATA: process.env.MOCK_FOOTBALL_DATA !== 'false', // Default true for dev
} as const;

export function validateEnv(): void {
  const required: (keyof typeof env)[] = [];

  if (env.NODE_ENV === 'production') {
    required.push('JWT_SECRET', 'DATABASE_URL');
  }

  const missing = required.filter((key) => !env[key]);
  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(', ')}`,
    );
  }
}
