import { ConflictError } from '@/exception/resource/ConflictError';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { EntityID } from '@/module/base/Entity';
import { User, UserState } from '@/module/iam/entity/User';
import { Provider } from '@nestjs/common';

interface RepositoryOption {
	optimisticLock: boolean;
}

const DefaultRepositoryOptions: RepositoryOption = { optimisticLock: true };

export interface UserRepository {
	find(id: EntityID): Promise<User | null>;
	findByEmail(email: string): Promise<User | null>;
	update(user: User, options?: RepositoryOption): Promise<void>;
	updateLastAuth(id: string, lastAuth: Date): Promise<void>;
}

export const USER_REPOSITORY_PROVIDER = 'IAM/USER_REPOSITORY_PROVIDER';

export class UserMemRepository implements UserRepository {
	protected readonly users: Map<string, UserState>;

	public constructor(users: Map<string, UserState> = new Map()) {
		this.users = users;
	}

	public async find(id: string): Promise<User | null> {
		const state = this.users.get(id);
		if (state) {
			return User.restore(id, structuredClone(state));
		}
		return null;
	}

	public async findByEmail(email: string): Promise<User | null> {
		for (const [id, state] of this.users.entries()) {
			if (state.email === email) {
				return User.restore(id, structuredClone(state));
			}
		}
		return null;
	}

	public async update(
		user: User,
		options: RepositoryOption = DefaultRepositoryOptions
	): Promise<void> {
		const state = this.users.get(user.id);
		if (!state) {
			throw new ResourceNotFound('User not found error', [
				{
					key: 'id:' + user.id,
					path: null,
					resource_type: 'USER',
				},
			]);
		}

		if (!options.optimisticLock) {
			this.users.set(user.id, user.internalState());
			return;
		}

		if (state.version + 1 === user.version) {
			this.users.set(user.id, user.internalState());
		} else {
			throw new ConflictError('User conflict error', [
				{
					key: 'id:' + user.id,
					path: null,
					resource_type: 'USER',
				},
			]);
		}
	}

	/**
	 * Update user last authentication time.
	 */
	public async updateLastAuth(id: string, lastAuth: Date): Promise<void> {
		const state = this.users.get(id);

		if (!state) {
			throw new ResourceNotFound('User not found error', [
				{
					key: 'id:' + id,
					path: null,
					resource_type: 'USER',
				},
			]);
		}

		state.lastAuth = lastAuth;
	}
}

export const UserRepositoryProvider: Provider<UserRepository> = {
	provide: USER_REPOSITORY_PROVIDER,
	useClass: UserMemRepository,
};
