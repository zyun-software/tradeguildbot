<script lang="ts">
	import GuildPage from '../parts/guild-page.svelte';
	import Menu from '../parts/menu.svelte';
	import Bill from './bill.svelte';
	import CreateAnAd from './create-an-ad.svelte';
	import CreateAnExchangeOffer from './create-an-exchange-offer.svelte';
	import Invoices from './invoices.svelte';
	import MoneyRequest from './money-request.svelte';
</script>

<GuildPage title="⚡ Послуги гільдії" hint="ℹ️ Тут відображені послуги гільдії">
	<Menu
		buttons={[
			{
				emoji: '💰',
				text: 'Створити запит коштів',
				component: MoneyRequest
			},
			{
				emoji: '📋',
				text: 'Виставити рахунок',
				component: Bill
			},
			{
				emoji: '🧾',
				text: 'Переглянути рахунки',
				component: Invoices
			},
			{
				emoji: '💱',
				text: 'Створити обмін на біржі',
				component: CreateAnExchangeOffer
			},
			{
				emoji: '🛒',
				text: 'Створити оголошення',
				component: CreateAnAd
			}
		]}
	/>
</GuildPage>
