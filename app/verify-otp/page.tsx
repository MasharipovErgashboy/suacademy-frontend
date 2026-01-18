"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { API_BASE_URL, saveTokens, saveUser, isAuthenticated } from "../lib/auth";

export default function VerifyOTPPage() {
    const router = useRouter();
    const [nationality, setNationality] = useState<string>("uz");
    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [resending, setResending] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (isAuthenticated()) {
            router.push("/home");
            return;
        }

        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);

        const pendingEmail = localStorage.getItem("pending_email");
        if (!pendingEmail) {
            router.push("/register");
            return;
        }
        setEmail(pendingEmail);
    }, [router]);

    const content = {
        uz: {
            title: "Email tasdiqlash",
            subtitle: "Emailingizga yuborilgan 6 raqamli kodni kiriting",
            otpLabel: "Tasdiqlash kodi",
            otpPlaceholder: "123456",
            verifyButton: "Tasdiqlash",
            resendButton: "Qayta yuborish",
            resendSuccess: "Kod qayta yuborildi!",
            errorNotFound: "Foydalanuvchi topilmadi",
            errorInvalid: "OTP noto'g'ri yoki eskirgan",
            errorGeneric: "Xatolik yuz berdi",
            successTitle: "Muvaffaqiyatli!",
            successDesc: "Emailingiz tasdiqlandi! 3 sekunddan so'ng login sahifasiga yo'naltirilasiz...",
            back: "Orqaga",
        },
        ja: {
            title: "メール確認",
            subtitle: "メールに送信された6桁のコードを入力してください",
            otpLabel: "確認コード",
            otpPlaceholder: "123456",
            verifyButton: "確認",
            resendButton: "再送信",
            resendSuccess: "コードが再送信されました！",
            errorNotFound: "ユーザーが見つかりません",
            errorInvalid: "コードが正しくないか、期限切れです",
            errorGeneric: "エラーが発生しました",
            successTitle: "成功！",
            successDesc: "メールが確認されました！3秒後にログインページに移動します...",
            back: "戻る",
        },
    };

    const t = content[nationality as keyof typeof content];
    const isUz = nationality === "uz";

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/verify-otp/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": nationality,
                },
                body: JSON.stringify({ email, code: otp }),
            });

            let data;
            try {
                data = await response.json();
            } catch (p) {
                throw new Error(t.errorGeneric);
            }

            if (!response.ok) {
                let msg = data.error || data.detail || t.errorGeneric;
                if (response.status === 404) msg = t.errorNotFound;
                else if (response.status === 400 || msg.includes("noto")) msg = t.errorInvalid;
                throw new Error(msg);
            }

            // SUCCESS FLOW
            setIsSuccess(true);
            localStorage.removeItem("pending_email");

            setTimeout(() => {
                router.push("/login");
            }, 3000);

        } catch (err: any) {
            setError(err.message || t.errorGeneric);
        } finally {
            setLoading(false);
        }
    };

    const handleResend = async () => {
        setResending(true);
        setError("");

        try {
            const response = await fetch(`${API_BASE_URL}/register/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Accept-Language": nationality,
                },
                body: JSON.stringify({ email, resend: true }),
            });

            if (!response.ok) {
                throw new Error(t.errorGeneric);
            }

            alert(t.resendSuccess);
        } catch (err: any) {
            setError(err.message || t.errorGeneric);
        } finally {
            setResending(false);
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
                    {isSuccess ? (
                        <div className="text-center py-8 animate-in zoom-in duration-500">
                            <div className={`w-24 h-24 rounded-full flex items-center justify-center mx-auto mb-6 ${isUz ? "bg-blue-500/10" : "bg-rose-500/10"
                                }`}>
                                <svg className={`w-12 h-12 ${isUz ? "text-blue-600" : "text-rose-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-4">{t.successTitle}</h2>
                            <p className="text-slate-600 leading-relaxed max-w-[280px] mx-auto font-medium">{t.successDesc}</p>

                            <div className="mt-8 flex justify-center">
                                <div className="w-16 h-1 bg-slate-100 rounded-full overflow-hidden">
                                    <div className={`h-full animate-progress ${isUz ? "bg-blue-600" : "bg-rose-600"
                                        }`}></div>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className="mb-8 text-center">
                                <div className={`w-20 h-20 rounded-[2rem] flex items-center justify-center mx-auto mb-4 ${isUz ? "bg-blue-600/10" : "bg-rose-600/10"
                                    }`}>
                                    <svg className={`w-10 h-10 ${isUz ? "text-blue-600" : "text-rose-600"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <h2 className="text-3xl font-bold text-slate-900 mb-2">{t.title}</h2>
                                <p className="text-slate-600">{t.subtitle}</p>
                                <p className={`text-sm mt-2 font-bold ${isUz ? "text-blue-600" : "text-rose-600"}`}>{email}</p>
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
                                    <label className="block text-sm font-bold text-slate-700 mb-2 text-center uppercase tracking-wider">
                                        {t.otpLabel}
                                    </label>
                                    <input
                                        type="text"
                                        value={otp}
                                        onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                                        placeholder={t.otpPlaceholder}
                                        required
                                        maxLength={6}
                                        className="w-full px-4 py-5 bg-white/50 border border-slate-200 rounded-2xl text-slate-900 placeholder-slate-300 focus:bg-white focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 outline-none transition-all text-center text-4xl font-extrabold tracking-[0.4em] duration-300 shadow-sm"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={loading || otp.length !== 6}
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
                                            t.verifyButton
                                        )}
                                    </span>
                                </button>

                                <button
                                    type="button"
                                    onClick={handleResend}
                                    disabled={resending}
                                    className="w-full text-slate-500 hover:text-slate-900 font-bold py-2 transition-colors disabled:opacity-50"
                                >
                                    {resending ? (isUz ? "Yuborilmoqda..." : "送信中...") : t.resendButton}
                                </button>
                            </form>
                        </>
                    )}
                </div>

                {!isSuccess && (
                    <div className="mt-8 text-center">
                        <Link href="/register" className="text-slate-500 hover:text-slate-900 font-bold inline-flex items-center gap-2 transition-all hover:gap-3 group">
                            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            {t.back}
                        </Link>
                    </div>
                )}
            </div>

            <style jsx global>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        @keyframes progress {
          from { width: 0%; }
          to { width: 100%; }
        }
        .animate-blob {
          animation: blob 7s infinite alternate ease-in-out;
        }
        .animate-progress {
          animation: progress 3s linear forwards;
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
