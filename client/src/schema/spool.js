/******************************************************************************/

import { z } from 'zod';
import { apiListResponseSchema, apiObjectResponseSchema, nanoidRegex } from './api';

/******************************************************************************/

// Regular expression to validate a hex color code.
const hexColorRegex = /^#([0-9A-F]{3}){1,2}$/i;

// Define the Zod schema for a single spool.
const spoolSchema = z.object({
  id: z.string().regex(nanoidRegex, 'Invalid nanoid format'),
  locationId: z.string().regex(nanoidRegex, 'Invalid nanoid format').optional(),
  vendor: z.string(),
  colorName: z.string(),
  color: z.string().regex(hexColorRegex, 'Invalid hex color format'),
  material: z.string(),
  totalWeight: z.number(),
  currentWeight: z.number(),
  emptySpoolWeight: z.number(),
  spoolWeightAdjustment: z.number(),
  filamentWeight: z.number(),
});

// Schema for API responses that return a list of spools
export const spoolsSchema = apiListResponseSchema.extend({
  data: z.array(spoolSchema),
});

// Schema for API responses that return a single spool object
export const spoolApiResponseSchema = apiObjectResponseSchema.extend({
  data: spoolSchema,
});

/******************************************************************************/
