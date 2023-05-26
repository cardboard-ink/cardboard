<script lang="ts">
	import { Avatar } from "@skeletonlabs/skeleton";

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
      if (userSearch == "") {
        users = [];
      }
    });
  }
</script>

<main class="px-8">
  <h1 class="h1">Login to Guilded</h1>
  <div class="md:w-full lg:w-1/2">
    <label class="label snap-center" for="Guilded Username">Guilded Username</label>
    <input class="input" id="Guilded Username" name="Guilded Username" type="text" placeholder="Username" bind:value={userSearch} on:keyup={() => searchForUsername()} />
  </div>
  
  <div class="max-h-80 overflow-y-auto overflow-x-visible">
    <dl class="list-dl mt-5">
      {#each users as user}
      <form action="?/linkGuilded" method="POST">
        <label for="guildedId" />
        <input type="text" class="hidden" name="guildedId" value={user.id} />
        <button class="btn md:w-full lg:w-1/2 flex flex-row card card-hover variant-glass" type="submit">
          <Avatar src={user.profilePicture} fallback={"/poop.png"} />
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
</main>