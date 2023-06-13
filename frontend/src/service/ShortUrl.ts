import {
	ApiClientError,
	ApiErrorType,
	type ResourceAlreadyExists,
	type ResourceNotFound,
	type UnauthorizedError,
} from '@/error/api';
import { apiEndpoint, type ResultType } from './common';

export interface ShortUrlResource {
	readonly slug: string;
	readonly long_url: string;
	readonly active: boolean;
	readonly expires: Date | null;
	readonly access: number;
	readonly creator_id: string | null;
	readonly created: Date;
	readonly updated: Date;
}

export interface CreateShortUrlData {
	long_url: string;
	expires: Date | null;
}

export type CreateShortUrlResponse =
	| ResultType<'SUCCESS', ShortUrlResource>
	| ResultType<'RESOURCE_ALREADY_EXISTS', ResourceAlreadyExists>
	| ResultType<'UNAUTHORIZED', UnauthorizedError>;

export async function createShortUrl(
	data: CreateShortUrlData,
	token: string | null = null
): Promise<CreateShortUrlResponse> {
	const headers = new Headers();
	headers.set('Content-Type', 'application/json');
	headers.set('Accept', 'application/json');
	if (token) {
		headers.set('Authentication', 'Bearer ' + token);
	}

	const request = new Request(apiEndpoint('/short_url/url'), {
		keepalive: true,
		method: 'POST',
		headers,
		body: JSON.stringify(data),
	});

	const response = await fetch(request);
	const resData = await response.json();

	if (response.status === 201) {
		return { type: 'SUCCESS', value: resData };
	}

	if (response.status === 401) {
		return { type: 'UNAUTHORIZED', value: resData };
	}

	if (response.status === 400) {
		return { type: 'RESOURCE_ALREADY_EXISTS', value: resData };
	}

	throw new ApiClientError(ApiErrorType.UnknownResponse, resData);
}

export type GetShortUrlResponse =
	| ResultType<'SUCCESS', ShortUrlResource>
	| ResultType<'NOT_FOUND', ResourceNotFound>;

export async function getShortUrl(slug: string): Promise<GetShortUrlResponse> {
	const headers = new Headers();
	headers.set('Accept', 'application/json');

	const request = new Request(apiEndpoint('/short_url/url/' + slug), {
		keepalive: true,
		method: 'GET',
		headers,
	});

	const response = await fetch(request);
	const resData = await response.json();

	if (response.status === 200) {
		return { type: 'SUCCESS', value: resData };
	}

	if (response.status === 404) {
		return { type: 'NOT_FOUND', value: resData };
	}

	throw new ApiClientError(ApiErrorType.UnknownResponse, resData);
}

export function makeShortUrlRedirectLink(slug: string): string {
	return import.meta.env.APP_SHORT_URL_REDIRECT_ENDPOINT + '/' + slug;
}
