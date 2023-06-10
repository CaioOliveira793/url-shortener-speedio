import { ulid } from 'ulid';
import { Entity, EntityID } from '@/module/base/Entity';
import { PasswordEncryptionService } from '@/module/iam/service/EncryptionService';

export interface UserState {
	name: string;
	email: string;
	passwordHash: string;
	lastAuth: Date;
	created: Date;
	updated: Date;
	version: number;
}

export interface CreateUserData {
	name: string;
	email: string;
	plainTextPassword: string;
}

export class User extends Entity<UserState> {
	public static async create(
		data: CreateUserData,
		encryptionService: PasswordEncryptionService
	): Promise<User> {
		const passwordHash = await encryptionService.hash(data.plainTextPassword);
		const now = new Date();

		return new User(ulid(), {
			name: data.name,
			email: data.email,
			passwordHash,
			lastAuth: now,
			created: now,
			updated: now,
			version: 1,
		});
	}

	public static restore(state: UserState, id: EntityID): User {
		return new User(id, state);
	}

	public get name() {
		return this.state.name;
	}
	public get email() {
		return this.state.email;
	}
	public get passwordHash() {
		return this.state.passwordHash;
	}
	public get lastAuth() {
		return this.state.lastAuth;
	}
	public get created() {
		return this.state.created;
	}
	public get updated() {
		return this.state.updated;
	}
	public get version() {
		return this.state.version;
	}
}
