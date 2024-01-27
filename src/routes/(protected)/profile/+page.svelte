<script lang="ts">
  import {page} from '$app/stores'
	import { guildedMediaLink } from '$lib/utils/guilded-media';
	import { Avatar } from '@skeletonlabs/skeleton';

  $: displayName = $page.data.user.displayName
  $: avatar = guildedMediaLink($page.data.user.avatar)
  $: banner = guildedMediaLink($page.data.user.banner)
</script>


<h1 class="h1">Your Profile</h1>
<div class="flex justify-center">
  <div class="card card-hover bg-initial overflow-hidden flex flex-col lg:w-[75%] md:w-full justify-self-center">
    <header>
      <img src={banner} alt="User Banner" class="bg-black/50 w-full aspect-[21/9]">
    </header>
    <div class="grid justify-center">
      <div class="flex-col flex -translate-y-9">
        <div class="grid justify-center">
          <Avatar src={avatar} width="w-[100px]" />
        </div>
        <h3 class="h3">
          {displayName}
        </h3>
      </div>
    </div>
    <footer>
      <hr class="opacity-50">
    </footer>
  </div>
</div>