import { join } from 'path';
import type { Config } from 'tailwindcss';
import forms from '@tailwindcss/forms';
import typography from '@tailwindcss/typography';
import { skeleton } from '@skeletonlabs/tw-plugin';
import { myCustomTheme } from './my-custom-theme';

export default {
	darkMode: 'class',
	content: ['./src/**/*.{html,js,svelte,ts}', join(require.resolve('@skeletonlabs/skeleton'), '../**/*.{html,js,svelte,ts}')],
	theme: {
		extend: {},
		fontFamily: {
			'custom': ['Inter', 'sans-serif'],
			'sans': ['ui-sans-serif', 'system-ui'],
			'serif': ['ui-serif', 'Georgia'],
			'mono': ['ui-monospace', 'SFMono-Regular'],
			'display': ['Oswald'],
			'body': ['"Open Sans'],
		}
	},
	plugins: [
		skeleton({
			themes: {
				custom: [
					myCustomTheme
				]
			}
		}),
		forms,
		typography
	]
} satisfies Config;