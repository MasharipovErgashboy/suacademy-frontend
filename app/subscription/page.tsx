"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL, fetchWithAuth, isAuthenticated } from "../lib/auth";
import Header from "../components/Header";

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
            const response = await fetchWithAuth(`${BACKEND_URL}/subscription/plans/`);
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

    return (
        <div className="min-h-screen bg-[#FFF4E6]">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="text-center mb-16">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight">
                        {isUz ? "Premium Obuna" : "プレミアムサブスクリプション"}
                    </h1>
                    <p className="text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
                        {isUz
                            ? "Barcha darslarga cheklovsiz kirish huquqini qo'lga kiriting va yapon tilini tezroq o'rganing!"
                            : "全レッスンへの無制限アクセスを取得し、日本語をより早く学びましょう！"}
                    </p>
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
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
                        {plans.map((plan) => (
                            <div
                                key={plan.id}
                                className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 border border-white/50 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 flex flex-col items-center text-center relative overflow-hidden group"
                            >
                                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

                                <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30 transform group-hover:rotate-12 transition-transform duration-500 relative z-10">
                                    <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                                    </svg>
                                </div>

                                <h3 className="text-2xl font-bold text-slate-800 mb-2 relative z-10">{plan.name}</h3>

                                <div className="my-6 relative z-10">
                                    <span className="text-4xl font-black text-slate-900 tracking-tight">
                                        {formatPrice(plan.price, plan.currency)}
                                    </span>
                                </div>

                                <ul className="space-y-3 mb-8 text-slate-600 w-full relative z-10">
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>
                                            {plan.duration_days} {isUz ? "kunlik to'liq kirish" : "日間のフルアクセス"}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>
                                            {isUz ? "Barcha video darslar" : "全ビデオレッスン"}
                                        </span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <svg className="w-5 h-5 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                        </svg>
                                        <span>
                                            {isUz ? "Reklamasiz tomosha" : "広告なしで視聴"}
                                        </span>
                                    </li>
                                </ul>

                                <Link
                                    href={`/subscription/plans/${plan.id}`}
                                    className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors shadow-lg shadow-slate-900/20 active:scale-95 duration-200 relative z-10 block"
                                >
                                    {isUz ? "Tanlash" : "選択する"}
                                </Link>
                            </div>
                        ))}
                    </div>
                )}
            </main>
        </div>
    );
}
