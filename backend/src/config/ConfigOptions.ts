import { env } from 'node:process';
import { ConfigModuleOptions } from '@nestjs/config';
import { NodeEnv, validateEnvVariables } from './Environment';

export function createGlobalConfigOptions(): ConfigModuleOptions {
	const options: ConfigModuleOptions = {
		isGlobal: true,
		cache: true,
		expandVariables: true,
		validate: validateEnvVariables,
	};

	switch (env['NODE_ENV'] as NodeEnv) {
		case 'production':
			options.ignoreEnvFile = true;
			break;

		case 'test':
			options.ignoreEnvFile = false;
			options.envFilePath = '.test.env';
			break;

		case 'development':
		default:
			options.ignoreEnvFile = false;
			options.envFilePath = '.dev.env';
	}

	return options;
}
