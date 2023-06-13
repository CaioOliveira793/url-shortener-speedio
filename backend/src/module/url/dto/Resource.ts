import { ShortUrl } from '../entity/ShortUrl';

export interface ShortUrlResource {
	slug: string;
	long_url: string;
	active: boolean;
	expires: Date | null;
	access: number;
	creator_id: string | null;
	created: Date;
	updated: Date;
}

export function makeShortUrlResource(entity: ShortUrl): ShortUrlResource {
	return {
		slug: entity.slug,
		long_url: entity.longUrl,
		active: entity.active,
		expires: entity.expires,
		access: entity.access,
		creator_id: entity.creatorId,
		created: entity.created,
		updated: entity.updated,
	};
}
