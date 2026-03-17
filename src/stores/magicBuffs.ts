import { ref, computed, reactive } from "vue";
import { defineStore } from "pinia";
import type {
    GlobalBuffSnapshot,
    MasterySnapshot,
    RefinementSnapshot,
    MagicCircleSnapshot,
    TitleEffectSnapshot,
} from "../types/magic";

const STORAGE_KEY = "mabinogi-magic-buffs-v2";

// ── 精煉細工換算常數（%/等） ─────────────────────────────
const REF_FIREBOLT_RATE = 1.0; // 火焰細工      → Mult_f
const REF_LIGHTNINGBOLT_RATE = 1.0; // 雷矢細工      → Mult_l
const REF_FIRE_MASTERY_RATE = 0.5; // 精通火細工    → fire mastery
const REF_LIGHT_MASTERY_RATE = 0.5; // 精通雷細工    → lightning mastery
const REF_BOLT_MASTERY_RATE = 1.0; // 精通箭系細工  → fire & lightning mastery
const REF_COMBO_RATE = 1.0; // 組合魔法細工  → BonusCC
const REF_FIREBALL_RATE = 3.0; // 火球細工      → Mult_FB
const REF_THUNDER_RATE = 0.5; // 雷擊細工      → Mult_Thunder

// ── 魔法陣換算常數（%/等） ──────────────────────────────
const MC_FIREBOLT_RATE = 1.0; // 火焰魔法陣    → Mult_f
const MC_LIGHTNINGBOLT_RATE = 1.0; // 雷矢魔法陣    → Mult_l
const MC_COMBO_RATE = 1.0; // 組合魔法陣    → BonusCC
const MC_FIREBALL_RATE = 5.0; // 火球魔法陣    → Mult_FB
const MC_THUNDER_RATE = 1.0; // 雷擊魔法陣    → Mult_Thunder

// ── 稱號效果定義 ─────────────────────────────────────────
const TITLE_EFFECTS: Record<
    string,
    { primaryCC: number; firemastery: number; lightmastery: number; cc: number }
> = {
    none: { primaryCC: 0, firemastery: 0, lightmastery: 0, cc: 0 },
    comboMaster: { primaryCC: 5, firemastery: 0, lightmastery: 0, cc: 0 }, // 組合魔法大師 CC+5%
    endOfLoveHate: { primaryCC: 0, firemastery: 0, lightmastery: 0, cc: 0 }, // 愛恨終焉（暫無特殊加成）
};
const SECONDARY_TITLE_EFFECTS: Record<
    string,
    { firemastery: number; lightmastery: number; cc: number }
> = {
    none: { firemastery: 0, lightmastery: 0, cc: 0 },
    butterfly: { firemastery: 1, lightmastery: 15, cc: 5 }, // Butterfly
    rowan: { firemastery: 3, lightmastery: 3, cc: 0 }, // Rowan
};

// ── State 型別定義 ─────────────────────────────────────
interface MagicBuffsState {
    weaponType: "wand" | "staff";
    baseMagicAttack: number;
    vivace: number;
    titles: {
        primary: "comboMaster" | "endOfLoveHate" | "none";
        secondary: "butterfly" | "rowan" | "none";
    };
    mastery: {
        hebona: boolean;
        fireMastery: boolean;
        wandMastery: boolean;
        boltMastery: boolean;
        elementalSet: boolean;
        lightningMastery: boolean;
        charge5: boolean;
    };
    refinement: {
        firebolt: number;
        lightningBolt: number;
        fireMastery: number;
        lightningMastery: number;
        boltMastery: number;
        comboBolt: number;
        fireball: number;
        thunder: number;
    };
    magicCircles: {
        selected: string[];
        levels: Record<string, number>;
    };
    extra: {
        s7: boolean;
        farm: number;
        totem: number;
        spiritWeapon: boolean;
        vip: boolean;
    };
    weapon: {
        mainHand: number;
        offHand: number;
    };
    crit: {
        baseRate: number;
        baseDamage: number;
        r7: boolean;
    };
    synthesis: {
        chain: boolean;
        masterTitle: boolean;
    };
}

const defaultState: MagicBuffsState = {
    weaponType: "wand",
    baseMagicAttack: 300,
    vivace: 0,
    titles: { primary: "none", secondary: "none" },
    mastery: {
        hebona: false,
        fireMastery: false,
        wandMastery: false,
        boltMastery: false,
        elementalSet: false,
        lightningMastery: false,
        charge5: false,
    },
    refinement: {
        firebolt: 0,
        lightningBolt: 0,
        fireMastery: 0,
        lightningMastery: 0,
        boltMastery: 0,
        comboBolt: 0,
        fireball: 0,
        thunder: 0,
    },
    magicCircles: {
        selected: [],
        levels: {},
    },
    extra: {
        s7: false,
        farm: 0,
        totem: 0,
        spiritWeapon: false,
        vip: false,
    },
    weapon: { mainHand: 0, offHand: 0 },
    crit: { baseRate: 37.5, baseDamage: 250, r7: false },
    synthesis: { chain: false, masterTitle: false },
};

export const useMagicBuffsStore = defineStore("magicBuffs", () => {
    // ── State ────────────────────────────────────────────
    const weaponType = ref<"wand" | "staff">(defaultState.weaponType);
    const baseMagicAttack = ref(defaultState.baseMagicAttack);
    const vivace = ref(defaultState.vivace);
    const titles = reactive({ ...defaultState.titles });
    const mastery = reactive({ ...defaultState.mastery });
    const refinement = reactive({ ...defaultState.refinement });
    const magicCircles = reactive<MagicBuffsState["magicCircles"]>({
        selected: [...defaultState.magicCircles.selected],
        levels: { ...defaultState.magicCircles.levels },
    });
    const extra = reactive({ ...defaultState.extra });
    const weapon = reactive({ ...defaultState.weapon });
    const crit = reactive({ ...defaultState.crit });
    const synthesis = reactive({ ...defaultState.synthesis });

    // ── Computed ─────────────────────────────────────────

    /** 計算後最終魔攻（武器公式） */
    const finalMagicAttack = computed(() => {
        const base = baseMagicAttack.value;
        const viv = vivace.value;
        const vivFactor = 1 + (viv / 100) * 1.2;
        const baseFactor = 1.2 * vivFactor * (1 + 0.12 * 1.2);
        if (weaponType.value === "staff") {
            return Math.round(base * baseFactor);
        } else {
            // wand: 只有超出 300 的部分才套用倍率
            return Math.round((base - 300) * baseFactor + 300);
        }
    });

    /** 稱號效果 snapshot */
    const titleEffects = computed((): TitleEffectSnapshot => {
        const primary = TITLE_EFFECTS[titles.primary] ?? TITLE_EFFECTS.none;
        const secondary = SECONDARY_TITLE_EFFECTS[titles.secondary] ?? SECONDARY_TITLE_EFFECTS.none;
        return {
            primaryCC: primary.primaryCC,
            firemastery: secondary.firemastery,
            lightmastery: secondary.lightmastery,
            cc: secondary.cc,
        };
    });

    /** 精煉細工 → 已換算 % 的 snapshot */
    const refinementSnapshot = computed((): RefinementSnapshot => ({
        firebolt: refinement.firebolt * REF_FIREBOLT_RATE,
        lightningBolt: refinement.lightningBolt * REF_LIGHTNINGBOLT_RATE,
        fireMastery: refinement.fireMastery * REF_FIRE_MASTERY_RATE,
        lightningMastery: refinement.lightningMastery * REF_LIGHT_MASTERY_RATE,
        boltMastery: refinement.boltMastery * REF_BOLT_MASTERY_RATE,
        comboBolt: refinement.comboBolt * REF_COMBO_RATE,
        fireball: refinement.fireball * REF_FIREBALL_RATE,
        thunder: refinement.thunder * REF_THUNDER_RATE,
    }));

    /** 魔法陣 → 已換算 % 的 snapshot */
    const mcSnapshot = computed((): MagicCircleSnapshot => {
        const lv = (key: string) =>
            magicCircles.selected.includes(key) ? (magicCircles.levels[key] ?? 1) : 0;
        return {
            firebolt: lv("firebolt") * MC_FIREBOLT_RATE,
            lightningBolt: lv("lightningBolt") * MC_LIGHTNINGBOLT_RATE,
            comboBolt: lv("comboBolt") * MC_COMBO_RATE,
            fireball: lv("fireball") * MC_FIREBALL_RATE,
            thunder: lv("thunder") * MC_THUNDER_RATE,
        };
    });

    const extraTotal = computed(() => {
        let total = 0;
        if (extra.s7) total += 9;
        total += extra.farm;
        total += extra.totem;
        if (extra.spiritWeapon) total += 10;
        if (extra.vip) total += 1;
        return total / 100;
    });

    const extraNoSpiritTotal = computed(() => {
        let total = 0;
        if (extra.s7) total += 9;
        total += extra.farm;
        total += extra.totem;
        // spiritWeapon 不計入
        if (extra.vip) total += 1;
        return total / 100;
    });

    const weaponTotal = computed(() => (weapon.mainHand + weapon.offHand) / 100);

    const critRateTotal = computed(() => {
        let rate = crit.baseRate;
        if (crit.r7) rate += 74;
        return rate / 100;
    });

    const critDamageTotal = computed(() => crit.baseDamage / 100);

    const masterySnapshot = computed((): MasterySnapshot => ({ ...mastery }));

    /** 供 calculate() 呼叫的完整快照 */
    function snapshot(): GlobalBuffSnapshot {
        return {
            magicAttack: finalMagicAttack.value,
            extra: extraTotal.value,
            extraNoSpirit: extraNoSpiritTotal.value,
            weapon: weaponTotal.value,
            critRate: critRateTotal.value,
            critDamage: critDamageTotal.value,
            chain: synthesis.chain,
            masterTitle: synthesis.masterTitle,
            weaponIsStaff: weaponType.value === "staff",
            mastery: masterySnapshot.value,
            refinement: refinementSnapshot.value,
            magicCircles: mcSnapshot.value,
            titleEffects: titleEffects.value,
        };
    }

    // ── Persistence ──────────────────────────────────────
    function save() {
        localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({
                weaponType: weaponType.value,
                baseMagicAttack: baseMagicAttack.value,
                vivace: vivace.value,
                titles: { ...titles },
                mastery: { ...mastery },
                refinement: { ...refinement },
                magicCircles: {
                    selected: [...magicCircles.selected],
                    levels: { ...magicCircles.levels },
                },
                extra: { ...extra },
                weapon: { ...weapon },
                crit: { ...crit },
                synthesis: { ...synthesis },
            }),
        );
    }

    function load() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return;
            const parsed = JSON.parse(raw) as Partial<MagicBuffsState>;
            if (parsed.weaponType != null) weaponType.value = parsed.weaponType;
            if (parsed.baseMagicAttack != null) baseMagicAttack.value = parsed.baseMagicAttack;
            if (parsed.vivace != null) vivace.value = parsed.vivace;
            if (parsed.titles) Object.assign(titles, parsed.titles);
            if (parsed.mastery) Object.assign(mastery, parsed.mastery);
            if (parsed.refinement) Object.assign(refinement, parsed.refinement);
            if (parsed.magicCircles) {
                magicCircles.selected = parsed.magicCircles.selected ?? [];
                magicCircles.levels = parsed.magicCircles.levels ?? {};
            }
            if (parsed.extra) Object.assign(extra, parsed.extra);
            if (parsed.weapon) Object.assign(weapon, parsed.weapon);
            if (parsed.crit) Object.assign(crit, parsed.crit);
            if (parsed.synthesis) Object.assign(synthesis, parsed.synthesis);
        } catch {
            // ignore corrupt data
        }
    }

    function reset() {
        weaponType.value = defaultState.weaponType;
        baseMagicAttack.value = defaultState.baseMagicAttack;
        vivace.value = defaultState.vivace;
        Object.assign(titles, defaultState.titles);
        Object.assign(mastery, defaultState.mastery);
        Object.assign(refinement, defaultState.refinement);
        magicCircles.selected = [...defaultState.magicCircles.selected];
        magicCircles.levels = { ...defaultState.magicCircles.levels };
        Object.assign(extra, defaultState.extra);
        Object.assign(weapon, defaultState.weapon);
        Object.assign(crit, defaultState.crit);
        Object.assign(synthesis, defaultState.synthesis);
        localStorage.removeItem(STORAGE_KEY);
    }

    // 初始化時載入
    load();

    return {
        // state
        weaponType,
        baseMagicAttack,
        vivace,
        titles,
        mastery,
        refinement,
        magicCircles,
        extra,
        weapon,
        crit,
        synthesis,
        // computed
        finalMagicAttack,
        titleEffects,
        refinementSnapshot,
        mcSnapshot,
        extraTotal,
        extraNoSpiritTotal,
        weaponTotal,
        critRateTotal,
        critDamageTotal,
        // methods
        snapshot,
        save,
        reset,
    };
});
