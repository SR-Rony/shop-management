import { z } from 'zod';

/**
 * E.164-style phone numbers, e.g. +8801700000000. Phone numbers are the login
 * identifier, so they must be unique and used consistently.
 */
export const phoneSchema = z
  .string()
  .trim()
  .regex(/^\+[1-9]\d{7,14}$/, 'Phone must be in E.164 format, e.g. +8801700000000.');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters.')
  .max(128, 'Password must be at most 128 characters.');

export const loginSchema = z.object({
  phone: phoneSchema,
  password: z.string().min(1, 'Password is required.').max(128),
});

export type LoginInput = z.infer<typeof loginSchema>;
