/******************************************************************************/

import { locationColors, locationIcons } from '@inventory/location-styles';
import { z } from 'zod';
import { apiListResponseSchema, apiObjectResponseSchema, nanoidRegex } from './api';

/******************************************************************************/

// Extract the names of the colors and icons to create Zod enums. This ensures
// that the schema is always in sync with the available styles.
const colorNames = locationColors;
const iconNames = locationIcons.map(icon => icon.name);

// Define the Zod schema for a single inventory location.
const inventoryLocationSchema = z.object({
  id: z.string().regex(nanoidRegex, 'Invalid nanoid format'),
  name: z.string(),
  description: z.string(),
  color: z.enum(colorNames).optional(),
  icon: z.enum(iconNames).optional(),
});

// Schema for API responses that return a list of inventory locations
export const inventoryLocationsSchema = apiListResponseSchema.extend({
  data: z.array(inventoryLocationSchema),
});

// Schema for API responses that return a single inventory location object
export const inventoryLocationApiResponseSchema = apiObjectResponseSchema.extend({
  data: inventoryLocationSchema,
});

/******************************************************************************/
