import { z } from 'zod';

import { Role } from '@/generated/prisma/client';
import { passwordSchema, phoneSchema } from '@/lib/validation/auth';

export const createUserSchema = z.object({
  name: z.string().trim().min(1, 'Name is required.').max(120, 'Name is too long.'),
  phone: phoneSchema,
  password: passwordSchema,
  role: z.enum(Role).default(Role.CASHIER),
});

export type CreateUserInput = z.infer<typeof createUserSchema>;
