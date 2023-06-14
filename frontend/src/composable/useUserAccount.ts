import { defineStore } from 'pinia';
import { ref, type Ref } from 'vue';
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

export const ACCOUNT_STORE_KEY = 'user_account';

export interface UserAccountState {
	token: string;
	user: UserResource;
}

export interface UseUserAccountReturn {
	state: Ref<UserAccountState | null>;

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
	 * @param redirectPath pathname to redirect from the login page after a user authentication.
	 */
	signOut(redirectPath?: string): Promise<void | NavigationFailure>;
}

function useUserAccountComposable(): UseUserAccountReturn {
	const initialState: UserAccountState | null = null; // TODO: load persisted/authenticated user
	const state = ref<UserAccountState | null>(initialState);

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
	typeof ACCOUNT_STORE_KEY,
	UseUserAccountReturn
>(ACCOUNT_STORE_KEY, useUserAccountComposable);
