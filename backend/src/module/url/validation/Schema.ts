import { isBefore } from 'date-fns';
import { z } from 'zod';

const SLUG_REGEX = /^[\da-zA-Z-_]{1,26}$/;

export const SlugSchema = z.string().min(1).max(16).regex(SLUG_REGEX);

export const CreateShortUrlSchema = z.object({
	long_url: z.string().url(),
	expires: z
		.date()
		.refine(date => isBefore(new Date(), date), {
			path: [],
			message: 'Expiration time already reached',
		})
		.nullable(),
	slug: SlugSchema.nullable(),
});
