export interface Sponsor {
    id: string;
    name: string;
    type: "featured" | "supporter";
    avatar?: string;
    description?: string;
    donateUrl?: string;
    website?: string;
    github?: string;
    discord?: string;
    role?: string;
    anonymous?: boolean;
    visible?: boolean;
    order?: number;
    amount?: number;
    joinedAt?: string;
    badge?: string;
    tier?: string;
    message?: string;
    icon?: string;
    isAnonymous?: boolean;
}

const sponsors: Sponsor[] = [
    {
        id: "洛普貓聊天區",
        name: "洛普貓聊天區",
        description: "長期提供回饋、測試與資料協助，讓工具能持續改進。",
        avatar: "/supporter/ropcat-group.png",
        type: "featured",
        role: "Community",
        discord: "https://discord.gg/RJptwqhQXr",
        order: 10,
    },
    {
        id: "ropcat",
        name: "洛普貓",
        description: "洛普貓聊天區-群主，喜歡幫忙算數學的人。\n如果你真的非常想贊助的話，可以用下面的管道贊助",
        avatar: "/supporter/ropcat-chara.png",
        type: "featured",
        role: "Developer",
        donateUrl: "https://payment.opay.tw/Broadcaster/Donate/C279BD065B44B0A73260AD1FF71EEAEA",
        order: 20,
    },
    // {
    //     id: "anonymous-001",
    //     name: "Anonymous",
    //     type: "supporter",
    //     anonymous: true,
    //     order: 100,
    // },
];

export default sponsors;
