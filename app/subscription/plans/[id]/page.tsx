"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { BACKEND_URL, fetchWithAuth, isAuthenticated } from "../../../lib/auth";
import Header from "../../../components/Header";
import Footer from "../../../components/Footer";

interface SubscriptionPlan {
    id: number;
    name: string;
    duration_days: number;
    price: number;
    currency: string;
    description?: string;
}

export default function PaymentPage() {
    const router = useRouter();
    const params = useParams();
    const id = params.id as string;

    const [plan, setPlan] = useState<SubscriptionPlan | null>(null);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState("");
    const [nationality, setNationality] = useState<string>("uz");

    const [success, setSuccess] = useState(false);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);

        fetchPlanDetail(id);
    }, [id, router]);

    const fetchPlanDetail = async (planId: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetchWithAuth(`${BACKEND_URL}/subscriptions/plans/${planId}/`);
            if (!response.ok) {
                if (response.status === 404) throw new Error("Tarif topilmadi");
                throw new Error("Ma'lumotlarni yuklashda xatolik");
            }
            const data = await response.json();
            setPlan(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handlePayment = async () => {
        if (!plan) return;

        setProcessing(true);
        setError("");

        try {
            const response = await fetchWithAuth(`${BACKEND_URL}/subscriptions/pay/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ plan_id: plan.id }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "To'lovda xatolik yuz berdi");
            }

            // Success!
            setSuccess(true);
            setTimeout(() => {
                router.push("/home");
            }, 3000);

        } catch (err: any) {
            setError(err.message);
        } finally {
            setProcessing(false);
        }
    };

    const isUz = nationality === "uz";

    const formatPrice = (price: number, currency: string) => {
        if (currency === "UZS") {
            return price.toLocaleString() + " so'm";
        }
        return "$" + price.toLocaleString();
    };

    if (success) {
        return (
            <div className="min-h-screen bg-green-50 flex items-center justify-center p-4">
                <div className="bg-white rounded-[2.5rem] p-12 shadow-2xl border border-green-100 max-w-lg w-full text-center animate-fade-in-up">
                    <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <svg className="w-12 h-12 text-green-600 animate-bounce" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                    </div>
                    <h2 className="text-3xl font-black text-slate-900 mb-4">
                        {isUz ? "To'lov muvaffaqiyatli!" : "支払い成功！"}
                    </h2>
                    <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                        {isUz
                            ? "Premium profilingiz aktivlashtirildi. Siz barcha darslardan foydalanishingiz mumkin."
                            : "プレミアムプロファイルが有効になりました。すべてのレッスンにアクセスできます。"}
                    </p>
                    <div className="flex items-center justify-center gap-2 text-slate-400 font-medium">
                        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>
                            {isUz ? "Bosh sahifaga yo'naltirilmoqda..." : "ホームにリダイレクト中..."}
                        </span>
                    </div>
                </div>
            </div>
        );
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF4E6] flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                </div>
            </div>
        );
    }

    if (!plan) {
        return (
            <div className="min-h-screen bg-[#FFF4E6] flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center max-w-md w-full">
                        <p className="text-red-600 font-bold text-lg mb-6">{error || "Tarif topilmadi"}</p>
                        <button
                            onClick={() => router.push("/subscription")}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            {isUz ? "Tariflarga qaytish" : "プランに戻る"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF4E6] flex flex-col">
            <Header />

            <div className="flex-1 flex items-center justify-center p-4">
                <div className="bg-white/70 backdrop-blur-xl rounded-[2.5rem] p-8 md:p-12 border border-white/50 shadow-2xl max-w-lg w-full relative overflow-hidden">

                    {/* Background blob */}
                    <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2"></div>

                    <div className="text-center mb-8 relative z-10">
                        <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                            <svg className="w-10 h-10 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <h1 className="text-3xl font-black text-slate-900 mb-2">
                            {plan.name}
                        </h1>
                        <p className="text-slate-500">
                            {isUz ? "To'lovni tasdiqlang" : "支払いを確認する"}
                        </p>
                    </div>

                    <div className="bg-slate-50 rounded-2xl p-6 mb-8 border border-slate-100 relative z-10">
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 border-dashed">
                            <span className="text-slate-600">{isUz ? "Tarif:" : "プラン:"}</span>
                            <span className="font-bold text-slate-900">{plan.name}</span>
                        </div>
                        <div className="flex justify-between items-center mb-4 pb-4 border-b border-slate-200 border-dashed">
                            <span className="text-slate-600">{isUz ? "Davomiyligi:" : "期間:"}</span>
                            <span className="font-bold text-slate-900">{plan.duration_days} {isUz ? "kun" : "日"}</span>
                        </div>
                        <div className="flex justify-between items-center text-lg">
                            <span className="font-bold text-slate-800">{isUz ? "Jami:" : "合計:"}</span>
                            <span className="font-black text-blue-600 text-2xl">
                                {formatPrice(plan.price, plan.currency)}
                            </span>
                        </div>
                    </div>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl text-center mb-6 text-sm font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    <button
                        onClick={handlePayment}
                        disabled={processing}
                        className={`w-full py-4 rounded-xl font-bold text-lg shadow-lg shadow-blue-600/20 transition-all duration-300 transform active:scale-95 relative overflow-hidden group ${processing
                            ? "bg-slate-300 text-slate-500 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700 hover:shadow-xl hover:-translate-y-1"
                            }`}
                    >
                        <span className="relative z-10 flex items-center justify-center gap-2">
                            {processing ? (
                                <>
                                    <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    {isUz ? "To'lov qilinmoqda..." : "処理中..."}
                                </>
                            ) : (
                                <>
                                    {isUz ? "Sotib olish" : "購入する"}
                                    <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                    </svg>
                                </>
                            )}
                        </span>
                    </button>

                    <button
                        onClick={() => router.back()}
                        disabled={processing}
                        className="w-full mt-4 py-3 text-slate-500 font-bold hover:text-slate-700 transition-colors"
                    >
                        {isUz ? "Bekor qilish" : "キャンセル"}
                    </button>

                </div>
            </div>
            <Footer />
        </div>
    );
}
