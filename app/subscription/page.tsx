"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { motion } from "framer-motion";
import { BACKEND_URL, fetchWithAuth, isAuthenticated } from "../lib/auth";
import Header from "../components/Header";
import Footer from "../components/Footer";

interface SubscriptionPlan {
    id: number;
    name: string;
    duration_days: number;
    price: number;
    currency: string;
}

export default function SubscriptionPage() {
    const router = useRouter();
    const [plans, setPlans] = useState<SubscriptionPlan[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [nationality, setNationality] = useState<string>("uz");

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);

        fetchPlans();
    }, [router]);

    const fetchPlans = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetchWithAuth(`${BACKEND_URL}/subscriptions/plans/`);
            if (!response.ok) {
                throw new Error("Tariflarni yuklashda xatolik");
            }
            const data = await response.json();
            setPlans(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isUz = nationality === "uz";

    const formatPrice = (price: number, currency: string) => {
        if (currency === "UZS") {
            return price.toLocaleString() + " so'm";
        }
        return "$" + price.toLocaleString();
    };

    const containerVariants = {
        hidden: { opacity: 0 },
        show: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30 },
        show: { opacity: 1, y: 0 }
    };

    return (
        <div className="min-h-screen bg-[#FFF4E6] selection:bg-blue-200">
            <Header />

            <main className="relative pb-24 pt-12 overflow-hidden">
                {/* Background Decorative Elements */}
                <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                    <div className="absolute top-[-10%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 rounded-full blur-[100px] animate-pulse"></div>
                    <div className="absolute bottom-[-10%] left-[-10%] w-[600px] h-[600px] bg-orange-400/10 rounded-full blur-[100px] animate-pulse delay-700"></div>
                </div>

                <div className="max-w-7xl mx-auto px-4 relative z-10">
                    <div className="text-center mb-20 space-y-4">
                        <motion.span
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-wider mb-2 ${isUz ? "bg-blue-100 text-blue-600" : "bg-orange-100 text-orange-600"}`}
                        >
                            {isUz ? "Eng yaxshi sarmoya - bu ta'lim" : "最高の投資は教育です"}
                        </motion.span>
                        <motion.h1
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight"
                        >
                            {isUz ? "O'zingizga mos tarifni tanlang" : "あなたに合ったプランを選んでください"}
                        </motion.h1>
                        <motion.p
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.2 }}
                            className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed"
                        >
                            {isUz
                                ? "Bepul boshlang yoki Premium orqali barcha imkoniyatlarni oching."
                                : "無料で始めるか、プレミアムですべての機能のロックを解除します。"}
                        </motion.p>
                    </div>

                    {loading ? (
                        <div className="flex flex-col items-center justify-center py-20">
                            <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                            <p className="text-slate-500 font-medium">
                                {isUz ? "Tariflar yuklanmoqda..." : "プランを読み込み中..."}
                            </p>
                        </div>
                    ) : error ? (
                        <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center max-w-md mx-auto">
                            <p className="text-red-600 font-bold text-lg mb-4">{error}</p>
                            <button
                                onClick={fetchPlans}
                                className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                            >
                                {isUz ? "Qayta urinish" : "再試行"}
                            </button>
                        </div>
                    ) : (
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="show"
                            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 items-start"
                        >
                            {/* Free Plan Card */}
                            <motion.div
                                variants={itemVariants}
                                className="bg-white rounded-[2rem] p-8 border border-slate-200 shadow-xl relative overflow-hidden group hover:border-slate-300 transition-all h-full flex flex-col"
                            >
                                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                                    <svg className="w-24 h-24 text-slate-900" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                </div>

                                <div className="relative z-10 flex-1 flex flex-col">
                                    <h3 className="text-2xl font-black text-slate-800 mb-2">{isUz ? "Bepul" : "無料"}</h3>
                                    <p className="text-slate-500 text-sm mb-6 min-h-[40px]">
                                        {isUz ? "Platformani sinab ko'rish uchun" : "プラットフォームを試すために"}
                                    </p>
                                    <div className="mb-8">
                                        <span className="text-4xl font-black text-slate-900">0</span>
                                        <span className="text-slate-500 font-medium ml-1">
                                            {isUz ? "so'm / oy" : "$"}
                                        </span>
                                    </div>

                                    <div className="space-y-4 mb-8 flex-1">
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-slate-600 text-sm">{isUz ? "Cheklangan video darslar" : "限定的なビデオレッスン"}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-slate-600 text-sm">{isUz ? "E-kitoblarga kirish" : "電子書籍へのアクセス"}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                            </div>
                                            <span className="text-slate-600 text-sm">{isUz ? "Lug'atlardan foydalanish" : "辞書の使用"}</span>
                                        </div>
                                        <div className="flex items-start gap-3">
                                            <div className="w-5 h-5 rounded-full bg-orange-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
                                            </div>
                                            <span className="text-slate-600 text-sm">{isUz ? "Cheklangan o'yinlar" : "限定的なゲーム"}</span>
                                        </div>
                                        <div className="flex items-start gap-3 opacity-50">
                                            <div className="w-5 h-5 rounded-full bg-slate-100 flex items-center justify-center flex-shrink-0 mt-0.5">
                                                <svg className="w-3 h-3 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M6 18L18 6M6 6l12 12" /></svg>
                                            </div>
                                            <span className="text-slate-400 text-sm line-through">{isUz ? "AI Yordamchi" : "AIアシスタント"}</span>
                                        </div>
                                    </div>

                                    <button
                                        disabled
                                        className="w-full py-4 bg-slate-100 text-slate-400 rounded-xl font-bold cursor-not-allowed mt-auto"
                                    >
                                        {isUz ? "Joriy Tarif" : "現在のプラン"}
                                    </button>
                                </div>
                            </motion.div>

                            {/* Paid Plans */}
                            {plans.map((plan) => (
                                <motion.div
                                    key={plan.id}
                                    variants={itemVariants}
                                    className="bg-slate-900 rounded-[2rem] p-8 border border-slate-800 shadow-2xl relative overflow-hidden group hover:-translate-y-2 transition-all duration-300 flex flex-col h-full"
                                >
                                    {/* Gradient Overlay */}
                                    <div className={`absolute inset-0 bg-gradient-to-br opacity-20 group-hover:opacity-30 transition-opacity duration-500 ${isUz ? "from-blue-600 to-indigo-600" : "from-orange-500 to-red-600"}`}></div>

                                    {/* Animated Shine */}
                                    <div className="absolute inset-0 opacity-0 group-hover:opacity-10 transition-opacity duration-700 bg-gradient-to-r from-transparent via-white to-transparent -translate-x-full group-hover:translate-x-full transform skew-x-12"></div>

                                    <div className="relative z-10 flex-1 flex flex-col">
                                        <div className="flex justify-between items-start mb-4">
                                            <h3 className="text-2xl font-black text-white tracking-wide">{plan.name}</h3>
                                            <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase ${isUz ? "bg-blue-500/20 text-blue-300" : "bg-orange-500/20 text-orange-300"}`}>
                                                PRO
                                            </div>
                                        </div>

                                        <p className="text-slate-400 text-sm mb-6 min-h-[40px]">
                                            {isUz ? "Jiddiy o'rganuvchilar uchun" : "真剣な学習者のために"}
                                        </p>

                                        <div className="mb-8">
                                            <span className="text-4xl font-black text-white tracking-tight">
                                                {formatPrice(plan.price, plan.currency)}
                                            </span>
                                            {/* <span className="text-slate-500 font-medium ml-1 text-sm block mt-1">
                                                {isUz ? "bir martalik to'lov" : "一回払い"}
                                            </span> */}
                                        </div>

                                        <div className="space-y-4 mb-8 flex-1">
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUz ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}`}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-200 text-sm">
                                                    <strong className="text-white">{plan.duration_days} {isUz ? "kunlik" : "日間"}</strong> {isUz ? "to'liq kirish" : "フルアクセス"}
                                                </span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUz ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}`}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-200 text-sm">{isUz ? "Barcha video darslar" : "全ビデオレッスン"}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUz ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}`}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-200 text-sm">{isUz ? "E-kitoblar va materiallar" : "電子書籍と教材"}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUz ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}`}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-200 text-sm">{isUz ? "Reklamasiz tomosha" : "広告なしで視聴"}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUz ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}`}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-200 text-sm">{isUz ? "Barcha o'yinlar" : "全ゲーム"}</span>
                                            </div>
                                            <div className="flex items-start gap-3">
                                                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 ${isUz ? "bg-blue-500 text-white" : "bg-orange-500 text-white"}`}>
                                                    <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                </div>
                                                <span className="text-slate-200 text-sm">{isUz ? "AI Yordamchi (Cheksiz)" : "AIアシスタント（無制限）"}</span>
                                            </div>
                                        </div>

                                        <Link
                                            href={`/subscription/plans/${plan.id}`}
                                            className={`w-full py-4 text-center rounded-xl font-bold transition-all shadow-lg active:scale-95 duration-200 ${isUz
                                                ? "bg-blue-600 text-white hover:bg-blue-500 shadow-blue-900/50"
                                                : "bg-[#FE9B19] text-white hover:bg-orange-500 shadow-orange-900/50"
                                                }`}
                                        >
                                            {isUz ? "Tanlash" : "選択する"}
                                        </Link>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </div>
            </main>
            <Footer />
        </div>
    );
}
