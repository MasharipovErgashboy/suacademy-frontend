"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import HeroSwiper from "../components/HeroSwiper";
import IntroSection from "../components/IntroSection";

export default function HomePage() {
    const router = useRouter();
    const [nationality, setNationality] = useState<string>("uz");

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (!saved) {
            router.push("/");
        } else {
            setNationality(saved);
        }
    }, [router]);

    const isUz = nationality === "uz";

    return (
        <div className={`min-h-screen ${isUz ? "bg-gradient-to-br from-blue-50 via-white to-purple-50" : "bg-gradient-to-br from-orange-50 via-white to-red-50"}`}>
            <Header />

            {/* Content Wrapper */}
            <div className="pt-8">
                <main className="container mx-auto px-4 space-y-24">

                    {/* Hero Section */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700">
                        <HeroSwiper />
                    </div>

                    {/* Intro Section */}
                    <div className="animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
                        <IntroSection />
                    </div>

                    {/* Subscription Preview Section */}
                    <section className="relative overflow-hidden rounded-[3rem] p-12 text-center bg-white/50 backdrop-blur-sm border border-white/50 shadow-lg">
                        <div className={`absolute inset-0 opacity-10 ${isUz ? "bg-blue-600" : "bg-orange-600"}`}></div>
                        <div className="relative z-10 max-w-3xl mx-auto">
                            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6">
                                {isUz ? "Premium Obuna" : "プレミアムサブスクリプション"}
                            </h2>
                            <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                                {isUz
                                    ? "Cheksiz bilimlar olamiga sho'ng'ing. Barcha darslar, maxsus materiallar va eksklyuziv imkoniyatlar."
                                    : "無限の知識の世界に飛び込みましょう。すべてのレッスン、特別教材、そして独占的な機能。"}
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                <button
                                    onClick={() => router.push("/subscription")}
                                    className={`px-10 py-4 rounded-full font-bold text-white text-lg shadow-xl transition-all hover:scale-110 active:scale-95 ${isUz ? "bg-blue-600 shadow-blue-200 hover:bg-blue-700" : "bg-[#FE9B19] shadow-orange-200 hover:bg-orange-600"}`}
                                >
                                    {isUz ? "Obuna bo'lish" : "購読する"}
                                </button>
                                <button
                                    onClick={() => router.push("/lessons")}
                                    className="px-10 py-4 rounded-full font-bold text-slate-700 bg-white border-2 border-slate-200 hover:bg-slate-50 transition-all hover:scale-105"
                                >
                                    {isUz ? "Darslarni ko'rish" : "レッスンを見る"}
                                </button>
                            </div>
                        </div>
                    </section>

                </main>
            </div>

            <Footer />
        </div>
    );
}
