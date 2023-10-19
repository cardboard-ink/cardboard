<script lang="ts">
	import AvatarInput from '$lib/client/ui/AvatarInput.svelte';
	import BannerInput from '$lib/client/ui/BannerInput.svelte';
	import { toastStore, type ToastSettings } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';
    import {clipboard} from '@skeletonlabs/skeleton'

    export let data;

    const {app} = data
    const {form, errors, constraints} = superForm(app);

    $: regeneratedSecret = '';
    
    const newSecret = async (id: string) => {
        const req = await fetch(`/settings/your-apps/${id}/secret`, {
        method: 'PATCH',
        }).catch(() =>
        toastStore.trigger({
            message: 'Failed to update secret!',
            background: 'variant-filled-error',
            timeout: 3000,
        })
        );
        if (!req) return;
        const data = await req.json().catch(() => {
        toastStore.trigger({
            message: 'Failed to update secret, please update again!',
            background: 'variant-filled-error',
            timeout: 3000,
        });
        });
        regeneratedSecret = data.secret;
        toastStore.trigger({
            message: 'Successfully updated secret, please copy to clipboard!',
            background: 'variant-filled-success',
            timeout: 3000,
        });
    }
    
</script>

<div class="flex flex-col gap-4">
    <h2 class="h2">
        Editing ➡️ {app.name}
    </h2>
    <h6 class="h6">Note:</h6>
    <p>Carboard currently only supports up to 512KBs of request body size per app update, this should not harm much functionality, however please use compressed images and try splitting the update id you do encounter any errors.</p>
    <div class="flex flex-col gap-4">
        <form class="flex flex-col card p-4 gap-4 justify-center" style="position: relative; height: 73rem" action="?/updateApp" method="post">
            <div class="w-full flex justify-center">
                <div style="position: absolute; top:1rem; padding: 0.5rem; transform: translateY(2.5%)">
                    <BannerInput name="banner" value={$form.banner} />
                </div>
            </div>
            <div class="flex flex-col p-4 gap-4 justify-center" style="transform: translateY(15rem)">
                <div class="w-full flex justify-center">
                    <AvatarInput name="icon" value={$form.icon} />
                </div>
                <label for="name" class="label">
                    <span>App Name</span>
                    <input class="input" type="text" name="name" required bind:value={$form.name} {...$constraints.name} placeholder="Enter app name..." />
                    {#if $errors.name}
                        <p class="p text-error-500">{$errors.name}</p>
                    {/if}
                </label>
                <label for="redirectUri" class="label">
                    <span>Redirect URI</span>
                    <input class="input" type="text" name="redirectUri" required bind:value={$form.redirectUri} {...$constraints.redirectUri}  placeholder="Enter redirect URI..." />
                    {#if $errors.redirectUri}
                        <p class="p text-error-500">{$errors.redirectUri}</p>
                    {/if}
                </label>
                <label for="supportServer" class="label">
                    <span>Support Server</span>
                    <input class="input" type="text" name="supportServer" bind:value={$form.supportServer} {...$constraints.supportServer}  placeholder="Enter support server link..." />
                    {#if $errors.supportServer}
                        <p class="p text-error-500">{$errors.supportServer}</p>
                    {/if}
                </label>
                <label for="vanityCode" class="label">
                    <span>Vanity Code</span>
                    <input class="input" type="text" name="vanityCode" bind:value={$form.vanityCode} {...$constraints.vanityCode}  placeholder="cardboard.ink/a/code (leave blank for random)" />
                    {#if $errors.vanityCode}
                        <p class="p text-error-500">{$errors.vanityCode}</p>
                    {/if}
                </label>
                <label for="description" class="label">
                    <span>Description</span>
                    <textarea class="input textarea" name="description" bind:value={$form.description} {...$constraints.description}  placeholder="Enter app description..." />
                    {#if $errors.description}
                        <p class="p text-error-500">{$errors.description}</p>
                    {/if}
                </label>
                <button class="btn variant-filled" type="submit">
                    Update App
                </button>
            </div>
        </form>
        <div class="w-full flex justify-center gap-4 flex-wrap">
            <div class="flex flex-col">
                <button class="btn variant-filled-secondary" on:click={() => newSecret(app.id)}>Get New Secret</button>
                {#if regeneratedSecret !== ''}
                    <code class="flex gap-1 items-center">
                        <span class="p">{regeneratedSecret}</span>
                        <button class="btn btn-icon" use:clipboard={regeneratedSecret}>
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="12px" class="fill-token"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 448H64V224h64V160H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64zm-64-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"/></svg>
                        </button>
                    </code>
                {/if}
            </div>
        </div>
        <form class="w-full flex justify-center" action="?/deleteApp" method="post">
            <button class="btn variant-filled-error">Delete App</button>
        </form>
    </div>
</div>
