export function bigintFromUint8Array(buffer: Uint8Array): bigint {
	let res = 0n;
	for (const [index, byte] of buffer.reverse().entries()) {
		res |= BigInt(byte) << (BigInt(index) * 8n);
	}
	return res;
}

export function bigintIntoUint8Array(num: bigint): Uint8Array {
	const res: number[] = [];
	let remainder = num;

	while (remainder > 0n) {
		res.push(Number(remainder & 255n));
		remainder = remainder >> 8n;
	}

	return new Uint8Array(res);
}
