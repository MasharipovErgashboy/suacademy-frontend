"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BACKEND_URL, fetchWithAuth, isAuthenticated } from "../../lib/auth";
import Link from "next/link";

interface Word {
    id: number;
    word: string;       // Japanese based on nationality check in backend
    translation: string; // Uzbek based on nationality check in backend
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

    return (
        <div className="min-h-screen bg-[#FDFCFB] flex flex-col font-sans selection:bg-blue-100">
            <Header />

            <main className="flex-grow flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full px-6 py-10 gap-10">

                {/* Column 1: Topics Sidebar */}
                <div className="w-full lg:w-[340px] flex flex-col gap-10 animate-in fade-in slide-in-from-left-6 duration-700">
                    <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
                        <div className="mb-8">
                            <h2 className="text-2xl font-black text-slate-800 tracking-tight">
                                {isUz ? "Lug'at Mavzulari" : "語彙トピック"}
                            </h2>
                            <p className="text-sm font-bold text-slate-400 mt-1">
                                {isUz ? "Suhbat mavzusi bo'yicha ko'rish" : "トピック別に表示"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {topics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => fetchTopicDetail(topic.slug)}
                                    className={`flex items-center gap-4 p-5 rounded-2xl transition-all duration-300 text-left group ${selectedTopicDetail?.topic?.slug === topic.slug ? "bg-slate-900 text-white shadow-xl shadow-slate-200" : "hover:bg-slate-50 text-slate-600"}`}
                                >
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition-all duration-500 ${selectedTopicDetail?.topic?.slug === topic.slug ? "bg-white/10" : "bg-slate-50 grayscale group-hover:grayscale-0 group-hover:bg-blue-50"}`}>
                                        📖
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold text-sm truncate uppercase tracking-wide ${selectedTopicDetail?.topic?.slug === topic.slug ? "text-white" : "text-slate-800"}`}>
                                            {topic.title}
                                        </div>
                                        <div className={`text-[10px] font-black tracking-widest mt-0.5 ${selectedTopicDetail?.topic?.slug === topic.slug ? "text-white/40" : "text-slate-400"}`}>
                                            {topic.words_count} {isUz ? "TA SO'Z" : "単語"}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80">
                        <h3 className="text-xl font-black text-slate-800 mb-6">
                            {isUz ? "O'rganish Vositalari" : "学習ツール"}
                        </h3>
                        <div className="flex flex-col gap-4">
                            <button className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-blue-100 hover:bg-blue-50/30 transition-all text-left text-slate-700 font-bold group">
                                <span className="bg-blue-50 text-blue-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">🔊</span>
                                <span className="text-sm uppercase tracking-wide">Talaffuz Mashqi</span>
                            </button>
                            <button className="flex items-center gap-4 p-4 rounded-2xl border border-slate-50 hover:border-orange-100 hover:bg-orange-50/30 transition-all text-left text-slate-700 font-bold group">
                                <span className="bg-orange-50 text-orange-600 w-12 h-12 rounded-xl flex items-center justify-center text-xl group-hover:scale-110 transition-transform shadow-sm">✨</span>
                                <span className="text-sm uppercase tracking-wide">Flashkardlar</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Column 2: Content Area */}
                <div className="flex-1 min-w-0 flex flex-col gap-8 animate-in fade-in slide-in-from-bottom-8 duration-700">
                    <div className="bg-white rounded-[2.5rem] p-10 md:p-16 shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100/80 flex-grow relative overflow-hidden">
                        {loadingDetail ? (
                            <div className="absolute inset-0 bg-white/70 backdrop-blur-md z-20 flex flex-col items-center justify-center">
                                <div className="w-14 h-14 border-4 border-slate-100 border-t-slate-900 rounded-full animate-spin"></div>
                            </div>
                        ) : null}

                        {!selectedTopicDetail ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20 opacity-40">
                                <div className="text-7xl mb-6">🏔️</div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Mavzu tanlanmagan</h3>
                            </div>
                        ) : (
                            <div className="h-full flex flex-col">
                                <div className="mb-14">
                                    <h1 className="text-4xl md:text-6xl font-black text-slate-900 mb-4 tracking-tighter uppercase italic">
                                        {selectedTopicDetail.topic.title}
                                    </h1>
                                    <p className="text-xl text-slate-400 font-bold">
                                        {isUz ? "Asosiy suhbatlar uchun zarur so'zlar va iboralar" : "対話に必要な重要な単語と表現"}
                                    </p>

                                    <div className="flex gap-4 mt-10">
                                        <button className="px-8 py-3 rounded-2xl bg-slate-900 text-white font-black text-xs uppercase tracking-widest shadow-xl shadow-slate-200">Barcha So'zlar</button>
                                        <button className="px-8 py-3 rounded-2xl bg-slate-50 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-slate-600 transition-all">Grammatika</button>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-grow divide-y divide-slate-50">
                                    {filteredWords.length > 0 ? (
                                        filteredWords.map((word, idx) => (
                                            <div
                                                key={word.id}
                                                className="group py-8 flex items-center gap-8 hover:bg-slate-50/50 hover:px-6 transition-all duration-500 rounded-3xl animate-in fade-in slide-in-from-bottom-4"
                                                style={{ animationDelay: `${idx * 50}ms`, animationFillMode: 'both' }}
                                            >
                                                <button
                                                    onClick={() => playAudio(word.id, word.audio)}
                                                    className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-300 shadow-sm ${playingId === word.id ? "bg-green-500 text-white animate-pulse" : "bg-white text-slate-300 group-hover:bg-slate-900 group-hover:text-white group-hover:shadow-lg group-hover:shadow-slate-200 border border-slate-100"}`}
                                                >
                                                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                    </svg>
                                                </button>

                                                <div className="flex-1 flex flex-col md:flex-row md:items-center gap-2 md:gap-8">
                                                    <div className="text-2xl md:text-4xl font-black text-slate-900 tracking-tight">
                                                        {word.word}
                                                    </div>
                                                    <div className="hidden md:block text-slate-200 text-4xl font-thin group-hover:text-blue-200 transition-colors">—</div>
                                                    <div className="text-xl md:text-2xl font-bold text-slate-500 group-hover:text-slate-800 transition-colors">
                                                        {word.translation}
                                                    </div>
                                                </div>

                                                <div className="hidden xl:flex items-center gap-12">
                                                    <span className="px-4 py-1.5 bg-blue-50 text-blue-600 text-[10px] font-black uppercase rounded-lg tracking-widest border border-blue-100/50">
                                                        {isUz ? "O'rganyapman" : "学習中"}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-24 text-center">
                                            <div className="text-5xl mb-6">🔍</div>
                                            <p className="text-slate-300 font-black tracking-widest uppercase text-xs">Hech narsa topilmadi</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Column 3: Search Panel */}
                <div className="w-full lg:w-[400px] flex flex-col gap-10 animate-in fade-in slide-in-from-right-6 duration-700">
                    <div className="bg-white rounded-[2.5rem] p-10 shadow-[0_8px_40px_rgb(0,0,0,0.03)] border border-slate-100/80 group flex flex-col h-full relative overflow-hidden">

                        <div className="relative mb-14 z-10">
                            <input
                                type="text"
                                placeholder={isUz ? "Lug'atdan qidirish..." : "言葉を検索..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-14 pr-8 py-6 bg-slate-50 border border-slate-50 rounded-3xl focus:outline-none focus:ring-4 focus:ring-slate-900/5 focus:bg-white focus:border-slate-900/10 font-bold text-lg transition-all shadow-inner"
                            />
                            <svg className="w-7 h-7 absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-slate-900 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex-1 flex flex-col items-center justify-center text-center z-10">
                            <div className="relative mb-10 transform group-hover:scale-110 transition-transform duration-700">
                                <div className="absolute inset-0 bg-blue-100/20 blur-[60px] rounded-full scale-150 animate-pulse"></div>
                                <img
                                    src="https://cdni.iconscout.com/illustration/premium/thumb/searching-4034250-3336210.png"
                                    alt="Search Illustration"
                                    className="w-72 h-auto relative drop-shadow-2xl"
                                />
                            </div>
                            <h4 className="text-2xl font-black text-slate-800 mb-4 tracking-tight">Qidiruv va Kengaytirish</h4>
                            <p className="text-slate-400 font-bold leading-relaxed max-w-[280px]">
                                {isUz
                                    ? "Yangi so'zlarni qidirish orqali xotirangizni yanada mustahkamlang va boyiting."
                                    : "新しい単語をより速く記憶し、語彙を増やしましょう。"}
                            </p>
                        </div>

                        {/* Abstract background elements */}
                        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-50/50 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/2"></div>
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
                    border-radius: 20px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #E2E8F0;
                }
            `}</style>
        </div>
    );
}
