import { CanActivate, ExecutionContext } from '@nestjs/common';
import {
	AuthenticationError,
	AuthenticationType,
} from '@/exception/security/AuthenticationError';
import { Request } from '@/http/types';
import { UserCredentialSchema } from '@/module/iam/validation/Schema';

export class UserCredentialGuard implements CanActivate {
	public async canActivate(context: ExecutionContext): Promise<boolean> {
		const request = context.switchToHttp().getRequest<Request>();

		const result = UserCredentialSchema.safeParse(request.body);
		if (!result.success) {
			throw new AuthenticationError(
				'Invalid credential',
				AuthenticationType.InvalidCredential
			);
		}

		return true;
	}
}
