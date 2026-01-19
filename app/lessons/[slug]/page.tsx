"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import confetti from "canvas-confetti";

const ReactPlayer = dynamic(() => import("react-player/lazy"), { ssr: false });
import { BACKEND_URL, fetchWithAuth, isAuthenticated } from "../../lib/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

interface Lesson {
    id: number;
    title: string;
    slug: string;
    order: number;
    is_free: boolean;
    is_locked: boolean;
    image: string | null;
}

interface LessonDetail extends Lesson {
    description: string;
    youtube_url: string | null;
    youtube_id?: string | null;
    reviews?: any[];
}

interface LessonResponse {
    current_lesson: LessonDetail;
    lessons: Lesson[];
    is_premium: boolean;
}

export default function LessonDetailPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const [lessonData, setLessonData] = useState<LessonResponse | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [nationality, setNationality] = useState<string>("uz");
    const [shopwFinishModal, setShowFinishModal] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [rating, setRating] = useState(1);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);

        fetchLessonDetail(slug);

        // Listen for user profile updates from Header
        const handleUserUpdate = () => {
            fetchLessonDetail(slug);
        };

        window.addEventListener("user-updated", handleUserUpdate);
        return () => window.removeEventListener("user-updated", handleUserUpdate);
    }, [slug, router]);

    // Scroll active lesson into view in sidebar
    useEffect(() => {
        if (lessonData && sidebarRef.current) {
            const activeElement = sidebarRef.current.querySelector('[data-active="true"]');
            if (activeElement) {
                activeElement.scrollIntoView({ behavior: "smooth", block: "center" });
            }
        }
    }, [lessonData]);

    const fetchLessonDetail = async (lessonSlug: string) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetchWithAuth(`${BACKEND_URL}/lessons/${lessonSlug}/`);
            if (!response.ok) {
                if (response.status === 404) throw new Error("Dars topilmadi");
                if (response.status === 403) throw new Error("Bu darsni ko'rish uchun premium obuna kerak");
                throw new Error("Ma'lumotlarni yuklashda xatolik");
            }
            const data = await response.json();
            setLessonData(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFinishLesson = () => {
        confetti({
            particleCount: 150,
            spread: 70,
            origin: { y: 0.6 },
            colors: ['#FFD700', '#FFA500', '#ff0000', '#00ff00', '#0000ff']
        });
        setShowFinishModal(true);
    };

    const submitFinish = async () => {
        if (!lessonData) return;
        setIsSubmitting(true);

        try {
            // POST /lessons/finished/
            const payload: any = {
                lesson_id: lessonData.current_lesson.id,
                comment: comment
            };
            if (rating > 0) {
                payload.rating = rating;
            }

            const response = await fetchWithAuth(`${BACKEND_URL}/lessons/finished/`, {
                method: "POST",
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                let errData;
                try {
                    errData = await response.json();
                } catch (jsonErr) {
                    const text = await response.text();
                    console.error("Non-JSON error response:", response.status, text);
                    throw new Error(`Server error: ${response.status}`);
                }
                console.error("Backend validation error:", errData);
                throw new Error(errData.detail || JSON.stringify(errData) || "Validation failed");
            }
            // Show success message
            setShowSuccess(true);
            setTimeout(() => {
                setShowFinishModal(false);
                setShowSuccess(false);
            }, 3000);

        } catch (e) {
            console.error(e);
            alert("Xatolik yuz berdi");
        } finally {
            setIsSubmitting(false);
        }
    };

    const isUz = nationality === "uz";

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

    if (error || !lessonData) {
        return (
            <div className="min-h-screen bg-[#FFF4E6] flex flex-col">
                <Header />
                <div className="flex-1 flex flex-col items-center justify-center p-4">
                    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center max-w-md w-full">
                        <p className="text-red-600 font-bold text-lg mb-6">{error || "Xatolik yuz berdi"}</p>
                        <button
                            onClick={() => router.push("/lessons/videos")}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold hover:bg-slate-800 transition-colors"
                        >
                            {isUz ? "Darslarga qaytish" : "レッスンに戻る"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { current_lesson, lessons } = lessonData;

    return (
        <div className="min-h-screen bg-[#FFF4E6] flex flex-col">
            <Header />

            <div className="flex-1 max-w-[1600px] w-full mx-auto p-4 md:p-6 lg:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 h-[calc(100vh-140px)] min-h-[600px]">

                    {/* LEFT SIDE - VIDEO PLAYER */}
                    <div className="lg:col-span-2 flex flex-col h-full overflow-y-auto pr-2 custom-scrollbar">
                        {/* Video Container */}
                        <div className="bg-black rounded-3xl overflow-hidden shadow-2xl aspect-video mb-6 relative group">
                            {current_lesson.is_locked ? (
                                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-900/80 backdrop-blur-sm text-center p-6 z-10">
                                    <div className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 backdrop-blur-md border border-white/20">
                                        <svg className="w-10 h-10 text-white/50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                    <h3 className="text-2xl font-bold text-white mb-2">
                                        {isUz ? "Bu dars Premium a'zolar uchun" : "このレッスンはプレミアム会員限定です"}
                                    </h3>
                                    <p className="text-slate-400 mb-8 max-w-md">
                                        {isUz
                                            ? "To'liq kirish huquqini olish uchun obuna bo'ling va barcha darslardan foydalaning."
                                            : "全レッスンにアクセスするには、プレミアム会員に登録してください。"}
                                    </p>
                                    <Link
                                        href="/subscription"
                                        className="px-8 py-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white font-bold rounded-xl shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform"
                                    >
                                        {isUz ? "Premiumga o'tish" : "プレミアム会員登録"}
                                    </Link>
                                </div>
                            ) : current_lesson.youtube_id ? (
                                <div className="relative w-full h-full group">
                                    <ReactPlayer
                                        url={`https://www.youtube.com/watch?v=${current_lesson.youtube_id}`}
                                        width="100%"
                                        height="100%"
                                        controls={true}
                                        playing={true}
                                        light={
                                            <div className="absolute inset-0 bg-slate-900 flex items-center justify-center cursor-pointer group">
                                                <img
                                                    src={current_lesson.image || `https://img.youtube.com/vi/${current_lesson.youtube_id}/maxresdefault.jpg`}
                                                    alt={current_lesson.title}
                                                    className="w-full h-full object-cover opacity-60 group-hover:opacity-40 transition-opacity duration-500"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                                                    }}
                                                />
                                                <div className="absolute inset-0 flex items-center justify-center">
                                                    <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full flex items-center justify-center border border-white/40 shadow-2xl transition-all duration-300 group-hover:scale-110 group-hover:bg-blue-600/90 group-hover:border-transparent">
                                                        <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M6.3 2.841A.7.7 0 017 2.5a.7.7 0 01.442.159l8.4 6.3a.7.7 0 010 1.082l-8.4 6.3A.7.7 0 016.3 15.659V2.841z" />
                                                        </svg>
                                                    </div>
                                                </div>
                                                <div className="absolute bottom-6 left-6 right-6">
                                                    <h3 className="text-white text-xl font-bold line-clamp-1 drop-shadow-md">{current_lesson.title}</h3>
                                                </div>
                                            </div>
                                        }
                                        playIcon={<></>} // We implement our own in the light prop
                                        config={{
                                            youtube: {
                                                playerVars: {
                                                    modestbranding: 1,
                                                    rel: 0,
                                                    showinfo: 0,
                                                    iv_load_policy: 3
                                                }
                                            }
                                        }}
                                    />
                                </div>
                            ) : (
                                <div className="absolute inset-0 flex items-center justify-center bg-slate-900 text-slate-500">
                                    <p>{isUz ? "Video topilmadi" : "ビデオが見つかりません"}</p>
                                </div>
                            )}
                        </div>

                        {/* Title & Description & Finish Button */}
                        <div className="bg-white/60 backdrop-blur-xl rounded-3xl p-8 border border-white/50 shadow-lg">
                            <div className="flex justify-between items-start mb-6">
                                <div>
                                    <div className="flex items-center gap-3 mb-4">
                                        <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                            {isUz ? `${current_lesson.order}-dars` : `第${current_lesson.order}課`}
                                        </span>
                                        {current_lesson.is_free ? (
                                            <span className="px-3 py-1 bg-green-100 text-green-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                                {isUz ? "BEPUL" : "無料"}
                                            </span>
                                        ) : (
                                            <span className="px-3 py-1 bg-amber-100 text-amber-600 text-xs font-bold rounded-lg uppercase tracking-wider">
                                                PREMIUM
                                            </span>
                                        )}
                                    </div>

                                    <h1 className="text-3xl font-black text-slate-900 leading-tight">
                                        {current_lesson.title}
                                    </h1>
                                </div>

                                {/* Finish Button */}
                                {!current_lesson.is_locked && (
                                    <button
                                        onClick={handleFinishLesson}
                                        className="px-6 py-3 bg-green-500 hover:bg-green-600 text-white font-bold rounded-xl shadow-lg shadow-green-500/30 transform transition-all hover:-translate-y-1 active:translate-y-0"
                                    >
                                        {isUz ? "Darsni tugatdim" : "レッスン完了"}
                                    </button>
                                )}
                            </div>

                            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
                                {current_lesson.description || (
                                    <p className="italic opacity-60">
                                        {isUz ? "Izoh mavjud emas" : "説明はありません"}
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* RIGHT SIDE - SIDEBAR LIST */}
                    <div className="lg:col-span-1 h-full flex flex-col bg-white/60 backdrop-blur-xl rounded-3xl border border-white/50 shadow-xl overflow-hidden">
                        <div className="p-6 border-b border-slate-100 bg-white/50 backdrop-blur-md sticky top-0 z-10">
                            <h2 className="text-xl font-bold text-slate-900 flex items-center gap-2">
                                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                {isUz ? "Darslar ro'yxati" : "レッスン一覧"}
                            </h2>
                            <p className="text-sm text-slate-500 mt-1">
                                {lessons.length} {isUz ? "ta dars" : "レッスン"}
                            </p>
                        </div>

                        <div ref={sidebarRef} className="flex-1 overflow-y-auto p-4 custom-scrollbar space-y-3">
                            {lessons.map((lesson) => {
                                const isActive = lesson.id === current_lesson.id;
                                return (
                                    <Link
                                        key={lesson.id}
                                        href={`/lessons/${lesson.slug}`}
                                        data-active={isActive}
                                        className={`flex items-start gap-4 p-3 rounded-2xl transition-all duration-300 group ${isActive
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30 scale-[1.02]"
                                            : "bg-white hover:bg-blue-50 text-slate-600 border border-transparent hover:border-blue-100"
                                            }`}
                                    >
                                        <div className="relative w-24 aspect-video rounded-lg overflow-hidden flex-shrink-0 bg-slate-200">
                                            <img
                                                src={lesson.image || `https://img.youtube.com/vi/${lesson.slug}/mqdefault.jpg`}
                                                alt={lesson.title}
                                                className={`w-full h-full object-cover transition-transform duration-500 ${!isActive && "group-hover:scale-110"}`}
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                                                }}
                                            />
                                            {lesson.is_locked && (
                                                <div className="absolute inset-0 bg-slate-900/60 flex items-center justify-center">
                                                    <svg className="w-5 h-5 text-white/80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                            )}
                                            {isActive && (
                                                <div className="absolute inset-0 flex items-center justify-center bg-blue-600/20 backdrop-blur-[1px]">
                                                    <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm animate-pulse">
                                                        <div className="w-2.5 h-2.5 bg-blue-600 rounded-full"></div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>

                                        <div className="flex-1 min-w-0 py-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className={`text-[10px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded ${isActive
                                                    ? "bg-white/20 text-white"
                                                    : "bg-slate-100 text-slate-500"
                                                    }`}>
                                                    #{lesson.order}
                                                </span>
                                                {!lesson.is_free && (
                                                    <svg className={`w-3 h-3 ${isActive ? "text-amber-300" : "text-amber-500"}`} fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                )}
                                            </div>
                                            <h4 className={`text-sm font-bold line-clamp-2 leading-snug ${isActive ? "text-white" : "text-slate-700 group-hover:text-blue-600"
                                                }`}>
                                                {lesson.title}
                                            </h4>
                                        </div>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>

                </div>
            </div>

            {/* Completion Modal */}
            {shopwFinishModal && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => !isSubmitting && setShowFinishModal(false)}></div>
                    <div className="bg-white rounded-3xl p-8 max-w-sm w-full relative z-10 shadow-2xl animate-bounce-in text-center overflow-hidden">

                        {!showSuccess ? (
                            <>
                                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4 animate-scale-in">
                                    <span className="text-4xl">🎉</span>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">{isUz ? "Tabriklaymiz!" : "おめでとうございます！"}</h3>
                                <p className="text-slate-500 mb-6">{isUz ? "Siz ushbu darsni muvaffaqiyatli yakunladingiz." : "このレッスンを正常に完了しました。"}</p>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase">{isUz ? "Darsni baholang" : "レッスンを評価する"}</label>
                                    <div className="flex justify-center gap-2">
                                        {[1, 2, 3, 4, 5].map((star) => {
                                            const isSelected = rating >= star;
                                            const isNext = rating + 1 === star;
                                            return (
                                                <button
                                                    key={star}
                                                    onClick={() => setRating(star)}
                                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-2xl transition-all duration-300 
                                                        ${isSelected ? 'scale-110 grayscale-0' : 'grayscale opacity-40'}
                                                        ${isNext ? 'animate-pulse scale-105 opacity-70' : ''}
                                                        hover:scale-125 hover:grayscale-0 hover:opacity-100
                                                    `}
                                                >
                                                    ⭐
                                                </button>
                                            )
                                        })}
                                    </div>
                                </div>

                                <div className="mb-6">
                                    <label className="block text-sm font-bold text-slate-400 mb-2 uppercase text-left">{isUz ? "Izoh (ixtiyoriy)" : "コメント (任意)"}</label>
                                    <textarea
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        className="w-full p-4 rounded-xl bg-slate-50 border-2 border-slate-100 focus:border-blue-500 outline-none resize-none text-slate-700 font-medium animate-border-pulse focus:animate-none transition-colors"
                                        rows={3}
                                        placeholder={isUz ? "Dars haqida fikringiz..." : "レッスンについての感想..."}
                                    ></textarea>
                                </div>

                                <button
                                    onClick={submitFinish}
                                    disabled={isSubmitting}
                                    className={`w-full py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 hover:scale-[1.02] active:scale-95 transition-all ${isSubmitting ? "opacity-70 cursor-wait" : ""}`}
                                >
                                    {isSubmitting ? "..." : (isUz ? "Saqlash" : "保存")}
                                </button>
                            </>
                        ) : (
                            <div className="py-8 animate-scale-in">
                                <div className="w-24 h-24 bg-gradient-to-tr from-green-400 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl shadow-green-500/40 animate-bounce">
                                    <svg className="w-12 h-12 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                </div>
                                <h3 className="text-2xl font-black text-slate-800 mb-2">{isUz ? "E'tiboringiz uchun rahmat!" : "ありがとうございました！"}</h3>
                                <p className="text-slate-500 font-medium">
                                    {isUz ? "Sizning fikringiz biz uchun muhim." : "あなたのフィードバックは重要です。"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            )}

            <style jsx global>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 6px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: rgba(15, 23, 42, 0.1);
                    border-radius: 20px;
                }
                .custom-scrollbar:hover::-webkit-scrollbar-thumb {
                    background-color: rgba(15, 23, 42, 0.2);
                }
                @keyframes bounce-in {
                    0% { transform: scale(0.9); opacity: 0; }
                    50% { transform: scale(1.05); }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-bounce-in {
                    animation: bounce-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes scale-in {
                    0% { transform: scale(0); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-scale-in {
                    animation: scale-in 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
                }
                @keyframes border-pulse {
                    0% { border-color: #f1f5f9; }
                    50% { border-color: #3b82f6; }
                    100% { border-color: #f1f5f9; }
                }
                .animate-border-pulse {
                    animation: border-pulse 2s infinite;
                }
            `}</style>
            <Footer />
        </div>
    );
}
