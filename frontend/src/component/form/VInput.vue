<script setup lang="ts">
import InputStyle from '@/style/form/input.module.css';
import SpinnerStyle from '@/style/feedback/spinner.module.css';

export type InputVariant = 'outlined' | 'contained';
export type InputSize = 'small' | 'medium' | 'large';
export interface InputProps {
	type?: string;
	variant?: InputVariant;
	size?: InputSize;
	invalid?: boolean;
	focused?: boolean;
	disabled?: boolean;
	loading?: boolean;
	fullwidth?: boolean;

	wrapperAttrs?: Record<string, unknown>;
}

withDefaults(defineProps<InputProps>(), {
	type: 'text',
	variant: 'contained',
	size: 'medium',
	invalid: false,
	disabled: false,
	loading: false,
});

defineSlots<{
	startAdornment(props: Record<string, never>): unknown;
	endAdornment(props: Record<string, never>): unknown;
}>();
</script>

<template>
	<div
		:invalid="invalid ? '' : null"
		:disabled="disabled ? '' : null"
		:focused="focused ? '' : null"
		:fullwidth="fullwidth ? '' : null"
		:class="[InputStyle.input, InputStyle[variant as InputVariant], InputStyle[size as InputSize]]"
		v-bind="wrapperAttrs"
	>
		<div v-if="loading" :class="SpinnerStyle.arch" />
		<slot v-else name="startAdornment" />
		<input
			:type="(type as string)"
			:disabled="(disabled as boolean)"
			v-bind="$attrs"
		/>
		<slot name="endAdornment" />
	</div>
</template>

<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>
