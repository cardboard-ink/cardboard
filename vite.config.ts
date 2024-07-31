import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import { purgeCss, type PurgeOptions } from 'vite-plugin-tailwind-purgecss';

const twPurgeOpts: PurgeOptions = {
	safelist: {
		// any selectors that begin with "hljs-" will not be purged
		greedy: [/^hljs-/]
	},
	legacy: true
};
export default defineConfig({
	plugins: [sveltekit(), purgeCss(twPurgeOpts)]
});
