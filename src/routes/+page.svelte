<script lang="ts">
  import { page } from '$app/stores'

  function greeting () {
    // Simple function to return a greeting based on the time of day
    const date = new Date()
    const hours = date.getHours()
    if (hours < 12) {
      return 'Good morning'
    } else if (hours < 18) {
      return 'Good afternoon'
    } else {
      return 'Good evening'
    }
  }

</script>

<main class="px-4">
  <h2 class="h2">Home</h2>
  {#if $page.data.user}
    <p class="p">{greeting()}, {$page.data.user.displayName}! 👋</p>
  {:else}
    <h2 class="p">Howdy! 👋</h2>
    <p>Welcome to CardBoard, the all in one Guilded authentication and API serivce. Get started by signing in!</p>
    <a href="/login"><button class="rounded bg-primary-500 p-2">Sign in</button></a>
  {/if}
  <div class="flex flex-col gap-4 mb-4 md-4 relative">
    {#if $page.data.user}
      <br>
      <a href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374610">
        <button class="rounded bg-primary-500 p-2">Learn the ropes of CardBoard. ✨</button>
      </a>
      <br>
      <a href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374610">
        <button class="rounded bg-primary-500 p-2">Get started with developing on CardBoard. 💻</button>
      </a>
    {/if}
  </div>
</main>
