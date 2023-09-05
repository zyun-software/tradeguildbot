<script lang="ts">
	import type { GuildType } from '$lib/types';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';

	let searchAnAd = {
		name: ''
	};

	let guild: GuildType;

	let disabled: boolean = false;

	const onSubmit = async () => {
		console.log(searchAnAd);
	};
</script>

<GuildPage
	title="📢 Пошук оголошень"
	hint="ℹ️ Тут можна шукати оголошення членів гільдії"
	bind:guild
>
	<Form {onSubmit}>
		<Input
			id="name"
			name="🏷️ Назва"
			value={searchAnAd.name}
			onInput={(value) => {
				searchAnAd.name = value;
			}}
		/>
		<button {disabled} class="w-full">Пошук</button>
	</Form>
</GuildPage>
