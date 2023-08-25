<script lang="ts">
	export let onSubmit: () => Promise<void> | void;
</script>

<form class="px-2" on:submit={onSubmit}>
	<slot />
</form>
