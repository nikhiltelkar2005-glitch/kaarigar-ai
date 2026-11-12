import { z } from 'zod';

// ─── Register ─────────────────────────────────────────────────────────────────

export const registerSchema = z.object({
  body: z.object({
    email: z.string().email('Enter a valid email address.'),
    password: z
      .string()
      .min(8, 'Password must be at least 8 characters.')
      .regex(/[A-Za-z]/, 'Password must contain at least one letter.')
      .regex(/[0-9]/, 'Password must contain at least one number.'),
    phone: z
      .string()
      .regex(/^[6-9]\d{9}$/, 'Enter a valid 10-digit Indian mobile number.')
      .optional(),
    fullName: z.string().min(2, 'Full name is required.'),
    businessName: z.string().min(2, 'Workshop / business name is required.'),
    craftType: z
      .enum([
        'WEAVING_HANDLOOM',
        'POTTERY_CERAMICS',
        'WOODWORK_CARVING',
        'METAL_CRAFT',
        'LEATHER_CRAFT',
        'EMBROIDERY_TEXTILE',
        'JEWELRY_ORNAMENTS',
        'PAINTING_FOLK_ART',
        'STONE_CARVING',
        'BAMBOO_CANE_CRAFT',
        'OTHER',
      ])
      .default('WEAVING_HANDLOOM'),
    city: z.string().optional(),
    state: z.string().optional(),
    pincode: z
      .string()
      .regex(/^\d{6}$/, 'Pincode must be 6 digits.')
      .optional(),
  }),
});

// ─── Login ────────────────────────────────────────────────────────────────────

export const loginSchema = z.object({
  body: z.object({
    identifier: z
      .string()
      .min(1, 'Email or phone number is required.'),
    password: z.string().min(1, 'Password is required.'),
  }),
});

// ─── Refresh ──────────────────────────────────────────────────────────────────

export const refreshSchema = z.object({
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required.'),
  }),
});

// ─── Inferred Types ───────────────────────────────────────────────────────────

export type RegisterInput = z.infer<typeof registerSchema>['body'];
export type LoginInput = z.infer<typeof loginSchema>['body'];
export type RefreshInput = z.infer<typeof refreshSchema>['body'];

