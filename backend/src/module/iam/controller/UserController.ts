import {
	Body,
	Controller,
	HttpCode,
	HttpStatus,
	Inject,
	Post,
} from '@nestjs/common';
import { ResourceAlreadyExists } from '@/exception/resource/ResourceAlreadyExists';
import { CreateUserData, User } from '@/module/iam/entity/User';
import {
	PASSWORD_ENCRYPTION_PROVIDER,
	PasswordEncryptionService,
	TOKEN_ENCRYPTION_PROVIDER,
	TokenEncryptionService,
} from '@/module/iam/service/EncryptionService';
import { AuthResponse, makeUserResource } from '@/module/iam/dto/Resource';
import {
	USER_REPOSITORY_PROVIDER,
	UserRepository,
} from '@/module/iam/service/UserRepository';
import { Token } from '@/module/iam/type/Token';

@Controller('user')
export class UserController {
	constructor(
		@Inject(PASSWORD_ENCRYPTION_PROVIDER)
		private readonly passwordEncryption: PasswordEncryptionService,
		@Inject(TOKEN_ENCRYPTION_PROVIDER)
		private readonly tokenEncryption: TokenEncryptionService,
		@Inject(USER_REPOSITORY_PROVIDER)
		private readonly userRepository: UserRepository
	) {}

	@Post()
	@HttpCode(HttpStatus.CREATED)
	public async createUser(@Body() data: CreateUserData): Promise<AuthResponse> {
		const existentUser = await this.userRepository.findByEmail(data.email);
		if (existentUser) {
			throw new ResourceAlreadyExists('Resource already exists', [
				{
					resource_type: 'USER',
					key: 'email:' + data.email,
					path: '.email',
				},
			]);
		}

		const user = await User.create(data, this.passwordEncryption);
		const token = await Token.new(user.id, this.tokenEncryption);

		await this.userRepository.insert(user);

		return { token: token.toString(), user: makeUserResource(user) };
	}
}
