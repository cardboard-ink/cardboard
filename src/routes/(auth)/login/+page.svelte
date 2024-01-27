<script lang="ts">
	import { page } from "$app/stores";
	import { guildedMediaLink } from "$lib/utils/guilded-media";
	import { Avatar } from "@skeletonlabs/skeleton";
	import { onMount } from "svelte";

  let userSearch = "";

  type aboutInfo = {
    bio: string;
    tagline: string;
  }

  type User = {
    id: string;
    name: string;
    lastOnline: string;
    profilePicture?: string;
    aboutInfo?: aboutInfo;
    gameIds?: number[];
  }

  let users: User[] = [];

  const searchForUsername = async() => {
    fetch(`https://www.guilded.gg/api/search?query=${userSearch}&entityType=user&maxResultsPerType=20`, {method: "GET"}).then(async(res) => {
      const data = await res.json()
      users = data.results.users;
      users = users.map((user: User) => {
        return {
          ...user,
          profilePicture: guildedMediaLink(user.profilePicture ?? "/poop.png")
        }
      })
      if (userSearch == "") {
        users = [];
      }
    });
  }

  let message: string | null
  let redirectTo: string | null

  $: message = ''
  $: redirectTo = ''

  onMount(() => {
    redirectTo = $page.url.searchParams.get('redirectTo') 
    message = $page.url.searchParams.get('message') 
  })

</script>

<main class="px-8 flex flex-col gap-4">
  {#if message}
  <p class="text-error-500">
    {message}
  </p>
  {/if}
  <h2 class="h1">Link Guilded</h2>
  <p class="p">
    We need to <strong>verify</strong> your identity!
    Please complete following steps to confirm your identity:
  </p>
  <ol class="list-decimal">
    <li>
      Make sure you are signed in to <strong>Guilded</strong> with the <strong>Guilded</strong> account you choose on this page.
    </li>
    <li>
      Why do we need you to do this? <a href="/info" target="_blank">Read Here</a>.
    </li>
  </ol>
  <div class="md:w-full lg:w-1/2">
    <label class="label snap-center" for="Guilded Username">Guilded Username</label>
    <input class="input" id="Guilded Username" name="Guilded Username" type="text" placeholder="Username" bind:value={userSearch} on:keyup={() => searchForUsername()} />
  </div>
  
  <div class="max-h-80 overflow-y-auto w-full lg:w-1/2 overflow-x-visible">
    <dl class="list-dl mt-5">
      {#each users as user}
      <form action={`?/linkGuilded${redirectTo ? "&redirectTo=" + redirectTo : ''}`} method="POST">
        <label for="guildedId" />
        <input type="text" class="hidden" name="guildedId" value={user.id} />
        <button class="btn w-full flex flex-row card card-hover variant-glass" type="submit">
          <Avatar src={guildedMediaLink(user.profilePicture ?? "/poop.png")} fallback={"/poop.png"} />
          <span class="flex-auto">
            <dt>{user.name}</dt>
            <dl>{user.id}</dl>
          </span>
          <a class="btn-icon" href={`https://www.guilded.gg/profile/${user.id}`} target="_blank">
            <svg xmlns="http://www.w3.org/2000/svg" style="width: 16px;" viewBox="0 0 512 512" class="fill-token">
              <!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. -->
              <path d="M320 0c-17.7 0-32 14.3-32 32s14.3 32 32 32h82.7L201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L448 109.3V192c0 17.7 14.3 32 32 32s32-14.3 32-32V32c0-17.7-14.3-32-32-32H320zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/>
            </svg>
          </a>
        </button>
      </form>
      {/each}
    </dl>
  </div>

  <h3 class="h3">Or</h3>
  <form action={`?/linkGuilded${redirectTo ? "&redirectTo=" + redirectTo : ''}`} method="post" class="flex flex-col gap-4 w-full lg:w-1/2">
    <label for="guildedId">
      Enter your Guilded ID directly
      <input type="text" name="guildedId" class="input" placeholder="EdV9p2a4" />
    </label>
    <button class="btn variant-ghost-surface" type="submit">Link Guilded</button>
  </form>
</main>