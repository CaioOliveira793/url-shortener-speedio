import { z } from 'zod';

const SLUG_REGEX = /^[\da-zA-Z-_]{1,26}$/;

export const SlugSchema = z.string().min(1).max(16).regex(SLUG_REGEX);
