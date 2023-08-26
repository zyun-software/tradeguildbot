<script lang="ts">
	export let onSubmit: () => Promise<void> | void;
</script>

<form class="px-4" on:submit={onSubmit}>
	<slot />
</form>
