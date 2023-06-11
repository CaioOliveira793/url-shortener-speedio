import { Module } from '@nestjs/common';
import { UserController } from './controller/UserController';
import { Argon2PasswordEncryptionProvider } from './service/EncryptionService';
import { SlugGenerationProvider } from '../url/service/SlugGenerationService';

@Module({
	providers: [Argon2PasswordEncryptionProvider, SlugGenerationProvider],
	controllers: [UserController],
})
export class IamModule {}
