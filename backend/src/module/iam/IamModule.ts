import { Module } from '@nestjs/common';
import { UserController } from './controller/UserController';
import { Argon2PasswordEncryptionProvider } from './service/EncryptionService';

@Module({
	providers: [Argon2PasswordEncryptionProvider],
	controllers: [UserController],
})
export class IamModule {}
