<script lang="ts">
	import { page } from '$app/stores'
	import Avatar from '$lib/client/ui/Avatar.svelte'
	import { LightSwitch } from '@skeletonlabs/skeleton';
	import { theme } from '$lib/client/localStore';
	import { onMount } from 'svelte';

	let modalVisible = false
	let themeModalVisible = false
	const toggleModalVisibility = () => {
		modalVisible = !modalVisible
	}

	const toggleThemeModalVisibility = () => {
		themeModalVisible = !themeModalVisible
	}

	import '@skeletonlabs/skeleton/themes/theme-vintage.css'
	import '@skeletonlabs/skeleton/styles/skeleton.css'
	import '../app.postcss';
</script>

<svelte:head>
	<title>SvelteKit Auth</title>
</svelte:head>

<nav class="nav p-8">
	<a class="a" href="/">Home</a>
	<div class="rhs">
		<div class="themeContainer">
			<button on:click={() => toggleThemeModalVisibility()}>
				Select Theme 🔽
			</button>
			<div class={`modal card bg-inital ${themeModalVisible ? ' flex flex-col gap-1 p-2 absolute w-60 translate-x-[-25%] z-10' : 'hidden'}`} class:visible="{themeModalVisible}" on:mouseenter={() => themeModalVisible = true} on:mouseleave={() => themeModalVisible = false}>
				<LightSwitch class={`${themeModalVisible ? '' : 'hidden'}`} />
				<button class="variant-filled-surface w-full disabled" disabled on:click={() => theme.set('skeleton')}>
					💀 Skeleton
				</button>
				<button class="variant-filled-surface w-full" on:click={() => theme.set('vintage')}>
					📺 Vintage
				</button>
			</div>
		</div>
	{#if !$page.data.user}
			<a href="/login">Login</a>
			<a href="/register">Register</a>
	{/if}
	
	{#if $page.data.user}
			<a href="/profile">{$page.data.user.displayName}</a>
			<div class="settingsContainer">
				<button on:click={() => toggleModalVisibility()} on:mouseenter={() => modalVisible = true} on:mouseleave={() => modalVisible = false}>
					<Avatar src={$page.data.user.avatar} size={50}></Avatar>
				</button>
				<div class="modal card bg-inital z-10" class:visible="{modalVisible}" on:mouseenter={() => modalVisible = true} on:mouseleave={() => modalVisible = false}>
					{#if $page.data.user.role === "ADMIN"}
						<a href="/admin">Admin</a>
					{/if}
					<a href="/settings">Settings</a>
					<form action="/logout" method="POST">
						<button type="submit">Log out</button>
					</form>
				</div>
			</div>
			{/if}
		</div>
</nav>

<main class="px-8">
	<slot></slot>
</main>

<style lang="postcss">
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
		.auth {
			display: flex;
			gap: 16px;
		}
		.rhs {
			display: flex;
			gap: 16px;
			align-items: center;
			.settingsContainer {
				position: relative;
				display: flex;
				align-items: center;
				button {
					margin: 0px;
					border: none;
					background: none;
					padding: none;
				}
				.modal {
					width: 200px;
					transform: translateX(calc(-50% - 2rem)) translateY(75%);
					position: absolute;
					display: none;
					flex-direction: column;
					&.visible{
						display: flex;
						gap: 8px;
						padding: 16px;
					}
				}
				&:focus {
					.modal {
						display: flex;
						gap: 8px;
						padding: 16px;
					}
				}
			}
		}
	}
</style>