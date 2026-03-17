<script setup lang="ts">
import { ref, reactive, computed, watch } from "vue";
import { getSkillIcon } from "../utils/image";

// ═══════════════════════════════════════════════════════
//  CONSTANTS
// ═══════════════════════════════════════════════════════

// 狀態支援/力量團聚 已移至 state 以 checkbox 控制

// 箭系技能（5蓄火焰 / 雷矢）專用常數
const BOLT_PASSIVE_WAND = 1.5; // 精通魔杖被動基礎 150%
const BOLT_PASSIVE_BOLT = 0.2; // 箭系魔法精通被動基礎 20%
const BOLT_STAFF_BONUS = 0.002; // 法杖加成 0.2%（集魔杖時自動套用）
const FIRE_BOLT_CONST = 6.673; // 5蓄火焰固定乘數
const BOLT_5CHARGE_BONUS = 0.28; // 雷矢5蓄傷害獎勵 +28%（C4）

/** 武器評價 & 特殊加成 CONFIG */
const WEAPON_BASE = {
    cat_wand: { weapon_eval: 0.42, cc_bonus: 0.35 },
    soul_wand: { weapon_eval: 0.56, cc_bonus: 0.35 },
    celtic_staff: { weapon_eval: 0.84, c1_mastery: 0.35 }, // C1 雷精通武器加成
    cat_staff: { weapon_eval: 0.84, d1_interm: 0.35 }, // D1 中級魔法武器加成
    soul_staff: { weapon_eval: 1.12, d1_interm: 0.35, soul_extra: 0.1 }, // D1 + I 魂長額外
    cat_book: { weapon_eval: 0.42 },
    soul_book: { weapon_eval: 0.56 },
    none: { weapon_eval: 0 },
} as const;
type WeaponKey = keyof typeof WEAPON_BASE;

const TITLES_DATA = {
    // 第一稱號
    cc_master: { primaryCC: 0.05, magAtk: 0 },
    end_of_love: { primaryCC: 0, magAtk: 55 },
    // 第二稱號
    butterfly: { boltMastery: 0.15, fireMult: 0.01, ccBonus: 0.05, extraDmg: 0 },
    rowan: { boltMastery: 0.03, fireMult: 0, ccBonus: 0, extraDmg: 0.01, magAtk: 50 },
} as const;

const SOUL_WEAPONS = new Set(["soul_wand", "soul_staff"]);

const MAIN_HAND_OPTIONS = {
    wand: [
        { value: "cat_wand", label: "貓短 42%" },
        { value: "soul_wand", label: "魂短 56%" },
    ],
    staff: [
        { value: "celtic_staff", label: "大杖 84%" },
        { value: "cat_staff", label: "貓杖 84%" },
        { value: "soul_staff", label: "魂杖 112%" },
    ],
} as const;

const OFFHAND_OPTIONS = [
    { value: "none", label: "無" },
    { value: "cat_book", label: "貓書 42%" },
    { value: "soul_book", label: "魂書 56%" },
];

const BASE_UPGRADE_OPTIONS = [
    { value: "none", label: "無" },
    { value: "S7", label: "S7 (+9% Extra)" },
    { value: "R7", label: "R7 (+74% Crit)" },
];
const SOUL_EXTRA_UPGRADES = [
    { value: "S8", label: "S8 (+11% Extra)" },
    { value: "R8", label: "R8 (+80% Crit)" },
];

const PRIMARY_TITLE_OPTIONS = [
    { value: "none", label: "無" },
    { value: "cc_master", label: "組合魔法大師 (+5% 箭系組合魔法傷害)" },
];
const SECONDARY_TITLE_OPTIONS = [
    { value: "none", label: "無" },
    { value: "butterfly", label: "特別的夢幻之蝶 (+15%箭系精通, +1%火, +5%箭系組合魔法傷害)" },
    { value: "rowan", label: "蘿晚 (+3%各精通, +1%Extra)" },
];

const MASTERY_REFS = [
    { key: "fire_mast", label: "精通火魔法", max: 33 },
    { key: "lightning_mast", label: "精通雷魔法", max: 33 },
    { key: "bolt_mast", label: "精通箭系魔法", max: 33 },
] as const;

const SKILL_REFS = [
    { key: "cc_damage", label: "箭系組合傷害", max: 33 },
    { key: "fire_max", label: "火焰大傷", max: 33 },
    { key: "lightning_max", label: "雷矢大傷", max: 33 },
    { key: "fireball_max", label: "火球大傷", max: 25 },
    { key: "thunder_max", label: "雷擊大傷", max: 25 },
] as const;

const MC_OPTIONS = [
    { key: "combo", label: "組合魔法" },
    { key: "fire", label: "火焰" },
    { key: "fireball", label: "火球" },
    { key: "lightning", label: "雷矢" },
    { key: "thunder", label: "雷擊" },
] as const;
const MC_MAX = 3;

const SIMULATION_ITEMS = [
    { key: "darklink", label: "暗黑連結 Lighting Chain" },
    { key: "dragonfire", label: "龍焰 Explosion Lunge" },
    { key: "cc", label: "組合魔法-火雷" },
    { key: "thunder", label: "雷擊" },
    { key: "fireball", label: "火球" },
    { key: "fireBolt", label: "5蓄火焰" },
    { key: "lightningBolt", label: "雷矢" },
] as const;

// ═══════════════════════════════════════════════════════
//  STATE
// ═══════════════════════════════════════════════════════

const state = reactive({
    weapon: {
        isErge50: true,
        type: "wand" as "wand" | "staff",
        mainHand: "cat_wand",
        offHand: "none",
        upgrade: "none",
        vivace: 0,
        baseMagicAttack: 1500,
        jingSword100: true, // 精武等級100 → 固定 +50 魔攻（計入面板）
        darkMagic: true, // 黑魔技能  → 固定 +250 魔攻（計入面板）
    },
    titles: {
        primary: "none",
        secondary: "none",
    },
    sets: {
        fireEnhance: false, // 火焰強化（黑柏）— 火焰精通 +15%
        masteryAttr: false, // 精通屬性（秘術/元素）— 火/雷精通各 +15%
    },
    refinement: {
        // 精通類
        fire_mast: 0,
        lightning_mast: 0,
        bolt_mast: 0,
        // 技能類
        cc_damage: 0,
        fire_max: 0,
        fireball_max: 0,
        lightning_max: 0,
        thunder_max: 0,
    },
    grants: {
        lightningMastery: 0, // 賦予：雷精通 0-3
        fireMastery: 0, // 賦予：火精通 0-3
    },
    magicCircles: {
        selected: [] as string[],
        levels: {} as Record<string, number>,
    },
    // G: 才能額外傷害
    talentExtra: {
        spiritCol1: false, // 精靈武器第二列-1 +10%
        spiritCol2: false, // 精靈武器第二列-2 +10%
        spiritMat: false, // 精靈武器實體化   +25%
        blueMoon: false, // 人類藍月亮       +5%
    },
    // H: 通用額外傷害
    generalExtra: {
        farm: 0, // 農場物 %
        totem: 0, // 圖騰 %
        dogSpirit: 0, // 犬靈 %
        vip: false, // VIP +1%
        statusSupport: true, // 狀態支援5231 +12%
        strengthGather: true, // 力量團聚 +15%
    },
    critRate: {
        arcaneLv: 12, // 祕法等級獎勵 %
        spiritWeapon: true, // 精靈武器 +5%
        barrier: false, // 結界 +1%
    },
    critDmg: {
        spiritWeapon: true, // 精靈武器 +15%
        farm: 7, // 農場物 %
        totem: 5, // 圖騰 %
        other: 0, // 其他 %
    },
    simulation: {
        darklink: 0,
        dragonfire: 0,
        cc: 0,
        thunder: 0,
        fireball: 0,
        fireBolt: 0,
        lightningBolt: 0,
    },
    buffs: {
        darkLink: true, // 暗黑連結 (Lighting Chain) debuff active → 龍焰 J +10%
        magAtkPotion: false, // 魔法攻擊藥水 → 魔攻係數 ×1.2
    },
});

// ═══════════════════════════════════════════════════════
//  DERIVED UI STATE (interlocking)
// ═══════════════════════════════════════════════════════

const mainHandOptions = computed(() => MAIN_HAND_OPTIONS[state.weapon.type]);
const offHandEnabled = computed(() => state.weapon.type === "wand");
const isSoulWeapon = computed(() => SOUL_WEAPONS.has(state.weapon.mainHand));

const upgradeOptions = computed(() =>
    isSoulWeapon.value ? [...BASE_UPGRADE_OPTIONS, ...SOUL_EXTRA_UPGRADES] : BASE_UPGRADE_OPTIONS,
);

watch(
    () => state.weapon.type,
    (t) => {
        state.weapon.mainHand = MAIN_HAND_OPTIONS[t][0].value;
        if (t === "staff") state.weapon.offHand = "none";
    },
);

watch(
    () => state.weapon.mainHand,
    () => {
        if (!isSoulWeapon.value && ["S8", "R8"].includes(state.weapon.upgrade)) {
            state.weapon.upgrade = "none";
        }
    },
);

// Magic circles
const isMCSelected = (k: string) => state.magicCircles.selected.includes(k);
const isMCDisabled = (k: string) => !isMCSelected(k) && state.magicCircles.selected.length >= MC_MAX;
function toggleMC(k: string) {
    const idx = state.magicCircles.selected.indexOf(k);
    if (idx >= 0) {
        state.magicCircles.selected.splice(idx, 1);
    } else if (state.magicCircles.selected.length < MC_MAX) {
        state.magicCircles.selected.push(k);
        if (state.magicCircles.levels[k] == null) state.magicCircles.levels[k] = 10;
    }
}

// ═══════════════════════════════════════════════════════
//  CALCULATIONS
// ═══════════════════════════════════════════════════════

/** A：最終魔法攻擊力
 *  公式：(基礎魔攻×係數 + 常數攻擊力) × (1+活潑板×係數) × (1+狀支×係數) × (1+團聚×係數)
 *  ─ 常數攻擊力 = 精武等級100(+50) + 黑魔(+250)，不受魔攻係數縮放
 *  ─ 基礎魔攻   = 面板魔法攻擊力 - 常數攻擊力
 *  ─ 魔攻係數   = 1.0（平時）| 1.2（喝魔法攻擊藥水）
 */
const totalMagAtk = computed(() => {
    const titleMagAtk =
        (state.titles.primary === "end_of_love" ? TITLES_DATA.end_of_love.magAtk : 0) +
        (state.titles.secondary === "rowan" ? TITLES_DATA.rowan.magAtk : 0);

    // 面板魔法攻擊力（含稱號）
    const panel = state.weapon.baseMagicAttack + titleMagAtk;

    // 常數攻擊力：精武等級100 + 黑魔（由 checkbox 決定是否計入面板）
    const constAtk = (state.weapon.jingSword100 ? 50 : 0) + (state.weapon.darkMagic ? 250 : 0);

    // 基礎魔法攻擊力 = 面板 - 常數
    const baseAtk = panel - constAtk;

    // 魔攻係數
    const coeff = state.buffs.magAtkPotion ? 1.2 : 1.0;

    const vivDec = state.weapon.vivace / 100;
    const ss = state.generalExtra.statusSupport ? 0.12 : 0; // 狀態支援5231 +12%
    const tg = state.generalExtra.strengthGather ? 0.15 : 0; // 力量團聚 +15%

    return (baseAtk * coeff + constAtk) * (1 + vivDec * coeff) * (1 + ss * coeff) * (1 + tg * coeff);
});

/** 取武器 CONFIG 欄位（型別安全） */
const wb = (key: string) => (WEAPON_BASE as Record<string, Record<string, number>>)[key] ?? {};

/** 雷擊傷害計算 */
const thunderResult = computed(() => {
    // ── A ──────────────────────────────────────────
    const A = totalMagAtk.value;

    // ── B1：雷擊倍率 = (200% + 細工*0.5% + 魔法陣*1%) × 6 ──
    const thunderRefLv = state.refinement.thunder_max;
    const thunderMCLv = isMCSelected("thunder") ? (state.magicCircles.levels["thunder"] ?? 0) : 0;
    const B1 = (2.0 + thunderRefLv * 0.005 + thunderMCLv * 0.01) * 6;

    // ── C1：雷精通 = 1 + 15% + 細工*0.5% + 套裝15% + 賦予*1% + 稱號 + 武器 ──
    const lightRefLv = state.refinement.lightning_mast;
    const grantLv = state.grants.lightningMastery;
    const masterySetC1 = state.sets.masteryAttr ? 0.15 : 0;
    const titleC1 = state.titles.secondary === "rowan" ? TITLES_DATA.rowan.boltMastery : 0;
    const weaponC1 = wb(state.weapon.mainHand).c1_mastery ?? 0; // 大杖 +35%
    const C1 = 1 + 0.15 + lightRefLv * 0.005 + masterySetC1 + grantLv * 0.01 + titleC1 + weaponC1;

    // ── D1：中級魔法增傷 = 1 + 爾格10% + 武器% ──
    const ergD1 = state.weapon.isErge50 ? 0.1 : 0;
    const weaponD1 = wb(state.weapon.mainHand).d1_interm ?? 0; // 貓杖/魂杖 +35%
    const D1 = 1 + ergD1 + weaponD1;

    // ── E：武器評價合計 ──
    const mainEval = wb(state.weapon.mainHand).weapon_eval ?? 0;
    const offEval = offHandEnabled.value ? (wb(state.weapon.offHand).weapon_eval ?? 0) : 0;
    const E = mainEval + offEval;

    // ── F：黑魔同步 ──
    const F = state.weapon.type === "wand" ? 0.1 : 0.15;

    // ── G：才能額外 ──
    const G =
        (state.talentExtra.spiritCol1 ? 0.1 : 0) +
        (state.talentExtra.spiritCol2 ? 0.1 : 0) +
        (state.talentExtra.spiritMat ? 0.25 : 0) +
        (state.talentExtra.blueMoon ? 0.05 : 0);

    // ── H：通用額外 ──
    const upgradeH = state.weapon.upgrade === "S7" ? 0.09 : state.weapon.upgrade === "S8" ? 0.11 : 0;
    const titleH = state.titles.secondary === "rowan" ? TITLES_DATA.rowan.extraDmg : 0;
    const H =
        state.generalExtra.farm / 100 +
        state.generalExtra.totem / 100 +
        state.generalExtra.dogSpirit / 100 +
        (state.generalExtra.vip ? 0.01 : 0) +
        upgradeH +
        titleH;

    // ── I：魂長額外 ──
    const I = wb(state.weapon.mainHand).soul_extra ?? 0; // 魂杖 +10%

    // ── 最終傷害 ──
    const damage = A * B1 * C1 * D1 * (1 + E) * (1 + G + H) * (1 + F) * (1 + I);

    return {
        damage,
        vars: {
            A,
            B1,
            C1,
            D1,
            E,
            F,
            G,
            H,
            I,
            thunderRefLv,
            thunderMCLv,
            lightRefLv,
            grantLv,
            masterySetC1,
            titleC1,
            weaponC1,
            ergD1,
            weaponD1,
            mainEval,
            offEval,
            upgradeH,
            titleH,
        },
    };
});

/** 火球傷害計算 */
const fireballResult = computed(() => {
    // ── A ──────────────────────────────────────────
    const A = totalMagAtk.value;

    // ── B2：火球倍率 = 1010% + 細工*1% + 魔法陣*5% ──
    const fireballRefLv = state.refinement.fireball_max;
    const fireballMCLv = isMCSelected("fireball") ? (state.magicCircles.levels["fireball"] ?? 0) : 0;
    const B2 = 10.1 + fireballRefLv * 0.01 + fireballMCLv * 0.05;

    // ── C2：火精通 = 1 + 15% + 細工*0.5% + 套裝(火強+精通) + 賦予*1% + 稱號 + 武器 ──
    const fireRefLv = state.refinement.fire_mast;
    const grantLv = state.grants.fireMastery;
    const masterySetC2 = (state.sets.fireEnhance ? 0.15 : 0) + (state.sets.masteryAttr ? 0.15 : 0);
    const titleC2 = state.titles.secondary === "rowan" ? TITLES_DATA.rowan.boltMastery : 0;
    const weaponC2 = wb(state.weapon.mainHand).c1_mastery ?? 0; // 大杖 +35%
    const C2 = 1 + 0.15 + fireRefLv * 0.005 + masterySetC2 + grantLv * 0.01 + titleC2 + weaponC2;

    // ── D1：中級魔法增傷 = 1 + 爾格10% + 武器% ──
    const ergD1 = state.weapon.isErge50 ? 0.1 : 0;
    const weaponD1 = wb(state.weapon.mainHand).d1_interm ?? 0; // 貓杖/魂杖 +35%
    const D1 = 1 + ergD1 + weaponD1;

    // ── E：武器評價合計 ──
    const mainEval = wb(state.weapon.mainHand).weapon_eval ?? 0;
    const offEval = offHandEnabled.value ? (wb(state.weapon.offHand).weapon_eval ?? 0) : 0;
    const E = mainEval + offEval;

    // ── F：黑魔同步 ──
    const F = state.weapon.type === "wand" ? 0.1 : 0.15;

    // ── G：才能額外 ──
    const G =
        (state.talentExtra.spiritCol1 ? 0.1 : 0) +
        (state.talentExtra.spiritCol2 ? 0.1 : 0) +
        (state.talentExtra.spiritMat ? 0.25 : 0) +
        (state.talentExtra.blueMoon ? 0.05 : 0);

    // ── H：通用額外 ──
    const upgradeH = state.weapon.upgrade === "S7" ? 0.09 : state.weapon.upgrade === "S8" ? 0.11 : 0;
    const titleH = state.titles.secondary === "rowan" ? TITLES_DATA.rowan.extraDmg : 0;
    const H =
        state.generalExtra.farm / 100 +
        state.generalExtra.totem / 100 +
        state.generalExtra.dogSpirit / 100 +
        (state.generalExtra.vip ? 0.01 : 0) +
        upgradeH +
        titleH;

    // 火球無 I 項
    const damage = A * B2 * C2 * D1 * (1 + E) * (1 + G + H) * (1 + F);

    return {
        damage,
        vars: {
            A,
            B2,
            C2,
            D1,
            E,
            F,
            G,
            H,
            fireballRefLv,
            fireballMCLv,
            fireRefLv,
            grantLv,
            masterySetC2,
            titleC2,
            weaponC2,
            ergD1,
            weaponD1,
            mainEval,
            offEval,
            upgradeH,
            titleH,
        },
    };
});

/** 龍焰 Explosion Lunge 傷害計算
 *  公式：A × (1+C2) × (1+E) × [B3×(1+H) + B2×(1+G+H)] × (1+F) × (1+J)
 *  ─ B3 = 5000%（固定龍焰倍率），只吃 H（不含 G 才能）
 *  ─ B2 = 火球倍率，同時吃 G+H
 *  ─ J  = 暗黑連結 buff +10%（toggle）
 */
const explosionLungeResult = computed(() => {
    // ── A ──────────────────────────────────────────
    const A = totalMagAtk.value;

    // ── C2 bonus（火精通加成部分，不含底數 1） ──────
    const fireRefLv = state.refinement.fire_mast;
    const grantLv = state.grants.fireMastery;
    const masterySetC2 = (state.sets.fireEnhance ? 0.15 : 0) + (state.sets.masteryAttr ? 0.15 : 0);
    const titleC2 = state.titles.secondary === "rowan" ? TITLES_DATA.rowan.boltMastery : 0;
    const weaponC2 = wb(state.weapon.mainHand).c1_mastery ?? 0; // 大杖 +35%
    const C2 = 0.15 + fireRefLv * 0.005 + masterySetC2 + grantLv * 0.01 + titleC2 + weaponC2;

    // ── B3：龍焰固定倍率 5000% ──────────────────────
    const B3 = 50.0;

    // ── B2：火球倍率（同 fireballResult） ────────────
    const fireballRefLv = state.refinement.fireball_max;
    const fireballMCLv = isMCSelected("fireball") ? (state.magicCircles.levels["fireball"] ?? 0) : 0;
    const B2 = 10.1 + fireballRefLv * 0.01 + fireballMCLv * 0.05;

    // ── E：武器評價合計 ──
    const mainEval = wb(state.weapon.mainHand).weapon_eval ?? 0;
    const offEval = offHandEnabled.value ? (wb(state.weapon.offHand).weapon_eval ?? 0) : 0;
    const E = mainEval + offEval;

    // ── G：才能額外（B2 部分使用） ──
    const G =
        (state.talentExtra.spiritCol1 ? 0.1 : 0) +
        (state.talentExtra.spiritCol2 ? 0.1 : 0) +
        (state.talentExtra.spiritMat ? 0.25 : 0) +
        (state.talentExtra.blueMoon ? 0.05 : 0);

    // ── H：通用額外（B3 和 B2 均使用） ──
    const upgradeH = state.weapon.upgrade === "S7" ? 0.09 : state.weapon.upgrade === "S8" ? 0.11 : 0;
    const titleH = state.titles.secondary === "rowan" ? TITLES_DATA.rowan.extraDmg : 0;
    const H =
        state.generalExtra.farm / 100 +
        state.generalExtra.totem / 100 +
        state.generalExtra.dogSpirit / 100 +
        (state.generalExtra.vip ? 0.01 : 0) +
        upgradeH +
        titleH;

    // ── F：黑魔同步 ──
    const F = state.weapon.type === "wand" ? 0.1 : 0.15;

    // ── J：暗黑連結 Lighting Chain buff ──
    const J = state.buffs.darkLink ? 0.1 : 0;

    // ── 最終傷害 ────────────────────────────────────
    // 注意：B3 只吃 H，B2 同時吃 G+H
    const partB3 = B3 * (1 + H);
    const partB2 = B2 * (1 + G + H);
    const damage = A * (1 + C2) * (1 + E) * (partB3 + partB2) * (1 + F) * (1 + J);

    return {
        damage,
        vars: {
            A,
            C2,
            B3,
            B2,
            E,
            G,
            H,
            F,
            J,
            partB3,
            partB2,
            fireballRefLv,
            fireballMCLv,
            fireRefLv,
            grantLv,
            masterySetC2,
            titleC2,
            weaponC2,
            mainEval,
            offEval,
            upgradeH,
            titleH,
        },
    };
});

/** 共用 helper：G 才能額外 / H 通用額外 / E 評價 / F 同步 */
function calcGHEF() {
    const mainEval = wb(state.weapon.mainHand).weapon_eval ?? 0;
    const offEval = offHandEnabled.value ? (wb(state.weapon.offHand).weapon_eval ?? 0) : 0;
    const E = mainEval + offEval;
    const G =
        (state.talentExtra.spiritCol1 ? 0.1 : 0) +
        (state.talentExtra.spiritCol2 ? 0.1 : 0) +
        (state.talentExtra.spiritMat ? 0.25 : 0) +
        (state.talentExtra.blueMoon ? 0.05 : 0);
    const upgradeH = state.weapon.upgrade === "S7" ? 0.09 : state.weapon.upgrade === "S8" ? 0.11 : 0;
    const titleH = state.titles.secondary === "rowan" ? TITLES_DATA.rowan.extraDmg : 0;
    const H =
        state.generalExtra.farm / 100 +
        state.generalExtra.totem / 100 +
        state.generalExtra.dogSpirit / 100 +
        (state.generalExtra.vip ? 0.01 : 0) +
        upgradeH +
        titleH;
    const F = state.weapon.type === "wand" ? 0.1 : 0.15;
    return { E, G, H, F, mainEval, offEval, upgradeH, titleH };
}

/** 5蓄火焰傷害計算
 *  公式：A × B4 × C3 × (1+E) × (1+G+H) × (1+F) × 6.673
 *  ─ B4 基礎30% + 細工×1% + 魔法陣×0.1% + 法杖0.2% + 稱號
 *  ─ C3 = 1 + 15% + 精通魔杖150% + 箭系20% + 火細工×0.5% + 箭細工×1% + 套裝 + 賦予 + 稱號
 */
const fireBoltResult = computed(() => {
    const A = totalMagAtk.value;

    // ── B4：火焰倍率 ──────────────────────────────
    const fire_maxLv = state.refinement.fire_max;
    const fireMCLv = isMCSelected("fire") ? (state.magicCircles.levels["fire"] ?? 0) : 0;
    const staffB4 = state.weapon.type === "staff" ? BOLT_STAFF_BONUS : 0;
    const titleB4 =
        state.titles.secondary === "rowan"
            ? TITLES_DATA.rowan.boltMastery
            : state.titles.secondary === "butterfly"
              ? TITLES_DATA.butterfly.fireMult
              : 0;
    const B4 = 0.3 + fire_maxLv * 0.01 + fireMCLv * 0.001 + staffB4 + titleB4;

    // ── C3：火精通 ────────────────────────────────
    const fireRefLv = state.refinement.fire_mast;
    const boltRefLv = state.refinement.bolt_mast;
    const grantLv = state.grants.fireMastery;
    const setC3 = (state.sets.fireEnhance ? 0.15 : 0) + (state.sets.masteryAttr ? 0.15 : 0);
    const titleC3 =
        state.titles.secondary === "rowan"
            ? TITLES_DATA.rowan.boltMastery
            : state.titles.secondary === "butterfly"
              ? TITLES_DATA.butterfly.boltMastery
              : 0;
    const C3 =
        1 +
        0.15 +
        BOLT_PASSIVE_WAND +
        BOLT_PASSIVE_BOLT +
        fireRefLv * 0.005 +
        boltRefLv * 0.01 +
        setC3 +
        grantLv * 0.01 +
        titleC3;

    const { E, G, H, F, mainEval, offEval, upgradeH, titleH } = calcGHEF();

    // 5蓄火焰 = A × B4 × C3 × (1+E) × (1+G+H) × (1+F) × 6.673
    const damage = A * B4 * C3 * (1 + E) * (1 + G + H) * (1 + F) * FIRE_BOLT_CONST;

    return {
        damage,
        vars: {
            A,
            B4,
            C3,
            E,
            G,
            H,
            F,
            fire_maxLv,
            fireMCLv,
            staffB4,
            titleB4,
            fireRefLv,
            boltRefLv,
            grantLv,
            setC3,
            titleC3,
            mainEval,
            offEval,
            upgradeH,
            titleH,
        },
    };
});

/** 雷矢傷害計算
 *  公式：A × B5 × C4 × (1+E) × (1+G+H) × (1+F)
 *  ─ B5 基礎40% + 細工×1% + 魔法陣×0.1% + 法杖0.2% + 稱號
 *  ─ C4 = 1 + 15% + 精通魔杖150% + 箭系20% + 雷細工×0.5% + 箭細工×1% + 套裝 + 賦予 + 稱號 + 5蓄28%
 */
const lightningBoltResult = computed(() => {
    const A = totalMagAtk.value;

    // ── B5：雷矢倍率 ──────────────────────────────
    const lightning_maxLv = state.refinement.lightning_max;
    const lightningMCLv = isMCSelected("lightning") ? (state.magicCircles.levels["lightning"] ?? 0) : 0;
    const staffB5 = state.weapon.type === "staff" ? BOLT_STAFF_BONUS : 0;
    const titleB5 =
        state.titles.secondary === "rowan"
            ? TITLES_DATA.rowan.boltMastery
            : state.titles.secondary === "butterfly"
              ? TITLES_DATA.butterfly.fireMult
              : 0;
    const B5 = 0.4 + lightning_maxLv * 0.01 + lightningMCLv * 0.001 + staffB5 + titleB5;

    // ── C4：雷精通 ────────────────────────────────
    const lightRefLv = state.refinement.lightning_mast;
    const boltRefLv = state.refinement.bolt_mast;
    const grantLv = state.grants.lightningMastery;
    const setC4 = state.sets.masteryAttr ? 0.15 : 0;
    const titleC4 =
        state.titles.secondary === "rowan"
            ? TITLES_DATA.rowan.boltMastery
            : state.titles.secondary === "butterfly"
              ? TITLES_DATA.butterfly.boltMastery
              : 0;
    const C4 =
        1 +
        0.15 +
        BOLT_PASSIVE_WAND +
        BOLT_PASSIVE_BOLT +
        lightRefLv * 0.005 +
        boltRefLv * 0.01 +
        setC4 +
        grantLv * 0.01 +
        titleC4 +
        BOLT_5CHARGE_BONUS; // 雷矢5蓄傷害獎勵 +28%

    const { E, G, H, F, mainEval, offEval, upgradeH, titleH } = calcGHEF();

    // 雷矢 = A × B5 × C4 × (1+E) × (1+G+H) × (1+F)
    const damage = A * B5 * C4 * (1 + E) * (1 + G + H) * (1 + F);

    return {
        damage,
        vars: {
            A,
            B5,
            C4,
            E,
            G,
            H,
            F,
            lightning_maxLv,
            lightningMCLv,
            staffB5,
            titleB5,
            lightRefLv,
            boltRefLv,
            grantLv,
            setC4,
            titleC4,
            mainEval,
            offEval,
            upgradeH,
            titleH,
        },
    };
});

/** 火雷組合魔法傷害 Fusion Bolt
 *  公式：(5蓄火焰 + 雷矢) × (1+K) × (1+J) × (1+F) × (1+K) × 0.85
 *  ─ J 組合魔法加成: 基礎30% + 細工×1% + 魔法陣×1% + 稱號(蝴蝶5%) + 武器(貓短/魂短 35%)
 *  ─ K 組合魔法大師稱號: +5%（(1+K) 在公式中出現兩次）
 */
const fusionBoltResult = computed(() => {
    const fireBoltDmg = fireBoltResult.value.damage;
    const lightningBoltDmg = lightningBoltResult.value.damage;
    const baseDamage = fireBoltDmg + lightningBoltDmg;

    // ── J：組合魔法加成 ────────────────────────────
    const ccRefLv = state.refinement.cc_damage;
    const comboMCLv = isMCSelected("combo") ? (state.magicCircles.levels["combo"] ?? 0) : 0;
    const titleJ = state.titles.secondary === "butterfly" ? TITLES_DATA.butterfly.ccBonus : 0;
    const weaponJ = wb(state.weapon.mainHand).cc_bonus ?? 0; // 貓短/魂短 +35%
    const J = 0.3 + ccRefLv * 0.01 + comboMCLv * 0.01 + titleJ + weaponJ;

    // ── K：組合魔法大師稱號 ────────────────────────
    const K = state.titles.primary === "cc_master" ? TITLES_DATA.cc_master.primaryCC : 0;

    // ── F：黑魔同步 ───────────────────────────────
    const F = state.weapon.type === "wand" ? 0.1 : 0.15;

    // 注意：(1+K) 在公式中出現兩次
    const damage = baseDamage * (1 + K) * (1 + J) * (1 + F) * (1 + K) * 0.85;

    return {
        damage,
        vars: { baseDamage, fireBoltDmg, lightningBoltDmg, J, K, F, ccRefLv, comboMCLv, titleJ, weaponJ },
    };
});

/** 暗黑連結 Lighting Chain 傷害
 *  公式：(555% × (1+C4) × (1+G+H) × (1+E) + 1) × 雷矢傷害 × (1+F)
 *  ─ C4 同雷矢的雷精通因子
 *  ─ +1 代表雷矢傷害的基礎倍數（加法在括號內）
 */
const lightingChainResult = computed(() => {
    const lightBoltDmg = lightningBoltResult.value.damage;

    // ── C4（與雷矢相同計算） ──────────────────────
    const lightRefLv = state.refinement.lightning_mast;
    const boltRefLv = state.refinement.bolt_mast;
    const grantLv = state.grants.lightningMastery;
    const setC4 = state.sets.masteryAttr ? 0.15 : 0;
    const titleC4 =
        state.titles.secondary === "rowan"
            ? TITLES_DATA.rowan.boltMastery
            : state.titles.secondary === "butterfly"
              ? TITLES_DATA.butterfly.boltMastery
              : 0;
    const C4 =
        1 +
        0.15 +
        BOLT_PASSIVE_WAND +
        BOLT_PASSIVE_BOLT +
        lightRefLv * 0.005 +
        boltRefLv * 0.01 +
        setC4 +
        grantLv * 0.01 +
        titleC4 +
        BOLT_5CHARGE_BONUS;

    const { E, G, H, F } = calcGHEF();

    // 連鎖係數（括號內的 555%×... 部分）
    const chainBonus = 0.555 * (1 + C4) * (1 + G + H) * (1 + E);

    // 最終傷害
    const damage = (chainBonus + 1) * lightBoltDmg * (1 + F);

    return {
        damage,
        vars: { chainBonus, C4, E, G, H, F, lightBoltDmg, lightRefLv, boltRefLv, grantLv, setC4, titleC4 },
    };
});

// ── 暴擊率 / 暴擊傷害 ──────────────────────────────
const critRateTotal = computed(() => {
    const base = 37.5;
    const arcane = state.critRate.arcaneLv;
    const spirit = state.critRate.spiritWeapon ? 5 : 0;
    const barrier = state.critRate.barrier ? 1 : 0;
    return base + arcane + spirit + barrier;
});

const critDmgR7Bonus = computed(() => (state.weapon.upgrade === "R7" ? 74 : state.weapon.upgrade === "R8" ? 80 : 0));

const critDmgTotal = computed(() => {
    const base = 260;
    const spirit = state.critDmg.spiritWeapon ? 15 : 0;
    const farm = state.critDmg.farm;
    const totem = state.critDmg.totem;
    const other = state.critDmg.other;
    return base + spirit + farm + totem + other + critDmgR7Bonus.value;
});

// ── UI helpers ────────────────────────────────────────
const showThunderBreak = ref(false);
const showFireballBreak = ref(false);
const showExplosionLungeBreak = ref(false);
const showFireBoltBreak = ref(false);
const showLightningBoltBreak = ref(false);
const showFusionBoltBreak = ref(false);
const showLightingChainBreak = ref(false);

const collapsed = reactive({
    weapon: false,
    sets: false,
    refinement: false,
    magicCircle: false,
    talentExtra: false,
    generalExtra: false,
    critRate: false,
    critDmg: false,
    buffs: false,
    debuffs: false,
    titles: false,
    simulation: false,
    presets: false,
});
const COLLAPSED_KEYS = Object.keys(collapsed) as (keyof typeof collapsed)[];
const allCollapsed = computed(() => COLLAPSED_KEYS.every((k) => collapsed[k]));
function toggleAllSections() {
    const next = !allCollapsed.value;
    COLLAPSED_KEYS.forEach((k) => (collapsed[k] = next));
}

const fmt = (n: number) => n.toLocaleString("zh-TW", { maximumFractionDigits: 0 });
const fmtF = (n: number) => n.toFixed(4);
const pct = (n: number) => (n * 100).toFixed(1) + "%";

// Debug JSON
const stateJson = computed(() => JSON.stringify(state, null, 2));

// ═══════════════════════════════════════════════════════
//  PRESET MANAGEMENT
// ═══════════════════════════════════════════════════════

const PRESET_KEY = "mabinogi-magic-calc-presets";

interface Preset {
    id: string;
    name: string;
    createdAt: number;
    data: Record<string, unknown>;
}

function loadFromStorage(): Preset[] {
    try {
        const raw = localStorage.getItem(PRESET_KEY);
        return raw ? (JSON.parse(raw) as Preset[]) : [];
    } catch {
        return [];
    }
}

const presets = ref<Preset[]>(loadFromStorage());
const newPresetName = ref("");
const presetConfirmDelete = ref<string | null>(null); // id waiting for delete confirm

function persistPresets() {
    localStorage.setItem(PRESET_KEY, JSON.stringify(presets.value));
}

function genId(): string {
    return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

/** 取出 state 中所有「資料欄位」的深拷貝（排除 UI 暫存） */
function stateSnapshot(): Record<string, unknown> {
    return JSON.parse(
        JSON.stringify({
            weapon: state.weapon,
            titles: state.titles,
            sets: state.sets,
            refinement: state.refinement,
            grants: state.grants,
            magicCircles: state.magicCircles,
            talentExtra: state.talentExtra,
            generalExtra: state.generalExtra,
            critRate: state.critRate,
            critDmg: state.critDmg,
            simulation: state.simulation,
            buffs: state.buffs,
        }),
    );
}

/** 遞迴合併 source 進 target（保留目前 state 中 source 沒有的 key） */
function deepMerge(target: Record<string, unknown>, source: Record<string, unknown>) {
    for (const key in source) {
        const sv = source[key];
        if (sv !== null && typeof sv === "object" && !Array.isArray(sv)) {
            if (typeof target[key] !== "object" || target[key] === null) target[key] = {};
            deepMerge(target[key] as Record<string, unknown>, sv as Record<string, unknown>);
        } else {
            target[key] = sv;
        }
    }
}

function savePreset() {
    const name = newPresetName.value.trim() || `配置 ${presets.value.length + 1}`;
    presets.value.unshift({
        id: genId(),
        name,
        createdAt: Date.now(),
        data: stateSnapshot(),
    });
    newPresetName.value = "";
    persistPresets();
}

function loadPreset(preset: Preset) {
    deepMerge(state as unknown as Record<string, unknown>, preset.data);
}

function deletePreset(id: string) {
    presets.value = presets.value.filter((p) => p.id !== id);
    presetConfirmDelete.value = null;
    persistPresets();
}

function formatPresetDate(ts: number): string {
    const d = new Date(ts);
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

const weaponEvalSummary = computed(() => {
    const main = wb(state.weapon.mainHand).weapon_eval ?? 0;
    const off = offHandEnabled.value ? (wb(state.weapon.offHand).weapon_eval ?? 0) : 0;
    return {
        mainEval: pct(main),
        offEval: pct(off),
        totalEval: pct(main + off),
        bonuses: Object.entries(wb(state.weapon.mainHand))
            .filter(([k]) => k !== "weapon_eval")
            .map(([k, v]) => ({ k, v })),
    };
});
</script>

<template>
    <div class="arch-mage-sim">
        <h1 class="page-title">
            <span class="text-gradient">魔法傷害模擬器</span>
            <span class="page-subtitle">Arch-Mage Simulator</span>
        </h1>

        <div class="sim-layout">
            <!-- ════════════════════════════════
                 左側 — 表單
            ════════════════════════════════ -->
            <div class="form-panel">
                <!-- 全部折疊/開啟 toggle -->
                <div class="collapse-all-row">
                    <el-button size="small" plain @click="toggleAllSections">
                        {{ allCollapsed ? '▶ 全部展開' : '▼ 全部折疊' }}
                    </el-button>
                </div>

                <!-- A. 武器配置 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.weapon }">
                    <h2 class="section-title section-toggle" @click="collapsed.weapon = !collapsed.weapon">
                        ⚔️ 武器配置
                        <span class="toggle-chevron" :class="{ rotated: collapsed.weapon }">▼</span>
                    </h2>
                    <div v-show="!collapsed.weapon">
                        <div class="field-row">
                            <label class="field-label">面板魔攻</label>
                            <el-input-number
                                v-model="state.weapon.baseMagicAttack"
                                :min="0"
                                :max="99999"
                                :precision="0"
                                size="small"
                                style="width: 130px"
                            />
                        </div>
                        <!-- 常數攻擊力 — 計入面板的固定值 -->
                        <div class="field-row const-atk-row">
                            <div class="const-atk-checks">
                                <el-checkbox v-model="state.weapon.jingSword100">
                                    精武等級 100
                                    <span class="field-hint">(+50 魔攻)</span>
                                </el-checkbox>
                                <el-checkbox v-model="state.weapon.darkMagic">
                                    黑魔 Dark Magic
                                    <span class="field-hint">(+250 魔攻)</span>
                                </el-checkbox>
                            </div>
                        </div>

                        <div class="field-row">
                            <label class="field-label">武器類型</label>
                            <el-radio-group v-model="state.weapon.type" size="small">
                                <el-radio-button value="wand">短杖</el-radio-button>
                                <el-radio-button value="staff">集魔杖</el-radio-button>
                            </el-radio-group>
                            <span class="field-hint">同步：短杖 +10% / 集魔杖 +15%</span>
                        </div>

                        <div class="field-row">
                            <el-checkbox v-model="state.weapon.isErge50">
                                爾格 50
                                <span class="field-hint">(D1 中級魔法 +10%)</span>
                            </el-checkbox>
                        </div>

                        <div class="field-row">
                            <label class="field-label">主手武器</label>
                            <el-select v-model="state.weapon.mainHand" size="small" style="width: 150px">
                                <el-option
                                    v-for="opt in mainHandOptions"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                        </div>

                        <div class="field-row">
                            <label class="field-label">
                                副手
                                <el-tag v-if="!offHandEnabled" size="small" type="info" style="margin-left: 4px">
                                    集魔杖無副手
                                </el-tag>
                            </label>
                            <el-select
                                v-model="state.weapon.offHand"
                                size="small"
                                style="width: 150px"
                                :disabled="!offHandEnabled"
                            >
                                <el-option
                                    v-for="opt in OFFHAND_OPTIONS"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                        </div>

                        <div class="field-row">
                            <label class="field-label">
                                改造
                                <el-tag v-if="isSoulWeapon" size="small" type="warning" style="margin-left: 4px">
                                    魂系解鎖 S8/R8
                                </el-tag>
                            </label>
                            <el-select v-model="state.weapon.upgrade" size="small" style="width: 150px">
                                <el-option
                                    v-for="opt in upgradeOptions"
                                    :key="opt.value"
                                    :label="opt.label"
                                    :value="opt.value"
                                />
                            </el-select>
                        </div>

                        <!-- 武器評價摘要 -->
                        <div class="eval-summary">
                            <span>主手 {{ weaponEvalSummary.mainEval }}</span>
                            <span v-if="offHandEnabled && state.weapon.offHand !== 'none'">
                                + 副手 {{ weaponEvalSummary.offEval }}
                            </span>
                            <strong class="eval-total">= 合計 {{ weaponEvalSummary.totalEval }}</strong>
                            <span v-for="b in weaponEvalSummary.bonuses" :key="b.k" class="eval-bonus">
                                {{ b.k }}: +{{ pct(b.v as number) }}
                            </span>
                        </div>
                    </div>
                    <!-- /collapsed.weapon -->
                </section>

                <!-- C. 套裝效果 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.sets }">
                    <h2 class="section-title section-toggle" @click="collapsed.sets = !collapsed.sets">
                        🛡️ 套裝效果
                        <span class="toggle-chevron" :class="{ rotated: collapsed.sets }">▼</span>
                    </h2>
                    <div v-show="!collapsed.sets">
                        <div class="field-row">
                            <el-checkbox v-model="state.sets.fireEnhance">火焰強化（黑柏）</el-checkbox>
                            <el-tooltip content="火焰精通 +15%" placement="right">
                                <el-icon class="set-info-icon"><info-filled /></el-icon>
                            </el-tooltip>
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.sets.masteryAttr">精通屬性魔法傷害（秘術/元素）</el-checkbox>
                            <el-tooltip content="火/雷精通各 +15%" placement="right">
                                <el-icon class="set-info-icon"><info-filled /></el-icon>
                            </el-tooltip>
                        </div>
                    </div>
                    <!-- /collapsed.sets -->
                </section>

                <!-- D. 細工數值 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.refinement }">
                    <h2 class="section-title section-toggle" @click="collapsed.refinement = !collapsed.refinement">
                        ⚙️ 細工數值
                        <span class="toggle-chevron" :class="{ rotated: collapsed.refinement }">▼</span>
                    </h2>
                    <div v-show="!collapsed.refinement">
                        <p class="subsection-label">精通類</p>
                        <div class="ref-grid">
                            <div v-for="d in MASTERY_REFS" :key="d.key" class="ref-item">
                                <label class="ref-label">{{ d.label }}</label>
                                <el-input-number
                                    v-model="(state.refinement as any)[d.key]"
                                    :min="0"
                                    :max="d.max"
                                    :step="1"
                                    :precision="0"
                                    size="small"
                                    style="width: 85px"
                                />
                                <span class="ref-max-hint">/ {{ d.max }}</span>
                            </div>
                            <!-- 賦予：雷精通 -->
                            <div class="ref-item">
                                <label class="ref-label">賦予（雷精通）</label>
                                <el-input-number
                                    v-model="state.grants.lightningMastery"
                                    :min="0"
                                    :max="3"
                                    :step="1"
                                    :precision="0"
                                    size="small"
                                    style="width: 85px"
                                />
                                <span class="ref-max-hint">/ 3</span>
                            </div>
                            <!-- 賦予：火精通 -->
                            <div class="ref-item">
                                <label class="ref-label">賦予（火精通）</label>
                                <el-input-number
                                    v-model="state.grants.fireMastery"
                                    :min="0"
                                    :max="3"
                                    :step="1"
                                    :precision="0"
                                    size="small"
                                    style="width: 85px"
                                />
                                <span class="ref-max-hint">/ 3</span>
                            </div>
                        </div>

                        <p class="subsection-label" style="margin-top: 0.75rem">技能類</p>
                        <div class="ref-grid">
                            <div v-for="d in SKILL_REFS" :key="d.key" class="ref-item">
                                <label class="ref-label">{{ d.label }}</label>
                                <el-input-number
                                    v-model="(state.refinement as any)[d.key]"
                                    :min="0"
                                    :max="d.max"
                                    :step="1"
                                    :precision="0"
                                    size="small"
                                    style="width: 85px"
                                />
                                <span class="ref-max-hint">/ {{ d.max }}</span>
                            </div>
                        </div>
                    </div>
                    <!-- /collapsed.refinement -->
                </section>

                <!-- E. 魔法陣 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.magicCircle }">
                    <h2 class="section-title section-toggle" @click="collapsed.magicCircle = !collapsed.magicCircle">
                        🔮 魔法陣
                        <span class="mc-counter">{{ state.magicCircles.selected.length }} / {{ MC_MAX }}</span>
                        <span class="toggle-chevron" :class="{ rotated: collapsed.magicCircle }">▼</span>
                    </h2>
                    <div v-show="!collapsed.magicCircle">
                        <div class="mc-list">
                            <div v-for="mc in MC_OPTIONS" :key="mc.key" class="mc-item">
                                <el-checkbox
                                    :model-value="isMCSelected(mc.key)"
                                    :disabled="isMCDisabled(mc.key)"
                                    @change="toggleMC(mc.key)"
                                >
                                    {{ mc.label }}
                                </el-checkbox>
                                <transition name="slide">
                                    <div v-if="isMCSelected(mc.key)" class="mc-level">
                                        <span class="mc-lv-label">Lv</span>
                                        <el-input-number
                                            v-model="state.magicCircles.levels[mc.key]"
                                            :min="1"
                                            :max="10"
                                            :step="1"
                                            :precision="0"
                                            size="small"
                                            style="width: 75px"
                                        />
                                    </div>
                                </transition>
                            </div>
                        </div>
                    </div>
                    <!-- /collapsed.magicCircle -->
                </section>

                <!-- G. 才能額外傷害 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.talentExtra }">
                    <h2 class="section-title section-toggle" @click="collapsed.talentExtra = !collapsed.talentExtra">
                        🌟 G — 才能額外傷害
                        <span class="toggle-chevron" :class="{ rotated: collapsed.talentExtra }">▼</span>
                    </h2>
                    <div v-show="!collapsed.talentExtra">
                        <div class="field-row">
                            <el-checkbox v-model="state.talentExtra.spiritCol1">
                                精靈武器第二列-1
                                <span class="field-hint">(+10%)</span>
                            </el-checkbox>
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.talentExtra.spiritCol2">
                                精靈武器第二列-2
                                <span class="field-hint">(+10%)</span>
                            </el-checkbox>
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.talentExtra.spiritMat">
                                精靈武器實體化
                                <span class="field-hint">(+25%)</span>
                            </el-checkbox>
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.talentExtra.blueMoon">
                                人類藍月亮
                                <span class="field-hint">(+5%)</span>
                            </el-checkbox>
                        </div>
                    </div>
                    <!-- /collapsed.talentExtra -->
                </section>

                <!-- H. 通用額外傷害 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.generalExtra }">
                    <h2 class="section-title section-toggle" @click="collapsed.generalExtra = !collapsed.generalExtra">
                        📦 H — 通用額外傷害
                        <span class="toggle-chevron" :class="{ rotated: collapsed.generalExtra }">▼</span>
                    </h2>
                    <div v-show="!collapsed.generalExtra">
                        <p class="section-desc">S7/S8 Extra 與稱號 Extra 由武器改造及稱號欄位自動計入</p>

                        <div class="field-row">
                            <label class="field-label">農場物 %</label>
                            <el-input-number
                                v-model="state.generalExtra.farm"
                                :min="0"
                                :max="100"
                                :precision="1"
                                size="small"
                                style="width: 110px"
                            />
                        </div>
                        <div class="field-row">
                            <label class="field-label">圖騰 %</label>
                            <el-input-number
                                v-model="state.generalExtra.totem"
                                :min="0"
                                :max="100"
                                :precision="1"
                                size="small"
                                style="width: 110px"
                            />
                        </div>
                        <div class="field-row">
                            <label class="field-label">犬靈 %</label>
                            <el-input-number
                                v-model="state.generalExtra.dogSpirit"
                                :min="0"
                                :max="100"
                                :precision="1"
                                size="small"
                                style="width: 110px"
                            />
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.generalExtra.vip">
                                戰鬥 VIP
                                <span class="field-hint">(+1%)</span>
                            </el-checkbox>
                        </div>
                    </div>
                    <!-- /collapsed.generalExtra -->
                </section>

                <!-- I-a. 暴擊率 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.critRate }">
                    <h2 class="section-title section-toggle" @click="collapsed.critRate = !collapsed.critRate">
                        🎯 暴擊率
                        <span class="toggle-chevron" :class="{ rotated: collapsed.critRate }">▼</span>
                    </h2>
                    <div v-show="!collapsed.critRate">
                        <div class="field-row">
                            <span class="field-label">基礎 37.5%</span>
                            <el-tooltip content="基礎30% + 評價7.5%，現版本已合併" placement="right">
                                <el-icon class="set-info-icon"><info-filled /></el-icon>
                            </el-tooltip>
                        </div>
                        <div class="field-row">
                            <label class="field-label">祕法等級獎勵 %</label>
                            <el-input-number
                                v-model="state.critRate.arcaneLv"
                                :min="0"
                                :max="12"
                                :precision="0"
                                size="small"
                                style="width: 90px"
                            />
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.critRate.spiritWeapon">
                                精靈武器
                                <span class="field-hint">(+5%)</span>
                            </el-checkbox>
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.critRate.barrier">
                                結界
                                <span class="field-hint">(+1%)</span>
                            </el-checkbox>
                        </div>
                        <div class="stat-total-row">
                            <span class="stat-total-label">暴擊率總和</span>
                            <strong class="stat-total-value crit-rate-color">{{ critRateTotal.toFixed(1) }}%</strong>
                        </div>
                    </div>
                </section>

                <!-- I-b. 暴擊傷害 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.critDmg }">
                    <h2 class="section-title section-toggle" @click="collapsed.critDmg = !collapsed.critDmg">
                        💥 暴擊傷害
                        <span class="toggle-chevron" :class="{ rotated: collapsed.critDmg }">▼</span>
                    </h2>
                    <div v-show="!collapsed.critDmg">
                        <div class="field-row">
                            <span class="field-label">基礎 260%</span>
                            <el-tooltip content="基礎250% + 評價10%，現版本已合併" placement="right">
                                <el-icon class="set-info-icon"><info-filled /></el-icon>
                            </el-tooltip>
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.critDmg.spiritWeapon">
                                精靈武器
                                <span class="field-hint">(+15%)</span>
                            </el-checkbox>
                        </div>
                        <div class="field-row">
                            <label class="field-label">農場物 %</label>
                            <el-input-number
                                v-model="state.critDmg.farm"
                                :min="0"
                                :max="20"
                                :precision="0"
                                size="small"
                                style="width: 90px"
                            />
                        </div>
                        <div class="field-row">
                            <label class="field-label">圖騰 %</label>
                            <el-input-number
                                v-model="state.critDmg.totem"
                                :min="0"
                                :max="20"
                                :precision="0"
                                size="small"
                                style="width: 90px"
                            />
                        </div>
                        <div class="field-row">
                            <label class="field-label">其他 %</label>
                            <el-input-number
                                v-model="state.critDmg.other"
                                :min="0"
                                :max="20"
                                :precision="0"
                                size="small"
                                style="width: 90px"
                            />
                        </div>
                        <div v-if="critDmgR7Bonus > 0" class="field-row upgrade-bonus-row">
                            <span class="upgrade-bonus-label">武器改造 {{ state.weapon.upgrade }}</span>
                            <span class="upgrade-bonus-val">暴傷 +{{ critDmgR7Bonus }}%</span>
                        </div>
                        <div class="stat-total-row">
                            <span class="stat-total-label">暴擊傷害總和</span>
                            <strong class="stat-total-value crit-dmg-color">{{ critDmgTotal }}%</strong>
                        </div>
                    </div>
                </section>

                <!-- I. Buff -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.buffs }">
                    <h2 class="section-title section-toggle" @click="collapsed.buffs = !collapsed.buffs">
                        ⚡ Buff
                        <span class="toggle-chevron" :class="{ rotated: collapsed.buffs }">▼</span>
                    </h2>
                    <div v-show="!collapsed.buffs">
                        <div class="field-row">
                            <el-checkbox v-model="state.buffs.magAtkPotion">
                                魔法攻擊藥水
                                <span class="field-hint">— 魔攻係數 ×1.2</span>
                            </el-checkbox>
                        </div>
                        <div class="field-row">
                            <label class="field-label">活潑板 %</label>
                            <el-input-number
                                v-model="state.weapon.vivace"
                                :min="0"
                                :max="100"
                                :step="0.1"
                                :precision="1"
                                size="small"
                                style="width: 110px"
                            />
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.generalExtra.statusSupport">
                                狀態支援5231
                                <span class="field-hint">(+12%)</span>
                            </el-checkbox>
                        </div>
                        <div class="field-row">
                            <el-checkbox v-model="state.generalExtra.strengthGather">
                                力量團聚
                                <span class="field-hint">(+15%)</span>
                            </el-checkbox>
                        </div>
                    </div>
                    <!-- /collapsed.buffs -->
                </section>

                <!-- J. Debuff -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.debuffs }">
                    <h2 class="section-title section-toggle" @click="collapsed.debuffs = !collapsed.debuffs">
                        💀 Debuff
                        <span class="toggle-chevron" :class="{ rotated: collapsed.debuffs }">▼</span>
                    </h2>
                    <div v-show="!collapsed.debuffs">
                        <div class="field-row">
                            <el-checkbox v-model="state.buffs.darkLink">
                                暗黑連結
                                <span class="buff-en">Lighting Chain</span>
                                <span class="field-hint">— 龍焰傷害 +10% (J)</span>
                            </el-checkbox>
                        </div>
                    </div>
                    <!-- /collapsed.debuffs -->
                </section>

                <!-- K. 稱號 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.titles }">
                    <h2 class="section-title section-toggle" @click="collapsed.titles = !collapsed.titles">
                        👑 稱號
                        <span class="toggle-chevron" :class="{ rotated: collapsed.titles }">▼</span>
                    </h2>
                    <div v-show="!collapsed.titles">
                        <div class="field-row">
                            <label class="field-label">第一稱號</label>
                            <el-select v-model="state.titles.primary" size="small" style="width: 220px">
                                <el-option
                                    v-for="o in PRIMARY_TITLE_OPTIONS"
                                    :key="o.value"
                                    :label="o.label"
                                    :value="o.value"
                                />
                            </el-select>
                        </div>
                        <div class="field-row">
                            <label class="field-label">第二稱號</label>
                            <el-select v-model="state.titles.secondary" size="small" style="width: 220px">
                                <el-option
                                    v-for="o in SECONDARY_TITLE_OPTIONS"
                                    :key="o.value"
                                    :label="o.label"
                                    :value="o.value"
                                />
                            </el-select>
                        </div>
                    </div>
                    <!-- /collapsed.titles -->
                </section>

                <!-- F. 模擬次數 -->
                <section class="form-section" :class="{ 'is-collapsed': collapsed.simulation }">
                    <h2 class="section-title section-toggle" @click="collapsed.simulation = !collapsed.simulation">
                        📊 模擬技能次數
                        <span class="toggle-chevron" :class="{ rotated: collapsed.simulation }">▼</span>
                    </h2>
                    <div v-show="!collapsed.simulation">
                        <p class="section-desc">設定各技能次數以計算「總模擬分數」</p>
                        <div class="sim-grid">
                            <div v-for="item in SIMULATION_ITEMS" :key="item.key" class="sim-item">
                                <label class="sim-label">{{ item.label }}</label>
                                <el-input-number
                                    v-model="(state.simulation as any)[item.key]"
                                    :min="0"
                                    :step="1"
                                    :precision="0"
                                    size="small"
                                    style="width: 90px"
                                />
                                <span class="sim-unit">次</span>
                            </div>
                        </div>
                    </div>
                    <!-- /collapsed.simulation -->
                </section>

                <!-- L. 儲存配置 -->
                <section class="form-section preset-section" :class="{ 'is-collapsed': collapsed.presets }">
                    <h2 class="section-title section-toggle" @click="collapsed.presets = !collapsed.presets">
                        💾 儲存配置
                        <span class="preset-count" v-if="presets.length">{{ presets.length }}</span>
                        <span class="toggle-chevron" :class="{ rotated: collapsed.presets }">▼</span>
                    </h2>
                    <div v-show="!collapsed.presets">
                        <!-- 儲存列 -->
                        <div class="preset-save-row">
                            <el-input
                                v-model="newPresetName"
                                placeholder="配置名稱（選填）"
                                size="small"
                                clearable
                                @keyup.enter="savePreset"
                                class="preset-name-input"
                            />
                            <el-button type="primary" size="small" @click="savePreset">儲存</el-button>
                        </div>

                        <!-- 已儲存清單 -->
                        <div v-if="presets.length === 0" class="preset-empty">尚無儲存配置</div>
                        <div v-else class="preset-list">
                            <div
                                v-for="p in presets"
                                :key="p.id"
                                class="preset-item"
                                :class="{ 'confirm-del': presetConfirmDelete === p.id }"
                            >
                                <div class="preset-meta">
                                    <span class="preset-name">{{ p.name }}</span>
                                    <span class="preset-date">{{ formatPresetDate(p.createdAt) }}</span>
                                </div>
                                <div class="preset-actions">
                                    <template v-if="presetConfirmDelete === p.id">
                                        <span class="preset-del-confirm-label">確定刪除？</span>
                                        <el-button size="small" type="danger" plain @click="deletePreset(p.id)">確定</el-button>
                                        <el-button size="small" @click="presetConfirmDelete = null">取消</el-button>
                                    </template>
                                    <template v-else>
                                        <el-button size="small" type="success" plain @click="loadPreset(p)">讀取</el-button>
                                        <el-button size="small" type="danger" plain @click="presetConfirmDelete = p.id">🗑</el-button>
                                    </template>
                                </div>
                            </div>
                        </div>
                    </div>
                    <!-- /collapsed.presets -->
                </section>
            </div>
            <!-- /form-panel -->

            <!-- ════════════════════════════════
                 右側 — 計算結果 + Debug
            ════════════════════════════════ -->
            <div class="dashboard-panel">
                <!-- ── 雷擊傷害結果（集魔杖限定） ── -->
                <div v-show="state.weapon.type === 'staff'" class="result-card skill-thunder">
                    <div class="result-card-header">
                        <div class="skill-name">
                            <img width="32" height="32" :src="getSkillIcon(30102)" />
                            雷擊
                        </div>
                        <div class="damage-value">{{ fmt(thunderResult.damage) }}</div>
                    </div>

                    <!-- 公式展示 -->
                    <div class="formula-line">A × B1 × C1 × D1 × (1+E) × (1+G+H) × (1+F) × (1+I)</div>

                    <!-- 展開/收合詳細 -->
                    <el-button
                        size="small"
                        text
                        style="color: #818cf8; margin-top: 0.4rem"
                        @click="showThunderBreak = !showThunderBreak"
                    >
                        {{ showThunderBreak ? "▲ 收合明細" : "▼ 展開明細" }}
                    </el-button>

                    <transition name="slide">
                        <div v-if="showThunderBreak" class="breakdown-panel">
                            <table class="var-table">
                                <thead>
                                    <tr>
                                        <th>變數</th>
                                        <th>說明</th>
                                        <th>數值</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>A</td>
                                        <td>總魔法攻擊（含魔攻水20%/活潑板/狀態支援12%/稱號加值）</td>
                                        <td class="num-cell">{{ fmt(thunderResult.vars.A) }}</td>
                                    </tr>
                                    <tr>
                                        <td>B1</td>
                                        <td>
                                            雷擊倍率 (200% + 細工{{ thunderResult.vars.thunderRefLv }}等×0.5% + 魔法陣{{
                                                thunderResult.vars.thunderMCLv
                                            }}等×1%) ×6
                                        </td>
                                        <td class="num-cell">{{ fmtF(thunderResult.vars.B1) }}</td>
                                    </tr>
                                    <tr>
                                        <td>C1</td>
                                        <td>
                                            雷精通 (1 + 15%基礎 + 細工{{ thunderResult.vars.lightRefLv }}等×0.5% +
                                            套裝{{ pct(thunderResult.vars.masterySetC1) }} + 賦予{{
                                                thunderResult.vars.grantLv
                                            }}等×1% + 稱號{{ pct(thunderResult.vars.titleC1) }} + 武器{{
                                                pct(thunderResult.vars.weaponC1)
                                            }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(thunderResult.vars.C1) }}</td>
                                    </tr>
                                    <tr>
                                        <td>D1</td>
                                        <td>
                                            中級魔法增傷 (1 + 爾格{{ pct(thunderResult.vars.ergD1) }} + 武器{{
                                                pct(thunderResult.vars.weaponD1)
                                            }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(thunderResult.vars.D1) }}</td>
                                    </tr>
                                    <tr>
                                        <td>E</td>
                                        <td>
                                            武器評價合計（主手{{ pct(thunderResult.vars.mainEval) }} + 副手{{
                                                pct(thunderResult.vars.offEval)
                                            }}）
                                        </td>
                                        <td class="num-cell">{{ pct(thunderResult.vars.E) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+E</td>
                                        <td>武器評價乘數</td>
                                        <td class="num-cell">{{ fmtF(1 + thunderResult.vars.E) }}</td>
                                    </tr>
                                    <tr>
                                        <td>G</td>
                                        <td>才能額外傷害合計</td>
                                        <td class="num-cell">{{ pct(thunderResult.vars.G) }}</td>
                                    </tr>
                                    <tr>
                                        <td>H</td>
                                        <td>
                                            通用額外傷害合計 （改造{{ pct(thunderResult.vars.upgradeH) }} + 稱號{{
                                                pct(thunderResult.vars.titleH)
                                            }}
                                            + 農場/圖騰/犬靈/VIP）
                                        </td>
                                        <td class="num-cell">{{ pct(thunderResult.vars.H) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+G+H</td>
                                        <td>Extra 乘數</td>
                                        <td class="num-cell">
                                            {{ fmtF(1 + thunderResult.vars.G + thunderResult.vars.H) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>F</td>
                                        <td>
                                            黑魔同步（{{
                                                state.weapon.type === "wand" ? "短杖 +10%" : "集魔杖 +15%"
                                            }}，自動套用）
                                        </td>
                                        <td class="num-cell">{{ pct(thunderResult.vars.F) }}</td>
                                    </tr>
                                    <tr>
                                        <td>I</td>
                                        <td>魂長額外增傷（魂杖 +10%，其他 0%）</td>
                                        <td class="num-cell">{{ pct(thunderResult.vars.I) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                </div>

                <!-- ── 火球傷害結果 ── -->
                <div class="result-card skill-fireball">
                    <div class="result-card-header">
                        <div class="skill-name">
                            <img width="32" height="32" :src="getSkillIcon(30202)" />
                            火球
                        </div>
                        <div class="damage-value fireball-val">{{ fmt(fireballResult.damage) }}</div>
                    </div>

                    <!-- 公式展示 -->
                    <div class="formula-line">A × B2 × C2 × D1 × (1+E) × (1+G+H) × (1+F)</div>

                    <!-- 展開/收合詳細 -->
                    <el-button
                        size="small"
                        text
                        style="color: #f59e0b; margin-top: 0.4rem"
                        @click="showFireballBreak = !showFireballBreak"
                    >
                        {{ showFireballBreak ? "▲ 收合明細" : "▼ 展開明細" }}
                    </el-button>

                    <transition name="slide">
                        <div v-if="showFireballBreak" class="breakdown-panel">
                            <table class="var-table">
                                <thead>
                                    <tr>
                                        <th>變數</th>
                                        <th>說明</th>
                                        <th>數值</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>A</td>
                                        <td>總魔法攻擊（含魔攻水20%/活潑板/狀態支援12%/稱號加值）</td>
                                        <td class="num-cell">{{ fmt(fireballResult.vars.A) }}</td>
                                    </tr>
                                    <tr>
                                        <td>B2</td>
                                        <td>
                                            火球倍率 (1010% + 細工{{ fireballResult.vars.fireballRefLv }}等×1% +
                                            魔法陣{{ fireballResult.vars.fireballMCLv }}等×5%)
                                        </td>
                                        <td class="num-cell">{{ fmtF(fireballResult.vars.B2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>C2</td>
                                        <td>
                                            火精通 (1 + 15%基礎 + 細工{{ fireballResult.vars.fireRefLv }}等×0.5% +
                                            套裝{{ pct(fireballResult.vars.masterySetC2) }} + 賦予{{
                                                fireballResult.vars.grantLv
                                            }}等×1% + 稱號{{ pct(fireballResult.vars.titleC2) }} + 武器{{
                                                pct(fireballResult.vars.weaponC2)
                                            }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(fireballResult.vars.C2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>D1</td>
                                        <td>
                                            中級魔法增傷 (1 + 爾格{{ pct(fireballResult.vars.ergD1) }} + 武器{{
                                                pct(fireballResult.vars.weaponD1)
                                            }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(fireballResult.vars.D1) }}</td>
                                    </tr>
                                    <tr>
                                        <td>E</td>
                                        <td>
                                            武器評價合計（主手{{ pct(fireballResult.vars.mainEval) }} + 副手{{
                                                pct(fireballResult.vars.offEval)
                                            }}）
                                        </td>
                                        <td class="num-cell">{{ pct(fireballResult.vars.E) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+E</td>
                                        <td>武器評價乘數</td>
                                        <td class="num-cell">{{ fmtF(1 + fireballResult.vars.E) }}</td>
                                    </tr>
                                    <tr>
                                        <td>G</td>
                                        <td>才能額外傷害合計</td>
                                        <td class="num-cell">{{ pct(fireballResult.vars.G) }}</td>
                                    </tr>
                                    <tr>
                                        <td>H</td>
                                        <td>
                                            通用額外傷害合計 （改造{{ pct(fireballResult.vars.upgradeH) }} + 稱號{{
                                                pct(fireballResult.vars.titleH)
                                            }}
                                            + 農場/圖騰/犬靈/VIP）
                                        </td>
                                        <td class="num-cell">{{ pct(fireballResult.vars.H) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+G+H</td>
                                        <td>Extra 乘數</td>
                                        <td class="num-cell">
                                            {{ fmtF(1 + fireballResult.vars.G + fireballResult.vars.H) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>F</td>
                                        <td>
                                            黑魔同步（{{
                                                state.weapon.type === "wand" ? "短杖 +10%" : "集魔杖 +15%"
                                            }}，自動套用）
                                        </td>
                                        <td class="num-cell">{{ pct(fireballResult.vars.F) }}</td>
                                    </tr>
                                    <tr>
                                        <td colspan="2" style="color: #6b7280; font-style: italic">
                                            火球無 I 項（魂長額外）
                                        </td>
                                        <td class="num-cell">—</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                </div>

                <!-- ── 龍焰 Explosion Lunge 傷害結果 ── -->
                <div class="result-card skill-lunge">
                    <div class="result-card-header">
                        <div class="skill-name">
                            <img width="32" height="32" :src="getSkillIcon(59040)" />
                            龍焰
                            <span class="skill-en">Explosion Lunge</span>
                        </div>
                        <div class="damage-value lunge-val">{{ fmt(explosionLungeResult.damage) }}</div>
                    </div>

                    <!-- 公式展示 -->
                    <div class="formula-line">A × (1+C2) × (1+E) × [B3×(1+H) + B2×(1+G+H)] × (1+F) × (1+J)</div>
                    <div class="formula-note">
                        B3=5000%固定；B2=火球倍率；B3 段不含 G 才能加成
                        <span v-if="state.buffs.darkLink" class="buff-active">｜暗黑連結 J +10%</span>
                    </div>

                    <el-button
                        size="small"
                        text
                        style="color: #ef4444; margin-top: 0.4rem"
                        @click="showExplosionLungeBreak = !showExplosionLungeBreak"
                    >
                        {{ showExplosionLungeBreak ? "▲ 收合明細" : "▼ 展開明細" }}
                    </el-button>

                    <transition name="slide">
                        <div v-if="showExplosionLungeBreak" class="breakdown-panel">
                            <table class="var-table">
                                <thead>
                                    <tr>
                                        <th>變數</th>
                                        <th>說明</th>
                                        <th>數值</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>A</td>
                                        <td>總魔法攻擊（含魔攻水20%/活潑板/狀態支援12%/稱號加值）</td>
                                        <td class="num-cell">{{ fmt(explosionLungeResult.vars.A) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+C2</td>
                                        <td>
                                            火精通乘數 (1 + 15%基礎 + 細工{{
                                                explosionLungeResult.vars.fireRefLv
                                            }}等×0.5% + 套裝{{ pct(explosionLungeResult.vars.masterySetC2) }} + 賦予{{
                                                explosionLungeResult.vars.grantLv
                                            }}等×1% + 稱號{{ pct(explosionLungeResult.vars.titleC2) }} + 武器{{
                                                pct(explosionLungeResult.vars.weaponC2)
                                            }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(1 + explosionLungeResult.vars.C2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+E</td>
                                        <td>
                                            武器評價乘數（主手{{ pct(explosionLungeResult.vars.mainEval) }} + 副手{{
                                                pct(explosionLungeResult.vars.offEval)
                                            }}）
                                        </td>
                                        <td class="num-cell">{{ fmtF(1 + explosionLungeResult.vars.E) }}</td>
                                    </tr>
                                    <tr class="row-highlight">
                                        <td>B3×(1+H)</td>
                                        <td>
                                            龍焰固定段（5000%，
                                            <em>不含 G 才能</em>
                                            ）
                                            <br />
                                            <span style="font-size: 0.68rem; color: #6b7280">
                                                B3=50 × (1+H={{ pct(explosionLungeResult.vars.H) }})
                                            </span>
                                        </td>
                                        <td class="num-cell">{{ fmtF(explosionLungeResult.vars.partB3) }}</td>
                                    </tr>
                                    <tr class="row-highlight">
                                        <td>B2×(1+G+H)</td>
                                        <td>
                                            火球嵌入段（細工{{ explosionLungeResult.vars.fireballRefLv }}等 + 魔法陣{{
                                                explosionLungeResult.vars.fireballMCLv
                                            }}等，含 G+H）
                                            <br />
                                            <span style="font-size: 0.68rem; color: #6b7280">
                                                B2={{ fmtF(explosionLungeResult.vars.B2) }} × (1+G={{
                                                    pct(explosionLungeResult.vars.G)
                                                }}+H={{ pct(explosionLungeResult.vars.H) }})
                                            </span>
                                        </td>
                                        <td class="num-cell">{{ fmtF(explosionLungeResult.vars.partB2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>[B3+B2]</td>
                                        <td>兩段倍率合計</td>
                                        <td class="num-cell">
                                            {{
                                                fmtF(
                                                    explosionLungeResult.vars.partB3 + explosionLungeResult.vars.partB2,
                                                )
                                            }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>F</td>
                                        <td>
                                            黑魔同步（{{
                                                state.weapon.type === "wand" ? "短杖 +10%" : "集魔杖 +15%"
                                            }}，自動套用）
                                        </td>
                                        <td class="num-cell">{{ pct(explosionLungeResult.vars.F) }}</td>
                                    </tr>
                                    <tr>
                                        <td>J</td>
                                        <td>
                                            暗黑連結 Lighting Chain buff（+10%，{{
                                                state.buffs.darkLink ? "✓ 啟用" : "✗ 未啟用"
                                            }}）
                                        </td>
                                        <td class="num-cell">{{ pct(explosionLungeResult.vars.J) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                </div>

                <!-- ── 5蓄火焰 傷害結果（短杖限定） ── -->
                <div v-show="state.weapon.type === 'wand'" class="result-card skill-firebolt">
                    <div class="result-card-header">
                        <div class="skill-name">
                            <img width="32" height="32" :src="getSkillIcon(30201)" />
                            5蓄火焰
                        </div>
                        <div class="damage-value firebolt-val">{{ fmt(fireBoltResult.damage) }}</div>
                    </div>
                    <div class="formula-line">A × B4 × C3 × (1+E) × (1+G+H) × (1+F) × {{ FIRE_BOLT_CONST }}</div>
                    <div class="formula-note">
                        C3 含精通魔杖150% + 箭系20% 基礎；B4 基礎30%
                        <span v-if="state.weapon.type === 'staff'" class="buff-active">｜法杖加成 +0.2%</span>
                    </div>

                    <el-button
                        size="small"
                        text
                        style="color: #f97316; margin-top: 0.4rem"
                        @click="showFireBoltBreak = !showFireBoltBreak"
                    >
                        {{ showFireBoltBreak ? "▲ 收合明細" : "▼ 展開明細" }}
                    </el-button>

                    <transition name="slide">
                        <div v-if="showFireBoltBreak" class="breakdown-panel">
                            <table class="var-table">
                                <thead>
                                    <tr>
                                        <th>變數</th>
                                        <th>說明</th>
                                        <th>數值</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>A</td>
                                        <td>總魔法攻擊（含魔攻水/活潑板/狀態支援/稱號加值）</td>
                                        <td class="num-cell">{{ fmt(fireBoltResult.vars.A) }}</td>
                                    </tr>
                                    <tr>
                                        <td>B4</td>
                                        <td>
                                            火焰倍率 (30%基礎 + 細工{{ fireBoltResult.vars.fire_maxLv }}等×1% + 魔法陣{{
                                                fireBoltResult.vars.fireMCLv
                                            }}等×0.1% + 法杖{{ pct(fireBoltResult.vars.staffB4) }} + 稱號{{
                                                pct(fireBoltResult.vars.titleB4)
                                            }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(fireBoltResult.vars.B4) }}</td>
                                    </tr>
                                    <tr class="row-highlight-bolt">
                                        <td>C3</td>
                                        <td>
                                            火精通 (1 + 15% + 精通魔杖{{ pct(BOLT_PASSIVE_WAND) }} + 箭系{{
                                                pct(BOLT_PASSIVE_BOLT)
                                            }}
                                            + 火細工{{ fireBoltResult.vars.fireRefLv }}等×0.5% + 箭細工{{
                                                fireBoltResult.vars.boltRefLv
                                            }}等×1% + 套裝{{ pct(fireBoltResult.vars.setC3) }} + 賦予{{
                                                fireBoltResult.vars.grantLv
                                            }}等×1% + 稱號{{ pct(fireBoltResult.vars.titleC3) }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(fireBoltResult.vars.C3) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+E</td>
                                        <td>
                                            武器評價乘數（主手{{ pct(fireBoltResult.vars.mainEval) }} + 副手{{
                                                pct(fireBoltResult.vars.offEval)
                                            }}）
                                        </td>
                                        <td class="num-cell">{{ fmtF(1 + fireBoltResult.vars.E) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+G+H</td>
                                        <td>
                                            Extra 乘數（才能 G={{ pct(fireBoltResult.vars.G) }}，通用 H={{
                                                pct(fireBoltResult.vars.H)
                                            }}）
                                        </td>
                                        <td class="num-cell">
                                            {{ fmtF(1 + fireBoltResult.vars.G + fireBoltResult.vars.H) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>F</td>
                                        <td>
                                            黑魔同步（{{
                                                state.weapon.type === "wand" ? "短杖 +10%" : "集魔杖 +15%"
                                            }}，自動套用）
                                        </td>
                                        <td class="num-cell">{{ pct(fireBoltResult.vars.F) }}</td>
                                    </tr>
                                    <tr class="row-highlight-bolt">
                                        <td>×{{ FIRE_BOLT_CONST }}</td>
                                        <td>5蓄固定乘數</td>
                                        <td class="num-cell">{{ FIRE_BOLT_CONST }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                </div>

                <!-- ── 雷矢 傷害結果（短杖限定） ── -->
                <div v-show="state.weapon.type === 'wand'" class="result-card skill-lightningbolt">
                    <div class="result-card-header">
                        <div class="skill-name">
                            <img width="32" height="32" :src="getSkillIcon(30101)" />
                            雷矢
                        </div>
                        <div class="damage-value lightningbolt-val">{{ fmt(lightningBoltResult.damage) }}</div>
                    </div>
                    <div class="formula-line">A × B5 × C4 × (1+E) × (1+G+H) × (1+F)</div>
                    <div class="formula-note">
                        C4 含精通魔杖150% + 箭系20% + 5蓄獎勵28%；B5 基礎40%
                        <span v-if="state.weapon.type === 'staff'" class="buff-active">｜法杖加成 +0.2%</span>
                    </div>

                    <el-button
                        size="small"
                        text
                        style="color: #38bdf8; margin-top: 0.4rem"
                        @click="showLightningBoltBreak = !showLightningBoltBreak"
                    >
                        {{ showLightningBoltBreak ? "▲ 收合明細" : "▼ 展開明細" }}
                    </el-button>

                    <transition name="slide">
                        <div v-if="showLightningBoltBreak" class="breakdown-panel">
                            <table class="var-table">
                                <thead>
                                    <tr>
                                        <th>變數</th>
                                        <th>說明</th>
                                        <th>數值</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>A</td>
                                        <td>總魔法攻擊（含魔攻水/活潑板/狀態支援/稱號加值）</td>
                                        <td class="num-cell">{{ fmt(lightningBoltResult.vars.A) }}</td>
                                    </tr>
                                    <tr>
                                        <td>B5</td>
                                        <td>
                                            雷矢倍率 (40%基礎 + 細工{{ lightningBoltResult.vars.lightning_maxLv }}等×1%
                                            + 魔法陣{{ lightningBoltResult.vars.lightningMCLv }}等×0.1% + 法杖{{
                                                pct(lightningBoltResult.vars.staffB5)
                                            }}
                                            + 稱號{{ pct(lightningBoltResult.vars.titleB5) }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(lightningBoltResult.vars.B5) }}</td>
                                    </tr>
                                    <tr class="row-highlight-bolt">
                                        <td>C4</td>
                                        <td>
                                            雷精通 (1 + 15% + 精通魔杖{{ pct(BOLT_PASSIVE_WAND) }} + 箭系{{
                                                pct(BOLT_PASSIVE_BOLT)
                                            }}
                                            + 雷細工{{ lightningBoltResult.vars.lightRefLv }}等×0.5% + 箭細工{{
                                                lightningBoltResult.vars.boltRefLv
                                            }}等×1% + 套裝{{ pct(lightningBoltResult.vars.setC4) }} + 賦予{{
                                                lightningBoltResult.vars.grantLv
                                            }}等×1% + 稱號{{ pct(lightningBoltResult.vars.titleC4) }} + 5蓄獎勵{{
                                                pct(BOLT_5CHARGE_BONUS)
                                            }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(lightningBoltResult.vars.C4) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+E</td>
                                        <td>
                                            武器評價乘數（主手{{ pct(lightningBoltResult.vars.mainEval) }} + 副手{{
                                                pct(lightningBoltResult.vars.offEval)
                                            }}）
                                        </td>
                                        <td class="num-cell">{{ fmtF(1 + lightningBoltResult.vars.E) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+G+H</td>
                                        <td>
                                            Extra 乘數（才能 G={{ pct(lightningBoltResult.vars.G) }}，通用 H={{
                                                pct(lightningBoltResult.vars.H)
                                            }}）
                                        </td>
                                        <td class="num-cell">
                                            {{ fmtF(1 + lightningBoltResult.vars.G + lightningBoltResult.vars.H) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>F</td>
                                        <td>
                                            黑魔同步（{{
                                                state.weapon.type === "wand" ? "短杖 +10%" : "集魔杖 +15%"
                                            }}，自動套用）
                                        </td>
                                        <td class="num-cell">{{ pct(lightningBoltResult.vars.F) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                </div>

                <!-- ── 火雷組合魔法 Fusion Bolt（短杖限定） ── -->
                <div v-show="state.weapon.type === 'wand'" class="result-card skill-fusion">
                    <div class="result-card-header">
                        <div class="skill-name">
                            <img width="32" height="32" :src="getSkillIcon(30452)" />
                            火雷組合魔法
                            <span class="skill-en">Fusion Bolt</span>
                        </div>
                        <div class="damage-value fusion-val">{{ fmt(fusionBoltResult.damage) }}</div>
                    </div>
                    <div class="formula-line">(5蓄火焰+雷矢) × (1+K) × (1+J) × (1+F) × (1+K) × 0.85</div>
                    <div class="formula-note">
                        J 組合魔法加成（細工+魔法陣+稱號+武器）；K 組合魔法大師稱號（1+K 連乘兩次）
                        <span v-if="state.titles.primary === 'cc_master'" class="buff-active">｜K +5%</span>
                    </div>

                    <el-button
                        size="small"
                        text
                        style="color: #a855f7; margin-top: 0.4rem"
                        @click="showFusionBoltBreak = !showFusionBoltBreak"
                    >
                        {{ showFusionBoltBreak ? "▲ 收合明細" : "▼ 展開明細" }}
                    </el-button>

                    <transition name="slide">
                        <div v-if="showFusionBoltBreak" class="breakdown-panel">
                            <table class="var-table">
                                <thead>
                                    <tr>
                                        <th>變數</th>
                                        <th>說明</th>
                                        <th>數值</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr class="row-highlight-fusion">
                                        <td>5蓄火焰</td>
                                        <td>5蓄火焰傷害（含所有加成）</td>
                                        <td class="num-cell">{{ fmt(fusionBoltResult.vars.fireBoltDmg) }}</td>
                                    </tr>
                                    <tr class="row-highlight-fusion">
                                        <td>雷矢</td>
                                        <td>雷矢傷害（含所有加成）</td>
                                        <td class="num-cell">{{ fmt(fusionBoltResult.vars.lightningBoltDmg) }}</td>
                                    </tr>
                                    <tr>
                                        <td>基礎合計</td>
                                        <td>5蓄火焰 + 雷矢</td>
                                        <td class="num-cell">{{ fmt(fusionBoltResult.vars.baseDamage) }}</td>
                                    </tr>
                                    <tr>
                                        <td>J</td>
                                        <td>
                                            組合魔法加成 (30%基礎 + 細工{{ fusionBoltResult.vars.ccRefLv }}等×1% +
                                            魔法陣{{ fusionBoltResult.vars.comboMCLv }}等×1% + 稱號{{
                                                pct(fusionBoltResult.vars.titleJ)
                                            }}
                                            + 武器{{ pct(fusionBoltResult.vars.weaponJ) }})
                                        </td>
                                        <td class="num-cell">{{ pct(fusionBoltResult.vars.J) }}</td>
                                    </tr>
                                    <tr>
                                        <td>K</td>
                                        <td>組合魔法大師稱號（+5%，在公式中乘兩次）</td>
                                        <td class="num-cell">{{ pct(fusionBoltResult.vars.K) }}</td>
                                    </tr>
                                    <tr>
                                        <td>F</td>
                                        <td>
                                            黑魔同步（{{
                                                state.weapon.type === "wand" ? "短杖 +10%" : "集魔杖 +15%"
                                            }}，自動套用）
                                        </td>
                                        <td class="num-cell">{{ pct(fusionBoltResult.vars.F) }}</td>
                                    </tr>
                                    <tr>
                                        <td>(1+K)²</td>
                                        <td>組合魔法大師兩次乘積</td>
                                        <td class="num-cell">{{ fmtF((1 + fusionBoltResult.vars.K) ** 2) }}</td>
                                    </tr>
                                    <tr>
                                        <td>×0.85</td>
                                        <td>組合魔法固定係數</td>
                                        <td class="num-cell">0.85</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                </div>

                <!-- ── 暗黑連結 Lighting Chain ── -->
                <div class="result-card skill-chain">
                    <div class="result-card-header">
                        <div class="skill-name">
                            <img width="32" height="32" :src="getSkillIcon(59041)" />
                            暗黑連結
                            <span class="skill-en">Lighting Chain</span>
                        </div>
                        <div class="damage-value chain-val">{{ fmt(lightingChainResult.damage) }}</div>
                    </div>
                    <div class="formula-line">(555% × (1+C4) × (1+G+H) × (1+E) + 1) × 雷矢傷害 × (1+F)</div>
                    <div class="formula-note">C4 = 雷精通（同雷矢）；+1 為括號內雷矢基礎倍數</div>

                    <el-button
                        size="small"
                        text
                        style="color: #14b8a6; margin-top: 0.4rem"
                        @click="showLightingChainBreak = !showLightingChainBreak"
                    >
                        {{ showLightingChainBreak ? "▲ 收合明細" : "▼ 展開明細" }}
                    </el-button>

                    <transition name="slide">
                        <div v-if="showLightingChainBreak" class="breakdown-panel">
                            <table class="var-table">
                                <thead>
                                    <tr>
                                        <th>變數</th>
                                        <th>說明</th>
                                        <th>數值</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>雷矢傷害</td>
                                        <td>雷矢傷害（含所有加成）</td>
                                        <td class="num-cell">{{ fmt(lightingChainResult.vars.lightBoltDmg) }}</td>
                                    </tr>
                                    <tr class="row-highlight-chain">
                                        <td>C4</td>
                                        <td>
                                            雷精通 (1 + 15% + 精通魔杖{{ pct(BOLT_PASSIVE_WAND) }} + 箭系{{
                                                pct(BOLT_PASSIVE_BOLT)
                                            }}
                                            + 細工{{ lightingChainResult.vars.lightRefLv }}等×0.5% + 箭細工{{
                                                lightingChainResult.vars.boltRefLv
                                            }}等×1% + 套裝{{ pct(lightingChainResult.vars.setC4) }} + 賦予{{
                                                lightingChainResult.vars.grantLv
                                            }}等×1% + 稱號{{ pct(lightingChainResult.vars.titleC4) }} + 5蓄{{
                                                pct(BOLT_5CHARGE_BONUS)
                                            }})
                                        </td>
                                        <td class="num-cell">{{ fmtF(lightingChainResult.vars.C4) }}</td>
                                    </tr>
                                    <tr>
                                        <td>1+G+H</td>
                                        <td>
                                            Extra 乘數（才能 G={{ pct(lightingChainResult.vars.G) }}，通用 H={{
                                                pct(lightingChainResult.vars.H)
                                            }}）
                                        </td>
                                        <td class="num-cell">
                                            {{ fmtF(1 + lightingChainResult.vars.G + lightingChainResult.vars.H) }}
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>1+E</td>
                                        <td>武器評價乘數</td>
                                        <td class="num-cell">{{ fmtF(1 + lightingChainResult.vars.E) }}</td>
                                    </tr>
                                    <tr class="row-highlight-chain">
                                        <td>連鎖係數</td>
                                        <td>555% × (1+C4) × (1+G+H) × (1+E)</td>
                                        <td class="num-cell">{{ fmtF(lightingChainResult.vars.chainBonus) }}</td>
                                    </tr>
                                    <tr>
                                        <td>係數+1</td>
                                        <td>括號合計（連鎖+基礎雷矢倍數）</td>
                                        <td class="num-cell">{{ fmtF(lightingChainResult.vars.chainBonus + 1) }}</td>
                                    </tr>
                                    <tr>
                                        <td>F</td>
                                        <td>
                                            黑魔同步（{{
                                                state.weapon.type === "wand" ? "短杖 +10%" : "集魔杖 +15%"
                                            }}，自動套用）
                                        </td>
                                        <td class="num-cell">{{ pct(lightingChainResult.vars.F) }}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </transition>
                </div>

                <!-- 總模擬分數預留 -->
                <div class="total-score-card">
                    <div class="total-label">總模擬分數</div>
                    <div class="total-value">
                        {{
                            fmt(
                                thunderResult.damage * state.simulation.thunder +
                                    fireballResult.damage * state.simulation.fireball +
                                    explosionLungeResult.damage * state.simulation.dragonfire +
                                    fireBoltResult.damage * state.simulation.fireBolt +
                                    lightningBoltResult.damage * state.simulation.lightningBolt +
                                    fusionBoltResult.damage * state.simulation.cc +
                                    lightingChainResult.damage * state.simulation.darklink,
                            )
                        }}
                    </div>
                    <div class="total-note-list">
                        <span v-if="state.simulation.thunder">⚡ 雷擊 ×{{ state.simulation.thunder }}</span>
                        <span v-if="state.simulation.fireball">🔥 火球 ×{{ state.simulation.fireball }}</span>
                        <span v-if="state.simulation.dragonfire">🐉 龍焰 ×{{ state.simulation.dragonfire }}</span>
                        <span v-if="state.simulation.fireBolt">🔥 5蓄火焰 ×{{ state.simulation.fireBolt }}</span>
                        <span v-if="state.simulation.lightningBolt">⚡ 雷矢 ×{{ state.simulation.lightningBolt }}</span>
                        <span v-if="state.simulation.cc">✨ 組合魔法 ×{{ state.simulation.cc }}</span>
                        <span v-if="state.simulation.darklink">🔗 雷鏈 ×{{ state.simulation.darklink }}</span>
                        <span v-if="Object.values(state.simulation).every((v) => !v)" style="color: #4b5563">
                            設定模擬次數以計算總分
                        </span>
                    </div>
                </div>

                <!-- Debug JSON -->
                <div class="debug-panel">
                    <div class="debug-header">
                        <h2 class="section-title" style="margin: 0; font-size: 0.85rem">🔍 即時 State JSON</h2>
                        <el-tag size="small" type="success">Live</el-tag>
                    </div>

                    <div class="eval-debug">
                        <p class="eval-debug-title">魔法攻擊 A 拆解</p>
                        <div class="eval-debug-row">
                            <span>面板魔攻</span>
                            <strong>{{ state.weapon.baseMagicAttack }}</strong>
                        </div>
                        <div class="eval-debug-row">
                            <span>常數攻擊力（精武/黑魔）</span>
                            <strong>
                                {{ (state.weapon.jingSword100 ? 50 : 0) + (state.weapon.darkMagic ? 250 : 0) }}
                            </strong>
                        </div>
                        <div class="eval-debug-row">
                            <span>魔攻係數</span>
                            <strong>×{{ state.buffs.magAtkPotion ? "1.2" : "1.0" }}</strong>
                        </div>
                        <div class="eval-debug-row">
                            <span>活潑板</span>
                            <strong>{{ state.weapon.vivace }}%</strong>
                        </div>
                        <div class="eval-debug-row">
                            <span>狀態支援5231</span>
                            <strong>{{ state.generalExtra.statusSupport ? "+12%" : "—" }}</strong>
                        </div>
                        <div class="eval-debug-row">
                            <span>力量團聚</span>
                            <strong>{{ state.generalExtra.strengthGather ? "+15%" : "—" }}</strong>
                        </div>
                        <div class="eval-debug-row">
                            <span>→ 最終魔法攻擊 A</span>
                            <strong class="total-eval">{{ fmt(totalMagAtk) }}</strong>
                        </div>
                    </div>

                    <pre class="state-json">{{ stateJson }}</pre>
                </div>
            </div>
            <!-- /dashboard-panel -->
        </div>
        <!-- /sim-layout -->
    </div>
</template>

<style scoped>
/* ── 基礎 ─────────────────────────────────────── */
.arch-mage-sim {
    min-height: 100vh;
    padding: 1.5rem;
    box-sizing: border-box;
}

.page-title {
    display: flex;
    align-items: baseline;
    gap: 0.75rem;
    margin-bottom: 1.5rem;
    font-size: 1.8rem;
}
.text-gradient {
    background: linear-gradient(135deg, #818cf8, #6366f1);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}
.page-subtitle {
    font-size: 1rem;
    color: var(--color-text-secondary, #6b7280);
    font-weight: 400;
}

/* ── 雙欄 ─────────────────────────────────────── */
.sim-layout {
    display: grid;
    grid-template-columns: 320px 1fr;
    gap: 1.5rem;
    max-width: 1440px;
    margin: 0 auto;
    align-items: flex-start;
}

/* ── 左側表單 ─────────────────────────────────── */
.form-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
}

.form-section {
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 12px;
    padding: 1.25rem;
}
.form-section.is-collapsed {
    padding-bottom: 0;
}
.form-section.is-collapsed .section-title {
    margin-bottom: 0;
    border-bottom: none;
    padding-bottom: 0;
}

.section-title {
    font-size: 0.95rem;
    font-weight: 600;
    color: #818cf8;
    margin: 0 0 0.9rem 0;
    padding-bottom: 0.45rem;
    border-bottom: 1px solid var(--color-border, #374151);
    display: flex;
    align-items: center;
    gap: 0.5rem;
}
.section-toggle {
    cursor: pointer;
    user-select: none;
}
.section-toggle:hover {
    color: #a5b4fc;
}
.toggle-chevron {
    margin-left: auto;
    font-size: 0.7rem;
    color: #6b7280;
    transition: transform 0.2s ease;
    display: inline-block;
}
.toggle-chevron.rotated {
    transform: rotate(-90deg);
}

.section-desc {
    font-size: 0.78rem;
    color: var(--color-text-secondary, #6b7280);
    margin-top: -0.4rem;
    margin-bottom: 0.65rem;
}
.subsection-label {
    font-size: 0.78rem;
    font-weight: 500;
    color: #a5b4fc;
    margin: 0 0 0.45rem 0;
}

.field-row {
    display: flex;
    align-items: center;
    gap: 0.6rem;
    margin-bottom: 0.55rem;
    flex-wrap: wrap;
}
.field-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
    min-width: 80px;
    flex-shrink: 0;
}
.field-hint {
    font-size: 0.72rem;
    color: var(--color-text-secondary, #6b7280);
}
.set-info-icon {
    font-size: 0.95rem;
    color: #6b7280;
    cursor: help;
    margin-left: 0.3rem;
    flex-shrink: 0;
}
.stat-total-row {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 0.6rem;
    padding: 0.4rem 0.6rem;
    background: rgba(255, 255, 255, 0.04);
    border-radius: 6px;
    border: 1px solid rgba(255, 255, 255, 0.08);
}
.stat-total-label {
    font-size: 0.8rem;
    color: var(--color-text-secondary, #9ca3af);
}
.stat-total-value {
    font-size: 1.1rem;
    font-weight: 700;
}
.crit-rate-color {
    color: #f59e0b;
}
.crit-dmg-color {
    color: #f97316;
}
.upgrade-bonus-row {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0;
    font-size: 0.8rem;
}
.upgrade-bonus-label {
    color: #facc15;
    font-weight: 600;
}
.upgrade-bonus-val {
    color: #f97316;
}

/* 常數攻擊力 checkboxes 行 */
.const-atk-row {
    align-items: flex-start;
}
.const-atk-label {
    padding-top: 0.15rem;
}
.const-atk-checks {
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

/* 武器評價摘要 */
.eval-summary {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.9rem;
    margin-top: 0.65rem;
    padding: 0.45rem 0.7rem;
    background: rgba(129, 140, 248, 0.07);
    border-radius: 6px;
    font-size: 0.76rem;
    color: var(--color-text-secondary, #9ca3af);
}
.eval-total {
    color: #818cf8;
    font-weight: 600;
}
.eval-bonus {
    color: #34d399;
}

/* 細工 Grid */
.ref-grid {
    display: grid;
    grid-template-columns: 1fr 85px 2.8rem;
    gap: 0.45rem 0.4rem;
    align-items: center;
}
/* 讓每個 ref-item 的子元素直接參與外層 grid，實現跨行對齊 */
.ref-item {
    display: contents;
}
.ref-label {
    font-size: 0.78rem;
    color: var(--color-text-secondary, #d1d5db);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.ref-max-hint {
    font-size: 0.68rem;
    color: var(--color-text-secondary, #6b7280);
    white-space: nowrap;
}

/* 魔法陣 */
.mc-counter {
    font-size: 0.78rem;
    color: #f59e0b;
    font-weight: 700;
    margin-left: auto;
}
.mc-list {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}
.mc-item {
    display: flex;
    align-items: center;
    gap: 0.9rem;
}
.mc-level {
    display: flex;
    align-items: center;
    gap: 0.35rem;
}
.mc-lv-label {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #9ca3af);
}

/* 模擬次數 */
.sim-grid {
    display: flex;
    flex-direction: column;
    gap: 0.45rem;
}
.sim-item {
    display: flex;
    align-items: center;
    gap: 0.55rem;
}
.sim-label {
    font-size: 0.83rem;
    color: var(--color-text-secondary, #d1d5db);
    flex: 1;
}
.sim-unit {
    font-size: 0.78rem;
    color: var(--color-text-secondary, #6b7280);
}

/* ── 右側 Dashboard ───────────────────────────── */
.dashboard-panel {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    position: sticky;
    top: 1rem;
    max-height: calc(100vh - 2rem);
    overflow-y: auto;
}

/* 雷擊結果卡 */
.result-card {
    background: var(--color-surface, #1f2937);
    border-radius: 12px;
    padding: 1.1rem 1.25rem;
}
.skill-thunder {
    border: 1px solid #6366f1;
}
.skill-fireball {
    border: 1px solid #f59e0b;
}
.fireball-val {
    color: #f59e0b;
}
.skill-lunge {
    border: 1px solid #ef4444;
}
.lunge-val {
    color: #ef4444;
}
.skill-firebolt {
    border: 1px solid #f97316;
}
.firebolt-val {
    color: #f97316;
}
.skill-lightningbolt {
    border: 1px solid #38bdf8;
}
.lightningbolt-val {
    color: #38bdf8;
}
.row-highlight-bolt td {
    background: rgba(249, 115, 22, 0.06);
}
.skill-fusion {
    border: 1px solid #a855f7;
}
.fusion-val {
    color: #a855f7;
}
.skill-chain {
    border: 1px solid #14b8a6;
}
.chain-val {
    color: #14b8a6;
}
.row-highlight-fusion td {
    background: rgba(168, 85, 247, 0.06);
}
.row-highlight-chain td {
    background: rgba(20, 184, 166, 0.06);
}
.skill-en {
    font-size: 0.7rem;
    font-weight: 400;
    color: var(--color-text-secondary, #9ca3af);
    margin-left: 0.35rem;
}
.formula-note {
    font-size: 0.68rem;
    color: var(--color-text-secondary, #6b7280);
    margin: 0.1rem 0 0.05rem;
}
.buff-active {
    color: #34d399;
    font-weight: 600;
}
.buff-en {
    font-size: 0.75rem;
    color: var(--color-text-secondary, #9ca3af);
    margin: 0 0.2rem;
}
.row-highlight td {
    background: rgba(239, 68, 68, 0.06);
}

.result-card-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.4rem;
}
.skill-name {
    display: flex;
    align-items: center;
    gap: 0.4rem;
    font-size: 0.95rem;
    font-weight: 600;
    color: #a5b4fc;
}
.damage-value {
    font-size: 2rem;
    font-weight: 700;
    color: #818cf8;
    font-family: monospace;
}

.formula-line {
    font-size: 0.72rem;
    font-family: monospace;
    color: var(--color-text-secondary, #9ca3af);
    margin: 0.25rem 0;
}

/* 明細面板 */
.breakdown-panel {
    margin-top: 0.6rem;
    border-top: 1px solid var(--color-border, #374151);
    padding-top: 0.6rem;
}
.var-table {
    width: 100%;
    border-collapse: collapse;
    font-size: 0.72rem;
}
.var-table th {
    text-align: left;
    color: #818cf8;
    padding: 0.3rem 0.4rem;
    border-bottom: 1px solid var(--color-border, #374151);
}
.var-table td {
    padding: 0.28rem 0.4rem;
    color: var(--color-text-secondary, #d1d5db);
    vertical-align: top;
    border-bottom: 1px solid rgba(55, 65, 81, 0.5);
}
.var-table tr:last-child td {
    border-bottom: none;
}
.num-cell {
    text-align: right;
    font-family: monospace;
    color: #a5b4fc;
    white-space: nowrap;
}

/* 其他技能預留 */
.result-placeholder {
    background: var(--color-surface, #1f2937);
    border: 1px dashed var(--color-border, #374151);
    border-radius: 12px;
    padding: 1rem 1.25rem;
}
.result-stub-grid {
    display: flex;
    flex-direction: column;
    gap: 0.3rem;
}
.result-stub-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.83rem;
    padding: 0.25rem 0;
    border-bottom: 1px solid var(--color-border, #374151);
}
.result-stub-row:last-child {
    border-bottom: none;
}
.stub-skill {
    color: var(--color-text-secondary, #9ca3af);
}
.stub-val {
    color: var(--color-border, #4b5563);
    font-family: monospace;
}

/* 總分 */
.total-score-card {
    background: linear-gradient(135deg, rgba(99, 102, 241, 0.12), rgba(129, 140, 248, 0.06));
    border: 1px solid #6366f1;
    border-radius: 12px;
    padding: 0.9rem 1.25rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.total-label {
    font-size: 0.85rem;
    font-weight: 600;
    color: #818cf8;
}
.total-value {
    font-size: 1.4rem;
    font-weight: 700;
    color: #a5b4fc;
    font-family: monospace;
}
.total-note {
    font-size: 0.7rem;
    color: var(--color-text-secondary, #6b7280);
    font-weight: 400;
}
.total-note-list {
    display: flex;
    gap: 0.6rem;
    flex-wrap: wrap;
    font-size: 0.72rem;
    color: var(--color-text-secondary, #9ca3af);
    margin-top: 0.25rem;
}

/* Debug */
.debug-panel {
    background: var(--color-surface, #1f2937);
    border: 1px solid var(--color-border, #374151);
    border-radius: 12px;
    padding: 1rem 1.25rem;
    overflow: hidden;
}
.debug-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0.65rem;
    padding-bottom: 0.45rem;
    border-bottom: 1px solid var(--color-border, #374151);
}

.eval-debug {
    background: rgba(52, 211, 153, 0.06);
    border: 1px solid rgba(52, 211, 153, 0.2);
    border-radius: 6px;
    padding: 0.55rem 0.7rem;
    margin-bottom: 0.7rem;
}
.eval-debug-title {
    font-size: 0.68rem;
    color: #34d399;
    margin: 0 0 0.35rem 0;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.04em;
}
.eval-debug-row {
    display: flex;
    justify-content: space-between;
    font-size: 0.75rem;
    color: var(--color-text-secondary, #9ca3af);
    padding: 0.08rem 0;
}
.total-eval {
    color: #818cf8 !important;
}

.state-json {
    background: var(--color-background, #111827);
    border: 1px solid var(--color-border, #374151);
    border-radius: 6px;
    padding: 0.65rem;
    font-size: 0.68rem;
    font-family: "Cascadia Code", "Fira Code", monospace;
    color: #a5b4fc;
    line-height: 1.5;
    white-space: pre;
    overflow-x: auto;
    max-height: 420px;
    overflow-y: auto;
    margin: 0;
}

/* transition */
.slide-enter-active,
.slide-leave-active {
    transition: all 0.15s ease;
}
.slide-enter-from,
.slide-leave-to {
    opacity: 0;
    transform: translateY(-4px);
}

/* ── 全部折疊按鈕 ─────────────────────────────── */
.collapse-all-row {
    display: flex;
    justify-content: flex-end;
    margin-bottom: 0.5rem;
}

/* ── 儲存配置 ─────────────────────────────────── */
.preset-section .section-title {
    gap: 0.5rem;
}
.preset-count {
    font-size: 0.72rem;
    background: #6366f1;
    color: #fff;
    border-radius: 9999px;
    padding: 0 0.45rem;
    line-height: 1.5;
    font-weight: 600;
    margin-left: 0.15rem;
}
.preset-save-row {
    display: flex;
    gap: 0.4rem;
    margin-bottom: 0.75rem;
}
.preset-name-input {
    flex: 1;
}
.preset-empty {
    text-align: center;
    font-size: 0.78rem;
    color: var(--color-text-secondary, #6b7280);
    padding: 0.75rem 0;
}
.preset-list {
    display: flex;
    flex-direction: column;
    gap: 0.4rem;
}
.preset-item {
    background: var(--color-background, #111827);
    border: 1px solid var(--color-border, #374151);
    border-radius: 8px;
    padding: 0.45rem 0.6rem;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 0.5rem;
    transition: border-color 0.15s;
}
.preset-item.confirm-del {
    border-color: #ef4444;
}
.preset-meta {
    display: flex;
    flex-direction: column;
    gap: 0.1rem;
    min-width: 0;
}
.preset-name {
    font-size: 0.82rem;
    font-weight: 600;
    color: var(--color-text, #e5e7eb);
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
}
.preset-date {
    font-size: 0.68rem;
    color: var(--color-text-secondary, #6b7280);
}
.preset-actions {
    display: flex;
    align-items: center;
    gap: 0.3rem;
    flex-shrink: 0;
}
.preset-del-confirm-label {
    font-size: 0.72rem;
    color: #ef4444;
    white-space: nowrap;
}
</style>
