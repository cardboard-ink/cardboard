<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
    export let data;
    const {form, errors, constraints} = superForm(data.form);
</script>
<h1>
    Create an app
</h1>
<form class="flex flex-col gap-4" method="post" action="?/newApp" >
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
    <button class="btn variant-ghost-primary" type="submit">
        Create App
    </button>
</form>