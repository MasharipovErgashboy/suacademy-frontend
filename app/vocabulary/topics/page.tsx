"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BACKEND_URL, fetchWithAuth, isAuthenticated } from "../../lib/auth";
import Link from "next/link";

interface Word {
    id: number;
    word: string;       // Japanese
    translation: string; // Uzbek
    audio: string | null;
}

interface Topic {
    id: number;
    title: string;
    slug: string;
    order: number;
    words_count?: number;
}

interface TopicDetail {
    topic: Topic;
    words: Word[];
}

export default function VocabularyDashboardPage() {
    const router = useRouter();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopicDetail, setSelectedTopicDetail] = useState<TopicDetail | null>(null);
    const [loadingTopics, setLoadingTopics] = useState(true);
    const [loadingDetail, setLoadingDetail] = useState(false);
    const [error, setError] = useState("");
    const [nationality, setNationality] = useState<string>("uz");
    const [searchQuery, setSearchQuery] = useState("");
    const [playingId, setPlayingId] = useState<number | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const wordsPerPage = 30;
    const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);

        fetchInitialData();
    }, [router]);

    const fetchInitialData = async () => {
        setLoadingTopics(true);
        setError("");
        try {
            const topicsRes = await fetchWithAuth(`${BACKEND_URL}/vocabulary/topics/`);
            if (!topicsRes.ok) throw new Error("Mavzularni yuklashda xatolik");
            const topicsData = await topicsRes.json();
            setTopics(topicsData);

            if (topicsData.length > 0) {
                fetchTopicDetail(topicsData[0].slug);
            }
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoadingTopics(false);
        }
    };

    const fetchTopicDetail = async (slug: string) => {
        setLoadingDetail(true);
        setCurrentPage(1); // Reset to first page
        try {
            const response = await fetchWithAuth(`${BACKEND_URL}/vocabulary/${slug}/`);
            if (!response.ok) throw new Error("Mavzu yuklanmadi");
            const data = await response.json();
            setSelectedTopicDetail(data);
        } catch (err: any) {
            console.error(err);
        } finally {
            setLoadingDetail(false);
        }
    };

    const playAudio = (wordId: number, audioUrl: string | null) => {
        if (!audioUrl) return;
        if (playingId !== null && audioRefs.current[playingId]) {
            audioRefs.current[playingId].pause();
            audioRefs.current[playingId].currentTime = 0;
        }
        if (!audioRefs.current[wordId]) {
            audioRefs.current[wordId] = new Audio(audioUrl);
            audioRefs.current[wordId].onended = () => setPlayingId(null);
        }
        setPlayingId(wordId);
        audioRefs.current[wordId].play();
    };

    const isUz = nationality === "uz";

    const filteredWords = selectedTopicDetail?.words?.filter(word =>
        word.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.word.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    // Pagination
    const totalPages = Math.ceil(filteredWords.length / wordsPerPage);
    const currentWords = filteredWords.slice(
        (currentPage - 1) * wordsPerPage,
        currentPage * wordsPerPage
    );

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col font-sans selection:bg-blue-100">
            <Header />

            <main className="flex-grow flex flex-col lg:flex-row max-w-[1500px] mx-auto w-full px-4 py-6 gap-6">

                {/* Column 1: Topics Sidebar (Compact) */}
                <div className="w-full lg:w-[280px] flex flex-col gap-6 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60">
                        <div className="mb-5 px-1">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                {isUz ? "Mavzular" : "トピック"}
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">
                                {isUz ? "Suhbat mavzulari" : "対話トピック"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 max-h-[450px] overflow-y-auto pr-1 custom-scrollbar">
                            {topics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => fetchTopicDetail(topic.slug)}
                                    className={`flex items-center gap-3 p-3 rounded-xl transition-all duration-200 text-left group ${selectedTopicDetail?.topic?.slug === topic.slug ? "bg-slate-900 text-white shadow-md shadow-slate-200" : "hover:bg-slate-50 text-slate-600"}`}
                                >
                                    <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-lg transition-all ${selectedTopicDetail?.topic?.slug === topic.slug ? "bg-white/10" : "bg-slate-50 group-hover:bg-blue-50"}`}>
                                        📖
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-[13px] truncate uppercase tracking-wide ${selectedTopicDetail?.topic?.slug === topic.slug ? "text-white" : "text-slate-800"}`}>
                                            {topic.title}
                                        </div>
                                        <div className={`text-[9px] font-black tracking-widest mt-0.5 ${selectedTopicDetail?.topic?.slug === topic.slug ? "text-white/40" : "text-slate-400"}`}>
                                            {topic.words_count} SO'Z
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-5 shadow-sm border border-slate-200/60">
                        <h3 className="text-lg font-black text-slate-800 mb-4 px-1">
                            {isUz ? "Vositalar" : "ツール"}
                        </h3>
                        <div className="flex flex-col gap-2">
                            <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-left group">
                                <span className="bg-blue-50 text-blue-600 w-9 h-9 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform shadow-sm">🔊</span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Talaffuz</span>
                            </button>
                            <button className="flex items-center gap-3 p-3 rounded-xl border border-slate-50 hover:border-orange-100 hover:bg-orange-50/30 transition-all text-left group">
                                <span className="bg-orange-50 text-orange-600 w-9 h-9 rounded-lg flex items-center justify-center text-lg group-hover:scale-105 transition-transform shadow-sm">✨</span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Kartalar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Column 2: Content Area (Table-based & Compact) */}
                <div className="flex-1 min-w-0 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-white rounded-[2rem] p-6 md:p-10 shadow-sm border border-slate-200/60 flex-grow relative overflow-hidden flex flex-col">
                        {loadingDetail ? (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-20 flex flex-col items-center justify-center">
                                <div className="w-10 h-10 border-3 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                            </div>
                        ) : null}

                        {!selectedTopicDetail ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-30">
                                <div className="text-5xl mb-4">🏔️</div>
                                <h3 className="text-xl font-black text-slate-900">Mavzu tanlanmagan</h3>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col">
                                <div className="mb-8 border-b border-slate-50 pb-6">
                                    <div className="flex items-center justify-between gap-4 mb-2">
                                        <h1 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tighter uppercase italic">
                                            {selectedTopicDetail.topic.title}
                                        </h1>
                                        <span className="px-3 py-1 bg-slate-900 text-white text-[10px] font-black rounded-lg">
                                            {filteredWords.length} TA SO'Z
                                        </span>
                                    </div>
                                    <p className="text-sm text-slate-400 font-bold max-w-xl">
                                        {isUz ? "Asosiy suhbatlar uchun zarur so'zlar va iboralar" : "対話に必要な重要な単語"}
                                    </p>
                                </div>

                                {/* Table Header */}
                                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-slate-50 rounded-xl mb-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                                    <div className="col-span-1">Tinglash</div>
                                    <div className="col-span-4 pl-2">Yaponcha</div>
                                    <div className="col-span-4">O'zbekcha</div>
                                    <div className="col-span-3 text-right">Talaffuz</div>
                                </div>

                                <div className="flex flex-col flex-grow divide-y divide-slate-50 overflow-y-auto">
                                    {currentWords.length > 0 ? (
                                        currentWords.map((word) => (
                                            <div
                                                key={word.id}
                                                className="grid grid-cols-12 gap-4 px-4 py-4 items-center hover:bg-slate-50 transition-colors border-b border-slate-50 group"
                                            >
                                                <div className="col-span-1">
                                                    <button
                                                        onClick={() => playAudio(word.id, word.audio)}
                                                        className={`w-9 h-9 rounded-lg flex items-center justify-center transition-all ${playingId === word.id ? "bg-green-500 text-white animate-pulse shadow-md" : "bg-white text-slate-300 group-hover:bg-slate-900 group-hover:text-white border border-slate-100"}`}
                                                    >
                                                        <svg className="w-5 h-5 ml-0.5" fill="currentColor" viewBox="0 0 20 20">
                                                            <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                        </svg>
                                                    </button>
                                                </div>
                                                <div className="col-span-4 pl-2 font-black text-slate-900 text-[15px] truncate">
                                                    {word.word}
                                                </div>
                                                <div className="col-span-4 font-bold text-slate-500 text-[14px] truncate">
                                                    {word.translation}
                                                </div>
                                                <div className="col-span-3 text-right text-[11px] font-black text-slate-300 italic uppercase">
                                                    {isUz ? word.word.split(' [')[1]?.replace(']', '') || '' : ''}
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center opacity-40">
                                            <div className="text-4xl mb-4">🔍</div>
                                            <p className="text-[10px] font-black tracking-widest uppercase">Hech narsa topilmadi</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-3 pt-8 border-t border-slate-50">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <div className="flex gap-2">
                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-9 h-9 rounded-lg text-xs font-black transition-all ${currentPage === i + 1 ? "bg-slate-900 text-white shadow-lg" : "bg-white border border-slate-100 text-slate-400 hover:border-slate-300"}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-2 rounded-lg border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                                            </svg>
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Compact Search/Info */}
                <div className="w-full lg:w-[320px] flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-200/60 h-full flex flex-col relative overflow-hidden group">

                        <div className="relative mb-8 z-10">
                            <input
                                type="text"
                                placeholder={isUz ? "Qidirish..." : "検索..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-11 pr-5 py-4 bg-slate-50 border border-slate-50 rounded-2xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white focus:border-slate-900/10 font-bold text-sm transition-all shadow-inner"
                            />
                            <svg className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-2 pb-6">
                            <div className="relative mb-8 transition-transform duration-700 hover:scale-105">
                                <div className="absolute inset-0 bg-blue-100/30 blur-[40px] rounded-full animate-pulse"></div>
                                <img
                                    src="/vocabulary-search.png"
                                    alt="Search Illustration"
                                    className="w-48 h-auto relative drop-shadow-xl"
                                />
                            </div>
                            <h4 className="text-lg font-black text-slate-800 mb-3 tracking-tight">Lug'atni Boyiting</h4>
                            <p className="text-[11px] text-slate-400 font-bold leading-relaxed">
                                {isUz
                                    ? "Qidirish va takrorlash orqali yanada professional darajaga chiqing."
                                    : "検索と復習を通じて、よりプロフェッショナルなレベルに到達しましょう。"}
                            </p>
                        </div>

                        <div className="absolute top-0 right-0 w-32 h-32 bg-slate-50/50 rounded-full blur-[60px] -translate-y-1/2 translate-x-1/2"></div>
                    </div>
                </div>

            </main>

            <Footer />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 4px;
                }
                .custom-scrollbar::-webkit-scrollbar-track {
                    background: transparent;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background: #F1F5F9;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #E2E8F0;
                }
            `}</style>
        </div>
    );
}
