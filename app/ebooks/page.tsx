"use client";

import { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function EbooksPage() {
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
                    {isUz ? "E-Kitob" : "電子書籍"}
                </h1>
                <p className="text-xl text-slate-600 max-w-2xl mx-auto">
                    {isUz
                        ? "E-Kitoblar bo'limi tez kunda ishga tushadi!"
                        : "電子書籍セクションは近日公開予定です！"}
                </p>
            </main>
            <Footer />
        </div>
    );
}
