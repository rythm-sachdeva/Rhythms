import {z} from "zod";

export const videoSchema = z.object({
  id: z.string(),
  title: z.string(),
  thumbnail: z.object({
      thumbnails: z.array(
        z.object({
          url: z.string().url(),
          width: z.number().optional(),
          height: z.number().optional(),
        })
      ).optional(),
    }).optional(),
  channel: z.object({
      name: z.string().optional(),
    }).optional(),
  url: z.string().url(),
});