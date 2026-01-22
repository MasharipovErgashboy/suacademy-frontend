"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { BACKEND_URL } from "../lib/auth";

export default function StatsSection() {
    const [nationality, setNationality] = useState<string>("uz");
    const [stats, setStats] = useState({
        users: 0,
        books: 0,
        lessons: 0,
        vocabulary: 0
    });

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);

        // Fetch Stats
        fetch(`${BACKEND_URL}/home/stats/`)
            .then(res => res.json())
            .then(data => setStats(data))
            .catch(err => console.error(err));
    }, []);

    const isUz = nationality === "uz";

    const statItems = [
        { label: isUz ? "Foydalanuvchilar" : "ユーザー", value: `${stats.users}+` },
        { label: isUz ? "Video Darslar" : "ビデオレッスン", value: `${stats.lessons}+` },
        { label: isUz ? "E-Kitoblar" : "電子書籍", value: `${stats.books}+` },
        { label: isUz ? "Yangi So'zlar" : "新しい言葉", value: `${stats.vocabulary}+` },
    ];

    return (
        <section className={`py-12 rounded-[3rem] px-8 my-8 md:my-16 shadow-2xl relative overflow-hidden ${isUz ? "bg-blue-600 text-white" : "bg-[#FE9B19] text-white"}`}>
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-10 pointer-events-none">
                <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
                    <path d="M0 100 C 20 0 50 0 100 100 Z" fill="white" />
                </svg>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8 relative z-10 text-center">
                {statItems.map((stat, idx) => (
                    <motion.div
                        key={idx}
                        title={stat.label}
                        initial={{ opacity: 0, scale: 0.5 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ delay: idx * 0.1, type: "spring" }}
                    >
                        <h3 className="text-4xl md:text-6xl font-black mb-2 tracking-tight">{stat.value}</h3>
                        <p className="text-white/80 font-bold uppercase tracking-wider text-sm md:text-base">{stat.label}</p>
                    </motion.div>
                ))}
            </div>
        </section>
    );
}
