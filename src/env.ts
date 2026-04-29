import {z} from "zod";
import { en } from "zod/locales";

const envSchema = z.object({
    NODE_ENV: z.enum(['development', 'production', 'test']).default('development'),
    PORT: z.coerce.number().int().positive().default(3333),
    HOST: z.string().default('0.0.0.0'),

    DATABASE_URL: z.url(),

    JWT_SECRET: z.string().min(1, 'JWT_SECRET is required'),
    COOKIE_SECRET: z.string().min(1, 'COOKIE_SECRET is required'),

    JWT_ACCESS_EXPIRATION_IN: z.string().default('15m'),
    JWT_REFRESH_EXPIRATION_IN: z.string().default('7d'),

    COOKIE_ACCESS_MAX_AGE: z.coerce.number().int().positive().default(60 * 15), // 15 minutes
    COOKIE_REFRESH_MAX_AGE: z.coerce.number().int().positive().default(60 * 60 * 24 * 7), // 7 days

    CORS_ORIGIN: z.string().default('*'),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error('❌ Invalid environment variables:', parsed.error.format());
    process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;