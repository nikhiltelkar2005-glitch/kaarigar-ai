import { z } from 'zod';

export const updateArtisanSchema = z.object({
  body: z.object({
    fullName: z.string().min(2).optional(),
    businessName: z.string().min(2).optional(),
    craftType: z
      .enum([
        'WEAVING_HANDLOOM', 'POTTERY_CERAMICS', 'WOODWORK_CARVING',
        'METAL_CRAFT', 'LEATHER_CRAFT', 'EMBROIDERY_TEXTILE',
        'JEWELRY_ORNAMENTS', 'PAINTING_FOLK_ART', 'STONE_CARVING',
        'BAMBOO_CANE_CRAFT', 'OTHER',
      ])
      .optional(),
    bio:             z.string().max(500).optional(),
    story:           z.string().max(3000).optional(),
    experienceYears: z.number().int().min(0).max(80).optional(),
    city:            z.string().optional(),
    state:           z.string().optional(),
    pincode:         z.string().regex(/^\d{6}$/).optional(),
    address:         z.string().max(300).optional(),
    upiId:           z.string().regex(/^[\w.\-+]+@[\w]+$/).optional(),
  }),
});

export type UpdateArtisanInput = z.infer<typeof updateArtisanSchema>['body'];

