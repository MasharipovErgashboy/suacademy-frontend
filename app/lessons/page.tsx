"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import Header from "../components/Header";
import Footer from "../components/Footer";

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
            hero: {
                title: '"Salom"dan boshlab professional darajaga!',
                subtitle: "Real hayotiy vaziyatlarga asoslangan video darslar orqali yapon tilida erkin suhbatlashishni o'rganing.",
                cta: "Darslarni boshlash",
                secondary: "Bepul darsni ko'rish"
            },
            features: [
                {
                    icon: "🎯",
                    title: "Maqsadli yondashuv",
                    desc: "Har bir darsda eng zarur iboralar va grammatik qoidalar.",
                },
                {
                    icon: "🗣️",
                    title: "Real suhbatlar",
                    desc: "Haqiqiy hayotdan olingan dialoglar va vaziyatlar.",
                },
                {
                    icon: "⚡",
                    title: "Tez natija",
                    desc: "O'zbek misollari bilan oson va samarali o'rganish.",
                },
            ],
            stats: [
                { number: "25+", label: "Video dars" },
                { number: "100+", label: "Yangi so'zlar" },
                { number: "50+", label: "Suhbat namunasi" },
            ],
            process: {
                title: "Qanday o'rganamiz?",
                steps: [
                    "Video darsni tomosha qiling",
                    "Yangi iboralarni takrorlang",
                    "Mashqlar orqali mustahkamlang",
                    "Amaliyotda qo'llashni boshlang"
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
            finalCta: "Yapon tilini bugunoq boshlang!"
        },
        ja: {
            badge: "25のビデオレッスン",
            hero: {
                title: "会話から始めるウズベク語マスター！",
                subtitle: "実生活のシチュエーションに基づいたビデオレッスンで、ウズベク語での自由な会話を学びます。",
                cta: "レッスンを開始",
                secondary: "無料レッスンを見る"
            },
            features: [
                {
                    icon: "🎯",
                    title: "目標指向のアプローチ",
                    desc: "各レッスンで最も必要なフレーズと文法規則。",
                },
                {
                    icon: "🗣️",
                    title: "実際の会話",
                    desc: "実生活から取られた対話とシチュエーション。",
                },
                {
                    icon: "⚡",
                    title: "速い結果",
                    desc: "日本語の例で簡単かつ効果的な学習。",
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
                    "ビデオレッスンを視聴する",
                    "新しいフレーズを繰り返す",
                    "演習で知識を強化する",
                    "実践で使い始める"
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
            finalCta: "今日からウズベク語を始めましょう！"
        },
    };

    const t = content[nationality as keyof typeof content];

    const handleStart = () => {
        const token = typeof window !== "undefined" ? localStorage.getItem("access_token") : null;
        if (token) {
            window.location.href = "/lessons/videos";
        } else {
            window.location.href = "/login";
        }
    };

    return (
        <div className="min-h-screen bg-[#FFF4E6] flex flex-col font-sans selection:bg-blue-200">
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-20 pb-20 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-left-12 duration-1000">
                                <span className={`inline-block px-4 py-1.5 rounded-full text-sm font-bold mb-6 tracking-wider uppercase border-2 ${isUz ? "bg-blue-50 text-blue-600 border-blue-100" : "bg-orange-50 text-orange-600 border-orange-100"}`}>
                                    {t.badge}
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
                                    <button
                                        onClick={handleStart}
                                        className="px-10 py-5 rounded-full font-black text-slate-700 bg-white shadow-xl hover:shadow-2xl transition-all hover:scale-110 active:scale-95 duration-300"
                                    >
                                        {t.hero.secondary}
                                    </button>
                                </div>
                            </div>

                            <div className="flex-1 relative animate-in fade-in zoom-in duration-1000 delay-300">
                                <div className="relative z-10 w-full aspect-video max-w-xl mx-auto flex items-center justify-center">
                                    {/* Main Lesson Video Card */}
                                    <div className="relative z-20 w-[90%] aspect-video bg-slate-900 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden border border-slate-800 group cursor-pointer transform -rotate-1 hover:rotate-0 transition-all duration-700">
                                        <Image
                                            src="/lessons-cover.png"
                                            alt="Lesson Cover"
                                            fill
                                            className="object-cover opacity-60 group-hover:scale-110 transition-transform duration-700"
                                        />
                                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10"></div>

                                        {/* Play Overlay */}
                                        <div className="absolute inset-0 flex items-center justify-center z-20">
                                            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center shadow-2xl transform group-hover:scale-110 group-hover:bg-blue-50 transition-all duration-500">
                                                <svg className={`w-8 h-8 ml-1 ${isUz ? "text-blue-600" : "text-orange-500"}`} fill="currentColor" viewBox="0 0 20 20">
                                                    <path d="M6.3 2.841A.7.7 0 017 2.5a.7.7 0 01.442.159l8.4 6.3a.7.7 0 010 1.082l-8.4 6.3A.7.7 0 016.3 15.659V2.841z" />
                                                </svg>
                                            </div>
                                        </div>

                                        {/* Lesson Info Overlay */}
                                        <div className="absolute bottom-6 left-8 right-8 z-20">
                                            <div className="flex items-end justify-between gap-4">
                                                <div>
                                                    <div className="text-blue-400 text-xs font-black uppercase tracking-widest mb-1">Dars 05</div>
                                                    <div className="text-white text-xl font-black">Xarid qilish: Bozorda</div>
                                                </div>
                                                <div className="text-white/60 text-sm font-bold">12:45</div>
                                            </div>
                                            <div className="mt-4 h-1.5 w-full bg-white/20 rounded-full overflow-hidden">
                                                <div className={`h-full w-2/3 ${isUz ? "bg-blue-500" : "bg-orange-500"} animate-pulse`}></div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Next Lesson Floating Badge */}
                                    <div className="absolute -top-6 -left-6 z-30 bg-white rounded-3xl p-4 shadow-2xl border border-slate-100 flex items-center gap-4 animate-bounce-slow">
                                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-2xl ${isUz ? "bg-blue-50" : "bg-orange-50"}`}>📖</div>
                                        <div>
                                            <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Keyingi dars</div>
                                            <div className="text-sm font-black text-slate-800">Grammatika: -masu</div>
                                        </div>
                                    </div>

                                    {/* Quiz Score Floating Badge */}
                                    <div className="absolute -bottom-4 -right-4 z-30 bg-white/90 backdrop-blur-xl rounded-3xl p-5 shadow-2xl border border-white/50 animate-pulse-slow">
                                        <div className="flex items-center gap-4">
                                            <div className="relative w-12 h-12">
                                                <svg className="w-12 h-12 -rotate-90">
                                                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-slate-100" />
                                                    <circle cx="24" cy="24" r="20" fill="none" stroke="currentColor" strokeWidth="4" className="text-green-500" strokeDasharray="125" strokeDashoffset="12.5" />
                                                </svg>
                                                <div className="absolute inset-0 flex items-center justify-center text-xs font-black text-slate-800">90%</div>
                                            </div>
                                            <div>
                                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-tighter">Oxirgi natija</div>
                                                <div className="text-sm font-black text-slate-800">A'lo! 🌟</div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Decorative UI elements */}
                                    <div className="absolute -z-10 bg-white/40 inset-0 rounded-[3rem] blur-xl animate-pulse"></div>
                                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[120px] opacity-20 -z-20 rounded-full ${isUz ? "bg-blue-400" : "bg-orange-400"}`}></div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Stats Section */}
                <section className="py-12">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-3 gap-6 max-w-4xl mx-auto">
                            {t.stats.map((stat, idx) => (
                                <div key={idx} className="bg-white/60 backdrop-blur-xl p-6 rounded-[2rem] border border-white/50 text-center animate-in fade-in slide-in-from-bottom-4 duration-500" style={{ animationDelay: `${idx * 100}ms` }}>
                                    <div className={`text-3xl md:text-5xl font-black mb-1 ${isUz ? "text-blue-600" : "text-orange-600"}`}>{stat.number}</div>
                                    <div className="text-sm font-bold text-slate-500 uppercase tracking-tighter">{stat.label}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Features Section */}
                <section className="py-24 bg-white/60 backdrop-blur-xl border-y border-white">
                    <div className="container mx-auto px-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                            {t.features.map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                                    style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-lg ${isUz ? "bg-blue-50" : "bg-orange-50"}`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-blue-600 transition-colors">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">
                                        {feature.desc}
                                    </p>
                                </div>
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
                                <div
                                    key={idx}
                                    className="relative animate-in fade-in zoom-in"
                                    style={{ animationDelay: `${idx * 200}ms`, animationFillMode: 'both' }}
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
                                        <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-slate-200 z-0 group-hover:bg-slate-400 transition-colors"></div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Testimonials Section */}
                <section className="py-24 bg-white/60 backdrop-blur-xl border-y border-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-slate-900">
                            {t.testimonials.title}
                        </h2>
                        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
                            {t.testimonials.items.map((item, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-right-8"
                                    style={{ animationDelay: `${idx * 300}ms`, animationFillMode: 'both' }}
                                >
                                    <div className="flex gap-1 mb-6">
                                        {[...Array(item.rating)].map((_, i) => (
                                            <svg key={i} className="w-6 h-6 text-yellow-400 animate-pulse" style={{ animationDelay: `${i * 100}ms` }} fill="currentColor" viewBox="0 0 20 20">
                                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                            </svg>
                                        ))}
                                    </div>
                                    <p className="text-xl text-slate-600 mb-8 italic leading-relaxed">"{item.text}"</p>
                                    <div className="flex items-center gap-4 group/author">
                                        <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-black text-2xl shadow-lg transform group-hover/author:scale-110 transition-transform duration-300 ${isUz ? "bg-blue-600" : "bg-orange-600"}`}>
                                            {item.name.charAt(0)}
                                        </div>
                                        <div>
                                            <div className="font-black text-slate-900 text-lg group-hover/author:text-blue-600 transition-colors">{item.name}</div>
                                            <div className="text-slate-500 font-bold">{item.role}</div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32">
                    <div className="container mx-auto px-4">
                        <div className={`rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl ${isUz ? "bg-blue-600 shadow-blue-500/20" : "bg-[#FE9B19] shadow-orange-500/20"}`}>
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-10 leading-tight tracking-tight relative z-10">
                                {t.finalCta}
                            </h2>
                            <button
                                onClick={handleStart}
                                className="px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative z-10"
                            >
                                {isUz ? "Hozir boshlang" : "今すぐ始める"}
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx>{`
                @keyframes pulse-slow {
                    0%, 100% { transform: scale(1) rotate(2deg); opacity: 0.4; }
                    50% { transform: scale(1.05) rotate(4deg); opacity: 0.6; }
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
