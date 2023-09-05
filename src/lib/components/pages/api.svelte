<script lang="ts">
	import type { GuildType } from '$lib/types';
	import Input from '../parts/fieldset/input.svelte';
	import Form from '../parts/form.svelte';
	import GuildPage from '../parts/guild-page.svelte';

	let exchange = {
		key: ''
	};

	let guild: GuildType;

	let disabled: boolean = false;

	const onSubmit = async () => {
		console.log(exchange);
	};
</script>

<GuildPage title="🤖 API" hint="ℹ️ Тут відображена інформація про API" bind:guild>
	<Form {onSubmit}>
		<Input
			id="key"
			name="🔑 Ключ"
			readonly={true}
			value={exchange.key}
			onInput={(value) => {
				exchange.key = value;
			}}
		/>
		<button {disabled} class="w-full">Оновити</button>
	</Form>
</GuildPage>
