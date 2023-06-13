/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly API_HOSTNAME: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
