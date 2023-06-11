import { createHash, randomBytes } from 'node:crypto';
import { Provider } from '@nestjs/common';
import * as slugCodec from '@/util/SlugCodec';

export interface SlugGenerationService {
	generate(long_url: string): Promise<string>;
}

export const SLUG_GENERATION_SERVICE = 'URL/SLUG_GENERATION_SERVICE';

export class RandomSlugGenerationService implements SlugGenerationService {
	public async generate(long_url: string): Promise<string> {
		const hasher = createHash('sha256');
		const rand = randomBytes(4);
		hasher.update(long_url);
		hasher.update(rand);
		const hash = hasher.digest();
		return slugCodec.encode(hash).slice(0, 6);
	}
}

export const SlugGenerationProvider: Provider<SlugGenerationService> = {
	provide: SLUG_GENERATION_SERVICE,
	useClass: RandomSlugGenerationService,
};
