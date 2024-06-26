import { Module } from '@nestjs/common';
import { UserController } from './controller/UserController';
import {
	Argon2EncryptionProvider,
	JWTEncryptionProvider,
} from './service/EncryptionService';
import { SlugGenerationProvider } from '../url/service/SlugGenerationService';
import { UserRepositoryProvider } from './service/UserRepository';
import { JWTService } from './service/JWTService';
import { AuthController } from './controller/AuthController';
import { AuthService } from './service/AuthService';

@Module({
	providers: [
		JWTService,
		Argon2EncryptionProvider,
		JWTEncryptionProvider,
		SlugGenerationProvider,
		UserRepositoryProvider,
		AuthService,
	],
	controllers: [AuthController, UserController],
	exports: [AuthService],
})
export class IamModule {}
