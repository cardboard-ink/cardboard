<script lang="ts">
	import { Avatar } from '@skeletonlabs/skeleton';

    export let data

    const {app} = data
</script>

<h2 class="h2">
    Authorizing
</h2>

<div class="flex justify-center">
  <div class="card card-hover container bg-initial overflow-hidden flex flex-col lg:w-[75%] md:w-full justify-self-center">
    <header class="min-h-[210px]">
      <img src={app.banner} alt="User Banner" class="bg-black/50 w-full object-cover">
    </header>
    <div class="w-full p-8 overflow-visible">
      <div class="flex -translate-y-20 gap-4 overflow-visible">
        <div class="grid justify-center">
          <Avatar src={app.icon} width="w-[100px]" />
        </div>
        <h2 class="flex items-end ">
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
                    <small>
                        App Trusted By: {app.authorizedSessions.length} user(s)
                    </small>
                </div>
            </div>
            <div class="flex gap-4">
                {#if app.supportServer != ''} 
                <div class="flex items-center">
                    <a class="btn variant-ghost-secondary rounded-md" href={app.supportServer} target="_blank" rel="noopener noreferrer">Support Server</a>
                </div>
                {/if}
                <form class="flex items-center" action="?/authorizeApp" method="post">
                    <button class="btn variant-ghost-primary rounded-md" type="submit">Authorize ⏩</button>
                </form>
            </div>
        </div>
    </footer>
  </div>
</div>