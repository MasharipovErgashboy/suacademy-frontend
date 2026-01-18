"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { API_BASE_URL } from "../lib/auth";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const token = searchParams.get("token");

    const [nationality, setNationality] = useState<string>("uz");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);

        if (!token) {
            setError(nationality === "uz" ? "Tiklash tokeni topilmadi." : "再設定トークンが見つかりません。");
        }
    }, [token, nationality]);

    const content = {
        uz: {
            title: "Yangi parol o'rnating",
            subtitle: "Hisobingiz uchun yangi xavfsiz parol tanlang",
            passwordLabel: "Yangi parol",
            confirmPasswordLabel: "Parolni tasdiqlang",
            passwordPlaceholder: "••••••••",
            resetButton: "Parolni yangilash",
            successTitle: "Muvaffaqiyatli!",
            successMessage: "Parolingiz muvaffaqiyatli yangilandi. Endi yangi parolingiz bilan kirishingiz mumkin.",
            loginButton: "Kirish sahifasiga o'tish",
            errorGeneric: "Xatolik yuz berdi. Iltimos, qayta urinib ko'ring.",
            passwordMismatch: "Parollar mos kelmadi.",
        },
        ja: {
            title: "新しいパスワードを設定",
            subtitle: "アカウントの新しい安全なパスワードを選択してください",
            passwordLabel: "新しいパスワード",
            confirmPasswordLabel: "パスワードの確認",
            passwordPlaceholder: "••••••••",
            resetButton: "パスワードを更新",
            successTitle: "成功しました！",
            successMessage: "パスワードが正常に更新されました。新しいパスワードでログインできます。",
            loginButton: "ログイン画面へ",
            errorGeneric: "エラーが発生しました。もう一度お試しください。",
            passwordMismatch: "パスワードが一致しません。",
        },
    };

    const t = content[nationality as keyof typeof content];
    const isUz = nationality === "uz";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError(t.passwordMismatch);
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/password-reset-confirm/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": nationality,
                    "Token": token || "",
                },
                body: JSON.stringify({ password }),
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.error || data.detail || t.errorGeneric);
            }

            setSuccess(true);
            setTimeout(() => {
                router.push("/login");
            }, 3000);
        } catch (err: any) {
            setError(err.message || t.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={`min-h-screen relative flex items-center justify-center p-4 overflow-hidden ${isUz ? "bg-blue-50" : "bg-rose-50"}`}>
            {/* Live Animated Background */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {isUz ? (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-blue-400/20 rounded-full blur-[100px] animate-blob"></div>
                        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-indigo-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                    </>
                ) : (
                    <>
                        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] bg-orange-400/20 rounded-full blur-[100px] animate-blob"></div>
                        <div className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] bg-rose-400/20 rounded-full blur-[100px] animate-blob animation-delay-2000"></div>
                    </>
                )}
            </div>

            <div className="relative z-10 w-full max-w-md">
                <div className="text-center mb-8">
                    <Link href="/" className="inline-block">
                        <h1 className="text-5xl md:text-6xl font-bold tracking-tighter">
                            <span className={isUz ? "text-blue-600" : "text-rose-600"}>SU</span>{" "}
                            <span className="text-slate-900">Academy</span>
                        </h1>
                    </Link>
                </div>

                <div className="bg-white/70 backdrop-blur-2xl rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.05)] p-8 border border-white/40">
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
                                <div className="group">
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                                        {t.passwordLabel}
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            placeholder={t.passwordPlaceholder}
                                            className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.046m4.532-4.532A10.05 10.05 0 0112 5c4.477 0 8.268 2.943 9.542 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21m-4.225-4.225l-4.225-4.225m0 0l-1.103-1.103m0 0L4 4m6.352 1.648L8.352 8.352m2.41 1.761l1.238 1.238" />
                                                </svg>
                                            ) : (
                                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 12-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2 ml-1">
                                        {t.confirmPasswordLabel}
                                    </label>
                                    <input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder={t.passwordPlaceholder}
                                        className="w-full px-5 py-4 bg-white/50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || !token}
                                    className={`w-full py-4 rounded-2xl font-bold text-white shadow-lg transition-all active:scale-[0.98] ${loading || !token
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
                                        t.resetButton
                                    )}
                                </button>
                            </form>
                        </>
                    ) : (
                        <div className="text-center py-10 animate-in zoom-in duration-500">
                            <div className="relative w-32 h-32 mx-auto mb-8">
                                <div className={`absolute inset-0 rounded-full animate-ping opacity-20 ${isUz ? "bg-blue-400" : "bg-rose-400"}`}></div>
                                <div className={`relative w-32 h-32 rounded-full flex items-center justify-center shadow-xl ${isUz ? "bg-blue-500" : "bg-rose-500"}`}>
                                    <svg className="w-16 h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={4} d="M5 13l4 4L19 7" className="animate-draw-check" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-3xl font-black text-slate-900 mb-4">
                                {isUz ? "Parolingiz yangilandi!" : "パスワードが更新されました！"}
                            </h2>
                            <p className="text-lg text-slate-600 mb-10 max-w-[280px] mx-auto">
                                {isUz
                                    ? "Siz 3 soniyadan so'ng login sahifasiga yo'naltirilasiz."
                                    : "3秒後にログインページにリダイレクトされます。"}
                            </p>

                            {/* Countdown Progress Bar */}
                            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden mb-8">
                                <div className={`h-full animate-progress-shrink ${isUz ? "bg-blue-500" : "bg-rose-500"}`}></div>
                            </div>

                            <Link
                                href="/login"
                                className={`inline-flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white transition-all shadow-lg hover:scale-105 ${isUz ? "bg-blue-600 hover:bg-blue-700 shadow-blue-500/25" : "bg-rose-500 hover:bg-rose-600 shadow-rose-500/25"}`}
                            >
                                <span>{t.loginButton}</span>
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                                </svg>
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    );
}
