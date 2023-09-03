<script lang="ts">
	import { onMount } from 'svelte';

	export let post: string;
	let dark = false;

	onMount(() => {
		dark = window.Telegram.WebApp.colorScheme === 'dark';
	});
</script>

<div class="px-4 my-4">
	<script
		async
		src="https://telegram.org/js/telegram-widget.js?22"
		data-telegram-post={post}
		data-userpic="false"
		data-width="100%"
		data-dark={dark ? 1 : 0}
	></script>
</div>
