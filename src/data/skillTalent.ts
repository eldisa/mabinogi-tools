import talents from "./talent";

// talent.ts 的才能 id → 所屬技能 ID（細工/回音石詞條用到的技能）
// 依遊戲 TalentList 歸類，沒有對應才能時改用技能視窗分頁
const talentSkillIds: Record<number, number[]> = {
    1: [20001, 20002, 20003, 20011, 20012, 20018, 20020, 20021, 21010, 22001, 22002, 22004, 22007, 23002, 23003, 23012, 23013, 23014, 23016, 23018, 23019, 23028, 23029, 23043, 23058, 23107],
    2: [21001, 21002, 21003, 21006, 21007, 21012, 21014, 22011, 23030, 23060, 23061],
    3: [30003, 30006, 30008, 30016, 30017, 30018, 30019, 30101, 30102, 30105, 30201, 30202, 30301, 30302, 30307, 30453, 30460, 30461, 30462, 30463, 30464, 30470, 30481, 30482],
    4: [10030, 10031, 35002, 35004, 35006, 35007, 35008, 35009, 35010, 35011, 35012, 35013, 35014, 35016, 35017, 35018, 35019, 35024, 50032],
    5: [23063, 24001, 24101, 24102, 24103, 24201, 24202, 24301, 24302, 25000],
    6: [54001, 54101, 54102, 54103, 54104, 54105, 54106, 54201, 54202],
    7: [54303, 54304, 54305, 54306, 54307, 54401, 54402],
    8: [26000, 26001, 26002, 26003, 26004, 26005, 26006, 26007],
    9: [27000, 27001, 27002, 27003, 27004, 27005, 27006, 27007, 27008, 27009, 27010, 27011, 27012],
    10: [20016, 20017, 23062],
    11: [27200, 27201, 27202, 27203, 27204, 27205, 27206, 27207, 27210],
};

// talent.ts 以外的額外分類；剩下的技能（金幣攻擊、逃脫危機）歸「其他」
const extraSkillIds: Record<string, number[]> = {
    音樂: [10003, 10006, 30015, 53001, 53101, 53102, 53103, 53104, 53105, 53106],
    變身: [40001, 40002, 40003, 40004, 41001, 41002, 41011, 41012, 41013, 43001, 43002, 43011, 43012, 43013, 44001, 44002, 44011, 44012, 44013, 45001, 45002, 45003, 45007, 45008, 45009, 56001],
    生活: [10001, 10010, 10011, 10013, 10015, 10016, 10020, 10021, 10023, 10024, 10026, 10028, 10033, 10042, 10043, 10046, 27103, 50014],
};

const groups: [string, number[]][] = [
    ...talents.map((t): [string, number[]] => [t.name, talentSkillIds[t.id] ?? []]),
    ...Object.entries(extraSkillIds),
];

const skillTalentName = new Map<number, string>(groups.flatMap(([name, ids]) => ids.map((id) => [id, name] as [number, string])));

export const OTHER_TALENT = "其他";
export const NO_SKILL_TALENT = "一般";

// 詞條所屬大分類：無技能的詞條（力量、防禦…）歸「一般」
export const talentOfSkill = (skillId?: number): string =>
    skillId === undefined ? NO_SKILL_TALENT : (skillTalentName.get(skillId) ?? OTHER_TALENT);

// 分組顯示順序：一般 → talent.ts 順序 → 音樂、變身、生活 → 其他
export const TALENT_ORDER = [NO_SKILL_TALENT, ...groups.map(([name]) => name), OTHER_TALENT];

const talentRank = (skillId?: number) => TALENT_ORDER.indexOf(talentOfSkill(skillId));

// 依大分類 → 技能排序，同技能的詞條相鄰；同技能內維持原順序
export const sortByTalent = <T extends { skillId?: number }>(list: T[]): T[] =>
    [...list].sort((a, b) => talentRank(a.skillId) - talentRank(b.skillId) || (a.skillId ?? 0) - (b.skillId ?? 0));

// 詞條池中實際出現的分類與數量（供分類按鈕使用）
export const talentTabs = (list: { skillId?: number }[]) =>
    TALENT_ORDER.map((name) => ({ name, count: list.filter((e) => talentOfSkill(e.skillId) === name).length })).filter(
        (t) => t.count > 0,
    );
