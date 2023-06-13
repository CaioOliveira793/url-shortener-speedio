<script setup lang="ts">
export interface ErrorMessageListProps {
	errors?: string[];
}

defineProps<ErrorMessageListProps>();
</script>

<template>
	<ul>
		<li
			v-for="message in errors"
			:key="message"
			:class="$style.error_message_list"
		>
			{{ message }}
		</li>
	</ul>
</template>

<style module>
.error_message_list:first-letter {
	text-transform: capitalize;
}
</style>
