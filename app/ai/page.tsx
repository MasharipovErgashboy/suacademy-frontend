"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function AiPage() {
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
                    {isUz ? "AI" : "AI"}
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    {isUz
                        ? "AI yordamchi bo'limi tez kunda ishga tushadi!"
                        : "AIアシスタントセクションは近日公開予定です！"}
                </p>
            </main>
            <Footer />
        </div>
    );
}
