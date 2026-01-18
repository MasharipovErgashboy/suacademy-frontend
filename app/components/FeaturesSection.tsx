"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function FeaturesSection() {
    const [nationality, setNationality] = useState<string>("uz");

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);
    }, []);

    const isUz = nationality === "uz";

    const features = [
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            ),
            title: isUz ? "Maxsus Darsliklar" : "特別な教科書",
            desc: isUz ? "Har bir dars ekspertlar tomonidan ishlab chiqilgan." : "各レッスンは専門家によって開発されました。"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            ),
            title: isUz ? "Doimiy Yangilanish" : "定期的な更新",
            desc: isUz ? "Platformaga har kuni yangi darslar va materiallar qo'shiladi." : "新しいレッスンと教材が毎日プラットフォームに追加されます。"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
            ),
            title: isUz ? "Tezkor Natija" : "迅速な結果",
            desc: isUz ? "Samarali metodika orqali tezda o'rganing." : "効果的な方法論を通じて迅速に学びます。"
        },
        {
            icon: (
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
            ),
            title: isUz ? "Interaktiv Lug'at" : "インタラクティブ辞書",
            desc: isUz ? "So'zlarni rasmlar va audio orqali oson yodlang." : "画像と音声で言葉を簡単に学びましょう。"
        }
    ];

    return (
        <section className="py-10">
            <div className="text-center mb-16">
                <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4">
                    {isUz ? "Nega aynan biz?" : "なぜ私たちなのか？"}
                </h2>
                <p className="text-slate-500 text-lg max-w-2xl mx-auto">
                    {isUz ? "Bizning platformamiz orqali til o'rganishning eng samarali usullarini kashf eting." : "私たちのプラットフォームを通じて、言語学習の最も効果的な方法を発見してください。"}
                </p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {features.map((feature, idx) => (
                    <motion.div
                        key={idx}
                        title={feature.title}
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1 }}
                        whileHover={{ y: -10 }}
                        className={`p-8 rounded-3xl bg-white border border-slate-100 shadow-xl hover:shadow-2xl transition-all group ${isUz ? "hover:shadow-blue-200" : "hover:shadow-orange-200"}`}
                    >
                        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors ${isUz ? "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white" : "bg-orange-50 text-[#FE9B19] group-hover:bg-[#FE9B19] group-hover:text-white"}`}>
                            {feature.icon}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 mb-3 group-hover:text-current transition-colors">
                            {feature.title}
                        </h3>
                        <p className="text-slate-500 leading-relaxed group-hover:text-slate-600">
                            {feature.desc}
                        </p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
