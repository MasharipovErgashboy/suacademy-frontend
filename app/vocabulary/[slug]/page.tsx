"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, useParams } from "next/navigation";
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

interface TopicDetail {
    id: number;
    name: string;
    description: string;
    icon: string;
    words: Word[];
}

export default function VocabularyTopicDetailPage() {
    const router = useRouter();
    const params = useParams();
    const slug = params.slug as string;

    const [topic, setTopic] = useState<TopicDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [nationality, setNationality] = useState<string>("uz");
    const [playingId, setPlayingId] = useState<number | null>(null);
    const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }

        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);

        fetchTopicDetail();
    }, [slug, router]);

    const fetchTopicDetail = async () => {
        setLoading(true);
        setError("");
        try {
            const response = await fetchWithAuth(`${BACKEND_URL}/vocabulary/${slug}/`);
            if (!response.ok) {
                throw new Error("Mavzu ma'lumotlarini yuklashda xatolik yuz berdi");
            }
            const data = await response.json();
            setTopic(data);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const playAudio = (wordId: number, audioUrl: string | null) => {
        if (!audioUrl) return;

        // Stop current playing audio if any
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

    if (loading) {
        return (
            <div className="min-h-screen bg-[#FFF4E6] flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center">
                    <div className="w-16 h-16 border-4 border-blue-600/20 border-t-blue-600 rounded-full animate-spin mb-4"></div>
                    <p className="text-slate-500 font-black tracking-widest uppercase text-sm">
                        {isUz ? "Yuklanmoqda..." : "読み込み中..."}
                    </p>
                </div>
                <Footer />
            </div>
        );
    }

    if (error || !topic) {
        return (
            <div className="min-h-screen bg-[#FFF4E6] flex flex-col">
                <Header />
                <div className="flex-grow flex flex-col items-center justify-center p-4">
                    <div className="bg-red-50 border border-red-100 p-12 rounded-[2.5rem] text-center max-w-lg w-full">
                        <p className="text-red-600 font-bold text-xl mb-6">{error || "Mavzu topilmadi"}</p>
                        <button
                            onClick={() => router.push("/vocabulary/topics")}
                            className="px-8 py-3 bg-red-600 text-white rounded-2xl font-black hover:bg-red-700 transition-all"
                        >
                            {isUz ? "Ortga qaytish" : "戻る"}
                        </button>
                    </div>
                </div>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF4E6] flex flex-col font-sans">
            <Header />

            <main className="flex-grow pb-24">
                {/* Hero Back Section */}
                <div className={`pt-12 pb-16 relative overflow-hidden ${isUz ? "bg-blue-600" : "bg-orange-500"}`}>
                    <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                        <div className="absolute top-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-x-1/2 -translate-y-1/2"></div>
                    </div>

                    <div className="container mx-auto px-4 relative z-10">
                        <Link
                            href="/vocabulary/topics"
                            className="inline-flex items-center gap-2 text-white/80 hover:text-white font-bold mb-10 transition-colors group"
                        >
                            <svg className="w-5 h-5 transform group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                            </svg>
                            {isUz ? "Barcha mavzular" : "すべてのトピック"}
                        </Link>

                        <div className="flex items-center gap-6 mb-4">
                            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center text-4xl shadow-xl border border-white/20">
                                {topic.icon || "📚"}
                            </div>
                            <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
                                {topic.name}
                            </h1>
                        </div>
                        <p className="text-xl text-white/80 max-w-2xl font-medium leading-relaxed">
                            {topic.description}
                        </p>
                    </div>
                </div>

                {/* Words Content */}
                <div className="container mx-auto px-4 -mt-10">
                    <div className="max-w-5xl mx-auto grid grid-cols-1 gap-6">
                        {topic.words && topic.words.length > 0 ? (
                            topic.words.map((word, idx) => (
                                <div
                                    key={word.id}
                                    className="bg-white rounded-[2rem] p-6 md:p-10 border border-slate-100 shadow-xl flex flex-col md:flex-row items-center gap-8 group hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-12"
                                    style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
                                >
                                    {/* Japanese Presentation */}
                                    <div className="flex-1 text-center md:text-left">
                                        <div className="flex flex-col md:flex-row md:items-baseline gap-2 mb-2">
                                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 leading-tight">
                                                {word.ja_kanji || word.ja_kana}
                                            </h2>
                                            {word.ja_kanji && (
                                                <span className="text-xl md:text-2xl font-bold text-slate-400">
                                                    ({word.ja_kana})
                                                </span>
                                            )}
                                        </div>
                                        <div className="text-xl font-bold text-blue-500 italic mb-1">
                                            {word.ja_romaji}
                                        </div>
                                    </div>

                                    {/* Divider for mobile */}
                                    <div className="w-full h-px bg-slate-100 md:hidden"></div>

                                    {/* Translation & Action */}
                                    <div className="flex-1 flex flex-col md:flex-row items-center justify-end gap-8 w-full">
                                        <div className="text-2xl md:text-3xl font-black text-slate-700 text-center md:text-right">
                                            {word.translation}
                                        </div>

                                        <button
                                            onClick={() => playAudio(word.id, word.audio)}
                                            className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transition-all duration-300 group-hover:scale-110 active:scale-95 ${playingId === word.id ? "bg-green-500 text-white animate-pulse" : "bg-slate-900 text-white"}`}
                                        >
                                            {playingId === word.id ? (
                                                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 20 20">
                                                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zM7 8a1 1 0 012 0v4a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v4a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                                                </svg>
                                            ) : (
                                                <svg className="w-8 h-8 ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                                </svg>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="bg-white rounded-[2.5rem] p-20 text-center border border-slate-100 shadow-xl">
                                <div className="text-6xl mb-6">🏜️</div>
                                <p className="text-xl font-black text-slate-400">
                                    {isUz ? "Hozircha bu mavzuda so'zlar yo'q" : "このトピックにはまだ単語がありません"}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
