<script setup lang="ts">
import { ref, computed, watch, onMounted, onUnmounted } from "vue";
import { ElMessage } from "element-plus";
import { useLocalStorage } from "../composables/useLocalStorage";

interface Condition {
    id: number;
    name?: string; // hover 時顯示
    advanced?: boolean; // 進階，預設不顯示
    permanent?: boolean; // 永久，不倒數
    permLabel?: string; // 永久的顯示文字，預設「永久」（在場即永久者顯示「在場」）
    seconds?: number; // 持續秒數
    note?: string; // 例如「寵物在場即永久」
    side?: "phys" | "magic"; // 物理／魔法側；未標示者兩邊通用
    valueKind?: "prot" | "atk"; // 有數值者：prot=減防保護(-%/-固定)、atk=攻擊傷害(+%)
    cls?: string; // 職業專屬（未標示者為通用）
    optional?: boolean; // 非必要：及格判定不列入
}

interface DebuffValue {
    pct: number;
    fixed: number;
}

interface Source {
    id: number; // 技能 id / 寵物 id / condition id（self）
    kind: "skill" | "pet" | "self"; // self=以自身 condition 圖示施加
    name?: string; // 技能名稱（寵物／self 無）
    conditions: number[]; // 此來源會施加的 condition
}

// 名稱取自 src/data/conditions.ts 的繁中（tw）欄位；只列用到的幾筆，
// 避免為了幾個名稱 import 整份 336K 對照表
const CONDITIONS: Condition[] = [
    { id: 1164, name: "減少防禦/保護", seconds: 300, side: "phys", valueKind: "prot" },
    { id: 1165, name: "減少魔法防禦/魔法保護", seconds: 300, side: "magic", valueKind: "prot" },
    { id: 1166, name: "所受傷害增加", seconds: 300, valueKind: "atk" },
    { id: 426, name: "死神烙印", seconds: 200 }, // 僅死神烙印施加
    { id: 392, name: "纏繞的閃電", seconds: 300, valueKind: "prot" },
    { id: 464, name: "冰雪狀態", permanent: true, permLabel: "在場", advanced: true, note: "在場即永久", valueKind: "prot" },
    { id: 594, name: "跑跑卡丁車水球", permanent: true, valueKind: "prot" },
    { id: 912, name: "喵喵的喵皇降臨", seconds: 300, valueKind: "prot" },
    { id: 1004, name: "銳利目光", permanent: true, permLabel: "在場", advanced: true, note: "寵物在場即永久（暴擊傷害）", valueKind: "atk" },
    { id: 1093, name: "保護最大減少", permanent: true, side: "phys", valueKind: "prot" },
    { id: 1094, name: "魔法保護最大減少", permanent: true, side: "magic", valueKind: "prot" },
    { id: 1138, name: "幸運草標記", seconds: 300, valueKind: "atk" },
    { id: 10001, name: "物理防禦和保護減少瑪奇魔法陣", advanced: true, seconds: 110, side: "phys", valueKind: "prot" },
    { id: 10002, name: "魔法防禦和保護減少瑪奇魔法陣", advanced: true, seconds: 110, side: "magic", valueKind: "prot" },
    // ===== 追加（皆以自身 condition 圖示施加；持續時間見 durationOf）=====
    { id: 521, name: "洞察之眼", advanced: true, optional: true, valueKind: "atk" }, // 增傷；120s(套裝+60)
    { id: 1026, name: "倒吊人", advanced: true, optional: true, valueKind: "atk" }, // 增傷；30+卡片 s
    { id: 578, name: "魔法光圈", permanent: true, permLabel: "在場", optional: true, valueKind: "prot" },
    { id: 803, name: "崩潰的波動", advanced: true, cls: "聖詠", optional: true, valueKind: "prot" }, // 10+遺物×0.5 s
    { id: 1063, name: "倒塌的屏障", advanced: true, cls: "聖盾", optional: true, valueKind: "prot", seconds: 60 },
    { id: 339, name: "憤怒衝擊", advanced: true, optional: true, valueKind: "atk", seconds: 7 }, // 近戰技能傷害
    { id: 1145, name: "觸媒效應", advanced: true, cls: "鍊金", optional: true, valueKind: "prot", seconds: 300 },
    { id: 1147, name: "召喚噩夢", advanced: true, cls: "鍊金", optional: true, valueKind: "prot", seconds: 120, note: "最終傷害 +0.9594%" },
];

// 技能名稱取自 src/data/skillNames.ts 的繁中（tw）欄位；寵物 id 該表查無名稱
const SOURCES: Source[] = [
    { id: 27205, kind: "skill", name: "黃道蔓延", conditions: [1164, 1165, 1166] },
    { id: 26006, kind: "skill", name: "灰色煙幕術", conditions: [1164, 1165] },
    { id: 24201, kind: "skill", name: "連續技能: 螺旋勾拳", conditions: [1164] },
    { id: 35024, kind: "skill", name: "海德拉鍊成", conditions: [1165] },
    { id: 21006, kind: "skill", name: "支援箭", conditions: [1166] },
    { id: 27010, kind: "skill", name: "死神烙印", conditions: [1166, 426] },
    { id: 50226, kind: "skill", name: "水炸彈投擲", conditions: [594] },
    { id: 58018, kind: "skill", name: "刻印 : 弗拉加拉赫", conditions: [1093, 1094] },
    { id: 10103, kind: "skill", name: "瑪奇魔法陣發動", conditions: [10001, 10002] },
    { id: 490105, kind: "pet", conditions: [392] },
    { id: 490253, kind: "pet", conditions: [392] },
    { id: 490229, kind: "pet", conditions: [464] },
    { id: 490411, kind: "pet", conditions: [912] },
    { id: 490431, kind: "pet", conditions: [1138] },
    { id: 491006, kind: "pet", conditions: [1004] },
    { id: 490279, kind: "pet", conditions: [578] }, // 天使貓 → 魔法光圈
    { id: 490280, kind: "pet", conditions: [578] }, // 天使貓 → 魔法光圈
    // 追加：以自身 condition 圖示施加
    { id: 521, kind: "self", conditions: [521] },
    { id: 1026, kind: "self", conditions: [1026] },
    { id: 803, kind: "self", conditions: [803] },
    { id: 1063, kind: "self", conditions: [1063] },
    { id: 339, kind: "self", conditions: [339] },
    { id: 1145, kind: "self", conditions: [1145] },
    { id: 1147, kind: "self", conditions: [1147] },
];

const SOURCE_GROUPS = [
    { kind: "skill", label: "技能" },
    { kind: "pet", label: "寵物" },
    { kind: "self", label: "其他" },
] as const;

// 圖示統一取自 eldisa/mabinogiImage repo（ConditionImage / SkillImage / pet）
const IMG_BASE = "https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main";
const condIconUrl = (id: number) => `${IMG_BASE}/ConditionImage/${id}.png`;
const skillIconUrl = (id: number) => `${IMG_BASE}/SkillImage/${id}.png`;
const sourceIconUrl = (s: Source) =>
    s.kind === "skill" ? skillIconUrl(s.id) : s.kind === "pet" ? `${IMG_BASE}/pet/${s.id}.png` : condIconUrl(s.id);

const condById = new Map(CONDITIONS.map((c) => [c.id, c]));

// ===== 數值設定（影響進行中與 hover 顯示的減益數值；存 localStorage）=====
interface ValueSettings {
    equip1: boolean; // 黃道 裝備1
    equip2: boolean; // 黃道 裝備2
    knuckleReforge: number; // 螺旋勾拳 細工等級 0–7
    hydraEcho: number; // 海德拉鍊成 回音石等級 0–20
    arrowCircle: number; // 支援箭 魔法陣等級 0–10
    arrowSet: boolean; // 支援箭 套裝效果
    reaperReforge: number; // 死神烙印 細工等級 0–25
    reaperSet: boolean; // 死神烙印 套裝效果
    totem: number; // 洞察之眼 指揮官圖騰 0–5
    insightSet: boolean; // 洞察之眼 套裝（持續+60s）
    card: number; // 倒吊人 卡片等級 0–30
    relic: number; // 崩潰的波動 遺物等級 0–10
    rageCircle: number; // 憤怒衝擊 魔法陣 0–10
    rageSet: boolean; // 憤怒衝擊 套裝（+2%）
    barrierStacks: number; // 倒塌的屏障 層數 1–5
}
const settings = useLocalStorage<ValueSettings>("armor-break:value-settings", {
    equip1: true,
    equip2: true,
    knuckleReforge: 5, // 6–7 需突破
    hydraEcho: 20,
    arrowCircle: 10,
    arrowSet: true,
    reaperReforge: 20, // 21–25 需突破
    reaperSet: true,
    totem: 5,
    insightSet: true,
    card: 30,
    relic: 10,
    rageCircle: 10,
    rageSet: true,
    barrierStacks: 5,
});

// 某技能對某條件的減益數值（依設定）
const skillValue = (skillId: number, condId: number): DebuffValue => {
    const st = settings.value;
    switch (skillId) {
        case 27205: // 黃道蔓延
            if (condId === 1166) return { pct: 45, fixed: 0 };
            return {
                pct: Math.min(11, (st.equip1 ? 5 : 0) + (st.equip2 ? 6 : 0)),
                fixed: Math.min(17, (st.equip1 ? 7 : 0) + (st.equip2 ? 10 : 0)),
            };
        case 26006: // 灰色煙幕術
            return { pct: 11, fixed: 20 };
        case 24201: // 螺旋勾拳
            return { pct: 11, fixed: 23 + st.knuckleReforge };
        case 35024: // 海德拉鍊成
            return { pct: 11, fixed: 31 + st.hydraEcho * 0.5 };
        case 21006: {
            // 支援箭
            const base = 48 + st.arrowCircle * 0.3;
            return { pct: st.arrowSet ? base * 1.15 : base, fixed: 0 };
        }
        case 27010: // 死神烙印
            if (condId === 426) return { pct: 0, fixed: 0 }; // 死神烙印標記本身無數值
            return { pct: 53 + st.reaperReforge * 0.25 + (st.reaperSet ? 3 : 0), fixed: 0 };
        case 58018: // 刻印 : 弗拉加拉赫 → 1093/1094 保護最大減少
            return { pct: 0, fixed: 16 };
        case 10103: // 瑪奇魔法陣發動 → 10001/10002
            return { pct: 0, fixed: 10 };
        // ===== 追加 =====
        case 521: // 洞察之眼（增傷）
            return { pct: 3 + st.totem * 0.4, fixed: 0 };
        case 1026: // 倒吊人（增傷）
            return { pct: 2 + 0.1 * st.card, fixed: 0 };
        case 490279: // 天使貓 → 578 魔法光圈（保護＋魔保）
        case 490280:
            return { pct: 0, fixed: 1 };
        case 803: // 崩潰的波動（保護＋魔保）
            return { pct: 0, fixed: 40 };
        case 1063: // 倒塌的屏障（每層 -3，最多 5 層）
            return { pct: 0, fixed: 3 * st.barrierStacks };
        case 339: // 憤怒衝擊（近戰技能傷害）
            return { pct: 15 + st.rageCircle * 0.3 + (st.rageSet ? 2 : 0), fixed: 0 };
        case 1145: // 觸媒效應（保護＋魔保）
            return { pct: 0, fixed: 3.68 };
        case 1147: // 召喚噩夢（保護＋魔保；最終傷害另計，不入 value）
            return { pct: 0, fixed: 1.845 };
        // ===== 寵物／其他（保護＋魔保 或 增傷）=====
        case 50226: // 水炸彈投擲 → 594 跑跑卡丁車水球
            return { pct: 0, fixed: 3 };
        case 490105: // 寵物 → 392 纏繞的閃電
        case 490253:
            return { pct: 0, fixed: 10 };
        case 490229: // 寵物 → 464 冰雪狀態
            return { pct: 0, fixed: 4 };
        case 490411: // 寵物 → 912 喵喵的喵皇降臨
            return { pct: 0, fixed: 15 };
        case 490431: // 寵物 → 1138 幸運草標記（增傷）
            return { pct: 15, fixed: 0 };
        case 491006: // 寵物 → 1004 銳利目光（暴擊傷害）
            return { pct: 3, fixed: 0 };
        default:
            return { pct: 0, fixed: 0 };
    }
};
// 條件的持續秒數（部分依設定動態計算；永久回 Infinity）
const durationOf = (c: Condition): number => {
    if (c.permanent) return Infinity;
    const st = settings.value;
    switch (c.id) {
        case 521:
            return 120 + (st.insightSet ? 60 : 0);
        case 1026:
            return 30 + st.card;
        case 803:
            return 10 + st.relic * 0.5;
        default:
            return c.seconds ?? 0;
    }
};
const hasValue = (v: DebuffValue) => v.pct > 0 || v.fixed > 0;
const sourcesForCond = (condId: number) => SOURCES.filter((s) => s.conditions.includes(condId));
// 條件的最高數值（各分量取所有來源技能之最大）
const maxValueOf = (condId: number): DebuffValue =>
    sourcesForCond(condId).reduce<DebuffValue>(
        (acc, s) => {
            const v = skillValue(s.id, condId);
            return { pct: Math.max(acc.pct, v.pct), fixed: Math.max(acc.fixed, v.fixed) };
        },
        { pct: 0, fixed: 0 },
    );
const num = (n: number) => Number(n.toFixed(4)).toString(); // 去尾零、保留小數精度（1.845 / 6.525…）
// 顯示用：prot → ["-11%", "-30"]（0 的分量略過），atk → ["+62%"]
const valueLines = (c: Condition, v: DebuffValue): string[] => {
    if (!c.valueKind || !hasValue(v)) return [];
    if (c.valueKind === "atk") return [`+${num(v.pct)}%`];
    const out: string[] = [];
    if (v.pct > 0) out.push(`-${num(v.pct)}%`);
    if (v.fixed > 0) out.push(`-${num(v.fixed)}`);
    return out;
};
const valueInline = (c: Condition, v: DebuffValue): string => valueLines(c, v).join(" ");
// tooltip 明細：各來源技能對此條件的數值
const condBreakdown = (c: Condition): { name: string; value: string }[] => {
    if (!c.valueKind) return [];
    return sourcesForCond(c.id)
        .filter((s) => s.name)
        .map((s) => ({ name: s.name!, value: valueInline(c, skillValue(s.id, c.id)) }));
};

const condName = (c: Condition) => c.name || `#${c.id}`;
// 條件 hover：名稱（＋永久說明）
const condTitle = (c: Condition) => (c.note ? `${condName(c)}（${c.note}）` : condName(c));
// 來源 hover：技能名 → 施加的條件（含數值；寵物無名稱，只顯示條件）
const sourceTitle = (s: Source) => {
    const conds = s.conditions
        .map((id) => {
            const c = condById.get(id)!;
            const vl = valueInline(c, skillValue(s.id, id));
            return vl ? `${condName(c)} ${vl}` : condTitle(c);
        })
        .join("、");
    return s.name ? `${s.name} → ${conds}` : conds;
};
// 來源施加的條件時間（皆相同時只顯示一個）
const sourceDurLabel = (s: Source) => [
    ...new Set(
        s.conditions.map((id) => {
            const c = condById.get(id)!;
            return c.permanent ? (c.permLabel ?? "永久") : fmt(durationOf(c));
        }),
    ),
].join("/");
// 條件全為進階者，該來源視為進階
const isAdvancedSource = (s: Source) => s.conditions.every((id) => condById.get(id)?.advanced);

// ===== 設定 =====
const showAdvanced = ref(false);
const showSettings = ref(true); // 數值設定卡；預設展開（可點標題收合）
const showTotals = ref(true); // 破防總計卡；預設展開
const advancedOptional = ref(true); // 隨機出題及格設定：進階項目可不補
const dmgType = ref<"all" | "phys" | "magic">("all"); // 及格設定：純物理／純魔法時另一側不列入
const DMG_TYPES = [
    { key: "all", label: "全部" },
    { key: "phys", label: "純物理" },
    { key: "magic", label: "純魔法" },
] as const;
const mode = ref<"scratch" | "random">("scratch"); // 從0到1 / 隨機出題；預設從0到1
// 隊友組成（多選）：勾選的職業其專屬 debuff 才顯示；通用一律顯示
const teammates = useLocalStorage<string[]>("armor-break:teammates", []);
const TEAMMATES = [
    { key: "聖詠", label: "聖詠者" },
    { key: "聖盾", label: "聖盾守衛" },
    { key: "鍊金", label: "鍊金" },
] as const;
const classOk = (c?: Condition) => !c?.cls || teammates.value.includes(c.cls);
const toggleTeammate = (key: string) => {
    const s = new Set(teammates.value);
    s.has(key) ? s.delete(key) : s.add(key);
    teammates.value = [...s];
};
const visibleConditions = computed(() =>
    CONDITIONS.filter((c) => (showAdvanced.value || !c.advanced) && classOk(c)),
);
const condVisible = (id: number) => visibleConditions.value.some((c) => c.id === id);

// ===== 自定義題目：使用者自選必須湊齊的目標集合 =====
const useCustomTarget = ref(false);
const customTarget = useLocalStorage<number[]>("armor-break:custom-target", []);
const isTarget = (id: number) => customTarget.value.includes(id);
const toggleTarget = (id: number) => {
    const s = new Set(customTarget.value);
    s.has(id) ? s.delete(id) : s.add(id);
    customTarget.value = [...s];
};

// 及格所需的條件：自定義題目→自選集合；否則 非必要/進階可不補/傷害類型 過濾
const requiredConditions = computed(() => {
    if (useCustomTarget.value) return visibleConditions.value.filter((c) => customTarget.value.includes(c.id));
    return visibleConditions.value.filter((c) => {
        if (c.optional) return false;
        if (advancedOptional.value && c.advanced) return false;
        if (dmgType.value === "phys" && c.side === "magic") return false;
        if (dmgType.value === "magic" && c.side === "phys") return false;
        return true;
    });
});
// ===== 自訂順序（拖曳，存 localStorage）=====
const savedOrder = useLocalStorage<number[]>("armor-break:source-order", []);
const orderedSources = computed(() => {
    const idx = new Map(savedOrder.value.map((id, i) => [id, i]));
    // 未記錄的（例如之後新增的技能）排在最後，sort 穩定所以彼此維持原順序
    return [...SOURCES].sort((a, b) => (idx.get(a.id) ?? Infinity) - (idx.get(b.id) ?? Infinity));
});
const hasCustomOrder = computed(() => savedOrder.value.length > 0);
const resetOrder = () => (savedOrder.value = []);

const dragId = ref<number | null>(null);
const dragOverId = ref<number | null>(null);
const onDragStart = (s: Source) => (dragId.value = s.id);
const onDragEnd = () => ((dragId.value = null), (dragOverId.value = null));
const onDragEnter = (target: Source) => {
    const src = SOURCES.find((s) => s.id === dragId.value);
    if (src && src.kind === target.kind && src.id !== target.id) dragOverId.value = target.id;
};
const onDrop = (target: Source) => {
    const src = SOURCES.find((s) => s.id === dragId.value);
    onDragEnd();
    if (!src || src.id === target.id || src.kind !== target.kind) return; // 只在同組內排序
    const order = orderedSources.value.map((s) => s.id);
    const from = order.indexOf(src.id);
    const to = order.indexOf(target.id);
    if (from < 0 || to < 0) return;
    order.splice(to, 0, order.splice(from, 1)[0]);
    savedOrder.value = order;
};

const visibleSources = computed(() =>
    orderedSources.value.filter(
        (s) => (showAdvanced.value || !isAdvancedSource(s)) && s.conditions.every((id) => classOk(condById.get(id))),
    ),
);
const sourcesOf = (kind: string) => visibleSources.value.filter((s) => s.kind === kind);

// ===== 進行中的條件：id -> { 到期時間(ms，永久為 Infinity), 累計數值 } =====
interface ActiveState extends DebuffValue {
    expireAt: number;
}
const active = ref<Record<number, ActiveState>>({});
const now = ref(Date.now());
let timer: number | undefined;
onMounted(() => {
    timer = window.setInterval(() => {
        now.value = Date.now();
        prune();
    }, 250);
});
onUnmounted(() => timer && clearInterval(timer));

// 時間到就移除
const prune = () => {
    const t = Date.now();
    const a = { ...active.value };
    let changed = false;
    for (const key of Object.keys(a)) {
        const id = Number(key);
        if (a[id].expireAt !== Infinity && a[id].expireAt <= t) {
            delete a[id];
            changed = true;
        }
    }
    if (changed) active.value = a;
};

// 剩餘秒數：null=未在場、Infinity=永久
const remainingOf = (id: number): number | null => {
    const e = active.value[id]?.expireAt;
    if (e === undefined) return null;
    if (e === Infinity) return Infinity;
    return Math.max(0, Math.ceil((e - now.value) / 1000));
};
const isPresent = (id: number) => active.value[id] !== undefined;
// 該來源施加的條件是否全部在場
const sourcePresent = (s: Source) => s.conditions.every((id) => isPresent(id));

// 施加來源 → 套用其所有條件；數值各分量取高（低的只刷新時間），時間刷回最大
const applySource = (s: Source) => {
    const next = { ...active.value };
    for (const id of s.conditions) {
        const c = condById.get(id);
        if (!c) continue;
        const v = skillValue(s.id, id);
        const prev = next[id];
        const dur = durationOf(c);
        next[id] = {
            expireAt: dur === Infinity ? Infinity : Date.now() + dur * 1000,
            pct: Math.max(prev?.pct ?? 0, v.pct),
            fixed: Math.max(prev?.fixed ?? 0, v.fixed),
        };
    }
    active.value = next;
};
const remove = (id: number) => {
    const a = { ...active.value };
    delete a[id];
    active.value = a;
};
const clearAll = () => (active.value = {});

// ===== 隨機出題：10 關，全部在場即進入下一關 =====
const TOTAL_ROUNDS = 10;
const round = ref(1);
const finished = ref(false);

const seedRandom = () => {
    const a: Record<number, ActiveState> = {};
    for (const c of visibleConditions.value) {
        if (Math.random() < 0.6) {
            const mv = maxValueOf(c.id);
            const dur = durationOf(c);
            a[c.id] = {
                expireAt:
                    dur === Infinity ? Infinity : Date.now() + Math.max(3, Math.floor((0.1 + Math.random() * 0.9) * dur)) * 1000,
                pct: mv.pct,
                fixed: mv.fixed,
            };
        }
    }
    // 保證至少缺一個「必補」條件，否則開局就及格
    const req = requiredConditions.value;
    if (req.length && req.every((c) => a[c.id] !== undefined)) {
        delete a[req[Math.floor(Math.random() * req.length)].id];
    }
    active.value = a;
};

// 依模式重新開始
const reseed = () => {
    if (mode.value === "scratch") {
        active.value = {};
        return;
    }
    round.value = 1;
    finished.value = false;
    seedRandom();
};
const setMode = (m: "scratch" | "random") => {
    mode.value = m;
    reseed();
};

// ===== 進行中清單（顯示順序固定，依 CONDITIONS 宣告順序）=====
const activeList = computed(() =>
    visibleConditions.value
        .filter((c) => isPresent(c.id))
        .map((c) => {
            const st = active.value[c.id];
            return { c, remain: remainingOf(c.id)!, lines: valueLines(c, st) };
        }),
);
const presentCount = computed(() => activeList.value.length);

// 破防總計：依屬性把多個 debuff 的 %與固定分別相加（疊加相加）
interface StatGroup {
    key: string;
    label: string;
    iconId: number;
    kind: "prot" | "atk";
    conds: number[];
}
const STAT_GROUPS: StatGroup[] = [
    {
        key: "phys",
        label: "物理保護減少",
        iconId: 1164,
        kind: "prot",
        conds: [1164, 1093, 10001, 578, 803, 1063, 1145, 1147, 392, 464, 594, 912],
    },
    {
        key: "magic",
        label: "魔法保護減少",
        iconId: 1165,
        kind: "prot",
        conds: [1165, 1094, 10002, 578, 803, 1063, 1145, 1147, 392, 464, 594, 912],
    },
    { key: "atk", label: "所受傷害增加", iconId: 1166, kind: "atk", conds: [1166, 521, 1026, 1138] },
    { key: "melee", label: "近戰技能傷害", iconId: 339, kind: "atk", conds: [339] },
    { key: "crit", label: "暴擊傷害", iconId: 1004, kind: "atk", conds: [1004] },
];
const fmtVal = (kind: "prot" | "atk", pct: number, fixed: number) => {
    if (kind === "atk") return `+${num(pct)}%`;
    const parts: string[] = [];
    if (pct > 0) parts.push(`-${num(pct)}%`);
    if (fixed > 0) parts.push(`-${num(fixed)}`);
    return parts.length ? parts.join(" / ") : "—";
};

const debuffTotals = computed(() =>
    STAT_GROUPS.map((g) => {
        let pct = 0;
        let fixed = 0;
        let anyActive = false;
        const conds: { name: string; value: string; skills: { name: string; value: string }[] }[] = [];
        for (const id of g.conds) {
            const st = active.value[id];
            if (!st) continue;
            anyActive = true;
            pct += st.pct;
            fixed += st.fixed;
            if (st.pct === 0 && st.fixed === 0) continue; // 尚無數值者不列入明細
            const c = condById.get(id)!;
            conds.push({ name: condName(c), value: fmtVal(g.kind, st.pct, st.fixed), skills: condBreakdown(c) });
        }
        return { g, present: anyActive, total: fmtVal(g.kind, pct, fixed), conds };
    }),
);

// 及格：所有「必補」條件都在場
const passed = computed(() => requiredConditions.value.length > 0 && requiredConditions.value.every((c) => isPresent(c.id)));

// 及格即進入下一關
watch(passed, (ok) => {
    if (!ok || mode.value !== "random" || finished.value) return;
    ElMessage.closeAll(); // 連續過關時避免提示疊在一起
    if (round.value >= TOTAL_ROUNDS) {
        finished.value = true;
        ElMessage.success({ message: `🎉 完成 ${TOTAL_ROUNDS} 關！`, duration: 2500 });
    } else {
        round.value++;
        ElMessage.success({ message: `過關！第 ${round.value} / ${TOTAL_ROUNDS} 關`, duration: 1200 });
        seedRandom();
    }
});

const hintText = computed(() => {
    if (mode.value !== "random") return "時間到會自動移除，歸零前再施加即可刷新";
    if (useCustomTarget.value) return "湊齊自訂目標即進入下一關";
    const skip: string[] = [];
    if (advancedOptional.value && showAdvanced.value) skip.push("進階");
    if (dmgType.value !== "all") skip.push(dmgType.value === "phys" ? "魔法側" : "物理側");
    return skip.length ? `${skip.join("、")}不計，其餘全部在場即進入下一關` : "全部在場即進入下一關";
});

function fmt(s: number): string {
    return s === Infinity ? "永久" : `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
}
// 永久者依條件顯示「永久」或「在場」
const remainLabel = (c: Condition, remain: number) => (remain === Infinity ? (c.permLabel ?? "永久") : fmt(remain));
const remainClass = (remain: number) =>
    remain === Infinity ? "text-accent" : remain <= 15 ? "text-amber-400" : "text-gray-100";
</script>

<template>
    <div class="min-h-screen bg-gray-900 text-gray-100 py-6 px-4 sm:px-6 bg-texture-dark">
        <div class="max-w-5xl mx-auto">
            <header class="mb-6 text-center pt-8 pb-2">
                <h1 class="text-4xl sm:text-5xl font-bold text-gradient mb-2 tracking-wide font-serif drop-shadow-lg">
                    破防練習
                </h1>
                <p class="text-base text-gray-400 mt-3">練習維持破防條件同時在場，掌握各技能與寵物的重施時機</p>
            </header>

            <!-- 控制 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div class="flex flex-wrap items-center gap-4">
                    <div>
                        <p class="step-label">模式</p>
                        <div class="flex gap-2">
                            <button
                                class="tier-btn"
                                :class="{ 'tier-btn--active': mode === 'scratch' }"
                                @click="setMode('scratch')"
                            >
                                從 0 到 1
                            </button>
                            <button
                                class="tier-btn"
                                :class="{ 'tier-btn--active': mode === 'random' }"
                                @click="setMode('random')"
                            >
                                隨機出題（{{ TOTAL_ROUNDS }} 關）
                            </button>
                        </div>
                    </div>
                    <div>
                        <p class="step-label">選項</p>
                        <div class="flex items-center gap-4">
                            <el-checkbox v-model="showAdvanced" label="顯示進階" size="large" />
                            <el-tooltip
                                v-if="mode === 'random' && !useCustomTarget"
                                content="及格判定時不要求補上進階項目"
                                placement="top"
                                :show-after="100"
                            >
                                <el-checkbox v-model="advancedOptional" label="進階項目可不補" size="large" />
                            </el-tooltip>
                            <el-tooltip
                                v-if="mode === 'random'"
                                content="自選要湊齊的 debuff 作為過關條件"
                                placement="top"
                                :show-after="100"
                            >
                                <el-checkbox v-model="useCustomTarget" label="自定義題目" size="large" />
                            </el-tooltip>
                        </div>
                    </div>
                    <div>
                        <p class="step-label">隊友組成（可多選）</p>
                        <div class="flex gap-2 flex-wrap">
                            <button
                                v-for="t in TEAMMATES"
                                :key="t.key"
                                class="tier-btn"
                                :class="{ 'tier-btn--active': teammates.includes(t.key) }"
                                @click="toggleTeammate(t.key)"
                            >
                                {{ t.label }}
                            </button>
                        </div>
                    </div>
                    <div v-if="mode === 'random' && !useCustomTarget">
                        <p class="step-label">傷害類型（及格判定）</p>
                        <div class="flex gap-2">
                            <el-tooltip
                                v-for="t in DMG_TYPES"
                                :key="t.key"
                                :content="
                                    t.key === 'all'
                                        ? '物理與魔法側都要補齊'
                                        : `及格判定不要求${t.key === 'phys' ? '魔法' : '物理'}側的條件`
                                "
                                placement="top"
                                :show-after="100"
                            >
                                <button
                                    class="tier-btn"
                                    :class="{ 'tier-btn--active': dmgType === t.key }"
                                    @click="dmgType = t.key"
                                >
                                    {{ t.label }}
                                </button>
                            </el-tooltip>
                        </div>
                    </div>
                    <div class="w-full flex justify-center gap-2">
                        <el-button type="warning" @click="reseed">
                            {{ mode === "random" ? "重新出題" : "重新開始" }}
                        </el-button>
                        <el-button plain :disabled="activeList.length === 0" @click="clearAll">清除</el-button>
                    </div>
                </div>
            </el-card>

            <!-- 自定義目標 -->
            <el-card
                v-if="mode === 'random' && useCustomTarget"
                class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6"
            >
                <div class="mb-3 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">自定義目標</h2>
                    <span class="text-sm text-gray-400">
                        已選 <span class="text-white font-bold">{{ customTarget.length }}</span> 個
                    </span>
                    <span class="text-xs text-gray-500 hidden sm:inline">點選要練習湊齊的 debuff</span>
                    <el-button v-if="customTarget.length" size="small" plain class="ml-auto" @click="customTarget = []">
                        清空
                    </el-button>
                </div>
                <div class="icon-row">
                    <el-tooltip
                        v-for="c in visibleConditions"
                        :key="c.id"
                        :content="condTitle(c)"
                        placement="top"
                        :show-after="100"
                    >
                        <button
                            class="cond-btn"
                            :class="{ 'cond-btn--present': isTarget(c.id), 'cond-btn--advanced': c.advanced }"
                            @click="toggleTarget(c.id)"
                        >
                            <img :src="condIconUrl(c.id)" :alt="condName(c)" class="h-6 w-6 sm:h-8 sm:w-8 object-contain" loading="lazy" />
                            <span class="text-xs text-gray-300">{{ isTarget(c.id) ? "✔" : "＋" }}</span>
                        </button>
                    </el-tooltip>
                </div>
                <p v-if="!customTarget.length" class="mt-2 text-xs text-amber-400">請至少選一個目標，否則無法過關。</p>
            </el-card>

            <!-- 進行中 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div class="mb-4 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">進行中</h2>
                    <span class="text-sm text-gray-400">
                        在場 <span class="text-white font-bold">{{ presentCount }}</span> /
                        {{ visibleConditions.length }}
                    </span>
                    <span v-if="mode === 'random'" class="round-badge">
                        第 <span class="text-accent font-bold">{{ round }}</span> / {{ TOTAL_ROUNDS }} 關
                    </span>
                    <span class="text-xs text-gray-500 hidden sm:inline ml-auto">{{ hintText }}</span>
                </div>

                <p v-if="finished" class="mb-3 text-center text-accent font-bold">
                    🎉 完成 {{ TOTAL_ROUNDS }} 關！按「重新出題」再來一輪
                </p>

                <div v-if="activeList.length === 0" class="py-8 text-center text-gray-600 text-sm">
                    — 尚無在場條件，點下方技能／寵物施加 —
                </div>
                <div v-else class="icon-row">
                    <el-tooltip v-for="item in activeList" :key="item.c.id" placement="top" :show-after="100">
                        <template #content>
                            <div>{{ condTitle(item.c) }}</div>
                            <div v-for="b in condBreakdown(item.c)" :key="b.name" class="text-xs opacity-80">
                                {{ b.name }} {{ b.value }}
                            </div>
                        </template>
                        <div class="active-card">
                            <button class="active-remove" title="移除" @click="remove(item.c.id)">✕</button>
                            <img
                                :src="condIconUrl(item.c.id)"
                                :alt="condName(item.c)"
                                class="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                                loading="lazy"
                            />
                            <span class="text-xs font-bold tabular-nums" :class="remainClass(item.remain)">
                                {{ remainLabel(item.c, item.remain) }}
                            </span>
                            <span v-if="item.lines.length" class="cond-value">
                                <span v-for="(l, i) in item.lines" :key="i">{{ l }}</span>
                            </span>
                        </div>
                    </el-tooltip>
                </div>
            </el-card>

            <!-- 破防總計 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showTotals ? 'mb-3 border-b border-gray-700 pb-3' : ''"
                    @click="showTotals = !showTotals"
                >
                    <h2 class="text-xl font-bold text-accent">破防總計</h2>
                    <span
                        class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showTotals ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >
                        ▼
                    </span>
                </div>
                <div v-show="showTotals" class="flex flex-wrap gap-3">
                    <el-tooltip
                        v-for="t in debuffTotals"
                        :key="t.g.key"
                        placement="top"
                        :show-after="100"
                        :disabled="!t.present"
                    >
                        <template #content>
                            <div class="font-semibold">{{ t.g.label }} 合計 {{ t.total }}</div>
                            <div v-for="cd in t.conds" :key="cd.name" class="mt-1 text-xs">
                                <div class="opacity-90">{{ cd.name }} {{ cd.value }}</div>
                                <div v-for="sk in cd.skills" :key="sk.name" class="opacity-70 pl-2">
                                    {{ sk.name }} {{ sk.value }}
                                </div>
                            </div>
                        </template>
                        <div class="total-item" :class="{ 'total-item--off': !t.present }">
                            <img :src="condIconUrl(t.g.iconId)" :alt="t.g.label" class="h-7 w-7 object-contain flex-shrink-0" />
                            <div class="min-w-0">
                                <div class="total-name">{{ t.g.label }}</div>
                                <div v-if="t.present" class="total-val">{{ t.total }}</div>
                                <div v-else class="total-off">未施加</div>
                            </div>
                        </div>
                    </el-tooltip>
                </div>
            </el-card>

            <!-- 施加來源 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div class="mb-3 flex items-center gap-3 flex-wrap">
                    <h2 class="text-xl font-bold text-accent">施加</h2>
                    <span class="text-xs text-gray-500 hidden sm:inline">可拖曳調整順序，會自動記住</span>
                    <el-button v-if="hasCustomOrder" size="small" plain class="ml-auto" @click="resetOrder">
                        重設順序
                    </el-button>
                </div>
                <div v-for="g in SOURCE_GROUPS" :key="g.kind">
                    <template v-if="sourcesOf(g.kind).length">
                        <p class="step-label mt-2">{{ g.label }}</p>
                        <div class="icon-row">
                            <el-tooltip
                                v-for="s in sourcesOf(g.kind)"
                                :key="s.id"
                                :content="sourceTitle(s)"
                                placement="top"
                                :show-after="100"
                            >
                                <button
                                    class="cond-btn"
                                    :class="{
                                        'cond-btn--present': mode !== 'random' && sourcePresent(s),
                                        'cond-btn--advanced': isAdvancedSource(s),
                                        'cond-btn--dragging': dragId === s.id,
                                        'cond-btn--dragover': dragOverId === s.id,
                                    }"
                                    draggable="true"
                                    @click="applySource(s)"
                                    @dragstart="onDragStart(s)"
                                    @dragend="onDragEnd"
                                    @dragenter="onDragEnter(s)"
                                    @dragover.prevent
                                    @drop.prevent="onDrop(s)"
                                >
                                    <img
                                        :src="sourceIconUrl(s)"
                                        :alt="s.name || String(s.id)"
                                        class="h-6 w-6 sm:h-8 sm:w-8 object-contain"
                                        loading="lazy"
                                    />
                                    <span class="text-xs text-gray-300">{{ sourceDurLabel(s) }}</span>
                                    <span v-if="isAdvancedSource(s)" class="cond-tag">進階</span>
                                </button>
                            </el-tooltip>
                        </div>
                    </template>
                </div>
            </el-card>

            <!-- 數值設定 -->
            <el-card class="mb-4 bg-gray-800 border-2 border-accent/30 shadow-lg rounded-xl p-4 sm:p-6">
                <div
                    class="flex items-center gap-2 cursor-pointer select-none"
                    :class="showSettings ? 'mb-4 border-b border-gray-700 pb-3' : ''"
                    @click="showSettings = !showSettings"
                >
                    <h2 class="text-xl font-bold text-accent">數值設定</h2>
                    <span class="text-xs text-gray-500 hidden sm:inline">影響進行中卡片與 hover 的減益數值</span>
                    <span
                        class="ml-auto text-gray-400 text-sm transition-transform duration-200"
                        :style="{ transform: showSettings ? 'rotate(180deg)' : 'rotate(0deg)' }"
                    >
                        ▼
                    </span>
                </div>

                <div v-show="showSettings" class="flex flex-col gap-3">
                    <div class="set-row">
                        <img :src="skillIconUrl(27205)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">黃道蔓延</span>
                        <span class="set-label"></span>
                        <el-checkbox v-model="settings.equip1" label="裝備1" />
                        <el-checkbox v-model="settings.equip2" label="裝備2" />
                    </div>
                    <div class="set-row">
                        <img :src="skillIconUrl(24201)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">螺旋勾拳</span>
                        <span class="set-label">細工</span>
                        <el-input-number v-model="settings.knuckleReforge" :min="0" :max="7" size="small" controls-position="right" style="width: 100px" />
                        <span v-if="settings.knuckleReforge >= 6" class="breakthrough-tag">突破</span>
                    </div>
                    <div class="set-row">
                        <img :src="skillIconUrl(35024)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">海德拉鍊成</span>
                        <span class="set-label">回音石</span>
                        <el-input-number v-model="settings.hydraEcho" :min="0" :max="20" size="small" controls-position="right" style="width: 100px" />
                    </div>
                    <div class="set-row">
                        <img :src="skillIconUrl(21006)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">支援箭</span>
                        <span class="set-label">魔法陣</span>
                        <el-input-number v-model="settings.arrowCircle" :min="0" :max="10" size="small" controls-position="right" style="width: 100px" />
                        <el-checkbox v-model="settings.arrowSet" label="套裝效果" />
                    </div>
                    <div class="set-row">
                        <img :src="skillIconUrl(27010)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">死神烙印</span>
                        <span class="set-label">細工</span>
                        <el-input-number v-model="settings.reaperReforge" :min="0" :max="25" size="small" controls-position="right" style="width: 100px" />
                        <span v-if="settings.reaperReforge >= 21" class="breakthrough-tag">突破</span>
                        <el-checkbox v-model="settings.reaperSet" label="套裝效果" />
                    </div>
                    <div v-if="condVisible(521)" class="set-row">
                        <img :src="condIconUrl(521)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">洞察之眼</span>
                        <span class="set-label">指揮官圖騰</span>
                        <el-input-number v-model="settings.totem" :min="0" :max="5" size="small" controls-position="right" style="width: 100px" />
                        <el-checkbox v-model="settings.insightSet" label="套裝（時間+60s）" />
                    </div>
                    <div v-if="condVisible(1026)" class="set-row">
                        <img :src="condIconUrl(1026)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">倒吊人</span>
                        <span class="set-label">卡片等級</span>
                        <el-input-number v-model="settings.card" :min="0" :max="30" size="small" controls-position="right" style="width: 100px" />
                    </div>
                    <div v-if="condVisible(339)" class="set-row">
                        <img :src="condIconUrl(339)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">憤怒衝擊</span>
                        <span class="set-label">魔法陣</span>
                        <el-input-number v-model="settings.rageCircle" :min="0" :max="10" size="small" controls-position="right" style="width: 100px" />
                        <el-checkbox v-model="settings.rageSet" label="套裝效果" />
                    </div>
                    <div v-if="condVisible(803)" class="set-row">
                        <img :src="condIconUrl(803)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">崩潰的波動</span>
                        <span class="set-label">遺物等級</span>
                        <el-input-number v-model="settings.relic" :min="0" :max="10" size="small" controls-position="right" style="width: 100px" />
                    </div>
                    <div v-if="condVisible(1063)" class="set-row">
                        <img :src="condIconUrl(1063)" alt="" class="h-6 w-6 object-contain" />
                        <span class="set-name">倒塌的屏障</span>
                        <span class="set-label">層數</span>
                        <el-input-number v-model="settings.barrierStacks" :min="1" :max="5" size="small" controls-position="right" style="width: 100px" />
                    </div>
                </div>
            </el-card>

            <p class="text-center text-xs text-gray-600 pb-6">
                圖示來源：eldisa/mabinogiImage。資料為暫定，歡迎回報校正。
            </p>
        </div>
    </div>
</template>

<style scoped>
.step-label {
    font-size: 0.8rem;
    color: #9ca3af;
    margin-bottom: 0.4rem;
}

.round-badge {
    font-size: 0.8rem;
    color: #d1d5db;
    padding: 2px 10px;
    border: 1px solid #4b5563;
    border-radius: 9999px;
    background: #111827;
}

/* 進行中卡片的數值（prot 兩行、atk 一行）*/
.cond-value {
    display: flex;
    flex-direction: column;
    align-items: center;
    line-height: 1.15;
    font-size: 0.6rem;
    font-weight: 600;
    color: #fbbf24;
}

/* 數值設定列 */
.set-row {
    display: flex;
    align-items: center;
    gap: 10px;
    flex-wrap: wrap;
}
.set-name {
    font-size: 0.85rem;
    color: #e5e7eb;
    min-width: 5.5em;
}
.set-label {
    font-size: 0.8rem;
    color: #9ca3af;
    min-width: 5rem; /* 固定寬讓各列的 input／checkbox 對齊 */
}
.breakthrough-tag {
    font-size: 0.7rem;
    font-weight: 600;
    color: #fbbf24;
    padding: 1px 8px;
    border: 1px solid #b45309;
    border-radius: 9999px;
    background: #2d2207;
}

/* 破防總計 */
.total-item {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    border: 1.5px solid #f59e0b;
    border-radius: 10px;
    background: #111827;
    min-width: 130px;
}
.total-item--off {
    border-color: #374151;
    opacity: 0.6;
}
.total-name {
    font-size: 0.75rem;
    color: #d1d5db;
}
.total-val {
    font-size: 0.95rem;
    font-weight: 700;
    color: #fbbf24;
    font-variant-numeric: tabular-nums;
}
.total-off {
    font-size: 0.8rem;
    color: #6b7280;
}

.tier-btn {
    padding: 6px 14px;
    font-size: 0.85rem;
    border-radius: 8px;
    border: 1.5px solid #374151;
    background: #1f2937;
    color: #d1d5db;
    cursor: pointer;
    transition: all 0.15s;
}
.tier-btn:hover {
    border-color: #6b7280;
}
.tier-btn--active {
    border-color: #f59e0b;
    background: #2d2207;
    color: #fbbf24;
    font-weight: 600;
}

/* 放得下就一排，放不下自動換行（不橫向捲，確保全部同時可見） */
.icon-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 2px 2px 8px;
}
.icon-row > * {
    flex-shrink: 0;
}

/* 進行中卡片 */
.active-card {
    position: relative;
    min-width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 6px 6px;
    border: 1.5px solid #f59e0b;
    border-radius: 10px;
    background: #111827;
}
.active-remove {
    position: absolute;
    top: -8px;
    right: -8px;
    width: 20px;
    height: 20px;
    border-radius: 9999px;
    border: 1px solid #4b5563;
    background: #374151;
    color: #d1d5db;
    font-size: 0.7rem;
    line-height: 1;
    cursor: pointer;
}
.active-remove:hover {
    background: #ef4444;
    color: #fff;
}

/* 施加按鈕 */
.cond-btn {
    position: relative;
    min-width: 60px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 3px;
    padding: 8px 6px;
    border: 1.5px solid #374151;
    border-radius: 10px;
    background: #1f2937;
    cursor: pointer;
    transition: all 0.15s;
}
.cond-btn:hover {
    border-color: #6b7280;
    transform: translateY(-2px);
}
.cond-btn--present {
    border-color: #f59e0b;
    background: #2d2207;
}
.cond-btn--advanced {
    border-style: dashed;
}
.cond-btn--dragging {
    opacity: 0.4;
}
.cond-btn--dragover {
    border-color: #fbbf24;
    background: #3b2f0a;
}
.cond-tag {
    position: absolute;
    top: -7px;
    left: -6px;
    font-size: 0.55rem;
    padding: 1px 5px;
    border-radius: 6px;
    background: #4c1d95;
    color: #ddd6fe;
    line-height: 1.3;
}

/* 窄螢幕縮小卡片，讓每排多塞幾個（需放在基礎規則之後才蓋得過）
   40px 已足夠容納 icon(24) 與最寬的倒數文字(25) + 左右 padding */
@media (max-width: 639px) {
    .icon-row {
        gap: 6px;
    }
    .active-card,
    .cond-btn {
        min-width: 40px;
        padding: 6px 4px;
    }
}
</style>
