import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import {
	FastifyAdapter,
	NestFastifyApplication,
} from '@nestjs/platform-fastify';
import cors from '@fastify/cors';
import { EnvVariables } from '@/config/Environment';
import { AppModule } from '@/module/App';
import { ShutdownSignal } from '@nestjs/common';

const BODY_LIMIT = 20 * 1024 * 1024;

async function bootstrap() {
	const app = await NestFactory.create<NestFastifyApplication>(
		AppModule,
		new FastifyAdapter({ logger: true, bodyLimit: BODY_LIMIT })
	);
	app.register(cors, { origin: true });

	const config = app.get<ConfigService<EnvVariables, true>>(ConfigService);
	const port = config.get<number>('PORT');

	app.enableShutdownHooks([ShutdownSignal.SIGTERM, ShutdownSignal.SIGINT]);

	await app.listen(port, '0.0.0.0');
}

await bootstrap();
