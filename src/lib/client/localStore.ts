import { localStorageStore } from '@skeletonlabs/skeleton';
import type { Writable } from 'svelte/store';

export const theme: Writable<'skeleton' | 'modern' | 'vintage' | 'rocket' | 'seafoam' | 'sahara' | 'hamlindigo' | 'gold-nouveau' | 'crimson'> = localStorageStore('theme', 'skeleton');