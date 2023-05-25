<script lang="ts">
	import { page } from '$app/stores'
	import Avatar from '$lib/client/ui/Avatar.svelte'
	import { LightSwitch, Toast, Modal, AppShell } from '@skeletonlabs/skeleton';
	import { ListBox, ListBoxItem } from '@skeletonlabs/skeleton';
	let modalVisible = false
	let themeModalVisible = false
	const toggleModalVisibility = () => {
		modalVisible = !modalVisible
	}

	const toggleThemeModalVisibility = () => {
		themeModalVisible = !themeModalVisible
	}

	import '@skeletonlabs/skeleton/themes/theme-skeleton.css'
	import '@skeletonlabs/skeleton/styles/skeleton.css'
	import '../app.postcss';
	import { goto } from '$app/navigation';

	let sidebar: string = ''
</script>

<svelte:head>
	<title>Cardboard</title>
</svelte:head>
<Toast />

<AppShell>
	<svelte:fragment slot="header">
		<header>
			<nav class="nav p-8">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<h1 class="a cursor-pointer" on:click={() => goto('/')}>📜 Cardboard</h1>
				<div class="rhs">
					<Modal />
					<LightSwitch />
					{#if !$page.data.user}
							<a href="/login">Login with Guilded</a>
					{/if}
					
					{#if $page.data.user}
						<a href="/profile">{$page.data.user.displayName}</a>
						<div class="settingsContainer">
							<button on:click={() => toggleModalVisibility()} on:mouseenter={() => modalVisible = true} on:mouseleave={() => modalVisible = false}>
								<Avatar src={$page.data.user.avatar} size={50}></Avatar>
							</button>
							<div class="modal card bg-inital z-10" class:visible="{modalVisible}" on:mouseenter={() => modalVisible = true} on:mouseleave={() => modalVisible = false}>
								<form class="flex-col flex gap-4" action="/logout" method="POST">
									<button class="btn p-2 justify-center variant-ghost-surface " type="submit">Log out</button>
								</form>
							</div>
						</div>
					{/if}
				</div>
			</nav>
		</header>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		{#if $page.data.user}
		<ListBox class="pr-4 pl-8 flex flex-col gap-2">
			<h2>Browse</h2>
			<ListBoxItem bind:group={sidebar} name="route" value="/" on:click={() => goto('/')}>
				🏠 Home
			</ListBoxItem>
			<ListBoxItem bind:group={sidebar} name="route" value="/settings/sessions" on:click={() => goto('/settings/sessions')}>
				🏛️ Sessions
			</ListBoxItem>
			<ListBoxItem bind:group={sidebar} name="route" value="/settings/your-apps" on:click={() => goto('/settings/your-apps')}>
				💻 Your Apps
			</ListBoxItem>
			<ListBoxItem bind:group={sidebar} name="route" value="/settings/authorized-apps" on:click={() => goto('/settings/authorized-apps')}>
				🔑 Authorized Apps
			</ListBoxItem>
		</ListBox>
		{/if}
	</svelte:fragment>
	<main class="pl-4 pr-8">
		<slot />
	</main>
	<svelte:fragment slot="pageFooter">
		<footer class="flex justify-center p-8">
			Cardboard has been developed with ❤️ by TooMuchHam
		</footer>
	</svelte:fragment>
</AppShell>

<style lang="postcss">
	nav {
		display: flex;
		justify-content: space-between;
		align-items: center;
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