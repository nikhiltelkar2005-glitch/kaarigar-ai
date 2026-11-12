import 'dotenv/config';
import { z } from 'zod';

const schema = z.object({
  PORT: z
    .string()
    .default('5000')
    .transform((v) => parseInt(v, 10)),
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  DATABASE_URL: z.string().min(1, 'DATABASE_URL is required'),
  JWT_ACCESS_SECRET: z
    .string()
    .min(16, 'JWT_ACCESS_SECRET must be at least 16 characters'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(16, 'JWT_REFRESH_SECRET must be at least 16 characters'),
  JWT_ACCESS_EXPIRY: z.string().default('15m'),
  JWT_REFRESH_EXPIRY: z.string().default('7d'),
  CLIENT_ORIGIN: z.string().default('*'),
  GEMINI_API_KEY: z.string().optional(),
});

const result = schema.safeParse(process.env);

if (!result.success) {
  console.error('❌  Invalid environment variables:');
  console.error(JSON.stringify(result.error.flatten().fieldErrors, null, 2));
  process.exit(1);
}

export const env = result.data;

