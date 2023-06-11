import { APP_FILTER } from '@nestjs/core';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { createGlobalConfigOptions } from '@/config/ConfigOptions';
import { IamModule } from '@/module/iam/IamModule';
import { HttpExceptionFilter } from '@/filter/HttpExceptionFilter';

@Module({
	imports: [ConfigModule.forRoot(createGlobalConfigOptions()), IamModule],
	providers: [
		{
			provide: APP_FILTER,
			useClass: HttpExceptionFilter,
		},
	],
})
export class AppModule {}
