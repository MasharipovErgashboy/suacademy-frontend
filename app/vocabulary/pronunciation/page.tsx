"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import Header from "../../components/Header";
import { BACKEND_URL, fetchWithAuth, isAuthenticated } from "../../lib/auth";

interface Topic {
    id: number;
    slug: string;
    title: string;
    words_count: number;
}

interface Word {
    id: number;
    word: string;
    translation: string;
    audio: string | null;
}

export default function PronunciationPage() {
    const router = useRouter();
    const [nationality, setNationality] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("nationality") || "uz";
        }
        return "uz";
    });
    const [topics, setTopics] = useState<Topic[]>([]);
    const [selectedTopic, setSelectedTopic] = useState<string>("");
    const [words, setWords] = useState<Word[]>([]);
    const [playingId, setPlayingId] = useState<number | null>(null);
    const [completedWords, setCompletedWords] = useState<Set<number>>(new Set());
    const [loading, setLoading] = useState(true);
    const audioRefs = useRef<{ [key: number]: HTMLAudioElement }>({});

    const isUz = nationality === "uz";

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }
        fetchTopics();
    }, [router]);

    const fetchTopics = async () => {
        try {
            const res = await fetchWithAuth(`${BACKEND_URL}/vocabulary/topics/`);
            if (res.ok) {
                const data = await res.json();
                setTopics(data);
                if (data.length > 0) {
                    setSelectedTopic(data[0].slug);
                    fetchWords(data[0].slug);
                }
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWords = async (slug: string) => {
        setLoading(true);
        try {
            const res = await fetchWithAuth(`${BACKEND_URL}/vocabulary/${slug}/`);
            if (res.ok) {
                const data = await res.json();
                setWords(data.words);
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleTopicChange = (slug: string) => {
        setSelectedTopic(slug);
        setCompletedWords(new Set());
        fetchWords(slug);
    };

    const playAudio = (wordId: number, audioUrl: string | null) => {
        if (!audioUrl) return;

        // Stop currently playing audio
        if (playingId !== null && audioRefs.current[playingId]) {
            audioRefs.current[playingId].pause();
            audioRefs.current[playingId].currentTime = 0;
        }

        // Create or get audio element
        if (!audioRefs.current[wordId]) {
            audioRefs.current[wordId] = new Audio(audioUrl);
            audioRefs.current[wordId].onended = () => {
                setPlayingId(null);
                setCompletedWords(prev => new Set([...prev, wordId]));
            };
        }

        setPlayingId(wordId);
        audioRefs.current[wordId].play();
    };

    const progress = words.length > 0 ? (completedWords.size / words.length) * 100 : 0;

    if (loading && topics.length === 0) {
        return (
            <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center">
                <div className={`animate-spin w-12 h-12 border-4 rounded-full border-t-transparent ${isUz ? "border-blue-500" : "border-orange-500"}`}></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#FFF4E6] pb-20" suppressHydrationWarning>
            <Header />

            <div className="max-w-4xl mx-auto px-4 py-8">
                {/* Header */}
                <div className="text-center mb-8 relative">
                    {/* Back Button - Top Right */}
                    <button
                        onClick={() => router.push("/vocabulary/topics")}
                        className={`absolute top-0 right-0 w-12 h-12 rounded-xl flex items-center justify-center transition-all hover:scale-110 ${isUz ? "bg-blue-500 hover:bg-blue-600 text-white shadow-lg shadow-blue-200" : "bg-orange-500 hover:bg-orange-600 text-white shadow-lg shadow-orange-200"}`}
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                        </svg>
                    </button>

                    <h1 className="text-4xl font-black text-slate-900 mb-3">
                        {isUz ? "Talaffuz Mashqlari" : "発音練習"}
                    </h1>
                    <p className="text-slate-600 font-medium">
                        {isUz ? "So'zlarni tinglang va takrorlang" : "単語を聞いて繰り返す"}
                    </p>
                </div>

                {/* Topic Selector */}
                <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
                    <label className="block text-sm font-bold text-slate-700 mb-3">
                        {isUz ? "Mavzuni tanlang:" : "トピックを選択:"}
                    </label>
                    <select
                        value={selectedTopic}
                        onChange={(e) => handleTopicChange(e.target.value)}
                        className={`w-full px-4 py-3 rounded-xl border-2 font-bold focus:outline-none focus:ring-4 transition-all ${isUz ? "border-blue-200 focus:border-blue-500 focus:ring-blue-100" : "border-orange-200 focus:border-orange-500 focus:ring-orange-100"}`}
                    >
                        {topics.map(topic => (
                            <option key={topic.id} value={topic.slug}>
                                {topic.title} ({topic.words_count} {isUz ? "so'z" : "単語"})
                            </option>
                        ))}
                    </select>
                </div>

                {/* Progress Bar */}
                {words.length > 0 && (
                    <div className="bg-white rounded-2xl p-6 shadow-lg border border-slate-200 mb-6">
                        <div className="flex items-center justify-between mb-3">
                            <span className="text-sm font-bold text-slate-700">
                                {isUz ? "Jarayon:" : "進捗:"}
                            </span>
                            <span className={`text-sm font-black ${isUz ? "text-blue-600" : "text-orange-600"}`}>
                                {completedWords.size}/{words.length}
                            </span>
                        </div>
                        <div className="h-3 bg-slate-100 rounded-full overflow-hidden">
                            <div
                                className={`h-full transition-all duration-500 ${isUz ? "bg-blue-500" : "bg-orange-500"}`}
                                style={{ width: `${progress}%` }}
                            ></div>
                        </div>
                    </div>
                )}

                {/* Words List */}
                <div className="space-y-4">
                    {loading ? (
                        <div className="text-center py-12">
                            <div className={`animate-spin w-10 h-10 border-4 rounded-full border-t-transparent mx-auto ${isUz ? "border-blue-500" : "border-orange-500"}`}></div>
                        </div>
                    ) : words.length === 0 ? (
                        <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
                            <div className="text-5xl mb-4">📚</div>
                            <p className="text-slate-500 font-medium">
                                {isUz ? "So'zlar topilmadi" : "単語が見つかりません"}
                            </p>
                        </div>
                    ) : (
                        words.map((word) => (
                            <div
                                key={word.id}
                                className={`bg-white rounded-2xl p-6 shadow-lg border-2 transition-all duration-300 ${completedWords.has(word.id)
                                    ? "border-green-200 bg-green-50"
                                    : playingId === word.id
                                        ? isUz ? "border-blue-500 shadow-blue-200" : "border-orange-500 shadow-orange-200"
                                        : "border-slate-200 hover:border-slate-300"
                                    }`}
                            >
                                <div className="flex items-center gap-6">
                                    {/* Play Button */}
                                    <button
                                        onClick={() => playAudio(word.id, word.audio)}
                                        disabled={!word.audio}
                                        className={`flex-shrink-0 w-16 h-16 rounded-full flex items-center justify-center transition-all ${!word.audio
                                            ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                            : playingId === word.id
                                                ? isUz ? "bg-blue-500 text-white shadow-lg shadow-blue-300 scale-110" : "bg-orange-500 text-white shadow-lg shadow-orange-300 scale-110"
                                                : isUz ? "bg-blue-50 text-blue-600 hover:bg-blue-100 hover:scale-105" : "bg-orange-50 text-orange-600 hover:bg-orange-100 hover:scale-105"
                                            }`}
                                    >
                                        {playingId === word.id ? (
                                            <svg className="w-8 h-8 animate-pulse" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" />
                                            </svg>
                                        ) : (
                                            <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        )}
                                    </button>

                                    {/* Word Content */}
                                    <div className="flex-1 min-w-0">
                                        <div className="text-2xl font-black text-slate-900 mb-1 truncate">
                                            {word.word}
                                        </div>
                                        <div className="text-lg text-slate-500 font-medium truncate">
                                            {word.translation}
                                        </div>
                                    </div>

                                    {/* Completed Check */}
                                    {completedWords.has(word.id) && (
                                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-green-500 text-white flex items-center justify-center">
                                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                                            </svg>
                                        </div>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
