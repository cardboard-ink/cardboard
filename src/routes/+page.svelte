<script lang="ts">
  import { page } from '$app/stores'
</script>

<h2>Home</h2>

{#if $page.data.user}
  <p class="p">Welcome {$page.data.user.displayName}! 👋</p>
{:else}
  <p class="p">Welcome! 👋</p>
{/if}
