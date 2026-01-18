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
        setCurrentPage(1);
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

        // If clicking the same word that is currently playing
        if (playingId === wordId) {
            if (audioRefs.current[wordId]) {
                audioRefs.current[wordId].pause();
                audioRefs.current[wordId].currentTime = 0;
            }
            setPlayingId(null);
            return;
        }

        // If another word is playing, stop it
        if (playingId !== null && audioRefs.current[playingId]) {
            audioRefs.current[playingId].pause();
            audioRefs.current[playingId].currentTime = 0;
        }

        // Play the new word
        if (!audioRefs.current[wordId]) {
            audioRefs.current[wordId] = new Audio(audioUrl);
            audioRefs.current[wordId].onended = () => setPlayingId(null);
        }
        setPlayingId(wordId);
        audioRefs.current[wordId].play();
    };

    const isUz = nationality === "uz";
    const primaryColorClass = isUz ? "blue-600" : "orange-600";
    const primaryBgClass = isUz ? "bg-blue-600" : "bg-orange-600";
    const primaryTextClass = isUz ? "text-blue-600" : "text-orange-600";
    const primaryBorderClass = isUz ? "border-blue-600" : "border-orange-600";
    const primaryFocusClass = isUz ? "focus:ring-blue-100 focus:border-blue-400" : "focus:ring-orange-100 focus:border-orange-400";
    const selectionColorClass = isUz ? "selection:bg-blue-100" : "selection:bg-orange-100";
    const themeShadow = isUz ? "shadow-blue-100" : "shadow-orange-100";

    const filteredWords = selectedTopicDetail?.words?.filter(word =>
        word.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.word.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    const totalPages = Math.ceil(filteredWords.length / wordsPerPage);
    const currentWords = filteredWords.slice(
        (currentPage - 1) * wordsPerPage,
        currentPage * wordsPerPage
    );

    return (
        <div className={`min-h-screen bg-[#F9FAFB] flex flex-col font-sans ${selectionColorClass}`}>
            <Header />

            <main className="flex-grow flex flex-col lg:flex-row max-w-[1500px] mx-auto w-full px-4 py-8 gap-8">

                {/* Column 1: Topics Sidebar */}
                <div className="w-full lg:w-[280px] flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60">
                        <div className="mb-6 px-1">
                            <h2 className="text-xl font-black text-slate-800 tracking-tight">
                                {isUz ? "Mavzular" : "トピック"}
                            </h2>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">
                                {isUz ? "Suhbat mavzulari" : "対話トピック"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1.5 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
                            {topics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => fetchTopicDetail(topic.slug)}
                                    className={`flex items-center gap-3 p-3.5 rounded-2xl transition-all duration-300 text-left group ${selectedTopicDetail?.topic?.slug === topic.slug ? `${primaryBgClass} text-white shadow-lg ${themeShadow}` : "hover:bg-slate-50 text-slate-600"}`}
                                >
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl transition-all ${selectedTopicDetail?.topic?.slug === topic.slug ? "bg-white/10" : `bg-slate-50 group-hover:bg-${isUz ? "blue" : "orange"}-50`}`}>
                                        📖
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-[13px] truncate uppercase tracking-wider ${selectedTopicDetail?.topic?.slug === topic.slug ? "text-white" : "text-slate-800"}`}>
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

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-200/60">
                        <h3 className="text-lg font-black text-slate-800 mb-5 px-1">
                            {isUz ? "Vositalar" : "ツール"}
                        </h3>
                        <div className="flex flex-col gap-3">
                            <button className={`flex items-center gap-3.5 p-4 rounded-2xl border border-slate-50 hover:border-${isUz ? "blue" : "orange"}-100 hover:bg-${isUz ? "blue" : "orange"}-50/30 transition-all text-left group`}>
                                <span className={`bg-${isUz ? "blue" : "orange"}-50 ${primaryTextClass} w-10 h-10 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-sm`}>🔊</span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Talaffuz</span>
                            </button>
                            <button className={`flex items-center gap-3.5 p-4 rounded-2xl border border-slate-50 hover:border-${isUz ? "orange" : "blue"}-100 hover:bg-${isUz ? "orange" : "blue"}-50/30 transition-all text-left group`}>
                                <span className={`bg-${isUz ? "orange" : "blue"}-50 text-${isUz ? "orange" : "blue"}-600 w-10 h-10 rounded-xl flex items-center justify-center text-xl group-hover:scale-105 transition-transform shadow-sm`}>✨</span>
                                <span className="text-[11px] font-black uppercase tracking-widest text-slate-600">Kartalar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Column 2: Content Area */}
                <div className="flex-1 min-w-0 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-6 duration-700">
                    <div className="bg-white rounded-[2.5rem] p-8 md:p-12 shadow-sm border border-slate-200/60 flex-grow relative overflow-hidden flex flex-col">
                        {loadingDetail ? (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-20 flex flex-col items-center justify-center">
                                <div className={`w-12 h-12 border-3 border-slate-100 border-t-${primaryColorClass} rounded-full animate-spin`}></div>
                            </div>
                        ) : null}

                        {!selectedTopicDetail ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-24 opacity-30">
                                <div className="text-6xl mb-6">🏔️</div>
                                <h3 className="text-2xl font-black text-slate-900">Mavzu tanlanmagan</h3>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col">
                                <div className="mb-10 text-center relative">
                                    <div className={`absolute top-0 left-1/2 -translate-x-1/2 w-24 h-24 bg-${isUz ? "blue" : "orange"}-50/50 rounded-full blur-3xl -z-10`}></div>
                                    <div className="flex flex-col items-center gap-3 mb-3">
                                        <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter uppercase italic">
                                            {selectedTopicDetail.topic.title}
                                        </h1>
                                        <span className={`${primaryBgClass} text-white text-[11px] font-black px-4 py-1.5 rounded-full shadow-lg ${themeShadow}/50 tracking-widest`}>
                                            {filteredWords.length} TA SO'Z
                                        </span>
                                    </div>
                                    <p className="text-[15px] text-slate-400 font-bold max-w-xl mx-auto italic">
                                        {isUz ? "Asosiy suhbatlar uchun eng zarur so'zlar va iboralar jamlanmasi" : "基本対話に必要な最重要単語"}
                                    </p>
                                </div>

                                {/* Word List */}
                                <div className="flex flex-col flex-grow overflow-y-auto pr-2 custom-scrollbar">
                                    {currentWords.length > 0 ? (
                                        currentWords.map((word) => (
                                            <div
                                                key={word.id}
                                                className="flex items-center gap-5 px-6 py-3.5 hover:bg-slate-50/60 transition-all group rounded-2xl mb-1"
                                            >
                                                <div className="flex-shrink-0">
                                                    <button
                                                        onClick={() => playAudio(word.id, word.audio)}
                                                        className={`w-10 h-10 rounded-xl flex items-center justify-center transition-all ${playingId === word.id ? `${primaryBgClass} text-white shadow-md ${themeShadow}` : `text-slate-400 hover:text-slate-600 hover:bg-white/80`}`}
                                                    >
                                                        {playingId === word.id ? (
                                                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                                            </svg>
                                                        ) : (
                                                            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                                                                <path d="M13.5 4.06c0-1.336-1.616-2.005-2.56-1.06l-4.5 4.5H4.508c-1.141 0-2.066.925-2.066 2.065v3.868c0 1.14.925 2.065 2.066 2.065H6.44l4.5 4.5c.944.945 2.56.276 2.56-1.06V4.06zM18.57 12.006c0-1.272-.612-2.404-1.562-3.124-.34-.257-.841-.183-1.091.144-.25.328-.184.821.143 1.071.558.423.91.1.085.91 1.91 0 1.273-.612 2.404-1.562 3.124-.327.25-.393.743-.143 1.071.25.327.751.4.1.091.144.95.72 1.562 1.852 1.562 3.124z" />
                                                            </svg>
                                                        )}
                                                    </button>
                                                </div>

                                                <div className="flex-grow flex items-center justify-between min-w-0">
                                                    <div className="flex items-center gap-4 min-w-0">
                                                        <span className="text-[20px] font-medium text-slate-800 truncate">
                                                            {word.word.split('[')[0].trim()}
                                                        </span>
                                                        <span className="text-slate-300 font-light text-xl">—</span>
                                                        <span className="text-[18px] font-normal text-slate-500 truncate">
                                                            {word.translation}
                                                        </span>
                                                    </div>

                                                    <div className="flex items-center gap-8 flex-shrink-0">
                                                        <span className="text-[14px] font-medium text-slate-400 min-w-[80px] text-right">
                                                            {word.word.includes('[') ? word.word.split('[')[1]?.replace(']', '') : ''}
                                                        </span>
                                                        <span className="px-4 py-1.5 bg-slate-100/80 text-slate-500 text-[12px] font-bold rounded-full group-hover:bg-slate-200/50 transition-colors">
                                                            {selectedTopicDetail.topic.title}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-24 text-center opacity-40">
                                            <div className="text-5xl mb-6">🔍</div>
                                            <p className="text-xs font-black tracking-[0.3em] uppercase">Hech narsa topilmadi</p>
                                        </div>
                                    )}
                                </div>

                                {/* Pagination Controls */}
                                {totalPages > 1 && (
                                    <div className="flex items-center justify-center gap-4 pt-10 border-t border-slate-50 mt-6">
                                        <button
                                            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                                            disabled={currentPage === 1}
                                            className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
                                            </svg>
                                        </button>
                                        <div className="flex gap-2.5">
                                            {Array.from({ length: totalPages }).map((_, i) => (
                                                <button
                                                    key={i + 1}
                                                    onClick={() => setCurrentPage(i + 1)}
                                                    className={`w-11 h-11 rounded-xl text-sm font-black transition-all ${currentPage === i + 1 ? `${primaryBgClass} text-white shadow-xl ${themeShadow}` : "bg-white border border-slate-100 text-slate-400 hover:border-slate-300"}`}
                                                >
                                                    {i + 1}
                                                </button>
                                            ))}
                                        </div>
                                        <button
                                            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                                            disabled={currentPage === totalPages}
                                            className="p-3 rounded-xl border border-slate-100 text-slate-400 hover:bg-slate-50 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
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

                {/* Column 3: Redesigned Search Panel */}
                <div className="w-full lg:w-[320px] flex flex-col gap-6 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="bg-white rounded-[2.5rem] p-8 shadow-2xl shadow-slate-200/10 border border-slate-200/60 h-full flex flex-col relative overflow-hidden group">

                        <div className="relative mb-10 z-10 scale-[1.02]">
                            <div className={`absolute inset-0 ${primaryBgClass} blur-[20px] opacity-10 rounded-3xl -z-10 group-focus-within:opacity-20 transition-opacity`}></div>
                            <input
                                type="text"
                                placeholder={isUz ? "Qidiruv..." : "検索..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className={`w-full pl-12 pr-6 py-5 bg-white border border-slate-100 rounded-[1.7rem] focus:outline-none focus:ring-4 ${primaryFocusClass} font-bold text-sm transition-all shadow-sm group-focus-within:shadow-md`}
                            />
                            <svg className={`w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:${primaryTextClass} transition-colors`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center z-10 px-2 pb-10">
                            <div className="relative mb-12 transition-transform duration-1000 group-hover:scale-110">
                                <div className={`absolute inset-0 bg-${isUz ? "blue" : "orange"}-100/40 blur-[50px] rounded-full animate-pulse`}></div>
                                <img
                                    src="/vocabulary-search.png"
                                    alt="Search Illustration"
                                    className="w-52 h-auto relative drop-shadow-[0_20px_50px_rgba(0,0,0,0.1)]"
                                />
                            </div>
                            <h4 className="text-xl font-black text-slate-800 mb-4 tracking-tight">Lug'atni Boyiting</h4>
                            <p className="text-[12px] text-slate-400 font-bold leading-relaxed max-w-[200px] mx-auto">
                                {isUz
                                    ? "Qidirish va takrorlash orqali yangi marralarni zabt eting."
                                    : "検索と復習を通じて、新しい目標を達成しましょう。"}
                            </p>

                            <button className={`mt-10 w-full py-4.5 rounded-[1.5rem] ${primaryBgClass} text-white font-black text-xs uppercase tracking-[0.2em] shadow-xl ${themeShadow} transition-all hover:scale-[1.04] active:scale-[0.98] hover:shadow-2xl`}>
                                {isUz ? "Hozir Boshlang" : "今すぐ開始"}
                            </button>
                        </div>

                        {/* Abstract background elements */}
                        <div className={`absolute -top-10 -right-10 w-48 h-48 bg-${isUz ? "blue" : "orange"}-50/50 rounded-full blur-[90px] opacity-60`}></div>
                        <div className={`absolute -bottom-20 -left-20 w-56 h-56 bg-slate-50 rounded-full blur-[100px]`}></div>
                        <div className={`absolute top-1/2 left-0 w-1 p-10 h-32 ${primaryBgClass} blur-[60px] opacity-10`}></div>
                    </div>
                </div>

            </main>

            <Footer />

            <style jsx>{`
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
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
