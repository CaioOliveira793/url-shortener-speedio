import { ulid } from 'ulid';
import { isAfter } from 'date-fns';
import { Entity, EntityID } from '@/module/base/Entity';
import { SlugGenerationService } from '@/module/url/service/SlugGenerationService';

export interface ShortUrlState {
	/**
	 * Short Url slug and Entity ID
	 */
	slug: string;
	/**
	 * Url that the short url points to.
	 */
	long_url: string;
	active: boolean;
	/**
	 * Expiration date
	 */
	expires: Date | null;
	/**
	 * Number of access the short url has received.
	 */
	access: number;
	/**
	 * User that created the short url
	 */
	creator_id: EntityID | null;
	/**
	 * Short url creation time
	 */
	created: Date;
	/**
	 * Short url last updated time
	 */
	updated: Date;
}

export interface CreateShortUrlData {
	long_url: string;
	expires: Date | null;
	creator_id: EntityID | null;
}

export class ShortUrl extends Entity<ShortUrlState> {
	public static async create(
		data: CreateShortUrlData,
		slugService: SlugGenerationService
	): Promise<ShortUrl> {
		const slug = await slugService.generate(data.long_url);
		const now = new Date();

		return new ShortUrl(ulid(), {
			slug,
			long_url: data.long_url,
			active: true,
			expires: data.expires,
			access: 0,
			creator_id: data.creator_id,
			created: now,
			updated: now,
		});
	}

	public static restore(id: EntityID, state: ShortUrlState): ShortUrl {
		return new ShortUrl(id, state);
	}

	/**
	 * Verify if the ShortUrl is expired.
	 */
	public expired(): boolean {
		if (this.state.expires) {
			return isAfter(new Date(), this.state.expires);
		}
		return false;
	}

	/**
	 * Verify if the ShortUrl can be redirected.
	 */
	public canRedirect(): boolean {
		return this.state.active && !this.expired();
	}
}
