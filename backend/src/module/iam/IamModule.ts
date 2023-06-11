import { Module } from '@nestjs/common';
import { UserController } from './controller/UserController';
import { Argon2PasswordEncryptionProvider } from './service/EncryptionService';
import { SlugGenerationProvider } from '../url/service/SlugGenerationService';
import { UserRepositoryProvider } from './service/UserRepository';

@Module({
	providers: [
		Argon2PasswordEncryptionProvider,
		SlugGenerationProvider,
		UserRepositoryProvider,
	],
	controllers: [UserController],
})
export class IamModule {}
