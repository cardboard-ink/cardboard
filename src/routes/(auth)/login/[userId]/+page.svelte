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

	let currentStep = 1;

	function showNextStep() {
		currentStep = 2;
	}

	function showPreviousStep() {
		currentStep = 1;
	}
</script>

<main class="px-8 flex flex-col items-left w-full gap-4 text-centlefter">
	<h1 class="h1 text-3xl font-bold ">Is this <i>really</i> you?</h1>
	<p class="p">Before you can access CardBoard we need to verify that you own this account, follow the steps below to verify.</p>

	<ol class="text-left">
		{#if currentStep === 1}
			<p class="h1 text-2xl font-bold">Step 1:</p>
			<li>
				Go to <a href={`https://www.guilded.gg/profile/${data.userId}`} target="_blank" class="font-bold"
					>your profile</a
				> and click "write a post".
			</li>
			<img
				src="/proof.png"
				alt="Write a post button location"
				class="mt-5 mr-[16rem] rounded-md  max-w-full h-auto"
			/>
			<button class="btn variant-ghost-primary mt-5" on:click={showNextStep}>Next</button>
		{:else if currentStep === 2}
			<li>
				<p class="h1 text-2xl font-bold">Step 2:</p>
				Once in the post creator set your post's title to the code below, then click post.
				<CodeBlock
					language="cardboard"
					class="mt-5 w-full sm:w-[22rem] md:w-[22rem] lg:w-[22rem] xl:w-[22rem] w-[19rem]"
					code={`${data.userAuthToken}`}
				>
					<button class="btn variant-ghost-primary btn-icon" use:clipboard={data.userAuthToken}></button>
				</CodeBlock>
			</li>
			<li class="mt-5">
				Click <strong>"Post"</strong> and then press <strong>"Check"</strong> below.
			</li>
			<div class="flex justify-start gap-4 mt-5">
				<button class="btn variant-ghost-primary rounded-md" on:click={showPreviousStep}>Back</button>
				<form
					action={`?/check${redirectTo ? '&redirectTo=' + redirectTo : ''}`}
					method="post"
				>
					<button class="btn variant-ghost-primary rounded-md" type="submit">Check</button>
				</form>
			</div>
		{/if}
	</ol>
</main>