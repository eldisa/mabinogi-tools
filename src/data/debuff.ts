import { Debuff } from "./../types/index";

export const debuffData: Debuff[] = [
    {
        name: "神劍破防(上限自己設定)",
        active: true,
        description:
            "效果永久；一刀破保3;根據目標單位不同，有不同的保護減少上限(格倫貝爾納困難的卡莉亞赫最多6刀減少保護16)",
        physicalDefense: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        physicalProtect: {
            operation: "subtract",
            value: 3,
            editable: true,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        magicalProtect: {
            operation: "subtract",
            value: 3,
            editable: true,
        },
    },
    {
        name: "卡丁車水球破防",
        active: true,
        description: "效果永久；破防5保3",
        physicalDefense: {
            operation: "subtract",
            value: 5,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 3,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
    },
    {
        name: "蒼龍破防",
        active: true,
        description: ``,
        physicalDefense: {
            operation: "subtract",
            value: 15,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 15,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
    },
    {
        name: "骨龍(防15保10)or蹭貓(防20保15)破防",
        active: true,
        description: ``,
        physicalDefense: {
            operation: "subtract",
            value: 20,
            editable: true,
        },
        physicalProtect: {
            operation: "subtract",
            value: 15,
            editable: true,
        },
        magicalDefense: {
            operation: "subtract",
            value: 20,
            editable: true,
        },
        magicalProtect: {
            operation: "subtract",
            value: 15,
            editable: true,
        },
    },

    {
        name: "螺旋勾拳",
        active: true,
        description: `無法套用在防禦1000以上的單位，必須先上其他破防效果才能上勾拳效果 效果60秒；破防33保10，手部細工5等多破保5；機率發動，身體細工20等機率100% 破保效益較高的勾拳會覆蓋掉破保效益較低的勾拳 （e.g. 手部0等細工勾拳狀態剩30秒時上5等勾拳 → 手部5等細工勾拳狀態剩60秒） 破保效益較低的勾拳不會覆蓋掉破保效益較高的勾拳 但會刷新破保效益較高的勾拳破保持續時間 （e.g. 手部5等細工勾拳狀態剩30秒時上0等勾拳 → 手部5等細工勾拳狀態剩60秒）因此打團隊副本可以隨便勾拳`,
        physicalDefense: {
            operation: "subtract",
            value: 33,
            editable: true,
        },
        physicalProtect: {
            operation: "subtract",
            value: 10,
            editable: true,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
    },
    {
        name: "狀態支援3152",
        active: true,
        description: "效果60秒，圖騰滿多10秒；破防22%，破保11%",
        physicalDefense: {
            operation: "divide",
            value: 22,
            editable: false,
        },
        physicalProtect: {
            operation: "divide",
            value: 11,
            editable: false,
        },
        magicalDefense: {
            operation: "divide",
            value: 22,
            editable: false,
        },
        magicalProtect: {
            operation: "divide",
            value: 11,
            editable: false,
        },
    },
    {
        name: "干擾星盤黃道蔓延",
        active: true,
        description: "干擾星盤主效果多50%=15秒",
        physicalDefense: {
            operation: "subtract",
            value: 50,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 6,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 50,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 6,
            editable: false,
        },
    },
    {
        name: "精武幸運一擊",
        active: false,
        description: `武鬥術與人偶術才能技能攻擊時機率發動，兩種精武觸發的是相同種類不可疊加的減益
        效果30秒；破防15保10；機率發動`,
        physicalDefense: {
            operation: "subtract",
            value: 15,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
    },
    {
        name: "斧頭重擊",
        active: false,
        description: `效果22秒；破防9保3；機率發動`,
        physicalDefense: {
            operation: "subtract",
            value: 9,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 3,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
    },
    {
        name: "聖詠者崩潰的波動",
        active: true,
        description: `效果10秒；破防90保40（含技能死亡之舞的加成）`,
        physicalDefense: {
            operation: "subtract",
            value: 90,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 40,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 90,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 40,
            editable: false,
        },
    },
    {
        name: "死亡之舞",
        active: true,
        description: `效果10秒；破防10保10`,
        physicalDefense: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
    },
    {
        name: "魔法陣",
        active: true,
        description: `10等時破防10保10`,
        physicalDefense: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
    },
    {
        name: "雪人傑克普攻",
        active: false,
        description: `每次雪球攻擊疊層+1並刷新持續時間，上限5層;5層時破防5保4`,
        physicalDefense: {
            operation: "subtract",
            value: 5,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 4,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
    },
    {
        name: "克勞諾斯破防",
        active: true,
        description: `效果10秒；破防10保10`,
        physicalDefense: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 10,
            editable: false,
        },
    },
    {
        name: "縛魂者暗雷鏈結",
        active: true,
        description: `鏈結中持續有效；破防30%，破保15%`,
        physicalDefense: {
            operation: "divide",
            value: 0,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 30,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 15,
            editable: false,
        },
    },
    {
        name: "海德拉鍊成",
        active: true,
        description: `破防35保18，回音石破保項目20等時多破保10`,
        physicalDefense: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        physicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 35,
            editable: false,
        },
        magicalProtect: {
            operation: "subtract",
            value: 18,
            editable: true,
        },
    },
    {
        name: "幻想的合唱紅陣",
        active: false,
        description: `需要怪物素質才能估算 在此省略 請自行輸入吧`,
        physicalDefense: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        physicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        magicalProtect: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
    },
    {
        name: "寵物氣場",
        active: false,
        description: `大多數具有螢幕顯示血條的BOSS不受氣場影響
        魔族牌摩托車35秒破物防20物保10
        雪人傑克7秒破物防16物保7
        戰士柯基破物防15物保10
        巫師柯基破魔防15魔保10
        `,
        physicalDefense: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        physicalProtect: {
            operation: "subtract",
            value: 0,
            editable: false,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        magicalProtect: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
    },
    {
        name: "自訂 %數",
        active: false,
        description: `自己填`,
        physicalDefense: {
            operation: "divide",
            value: 0,
            editable: true,
        },
        physicalProtect: {
            operation: "divide",
            value: 0,
            editable: true,
        },
        magicalDefense: {
            operation: "divide",
            value: 0,
            editable: true,
        },
        magicalProtect: {
            operation: "divide",
            value: 0,
            editable: true,
        },
    },
    {
        name: "自訂 固定數值",
        active: false,
        description: `自己填`,
        physicalDefense: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        physicalProtect: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        magicalDefense: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
        magicalProtect: {
            operation: "subtract",
            value: 0,
            editable: true,
        },
    },
];
/*
OperationType = "add" | "subtract" | "multiply" | "divide";

export interface EffectDetailEntry {
    operation: OperationType; // 進行加減乘除
    value: number; // 數值
    editable: boolean; // 是否允許在 UI 上手動編輯
}
*/
