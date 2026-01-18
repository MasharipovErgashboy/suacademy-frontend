"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Link from "next/link";
import ScrollAnimation from "../components/ScrollAnimation";
import { AnimatePresence, motion } from "framer-motion";

export default function VocabularyPage() {
    const router = useRouter();
    const [nationality, setNationality] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("nationality") || "uz";
        }
        return "uz";
    });
    const [currentSlide, setCurrentSlide] = useState(0);

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentSlide((prev) => (prev + 1) % 3);
        }, 3000);
        return () => clearInterval(timer);
    }, []);

    const content = {
        uz: {
            hero: {
                title: "Yaponiya dunyosini so'zlar orqali kashf eting",
                subtitle: "SU Academy ning lug'at bo'limi sizga kundalik hayotda kerak bo'ladigan eng muhim so'zlar va iboralarni o'rgatadi.",
                cta: "O'rganishni boshlash",
            },
            features: [
                {
                    title: "Mavzularga bo'lingan",
                    desc: "Oziq-ovqat, transport, salomlashish va boshqa 20 dan ortiq kundalik mavzular.",
                    icon: "📚"
                },
                {
                    title: "Audio talaffuz",
                    desc: "Har bir so'zning asl yaponcha talaffuzini tinglash imkoniyati.",
                    icon: "🔊"
                },
                {
                    title: "Smart Learning",
                    desc: "Yangi so'zlarni xotirada saqlash uchun maxsus algoritmlar.",
                    icon: "🧠"
                }
            ],
            process: {
                title: "Qanday o'rganamiz?",
                steps: [
                    "O'zingizga qiziq mavzuni tanlang",
                    "Yangi so'zlar va ularning ma'nosini ko'ring",
                    "Audio orqali talaffuzni mashq qiling",
                    "Bilimingizni testlar orqali sinab ko'ring"
                ]
            },
            vocabCards: [
                {
                    word: "こんにちは",
                    pronunciation: "Konnichiwa",
                    translation: "Salom",
                    fullTranslation: "Salom / Assalomu alaykum",
                    topic: "Salomlashish",
                    icon: "👋",
                    goal: "15 / 20 so'z",
                    progress: 75
                },
                {
                    word: "ありがとう",
                    pronunciation: "Arigatou",
                    translation: "Rahmat",
                    fullTranslation: "Rahmat / Tashakkur",
                    topic: "Minnatdorchilik",
                    icon: "🙏",
                    goal: "16 / 20 so'z",
                    progress: 80
                },
                {
                    word: "さようなら",
                    pronunciation: "Sayonara",
                    translation: "Xayr",
                    fullTranslation: "Xayr / Ko'rishguncha",
                    topic: "Xayrlashuv",
                    icon: "👋",
                    goal: "17 / 20 so'z",
                    progress: 85
                }
            ]
        },
        ja: {
            hero: {
                title: "言葉を通じてウズベキスタンの世界を発見しましょう",
                subtitle: "SU Academyの語彙セクションでは、日常生活に必要な最も重要な単語や表現を学ぶことができます。",
                cta: "学習を開始する",
            },
            features: [
                {
                    title: "トピック別学習",
                    desc: "食事、交通、挨拶など、20以上の日常的なトピック。",
                    icon: "📚"
                },
                {
                    title: "音声発音",
                    desc: "すべての単語の本物の日本語の発音を聞くことができます。",
                    icon: "🔊"
                },
                {
                    title: "スマート学習",
                    desc: "新しい単語を記憶するための特別なアルゴリズム。",
                    icon: "🧠"
                }
            ],
            process: {
                title: "どのように学びますか？",
                steps: [
                    "興味のあるトピックを選択してください",
                    "新しい単語とその意味を確認してください",
                    "音声で発音を練習してください",
                    "テストで知識を試してみてください"
                ]
            },
            vocabCards: [
                {
                    word: "Assalomu alaykum",
                    pronunciation: "Assalomu alaykum",
                    translation: "こんにちは",
                    fullTranslation: "こんにちは",
                    topic: "挨拶",
                    icon: "👋",
                    goal: "15 / 20 単語",
                    progress: 75
                },
                {
                    word: "Rahmat",
                    pronunciation: "Rahmat",
                    translation: "ありがとう",
                    fullTranslation: "ありがとう",
                    topic: "感謝",
                    icon: "🙏",
                    goal: "16 / 20 単語",
                    progress: 80
                },
                {
                    word: "Xayr",
                    pronunciation: "Xayr",
                    translation: "さようなら",
                    fullTranslation: "さようなら",
                    topic: "別れ",
                    icon: "👋",
                    goal: "17 / 20 単語",
                    progress: 85
                }
            ]
        }
    };

    const isUz = nationality === "uz";
    const t = isUz ? content.uz : content.ja;
    const currentCard = t.vocabCards[currentSlide];

    const handleStart = () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (token) {
            router.push("/vocabulary/topics");
        } else {
            router.push("/login");
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF4E6] flex flex-col font-sans selection:bg-blue-200" suppressHydrationWarning>
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-20 pb-20 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <ScrollAnimation direction="left" className="flex-1 text-center lg:text-left">
                                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wider uppercase border-2 ${isUz ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                                    {isUz ? "Yangi imkoniyat" : "新機能"}
                                </span>
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[1.1] tracking-tight">
                                    {t.hero.title}
                                </h1>
                                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {t.hero.subtitle}
                                </p>
                                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                                    <button
                                        onClick={handleStart}
                                        className={`px-10 py-5 rounded-full font-black text-white text-lg shadow-2xl transition-all hover:scale-110 active:scale-95 duration-300 ${isUz ? "bg-blue-600 shadow-blue-500/40 hover:bg-blue-700" : "bg-[#FE9B19] shadow-orange-500/40 hover:bg-orange-600"}`}
                                    >
                                        {t.hero.cta}
                                    </button>
                                </div>
                            </ScrollAnimation>

                            <ScrollAnimation direction="right" delay={0.2} className="flex-1 relative">
                                <div className="relative z-10 w-full aspect-square max-w-xl mx-auto flex items-center justify-center">
                                    {/* Main Word Card */}
                                    <div className="relative z-20 w-[80%] bg-white rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] border border-slate-100 p-8 transform -rotate-2 hover:rotate-0 transition-all duration-500 group cursor-default">
                                        <div className="flex flex-col items-center text-center">
                                            <span className={`text-sm font-black uppercase tracking-widest mb-4 ${isUz ? "text-blue-500" : "text-orange-500"}`}>
                                                {isUz ? "Kun so'zi" : "今日の単語"}
                                            </span>
                                            <div className="h-32 flex flex-col justify-center w-full"> {/* Fixed height container for stability */}
                                                <AnimatePresence mode="popLayout">
                                                    <motion.div
                                                        key={currentSlide}
                                                        initial={{ opacity: 0, y: 20 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        exit={{ opacity: 0, y: -20 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="w-full"
                                                    >
                                                        <div className="text-4xl md:text-5xl font-black text-slate-900 mb-2 truncate px-2">{currentCard.word}</div>
                                                        <div className="text-xl font-bold text-slate-400 mb-6 italic">{currentCard.pronunciation}</div>
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                            <div className="h-px w-full bg-slate-100 mb-6"></div>
                                            <div className="h-10 flex items-center justify-center w-full">
                                                <AnimatePresence mode="popLayout">
                                                    <motion.div
                                                        key={`trans-${currentSlide}`}
                                                        initial={{ opacity: 0 }}
                                                        animate={{ opacity: 1 }}
                                                        exit={{ opacity: 0 }}
                                                        transition={{ duration: 0.4 }}
                                                        className="text-2xl font-black text-slate-700"
                                                    >
                                                        {currentCard.fullTranslation}
                                                    </motion.div>
                                                </AnimatePresence>
                                            </div>
                                        </div>

                                        {/* Play Button */}
                                        <div className={`absolute -right-4 top-1/2 -translate-y-1/2 w-16 h-16 rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-110 transition-all duration-300 ${isUz ? "bg-blue-600 shadow-blue-500/40" : "bg-orange-500 shadow-orange-500/40"}`}>
                                            <svg className="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                            </svg>
                                        </div>
                                    </div>

                                    {/* Category Card (Floating Bottom Left) */}
                                    <div className="absolute -bottom-4 -left-4 z-30 bg-white/80 backdrop-blur-xl rounded-[2rem] p-6 shadow-2xl border border-white/50 animate-bounce-slow flex items-center gap-4">
                                        <AnimatePresence mode="wait">
                                            <motion.div
                                                key={`icon-${currentSlide}`}
                                                initial={{ scale: 0.5, opacity: 0 }}
                                                animate={{ scale: 1, opacity: 1 }}
                                                exit={{ scale: 0.5, opacity: 0 }}
                                                className="w-14 h-14 rounded-2xl bg-orange-50 flex items-center justify-center text-3xl"
                                            >
                                                {currentCard.icon}
                                            </motion.div>
                                        </AnimatePresence>
                                        <div>
                                            <div className="text-xs font-black text-slate-400 uppercase tracking-wider mb-0.5">{isUz ? "Mavzu" : "トピック"}</div>
                                            <AnimatePresence mode="wait">
                                                <motion.div
                                                    key={`topic-${currentSlide}`}
                                                    initial={{ opacity: 0, x: 10 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    exit={{ opacity: 0, x: -10 }}
                                                    className="text-lg font-black text-slate-800"
                                                >
                                                    {currentCard.topic}
                                                </motion.div>
                                            </AnimatePresence>
                                        </div>
                                    </div>

                                    {/* Progress Card (Floating Top Right) */}
                                    <div className="absolute -top-4 -right-4 z-10 bg-white/60 backdrop-blur-md rounded-[2rem] p-6 shadow-xl border border-white/50 rotate-3 animate-pulse-slow">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12">
                                                <svg className="w-12 h-12 -rotate-90">
                                                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                                                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className={isUz ? "text-blue-500" : "text-orange-500"} strokeDasharray="125" strokeDashoffset={125 - (125 * currentCard.progress) / 100} style={{ transition: "stroke-dashoffset 0.5s ease-out" }} />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-[10px] font-black text-slate-700">{currentCard.progress}%</div>
                                            </div>
                                            <div>
                                                <div className="text-xs font-black text-slate-400 uppercase tracking-tighter">{isUz ? "Kunlik Maqsad" : "一日の目標"}</div>
                                                <div className="text-sm font-black text-slate-800">{currentCard.goal}</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative floating characters */}
                                    <div className="absolute top-10 left-0 text-4xl font-black text-slate-200/50 -rotate-12 select-none pointer-events-none">あ</div>
                                    <div className="absolute bottom-20 right-0 text-5xl font-black text-slate-200/30 rotate-12 select-none pointer-events-none">カ</div>
                                    <div className="absolute top-1/2 -left-10 text-3xl font-black text-slate-200/40 select-none pointer-events-none">語</div>

                                    {/* Background glow */}
                                    <div className={`absolute inset-0 blur-[100px] opacity-20 -z-10 rounded-full ${isUz ? "bg-blue-400" : "bg-orange-400"}`}></div>
                                </div>
                            </ScrollAnimation>
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white/60 backdrop-blur-xl border-y border-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {t.features.map((feature, idx) => (
                                <ScrollAnimation
                                    key={idx}
                                    delay={idx * 0.2}
                                    className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500"
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm ${isUz ? "bg-blue-50" : "bg-orange-50"}`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors duration-300">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {feature.desc}
                                    </p>
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Process Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="max-w-4xl mx-auto text-center mb-20">
                            <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-8">{t.process.title}</h2>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {t.process.steps.map((step, idx) => (
                                <ScrollAnimation
                                    key={idx}
                                    delay={idx * 0.15}
                                    className="relative"
                                >
                                    <div className="bg-white rounded-[2rem] p-8 h-full border border-slate-100 shadow-xl relative z-10 group hover:bg-slate-900 transition-all duration-500 cursor-default">
                                        <div className={`text-6xl font-black mb-6 opacity-20 ${isUz ? "text-blue-600" : "text-orange-600"} group-hover:text-white group-hover:opacity-10 group-hover:scale-110 transition-all duration-500`}>
                                            0{idx + 1}
                                        </div>
                                        <p className="text-xl font-bold text-slate-800 group-hover:text-white transition-all leading-tight">
                                            {step}
                                        </p>
                                    </div>
                                    {idx < 3 && (
                                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-slate-200 z-0 group-hover:bg-slate-400 transition-colors duration-300"></div>
                                    )}
                                </ScrollAnimation>
                            ))}
                        </div>
                    </div>
                </section>

                {/* CTA Final */}
                <section className="pb-32">
                    <div className="container mx-auto px-4">
                        <ScrollAnimation className={`rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl ${isUz ? "bg-blue-600 shadow-blue-500/20" : "bg-[#FE9B19] shadow-orange-500/20"}`}>
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 leading-tight tracking-tight relative z-10">
                                {isUz ? "Yapon tilini bugunoq boyiting" : "今日から日本語の語彙を増やしましょう"}
                            </h2>
                            <button
                                onClick={handleStart}
                                className="px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative z-10"
                            >
                                {isUz ? "Hozir boshlang" : "今すぐ始める"}
                            </button>
                        </ScrollAnimation>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1) rotate(3deg); opacity: 0.4; }
                    50% { transform: scale(1.05) rotate(5deg); opacity: 0.6; }
                }
                .animate-pulse-slow {
                    animation: pulse-slow 8s infinite ease-in-out;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-20px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 5s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}
