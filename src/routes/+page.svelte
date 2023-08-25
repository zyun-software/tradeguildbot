<script lang="ts">
	import Guild from '$lib/components/pages/guild.svelte';
	import Guilds from '$lib/components/pages/guilds.svelte';
	import Unauthorized from '$lib/components/pages/unauthorized.svelte';

	export let data;

	import '$lib/styles.css';

	import {
		currentPageComponent,
		guilds,
		pageComponent,
		selectedGuildId,
		token
	} from '$lib/stores.js';

	token.set(data.token);
	guilds.set(data.guilds);
	selectedGuildId.set(data.selectedGuildId);

	pageComponent.subscribe((component) => {
		if (data.unauthorized) {
			currentPageComponent.set(Unauthorized);
		} else if (component) {
			currentPageComponent.set(component);
		} else {
			currentPageComponent.set($selectedGuildId ? Guild : Guilds);
		}
	});
</script>

<svelte:component this={$currentPageComponent} />
