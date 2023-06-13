import type { ApiError, ResourceLocation } from './common';

export interface ResourceNotFound extends ApiError {
	readonly error: 'NOT_FOUND';
	readonly status: 404;
	readonly resources: ResourceLocation[];
}

export interface ResourceAlreadyExists extends ApiError {
	readonly error: 'RESOURCE_ALREADY_EXISTS';
	readonly status: 400;
	readonly resources: ResourceLocation[];
}

export interface ConflictError extends ApiError {
	readonly error: 'CONFLICT';
	readonly status: 409;
	readonly resources: ResourceLocation[];
}

export const enum AuthenticationType {
	InvalidCredential = 'INVALID_CREDENTIAL',
	InvalidPassword = 'INVALID_PASSWORD',
	InvalidRole = 'INVALID_ROLE',
	RetryExceeded = 'RETRY_EXCEEDED',
}

export interface AuthenticationError extends ApiError {
	readonly error: 'AUTHENTICATION';
	readonly status: 401;
	readonly type: AuthenticationType;
	readonly path: string | null;
}

export const enum UnauthorizedType {
	InvalidAuthorization = 'INVALID_AUTHORIZATION',
	TokenNotPresent = 'TOKEN_NOT_PRESENT',
	MalformattedToken = 'MALFORMATTED_TOKEN',
	InvalidToken = 'INVALID_TOKEN',
}

export interface UnauthorizedError extends ApiError {
	readonly error: 'UNAUTHORIZED';
	readonly status: 401;
	readonly type: UnauthorizedType;
}

export const enum ForbiddenErrorType {
	AccessDenied = 'ACCESS_DENIED',
}

export interface ForbiddenError extends ApiError {
	readonly error: 'FORBIDDEN';
	readonly status: 403;
	readonly type: ForbiddenErrorType;
}

export const enum ApiErrorType {
	UnknownResponse = 'UNKNOWN_RESPONSE',
}

export class ApiClientError extends Error {
	public readonly type: ApiErrorType;
	public readonly data: unknown;

	constructor(type: ApiErrorType, data?: unknown) {
		super('API Client error: ' + ApiClientError.messageFromApiErrorType(type));
		this.type = type;
		this.data = data;
	}

	public static messageFromApiErrorType(type: ApiErrorType): string {
		switch (type) {
			case ApiErrorType.UnknownResponse:
				return 'unknown response type';
			default:
				return '';
		}
	}
}
