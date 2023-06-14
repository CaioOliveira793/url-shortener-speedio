import {
	Body,
	Controller,
	Get,
	HttpStatus,
	Inject,
	NotFoundException,
	Param,
	Post,
	Res,
} from '@nestjs/common';
import {
	ShortUrlResource,
	makeShortUrlResource,
} from '@/module/url/dto/Resource';
import { CreateShortUrlData, ShortUrl } from '@/module/url/entity/ShortUrl';
import {
	SLUG_GENERATION_SERVICE,
	SlugGenerationService,
} from '@/module/url/service/SlugGenerationService';
import {
	SHORT_URL_REPOSITORY_PROVIDER,
	ShortUrlRepository,
} from '@/module/url/service/ShortUrlRepository';
import { ResourceNotFound } from '@/exception/resource/ResourceNotFound';
import { SchemaPipe } from '@/pipe/SchemaPipe';
import {
	CreateShortUrlSchema,
	SlugSchema,
} from '@/module/url/validation/Schema';
import { ReqHeader } from '@/decorator/ReqHeader';
import { HeaderValue, Response } from '@/http/types';
import { AuthService } from '@/module/iam/service/AuthService';

@Controller('url')
export class ShortUrlController {
	constructor(
		@Inject(SLUG_GENERATION_SERVICE)
		private readonly slugService: SlugGenerationService,
		@Inject(SHORT_URL_REPOSITORY_PROVIDER)
		private readonly shortUrlRepository: ShortUrlRepository,
		private readonly authService: AuthService
	) {}

	@Post()
	public async create(
		@Body(new SchemaPipe(CreateShortUrlSchema)) data: CreateShortUrlData,
		@ReqHeader('authorization') authorization: HeaderValue
	): Promise<ShortUrlResource> {
		let creatorId: string | null = null;
		if (authorization) {
			const token = await this.authService.bearerAuthScheme(authorization);
			creatorId = token.data;
		}

		const shortUrl = await ShortUrl.create(data, creatorId, this.slugService);

		await this.shortUrlRepository.insert(shortUrl);

		return makeShortUrlResource(shortUrl);
	}

	@Get(':slug')
	public async getShortUrl(
		@Param('slug', new SchemaPipe(SlugSchema)) slug: string
	): Promise<ShortUrlResource | void> {
		const shortUrl = await this.shortUrlRepository.find(slug);
		if (!shortUrl) {
			throw new ResourceNotFound('Resource not found', [
				{
					key: 'id:' + slug,
					path: null,
					resource_type: 'SHORT_URL',
				},
			]);
		}

		return makeShortUrlResource(shortUrl);
	}

	@Get('location/:slug')
	public async getShortUrlLocation(
		@Param('slug', new SchemaPipe(SlugSchema)) slug: string,
		@Res() res: Response
	): Promise<ShortUrlResource | void> {
		const shortUrl = await this.shortUrlRepository.find(slug);
		if (!shortUrl) {
			throw new NotFoundException();
		}

		shortUrl.incrementAccess();
		await this.shortUrlRepository.incrementAccess(shortUrl.slug, 1);

		res.status(HttpStatus.FOUND).redirect(shortUrl.longUrl);
	}
}
