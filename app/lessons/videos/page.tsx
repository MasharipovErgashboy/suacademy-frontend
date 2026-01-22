"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
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

interface PaginationData {
    count: number;
    next: string | null;
    previous: string | null;
}

function VideoLessonsContent() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const page = parseInt(searchParams.get("page") || "1");

    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [pagination, setPagination] = useState<PaginationData | null>(null);
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

        fetchLessons(page);
    }, [page, router]);

    const fetchLessons = async (pageNum: number) => {
        setLoading(true);
        setError("");
        try {
            const response = await fetchWithAuth(`${BACKEND_URL}/lessons/list/?page=${pageNum}`);
            if (!response.ok) {
                throw new Error("Ma'lumotlarni yuklashda xatolik yuz berdi");
            }
            const data = await response.json();
            setLessons(data.results);
            setPagination({
                count: data.count,
                next: data.next,
                previous: data.previous
            });
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const isUz = nationality === "uz";
    const totalPages = pagination ? Math.ceil(pagination.count / 10) : 1;

    const handlePageChange = (newPage: number) => {
        router.push(`/lessons/videos?page=${newPage}`);
    };

    return (
        <div className="min-h-screen bg-[#FFF4E6]">
            <Header />

            <main className="max-w-7xl mx-auto px-4 py-12">
                <div className="mb-12 text-center">
                    <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
                        {isUz ? "Video Darslar" : "ビデオレッスン"}
                    </h1>
                    <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                        {isUz
                            ? "Japoniya hayoti va tili haqidagi eng qiziqarli darslarni o'rganing"
                            : "日本の生活と言語に関する最も興味深いレッスンを学びましょう"}
                    </p>
                </div>

                {loading ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                        <p className="text-slate-500 font-medium">
                            {isUz ? "Yuklanmoqda..." : "読み込み中..."}
                        </p>
                    </div>
                ) : error ? (
                    <div className="bg-red-50 border border-red-100 p-8 rounded-3xl text-center">
                        <p className="text-red-600 font-bold text-lg mb-4">{error}</p>
                        <button
                            onClick={() => fetchLessons(page)}
                            className="px-6 py-2 bg-red-600 text-white rounded-xl font-bold hover:bg-red-700 transition-colors"
                        >
                            {isUz ? "Qayta urinish" : "再試行"}
                        </button>
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                            {lessons.map((lesson) => (
                                <Link
                                    key={lesson.id}
                                    href={`/lessons/${lesson.slug}`}
                                    className="group relative bg-white/70 backdrop-blur-xl rounded-[2rem] overflow-hidden border border-white/40 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className="aspect-video relative overflow-hidden bg-slate-200">
                                        <img
                                            src={lesson.image || `https://img.youtube.com/vi/${lesson.slug}/maxresdefault.jpg`}
                                            alt={lesson.title}
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                            onError={(e) => {
                                                (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&q=80";
                                            }}
                                        />
                                        <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                                        {lesson.is_locked && (
                                            <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm">
                                                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-md border border-white/30">
                                                    <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}

                                        <div className="absolute top-4 left-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-xs font-bold text-slate-900 shadow-sm">
                                            {isUz ? `${lesson.order}-dars` : `第${lesson.order}課`}
                                        </div>

                                        {!lesson.is_locked && (
                                            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                                <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center shadow-lg shadow-blue-500/40 transform scale-0 group-hover:scale-100 transition-transform duration-500 delay-100">
                                                    <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M6.3 2.841A.7.7 0 017 2.5a.7.7 0 01.442.159l8.4 6.3a.7.7 0 010 1.082l-8.4 6.3A.7.7 0 016.3 15.659V2.841z" />
                                                    </svg>
                                                </div>
                                            </div>
                                        )}
                                    </div>

                                    <div className="p-8">
                                        <div className="flex items-center gap-2 mb-3">
                                            {lesson.is_free ? (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-600 text-[10px] uppercase font-black rounded tracking-wider">
                                                    {isUz ? "BEPUL" : "無料"}
                                                </span>
                                            ) : (
                                                <span className="px-2 py-0.5 bg-amber-100 text-amber-600 text-[10px] uppercase font-black rounded tracking-wider">
                                                    {isUz ? "PREMIUM" : "プレミアム"}
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-900 mb-2 leading-tight group-hover:text-blue-600 transition-colors line-clamp-2">
                                            {lesson.title}
                                        </h3>
                                    </div>
                                </Link>
                            ))}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="flex items-center justify-center gap-2 mt-12 pb-12">
                                <button
                                    onClick={() => handlePageChange(page - 1)}
                                    disabled={!pagination?.previous}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${pagination?.previous
                                        ? "bg-white border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600"
                                        : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                                    </svg>
                                </button>

                                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => handlePageChange(p)}
                                        className={`w-12 h-12 rounded-2xl font-bold transition-all ${page === p
                                            ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30"
                                            : "bg-white border border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600"
                                            }`}
                                    >
                                        {p}
                                    </button>
                                ))}

                                <button
                                    onClick={() => handlePageChange(page + 1)}
                                    disabled={!pagination?.next}
                                    className={`w-12 h-12 rounded-2xl flex items-center justify-center border transition-all ${pagination?.next
                                        ? "bg-white border-slate-200 text-slate-600 hover:border-blue-500 hover:text-blue-600"
                                        : "bg-slate-100 border-slate-100 text-slate-300 cursor-not-allowed"
                                        }`}
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </button>
                            </div>
                        )}
                    </>
                )}
            </main>
            <Footer />
        </div>
    );
}

export default function VideoLessonsPage() {
    return (
        <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-slate-50">Loading...</div>}>
            <VideoLessonsContent />
        </Suspense>
    );
}

