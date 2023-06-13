import {
	type RouteRecordRaw,
	createRouter,
	createWebHistory,
} from 'vue-router';
import NotFound from '@/page/NotFound.vue';
import Main from '@/page/Main.vue';

export interface RouteLocation {
	path: string;
	name: string;
}

export const AppPath = {
	Main: { name: 'Main', path: '/' },
	Login: { name: 'UserLogin', path: '/login' },
	Top100: { name: 'Top100', path: '/top-100' },
	NotFount: { name: 'NotFount', path: '/not-found' },
} as const;

const routes: readonly RouteRecordRaw[] = [
	{ ...AppPath.Main, component: Main },
	{ ...AppPath.NotFount, component: NotFound },
	{
		name: 'CatchAll',
		path: '/:catch_all(.*)',
		redirect: AppPath.NotFount.path,
	},
];

export const router = createRouter({
	history: createWebHistory(),
	strict: false,
	sensitive: false,
	routes,
});
