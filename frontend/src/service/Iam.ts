import {
	ApiClientError,
	ApiErrorType,
	type AuthenticationError,
	type ResourceAlreadyExists,
	type ResourceNotFound,
} from '@/error/api';
import { apiEndpoint, parseJsonFromResponse, type ResultType } from './common';
import type { UnauthorizedError } from '@/error/api';

export interface UserResource {
	id: string;
	name: string;
	email: string;
	last_auth: Date;
	created: Date;
	updated: Date;
}

export interface AuthResource {
	token: string;
	user: UserResource;
}

export interface CreateUserData {
	name: string;
	email: string;
	password: string;
}

export interface UserCredential {
	email: string;
	password: string;
}

export type CreateUserResponse =
	| ResultType<'SUCCESS', AuthResource>
	| ResultType<'RESOURCE_ALREADY_EXISTS', ResourceAlreadyExists>;

export async function createUser(
	data: CreateUserData
): Promise<CreateUserResponse> {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');

	const request = new Request(apiEndpoint('/iam/user'), {
		keepalive: true,
		method: 'POST',
		headers,
		body: JSON.stringify(data),
	});

	const response = await fetch(request);
	const resData = await parseJsonFromResponse(response);

	if (response.status === 201) {
		return { type: 'SUCCESS', value: resData };
	}

	if (response.status === 400) {
		return { type: 'RESOURCE_ALREADY_EXISTS', value: resData };
	}

	throw new ApiClientError(ApiErrorType.UnknownResponse, resData);
}

export type AuthenticateUserResponse =
	| ResultType<'SUCCESS', AuthResource>
	| ResultType<'NOT_FOUND', ResourceNotFound>
	| ResultType<'AUTHENTICATION', AuthenticationError>;

export async function authenticateUser(
	data: UserCredential
): Promise<AuthenticateUserResponse> {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');

	const request = new Request(apiEndpoint('/iam/auth'), {
		keepalive: true,
		method: 'POST',
		headers,
		body: JSON.stringify(data),
	});

	const response = await fetch(request);
	const resData = await parseJsonFromResponse(response);

	if (response.status === 200) {
		return { type: 'SUCCESS', value: resData };
	}

	if (response.status === 404) {
		return { type: 'NOT_FOUND', value: resData };
	}

	if (response.status === 401) {
		return { type: 'AUTHENTICATION', value: resData };
	}

	throw new ApiClientError(ApiErrorType.UnknownResponse, resData);
}

export type GetAuthenticatedUserResponse =
	| ResultType<'SUCCESS', AuthResource>
	| ResultType<'NOT_FOUND', ResourceNotFound>
	| ResultType<'UNAUTHORIZED', UnauthorizedError>;

export async function getAuthenticatedUser(
	token: string
): Promise<GetAuthenticatedUserResponse> {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');
	headers.set('Authentication', 'Bearer ' + token);

	const request = new Request(apiEndpoint('/iam/auth'), {
		keepalive: true,
		method: 'GET',
		headers,
	});

	const response = await fetch(request);
	const resData = await parseJsonFromResponse(response);

	if (response.status === 200) {
		return { type: 'SUCCESS', value: resData };
	}

	if (response.status === 404) {
		return { type: 'NOT_FOUND', value: resData };
	}

	if (response.status === 401) {
		return { type: 'UNAUTHORIZED', value: resData };
	}

	throw new ApiClientError(ApiErrorType.UnknownResponse, resData);
}
