"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { API_BASE_URL } from "../lib/auth";

export default function ForgotPasswordPage() {
    const [nationality, setNationality] = useState<string>("uz");
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);
    }, []);

    const content = {
        uz: {
            title: "Parolni unutdingizmi?",
            subtitle: "Emailingizni kiriting, biz sizga tiklash havolasini yuboramiz",
            emailLabel: "Email manzili",
            emailPlaceholder: "example@mail.com",
            sendButton: "Havolani yuborish",
            backToLogin: "Loginga qaytish",
            successTitle: "Havola yuborildi!",
            successMessage: "Emailingizni tekshiring, biz sizga parolni tiklash bo'yicha ko'rsatmalarni yubordik.",
            errorGeneric: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
        },
        ja: {
            title: "パスワードをお忘れですか？",
            subtitle: "メールアドレスを入力してください。再設定リンクをお送りします。",
            emailLabel: "メールアドレス",
            emailPlaceholder: "example@mail.com",
            sendButton: "リンクを送信",
            backToLogin: "ログインに戻る",
            successTitle: "リンクを送信しました！",
            successMessage: "メールを確認してください。パスワード再設定の手順を送信しました。",
            errorGeneric: "エラーが発生しました。もう一度お試しください。",
        },
    };

    const t = content[nationality as keyof typeof content];
    const isUz = nationality === "uz";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/forgot-password/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": nationality,
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || data.detail || t.errorGeneric);
            }

            setSuccess(true);
        } catch (err: any) {
            setError(err.message || t.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen relative flex items-center justify-center p-4 overflow-hidden ${isUz ? "bg-blue-50" : "bg-rose-50"}`}>
            {/* Live Animated Vibrant Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {isUz ? (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[100px] animate-blob"></div>
                        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-[-10%] left-[20%] w-[55%] h-[55%] bg-sky-400/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
                    </>
                ) : (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-400/20 rounded-full blur-[100px] animate-blob"></div>
                        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-rose-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                        <div className="absolute bottom-[-10%] left-[20%] w-[55%] h-[55%] bg-amber-400/20 rounded-full blur-[100px] animate-blob animation-delay-4000"></div>
                    </>
                )}
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8 animate-in fade-in zoom-in duration-700">
                    <Link href="/" className="inline-block">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
                            <span className={isUz ? "text-blue-600" : "text-rose-600"}>SU</span>{" "}
                            <span className="text-slate-900">Academy</span>
                        </h1>
                    </Link>
                </div>

                <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 border border-white/40 animate-in slide-in-from-bottom-8 duration-700">
                    {!success ? (
                        <>
                            <div className="mb-8">
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.title}</h2>
                                <p className="text-slate-600">{t.subtitle}</p>
                            </div>

                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-2xl text-red-600 text-sm animate-in fade-in slide-in-from-top-2 duration-300">
                                    <div className="flex items-center gap-2 font-medium">
                                        <svg className="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                        {error}
                                    </div>
                                </div>
                            )}

                            <form onSubmit={handleSubmit} className="space-y-6">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 px-1">
                                        {t.emailLabel}
                                    </label>
                                    <input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder={t.emailPlaceholder}
                                        className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all placeholder:text-slate-400 text-slate-900"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading}
                                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${loading
                                        ? "bg-slate-400 cursor-not-allowed"
                                        : isUz
                                            ? "bg-gradient-to-r from-blue-600 to-indigo-600 hover:shadow-blue-500/25 hover:scale-[1.02]"
                                            : "bg-gradient-to-r from-rose-500 to-orange-500 hover:shadow-rose-500/25 hover:scale-[1.02]"
                                        }`}
                                >
                                    {loading ? (
                                        <div className="flex items-center justify-center gap-2">
                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                        </div>
                                    ) : (
                                        t.sendButton
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-6 animate-in zoom-in duration-500">
                            <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 ${isUz ? "bg-blue-100" : "bg-rose-100"}`}>
                                <svg className={`w-10 h-10 ${isUz ? "text-blue-600" : "text-rose-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-2xl font-bold text-slate-900 mb-2">{t.successTitle}</h2>
                            <p className="text-slate-600 mb-8">{t.successMessage}</p>
                            <Link
                                href="/login"
                                className={`inline-block px-8 py-3 rounded-xl font-bold text-white transition-all ${isUz ? "bg-blue-600 hover:bg-blue-700" : "bg-rose-500 hover:bg-rose-600"}`}
                            >
                                {t.backToLogin}
                            </Link>
                        </div>
                    )}

                    <div className="mt-8 pt-6 border-t border-slate-100 text-center">
                        <Link
                            href="/login"
                            className={`text-sm font-semibold transition-colors ${isUz ? "text-blue-600 hover:text-blue-700" : "text-rose-600 hover:text-rose-700"}`}
                        >
                            {t.backToLogin}
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}
