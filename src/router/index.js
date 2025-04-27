import { createRouter, createWebHistory } from 'vue-router';
import About from '../views/About.vue';

import PierecingLevelAnalysis from '../views/PierecingLevelAnalysis.vue';
// import GridDemo from '../views/GridDemo.vue';
// import Settings from '../views/Settings.vue';

const routes = [
    // {
    //     path: '/',
    //     name: 'GridDemo',
    //     component: GridDemo
    // },
    {
        path: '/about',
        name: '關於',
        component: About
    },
    // {
    //     path: '/settings',
    //     name: 'Settings',
    //     component: Settings
    // },
    {
        path: '/pierecing-analysis',
        name: 'PierecingLevelAnalysis',
        component: PierecingLevelAnalysis
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes
});

export default router;