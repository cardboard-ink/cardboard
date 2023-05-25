<script lang="ts">
	import AvatarInput from '$lib/client/ui/AvatarInput.svelte';
	import BannerInput from '$lib/client/ui/BannerInput.svelte';
	import { clipboard } from '@skeletonlabs/skeleton';
	import { superForm } from 'sveltekit-superforms/client';

    export let data;

    const {app} = data
    const {form, errors, constraints} = superForm(app);
    
</script>

<h2>
    Editing ➡️ {app.name}
</h2>

<div class="flex flex-col gap-4">
    <form class="flex flex-col card p-4 gap-4 justify-center" style="height: min-height" action="?/updateApp" method="post">
        <div class="w-full flex justify-center translate-y-20">
            <BannerInput name="banner" value={$form.banner} height={540} width={960} />
        </div>
        <div class=" -translate-y-14 flex flex-col p-4 gap-4 justify-center">
            <div class="w-full flex justify-center">
                <AvatarInput name="icon" value={$form.icon} />
            </div>
            <label for="name" class="label">
                <span>App Name</span>
                <input class="input" type="text" name="name" required bind:value={$form.name} {...$constraints.name} placeholder="Enter app name..." />
                {#if $errors.name}
                    <p class=" text-error-500">{$errors.name}</p>
                {/if}
            </label>
            <label for="redirectUri" class="label">
                <span>Redirect URI</span>
                <input class="input" type="text" name="redirectUri" required bind:value={$form.redirectUri} {...$constraints.redirectUri}  placeholder="Enter redirect URI..." />
                {#if $errors.redirectUri}
                    <p class=" text-error-500">{$errors.redirectUri}</p>
                {/if}
            </label>
            <label for="supportServer" class="label">
                <span>Support Server</span>
                <input class="input" type="text" name="supportServer" bind:value={$form.supportServer} {...$constraints.supportServer}  placeholder="Enter support server link..." />
                {#if $errors.supportServer}
                    <p class=" text-error-500">{$errors.supportServer}</p>
                {/if}
            </label>
            <label for="vanityCode" class="label">
                <span>Vanity Code</span>
                <input class="input" type="text" name="vanityCode" bind:value={$form.vanityCode} {...$constraints.vanityCode}  placeholder="cardboard.com/a/code (leave blank for random)" />
                {#if $errors.vanityCode}
                    <p class=" text-error-500">{$errors.vanityCode}</p>
                {/if}
            </label>
            <label for="description" class="label">
                <span>Description</span>
                <textarea class="input" name="description" bind:value={$form.description} {...$constraints.description}  placeholder="Enter app description..." />
                {#if $errors.description}
                    <p class=" text-error-500">{$errors.description}</p>
                {/if}
            </label>
            <button class="variant-filled" type="submit">
                Update App
            </button>
        </div>
    </form>
    <form class="w-full flex justify-center gap-4" action="?/regenerateSecret" method="post">
        <button class="variant-filled-secondary" type="submit">Regenerate Secret</button>
        <button class="variant-ghost-success" use:clipboard={$form.secret} type="button">Copy Secret</button>
    </form>
    <form class="w-full flex justify-center" action="?/deleteApp" method="post">
        <button class="variant-filled-error">Delete App</button>
    </form>
</div>