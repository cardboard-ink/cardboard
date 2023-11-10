import { writable } from 'svelte/store';
import { browser } from '$app/environment';

// Session based theme store. Grabs the current theme from the current body.
export const storeTheme = writable(browser ? document.body.getAttribute('data-theme') ?? '' : 'skeleton');