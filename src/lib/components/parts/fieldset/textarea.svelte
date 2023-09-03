<script lang="ts">
	export let id: string;
	export let name: string;
	export let value: string;
	export let required: boolean = false;
	export let onInput: ((value: any) => void) | undefined = undefined;

	let onInputHandler = (event: Event) => {
		if (onInput) onInput((event.target as HTMLTextAreaElement).value);
	};
</script>

<fieldset class="grid grid-cols-2 mb-2">
	<label for={id} class="flex items-top h-full pt-2">{name}</label>
	<textarea {id} placeholder={name} on:input={onInputHandler} {required}>{value}</textarea>
</fieldset>
