import { createRouter, createWebHashHistory } from 'vue-router';
import MainLayout from '../views/MainLayout.vue'
import About from '../views/About.vue';
import EquipmentCraftSimulator from '../views/EquipmentCraftSimulator.vue';

import MaterialSimulator from '../views/MaterialSimulator.vue';
import TransferSimulator from '../views/TransferSimulator.vue';
import WeaponUpgradeSimulator from '../views/WeaponUpgradeSimulator.vue';
import Enchant from '../views/Enchant.vue';
import FarmModel from '../views/FarmModel.vue';

const routes = [
    {
        path: '/',
        name: 'GridDemo',
        component: MainLayout,
        children: [{
            path: '/about',
            name: '關於',
            component: About
        },
        {
            path: '/equipment-craft-simulator',
            name: '裝備製作模擬器',
            component: EquipmentCraftSimulator
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
        },
        {
            path: '/enchant',
            name: '賦予查詢',
            component: Enchant,
        },
        {
            path: '/farmModel',
            name: '農場模型查詢',
            component: FarmModel,
        },]
    },


];

const router = createRouter({
    history: createWebHashHistory('/mabinogi-tools/'),
    routes
});

export default router;
