import { isBefore } from 'date-fns';
import { ZodType, z } from 'zod';
import { PrimitiveValidationConfig } from './ZodHelper';
import { maxOfNChars, minOfNChars } from '@/text/ValidationMessage';
import type { CreateShortUrlData } from '@/service/ShortUrl';

const SLUG_REGEX = /^[\da-zA-Z-_]{1,26}$/;
const SLUG_MIN_LENGTH = 1;
const SLUG_MAX_LENGTH = 1;

export const SlugSchema = z
	.string(PrimitiveValidationConfig)
	.min(SLUG_MIN_LENGTH, { message: minOfNChars(SLUG_MIN_LENGTH) })
	.max(SLUG_MAX_LENGTH, { message: maxOfNChars(SLUG_MAX_LENGTH) })
	.regex(SLUG_REGEX);

export const CreateShortUrlSchema = z.object({
	long_url: z
		.string(PrimitiveValidationConfig)
		.url({ message: 'url inválida' }),
	expires: z
		.date(PrimitiveValidationConfig)
		.refine(date => isBefore(new Date(), date), {
			path: [],
			message: 'tempo de expiração já atingido',
		})
		.nullable()
		.default(null), // FIXME: zod default does not works
}) as ZodType<CreateShortUrlData>;
