import { defineStore } from 'pinia';
import { useStorage, type RemovableRef } from '@vueuse/core';
import {
	createShortUrl,
	type CreateShortUrlData,
	type CreateShortUrlResponse,
	type ShortUrlResource,
} from '@/service/ShortUrl';
import { jsonDeserializer, jsonSerializer } from '@/util/serde';

export const SHORT_URL_HISTORY_KEY = 'short_url_history';
const SHORT_URL_HISTORY_STORAGE_KEY = 'short_url_history_storage';

export interface UseShortUrlHistoryReturn {
	urls: RemovableRef<ShortUrlResource[]>;

	/**
	 * Authenticate the user updating the current user account.
	 * @param credential User credential
	 */
	createUrl(
		data: CreateShortUrlData,
		token?: string | null
	): Promise<CreateShortUrlResponse>;
}

function useShortUrlHistoryComposable(): UseShortUrlHistoryReturn {
	const urls = useStorage<ShortUrlResource[]>(
		SHORT_URL_HISTORY_STORAGE_KEY,
		[],
		globalThis.localStorage,
		{
			writeDefaults: true,
			serializer: { read: jsonDeserializer, write: jsonSerializer },
		}
	);

	async function createUrl(
		data: CreateShortUrlData,
		token: string | null = null
	): Promise<CreateShortUrlResponse> {
		const result = await createShortUrl(data, token);

		if (result.type === 'SUCCESS') {
			urls.value.unshift(result.value);
		}

		return result;
	}

	return { urls, createUrl };
}

export const useShortUrlHistory = defineStore<
	typeof SHORT_URL_HISTORY_KEY,
	UseShortUrlHistoryReturn
>(SHORT_URL_HISTORY_KEY, useShortUrlHistoryComposable);
