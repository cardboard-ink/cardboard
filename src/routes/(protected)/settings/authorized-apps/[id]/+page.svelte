<script lang="ts">
	export let data;

	const sessions = data.appSessions;
	const appName = data.appName;
	const appManager = data.appManager;
</script>

<div class="flex justify-between items-center">
	<h2 class="h2 font-bold inter">
		Manage Your Sessions
	</h2>
	<form action={`?/revokeAuth`} method="post">
		<input type="hidden" name="appId" />
		<button type="submit" class="btn rounded variant-ghost-error btn-icon p-3">
			<svg xmlns="http://www.w3.org/2000/svg" width="20px" class="fill-token" viewBox="0 0 448 512"
				><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
					d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
				/></svg
			>
		</button>
	</form>
</div>

{#if sessions.length === 0}
	<p class="p inter">
		You have no active sessions of {appName?.name}.
	</p>
{:else}
	<ul>
		{#each sessions as session}
			<li>
				<div
					class="card card-hover bg-initial modal p-4 m-2 gap-4 rounded-md md:flex-col md:h-fit lg:flex-row lg:h-24 flex items-center lg:w-fit"
				>
					<div class="w-16" />
					<div class="details">
						<div class="flex flex-col gap-1 items-center lg:flex-row">
							<span class="flex gap-1">
								<strong> Created At: </strong>
								<p class="p">
									{session.createdAt}
								</p>
							</span>
						</div>
						<div class="flex flex-col gap-1 items-center lg:flex-row">
							<span class="flex gap-1">
								<strong> Expires At: </strong>
								<p class="p">
									{session.expiresAt}
								</p>
							</span>
						</div>
					</div>
					<form class=" w-12" action="?/revoke" method="POST">
						<input type="hidden" name="identifier" value={session.id} />
						<button class="btn btn-icon" type="submit">
							<svg
								xmlns="http://www.w3.org/2000/svg"
								viewBox="0 0 448 512"
								class="revoke fill-token"
							>
								<path
									d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"
								/>
							</svg>
						</button>
					</form>
				</div>
			</li>
		{/each}
	</ul>
{/if}

<style lang="postcss">
	svg {
		width: 64px;
	}
</style>
