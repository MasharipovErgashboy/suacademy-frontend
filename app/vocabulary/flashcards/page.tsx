"use client";

import { useEffect, useState } from "react";
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

export default function FlashcardsPage() {
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
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [loading, setLoading] = useState(true);

    const isUz = nationality === "uz";

    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }
        fetchTopics();
    }, [router]);

    useEffect(() => {
        const handleKeyPress = (e: KeyboardEvent) => {
            if (e.key === "ArrowLeft") handlePrevious();
            if (e.key === "ArrowRight") handleNext();
            if (e.key === " " || e.key === "Enter") {
                e.preventDefault();
                setIsFlipped(!isFlipped);
            }
        };

        window.addEventListener("keydown", handleKeyPress);
        return () => window.removeEventListener("keydown", handleKeyPress);
    }, [isFlipped, currentIndex, words]);

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
        setCurrentIndex(0);
        setIsFlipped(false);
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
        fetchWords(slug);
    };

    const handleNext = () => {
        if (currentIndex < words.length - 1) {
            setCurrentIndex(currentIndex + 1);
            setIsFlipped(false);
        }
    };

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1);
            setIsFlipped(false);
        }
    };

    const currentWord = words[currentIndex];

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
                        {isUz ? "Lug'at Kartalari" : "フラッシュカード"}
                    </h1>
                    <p className="text-slate-600 font-medium">
                        {isUz ? "Kartalarni aylantiring va so'zlarni eslab qoling" : "カードをめくって単語を覚える"}
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
                    <>
                        {/* Progress */}
                        <div className="text-center mb-6">
                            <span className={`inline-block px-6 py-2 rounded-full font-black text-sm ${isUz ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-orange-600"}`}>
                                {isUz ? "Karta" : "カード"} {currentIndex + 1} / {words.length}
                            </span>
                        </div>

                        {/* Flashcard */}
                        <div className="perspective-1000 mb-8">
                            <div
                                className={`relative w-full aspect-[3/2] max-w-2xl mx-auto cursor-pointer transition-transform duration-700 transform-style-3d ${isFlipped ? "rotate-y-180" : ""}`}
                                onClick={() => setIsFlipped(!isFlipped)}
                            >
                                {/* Front */}
                                <div className={`absolute inset-0 backface-hidden rounded-[2rem] p-12 flex flex-col items-center justify-center shadow-2xl border-4 ${isUz ? "bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200" : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200"}`}>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                                        {isUz ? "Old tomon" : "表"}
                                    </div>
                                    <div className="text-5xl md:text-6xl font-black text-slate-900 mb-8 text-center">
                                        {currentWord?.word}
                                    </div>
                                    <button className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isUz ? "bg-blue-500 hover:bg-blue-600" : "bg-orange-500 hover:bg-orange-600"} text-white shadow-lg`}>
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>

                                {/* Back */}
                                <div className={`absolute inset-0 backface-hidden rotate-y-180 rounded-[2rem] p-12 flex flex-col items-center justify-center shadow-2xl border-4 ${isUz ? "bg-gradient-to-br from-green-50 to-green-100 border-green-200" : "bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200"}`}>
                                    <div className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">
                                        {isUz ? "Orqa tomon" : "裏"}
                                    </div>
                                    <div className="text-5xl md:text-6xl font-black text-slate-900 mb-8 text-center">
                                        {currentWord?.translation}
                                    </div>
                                    <button className={`w-14 h-14 rounded-full flex items-center justify-center transition-all ${isUz ? "bg-green-500 hover:bg-green-600" : "bg-purple-500 hover:bg-purple-600"} text-white shadow-lg`}>
                                        <svg className="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                        </svg>
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Navigation */}
                        <div className="flex items-center justify-center gap-4">
                            <button
                                onClick={handlePrevious}
                                disabled={currentIndex === 0}
                                className={`px-8 py-4 rounded-xl font-bold transition-all ${currentIndex === 0
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : "bg-white text-slate-700 hover:bg-slate-50 shadow-lg hover:shadow-xl"
                                    }`}
                            >
                                ← {isUz ? "Oldingi" : "前へ"}
                            </button>
                            <button
                                onClick={handleNext}
                                disabled={currentIndex === words.length - 1}
                                className={`px-8 py-4 rounded-xl font-bold transition-all ${currentIndex === words.length - 1
                                    ? "bg-slate-100 text-slate-400 cursor-not-allowed"
                                    : isUz ? "bg-blue-500 text-white hover:bg-blue-600 shadow-lg shadow-blue-200 hover:shadow-xl" : "bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200 hover:shadow-xl"
                                    }`}
                            >
                                {isUz ? "Keyingi" : "次へ"} →
                            </button>
                        </div>

                        {/* Keyboard Hint */}
                        <div className="text-center mt-6 text-sm text-slate-400 font-medium">
                            {isUz ? "Klaviatura: ← → (navigatsiya), Space/Enter (aylantirish)" : "キーボード: ← → (ナビゲーション), Space/Enter (めくる)"}
                        </div>
                    </>
                )}
            </div>

            <style jsx>{`
                .perspective-1000 {
                    perspective: 1000px;
                }
                .transform-style-3d {
                    transform-style: preserve-3d;
                }
                .backface-hidden {
                    backface-visibility: hidden;
                }
                .rotate-y-180 {
                    transform: rotateY(180deg);
                }
            `}</style>
        </div>
    );
}
