import { Body, Controller, Get, Inject, Post, UseGuards } from '@nestjs/common';
import { UserCredentialGuard } from '@/guard/UserCredentialGuard';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { User } from '@/module/iam/entity/User';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
} from '@/module/iam/service/EncryptionService';
import {
	UserResource,
	makeUserResource,
} from '@/module/iam/resource/UserResource';
import { UserCredential } from '@/module/iam/dto/UserCredential';
import {
	USER_REPOSITORY_PROVIDER,
	UserRepository,
} from '@/module/iam/service/UserRepository';

@Controller('user')
export class UserController {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly encryptionService: PasswordEncryptionService,
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepo: UserRepository
	) {}

	@Get()
	async getLoggedUser(): Promise<UserResource> {
		const user = await User.create(
			{
				name: 'Fake User',
				email: 'fake.user@email.com',
				plainTextPassword: '12345678',
			},
			this.encryptionService
		);

		return makeUserResource(user);
	}

	@Post('authentication')
	@UseGuards(UserCredentialGuard)
	async authenticate(
		@Body() credential: UserCredential
	): Promise<UserResource | void> {
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
			this.encryptionService
		);
		if (error) throw error;

		this.userRepo.updateLastAuth(user.id, user.lastAuth);

		// TODO: return authentication token
		return makeUserResource(user);
	}
}
