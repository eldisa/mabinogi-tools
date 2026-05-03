import { createRouter, createWebHashHistory } from 'vue-router';
import MainLayout from '../views/MainLayout.vue'
import Home from '../views/Home.vue';
import About from '../views/About.vue';

import MaterialSimulator from '../views/MaterialSimulator.vue';
import TransferSimulator from '../views/TransferSimulator.vue';
import WeaponUpgradeSimulator from '../views/WeaponUpgradeSimulator.vue';
import Enchant from '../views/Enchant.vue';
import FarmModel from '../views/FarmModel.vue';
import Title from '../views/Title.vue';
import StoneGamblingView from '../views/StoneGamblingView.vue';
import AlchemyCalculator from '../views/AlchemyCalculator.vue';
import DollBagSearch from '../views/DollBagSearch.vue';
import MagicCalculator from '../views/MagicCalculator.vue';
import ReforgeSimulator from '../views/ReforgeSimulator.vue';

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
            path: '/material-simulator',
            name: '材料計算機',
            component: MaterialSimulator,
        },
        {
            path: '/transfer-simulator',
            name: '裝備繼承費用估算',
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
        },
        {
            path: '/magic-calculator',
            name: '魔法傷害計算器',
            component: MagicCalculator,
        },
        {
            path: '/enchant-reroll',
            name: '細工模擬器',
            component: ReforgeSimulator,
        },]
    },


];

const router = createRouter({
    history: createWebHashHistory('/mabinogi-tools/'),
    routes
});

const pageTitles = {
    '首頁':             '瑪奇小工具',
    '裝備改造模擬器':   '裝備改造模擬器 | 瑪奇小工具',
    '材料計算機':       '材料計算機 | 瑪奇小工具',
    '裝備繼承費用估算': '裝備能力轉移費用估算 | 瑪奇小工具',
    '賦予查詢':         '賦予查詢 | 瑪奇小工具',
    '農場模型查詢':     '農場模型查詢 | 瑪奇小工具',
    '稱號查詢':         '稱號查詢 | 瑪奇小工具',
    '賭石小遊戲':       '賭石小遊戲 | 瑪奇小工具',
    '娃娃背包查詢':     '娃娃背包查詢 | 瑪奇小工具',
    '細工模擬器':       '細工模擬器 | 瑪奇小工具',
    '關於':             '關於 | 瑪奇小工具',
};

router.afterEach((to) => {
    document.title = pageTitles[to.name] ?? '瑪奇小工具';

    if (typeof window.gtag === 'function') {
        window.gtag('event', 'page_view', {
            page_title: document.title,
            page_path: to.fullPath,
        });
    }
});

export default router;
