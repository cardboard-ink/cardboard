<script lang="ts">
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	// Greeter function
	function greeting() {
		const date = new Date();
		const hours = date.getHours();
		if (hours < 12) {
			return 'Good morning';
		} else if (hours < 18) {
			return 'Good afternoon';
		} else {
			return 'Good evening';
		}
	}
</script>

<main class="flex flex-col items-left justify-left ml-5 mb-4 min-h-[80vh] text-left px-4">
	{#if $page.data.user}
		<p class="h3 font-bold inter">{greeting()}, {$page.data.user.displayName}! 👋</p>
		<p class="font-custom font-medium mt-2">
			Welcome to the dashboard for CardBoard, the all-in-one Guilded authentication service. <br /> Get started by linking
			creating a <a class="anchor" href="/settings/your-apps">app</a>
		</p>
	{:else}
		<h2 class="h2 inter font-semibold">{greeting()}, visitor! 👋</h2>
		<p class="font-custom font-medium mt-2">
			Welcome to CardBoard, the all-in-one Guilded authentication service. <br /> Get started by linking
			your profile!
		</p>
		<div class="flex w-[13rem] flex-col gap-4 mt-4 w-full">
			<a href="/login" class="w-full">
				<button class="btn w-[15rem] variant-ghost-primary p-3 w-full">Link Guilded 🔑</button>
			</a>
		</div>
	{/if}
	<div class="mb-[20rem] flex flex-row gap-2 mt-4">
		{#if $page.data.user}
			<a
				href="https://www.guilded.gg/CardBoard?i=ArB9z1qA"
				target="_blank"
			>
				<button class="w-[12rem] rounded-full variant-ghost-primary bg-primary-500 p-3">Documentation</button>
			</a>
			
			<button class="w-[12rem] variant-ghost-primary rounded-full bg-primary-500 p-3" on:click={() => goto('/info')}>FAQ</button>
		{/if}
	</div>
</main>