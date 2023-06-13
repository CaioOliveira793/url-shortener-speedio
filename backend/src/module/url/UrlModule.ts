import { Module } from '@nestjs/common';
import { ShortUrlController } from './controller/ShortUrlController';
import { SlugGenerationProvider } from './service/SlugGenerationService';
import { ShortUrlRepositoryProvider } from './service/ShortUrlRepository';
import { IamModule } from '@/module/iam/IamModule';

@Module({
	imports: [IamModule],
	providers: [SlugGenerationProvider, ShortUrlRepositoryProvider],
	controllers: [ShortUrlController],
})
export class UrlModule {}
