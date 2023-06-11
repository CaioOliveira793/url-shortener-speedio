import { bigintIntoUint8Array, bigintFromUint8Array } from '@/util/Bigint';

const CHARSET: readonly string[] =
	'0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-_'.split('');
const CHARSET_LENGTH = 64;

function encodeBase10(num: bigint): string {
	if (num === 0n) {
		return CHARSET[0];
	}

	let res = '';
	let remainder = num;
	while (remainder > 0) {
		res = res + CHARSET[Number(remainder % BigInt(CHARSET_LENGTH))];
		remainder = remainder / BigInt(CHARSET_LENGTH); // floor
	}
	return res;
}

function charToRemainder(str: string, index: number): number {
	const char = str.charCodeAt(index);

	if (char >= 48 && char <= 57) {
		return char - 48; // 0-9
	} else if (char >= 65 && char <= 90) {
		return char - 65 + 10; // A-Z
	} else if (char >= 97 && char <= 122) {
		return char - 97 + 10 + 26; // a-z
	} else if (char === 45) {
		return 62; // -
	} else if (char === 95) {
		return 63; // _
	} else {
		throw new Error(
			'InvalidEncoding error: received a char code not available in the charset'
		);
	}
}

/**
 * Decodes the provided input string.
 *
 * @param str Encoded input
 * @returns The decoded output as `Uint8Array`
 */
export function decode(str: string): Uint8Array {
	const length = str.length;
	let result = 0n;
	let base = 1n;

	for (let i = 0; i < length; i++) {
		const remainder = BigInt(charToRemainder(str, i));
		result += remainder * base;
		base *= BigInt(CHARSET_LENGTH);
	}

	// TODO: verify host endianess
	return bigintIntoUint8Array(result).reverse();
}

export function encode(buffer: Uint8Array): string {
	const big = bigintFromUint8Array(buffer);
	const slug = encodeBase10(big);
	return slug;
}
