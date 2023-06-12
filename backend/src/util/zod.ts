import { ParseParams, SafeParseReturnType, Schema } from 'zod';

export interface Validator<Output> {
	parse(
		data: unknown,
		params?: Partial<ParseParams>
	): SafeParseReturnType<Output, Output>;
	parseAsync(
		data: unknown,
		params?: Partial<ParseParams>
	): Promise<SafeParseReturnType<Output, Output>>;
}

export function zodSchema<Output>(schema: Schema<Output>): Validator<Output> {
	return { parse: schema.safeParse, parseAsync: schema.safeParseAsync };
}
