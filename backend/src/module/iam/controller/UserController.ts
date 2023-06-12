import { Controller, Get, Inject } from '@nestjs/common';
import { User } from '@/module/iam/entity/User';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
} from '@/module/iam/service/EncryptionService';
import { UserResource, makeUserResource } from '@/module/iam/dto/Resource';

@Controller('user')
export class UserController {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly passwordEncryption: PasswordEncryptionService
	) {}

	@Get()
	async getLoggedUser(): Promise<UserResource> {
		const user = await User.create(
			{
				name: 'Fake User',
				email: 'fake.user@email.com',
				plainTextPassword: '12345678',
			},
			this.passwordEncryption
		);

		return makeUserResource(user);
	}
}
