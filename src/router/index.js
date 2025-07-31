import { createRouter, createWebHashHistory } from 'vue-router';
import About from '../views/About.vue';
import EquipmentCraftSimulator from '../views/EquipmentCraftSimulator.vue';

import PierecingLevelAnalysis from '../views/PierecingLevelAnalysis.vue';
import MaterialSimulator from '../views/MaterialSimulator.vue';
import TransferSimulator from '../views/TransferSimulator.vue';
import WeaponUpgradeSimulator from '../views/WeaponUpgradeSimulator.vue';
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
    },
    {
        path: '/material-simulator',
        name: '材料計算機',
        component: MaterialSimulator,
    },
    {
        path: '/transfer-simulator',
        name: '裝備能力轉移費用估算',
        component: TransferSimulator,
    },
    {
        path: '/weapon-upgrade-simulator',
        name: '裝備改造模擬器',
        component: WeaponUpgradeSimulator,
    }

];

const router = createRouter({
    history: createWebHashHistory('/mabinogi-tools/'),
    routes
});

export default router;
