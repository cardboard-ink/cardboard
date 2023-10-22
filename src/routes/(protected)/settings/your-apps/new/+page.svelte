<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
    export let data;
    var name: string, redirectUri: string, supportServer: string, vanityCode: string
    const {form, errors, constraints} = superForm(data.form);

    function removePrefix(input: any) {
        if (input.value.toLowerCase().startsWith("https://")) {
            input.value = input.value.split("https://")[1]
            document.getElementsByName(input.name)[0].innerText = "https://"
        } else if (input.value.toLowerCase().startsWith("http://")) {
            input.value = input.value.split("http://")[1]
            document.getElementsByName(input.name)[0].innerText = "http://"
        } else if (input.name === 'vanityCode' && input.value.includes("cardboard.ink/a/")) {
            input.value = input.value.split("cardboard.ink/a/")[1]
        }
    }

    function handleRedirectUri(this: any) {
        removePrefix(this)
        redirectUri = document.getElementsByName('redirectUri')[0].innerText + document.getElementsByName('redirectUri')[1].value
    }

    function handleSupportServer(this: any) {
        removePrefix(this)
        supportServer = document.getElementsByName('supportServer')[0].innerText + document.getElementsByName('supportServer')[1].value
    }

    function handleVanityCode(this: any) {
        removePrefix(this)
        vanityCode = document.getElementsByName('vanityCode')[1].value
    }

    async function submit() {
        console.log(name + " " + redirectUri + " " + supportServer + " " + vanityCode)
        
    }
</script>
<h1 class="h1">
    Create an app
</h1>
<form id="app-creation" class="flex flex-col gap-4"  >
    <label for="name" class="label">
        <span>App Name</span>
        <input class="input" type="text" name="name" required bind:value="{name}" {...$constraints.name} placeholder="Enter app name..." />
        {#if $errors.name}
            <p class="p text-error-500">{$errors.name}</p>
        {/if}
    </label>
    <label for="redirectUri" class="label">
        <span>Redirect URI</span>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div name="redirectUri" class="input-group-shim" >https://</div>
            <input  type="text" name="redirectUri" required {...$constraints.redirectUri}  placeholder="Enter redirect URI..." on:change={handleRedirectUri}/>
        </div>
        {#if $errors.redirectUri}
            <p class="p text-error-500">{$errors.redirectUri}</p>
        {/if}
    </label>
    <label for="supportServer" class="label">
        <span>Support Server</span>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div name="supportServer" class="input-group-shim" >https://</div>
            <input type="text" name="supportServer" {...$constraints.supportServer}  placeholder="Enter support server link..." on:change={handleSupportServer}/>
        </div>
        {#if $errors.supportServer}
            <p class="p text-error-500">{$errors.supportServer}</p>
        {/if}
    </label>
    <label for="vanityCode" class="label">
        <span>Vanity Code</span>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div name="vanityCode" class="input-group-shim">https://www.cardboard.ink/a/</div>
            <input type="text" name="vanityCode" {...$constraints.vanityCode}  placeholder="(leave blank for random)" on:change={handleVanityCode}/>
        </div>
        {#if $errors.vanityCode}
            <p class="p text-error-500">{$errors.vanityCode}</p>
        {/if}
    </label>
    <button class="btn variant-ghost-primary" type="submit" on:click={submit}>
        Create App
    </button>
</form>