<script lang="ts">
	import { page } from '$app/stores';
	import { Avatar } from '@skeletonlabs/skeleton';

    export let data

    const {app, redirect_uri} = data

    let redirect_uri_here: string | null;
    let scope: string | null;
    let state: string | null;
    let response_type: string | null;

    if (redirect_uri) {
      redirect_uri_here = $page.url.searchParams.get('redirect_uri')
      scope = $page.url.searchParams.get('scope')
      state = $page.url.searchParams.get('state')
      response_type = $page.url.searchParams.get('response_type')
    }
</script>

<h2 class="h2">
    Authorizing
</h2>

<div class="flex justify-center mt-4">
  <div class="card card-hover container bg-initial overflow-hidden flex flex-col lg:w-[75%] md:w-full justify-self-center">
    <header class="min-h-[210px]">
      <img src={app.banner} alt="User Banner" class="w-full aspect-[21/9] object-cover">
    </header>
    <div class="w-full p-8 overflow-visible">
      <div class="flex -translate-y-20 gap-4 overflow-visible">
        <div class="grid justify-center">
          <Avatar src={app.icon} width="w-[100px]" />
        </div>
        <h2 class="h2 mt-10 flex items-center">
            {app.name}
        </h2>
      </div>
      <div class="-translate-y-20 min-h-[150px] overflow-y-auto">
          <h3 class="h3">
            Description
          </h3>
          <p class="p">
            {app.description}
            </p>
      </div>
    </div>
    <hr class="opacity-50">
    <footer class="p-4">
        <div class="flex justify-between">
            <div class="flex gap-4 items-center">
                <Avatar src={app.ownerUser.avatar} width="w-[75px]" />
                <div class="flex flex-col">
                    <small>
                        Created By: {app.ownerUser.username}
                    </small>
                    <small>
                        Created At: {app.createdAt.toLocaleString()}
                    </small>
                    {#if app.supportServer != ''}
                    <small>
                        App Support: <a href={app.supportServer} target="_blank" rel="noopener noreferrer">{app.supportServer}</a>
                    </small>
                    {/if}
                </div>
            </div>
            <div class="flex gap-4">
                <form class="flex items-center" action={`?/authorizeApp${redirect_uri ?? `&redirect_uri=${redirect_uri_here}&scope=${scope}&state=${state}&response_type=${response_type}`}`} method="post">
                    <button class="btn variant-ghost-primary rounded-md" type="submit">Authorize ⏩</button>
                </form>
            </div>
        </div>
    </footer>
  </div>
</div>