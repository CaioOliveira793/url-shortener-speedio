import { z } from 'zod';
import { PrimitiveValidationConfig } from './ZodHelper';
import {
	hasInvalidChars,
	maxOfNChars,
	minOfNChars,
} from '@/text/ValidationMessage';

const USER_NAME_MIN_LENGTH = 3;
const USER_NAME_MAX_LENGTH = 255;

const UserNameSchema = z
	.string(PrimitiveValidationConfig)
	.min(USER_NAME_MIN_LENGTH, { message: minOfNChars(USER_NAME_MIN_LENGTH) })
	.max(USER_NAME_MAX_LENGTH, { message: maxOfNChars(USER_NAME_MAX_LENGTH) });

const EmailSchema = z
	.string(PrimitiveValidationConfig)
	.email({ message: 'e-mail inválido' });

const PASSWORD_REGEX = /^[a-zA-Z\d !"#$%&'()*+,-./:;<=>?@[\]\\^_`{}|~]+$/;
const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_LENGTH = 255;

const PasswordSchema = z
	.string(PrimitiveValidationConfig)
	.min(PASSWORD_MIN_LENGTH, { message: minOfNChars(PASSWORD_MIN_LENGTH) })
	.max(PASSWORD_MAX_LENGTH, { message: maxOfNChars(PASSWORD_MAX_LENGTH) })
	.regex(PASSWORD_REGEX, { message: hasInvalidChars('senha') });

export const UserCredentialSchema = z.object({
	email: EmailSchema,
	password: PasswordSchema,
});

export const CreateUserSchema = z.object({
	name: UserNameSchema,
	email: EmailSchema,
	password: PasswordSchema,
});
