import { describe, it } from 'node:test';
import assert from 'node:assert';
import { encode, decode } from '@/util/SlugCodec';

describe('util:SlugCodec', () => {
	it('basic encode and decode', () => {
		const inputs = [
			'00112233',
			'eom34@24n*f0293n/',
			'o2n3d0n02093',
			'&*0302n0n🙂23fn',
		];

		for (const input of inputs) {
			const output = decode(encode(Buffer.from(input, 'utf-8')));

			assert.deepStrictEqual(Buffer.from(output).toString('utf-8'), input);
		}
	});
});
