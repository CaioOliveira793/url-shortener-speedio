import { default as z } from 'zod';
import { InvalidTypeMessage, RequiredValueMessage } from '@/exception/Message';

export type NodeEnv = 'development' | 'test' | 'production';

export interface EnvVariables {
	/**
	 * Current NodeJS runtime enviornment
	 */
	NODE_ENV: NodeEnv;
	/**
	 * Service port listening the incoming connections.
	 */
	PORT: number;
	/**
	 * Secret use to sign tokens
	 */
	TOKEN_SECRET: string;
}

const EnvVariablesSchema = z
	.object({
		PORT: z
			.number({
				invalid_type_error: InvalidTypeMessage,
				required_error: RequiredValueMessage,
				coerce: true,
			})
			.int({ message: 'PORT environment must be a integer' }),
		NODE_ENV: z
			.enum(['development', 'test', 'production'])
			.default('development'),
		TOKEN_SECRET: z.string().min(16).max(512),
	})
	.passthrough();

export function validateEnvVariables(
	env: Record<string, unknown>
): EnvVariables {
	return EnvVariablesSchema.parse(env);
}
