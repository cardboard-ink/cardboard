<script lang="ts">
  export let data

  const sessions = data.activeSessions
</script>

<h2 class="h2">
  Manage Your Cardboard Sessions
</h2>

{#if sessions.length === 0}
  <p class="p">
    You have no active sessions.
  </p>
{:else}
  <ul>
    {#each sessions as session}
      <li>
        <div class="card card-hover bg-initial modal p-4 m-2 gap-4 rounded-md md:flex-col md:h-fit lg:flex-row lg:h-24 flex items-center lg:w-fit">
          <div class=" w-16">
            {#if session.current}
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512" class="current fill-token">
              <path d="M316.9 18C311.6 7 300.4 0 288.1 0s-23.4 7-28.8 18L195 150.3 51.4 171.5c-12 1.8-22 10.2-25.7 21.7s-.7 24.2 7.9 32.7L137.8 329 113.2 474.7c-2 12 3 24.2 12.9 31.3s23 8 33.8 2.3l128.3-68.5 128.3 68.5c10.8 5.7 23.9 4.9 33.8-2.3s14.9-19.3 12.9-31.3L438.5 329 542.7 225.9c8.6-8.5 11.7-21.2 7.9-32.7s-13.7-19.9-25.7-21.7L381.2 150.3 316.9 18z"/>
            </svg>
            {/if}
          </div>
          <div class="details">
            <div class="flex flex-col gap-1 items-center lg:flex-row">
              <span class="flex gap-1">
                <strong>
                  Created At:
                </strong>
                <p class="p">
                  {session.createdAt}
                </p>
              </span>
            </div>
            <div class="flex flex-col gap-1 items-center lg:flex-row">
              <span class="flex gap-1">
                <strong>
                  Expires At:
                </strong>
                <p class="p">
                  {session.expiresAt}
                </p>
              </span>
            </div>
          </div>
          <form class=" w-12" action="?/revoke" method="POST">
          {#if !session.current}
            <input type="hidden" name="identifier" value={session.id} />
            <button class="btn btn-icon" type="submit">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" class="revoke fill-token">
                <path d="M135.2 17.7L128 32H32C14.3 32 0 46.3 0 64S14.3 96 32 96H416c17.7 0 32-14.3 32-32s-14.3-32-32-32H320l-7.2-14.3C307.4 6.8 296.3 0 284.2 0H163.8c-12.1 0-23.2 6.8-28.6 17.7zM416 128H32L53.2 467c1.6 25.3 22.6 45 47.9 45H346.9c25.3 0 46.3-19.7 47.9-45L416 128z"/>
              </svg>
            </button>
            {/if}
          </form>
        </div>
      </li>
    {/each}
  </ul>
{/if}

<style lang="postcss">
  svg {
      width: 64px;
    }
</style>