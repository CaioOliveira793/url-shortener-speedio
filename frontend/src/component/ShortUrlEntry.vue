<script setup lang="ts">
import {
	makeShortUrlRedirectLink,
	type ShortUrlResource,
} from '@/service/ShortUrl';
import CopyIcon from '~icons/fa6-solid/copy';

const ShortDateTimeFormatter = new Intl.DateTimeFormat('pt-BR', {
	dateStyle: 'short',
	timeStyle: 'short',
});

interface Props {
	shortUrl: ShortUrlResource;
}

const props = defineProps<Props>();
const shortLink = makeShortUrlRedirectLink(props.shortUrl.slug);

async function copyShortUrlToClipboard() {
	try {
		await navigator.clipboard.writeText(shortLink);
	} catch (err) {
		console.error('Failed to copy: ', err);
	}
}
</script>

<template>
	<div :class="$style.container">
		<div :class="$style.short_url_container">
			<a :href="shortLink" target="_blank" rel="noopener noreferrer">
				{{ shortLink }}
			</a>
			<button
				class="button icon_outlined small"
				s-color="info"
				@click="copyShortUrlToClipboard"
			>
				<CopyIcon />
			</button>
		</div>

		<div :class="$style.tag_container">
			<span
				class="tag_medium"
				:class="{ [$style.tag]: true, [$style.inactive]: !shortUrl.active }"
				>{{ shortUrl.active ? 'ATIVO' : 'INATIVA' }}</span
			>
			<span class="tag_medium" :class="$style.tag">
				Expiração:
				{{
					shortUrl.expires
						? ShortDateTimeFormatter.format(shortUrl.expires)
						: 'indefinida'
				}}
			</span>
			<span class="tag_medium" :class="$style.tag">
				Visitas: {{ shortUrl.access }}
			</span>
		</div>

		<div>
			<p>
				URL de destino:
				<a :href="shortLink" target="_blank" rel="noopener noreferrer">
					{{ shortUrl.long_url }}
				</a>
			</p>
			<p>
				Data de criação: {{ ShortDateTimeFormatter.format(shortUrl.created) }}
			</p>
		</div>
	</div>
</template>

<style lang="css" module>
.container {
	display: flex;
	flex-flow: column nowrap;
	width: 100%;
	padding: calc(var(--padding-unit) * 2);
	gap: calc(var(--spacing-unit) * 1.5);
	border-radius: var(--border-radius-unit);

	background-color: var(--surface-color-2);
}

.short_url_container {
	display: flex;
	flex-flow: row wrap;
	align-items: center;
	justify-content: space-between;
	width: 100%;
	padding: calc(var(--padding-unit) * 1);
	gap: calc(var(--spacing-unit) * 0.5);
	border-radius: var(--border-radius-unit);

	background-color: var(--surface-color-4);
}

.tag_container {
	display: flex;
	flex-flow: row nowrap;
	justify-content: flex-start;
	align-items: center;
	gap: calc(var(--spacing-unit) * 1.5);
}

.inactive {
	color: var(--failure-color);
}

.tag {
	padding: calc(var(--padding-unit) * 0.5);
	border-radius: var(--border-radius-unit);
	background-color: var(--surface-color-4);
}
</style>
