import { ApiClientError, ApiErrorType } from '@/error/api';
import { isValid as isValidDate, parseISO as parseDateISO8601 } from 'date-fns';

export function apiEndpoint(path: string): string {
	return import.meta.env.APP_API_ADDRESS + path;
}

export type ResultType<Descriminant, Type> = {
	type: Descriminant;
	value: Type;
};

export type ResponseResult<Ok, Err> =
	| ResultType<true, Ok>
	| ResultType<false, Err>;

export function jsonParceReviver(_key: string, value: unknown): unknown | Date {
	if (typeof value !== 'string') return value;
	const date = parseDateISO8601(value);
	if (!isValidDate(date)) return value;
	return date;
}

export async function parseJsonFromResponse(response: Response): Promise<any> {
	const str = await response.text();
	try {
		return JSON.parse(str, jsonParceReviver);
	} catch (err: unknown) {
		throw new ApiClientError(
			ApiErrorType.InvalidResponseBody,
			str,
			err as Error
		);
	}
}
