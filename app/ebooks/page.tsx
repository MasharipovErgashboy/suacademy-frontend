"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Header from "../components/Header";
import Footer from "../components/Footer";
import Image from "next/image";

export default function EBookPage() {
    const router = useRouter();
    const [nationality, setNationality] = useState<string>(() => {
        if (typeof window !== "undefined") {
            return localStorage.getItem("nationality") || "uz";
        }
        return "uz";
    });

    const isUz = nationality === "uz";

    const content = {
        uz: {
            hero: {
                title: "Bir Kunda Bir Suhbat",
                subtitle: "Yapon tilida suhbatlashishni 0 dan o'rganish",
                description: "25 ta kundalik hayot mavzusi orqali yapon tilida erkin gaplashishni boshlang",
                cta: "Kitobni o'qishni boshlash"
            },
            overview: {
                title: "Kitob haqida",
                topics: "25 ta mavzu",
                topicsDesc: "Kundalik hayotdagi voqealar",
                bilingual: "Ikki tilda",
                bilingualDesc: "O'zbek ↔ Yapon",
                audio: "Audio QR",
                audioDesc: "Telegram bot orqali",
                fromZero: "0 dan boshlang",
                fromZeroDesc: "Oldindan bilim shart emas"
            },
            qrSection: {
                title: "QR Code funksiyasi",
                subtitle: "Har bir mavzu yonida QR code mavjud",
                step1: "Mavzu yonidagi QR code ni scan qiling",
                step2: "Telegram bot ochiladi",
                step3: "Mavzu audiosini tinglang",
                benefit: "Talaffuzni to'g'ri o'rganish uchun audio muhim!"
            },
            partners: {
                title: "Hamkorlarimiz",
                library: {
                    name: "Alisher Navoiy Nomidagi O'zbekiston Milliy Kutibxonasi",
                    desc: "Milliy kutubxona"
                },
                asaxiy: {
                    name: "Asaxiy Market",
                    desc: "Yetakchi kitob do'koni"
                },
                sarmoya: {
                    name: "Sarmoya Books",
                    desc: "Nashriyot va kitob do'koni"
                }
            },
            finalCta: {
                title: "Yapon tilini bugunoq boshlang!",
                subtitle: "25 ta mavzu, audio qo'llab-quvvatlash va kundalik suhbatlar",
                button: "Kitobni hozir o'qing"
            }
        },
        ja: {
            hero: {
                title: "Bir Kunda Bir Suhbat",
                subtitle: "ウズベク語会話をゼロから学ぶ",
                description: "25の日常生活トピックでウズベク語を自由に話せるようになる",
                cta: "本を読み始める"
            },
            overview: {
                title: "本について",
                topics: "25のトピック",
                topicsDesc: "日常生活のシーン",
                bilingual: "バイリンガル",
                bilingualDesc: "ウズベク語 ↔ 日本語",
                audio: "音声QR",
                audioDesc: "Telegramボット経由",
                fromZero: "ゼロから",
                fromZeroDesc: "予備知識不要"
            },
            qrSection: {
                title: "QRコード機能",
                subtitle: "各トピックの横にQRコードがあります",
                step1: "トピック横のQRコードをスキャン",
                step2: "Telegramボットが開きます",
                step3: "トピックの音声を聞く",
                benefit: "正しい発音を学ぶために音声は重要です！"
            },
            partners: {
                title: "パートナー",
                library: {
                    name: "アリシェル・ナヴォイー記念ウズベキスタン国立図書館",
                    desc: "国立図書館"
                },
                asaxiy: {
                    name: "Asaxiy Market",
                    desc: "大手書店"
                },
                sarmoya: {
                    name: "Sarmoya Books",
                    desc: "出版社・書店"
                }
            },
            finalCta: {
                title: "今日からウズベク語を始めましょう！",
                subtitle: "25のトピック、音声サポート、日常会話",
                button: "今すぐ読む"
            }
        }
    };

    const t = isUz ? content.uz : content.ja;

    return (
        <div className="min-h-screen bg-[#FFF4E6] flex flex-col" suppressHydrationWarning>
            <Header />

            <main className="flex-grow">
                {/* Hero Section */}
                <section className="relative pt-20 pb-32 overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="flex flex-col lg:flex-row items-center gap-16">
                            {/* Text Content */}
                            <div className="flex-1 text-center lg:text-left animate-in fade-in slide-in-from-left-12 duration-1000">
                                <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-6 leading-[1.1]">
                                    {t.hero.title}
                                </h1>
                                <p className="text-2xl font-bold text-slate-700 mb-4">
                                    {t.hero.subtitle}
                                </p>
                                <p className="text-xl text-slate-600 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                                    {t.hero.description}
                                </p>
                                <button
                                    onClick={() => {/* Will add reader page later */ }}
                                    className={`px-12 py-6 rounded-full font-black text-white text-xl shadow-2xl transition-all hover:scale-110 active:scale-95 duration-300 ${isUz ? "bg-blue-600 shadow-blue-500/40 hover:bg-blue-700" : "bg-orange-500 shadow-orange-500/40 hover:bg-orange-600"}`}
                                >
                                    {t.hero.cta}
                                </button>
                            </div>

                            {/* Book Cover */}
                            <div className="flex-1 relative animate-in fade-in zoom-in duration-1000 delay-300">
                                <div className="relative z-10 w-full max-w-md mx-auto">
                                    {/* Book Cover Card */}
                                    <div className="relative aspect-[3/4] bg-gradient-to-br from-slate-800 to-slate-900 rounded-[2rem] shadow-2xl overflow-hidden transform hover:scale-105 transition-all duration-500 animate-float">
                                        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 to-orange-500/20"></div>
                                        <div className="relative z-10 p-8 h-full flex flex-col justify-between">
                                            <div>
                                                <div className="text-sm font-bold text-blue-400 mb-2">NEW EDITION</div>
                                                <h2 className="text-3xl font-black text-white mb-4 leading-tight">
                                                    Bir Kunda<br />Bir Suhbat
                                                </h2>
                                                <div className="text-sm text-slate-300 space-y-1">
                                                    <div>一日一会話</div>
                                                    <div>Conversation Book</div>
                                                </div>
                                            </div>

                                            <div className="space-y-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
                                                        <span className="text-2xl">🗣️</span>
                                                    </div>
                                                    <div className="text-white text-sm font-bold">25 Topics</div>
                                                </div>
                                                <div className="flex items-center gap-3">
                                                    <div className="w-12 h-12 bg-white/10 backdrop-blur-xl rounded-xl flex items-center justify-center">
                                                        <span className="text-2xl">📱</span>
                                                    </div>
                                                    <div className="text-white text-sm font-bold">QR Audio</div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Floating Badge */}
                                    <div className="absolute -top-4 -right-4 z-20 bg-green-500 text-white px-6 py-3 rounded-2xl font-black shadow-xl animate-bounce-slow">
                                        🎧 + QR
                                    </div>
                                </div>

                                {/* Decorative Elements */}
                                <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] blur-[120px] opacity-20 -z-10 rounded-full ${isUz ? "bg-blue-400" : "bg-orange-400"}`}></div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Overview Section */}
                <section className="py-24 bg-white/60 backdrop-blur-xl border-y border-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-slate-900">
                            {t.overview.title}
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                            {[
                                { icon: "📚", title: t.overview.topics, desc: t.overview.topicsDesc, color: "blue" },
                                { icon: "🌍", title: t.overview.bilingual, desc: t.overview.bilingualDesc, color: "green" },
                                { icon: "🎧", title: t.overview.audio, desc: t.overview.audioDesc, color: "orange" },
                                { icon: "✨", title: t.overview.fromZero, desc: t.overview.fromZeroDesc, color: "purple" }
                            ].map((feature, idx) => (
                                <div
                                    key={idx}
                                    className="group p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-xl hover:shadow-2xl hover:-translate-y-2 transition-all duration-500 animate-in fade-in slide-in-from-bottom-8"
                                    style={{ animationDelay: `${idx * 150}ms`, animationFillMode: 'both' }}
                                >
                                    <div className={`w-16 h-16 rounded-2xl flex items-center justify-center text-4xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-sm group-hover:shadow-lg bg-${feature.color}-50`}>
                                        {feature.icon}
                                    </div>
                                    <h3 className="text-2xl font-black text-slate-900 mb-3">{feature.title}</h3>
                                    <p className="text-slate-600 leading-relaxed font-medium">{feature.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* QR Code Section */}
                <section className="py-32 relative overflow-hidden">
                    <div className="container mx-auto px-4">
                        <div className="max-w-5xl mx-auto">
                            <div className="text-center mb-16">
                                <h2 className="text-4xl md:text-6xl font-black text-slate-900 mb-6">
                                    {t.qrSection.title}
                                </h2>
                                <p className="text-xl text-slate-600 font-medium">
                                    {t.qrSection.subtitle}
                                </p>
                            </div>

                            <div className="grid md:grid-cols-3 gap-8 mb-12">
                                {[
                                    { step: "1", text: t.qrSection.step1, icon: "📱" },
                                    { step: "2", text: t.qrSection.step2, icon: "🤖" },
                                    { step: "3", text: t.qrSection.step3, icon: "🎧" }
                                ].map((item, idx) => (
                                    <div key={idx} className="relative animate-in fade-in zoom-in" style={{ animationDelay: `${idx * 200}ms`, animationFillMode: 'both' }}>
                                        <div className="bg-white rounded-[2rem] p-8 h-full border border-slate-100 shadow-xl relative z-10 group hover:bg-green-50 transition-all duration-500">
                                            <div className="text-6xl font-black mb-6 opacity-20 text-green-600 group-hover:opacity-30 group-hover:scale-110 transition-all duration-500">
                                                {item.step}
                                            </div>
                                            <div className="text-5xl mb-4">{item.icon}</div>
                                            <p className="text-lg font-bold text-slate-800 leading-tight">
                                                {item.text}
                                            </p>
                                        </div>
                                        {idx < 2 && (
                                            <div className="hidden md:block absolute top-1/2 -right-4 w-8 h-px bg-slate-200 z-0"></div>
                                        )}
                                    </div>
                                ))}
                            </div>

                            <div className="bg-gradient-to-r from-green-50 to-green-100 rounded-[2rem] p-8 border-2 border-green-200">
                                <div className="flex items-center gap-4">
                                    <div className="text-4xl">💡</div>
                                    <p className="text-lg font-bold text-green-900">
                                        {t.qrSection.benefit}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                {/* Partners Section */}
                <section className="py-24 bg-white/60 backdrop-blur-xl border-y border-white">
                    <div className="container mx-auto px-4">
                        <h2 className="text-4xl md:text-5xl font-black text-center mb-16 text-slate-900">
                            {t.partners.title}
                        </h2>
                        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
                            {[
                                { ...t.partners.library, icon: "🏛️" },
                                { ...t.partners.asaxiy, icon: "📚" },
                                { ...t.partners.sarmoya, icon: "📖" }
                            ].map((partner, idx) => (
                                <div
                                    key={idx}
                                    className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-xl hover:shadow-2xl transition-all duration-500 animate-in fade-in slide-in-from-bottom-8 group"
                                    style={{ animationDelay: `${idx * 200}ms`, animationFillMode: 'both' }}
                                >
                                    <div className="text-6xl mb-6 transform group-hover:scale-110 transition-transform duration-300">
                                        {partner.icon}
                                    </div>
                                    <h3 className="text-xl font-black text-slate-900 mb-3 leading-tight">
                                        {partner.name}
                                    </h3>
                                    <p className="text-slate-600 font-medium">{partner.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                {/* Final CTA */}
                <section className="py-32">
                    <div className="container mx-auto px-4">
                        <div className={`rounded-[3.5rem] p-12 md:p-24 text-center relative overflow-hidden shadow-2xl ${isUz ? "bg-blue-600 shadow-blue-500/20" : "bg-orange-500 shadow-orange-500/20"}`}>
                            <div className="absolute top-0 left-0 w-full h-full opacity-10 pointer-events-none">
                                <div className="absolute top-0 left-0 w-96 h-96 bg-white rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2"></div>
                                <div className="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full blur-[100px] translate-x-1/2 translate-y-1/2"></div>
                            </div>

                            <h2 className="text-4xl md:text-6xl font-black text-white mb-6 leading-tight tracking-tight relative z-10">
                                {t.finalCta.title}
                            </h2>
                            <p className="text-xl text-white/90 mb-10 relative z-10 max-w-2xl mx-auto">
                                {t.finalCta.subtitle}
                            </p>
                            <button
                                onClick={() => {/* Will add reader page later */ }}
                                className="px-12 py-6 bg-white text-slate-900 rounded-full font-black text-xl shadow-2xl hover:scale-110 active:scale-95 transition-all duration-300 relative z-10"
                            >
                                {t.finalCta.button}
                            </button>
                        </div>
                    </div>
                </section>
            </main>

            <Footer />

            <style jsx>{`
                @keyframes float {
                    0%, 100% { transform: translateY(0px) rotate(-2deg); }
                    50% { transform: translateY(-20px) rotate(2deg); }
                }
                .animate-float {
                    animation: float 6s ease-in-out infinite;
                }
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite ease-in-out;
                }
            `}</style>
        </div>
    );
}
