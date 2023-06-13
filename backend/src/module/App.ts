import { APP_FILTER, RouterModule } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createGlobalConfigOptions } from '@/config/ConfigOptions';
import { HttpExceptionFilter } from '@/filter/HttpExceptionFilter';
import { IamModule } from '@/module/iam/IamModule';
import { UrlModule } from '@/module/url/UrlModule';

@Module({
	imports: [
		ConfigModule.forRoot(createGlobalConfigOptions()),
		IamModule,
		UrlModule,
		RouterModule.register([
			{ path: 'iam', module: IamModule },
			{ path: 'short_url', module: UrlModule },
		]),
	],
	providers: [{ provide: APP_FILTER, useClass: HttpExceptionFilter }],
})
export class AppModule {}
