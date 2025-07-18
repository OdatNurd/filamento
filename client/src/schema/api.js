/******************************************************************************/

import { z } from 'zod';

/******************************************************************************/

export const nanoidRegex = /^[0-9a-zA-Z_-]{22}$/;

export const baseApiResponseSchema = z.object({
  success: z.boolean(),
  message: z.string(),
});

export const apiListResponseSchema = baseApiResponseSchema.extend({
  data: z.array(z.object({})),
});

export const apiObjectResponseSchema = baseApiResponseSchema.extend({
  data: z.object({}),
});

/******************************************************************************/
