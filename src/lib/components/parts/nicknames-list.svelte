<script lang="ts">
	import { requestUtility } from '$lib/utilities';

	export let guild_id: number;

	let options: string[] = [];

	(async () => {
		const response = await requestUtility<string[]>('get-guild-member-nicknames', {
			guild_id
		});

		if (response) {
			options = response;
		}
	})();
</script>

<datalist id="nicknames">
	{#each options as value}
		<option {value} />
	{/each}
</datalist>
