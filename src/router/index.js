import { createRouter, createWebHashHistory } from 'vue-router';
import About from '../views/About.vue';
import EquipmentCraftSimulator from '../views/EquipmentCraftSimulator.vue';

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
    {
        path: '/equipment-craft-simulator',
        name: '裝備製作模擬器',
        component: EquipmentCraftSimulator
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
    history: createWebHashHistory('/mabinogi-tools/'),
    routes
});

export default router;