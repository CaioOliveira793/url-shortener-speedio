/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly API_ADDRESS: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
