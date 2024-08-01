<script lang="ts">
	import { page } from '$app/stores';
	import { clipboard } from '@skeletonlabs/skeleton';
	import { onMount } from 'svelte';
	import { CodeBlock } from '@skeletonlabs/skeleton';

	export let data;

	let redirectTo: string | null;
	$: redirectTo = '';

	onMount(() => {
		redirectTo = $page.url.searchParams.get('redirectTo');
	});
</script>

<main class="px-8 flex flex-col items-left w-full gap-4 text-centlefter">
	<h1 class="h1 text-3xl font-bold inter">Is this REALLY You?</h1>
	<p class="p">
		We need to <strong>verify</strong> your identity! Please complete the following steps to confirm
		your identity:
	</p>
	<ol class="text-left">
		<p class="h1 inter text-2xl font-bold">Step 1:</p>
		<li>
			Go to <a href={`https://www.guilded.gg/profile/${data.userId}`} target="_blank"
				>Your Profile</a
			>
		</li>
		<li>
			Make sure you are signed in to the account you chose on the previous page and click on <br />
			<strong>"Write a post"</strong>
		</li>
		<img
			src="/proof.png"
			alt="Write a post button location"
			class="my-4 rounded-md ml-4 mx-auto max-w-full h-auto"
		/>
		<li>
			<p class="h1 inter mt-[4rem] text-2xl font-bold">Step 2:</p>
			Make the title of the post
			<CodeBlock
				language="cardboard"
				class="mt-5 w-full sm:w-[22rem] md:w-[22rem] lg:w-[22rem] xl:w-[22rem] w-[19rem]"
				code={`${data.userAuthToken}`}
			>
				<button class="btn variant-ghost-primary btn-icon" use:clipboard={data.userAuthToken}>
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
			</CodeBlock>
		</li>
		<li class="mt-5">
			Click <strong>"Post"</strong> and then press <strong>"Check"</strong> below.
		</li>
	</ol>
	<form
		action={`?/check${redirectTo ? '&redirectTo=' + redirectTo : ''}`}
		method="post"
		class="flex justify-start"
	>
		<button class="btn variant-ghost-primary rounded-md" type="submit">Check</button>
	</form>
</main>
