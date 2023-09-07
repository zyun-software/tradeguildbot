<script lang="ts">
	export let id: string;
	export let name: string;
	export let type: 'search' | 'number' = 'search';
	export let value: string | number;
	export let required: boolean = false;
	export let readonly: boolean = false;
	export let onInput: ((value: any) => void) | undefined = undefined;
	export let datalist: string | undefined = undefined;
</script>

<fieldset class="grid grid-cols-2 mb-2">
	<label for={id} class="flex items-center h-full">{name}</label>
	{#if type === 'search'}
		<input
			{id}
			type="search"
			placeholder={name}
			bind:value
			on:input={() => onInput && onInput(value)}
			list={datalist}
			{required}
			{readonly}
		/>
	{:else if type === 'number'}
		<input
			{id}
			type="number"
			placeholder={name}
			bind:value
			on:input={() => onInput && onInput(value)}
			{required}
			{readonly}
		/>
	{/if}
</fieldset>
