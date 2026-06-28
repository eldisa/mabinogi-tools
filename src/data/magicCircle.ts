// 魔法陣（強化）查詢資料
// type: 地面 = 設置於地面的範圍效果；自身 = 對自身技能的強化
export type MagicCircleType = "地面" | "自身";

export interface MagicCircleBuff {
    name: string;
    effect: string;
    type: MagicCircleType;
}

export interface MagicCircleCategory {
    label: string;
    buffs: MagicCircleBuff[];
}

export const magicCircleCategories: MagicCircleCategory[] = [
    {
        label: "範圍 Buff / Debuff",
        buffs: [
            { name: "生命值恢復", effect: "半徑 3m 範圍內的隊伍成員 生命值每秒 [100] 恢復", type: "地面" },
            { name: "魔法值恢復", effect: "半徑 3m 範圍內的隊伍成員 魔法值每秒 [100] 恢復", type: "地面" },
            { name: "耐力值恢復", effect: "半徑 3m 範圍內的隊伍成員 耐力值每秒 [100] 恢復", type: "地面" },
            { name: "負傷恢復", effect: "半徑 3m 範圍內的隊伍成員 負傷每秒 [100] 恢復", type: "地面" },
            { name: "緩速/損傷增加", effect: "半徑 3m 範圍內的敵人移動速度 [10] %減少、每秒造成 [200] 傷害", type: "地面" },
            { name: "防禦/保護減少", effect: "半徑 3m 範圍內的敵人 防禦和保護 [10] 減少", type: "地面" },
            { name: "魔防/魔保減少", effect: "半徑 3m 範圍內的敵人 魔法防禦和魔法保護 [10] 減少", type: "地面" },
        ],
    },
    {
        label: "近距離",
        buffs: [
            { name: "防禦", effect: "防禦成功時防禦能力 [10] 增加", type: "自身" },
            { name: "重擊", effect: "重擊傷害值 [100] %增加", type: "自身" },
            { name: "反擊", effect: "反擊冷卻時間 [1.0] 秒減少", type: "自身" },
            { name: "突擊", effect: "突擊傷害 [60] %增加", type: "自身" },
            { name: "躍擊", effect: "躍擊冷卻時間 [1.0] 秒減少", type: "自身" },
            { name: "憤怒衝擊", effect: "憤怒衝擊 近距離額外傷害 [10] %增加", type: "自身" },
            { name: "猛擊", effect: "猛擊打擊傷害 [40] %增加", type: "自身" },
            { name: "終焉斬擊", effect: "終焉斬擊每次攻擊時憤怒值 [20]%增加", type: "自身" },
            { name: "蜂擁", effect: "蜂擁攻擊幅度 [1.0] m增加", type: "自身" },
            { name: "投擲攻擊", effect: "投擲攻擊對象 硬質 [0.70] 秒增加", type: "自身" },
            { name: "風車", effect: "風車攻擊範圍 [8.0] %增加", type: "自身" },
            { name: "無限斬擊", effect: "無限斬擊的瞬間移動距離 [2.50] m增加", type: "自身" },
            { name: "跺腳", effect: "跺腳攻擊範圍 [1.20] m增加", type: "自身" },
            { name: "暴風防護", effect: "暴風防護 魔法保護 [10] 增加", type: "自身" },
            { name: "嘲諷", effect: "嘲諷範圍 [2.0] m增加", type: "自身" },
            { name: "迴避", effect: "迴避的最小成功率 [10] %增加", type: "自身" },
            { name: "分身術", effect: "分身術最大傷害值 [50] 增加", type: "自身" },
            { name: "狂暴化", effect: "狂暴化持續時間 [3.0] 秒增加", type: "自身" },
            { name: "槍反擊", effect: "槍反擊失敗時 硬質時間 [1.0] 秒減少", type: "自身" },
            { name: "槍衝擊", effect: "馬上槍衝擊範圍幅度 [0.1] m增加", type: "自身" },
        ],
    },
    {
        label: "遠距離",
        buffs: [
            { name: "穿心箭", effect: "穿心箭傷害 [100] %增加", type: "自身" },
            { name: "旋風箭", effect: "旋風箭最大傷害值 [50] 增加", type: "自身" },
            { name: "支援箭", effect: "支援箭 近距離額外傷害 [10] %增加", type: "自身" },
            { name: "毒雲箭", effect: "毒雲箭效果持續時間 [4.0] 秒增加", type: "自身" },
            { name: "蜘蛛網射擊", effect: "蜘蛛網射擊 陷阱持續時間 [2.0] 秒增加", type: "自身" },
            { name: "零秒狙擊", effect: "零秒狙擊冷卻時間 [2.0] 秒減少", type: "自身" },
            { name: "爆裂箭", effect: "爆裂箭 最大碎片範圍 [2.0] m增加", type: "自身" },
            { name: "終極射擊", effect: "終極射擊的瞬間移動距離 [3.0] m增加", type: "自身" },
        ],
    },
    {
        label: "魔法",
        buffs: [
            { name: "冥想", effect: "冥想魔法值恢復速度 [200] %增加", type: "自身" },
            { name: "雷矢魔法", effect: "雷矢魔法最大傷害值 [30] 增加", type: "自身" },
            { name: "雷擊", effect: "雷擊最大傷害值 [50] 增加", type: "自身" },
            { name: "絢麗一擊", effect: "絢麗一擊半徑 [1.50] m增加", type: "自身" },
            { name: "電氣鎖鏈", effect: "電氣鎖鏈最大充電時 傷害 [40] %增加", type: "自身" },
            { name: "火焰", effect: "火焰最大傷害值 [20] 增加", type: "自身" },
            { name: "火球", effect: "火球最大傷害值 [150] 增加", type: "自身" },
            { name: "火石狂熱", effect: "火石狂熱最大火焰傷害 [1500] 增加", type: "自身" },
            { name: "冰矛", effect: "冰矛最大傷害值 [20] 增加", type: "自身" },
            { name: "冰刃", effect: "冰刃爆發範圍 [1.0] m增加", type: "自身" },
            { name: "雹暴", effect: "雹暴最大傷害 [60] 增加", type: "自身" },
            { name: "組合魔法", effect: "組合魔法傷害值 [10] 增加", type: "自身" },
            { name: "爆裂術", effect: "爆裂術爆發半徑 [1.0] m增加", type: "自身" },
            { name: "移動投擲", effect: "移動投擲魔法值消耗增加量 [20] %減少", type: "自身" },
            { name: "導電反應", effect: "導電反應持續時間 [3.0] 秒增加", type: "自身" },
            { name: "聚精凝魔", effect: "聚精凝魔魔法值恢復量 [10] %增加", type: "自身" },
        ],
    },
    {
        label: "戰鬥鍊金術",
        buffs: [
            { name: "吸取生命", effect: "吸取生命射程距離 [3.0] m增加", type: "自身" },
            { name: "水砲", effect: "水砲最大傷害值 [30] 增加", type: "自身" },
            { name: "旋風衝擊", effect: "旋風衝擊最大傷害值 [20] 增加", type: "自身" },
            { name: "火焰噴射", effect: "火焰噴射攻擊角度 [10] 增加", type: "自身" },
            { name: "沙暴", effect: "沙暴射程距離 [1.0] m增加", type: "自身" },
            { name: "冰風暴", effect: "冰風暴射程距離 [1.0] m增加", type: "自身" },
            { name: "火花", effect: "火花持續時間 [4.0] 秒增加", type: "自身" },
            { name: "高壓火爆", effect: "高壓火爆最大傷害值 [100] 增加", type: "自身" },
            { name: "黃金時間", effect: "黃金時間技能持續時間 [10] 秒增加", type: "自身" },
        ],
    },
    {
        label: "煉成鍊金術",
        buffs: [
            { name: "魔力凝聚", effect: "魔力凝聚使用時間 [1.0] 秒減少", type: "自身" },
            { name: "防護壁", effect: "防護壁最大生命力 [150] 增加", type: "自身" },
            { name: "造雨", effect: "造雨施展時間 [1.0] 秒減少", type: "自身" },
            { name: "海德拉鍊成", effect: "海德拉鍊成效果範圍 [1.0] m增加", type: "自身" },
            { name: "巨魔像鍊成", effect: "巨魔像鍊成的巨魔像傷害 [20] 增加", type: "自身" },
        ],
    },
    {
        label: "格鬥",
        buffs: [
            { name: "突拳", effect: "突拳傷害 [20] %增加", type: "自身" },
            { name: "導電拳擊", effect: "導電拳擊傷害 [20] %增加", type: "自身" },
            { name: "狂暴拳擊", effect: "狂暴拳擊傷害 [20] %增加", type: "自身" },
            { name: "螺旋勾拳", effect: "螺旋勾拳傷害 [30] %增加", type: "自身" },
            { name: "翻筋斗", effect: "翻筋斗傷害 [30] %增加", type: "自身" },
            { name: "飛踢", effect: "飛踢傷害 [40] %增加", type: "自身" },
            { name: "猛烈突擊", effect: "猛烈突擊傷害 [40] %增加", type: "自身" },
            { name: "復原", effect: "復原冷卻時間 [20] 秒減少", type: "自身" },
            { name: "後退", effect: "後退移動距離 [2.0] m增加", type: "自身" },
        ],
    },
    {
        label: "音樂",
        buffs: [
            { name: "誘惑之歌", effect: "誘惑之歌的眩惑半徑 [4.0] m增加", type: "自身" },
            { name: "旋律衝擊", effect: "旋律衝擊的傷害 [50] %增加", type: "自身" },
            { name: "幻想的合唱", effect: "幻想的合唱持續時間 [9.0] 秒增加", type: "自身" },
            { name: "戰場的序曲", effect: "戰場的序曲持續時間 [5.0] 秒增加", type: "自身" },
            { name: "搖籃曲", effect: "搖籃曲催眠距離 [2.0] m增加", type: "自身" },
            { name: "活潑板", effect: "活潑板持續時間 [5.0] 秒增加", type: "自身" },
            { name: "忍耐的音樂", effect: "忍耐的音樂持續時間 [4.0] 秒增加", type: "自身" },
            { name: "豐年歌", effect: "豐年歌持續時間 [12.0] 秒增加", type: "自身" },
            { name: "進行曲", effect: "進行曲持續時間 [12.0] 秒增加", type: "自身" },
            { name: "死亡之舞", effect: "死亡之舞冷卻時間 [15.0] 秒減少", type: "自身" },
        ],
    },
    {
        label: "人偶",
        buffs: [
            { name: "第二幕: 激增的憤怒", effect: "第二幕: 激增的憤怒1打的傷害 [40] %增加", type: "自身" },
            { name: "第一幕: 偶然的衝突", effect: "第一幕: 偶然的衝突傷害 [40] %增加", type: "自身" },
            { name: "第四幕: 嫉妒的化身", effect: "第四幕: 嫉妒的化身傷害 [50] %增加", type: "自身" },
            { name: "第六幕: 誘惑的圈套", effect: "第六幕: 誘惑的圈套 套索半徑 [2.0] m增加", type: "自身" },
            { name: "第七幕: 狂亂的奔走", effect: "第七幕: 狂亂的奔走傷害 [80] %增加", type: "自身" },
            { name: "第九幕: 甦醒的生命", effect: "第九幕: 甦醒的生命發動時 最大傷害獎勵 [10] 增加", type: "自身" },
            { name: "幕後操作", effect: "幕後操作射程距離 [1.0] m增加", type: "自身" },
            { name: "幕前魁儡", effect: "幕前魁儡射程距離 [1.0] m增加", type: "自身" },
        ],
    },
    {
        label: "雙槍",
        buffs: [
            { name: "十字槍擊", effect: "十字槍擊傷害 [50] %增加", type: "自身" },
            { name: "拉近", effect: "拉近傷害 [40] %增加", type: "自身" },
            { name: "退遠", effect: "退遠傷害 [40] %增加", type: "自身" },
            { name: "衝射", effect: "衝射傷害 [40] %增加", type: "自身" },
            { name: "彈雨", effect: "彈雨最大傷害倍率限制 [50] %增加", type: "自身" },
            { name: "裝彈", effect: "裝彈詠唱時間 [0.50] 秒減少", type: "自身" },
            { name: "雙槍射擊", effect: "雙槍射擊持續時間 [5.0] 秒增加", type: "自身" },
        ],
    },
    {
        label: "忍術",
        buffs: [
            { name: "手裏劍突擊", effect: "手裏劍突擊傷害 [100] %增加", type: "自身" },
            { name: "手裏劍暴風", effect: "手裏劍暴風傷害 [10] %增加", type: "自身" },
            { name: "影子束縛術", effect: "影子束縛術射程距離 [2.0] m增加", type: "自身" },
            { name: "影子隱身術", effect: "影子隱身術隱身時間 [3.0] 秒增加", type: "自身" },
            { name: "手裏劍爆破", effect: "手裏劍爆破起爆傷害 [10] %增加", type: "自身" },
            { name: "灰色煙幕術", effect: "灰色煙幕術煙幕範圍半徑 [1.0] m增加", type: "自身" },
            { name: "櫻花雨", effect: "櫻花雨冷卻時間 [30] 秒減少", type: "自身" },
        ],
    },
    {
        label: "鎖鏈",
        buffs: [
            { name: "鎖鏈刺擊", effect: "鎖鏈刺擊傷害 [20] %增加", type: "自身" },
            { name: "闇夜圓舞曲", effect: "闇夜圓舞曲傷害 [20] %增加", type: "自身" },
            { name: "闇夜掠擊", effect: "闇夜掠擊有效範圍 [1.0] m增加", type: "自身" },
            { name: "闇夜處刑", effect: "闇夜處刑傷害 [20] %增加", type: "自身" },
            { name: "黑闇掃蕩", effect: "黑闇掃蕩有效距離 [1.0] m增加", type: "自身" },
            { name: "黑闇轉換", effect: "黑闇轉換獲得黑闇值 [1.0] 增加", type: "自身" },
            { name: "鎖鏈躍疾", effect: "鎖鏈躍疾最大移動距離 [1.0] m增加", type: "自身" },
            { name: "死神烙印", effect: "死神烙印維持時間 [3.0] 秒增加", type: "自身" },
            { name: "黑闇解放", effect: "黑闇解放維持時間 [5.0] 秒增加", type: "自身" },
            { name: "信念解放", effect: "信念解放傷害 [100] %增加", type: "自身" },
        ],
    },
    {
        label: "占星",
        buffs: [
            { name: "鐮刀斬擊", effect: "鐮刀斬擊傷害 [20] %增加", type: "自身" },
            { name: "星之引爆", effect: "星之引爆範圍 [1.0] m增加", type: "自身" },
            { name: "星界突破", effect: "星界突破傷害 [250] %增加", type: "自身" },
            { name: "迴旋斬擊", effect: "迴旋斬擊攻擊寬度 [0.5] m增加", type: "自身" },
            { name: "星象輪迴", effect: "星象輪迴範圍 [1.0] m增加", type: "自身" },
            { name: "黃道蔓延", effect: "黃道蔓延Debuff持續時間 [2.0] 秒增加", type: "自身" },
            { name: "引力空間", effect: "引力空間每秒蓄力範圍 [1.0] m增加", type: "自身" },
            { name: "星魂卡陣", effect: "星魂卡陣傷害 [100] %增加", type: "自身" },
        ],
    },
    {
        label: "非戰鬥",
        buffs: [
            { name: "耳語", effect: "偶爾聽到可疑的悄悄話", type: "自身" },
            { name: "飽食度恢復", effect: "半徑 3m 範圍內的隊伍成員 飽食度每秒 [100] 恢復", type: "地面" },
            { name: "肌肉增加", effect: "半徑 3m 範圍內的隊伍成員 每10秒增加一次肌肉", type: "地面" },
            { name: "肌肉減少", effect: "半徑 3m 範圍內的隊伍成員 每10秒減少一次肌肉", type: "地面" },
            { name: "脂肪增加", effect: "半徑 3m 範圍內的隊伍成員 每10秒增加一次體重", type: "地面" },
            { name: "脂肪減少", effect: "半徑 3m 範圍內的隊伍成員 每10秒減少一次體重", type: "地面" },
        ],
    },
];
