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
