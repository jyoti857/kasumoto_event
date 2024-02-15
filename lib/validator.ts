import * as z from 'zod'

export const eventformSchema = z.object({
  title: z.string().min(3, "Title must be at least 3 characters!").max(30, 'Title should be at max of 30 characters'),
  description: z.string().min(3, "Description must be at least 3 characters").max(400, 'Description should be at max of 400 characters!'),
  location: z.string().min(3, 'Location must be at least 3 characters').max(400, 'Location must be at max of 400 characters!'),
  imageUrl: z.string(),
  startDateTime: z.date(),
  endDateTime: z.date(),
  categoryId: z.string(),
  price: z.string(),
  isFree: z.boolean(),
  url: z.string().url(),
});