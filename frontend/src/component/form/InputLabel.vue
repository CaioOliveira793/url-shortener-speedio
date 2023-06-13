<script setup lang="ts">
export interface InputLabelProps {
	label?: string;
	asterisk?: boolean;
}

defineProps<InputLabelProps>();
</script>

<template>
	<label class="body2">
		{{ asterisk ? label + ' ' : label }}
		<span v-if="asterisk" :class="$style.asterisk">*</span>
		<slot />
	</label>
</template>

<style module>
.asterisk {
	color: var(--failure-color);
}
</style>
