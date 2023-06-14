<script setup lang="ts">
import ErrorMessageList from './form/ErrorMessageList.vue';
import InputLabel from './form/InputLabel.vue';

interface Props {
	errors?: string[];
}

defineProps<Props>();

const ID = 'long-url-input';
</script>

<template>
	<div class="input_wrapper fullwidth">
		<InputLabel label="URL" :for="ID" />
		<div class="input contained large fullwidth input_large">
			<input
				:id="ID"
				type="text"
				inputmode="url"
				placeholder="https://url.com/sua-longa-e-imemoravel-url-aqui"
				required
				v-bind="$attrs"
			/>
		</div>
		<ErrorMessageList
			role="alert"
			class="error_message body2"
			:errors="errors"
		/>
	</div>
</template>
