import { ApiClientError, ApiErrorType } from '@/error/api';
import { jsonDeserializer } from '@/util/serde';

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

export async function parseJsonFromResponse(response: Response): Promise<any> {
	const str = await response.text();
	try {
		return jsonDeserializer(str);
	} catch (err: unknown) {
		throw new ApiClientError(
			ApiErrorType.InvalidResponseBody,
			str,
			err as Error
		);
	}
}
