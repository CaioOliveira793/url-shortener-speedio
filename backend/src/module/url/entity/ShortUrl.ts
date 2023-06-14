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
	longUrl: string;
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
	creatorId: EntityID | null;
	/**
	 * Short url creation time
	 */
	created: Date;
	/**
	 * Short url last updated time
	 */
	updated: Date;
	/**
	 * Short url version
	 */
	version: number;
}

export interface CreateShortUrlData {
	long_url: string;
	expires: Date | null;
}

export class ShortUrl extends Entity<ShortUrlState> {
	public static async create(
		data: CreateShortUrlData,
		creatorId: string | null,
		slugService: SlugGenerationService
	): Promise<ShortUrl> {
		const slug = await slugService.generate(data.long_url);
		const now = new Date();

		return new ShortUrl(ulid(), {
			slug,
			longUrl: data.long_url,
			active: true,
			expires: data.expires,
			access: 0,
			creatorId,
			created: now,
			updated: now,
			version: 1,
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

	public incrementAccess(increment = 1): number {
		this.state.access += increment;
		return this.state.access;
	}

	public get slug() {
		return this.state.slug;
	}
	public get longUrl() {
		return this.state.longUrl;
	}
	public get active() {
		return this.state.active;
	}
	public get expires() {
		return this.state.expires;
	}
	public get access() {
		return this.state.access;
	}
	public get creatorId() {
		return this.state.creatorId;
	}
	public get created() {
		return this.state.created;
	}
	public get updated() {
		return this.state.updated;
	}
}
