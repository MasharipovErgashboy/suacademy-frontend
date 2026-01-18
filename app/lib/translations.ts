export const translations = {
    uz: {
        header: {
            home: "Bosh sahifa",
            lessons: "Darslar",
            vocabulary: "Lug'at",
            ebooks: "E-Kitob",
            ai: "AI",
            feedback: "Fikr-mulohazalar",
        },
    },
    ja: {
        header: {
            home: "ホームページ",
            lessons: "動画レッスン",
            vocabulary: "辞書",
            ebooks: "電子書籍",
            ai: "AI",
            feedback: "フィードバック",
        },
    },
};

export type Language = keyof typeof translations;
