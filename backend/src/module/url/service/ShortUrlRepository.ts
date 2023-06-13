import { uniqueConstraintViolationMessage } from '@/exception/Message';
import { ShortUrl, ShortUrlState } from '@/module/url/entity/ShortUrl';
import { Injectable, Optional, Provider } from '@nestjs/common';

export interface ShortUrlRepository {
	insert(shortUrl: ShortUrl): Promise<void>;
	find(slug: string): Promise<ShortUrl | null>;
	listByCreator(creatorId: string): Promise<ShortUrl[]>;
}

export const SHORT_URL_REPOSITORY_PROVIDER =
	'URL/SHORT_URL_REPOSITORY_PROVIDER';

@Injectable()
export class ShortUrlMemRepository implements ShortUrlRepository {
	protected readonly shortUrls: Map<string, ShortUrlState>;

	public constructor(
		@Optional() shortUrls: Map<string, ShortUrlState> = new Map()
	) {
		this.shortUrls = shortUrls;
	}

	public async insert(shortUrl: ShortUrl): Promise<void> {
		if (this.shortUrls.get(shortUrl.slug)) {
			throw new Error(ShortUrlMemRepository.UNIQUE_ID_MESSAGE);
		}

		this.shortUrls.set(shortUrl.slug, shortUrl.internalState());
	}

	public async find(slug: string): Promise<ShortUrl | null> {
		const state = this.shortUrls.get(slug);
		if (!state) return null;

		return ShortUrl.restore(slug, state);
	}

	public async listByCreator(userId: string): Promise<ShortUrl[]> {
		const shortUrls = [];

		for (const [id, state] of this.shortUrls) {
			if (state.creatorId === userId) {
				shortUrls.push(ShortUrl.restore(id, structuredClone(state)));
			}
		}

		return shortUrls;
	}

	private static readonly UNIQUE_ID_MESSAGE =
		uniqueConstraintViolationMessage('unique_id');
}

export const ShortUrlRepositoryProvider: Provider<ShortUrlRepository> = {
	provide: SHORT_URL_REPOSITORY_PROVIDER,
	useClass: ShortUrlMemRepository,
};
