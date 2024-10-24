<script lang="ts">
	// Handling Live Updates
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/stores';

	beforeNavigate(({ willUnload, to }) => {
		if ($updated && !willUnload && to?.url) {
			location.href = to.url.href;
		}
	});

	// Page from here
	import { page } from '$app/stores';
	import Avatar from '$lib/client/ui/Avatar.svelte';
	import {
		LightSwitch,
		Toast,
		Modal,
		AppShell,
		initializeStores,
		storePopup,
		ListBox,
		ListBoxItem,
		getDrawerStore,
		popup
	} from '@skeletonlabs/skeleton';
	import { computePosition, autoUpdate, flip, shift, offset, arrow } from '@floating-ui/dom';
	let modalVisible = false;
	const toggleModalVisibility = () => {
		modalVisible = !modalVisible;
	};
	import Icon from '@iconify/svelte';
	import '../app.postcss';
	import { goto } from '$app/navigation';
	import type { SubmitFunction } from '@sveltejs/kit';
	import { storeTheme } from '$lib/stores/stores';
	import { enhance } from '$app/forms';
	import { guildedMediaLink } from '$lib/utils/guilded-media';
	storePopup.set({ computePosition, autoUpdate, flip, shift, offset, arrow });
	initializeStores();
	getDrawerStore();
	const setTheme: SubmitFunction = ({ formData }) => {
		const theme = formData.get('theme')?.toString();
		if (theme) {
			document.body.setAttribute('data-theme', theme);
			$storeTheme = theme;
		}
	};
	const themes = [
		{ type: 'skeleton', name: 'Skeleton', icon: '💀' },
		{ type: 'wintry', name: 'Wintry', icon: '🌨️' },
		{ type: 'modern', name: 'Modern', icon: '🤖' },
		{ type: 'rocket', name: 'Rocket', icon: '🚀' },
		{ type: 'seafoam', name: 'Seafoam', icon: '🧜‍♀️' },
		{ type: 'vintage', name: 'Vintage', icon: '📺' },
		{ type: 'sahara', name: 'Sahara', icon: '🏜️' },
		{ type: 'hamlindigo', name: 'Hamlindigo', icon: '👔' },
		{ type: 'gold-nouveau', name: 'Gold Nouveau', icon: '💫' },
		{ type: 'crimson', name: 'Crimson', icon: '⭕' }
		// { type: 'seasonal', name: 'Seasonal', icon: '🎆' }
		// { type: 'test', name: 'Test', icon: '🚧' },
	];
	let sidebar: string = 'sidebar';

	$: classesActive = (href: string) => (href === $page.url.pathname ? '!bg-primary-500' : '');
</script>

<svelte:head>
	<title>Cardboard</title>
	<link rel="apple-touch-icon" href="/apple-touch-icon.png" />
</svelte:head>
<Toast />
<Modal />
<AppShell>
	<svelte:fragment slot="header">
		<header>
			<nav class="nav p-8">
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<h1 class=" h1 a cursor-pointer flex gap-1" on:click={() => goto('/')}>
					📜
					<span class="hidden lg:block"> CardBoard </span>
				</h1>
				<div class="rhs">
					{#if !$page.data.user}
						<button
							class="btn hover:variant-soft-primary"
							use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
						>
							<Icon icon="fa6-solid:palette" class="text-lg" />
							<span class="hidden md:inline-block">Theme</span>
							<Icon icon="fa-solid:caret-down" class="opacity-50" />
						</button>
						<!-- popup -->
						<div class="card p-4 w-60 shadow-xl" data-popup="theme">
							<div class="space-y-4">
								<section class="flex justify-between items-center">
									<h6 class="h6">Mode</h6>
									<LightSwitch />
								</section>
								<hr />
								<nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
									<form method="post" action="/?/setTheme" use:enhance={setTheme}>
										<ul>
											<!-- , badge -->
											{#each themes as { icon, name, type }}
												<li>
													<button
														class="option w-full h-full"
														type="submit"
														name="theme"
														value={type}
														class:bg-primary-active-token={$storeTheme === type}
													>
														<span>{icon}</span>
														<span class="flex-auto text-left">{name}</span>
														<!-- {#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if} -->
													</button>
												</li>
											{/each}
										</ul>
									</form>
								</nav>
							</div>
						</div>
						<a href="/login">Link Guilded</a>
					{/if}

					{#if $page.data.user}
						<a href="/profile">{$page.data.user.displayName}</a>
						<div class="settingsContainer">
							<button
								on:click={() => toggleModalVisibility()}
								on:mouseenter={() => (modalVisible = true)}
								on:mouseleave={() => (modalVisible = false)}
							>
								<Avatar src={guildedMediaLink($page.data.user.avatar)} size={50} />
							</button>
							<div
								class="modal card bg-inital z-10"
								class:visible={modalVisible}
								on:mouseenter={() => (modalVisible = true)}
								on:mouseleave={() => (modalVisible = false)}
							>
								<button
									class="btn hover:variant-soft-primary"
									use:popup={{ event: 'click', target: 'theme', closeQuery: 'a[href]' }}
								>
									<Icon icon="fa6-solid:palette" class="text-lg" />
									<span class="hidden md:inline-block">Theme</span>
									<Icon icon="fa-solid:caret-down" class="opacity-50" />
								</button>
								<!-- popup -->
								<div class="card p-4 w-60 shadow-xl" data-popup="theme">
									<div class="space-y-4">
										<section class="flex justify-between items-center">
											<h6 class="h6">Mode</h6>
											<LightSwitch />
										</section>
										<hr />
										<nav class="list-nav p-4 -m-4 max-h-64 lg:max-h-[500px] overflow-y-auto">
											<form method="post" action="/?/setTheme" use:enhance={setTheme}>
												<ul>
													<!-- , badge -->
													{#each themes as { icon, name, type }}
														<li>
															<button
																class="option w-full h-full"
																type="submit"
																name="theme"
																value={type}
																class:bg-primary-active-token={$storeTheme === type}
															>
																<span>{icon}</span>
																<span class="flex-auto text-left">{name}</span>
																<!-- {#if badge}<span class="badge variant-filled-secondary">{badge}</span>{/if} -->
															</button>
														</li>
													{/each}
												</ul>
											</form>
										</nav>
									</div>
								</div>
								<div class="lg:hidden">
									<nav class="list-nav flex flex-col gap-2">
										<a href="/" class={classesActive('/')}>🏠 Home</a>
										<a href="/settings/sessions" class={classesActive('/settings/sessions')}
											>🏛️ Sessions</a
										>
										<a href="/settings/your-apps" class={classesActive('/settings/your-apps')}
											>💻 Your Apps</a
										>
										<a
											href="/settings/authorized-apps"
											class={classesActive('/settings/authorized-apps')}>🔑 Authorized Apps</a
										>
										<a
											href="/info"
											target="_blank"
											class={classesActive('/settings/authorized-apps')}>ℹ️ Info</a
										>
									</nav>
								</div>
								<form class="flex-col flex gap-4" action="/logout" method="POST">
									<button class="btn p-2 justify-center variant-ghost-surface" type="submit"
										>Log out</button
									>
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
			<ListBox class="pr-4 pl-8 flex-col gap-2 hidden lg:flex">
				<h2 class="h2">Browse</h2>
				<ListBoxItem
					class={classesActive('/')}
					bind:group={sidebar}
					name="route"
					value="/"
					on:click={() => goto('/')}
				>
					🏠 Home
				</ListBoxItem>
				<ListBoxItem
					class={classesActive('/settings/sessions')}
					bind:group={sidebar}
					name="route"
					value="/settings/sessions"
					on:click={() => goto('/settings/sessions')}
				>
					🏛️ Sessions
				</ListBoxItem>
				<ListBoxItem
					class={classesActive('/settings/your-apps')}
					bind:group={sidebar}
					name="route"
					value="/settings/your-apps"
					on:click={() => goto('/settings/your-apps')}
				>
					💻 Your Apps
				</ListBoxItem>
				<ListBoxItem
					class={classesActive('/settings/authorized-apps')}
					bind:group={sidebar}
					name="route"
					value="/settings/authorized-apps"
					on:click={() => goto('/settings/authorized-apps')}
				>
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
			This is an independently developed project and is not affiliated with any public auth
			provider/validator in any way.
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
					transform: translateX(calc(-50% - 2rem)) translateY(55%);
					position: absolute;
					display: none;
					flex-direction: column;
					&.visible {
						display: flex;
						gap: 10px;
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
