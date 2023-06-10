import { RollupOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';
import { default as packageJson } from './package.json' assert { type: 'json' };

const buildOptions: RollupOptions = {
	input: packageJson.source,
	plugins: [
		typescript({
			include: ['src/**/*.ts'],
		}),
	],
	output: {
		file: packageJson.module,
		sourcemap: true,
		format: 'es',
	},
};

export default buildOptions;
