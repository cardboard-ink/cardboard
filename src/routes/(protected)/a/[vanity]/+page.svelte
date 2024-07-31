<script lang="ts">
	import { enhance } from '$app/forms';
	import { page } from '$app/stores';
	import { guildedMediaLink } from '$lib/utils/guilded-media';
	import { Avatar } from '@skeletonlabs/skeleton';

	export let data;

	const { app, redirect_uri, scope, state, response_type } = data;
</script>

<h2 class="h2">Authorizing</h2>

<div class="flex justify-center mt-4">
	<div
		class="card card-hover container bg-initial overflow-hidden flex flex-col lg:w-[75%] md:w-full justify-self-center"
	>
		<header class="min-h-[210px]">
			<img src={app.banner} alt="User Banner" class="w-full aspect-[21/9] object-cover" />
		</header>
		<div class="w-full p-8 overflow-visible">
			<div class="flex -translate-y-20 gap-4 overflow-visible">
				<div class="grid justify-center">
					<Avatar src={app.icon} width="w-[100px]" />
				</div>
				<div class="mt-10 flex items-center justify-between w-full flex-wrap">
					<h2 class="h2">
						{app.name}
					</h2>
					<div class="flex flex-col">
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
			<div class="-translate-y-20 min-h-[150px] overflow-y-auto">
				<h3 class="h3">Description</h3>
				<p class="p">
					{app.description}
				</p>
			</div>
		</div>
		<hr class="opacity-50" />
		<footer class="p-4">
			<div class="flex flex-col gap-4 h-auto sm:flex-row justify-between">
				<div class="flex gap-4 items-center">
					<Avatar src={guildedMediaLink(app.ownerUser.avatar)} width="w-[75px]" />
					<div class="flex flex-col">
						<small>
							Created By: {app.ownerUser.username}
						</small>
						<small>
							Created At: {app.createdAt.toLocaleString()}
						</small>
						{#if app.supportServer != ''}
							<small>
								App Support: <a href={app.supportServer} target="_blank" rel="noopener noreferrer"
									>{app.supportServer}</a
								>
							</small>
						{/if}
					</div>
				</div>
				<div class="flex gap-4">
					<form
						class="flex items-center w-full"
						action={`?/authorizeApp${
							redirect_uri && scope && state && response_type
								? `&redirect_uri=${redirect_uri}&scope=${scope}&state=${state}&response_type=${response_type}`
								: ''
						}`}
						method="post"
					>
						<button class="btn variant-ghost-primary rounded-md w-full" type="submit"
							>Authorize ⏩</button
						>
					</form>
				</div>
			</div>
		</footer>
	</div>
</div>
