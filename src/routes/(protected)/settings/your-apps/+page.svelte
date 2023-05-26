<script lang="ts">
  import { Avatar, clipboard, modalStore } from '@skeletonlabs/skeleton';
  import type { ModalComponent, ModalSettings } from '@skeletonlabs/skeleton';
	import type { PageData } from './$types';
	import { goto } from '$app/navigation';

  export let data: PageData;

  const {myApps} = data;

</script>

<div class="flex s"></div>
<div class="flex w-full gap-4">
  <h2 class="h2">
    Your Apps
  </h2>
  <a class="btn-icon w-16" href="/settings/your-apps/new">
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512" width="32px" class="fill-token">
      <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z"/>
    </svg>
  </a>
</div>
<div class="flex flex-col gap-4">
  {#each myApps as app}
    <a href={`/settings/your-apps/${app.id}`} class=" block card card-hover p-4 overflow-hidden w-full justify-normal text-base" style={`background-image: url(${app.banner}); background-position: center center; background-repeat: no-repeat; background-size: cover; backdrop-filter: blur(10px); -webkit-backdrop-filter: blur(10px);`}>
      <div class="flex justify-between w-full">
        <header class="flex gap-4 w-max">
          <Avatar src={app.icon} />
          <h3 class="h3">
            {app.name}
          </h3>
        </header>
        <main class="flex items-center justify-end w-full gap-4 pl-4 pr-4 ">
          <div class="flex gap-4">
            <h5 class="h5">
              {app.id}
            </h5>
            <button class="btn btn-icon variant-ghost-primary rounded-md" use:clipboard={app.id}>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="24px" class="fill-token"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M288 448H64V224h64V160H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64zm-64-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"/></svg>
            </button>
          </div>
          <button class="btn variant-ghost-error rounded-md" use:clipboard={app.secret}>
            <span class="flex gap-2 w-fit">
              Copy Secret
              <svg xmlns="http://www.w3.org/2000/svg" width="24px" class="fill-token" viewBox="0 0 512 512"><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path d="M336 352c97.2 0 176-78.8 176-176S433.2 0 336 0S160 78.8 160 176c0 18.7 2.9 36.8 8.3 53.7L7 391c-4.5 4.5-7 10.6-7 17v80c0 13.3 10.7 24 24 24h80c13.3 0 24-10.7 24-24V448h40c13.3 0 24-10.7 24-24V384h40c6.4 0 12.5-2.5 17-7l33.3-33.3c16.9 5.4 35 8.3 53.7 8.3zM376 96a40 40 0 1 1 0 80 40 40 0 1 1 0-80z"/></svg>
            </span>
          </button>
        </main>
        <footer class="flex align-middle">
          <div class="flex gap-4">
            <a class="btn variant-ghost-secondary rounded-md py-0" href={`/settings/your-apps/${app.id}`}>
              Edit
            </a>
            <a class="btn-icon variant-ghost-surface" href={`/a/${app.vanityCode}`}>
              <svg xmlns="http://www.w3.org/2000/svg" width="16px" viewBox="0 0 512 512" class="fill-token">
                <path d="M352 0c-12.9 0-24.6 7.8-29.6 19.8s-2.2 25.7 6.9 34.9L370.7 96 201.4 265.4c-12.5 12.5-12.5 32.8 0 45.3s32.8 12.5 45.3 0L416 141.3l41.4 41.4c9.2 9.2 22.9 11.9 34.9 6.9s19.8-16.6 19.8-29.6V32c0-17.7-14.3-32-32-32H352zM80 32C35.8 32 0 67.8 0 112V432c0 44.2 35.8 80 80 80H400c44.2 0 80-35.8 80-80V320c0-17.7-14.3-32-32-32s-32 14.3-32 32V432c0 8.8-7.2 16-16 16H80c-8.8 0-16-7.2-16-16V112c0-8.8 7.2-16 16-16H192c17.7 0 32-14.3 32-32s-14.3-32-32-32H80z"/>
              </svg>
            </a>
          </div>
        </footer>
      </div>
    </a>
  {/each}
</div>
{#if myApps.length === 0}
  <div class="card p-4">
    <h3 class="h3">
      You don't have any apps yet.
    </h3>
    <p>
      Create one by clicking the + icon above.
    </p>
  </div>
{/if}