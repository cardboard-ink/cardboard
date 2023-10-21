<script lang="ts">
	import { superForm } from 'sveltekit-superforms/client';
    export let data;
    const {form, errors, constraints} = superForm(data.form);
    function urlBoxes(callingObject) {
        if (callingObject.name === "redirectUri" || callingObject.name === "supportServer") {
            if (callingObject.name === "redirectUri") {
                $form.redirectUri = callingObject.value.toLowerCase()
            } else if (callingObject.name === "supportServer") {
                $form.supportServer = callingObject.value.toLowerCase()
            }
            if (callingObject.value.toLowerCase().startsWith("https://")) {
                callingObject.value = callingObject.value.split("https://")[1]
                document.getElementsByName(callingObject.name)[0].innerText = "https://"
            } else if (callingObject.value.toLowerCase().startsWith("http://")) {
                document.getElementsByName(callingObject.name)[0].innerText = "http://"
                callingObject.value = callingObject.value.split("http://")[1]
            } 
        } else if (callingObject.name === "vanityCode" && callingObject.value.includes("cardboard.ink/a/")){
            $form.vanityCode = callingObject.value.split("cardboard.ink/a/")[1]
            callingObject.value = callingObject.value.split("cardboard.ink/a/")[1]
        }
    }
</script>
<h1 class="h1">
    Create an app
</h1>
<form id="app-creation" class="flex flex-col gap-4" method="post" action="?/newApp" >
    <script>
        
    </script>
    <label for="name" class="label">
        <span>App Name</span>
        <input class="input" type="text" name="name" required bind:value={$form.name} {...$constraints.name} placeholder="Enter app name..." />
        {#if $errors.name}
            <p class="p text-error-500">{$errors.name}</p>
        {/if}
    </label>
    <label for="redirectUri" class="label">
        <span>Redirect URI</span>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div name="redirectUri" class="input-group-shim" >https://</div>
            <input  type="text" name="redirectUri" required {...$constraints.redirectUri}  placeholder="Enter redirect URI..." on:change={(e) => urlBoxes(e.target)}/>
        </div>
        {#if $errors.redirectUri}
            <p class="p text-error-500">{$errors.redirectUri}</p>
        {/if}
    </label>
    <label for="supportServer" class="label">
        <span>Support Server</span>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div name="supportServer" class="input-group-shim" >https://</div>
            <input type="text" name="supportServer" {...$constraints.supportServer}  placeholder="Enter support server link..." on:change={(e) => urlBoxes(e.target)}/>
        </div>
        {#if $errors.supportServer}
            <p class="p text-error-500">{$errors.supportServer}</p>
        {/if}
    </label>
    <label for="vanityCode" class="label">
        <span>Vanity Code</span>
        <div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
            <div class="input-group-shim">https://www.cardboard.ink/a/</div>
            <input type="text" name="vanityCode" {...$constraints.vanityCode}  placeholder="(leave blank for random)" on:change={(e) => urlBoxes(e.target)}/>
        </div>
        {#if $errors.vanityCode}
            <p class="p text-error-500">{$errors.vanityCode}</p>
        {/if}
    </label>
    <button class="btn variant-ghost-primary" type="submit">
        Create App
    </button>
</form>