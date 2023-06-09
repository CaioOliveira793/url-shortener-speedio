import { readFileSync } from 'node:fs';
import { RollupOptions } from 'rollup';
import typescript from '@rollup/plugin-typescript';

const packageJson = JSON.parse(readFileSync('package.json', { encoding: 'utf-8' }));

const buildOptions: RollupOptions = {
	input: packageJson.source,
	plugins: [
		typescript({
			include: ['src/**/*.ts'],
			declaration: false,
		}),
	],
	output: [
		{
			file: packageJson.main,
			sourcemap: true,
			format: 'cjs',
		},
		{
			file: packageJson.module,
			sourcemap: true,
			format: 'es',
		},
	],
};

export default buildOptions;
