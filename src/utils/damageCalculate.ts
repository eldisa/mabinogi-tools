/*
⁠文字資訊版權聲明
才能技能初始傷害 = ⁠最終最大傷害 X 技能傷害倍率 X ⁠暴擊傷害
才能技能目標傷害 = 才能技能初始傷害 X 保護減算 - 防禦減算
才能技能最終傷害 = [ 才能技能目標傷害 X ( 1 + ⁠通用額外傷害 + ⁠才能額外傷害) X ⁠才能增加傷害 X ⁠最終增加傷害 ] + ⁠追加傷害 

祕法技能初始傷害 = [ 採計才能技能目標傷害 X ( 1 + ⁠才能額外傷害) X ⁠才能增加傷害 ] + [ ⁠最終最大傷害 X 未包含才能技能傷害倍率之祕法技能傷害倍率 X ⁠暴擊傷害 ]
祕法技能目標傷害 = 祕法技能初始傷害 X 保護減算 - 防禦減算
祕法技能最終傷害 = [ 祕法技能目標傷害 X ( 1 + ⁠通用額外傷害 + ⁠祕法額外傷害) X ⁠最終增加傷害 ] + ⁠追加傷害
*/
/*
[ 暴擊率上限 ]
總和暴擊率上限48.5%，細項如下
基礎暴擊率上限：30%
評價滿：7.5%
精靈武器：5%
祕法素質：6%
周日效果不會提升暴擊率上限 

基礎傷害：100%
暴擊R1：150%
評價滿：10%
精靈武器：15%
武器特殊改造R7：74%
暴擊傷害套裝：7%
艾爾班騎士團訓練所圖騰：5%
艾明馬夏娃娃背包組合：2%
浪漫農場模型暴擊傷害提升：13%，細項如下
卡薇娜模型：7% (一般模型)
浪漫農場星星模型：4% (特殊模型)
貓跳台：2% (寵物設施)
元素騎士祕法等級4等暴擊傷害提升：5% 
圖片
刺客服裝
發動時間簡單估算為10秒，20秒發動時間暴擊傷害提升12%，冷卻90秒
效果可與上述所有項目一同加算
實質換算常態暴擊傷害提升約可作為2% 
屬於暴擊傷害但我目前不想特別處理的部分：
人偶暴擊傷害提升套裝、審判之刃副技能利刃審判、凱爾特系列武器象徵效果
*/
import { protectionData } from "../data/protectionData";
const basicDamageCalculate = (damage: number, multiplier: number): number => {
    return damage * multiplier;
};

const calculateDamage = (
    baseDmg: number,
    piercingLevel: number,
    protection: number
): number => {
    // Calculate protection index after piercing and debuff
    let protectionIndex = protection - piercingLevel * 5;

    if (protectionIndex < 0) {
        protectionIndex = 0;
    }
    if (protectionIndex >= protectionData.length) {
        protectionIndex = protectionData.length - 1;
    }

    return baseDmg * (1 - protectionData[protectionIndex]);
};

// const magicDamageCalculate = (magicAtk: number, skillDamage : number): number => {
//     return magicAtk * skillDamage / 100;
// }

export { basicDamageCalculate, calculateDamage };
