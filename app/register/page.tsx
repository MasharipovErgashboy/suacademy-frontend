"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL, isAuthenticated } from "../lib/auth";
import JapaneseLiveBackground from "../components/backgrounds/JapaneseLiveBackground";
import UzbekLiveBackground from "../components/backgrounds/UzbekLiveBackground";

export default function RegisterPage() {
    const router = useRouter();
    const [nationality, setNationality] = useState<string>("uz");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (isAuthenticated()) {
            router.push("/home");
            return;
        }

        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);
    }, [router]);

    const content = {
        uz: {
            title: "Ro'yxatdan o'tish",
            subtitle: "Yangi hisob yarating",
            usernameLabel: "Foydalanuvchi nomi",
            usernamePlaceholder: "username",
            emailLabel: "Email",
            emailPlaceholder: "sizning@email.com",
            passwordLabel: "Parol",
            passwordPlaceholder: "••••••••",
            confirmPasswordLabel: "Parolni tasdiqlang",
            confirmPasswordPlaceholder: "••••••••",
            registerButton: "Ro'yxatdan o'tish",
            hasAccount: "Hisobingiz bormi?",
            login: "Kirish",
            backToHome: "Bosh sahifaga qaytish",
        },
        ja: {
            title: "登録",
            subtitle: "新しいアカウントを作成",
            usernameLabel: "ユーザー名",
            usernamePlaceholder: "username",
            emailLabel: "メール",
            emailPlaceholder: "your@email.com",
            passwordLabel: "パスワード",
            passwordPlaceholder: "••••••••",
            confirmPasswordLabel: "パスワードを確認",
            confirmPasswordPlaceholder: "••••••••",
            registerButton: "登録",
            hasAccount: "アカウントをお持ちですか？",
            login: "ログイン",
            backToHome: "トップページに戻る",
        },
    };

    const t = content[nationality as keyof typeof content];
    const isUz = nationality === "uz";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");

        if (password !== confirmPassword) {
            setError(isUz ? "Parollar mos kelmadi" : "パスワードが一致しません");
            return;
        }

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": nationality,
                },
                body: JSON.stringify({ username, email, password, nationality }),
            });

            let data;
            try {
                data = await response.json();
            } catch (parseError) {
                throw new Error(
                    isUz
                        ? "Server bilan bog'lanishda xatolik. Iltimos, qayta urinib ko'ring."
                        : "サーバーとの接続エラー。もう一度お試しください。"
                );
            }

            if (!response.ok) {
                let errorMessage = data.error || data.detail || (isUz ? "Ro'yxatdan o'tishda xatolik yuz berdi" : "登録中にエラーが発生しました");
                throw new Error(errorMessage);
            }

            localStorage.setItem("pending_email", email);
            router.push("/verify-otp");
        } catch (err: any) {
            setError(err.message || (isUz ? "Xatolik yuz berdi" : "エラーが発生しました"));
        } finally {
            setLoading(false);
        }
    };



    return (
        <div className="min-h-screen relative flex items-center justify-center p-4 overflow-hidden">
            {/* Live Animated Background */}
            {isUz ? <JapaneseLiveBackground /> : <UzbekLiveBackground />}


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

                    <form onSubmit={handleSubmit} className="space-y-5">
                        {/* Username */}
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                {t.usernameLabel}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className={`h-5 w-5 text-slate-400 group-focus-within:text-${isUz ? "blue" : "rose"}-500 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                </div>
                                <input
                                    type="text"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    placeholder={t.usernamePlaceholder}
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Email */}
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                {t.emailLabel}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className={`h-5 w-5 text-slate-400 group-focus-within:text-${isUz ? "blue" : "rose"}-500 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder={t.emailPlaceholder}
                                    required
                                    className="w-full pl-11 pr-4 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 shadow-sm"
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                {t.passwordLabel}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className={`h-5 w-5 text-slate-400 group-focus-within:text-${isUz ? "blue" : "rose"}-500 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    placeholder={t.passwordPlaceholder}
                                    required
                                    className="w-full pl-11 pr-12 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 shadow-sm"
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

                        {/* Confirm Password */}
                        <div className="group">
                            <label className="block text-sm font-bold text-slate-700 mb-2 ml-1">
                                {t.confirmPasswordLabel}
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <svg className={`h-5 w-5 text-slate-400 group-focus-within:text-${isUz ? "blue" : "rose"}-500 transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                    </svg>
                                </div>
                                <input
                                    type={showConfirmPassword ? "text" : "password"}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    placeholder={t.confirmPasswordPlaceholder}
                                    required
                                    className="w-full pl-11 pr-12 py-4 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-400 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all duration-300 shadow-sm"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                    className="absolute inset-y-0 right-0 pr-4 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                                >
                                    {showConfirmPassword ? (
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

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className={`w-full relative group overflow-hidden bg-gradient-to-r ${isUz
                                ? "from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/30"
                                : "from-rose-600 to-orange-600 hover:from-rose-500 hover:to-orange-500 shadow-rose-500/30"
                                } text-white font-bold py-4 rounded-2xl shadow-xl transition-all transform hover:-translate-y-1 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed`}
                        >
                            <span className="relative z-10 flex items-center justify-center gap-2">
                                {loading ? (
                                    <>
                                        <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                                        </svg>
                                        <span>{isUz ? "Yuklanmoqda..." : "読み込み中..."}</span>
                                    </>
                                ) : (
                                    t.registerButton
                                )}
                            </span>
                        </button>
                    </form>

                    <div className="mt-8 text-center border-t border-slate-100 pt-6">
                        <p className="text-slate-600 font-medium">
                            {t.hasAccount}{" "}
                            <Link href="/login" className={`${isUz ? "text-blue-600" : "text-rose-600"} hover:underline font-bold transition-all`}>
                                {t.login}
                            </Link>
                        </p>
                    </div>
                </div>

                <div className="mt-8 text-center">
                    <Link href="/" className="text-slate-500 hover:text-slate-900 font-bold inline-flex items-center gap-2 transition-all hover:gap-3 group">
                        <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                        {t.backToHome}
                    </Link>
                </div>
            </div>

            <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite alternate ease-in-out;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
        </div>
    );
}
