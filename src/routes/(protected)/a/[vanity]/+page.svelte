<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { guildedMediaLink } from '$lib/utils/guilded-media';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let data;

	const { app, redirect_uri, scope, state, response_type } = data;
</script>

<h2 class="h2 inter font-bold text-left">Authorizing</h2>

<div class="flex justify-center mt-4">
	<div class="card card-hover container bg-initial overflow-hidden flex flex-col lg:w-[75%] md:w-full justify-self-center">
		<header class="min-h-[210px]">
			<img src={app.banner} alt="User Banner" class="w-full aspect-[21/9] object-cover" />
		</header>
		<div class="w-full p-8 overflow-visible">
			<div class="flex flex-col items-center -translate-y-20 gap-4 overflow-visible">
				<div class="grid justify-center">
					<Avatar src={app.icon} width="w-[100px]" />
				</div>
				<div class="mt-10 flex flex-col items-center justify-between w-full flex-wrap">
					<div class="flex flex-col items-center">
						{#if app.isVerified}
							✅ This app is verified.
						{/if}
						{#if $page.data.user.role === 'ADMIN'}
							<form
								class="flex items-center w-full"
								action={`?/toggleAppVerification`}
								method="post"
							>
								<button class="btn variant-ghost-tertiary rounded-md w-full" type="submit">
									{#if app.isVerified}
										Unverify ❌
									{:else}
										Verify ✅
									{/if}
								</button>
							</form>
						{/if}
					</div>
				</div>
			</div>
			<div class="-translate-y-20 min-h-[150px] overflow-y-auto text-left">
				<div class="card p-4 mt-5 variant-ghost-surface">
					<h3 class="h3 font-bold inter mb-2">Authentication</h3>
					<p class="mb-2">By authenticating, you allow <strong> {app.name} </strong> to access the following information:</p>
					<ul class="list-disc list-inside">
						<li>Access to your username and avatar.</li>
						<li>Access to what servers you are in.</li>
					</ul>
				</div>
			</div>
		</div>
		<hr class="opacity-50" />
		<footer class="p-4">
			<div class="flex flex-col gap-4 h-auto sm:flex-row justify-between">
				<div class="flex gap-4 items-center hidden sm:flex"> <!-- Add 'hidden sm:flex' here -->
					<Avatar src={guildedMediaLink(app.ownerUser.avatar)} width="w-[75px]" />
					<div class="flex gap-2">
						<small class="btn btn-sm variant-ghost-primary">
							Creator: {app.ownerUser.username}
						</small>
						{#if app.supportServer != ''}
							<small>
								<a href={app.supportServer} class="btn btn-sm variant-ghost-primary" target="_blank" rel="noopener noreferrer">
									Support Server
								</a>
							</small>
						{/if}
					</div>
				</div>
				<div class="flex gap-2">
					<form
						class="flex items-center w-full"
						action={`?/authorizeApp${
							redirect_uri && scope && state && response_type
								? `&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response_type}`
								: ''
						}`}
						method="post"
					>
						<button class="btn variant-ghost-primary rounded-md w-full" type="submit">
							Authorize ⏩
						</button>
					</form>
				</div>
			</div>
		</footer>
	</div>
</div>