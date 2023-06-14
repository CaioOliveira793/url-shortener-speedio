<script setup lang="ts">
import { useRouter } from 'vue-router';
import {
	useForm,
	useFieldState,
	TextInputTransform,
	type ValidationError,
	useFormState,
} from 'vue-typed-form';
import { zodFormAdapter } from '@/validation/ZodHelper';
import { CreateUserSchema } from '@/validation/Iam';
import { AppPath } from '@/config/router';
import type { CreateUserData } from '@/service/Iam';
import TextInput from '@/component/form/TextInput.vue';
import VButton from '@/component/form/VButton.vue';
import ErrorMessageList from '@/component/form/ErrorMessageList.vue';
import Typography from '@/style/typography.module.css';
import { useUserAccount } from '@/composable/useUserAccount';

const router = useRouter();
const userAccount = useUserAccount();

const formApi = useForm<CreateUserData>({
	submit: async (data): Promise<void | ValidationError<CreateUserData>> => {
		const result = await userAccount.createAccount(data);

		switch (result.type) {
			case 'SUCCESS': {
				router.push(AppPath.Main);
				break;
			}
			case 'RESOURCE_ALREADY_EXISTS': {
				return { email: ['e-mail já esta em uso'] };
			}
		}
	},
	validate: zodFormAdapter(CreateUserSchema),
});

const name = useFieldState({
	formApi,
	name: 'name',
	transformer: TextInputTransform,
});

const email = useFieldState({
	formApi,
	name: 'email',
	transformer: TextInputTransform,
});

const password = useFieldState({
	formApi,
	name: 'password',
	transformer: TextInputTransform,
});

const formState = useFormState({ formApi });
</script>

<template>
	<main :class="$style.page_container">
		<h1 :class="Typography.heading2">Criar conta</h1>
		<form :class="$style.form_container" @submit.prevent="formApi.submit">
			<TextInput
				label="Nome"
				variant="contained"
				size="medium"
				fullwidth
				type="text"
				inputmode="text"
				autocomplete="name"
				required
				v-bind="name.prop"
				v-on="name.event"
			/>
			<TextInput
				label="E-mail"
				variant="contained"
				size="medium"
				fullwidth
				type="email"
				inputmode="email"
				autocomplete="email"
				required
				v-bind="email.prop"
				v-on="email.event"
			/>
			<TextInput
				label="Senha"
				variant="contained"
				size="medium"
				fullwidth
				type="password"
				inputmode="password"
				autocomplete="new-password"
				required
				v-bind="password.prop"
				v-on="password.event"
			/>
			<ErrorMessageList
				:errors="formState.errors"
				:class="Typography.error_message"
			/>
			<VButton type="submit" fullwidth>Entrar</VButton>
			<p>
				Ainda não tem uma conta?
				<router-link :to="AppPath.SignUp">crie uma agora</router-link>.
			</p>
		</form>
	</main>
</template>

<style module lang="css">
.page_container {
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: flex-start;
	gap: calc(var(--spacing-unit) * 4);
	width: 100%;
	height: 100vh;
}

.form_container {
	display: flex;
	flex-flow: column nowrap;
	justify-content: flex-start;
	align-items: stretch;
	gap: calc(var(--spacing-unit) * 2);
	width: 100%;
}
</style>
