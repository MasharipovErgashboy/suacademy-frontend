"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function GamesPage() {
    const [isUz, setIsUz] = useState(true);

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (saved) setIsUz(saved === "uz");
    }, []);

    return (
        <div className="min-h-screen bg-[#FFF4E6] flex flex-col">
            <Header />
            <main className="flex-grow container mx-auto px-4 py-20 text-center">
                <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
                    {isUz ? "O'yinlar" : "ゲーム"}
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    {isUz
                        ? "O'yinlar bo'limi tez kunda ishga tushadi!"
                        : "ゲームセクションは近日公開予定です！"}
                </p>
            </main>
            <Footer />
        </div>
    );
}
