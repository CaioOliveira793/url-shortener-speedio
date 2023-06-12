import { describe, it } from 'node:test';
import assert from 'node:assert';
import { ulid } from 'ulid';
import { subSeconds, addSeconds } from 'date-fns';
import { ShortUrl } from './ShortUrl';
import { Slug } from '../type/Slug';

describe('url:entity:ShortUrl', () => {
	describe('expired', () => {
		it('verify expired short url', () => {
			const shortUrl = ShortUrl.restore(ulid(), {
				slug: Slug.create('i23sdb'),
				creatorId: ulid(),
				expires: subSeconds(new Date(), 30),
				longUrl: 'https://example.com',
				access: 0,
				active: true,
				created: new Date(),
				updated: new Date(),
				version: 1,
			});

			assert.strictEqual(shortUrl.expired(), true);
		});

		it('verify unexpired short url', () => {
			const shortUrl = ShortUrl.restore(ulid(), {
				slug: Slug.create('i23sdb'),
				creatorId: ulid(),
				expires: addSeconds(new Date(), 30),
				longUrl: 'https://example.com',
				access: 0,
				active: true,
				created: new Date(),
				updated: new Date(),
				version: 1,
			});

			assert.strictEqual(shortUrl.expired(), false);
		});
	});

	describe('redirect', () => {
		it('allow redirect active and unexpired short url', () => {
			const shortUrl = ShortUrl.restore(ulid(), {
				slug: Slug.create('i23sdb'),
				creatorId: ulid(),
				expires: addSeconds(new Date(), 30),
				longUrl: 'https://example.com',
				access: 0,
				active: true,
				created: new Date(),
				updated: new Date(),
				version: 1,
			});

			assert.strictEqual(shortUrl.canRedirect(), true);
		});

		it('deny redirect inactive short url', () => {
			const shortUrl = ShortUrl.restore(ulid(), {
				slug: Slug.create('i23sdb'),
				creatorId: ulid(),
				expires: addSeconds(new Date(), 30),
				longUrl: 'https://example.com',
				access: 0,
				active: false,
				created: new Date(),
				updated: new Date(),
				version: 1,
			});

			assert.strictEqual(shortUrl.canRedirect(), false);
		});

		it('deny redirect expired short url', () => {
			const shortUrl = ShortUrl.restore(ulid(), {
				slug: Slug.create('i23sdb'),
				creatorId: ulid(),
				expires: subSeconds(new Date(), 30),
				longUrl: 'https://example.com',
				access: 0,
				active: true,
				created: new Date(),
				updated: new Date(),
				version: 1,
			});

			assert.strictEqual(shortUrl.canRedirect(), false);
		});
	});
});
