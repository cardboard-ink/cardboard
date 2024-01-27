<script lang="ts">
	import { guildedMediaLink } from '$lib/utils/guilded-media';
	import { Avatar } from '@skeletonlabs/skeleton';

    export let data
    const {appManagers} = data
</script>

<div class="flex flex-col gap-4">
    <h2 class="h2">
        Authorized Apps
    </h2>
    <div class="flex justify-evenly flex-wrap gap-1">
    {#each appManagers as appManager}
            <a href={`/settings/authorized-apps/${appManager.app.id}`} class="card card-hover container bg-initial overflow-hidden flex flex-col w-[420px] justify-self-center">
                <header class=" min-h-[210px]">
                <img src={appManager.app.banner} alt="User Banner" class="w-full aspect-[21/9] object-cover">
                </header>
                <div class="w-full p-8 overflow-visible">
                <div class="flex -translate-y-24 gap-4 overflow-visible">
                    <div class="grid justify-center">
                    <Avatar src={appManager.app.icon} width="w-[100px]" />
                    </div>
                    <h2 class="h2 flex items-center ">
                        {appManager.app.name}
                    </h2>
                </div>
                <div class="-translate-y-20">
                    <h4 class="h4">
                        Description
                    </h4>
                    <p class="p">
                        {appManager.app.description}
                        </p>
                </div>
                </div>
                <div class=" mt-auto">
                    <hr class="opacity-50">
                    <footer class="p-4">
                        <div class="flex justify-between">
                            <div class="flex gap-4 items-center">
                                <Avatar src={guildedMediaLink(appManager.app.ownerUser.avatar)} width="w-[75px]" />
                                <div class="flex flex-col">
                                    <small>
                                        Created By: {appManager.app.ownerUser.username}
                                    </small>
                                    <small>
                                        Created At: {appManager.app.createdAt.toLocaleString()}
                                    </small>
                                    {#if appManager.app.supportServer != ''} 
                                        <small>
                                            App Support: <a href={appManager.app.supportServer} target="_blank" rel="noopener noreferrer">{appManager.app.supportServer}</a>
                                        </small>
                                    {/if}
                                </div>
                            </div>
                        </div>
                    </footer>
                </div>
            </a>
            {/each}
        </div>
    {#if appManagers.length < 1}
        <p class="p text-error-500">
            You have no authorized apps.
        </p>
    {/if}
</div>