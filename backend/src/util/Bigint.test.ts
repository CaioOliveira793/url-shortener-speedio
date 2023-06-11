import { describe, it } from 'node:test';
import assert from 'node:assert';
import { bigintFromUint8Array, bigintIntoUint8Array } from './Bigint';

describe('bigint', () => {
	it('transform byte array to bigint', () => {
		const testSample = [
			[new Uint8Array([255]), 255n],
			[new Uint8Array([255, 255]), 65535n],
			[new Uint8Array([255, 255, 255, 255]), 4294967295n],
			[new Uint8Array([73, 223, 19, 57]), 1239356217n],
		] as const;

		for (const [input, expected] of testSample) {
			const big = bigintFromUint8Array(input);

			assert.deepStrictEqual(big, expected);
		}
	});

	it('byte array to bigint and reverse', () => {
		const testSample = [
			new Uint8Array([255]),
			new Uint8Array([255, 255]),
			new Uint8Array([255, 255, 255, 255]),
			new Uint8Array([73, 223, 19, 57]),
		] as const;

		for (const input of testSample) {
			const big = bigintFromUint8Array(input);

			assert.deepStrictEqual(bigintIntoUint8Array(big), input);
		}
	});
});
