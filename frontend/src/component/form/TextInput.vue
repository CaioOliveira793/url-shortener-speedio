<script setup lang="ts">
import { nanoid } from 'nanoid';
import InputStyle from '@/style/form/input.module.css';
import TypographyStyle from '@/style/typography.module.css';
import InputLabel from '@/component/form/InputLabel.vue';
import ErrorMessageList from '@/component/form/ErrorMessageList.vue';
import VInput, {
	type InputSize,
	type InputVariant,
} from '@/component/form/VInput.vue';

export interface TextInputProps {
	id?: string;

	// InputLabelProps
	label?: string;
	asterisk?: boolean;

	// InputProps
	type?: string;
	variant?: InputVariant;
	size?: InputSize;
	invalid?: boolean;
	errors?: string[];
	focused?: boolean;
	disabled?: boolean;
	loading?: boolean;
	fullwidth?: boolean;
	required?: boolean;
	modelValue?: string;

	wrapperAttrs?: Record<string, unknown>;
	inputWrapperAttrs?: Record<string, unknown>;
}

defineEmits<{
	(e: 'update:modelValue', value: string): void;
}>();

const props = withDefaults(defineProps<TextInputProps>(), {
	type: 'text',
	variant: 'contained',
	size: 'medium',
	focused: false,
	disabled: false,
	invalid: false,
});

defineSlots<{
	description(props: Record<string, never>): unknown;
	helperText(props: Record<string, never>): unknown;
	startAdornment(props: Record<string, never>): unknown;
	endAdornment(props: Record<string, never>): unknown;
}>();

const theID = props.id ?? nanoid();
</script>

<template>
	<div
		:class="[InputStyle.input_wrapper]"
		:fullwidth="fullwidth ? '' : null"
		v-bind="wrapperAttrs"
	>
		<InputLabel
			v-if="label"
			:for="theID"
			:label="label"
			:asterisk="asterisk || required"
		/>
		<p v-if="$slots.description" :class="TypographyStyle.helper_text">
			<slot name="description" />
		</p>
		<VInput
			:id="theID"
			:type="type"
			:variant="variant"
			:size="size"
			:focused="focused"
			:disabled="disabled"
			:required="required"
			:loading="loading"
			:fullwidth="fullwidth"
			:invalid="invalid"
			:value="modelValue"
			:wrapper-attrs="inputWrapperAttrs"
			v-bind="$attrs"
			@input="
				$emit('update:modelValue', ($event.target as HTMLInputElement).value)
			"
		>
			<slot name="startAdornment" />
			<slot name="endAdornment" />
		</VInput>
		<p v-if="$slots.helperText" :class="TypographyStyle.helper_text">
			<slot name="helperText" />
		</p>
		<ErrorMessageList
			:errors="errors"
			role="alert"
			:class="TypographyStyle.error_message"
		/>
	</div>
</template>

<script lang="ts">
export default {
	inheritAttrs: false,
};
</script>
