import { z } from 'zod';

const PASSWORD_REGEX = /^[a-zA-Z\d !"#$%&'()*+,-./:;<=>?@[\]\\^_`{}|~]+$/;

export interface UserCredential {
	email: string;
	password: string;
}

export const UserCredentialSchema = z.object({
	email: z.string().email(),
	password: z.string().min(8).max(255).regex(PASSWORD_REGEX),
});
