<script setup lang="ts">
import { FORM_ERROR } from 'final-form';
import { useRouter } from 'vue-router';
import {
	useForm,
	useFieldState,
	TextInputTransform,
	type ValidationError,
} from 'vue-typed-form';
import { zodFormAdapter } from '@/validation/ZodHelper';
import { UserCredentialSchema } from '@/validation/Iam';
import { AppPath } from '@/config/router';
import { authenticateUser, type UserCredential } from '@/service/Iam';
import { AuthenticationType, type AuthenticationError } from '@/error/api';
import TextInput from '@/component/form/TextInput.vue';
import VButton from '@/component/form/VButton.vue';
import Typography from '@/style/typography.module.css';

const router = useRouter();

const formApi = useForm<UserCredential>({
	submit: async data => {
		const result = await authenticateUser(data);

		switch (result.type) {
			case 'SUCCESS': {
				// TODO: update user state
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
				inputmode="email"
				required
				v-bind="email.prop"
				v-on="email.event"
			/>
			<TextInput
				label="Senha"
				variant="contained"
				size="medium"
				fullwidth
				inputmode="password"
				required
				v-bind="password.prop"
				v-on="password.event"
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
