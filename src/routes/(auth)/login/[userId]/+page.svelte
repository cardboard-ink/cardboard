<script lang="ts">
	import { page } from '$app/stores';
	import { clipboard } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';

	export let data;

	let redirectTo: string | null;
	$: redirectTo = '';

	onMount(() => {
		redirectTo = $page.url.searchParams.get('redirectTo');
	});
</script>

<main class="px-8 flex flex-col w-full gap-4">
	<h1 class="h1">Are you really who you say you are?</h1>
	<p class="p">
		We need to <strong>verify</strong> your identity! Please complete following steps to confirm your
		identity:
	</p>
	<ol class="list-decimal">
		<li>
			Go to <a href={`https://www.guilded.gg/profile/${data.userId}`} target="_blank"
				>Your Profile</a
			>
		</li>
		<li>
			Make sure you are signed in to the account you chose on the previous page and click on <strong
				>"Write a post"</strong
			>
		</li>
		<li>
			Make the title of the post
			<code style="code flex gap-0.5">
				{data.userAuthToken}
				<button class="btn btn-icon" use:clipboard={data.userAuthToken}>
					<svg
						xmlns="http://www.w3.org/2000/svg"
						viewBox="0 0 512 512"
						width="12px"
						class="fill-token"
						><!--! Font Awesome Pro 6.4.0 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
							d="M288 448H64V224h64V160H64c-35.3 0-64 28.7-64 64V448c0 35.3 28.7 64 64 64H288c35.3 0 64-28.7 64-64V384H288v64zm-64-96H448c35.3 0 64-28.7 64-64V64c0-35.3-28.7-64-64-64H224c-35.3 0-64 28.7-64 64V288c0 35.3 28.7 64 64 64z"
						/></svg
					>
				</button>
			</code>
			. You can fill the body with anything! (Flex being a cool cardboard user!)
		</li>
		<li>
			Click <strong>"Post"</strong> and then press <strong>"Check"</strong> over here.
		</li>
	</ol>
	<form action={`?/check${redirectTo ? '&redirectTo=' + redirectTo : ''}`} method="post">
		<button class="btn variant-ghost-primary rounded-md" type="submit">Check</button>
	</form>
</main>
