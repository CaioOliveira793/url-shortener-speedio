<script setup lang="ts">
import TypographyStyle from '@/style/typography.module.css';
</script>

<template>
	<main :class="$style.main_content">
		<h1 :class="TypographyStyle.heading3">
			A página que você procura não foi encontrada
		</h1>
		<p>
			Verifique sua URL ou volte para a
			<router-link to="/">página inicial</router-link>.
		</p>
		<!-- TODO: add page not found image -->
	</main>
</template>

<style module>
.main_content {
	display: flex;
	flex-flow: column nowrap;
	justify-content: center;
	align-items: center;
	margin: calc(var(--spacing-unit) * 4);
	gap: calc(var(--spacing-unit) * 2);
}
</style>
