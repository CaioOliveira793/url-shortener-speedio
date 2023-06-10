import { Controller, Get } from '@nestjs/common';

interface User {
	id: string;
	email: string;
	password_hash: string;
	version: number;
}

@Controller('user')
export class UserController {
  @Get()
  getLoggedUser(): User {
    return {
			id: '1',
			email: 'fake.user@email.com',
			password_hash: '12345678',
			version: 1,
		};
  }
}
