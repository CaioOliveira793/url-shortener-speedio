/// <reference types="vitest" />
import { fileURLToPath, URL } from 'node:url';
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import Icons from 'unplugin-icons/vite';

// https://vitejs.dev/config/
export default defineConfig({
	plugins: [vue(), Icons({ scale: 1 })],
	appType: 'spa',
	envPrefix: 'APP_',
	resolve: {
		alias: {
			'@': fileURLToPath(new URL('./src', import.meta.url)),
		},
	},
	server: {
		port: 4000,
		host: '0.0.0.0',
	},
	test: {
		environment: 'node',
	},
});
