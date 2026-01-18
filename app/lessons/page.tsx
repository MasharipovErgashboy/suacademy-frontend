"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";

export default function LessonsPage() {
    const [nationality, setNationality] = useState<string>("uz");

    useEffect(() => {
        const saved = localStorage.getItem("nationality");
        if (saved) setNationality(saved);
    }, []);

    const isUz = nationality === "uz";

    const content = {
        uz: {
            badge: "25 TA VIDEO DARS",
            title: '"Salom"dan boshlab professional darajaga!',
            subtitle: "Yapon tilini suhbat orqali o'rganing",
            description:
                "Real hayotiy vaziyatlarga asoslangan video darslar orqali yapon tilida erkin suhbatlashishni o'rganing. Har bir dars - bu yangi imkoniyat!",
            features: [
                {
                    icon: "🎯",
                    title: "Maqsadli yondashuv",
                    desc: "Har bir darsda eng zarur iboralar",
                },
                {
                    icon: "🗣️",
                    title: "Real suhbatlar",
                    desc: "Haqiqiy hayotdan olingan dialoglar",
                },
                {
                    icon: "⚡",
                    title: "Tez natija",
                    desc: "O'zbek misollari bilan oson o'rganish",
                },
            ],
            stats: [
                { number: "25+", label: "Video dars" },
                { number: "100+", label: "Yangi so'zlar" },
                { number: "50+", label: "Suhbat namunasi" },
            ],
            process: {
                title: "Qanday ishlaydi?",
                steps: [
                    {
                        number: "01",
                        title: "Video tomosha qiling",
                        desc: "Har bir darsda real vaziyatlarni ko'ring",
                    },
                    {
                        number: "02",
                        title: "Takrorlang",
                        desc: "O'rgangan iboralaringizni amaliyotda sinab ko'ring",
                    },
                    {
                        number: "03",
                        title: "Mashq qiling",
                        desc: "Interaktiv mashqlar orqali mustahkamlang",
                    },
                ],
            },
            testimonials: {
                title: "O'quvchilarimiz fikri",
                items: [
                    {
                        name: "Aziza Karimova",
                        role: "Talaba",
                        text: "Bu darslar orqali 3 oyda yapon tilida erkin gaplasha boshladim!",
                        rating: 5,
                    },
                    {
                        name: "Sardor Rahimov",
                        role: "Dasturchi",
                        text: "Eng yaxshi video darslar! Juda tushunarli va qiziqarli.",
                        rating: 5,
                    },
                ],
            },
            button: "Darslarni boshlash",
            secondaryButton: "Bepul darsni ko'rish",
        },
        ja: {
            badge: "25のビデオレッスン",
            title: "会話から始めるウズベク語マスター！",
            subtitle: "実践的な会話でウズベク語を学ぶ",
            description:
                "実生活のシチュエーションに基づいたビデオレッスンで、ウズベク語での自由な会話を学びます。各レッスンは新しい可能性です！",
            features: [
                {
                    icon: "🎯",
                    title: "目標指向のアプローチ",
                    desc: "各レッスンで最も必要なフレーズ",
                },
                {
                    icon: "🗣️",
                    title: "実際の会話",
                    desc: "実生活から取られた対話",
                },
                {
                    icon: "⚡",
                    title: "速い結果",
                    desc: "日本語の例で簡単に学習",
                },
            ],
            stats: [
                { number: "25+", label: "ビデオレッスン" },
                { number: "100+", label: "新しい単語" },
                { number: "50+", label: "会話サンプル" },
            ],
            process: {
                title: "どのように機能しますか？",
                steps: [
                    {
                        number: "01",
                        title: "ビデオを見る",
                        desc: "各レッスンで実際の状況を見る",
                    },
                    {
                        number: "02",
                        title: "繰り返す",
                        desc: "学んだフレーズを実践で試す",
                    },
                    {
                        number: "03",
                        title: "練習する",
                        desc: "インタラクティブな演習で強化",
                    },
                ],
            },
            testimonials: {
                title: "生徒の声",
                items: [
                    {
                        name: "田中 花子",
                        role: "学生",
                        text: "このレッスンで3ヶ月でウズベク語を話せるようになりました！",
                        rating: 5,
                    },
                    {
                        name: "佐藤 太郎",
                        role: "プログラマー",
                        text: "最高のビデオレッスン！とてもわかりやすくて面白いです。",
                        rating: 5,
                    },
                ],
            },
            button: "レッスンを開始",
            secondaryButton: "無料レッスンを見る",
        },
    };

    const t = content[nationality as keyof typeof content];

    return (
        <div className={`min-h-screen bg-gradient-to-br ${isUz ? "from-blue-50 via-white to-purple-50" : "from-orange-50 via-white to-amber-50"}`}>
            <Header />

            {/* Hero Section */}
            <section className="relative overflow-hidden">
                {/* Animated Background Elements */}
                <div className="absolute inset-0 overflow-hidden pointer-events-none">
                    <div className={`absolute top-20 left-10 w-72 h-72 rounded-full blur-3xl animate-pulse ${isUz ? "bg-blue-400/10" : "bg-orange-400/10"}`}></div>
                    <div className={`absolute bottom-20 right-10 w-96 h-96 rounded-full blur-3xl animate-pulse delay-700 ${isUz ? "bg-purple-400/10" : "bg-red-400/10"}`}></div>
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gradient-to-r rounded-full blur-3xl ${isUz ? "from-blue-200/5 to-purple-200/5" : "from-orange-200/5 to-red-200/5"}`}></div>
                </div>

                <div className="container mx-auto px-6 py-20 relative z-10">
                    <div className="max-w-7xl mx-auto">
                        {/* Badge */}
                        <div className="flex justify-center mb-8 animate-in fade-in duration-500">
                            <div className={`inline-flex items-center gap-2 bg-gradient-to-r text-white px-6 py-3 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 cursor-pointer ${isUz ? "from-blue-600 to-purple-600" : "from-[#FE9B19] to-orange-600"}`}>
                                <svg className="w-5 h-5 animate-pulse" fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                </svg>
                                <span className="font-bold text-sm tracking-wider">{t.badge}</span>
                            </div>
                        </div>

                        {/* Main Title */}
                        <h1 className={`text-5xl md:text-6xl lg:text-7xl font-black text-center mb-6 animate-in slide-in-from-bottom duration-700 bg-gradient-to-r bg-clip-text text-transparent leading-tight ${isUz ? "from-gray-900 via-blue-900 to-purple-900" : "from-gray-900 via-orange-600 to-red-600"}`}>
                            {t.title}
                        </h1>

                        {/* Subtitle */}
                        <p className="text-2xl md:text-3xl text-center text-gray-600 font-semibold mb-8 animate-in fade-in duration-700 delay-200">
                            {t.subtitle}
                        </p>

                        {/* Description */}
                        <p className="text-lg md:text-xl text-center text-gray-600 max-w-3xl mx-auto mb-12 animate-in fade-in duration-700 delay-300 leading-relaxed">
                            {t.description}
                        </p>

                        {/* CTA Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center gap-6 mb-16 animate-in zoom-in duration-700 delay-400">
                            <button
                                onClick={() => {
                                    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
                                    if (token) {
                                        window.location.href = "/lessons/videos";
                                    } else {
                                        window.location.href = "/login";
                                    }
                                }}
                                className={`group relative inline-flex items-center justify-center gap-4 bg-gradient-to-r text-white px-12 py-6 rounded-full font-bold text-xl shadow-2xl transition-all hover:scale-110 active:scale-95 cursor-pointer ${isUz ? "from-blue-600 via-blue-700 to-purple-700 hover:from-blue-700 hover:via-purple-700 hover:to-purple-800 hover:shadow-blue-500/50" : "from-[#FE9B19] via-orange-600 to-red-600 hover:from-orange-600 hover:via-red-600 hover:to-red-700 hover:shadow-orange-500/50"}`}
                            >
                                <span className="relative z-10">{t.button}</span>
                                <svg
                                    className="w-7 h-7 group-hover:translate-x-2 transition-transform relative z-10"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth={3}
                                        d="M13 7l5 5m0 0l-5 5m5-5H6"
                                    />
                                </svg>
                                <div className="absolute inset-0 bg-white/20 rounded-full blur-xl group-hover:blur-2xl transition-all"></div>
                            </button>

                            <button
                                onClick={() => {
                                    const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
                                    if (token) {
                                        window.location.href = "/lessons/videos";
                                    } else {
                                        window.location.href = "/login";
                                    }
                                }}
                                className="group inline-flex items-center justify-center gap-3 bg-white hover:bg-gray-50 text-gray-800 px-12 py-6 rounded-full font-bold text-xl shadow-xl hover:shadow-2xl transition-all hover:scale-105 active:scale-95 border-2 border-gray-200 cursor-pointer"
                            >
                                <svg className={`w-6 h-6 ${isUz ? "text-blue-600" : "text-[#FE9B19]"}`} fill="currentColor" viewBox="0 0 20 20">
                                    <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" />
                                </svg>
                                <span>{t.secondaryButton}</span>
                            </button>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-8 max-w-4xl mx-auto mb-20 animate-in fade-in duration-700 delay-500">
                            {t.stats.map((stat, idx) => (
                                <div
                                    key={idx}
                                    className="text-center p-6 bg-white/80 backdrop-blur-sm rounded-3xl shadow-lg hover:shadow-xl transition-all hover:scale-105 border border-gray-100 group"
                                >
                                    <div className="text-4xl md:text-5xl font-black bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 group-hover:scale-110 transition-transform">
                                        {stat.number}
                                    </div>
                                    <div className="text-gray-600 font-semibold text-sm md:text-base">
                                        {stat.label}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto mb-20">
                            {t.features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group relative p-8 bg-white rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border border-gray-100 animate-in fade-in duration-700"
                                    style={{ animationDelay: `${(idx + 6) * 100}ms` }}
                                >
                                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity -z-10 blur-xl"></div>

                                    <div className="text-5xl mb-4 group-hover:scale-110 group-hover:rotate-12 transition-all duration-300">
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-xl font-bold text-gray-900 mb-3">
                                        {feature.title}
                                    </h3>
                                    <p className="text-gray-600 leading-relaxed">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Process Section */}
            <section className="py-20 bg-gradient-to-br from-gray-50 to-blue-50/30">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 bg-gradient-to-r from-gray-900 to-blue-900 bg-clip-text text-transparent">
                            {t.process.title}
                        </h2>

                        <div className="grid md:grid-cols-3 gap-8">
                            {t.process.steps.map((step, idx) => (
                                <div
                                    key={idx}
                                    className="relative group"
                                    style={{ animationDelay: `${idx * 200}ms` }}
                                >
                                    {/* Connector Line */}
                                    {idx < t.process.steps.length - 1 && (
                                        <div className="hidden md:block absolute top-16 left-full w-full h-1 bg-gradient-to-r from-blue-300 to-purple-300 -translate-x-1/2 z-0"></div>
                                    )}

                                    <div className="relative bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100">
                                        <div className="text-6xl font-black text-transparent bg-gradient-to-br from-blue-600 to-purple-600 bg-clip-text mb-4 group-hover:scale-110 transition-transform">
                                            {step.number}
                                        </div>
                                        <h3 className="text-2xl font-bold text-gray-900 mb-3">
                                            {step.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">{step.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-20">
                <div className="container mx-auto px-6">
                    <div className="max-w-6xl mx-auto">
                        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 bg-gradient-to-r from-gray-900 to-purple-900 bg-clip-text text-transparent">
                            {t.testimonials.title}
                        </h2>

                        <div className="grid md:grid-cols-2 gap-8">
                            {t.testimonials.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all hover:-translate-y-2 border border-gray-100"
                                >
                                    <div className="flex gap-1 mb-4">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <svg
                                                key={i}
                                                className="w-6 h-6 text-yellow-400"
                                                fill="currentColor"
                                                viewBox="0 0 20 20"
                                            >
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-gray-700 text-lg mb-6 italic leading-relaxed">
                                        "{item.text}"
                                    </p>
                                    <div className="flex items-center gap-4">
                                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold text-xl">
                                            {item.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-bold text-gray-900">{item.name}</div>
                                            <div className="text-gray-500 text-sm">{item.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Final CTA */}
            <section className="py-20 bg-gradient-to-r from-blue-600 via-purple-600 to-blue-600">
                <div className="container mx-auto px-6 text-center">
                    <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
                        {nationality === "uz" ? "Bugun boshlang!" : "今日から始めよう！"}
                    </h2>
                    <p className="text-xl text-white/90 mb-10 max-w-2xl mx-auto">
                        {nationality === "uz"
                            ? "Birinchi darsni bepul tomosha qiling va o'zingiz baholang!"
                            : "最初のレッスンを無料で視聴して、自分で評価してください！"}
                    </p>
                    <button
                        onClick={() => {
                            const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
                            if (token) {
                                window.location.href = "/lessons/videos";
                            } else {
                                window.location.href = "/login";
                            }
                        }}
                        className="inline-flex items-center gap-4 bg-white text-blue-600 px-12 py-6 rounded-full font-bold text-xl shadow-2xl hover:shadow-white/50 transition-all hover:scale-110 active:scale-95 cursor-pointer"
                    >
                        <span>{t.button}</span>
                        <svg
                            className="w-7 h-7"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={3}
                                d="M13 7l5 5m0 0l-5 5m5-5H6"
                            />
                        </svg>
                    </button>
                </div>
            </section>
        </div>
    );
}
