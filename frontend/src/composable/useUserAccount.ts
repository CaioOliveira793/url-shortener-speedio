import { defineStore } from 'pinia';
import { useStorage, type RemovableRef } from '@vueuse/core';
import { useRouter, type NavigationFailure } from 'vue-router';
import { AppPath } from '@/config/router';
import type {
	AuthenticateUserResponse,
	CreateUserData,
	CreateUserResponse,
	UserCredential,
	UserResource,
} from '@/service/Iam';
import { authenticateUser, createUser } from '@/service/Iam';
import { jsonDeserializer, jsonSerializer } from '@/util/serde';

export const USER_ACCOUNT_KEY = 'user_account';
const USER_ACCOUNT_STORAGE_KEY = 'user_account';

export interface UserAccountState {
	token: string;
	user: UserResource;
}

export interface UseUserAccountReturn {
	state: RemovableRef<UserAccountState | null>;

	/**
	 * Authenticate the user updating the current user account.
	 * @param credential User credential
	 */
	authenticate(credential: UserCredential): Promise<AuthenticateUserResponse>;

	/**
	 * Create a new account setting as the current user account.
	 */
	createAccount(data: CreateUserData): Promise<CreateUserResponse>;

	/**
	 * Sign out exiting the user session and navigating to the login page.
	 */
	signOut(redirectPath?: string): Promise<void | NavigationFailure>;
}

function useUserAccountComposable(): UseUserAccountReturn {
	const state = useStorage<UserAccountState | null>(
		USER_ACCOUNT_STORAGE_KEY,
		null,
		globalThis.localStorage,
		{
			writeDefaults: true,
			serializer: { read: jsonDeserializer, write: jsonSerializer },
		}
	);

	const router = useRouter();

	async function authenticate(
		credential: UserCredential
	): Promise<AuthenticateUserResponse> {
		const result = await authenticateUser(credential);

		if (result.type === 'SUCCESS') {
			state.value = result.value;
		} else {
			state.value = null;
		}

		return result;
	}

	async function createAccount(
		data: CreateUserData
	): Promise<CreateUserResponse> {
		const result = await createUser(data);

		if (result.type === 'SUCCESS') {
			state.value = result.value;
		}

		return result;
	}

	async function signOut(): Promise<void | NavigationFailure> {
		state.value = null;
		return router.push({ path: AppPath.SignIn, replace: false });
	}

	return { state, authenticate, createAccount, signOut };
}

export const useUserAccount = defineStore<
	typeof USER_ACCOUNT_KEY,
	UseUserAccountReturn
>(USER_ACCOUNT_KEY, useUserAccountComposable);
