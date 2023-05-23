<script lang="ts">
  import { page } from '$app/stores'
</script>

<h1>Home</h1>

{#if $page.data.user}
  <p class="p">Welcome {$page.data.user.displayName}! 👋</p>
{:else}
  <p class="p">Welcome! 👋</p>
{/if}
