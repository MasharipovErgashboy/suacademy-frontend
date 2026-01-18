"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import { BACKEND_URL, fetchWithAuth, isAuthenticated } from "../../lib/auth";
import Link from "next/link";

interface Word {
    id: number;
    ja_kanji: string;
    ja_kana: string;
    ja_romaji: string;
    translation: string;
    description: string;
    audio: string | null;
}

interface Topic {
    id: number;
    name: string;
    description: string;
    slug: string;
    icon: string;
    word_count: number;
    words?: Word[];
}

export default function VocabularyDashboardPage() {
    const router = useRouter();
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<Topic | null>(null);
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
            // Get topics list
            const topicsRes = await fetchWithAuth(`${BACKEND_URL}/vocabulary/topics/`);
            if (!topicsRes.ok) throw new Error("Mavzularni yuklashda xatolik");
            const topicsData = await topicsRes.json();
            setTopics(topicsData);

            // Fetch default topic or first one
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
            setSelectedTopic(data);
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

    const filteredWords = selectedTopic?.words?.filter(word =>
        word.translation.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.ja_kanji.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.ja_kana.toLowerCase().includes(searchQuery.toLowerCase()) ||
        word.ja_romaji.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

    return (
        <div className="min-h-screen bg-[#F8FAFC] flex flex-col font-sans">
            <Header />

            <main className="flex-grow flex flex-col lg:flex-row max-w-[1600px] mx-auto w-full px-4 py-8 gap-8">

                {/* Column 1: Sidebar (Topics) */}
                <div className="w-full lg:w-80 flex flex-col gap-8 animate-in fade-in slide-in-from-left-4 duration-700">
                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100 h-fit">
                        <div className="mb-6 px-2">
                            <h2 className="text-2xl font-black text-slate-900 leading-tight">
                                {isUz ? "Lug'at Mavzulari" : "語彙トピック"}
                            </h2>
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mt-1">
                                {isUz ? "Suhbat mavzusi bo'yicha ko'rish" : "対話トピック別に表示"}
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                            {topics.map((topic) => (
                                <button
                                    key={topic.id}
                                    onClick={() => fetchTopicDetail(topic.slug)}
                                    className={`flex items-center gap-4 p-4 rounded-2xl transition-all text-left group ${selectedTopic?.slug === topic.slug ? "bg-blue-600 text-white shadow-lg shadow-blue-200" : "hover:bg-slate-50 text-slate-600"}`}
                                >
                                    <span className={`text-2xl transition-transform group-hover:scale-110 ${selectedTopic?.slug === topic.slug ? "" : "grayscale opacity-70 group-hover:grayscale-0 group-hover:opacity-100"}`}>
                                        {topic.icon || "📚"}
                                    </span>
                                    <div className="flex-1 min-w-0">
                                        <div className={`font-bold truncate ${selectedTopic?.slug === topic.slug ? "text-white" : "text-slate-800"}`}>
                                            {topic.name}
                                        </div>
                                        <div className={`text-[10px] font-black uppercase tracking-tighter ${selectedTopic?.slug === topic.slug ? "text-white/60" : "text-slate-400"}`}>
                                            {topic.word_count} {isUz ? "ta so'z" : "単語"}
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white rounded-[2rem] p-6 shadow-sm border border-slate-100">
                        <div className="mb-6 px-2">
                            <h3 className="text-xl font-black text-slate-900 leading-tight">
                                {isUz ? "O'rganish Vositalari" : "学習ツール"}
                            </h3>
                        </div>
                        <div className="flex flex-col gap-3">
                            <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-blue-200 hover:bg-blue-50/50 transition-all text-left text-slate-700 font-bold group">
                                <span className="bg-blue-100 text-blue-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">🔊</span>
                                {isUz ? "Talaffuz Mashqi" : "発音練習"}
                            </button>
                            <button className="flex items-center gap-4 p-4 rounded-xl border border-slate-100 hover:border-orange-200 hover:bg-orange-50/50 transition-all text-left text-slate-700 font-bold group">
                                <span className="bg-orange-100 text-orange-600 w-10 h-10 rounded-lg flex items-center justify-center text-xl group-hover:scale-110 transition-transform">✨</span>
                                {isUz ? "Flashkard To'plami" : "フラッシュカード"}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Column 2: Content (Words List) */}
                <div className="flex-1 min-w-0 flex flex-col gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
                    <div className="bg-white rounded-[2rem] p-8 md:p-12 shadow-sm border border-slate-100 flex-grow relative overflow-hidden">
                        {loadingDetail ? (
                            <div className="absolute inset-0 bg-white/60 backdrop-blur-sm z-20 flex flex-col items-center justify-center">
                                <div className="w-12 h-12 border-4 border-blue-100 border-t-blue-600 rounded-full animate-spin"></div>
                            </div>
                        ) : null}

                        {!selectedTopic ? (
                            <div className="h-full flex flex-col items-center justify-center text-center py-20">
                                <div className="text-6xl mb-6">🏜️</div>
                                <h3 className="text-2xl font-black text-slate-900 mb-2">Mavzu tanlanmagan</h3>
                                <p className="text-slate-500 font-bold">Iltimos, chap tomondan mavzu tanlang.</p>
                            </div>
                        ) : (
                            <>
                                <div className="mb-10">
                                    <h1 className="text-3xl md:text-5xl font-black text-slate-900 mb-2 tracking-tight">
                                        {selectedTopic.name}
                                    </h1>
                                    <p className="text-lg text-slate-500 font-medium">
                                        {selectedTopic.description}
                                    </p>

                                    <div className="flex gap-2 mt-8">
                                        <button className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm">Barcha So'zlar</button>
                                        <button className="px-6 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-bold text-sm hover:bg-slate-200 transition-all">
                                            {selectedTopic?.name?.split(' ')[0] || "Mavzu"}
                                        </button>
                                    </div>
                                </div>

                                <div className="flex flex-col divide-y divide-slate-50">
                                    {filteredWords.length > 0 ? (
                                        filteredWords.map((word) => (
                                            <div key={word.id} className="group py-6 flex items-center gap-6 hover:px-2 transition-all duration-300">
                                                <button
                                                    onClick={() => playAudio(word.id, word.audio)}
                                                    className={`w-12 h-12 rounded-xl flex items-center justify-center transition-all ${playingId === word.id ? "bg-green-500 text-white animate-pulse" : "bg-slate-100 text-slate-400 group-hover:bg-slate-900 group-hover:text-white"}`}
                                                >
                                                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
                                                        <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                    </svg>
                                                </button>

                                                <div className="flex-1 flex flex-col md:flex-row md:items-baseline gap-2 md:gap-4">
                                                    <div className="text-xl md:text-2xl font-black text-slate-800">
                                                        {word.ja_kanji || word.ja_kana}
                                                    </div>
                                                    <div className="text-slate-300 font-black">—</div>
                                                    <div className="text-lg md:text-xl font-bold text-slate-600">
                                                        {word.translation}
                                                    </div>
                                                </div>

                                                <div className="hidden md:flex items-center gap-8">
                                                    <div className="text-sm font-black text-slate-300 italic uppercase">
                                                        {word.ja_romaji}
                                                    </div>
                                                    <span className="px-3 py-1 bg-slate-100 text-slate-500 text-[10px] font-black uppercase rounded-lg tracking-wider">
                                                        {selectedTopic.name}
                                                    </span>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <div className="py-20 text-center">
                                            <div className="text-4xl mb-4">🔍</div>
                                            <p className="text-slate-400 font-black tracking-widest uppercase text-sm">Hech narsa topilmadi</p>
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Column 3: Search & Extras */}
                <div className="w-full lg:w-96 flex flex-col gap-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <div className="bg-white rounded-[2rem] p-10 shadow-sm border border-slate-100 flex-grow relative overflow-hidden group">
                        <div className="relative mb-12">
                            <input
                                type="text"
                                placeholder={isUz ? "Lug'atdan qidirish..." : "言葉を検索..."}
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-400 font-bold transition-all"
                            />
                            <svg className="w-6 h-6 absolute left-4 top-1/2 -translate-y-1/2 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <div className="flex flex-col items-center justify-center text-center mt-10">
                            <img
                                src="https://cdni.iconscout.com/illustration/premium/thumb/searching-4034250-3336210.png"
                                alt="Search Illustration"
                                className="w-64 h-auto opacity-80 group-hover:scale-105 transition-transform duration-700"
                            />
                            <p className="text-slate-400 font-bold text-sm max-w-[200px] mt-8">
                                {isUz
                                    ? "Yangi so'zlarni qidirish orqali tezroq o'rganing"
                                    : "新しい単語を速く学習しましょう"}
                            </p>
                        </div>

                        {/* Decorative circles */}
                        <div className="absolute -bottom-20 -right-20 w-40 h-40 bg-blue-50 rounded-full blur-3xl opacity-50 -z-10"></div>
                        <div className="absolute -top-20 -left-20 w-40 h-40 bg-orange-50 rounded-full blur-3xl opacity-50 -z-10"></div>
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
                    background: #E2E8F0;
                    border-radius: 10px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb:hover {
                    background: #CBD5E1;
                }
            `}</style>
        </div>
    );
}
