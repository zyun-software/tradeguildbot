<script lang="ts">
	import { pageComponent } from '$lib/stores';
	import type { MenuButtonType } from '$lib/types';
	import { alertUtility } from '$lib/utilities';

	export let buttons: MenuButtonType[];
</script>

<div class="px-2 grid grid-cols-3 gap-3 select-none">
	{#each buttons as { emoji, text, component, handler }, i}
		<button
			class="p-2 bg-tg-secondary-bg-color"
			on:click={async () => {
				if (component) {
					pageComponent.set(component);
				} else if (handler) {
					await handler();
				} else {
					alertUtility(`${emoji} ${text} в розробці`);
				}
			}}
		>
			<div class="text-4xl">{emoji}</div>
			<div class="text-sm mt-3">{text}</div>
		</button>
	{/each}
</div>
