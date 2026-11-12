import { z } from 'zod';

// ─── Supported Languages ───────────────────────────────────────────────────────

export const SUPPORTED_LANGUAGES = [
  'en',
  'hi',
  'mr',
  'bn',
  'gu',
  'ta',
  'te',
  'kn',
  'pa',
  'ml',
  'or',
] as const;

export type SupportedLanguage = (typeof SUPPORTED_LANGUAGES)[number];

const LANGUAGE_ALIASES: Record<string, SupportedLanguage> = {
  en: 'en',
  english: 'en',
  hi: 'hi',
  hindi: 'hi',
  mr: 'mr',
  marathi: 'mr',
  bn: 'bn',
  bengali: 'bn',
  gu: 'gu',
  gujarati: 'gu',
  ta: 'ta',
  tamil: 'ta',
  te: 'te',
  telugu: 'te',
  kn: 'kn',
  kannada: 'kn',
  pa: 'pa',
  punjabi: 'pa',
  ml: 'ml',
  malayalam: 'ml',
  or: 'or',
  odia: 'or',
};

/**
 * Reusable language schema.
 * Normalizes language codes/names to lowercase standard code and validates support.
 */
export const languageSchema = z
  .string({ required_error: 'Language is required.' })
  .trim()
  .min(1, 'Language cannot be empty.')
  .toLowerCase()
  .transform((val) => LANGUAGE_ALIASES[val] ?? val)
  .pipe(
    z.enum(SUPPORTED_LANGUAGES, {
      errorMap: () => ({
        message: 'Unsupported language. Supported languages include Hindi (hi) and English (en).',
      }),
    }),
  );

// ─── Craft Categories ─────────────────────────────────────────────────────────

export const CRAFT_CATEGORIES = [
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
] as const;

export type CraftCategory = (typeof CRAFT_CATEGORIES)[number];

// ─── Product Text Generation Schema ──────────────────────────────────────────

export const productTextGenerationBodySchema = z
  .object({
    productName: z
      .string()
      .trim()
      .min(2, 'Product name must be at least 2 characters.')
      .max(200, 'Product name cannot exceed 200 characters.')
      .optional(),
    description: z
      .string()
      .trim()
      .min(5, 'Product description must be at least 5 characters.')
      .max(3000, 'Product description cannot exceed 3000 characters.')
      .optional(),
    keywords: z
      .array(
        z
          .string()
          .trim()
          .min(1, 'Keyword cannot be empty.')
          .max(50, 'Keyword cannot exceed 50 characters.'),
      )
      .max(20, 'Maximum 20 keywords allowed.')
      .optional(),
    category: z.enum(CRAFT_CATEGORIES).optional(),
    targetLanguage: languageSchema,
    tone: z
      .enum(['storytelling', 'artisan', 'formal', 'promotional', 'simple'])
      .default('storytelling')
      .optional(),
  })
  .strict('Unexpected field in product generation request.')
  .refine(
    (data) =>
      Boolean(
        (data.productName && data.productName.length >= 2) ||
          (data.description && data.description.length >= 5),
      ),
    {
      message:
        'Either product name (min 2 characters) or product description (min 5 characters) must be provided.',
      path: ['description'],
    },
  );

export const productTextGenerationSchema = z.object({
  body: productTextGenerationBodySchema,
});

export type ProductTextGenerationInput = z.infer<typeof productTextGenerationBodySchema>;

// ─── Translation Schema ───────────────────────────────────────────────────────

export const translationBodySchema = z
  .object({
    sourceText: z
      .string({ required_error: 'Source text is required.' })
      .trim()
      .min(1, 'Source text cannot be empty.')
      .max(5000, 'Source text cannot exceed 5000 characters.'),
    sourceLanguage: languageSchema,
    targetLanguage: languageSchema,
  })
  .strict('Unexpected field in translation request.')
  .refine((data) => data.sourceLanguage !== data.targetLanguage, {
    message: 'Source language and target language cannot be the same.',
    path: ['targetLanguage'],
  });

export const translationSchema = z.object({
  body: translationBodySchema,
});

export type TranslationInput = z.infer<typeof translationBodySchema>;

// ─── General AI Prompt Schema ────────────────────────────────────────────────

export const generalPromptBodySchema = z
  .object({
    prompt: z
      .string({ required_error: 'Prompt is required.' })
      .trim()
      .min(1, 'Prompt cannot be empty.')
      .max(4000, 'Prompt cannot exceed 4000 characters.'),
  })
  .strict('Unexpected field in prompt request.');

export const generalPromptSchema = z.object({
  body: generalPromptBodySchema,
});

export type GeneralPromptInput = z.infer<typeof generalPromptBodySchema>;
