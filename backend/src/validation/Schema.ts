import { z } from 'zod';

const ULID_LENGTH = 26;

const ULID_REGEX = /^\d{10}[\dABCDEFGHJKMNPQRSTVWXYZ]{16}$/;

export const UlidSchema = z.string().length(ULID_LENGTH).regex(ULID_REGEX);
