<script lang="ts">
	import { page } from '$app/stores';

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
		<p class="p">{greeting()}, {$page.data.user.displayName}! 👋</p>
	{:else}
		<h2 class="h2 font-custom font-semibold">{greeting()}, visitor! 👋</h2>
		<p class="font-custom font-medium mt-2">
			Welcome to CardBoard, the all in one Guilded authentication service. <br /> Get started by Linking
			your profile!
		</p>
		<div class="flex flex-col gap-4 mt-4">
			<a href="/login" class="w-full">
				<button class="btn variant-ghost-primary p-3 w-full">Link Guilded. 🔑</button>
			</a>
			<a
				href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374610"
				target="_blank"
				class="w-full"
			>
				<button class="btn variant-ghost-primary p-3 w-full"
					>Learn the ropes of CardBoard. ✨</button
				>
			</a>
			<a href="/info" target="_blank" class="w-full">
				<button class="btn variant-ghost-primary rounded-full p-3 w-full">ℹ️ Info</button>
			</a>
		</div>
	{/if}
	<div class="flex flex-col gap-4 mt-4 w-full">
		{#if $page.data.user}
			<a
				href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374610"
				target="_blank"
				class="w-full"
			>
				<button class="rounded-full bg-primary-500 p-3 w-full"
					>Learn the ropes of CardBoard. ✨</button
				>
			</a>
			<a
				href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374610"
				target="_blank"
				class="w-full"
			>
				<button class="rounded-full bg-primary-500 p-3 w-full"
					>Get started with developing on CardBoard. 💻</button
				>
			</a>
			<a href="/info" target="_blank" class="w-full">
				<button class="rounded-full bg-primary-500 p-3 w-full">ℹ️ Info</button>
			</a>
		{/if}
	</div>
</main>
