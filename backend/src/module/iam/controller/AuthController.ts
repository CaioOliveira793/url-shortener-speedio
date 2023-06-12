import { Body, Controller, Inject, Post, UseGuards } from '@nestjs/common';
import { UserCredentialGuard } from '@/guard/UserCredentialGuard';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
	TOKEN_ENCRYPTION_PROVIDER,
	TokenEncryptionService,
} from '@/module/iam/service/EncryptionService';
import {
	USER_REPOSITORY_PROVIDER,
	UserRepository,
} from '@/module/iam/service/UserRepository';
import { Token } from '@/module/iam/type/Token';
import {
	AuthResponse,
	UserCredential,
	makeUserResource,
} from '@/module/iam/dto/Resource';

@Controller('auth')
export class AuthController {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly passwordEncryption: PasswordEncryptionService,
		@Inject(TOKEN_ENCRYPTION_PROVIDER)
		private readonly tokenEncryption: TokenEncryptionService,
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepo: UserRepository
	) {}

	@Post()
	@UseGuards(UserCredentialGuard)
	async authenticate(
		@Body() credential: UserCredential
	): Promise<AuthResponse | void> {
		const user = await this.userRepo.findByEmail(credential.email);
		if (!user) {
			throw new ResourceNotFound('User not found error', [
				{
					resource_type: 'USER',
					key: 'email:' + credential.email,
					path: '.email',
				},
			]);
		}

		const error = await user.makeAuthentication(
			credential.password,
			this.passwordEncryption
		);
		if (error) throw error;

		await this.userRepo.updateLastAuth(user.id, user.lastAuth);

		const token = await Token.new(user.id, this.tokenEncryption);
		return { token: token.toString(), user: makeUserResource(user) };
	}
}
