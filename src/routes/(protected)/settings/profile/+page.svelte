<script lang="ts">
  import {page} from '$app/stores'
	import { enhance } from '$app/forms'
	import TextInput from '$lib/client/ui/TextInput.svelte'
	import AvatarInput from '$lib/client/ui/AvatarInput.svelte'

	export let form

  $: displayName = $page.data.user.displayName
  $: avatar = $page.data.user.avatar
  $: username = $page.data.user.name
</script>


<h1>Edit Profile</h1>
<div class="forms-container">
  <form action="?/updateAvatar" method="POST" use:enhance>
    <AvatarInput name="avatar" value={avatar} size={100} />
    <button class="variant-filled-surface  h-10" type="submit">Update Avatar</button>
  </form>
  
  <form action="?/updateUsername" method="POST" use:enhance>
    <TextInput name="username" required placeholder={username} />
    <button class="variant-filled-surface  h-10" type="submit">Update Username</button>
  </form>
  
  <form action="?/updateDisplayName" method="POST" use:enhance>
    <TextInput name="displayName" placeholder={displayName !== '' ? displayName : "Display Name"} required />
    <button class="variant-filled-surface h-10" type="submit">Update Display Name</button>
  </form>
</div>


<style lang="postcss">
  button {
    @apply variant-filled-surface rounded-md px-4 py-0;
  }
  form {
    align-items: center;
    display: flex;

    flex-direction: column;
    justify-content: center;
    gap: 16px;
  }
  .forms-container {
    display: flex;
    flex-direction: column;
    gap: 32px;
    align-items: center;
    justify-content: center;
  }
</style>