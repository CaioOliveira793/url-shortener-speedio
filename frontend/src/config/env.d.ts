/// <reference types="vite/client" />

interface ImportMetaEnv {
	readonly APP_API_ADDRESS: string;
	readonly APP_SHORT_URL_REDIRECT_ENDPOINT: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
