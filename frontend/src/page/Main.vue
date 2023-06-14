<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
import { useRouter } from 'vue-router';
import { TextInputTransform, useFieldState, useForm } from 'vue-typed-form';
import { differenceInHours } from 'date-fns';
import { type CreateShortUrlData } from '@/service/ShortUrl';
import { zodFormAdapter } from '@/validation/ZodHelper';
import { CreateShortUrlSchema } from '@/validation/ShortUrl';
import { AppPath } from '@/config/router';
import ShortUrlEntry from '@/component/ShortUrlEntry.vue';
import TextInput from '@/component/form/TextInput.vue';
import VButton from '@/component/form/VButton.vue';
import Typography from '@/style/typography.module.css';
import { useUserAccount } from '@/composable/useUserAccount';
import { useShortUrlHistory } from '@/composable/useShortUrlHistory';

const RelativeTimeFormatter = new Intl.RelativeTimeFormat('pt-BR', {
	style: 'short',
	numeric: 'auto',
});

const router = useRouter();

const userAccount = useUserAccount();
const urlHistory = useShortUrlHistory();

const formApi = useForm<CreateShortUrlData>({
	// FIXME: expires should be set by default from zod.
	initialValues: { expires: null },
	submit: async (data, formApi) => {
		const authToken = userAccount.state?.token ?? null;
		const result = await urlHistory.createUrl(data, authToken);

		switch (result.type) {
			case 'SUCCESS': {
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

			<p v-if="!userAccount.state?.user">
				<router-link :to="AppPath.SignIn">Entrar</router-link> -
				<router-link :to="AppPath.SignUp">Criar minha conta</router-link>
			</p>
			<p v-else :class="Typography.body1">
				Logado como {{ userAccount.state.user.name }} à
				{{
					RelativeTimeFormatter.format(
						differenceInHours(new Date(), userAccount.state.user.last_auth),
						'hours'
					)
				}}
			</p>
		</div>

		<div :class="$style.shortened_url_list_container">
			<h4 :class="Typography.heading4">Url encurtadas</h4>
			<p>Suas urls encurtadas neste dispositivo</p>

			<ul>
				<li v-for="shortUrl in urlHistory.urls" :key="shortUrl.slug">
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
