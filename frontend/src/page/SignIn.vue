<script setup lang="ts">
import { FORM_ERROR } from 'final-form';
import { useRouter } from 'vue-router';
import {
	useForm,
	useFieldState,
	TextInputTransform,
	type ValidationError,
	useFormState,
} from 'vue-typed-form';
import { zodFormAdapter } from '@/validation/ZodHelper';
import { UserCredentialSchema } from '@/validation/Iam';
import { AppPath } from '@/config/router';
import type { UserCredential } from '@/service/Iam';
import { AuthenticationType, type AuthenticationError } from '@/error/api';
import TextInput from '@/component/form/TextInput.vue';
import VButton from '@/component/form/VButton.vue';
import Typography from '@/style/typography.module.css';
import ErrorMessageList from '@/component/form/ErrorMessageList.vue';
import { useUserAccount } from '@/composable/useUserAccount';

const router = useRouter();
const userAccount = useUserAccount();

const formApi = useForm<UserCredential>({
	submit: async data => {
		const result = await userAccount.authenticate(data);

		switch (result.type) {
			case 'SUCCESS': {
				router.push(AppPath.Main);
				break;
			}
			case 'NOT_FOUND': {
				return { email: ['e-mail não encontrado'] };
			}
			case 'AUTHENTICATION': {
				return handleAuthenticationError(result.value);
			}
		}
	},
	validate: zodFormAdapter(UserCredentialSchema),
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

function handleAuthenticationError(
	error: AuthenticationError
): void | ValidationError<UserCredential> {
	switch (error.type) {
		case AuthenticationType.InvalidCredential: {
			return { [FORM_ERROR]: ['credenciais inválidas'] };
		}
		case AuthenticationType.InvalidPassword: {
			return { password: ['senha incorreta'] };
		}
		case AuthenticationType.RetryExceeded: {
			return {
				[FORM_ERROR]: [
					'limite de tentativas excedido, tente novamente mais tarde',
				],
			};
		}
	}
}
</script>

<template>
	<main :class="$style.page_container">
		<h1 :class="Typography.heading2">Login</h1>
		<form :class="$style.form_container" @submit.prevent="formApi.submit">
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
				autocomplete="current-password"
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
