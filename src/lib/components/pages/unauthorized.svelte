<script lang="ts">
	import { hideBackButton } from '$lib/utilities';
	import { onMount } from 'svelte';

	onMount(() => {
		hideBackButton();
	});
</script>

<div class="flex flex-col items-center justify-center h-screen">
	<h1 class="text-3xl mb-2">Необхідна авторизація</h1>
	<p class="text-tg-hint-color mb-4 px-2 text-center">
		Перейдіть до бота та натисніть кнопку <b>Панель</b>
	</p>
</div>
