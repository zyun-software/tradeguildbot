<script lang="ts">
	import type { OptionType } from '$lib/types';
	import { onMount } from 'svelte';

	export let id: string;
	export let name: string;
	export let options: OptionType<number | string>[];
	export let selected: string | number | undefined = undefined;
	export let onChange: ((value: any) => void) | undefined = undefined;

	onMount(() => {
		if (onChange && selected) {
			onChange(selected);
		}
	});
</script>

<fieldset class="grid grid-cols-2 mb-2">
	<label for={id} class="flex items-center h-full">{name}</label>
	<select {id} bind:value={selected} on:change={() => onChange && onChange(selected)}>
		{#each options as { value, text }}
			<option {value} selected={value === selected}>{text}</option>
		{/each}
	</select>
</fieldset>
