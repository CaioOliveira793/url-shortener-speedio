import { User } from '@/module/iam/entity/User';

export interface UserResource {
	id: string;
	name: string;
	email: string;
	last_auth: Date;
	created: Date;
	updated: Date;
}

export function makeUserResource(user: User): UserResource {
	return {
		id: user.id,
		name: user.name,
		email: user.email,
		last_auth: user.lastAuth,
		created: user.created,
		updated: user.updated,
	};
}
