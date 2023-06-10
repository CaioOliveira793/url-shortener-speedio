import { randomBytes } from 'node:crypto';
import { default as argon2 } from 'argon2';
import { Injectable, Provider } from '@nestjs/common';

export interface PasswordEncryptionService {
	hash(plainTextPassword: string): Promise<string>;
	compare(hash: string, plainTextPassword: string): Promise<boolean>;
}

export const PASSWORD_ENCRYPTION_PROVIDER = 'IAM/PASSWORD_ENCRYPTION_PROVIDER';

const enum Argon2AlgorithmType {
	ARGON2D = 0,
	ARGON2I = 1,
	ARGON2ID = 2,
}

@Injectable()
export class Argon2PasswordEncryptionService
	implements PasswordEncryptionService
{
	public async hash(plainText: string): Promise<string> {
		const salt = randomBytes(Argon2PasswordEncryptionService.SALT_LENGTH);
		return argon2.hash(plainText, {
			salt,
			saltLength: Argon2PasswordEncryptionService.SALT_LENGTH,
			hashLength: Argon2PasswordEncryptionService.HASH_LENGTH,
			memoryCost: Argon2PasswordEncryptionService.MEMORY_COST,
			timeCost: Argon2PasswordEncryptionService.TIME_COST,
			parallelism: Argon2PasswordEncryptionService.PARALLELISM,
			version: Argon2PasswordEncryptionService.ALGORITHM_VERSION,
			type: Argon2PasswordEncryptionService.TYPE,
		});
	}

	public async compare(hash: string, plainText: string): Promise<boolean> {
		return argon2.verify(hash, plainText);
	}

	private static readonly SALT_LENGTH = 16;
	private static readonly HASH_LENGTH = 32;
	private static readonly MEMORY_COST = 19_456;
	private static readonly TIME_COST = 2;
	private static readonly PARALLELISM = 1;
	private static readonly ALGORITHM_VERSION = 13;
	private static readonly TYPE = Argon2AlgorithmType.ARGON2ID;
}

export const Argon2PasswordEncryptionProvider: Provider<PasswordEncryptionService> =
	{
		provide: PASSWORD_ENCRYPTION_PROVIDER,
		useClass: Argon2PasswordEncryptionService,
	};
