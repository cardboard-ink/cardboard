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

<main class="flex flex-col items-center justify-center ml-5 mb-4 min-h-[80vh] text-center px-4">
	{#if $page.data.user}
		<p class="h3 font-bold inter">{greeting()}, {$page.data.user.displayName}! 👋</p>
		<p class="font-custom font-medium mt-2">
			Welcome to the dashboard forCardBoard, the all in one Guilded authentication service. <br /> Get started by Linking
			creating a <a class="anchor" href="/settings/your-apps">App</a>!
		</p>
	{:else}
		<h2 class="h2 inter font-semibold">{greeting()}, visitor! 👋</h2>
		<p class="font-custom font-medium mt-2">
			Welcome to CardBoard, the all in one Guilded authentication service. <br /> Get started by Linking
			your profile!
		</p>
		<div class="flex flex-col gap-4 mt-4 w-full">
			<a href="/login" class="w-full">
				<button class="btn variant-ghost-primary p-3 w-full">Link Guilded. 🔑</button>
			</a>
			<a
				href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374610"
				target="_blank"
				class="w-full"
			>
				<button class="btn variant-ghost-primary p-3 w-full">Learn the ropes of CardBoard. ✨</button>
			</a>
			<a href="/info" target="_blank" class="w-full">
				<button class="btn variant-ghost-primary rounded-full p-3 w-full">
					<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
					<path fill-rule="evenodd" d="M2 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10S2 17.523 2 12Zm9.408-5.5a1 1 0 1 0 0 2h.01a1 1 0 1 0 0-2h-.01ZM10 10a1 1 0 1 0 0 2h1v3h-1a1 1 0 1 0 0 2h4a1 1 0 1 0 0-2h-1v-4a1 1 0 0 0-1-1h-2Z" clip-rule="evenodd"/>
				  </svg>
				  Info
				</button>
			</a>
		</div>
	{/if}
	<div class="w-[15rem] mb-[20rem] flex flex-col gap-4 mt-4 w-full">
		{#if $page.data.user}
			<a
				href="https://www.guilded.gg/CardBoard?i=ArB9z1qA"
				target="_blank"
				class="w-full"
			>
				<button class="w-full rounded-full variant-ghost-primary bg-primary-500 p-3">Documentation</button>
			</a>
			
			<button class="w-full variant-ghost-primary rounded-full bg-primary-500 p-3" on:click={() => goto('/info')}>FAQ</button>
		{/if}
	</div>
</main>