<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { TextInputTransform, useFieldState, useForm } from 'vue-typed-form';
import {
	createShortUrl,
	type CreateShortUrlData,
	type ShortUrlResource,
} from '@/service/ShortUrl';
import { zodFormAdapter } from '@/validation/ZodHelper';
import { CreateShortUrlSchema } from '@/validation/ShortUrl';
import { AppPath } from '@/config/router';
import ShortUrlEntry from '@/component/ShortUrlEntry.vue';
import TextInput from '@/component/form/TextInput.vue';
import VButton from '@/component/form/VButton.vue';
import Typography from '@/style/typography.module.css';

const router = useRouter();

const createdUrls = ref<ShortUrlResource[]>([]);

const formApi = useForm<CreateShortUrlData>({
	// FIXME: expires should be set by default from zod.
	initialValues: { expires: null },
	submit: async (data, formApi) => {
		const result = await createShortUrl(data);

		switch (result.type) {
			case 'SUCCESS': {
				createdUrls.value.unshift(result.value);
				formApi.reset({ expires: null, long_url: '' });
				break;
			}
			case 'UNAUTHORIZED': {
				router.push(AppPath.SignIn);
				break;
			}
			case 'RESOURCE_ALREADY_EXISTS': {
				alert('A url encurdata já existe');
			}
		}
	},
	validateOnBlur: false,
	validate: zodFormAdapter(CreateShortUrlSchema),
});

const longUrl = useFieldState({
	formApi,
	name: 'long_url',
	transformer: TextInputTransform,
});
</script>

<template>
	<main :class="$style.page_container">
		<h1 :class="[Typography.heading1, $style.page_title]">Encurtador de URL</h1>

		<form :class="$style.form_container" @submit.prevent="formApi.submit">
			<TextInput
				label="URL"
				variant="contained"
				size="large"
				fullwidth
				inputmode="url"
				placeholder="https://url.com/sua-longa-e-imemoravel-url-aqui"
				required
				v-bind="longUrl.prop"
				v-on="longUrl.event"
			/>
			<VButton type="submit" variant="contained" size="large" fullwidth>
				Criar
			</VButton>
		</form>

		<div :class="$style.text_container">
			<p :class="$style.page_description">
				Crie URLs curtas, memoráveis e rastreáveis com o encurtador de URL. Use
				a esta ferramenta para encurtar links de qualquer origem e usa-lo em
				todos os lugares onde você quiser compartilhar.
			</p>

			<p>
				<router-link :to="AppPath.SignIn">Entrar</router-link> -
				<router-link :to="AppPath.SignUp">Criar minha conta</router-link>
			</p>
		</div>

		<div :class="$style.shortened_url_list_container">
			<h4 :class="Typography.heading4">Url encurtadas</h4>

			<ul>
				<li v-for="shortUrl in createdUrls" :key="shortUrl.slug">
					<ShortUrlEntry :short-url="shortUrl" />
				</li>
			</ul>
		</div>
	</main>
</template>

<style module>
.page_container {
	display: flex;
	flex-flow: column nowrap;
	gap: calc(var(--spacing-unit) * 4);
}

.page_title {
	align-self: center;
}

.page_description {
	align-self: center;
	width: 100%;
}

.form_container {
	display: flex;
	flex-flow: column nowrap;
	align-self: center;
	gap: calc(var(--spacing-unit) * 1.5);
	width: 100%;
}

.text_container {
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: flex-start;
	gap: calc(var(--spacing-unit) * 1.5);
	width: 100%;
}

.shortened_url_list_container {
	display: flex;
	flex-flow: column nowrap;
	gap: calc(var(--spacing-unit) * 2);
}

.shortened_url_list_container li {
	display: block;
}
</style>
