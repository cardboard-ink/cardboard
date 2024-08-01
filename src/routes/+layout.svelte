<script lang="ts">
	// Handling Live Updates
	import { beforeNavigate } from '$app/navigation';
	import { updated } from '$app/stores';
	import { onNavigate } from '$app/navigation';

	onNavigate((navigation) => {
		if (!document.startViewTransition) return;

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve();
				await navigation.complete;
			});
		});
	});

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
	const drawerStore = getDrawerStore();
	const setTheme: SubmitFunction = ({ data }) => {
		const theme = data.get('theme')?.toString();
		if (theme) {
			document.body.setAttribute('data-theme', theme);
			$storeTheme = theme;
		}
	};

	// Remove the sidebar variable
	// let sidebar: string = 'sidebar';

	// Add a function to check if the route is active
	$: isActive = (href: string) => href === $page.url.pathname;

	function handleFocus(node) {
		function onFocus(event) {
			event.preventDefault();
			node.blur();
		}
		node.addEventListener('focus', onFocus);
		return {
			destroy() {
				node.removeEventListener('focus', onFocus);
			}
		};
	}
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
				<h1
					class="h3 inter font-custom font-semibold a cursor-pointer flex gap-1"
					on:click={() => goto('/')}
				>
					📜
					<span class="hidden lg:block"> CardBoard </span>
				</h1>
				<div class="rhs">
					{#if $page.data.user}
						<a href="/profile" class="user-display-name">{$page.data.user.displayName}</a>
						<div class="settingsContainer">
							<button
								class="avatar-container"
								on:click={() => toggleModalVisibility()}
								on:mouseenter={() => (modalVisible = true)}
								on:mouseleave={() => (modalVisible = false)}
							>
								<Avatar src={guildedMediaLink($page.data.user.avatar)} size={50} />
							</button>
						</div>
						<div class="nav-actions">
							<form class="flex-col flex gap-4" action="/logout" method="POST">
								<button class="btn p-2 justify-center variant-ghost-surface" type="submit">
									<svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
										<path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 12H4m12 0-4 4m4-4-4-4m3-4h2a3 3 0 0 1 3 3v10a3 3 0 0 1-3 3h-2"/>
									  </svg>									  
								</button>
							</form>
							<LightSwitch />
						</div>
					{/if}
				</div>
			</nav>
		</header>
	</svelte:fragment>
	<svelte:fragment slot="sidebarLeft">
		{#if $page.data.user}
			<ListBox class="btn pr-4 justify-left flex-col gap-2 hidden lg:flex">
				<h2 class="h3 inter font-bold">Browse</h2>
				<ListBoxItem
					class={isActive('/') ? 'selected' : ''}
					name="route"
					value="/"
					on:click={(e) => {
						e.preventDefault();
						goto('/');
					}}
				>
					<span use:handleFocus>🏠 Home</span>
				</ListBoxItem>
				<ListBoxItem
					class={isActive('/settings/sessions') ? 'selected' : ''}
					name="route"
					value="/settings/sessions"
					on:click={(e) => {
						e.preventDefault();
						goto('/settings/sessions');
					}}
				>
					<span use:handleFocus>🏛️ Sessions</span>
				</ListBoxItem>
				<ListBoxItem
					class={isActive('/settings/your-apps') ? 'selected' : ''}
					name="route"
					value="/settings/your-apps"
					on:click={(e) => {
						e.preventDefault();
						goto('/settings/your-apps');
					}}
				>
					<span use:handleFocus>💻 Your Apps</span>
				</ListBoxItem>
				<ListBoxItem
					class={isActive('/settings/authorized-apps') ? 'selected' : ''}
					name="route"
					value="/settings/authorized-apps"
					on:click={(e) => {
						e.preventDefault();
						goto('/settings/authorized-apps');
					}}
				>
					<span use:handleFocus>👍 Verified Apps</span>
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
		.nav-actions {
			display: flex;
			gap: 16px;
			align-items: center;
		}
	}
	/* Hide ListBox, display name, and avatar on mobile */
	@media (max-width: 1024px) {
		:global(.list-nav) {
			display: none;
		}
		.user-display-name {
			display: none;
		}
		.avatar-container {
			display: none;
		}
	}

	:global(.listbox-item) {
		transition: none !important;
	}

	:global(.listbox-item:focus),
	:global(.listbox-item:active) {
		background-color: inherit !important;
		color: inherit !important;
	}

	:global(.listbox-item.selected) {
		background-color: var(--color-primary-500);
		color: var(--color-surface-50);
	}
</style>