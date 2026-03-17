export const getSkillIcon = (id: number | string) => {
    const baseUrl = "https://cdn.jsdelivr.net/gh/eldisa/mabinogiImage@main/SkillImage/";
    return `${baseUrl}${id}.png`;
};
