<script lang="ts">
  import { page } from '$app/stores'

  const getRandomFromList = (list: string[]) => {
    return list[Math.floor(Math.random() * list.length)]
  }

  const firstGifs = [
    "https://media.giphy.com/media/l4KibK3JwaVo0CjDO/giphy.gif",
    "https://media.giphy.com/media/2zlSwREmLmiQw/giphy.gif",
    "https://media.giphy.com/media/26FPzWY5I6WqElJC0/giphy.gif",
    "https://media.giphy.com/media/26FPzWY5I6WqElJC0/giphy.gif",
    "https://media.giphy.com/media/TeinpBGRY5UOc/giphy.gif",
    "https://media.giphy.com/media/10SAlsUFbyl5Dy/giphy.gif",
    "https://media.giphy.com/media/QXxAGtM56RP6E/giphy.gif",
    "https://media.giphy.com/media/69ocantqVQ1QaTmmRi/giphy.gif",
    "https://media.giphy.com/media/FmNXeuoadNTpe/giphy.gif",
    "https://media.giphy.com/media/9g99U7FIvhlRK/giphy.gif",
    "https://media.giphy.com/media/3sLiXWTj8WXNC/giphy.gif",
    "https://media.giphy.com/media/rgRE8JPdHVMIg/giphy.gif",
    "https://media.giphy.com/media/4DGztqNBGyVJ6/giphy.gif",
    "https://media.giphy.com/media/b9TLVAyi8U6wE/giphy.gif",
    "https://media.giphy.com/media/KRB0DCpSFQeT6/giphy.gif"
  ]


</script>

<main class="px-4">
  <h2 class="h2">Home</h2>
  {#if $page.data.user}
    <p class="p">Welcome {$page.data.user.displayName}! 👋</p>
  {:else}
    <p class="p">Welcome! 👋</p>
  {/if}
  <div class="flex flex-col gap-4 mb-4 md-4 relative">
    <a href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374601">
      <h3>
        What is CardBoard? 🤯
      </h3>
    </a>
    <a href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374604">
      <h3>
          How to use? 😋
        </h3>
      </a>
      <a href="https://www.guilded.gg/CardBoard/groups/3y446Rmz/channels/4539a4f9-fb51-4a23-b014-0fcaeaf062d3/docs/374610">
        <h3>
          How to develop on it? 💀
        </h3>
      </a>
    </div>
    <img class="rounded h-64 object-scale-down" src={getRandomFromList(firstGifs)} alt="Box">
</main>
