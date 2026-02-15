import { createRouter, createWebHashHistory } from 'vue-router';
import MainLayout from '../views/MainLayout.vue'
import Home from '../views/Home.vue';
import About from '../views/About.vue';
import EquipmentCraftSimulator from '../views/EquipmentCraftSimulator.vue';

import MaterialSimulator from '../views/MaterialSimulator.vue';
import TransferSimulator from '../views/TransferSimulator.vue';
import WeaponUpgradeSimulator from '../views/WeaponUpgradeSimulator.vue';
import Enchant from '../views/Enchant.vue';
import FarmModel from '../views/FarmModel.vue';
import Title from '../views/Title.vue';
import StoneGamblingView from '../views/StoneGamblingView.vue';
import AlchemyCalculator from '../views/AlchemyCalculator.vue';
import DollBagSearch from '../views/DollBagSearch.vue';

const routes = [
    {
        path: '/',
        name: 'GridDemo',
        component: MainLayout,
        children: [{
            path: '',
            name: '首頁',
            component: Home
        },
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
        },
        {
            path: '/title',
            name: '稱號查詢',
            component: Title,
        },
        {
            path: '/stone-gambling',
            name: '賭石小遊戲',
            component: StoneGamblingView,
        },
        {
            path: '/alchemy-calculator',
            name: '煉金術傷害計算器',
            component: AlchemyCalculator,
        },
        {
            path: '/doll-bag',
            name: '娃娃背包查詢',
            component: DollBagSearch,
        },]
    },


];

const router = createRouter({
    history: createWebHashHistory('/mabinogi-tools/'),
    routes
});

export default router;
