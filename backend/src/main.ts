import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import { EnvVariables } from '@/config/Environment';
import { AppModule } from '@/module/App';

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({
			logger: true,
		})
	);

	const configService = app.get<ConfigService<EnvVariables>>(ConfigService);
	const port = configService.get<number>('PORT') as number;

	app.enableShutdownHooks();

	await app.listen(port, '0.0.0.0');
}

await bootstrap();
