<script setup lang="ts">
import ButtonStyle from '@/style/form/button.module.css';
import SpinnerStyle from '@/style/feedback/spinner.module.css';

export type ButtonVariant =
	| 'outlined'
	| 'text'
	| 'contained'
	| 'icon_contained'
	| 'icon_outlined'
	| 'icon_flat';
export type ButtonColor =
	| 'primary'
	| 'info'
	| 'success'
	| 'warning'
	| 'error'
	| 'current';
export type ButtonSize = 'none' | 'small' | 'medium' | 'large';

export interface ButtonProps {
	variant?: ButtonVariant;
	color?: ButtonColor;
	size?: ButtonSize;
	loading?: boolean;
	disabled?: boolean;
}

withDefaults(defineProps<ButtonProps>(), {
	variant: 'contained',
	size: 'medium',
	color: 'primary',
	loading: false,
});

defineSlots<{
	startIcon(props: Record<string, never>): unknown;
	default(props: Record<string, never>): unknown;
	endIcon(props: Record<string, never>): unknown;
}>();
</script>

<template>
	<button
		:class="[ButtonStyle.button, ButtonStyle[variant as ButtonVariant], ButtonStyle[size as ButtonSize]]"
		:s-color="(color as ButtonColor)"
		:loading="loading ? '' : null"
		:disabled="disabled || loading || false"
	>
		<div v-if="loading" :class="SpinnerStyle.arch" />
		<slot v-else name="startIcon" />
		<slot />
		<slot name="endIcon" />
	</button>
</template>
