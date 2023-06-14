import { isValid as isValidDate, parseISO as parseDateISO8601 } from 'date-fns';

export function jsonParceReviver(_key: string, value: unknown): unknown | Date {
	if (typeof value !== 'string') return value;
	const date = parseDateISO8601(value);
	if (!isValidDate(date)) return value;
	return date;
}

export function jsonDeserializer<T = unknown>(str: string): T {
	return JSON.parse(str, jsonParceReviver);
}

export function jsonSerializer<T = unknown>(str: T): string {
	return JSON.stringify(str);
}
