<script lang="ts">
	import Guilds from '$lib/components/pages/guilds.svelte';
	import Unauthorized from '$lib/components/pages/unauthorized.svelte';

	import '$lib/styles.css';

	import {
		currentPageComponent,
		pageComponent,
		selectedGuildId,
		unauthorized
	} from '$lib/stores.js';
	import { requestUtility } from '$lib/utilities';
	import { onMount } from 'svelte';

	onMount(async () => {
		const value = await requestUtility<number | null>('get-selected-guild-id');
		selectedGuildId.set(value);
		pageComponent.set(Guilds);
	});

	pageComponent.subscribe((component) => {
		if ($unauthorized) {
			currentPageComponent.set(Unauthorized);
		} else if (component) {
			currentPageComponent.set(component);
		} else {
			currentPageComponent.set(Guilds);
		}
	});
</script>

<svelte:component this={$currentPageComponent} />
