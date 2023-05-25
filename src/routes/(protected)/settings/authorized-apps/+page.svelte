<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';

    export let data
    const {apps} = data
</script>

<h2>
    Authorized Apps
</h2>
{#each apps as app}
    <div class="flex justify-evenly flex-wrap">
        <div class="card card-hover container bg-initial overflow-hidden flex flex-col w-[420px] justify-self-center">
            <header>
            <img src={app.banner} alt="User Banner" class="bg-black/50 w-full object-cover">
            </header>
            <div class="w-full p-8 overflow-visible">
            <div class="flex -translate-y-20 gap-4 overflow-visible">
                <div class="grid justify-center">
                <Avatar src={app.icon} width="w-[100px]" />
                </div>
                <h2 class="flex items-end ">
                    {app.name}
                </h2>
            </div>
            <div class="-translate-y-20">
                <h4>
                    Description
                </h4>
                <p>
                    {app.description}
                    </p>
            </div>
            </div>
            <hr class="opacity-50">
            <footer class="p-4">
                <div class="flex justify-between">
                    <div class="flex gap-4 items-center">
                        <Avatar src={app.ownerUser.avatar} width="w-[75px]" />
                        <div class="flex flex-col">
                            <small>
                                Created By: {app.ownerUser.username}
                            </small>
                            <small>
                                Created At: {app.createdAt.toLocaleString()}
                            </small>
                            <small>
                                App Trusted By: {app.authorizedSessions.length} user(s)
                            </small>
                        </div>
                        <form action={`?/revokeAuth`} method="post">
                            <input type="hidden" value={app.id} name="appId">
                            <button type="submit" class="rounded variant-ghost-error btn-icon">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24px" class="fill-token" viewBox="0 0 448 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/></svg>
                            </button>
                        </form>
                    </div>
                </div>
            </footer>
        </div>
    </div>
{/each}
{#if apps.length < 1}
    <p class="text-error-500">
        You have no authorized apps.
    </p>
{/if}