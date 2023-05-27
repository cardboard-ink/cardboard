<script lang="ts">
  import { page } from '$app/stores'
</script>

<main class="px-4">
  <h2 class="h2">Home</h2>
  {#if $page.data.user}
    <p class="p">Welcome {$page.data.user.displayName}! 👋</p>
  {:else}
    <p class="p">Welcome! 👋</p>
  {/if}
</main>
