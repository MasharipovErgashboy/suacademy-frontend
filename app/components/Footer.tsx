"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Language } from "../lib/translations";

export default function Footer() {
    const [nationality, setNationality] = useState<Language>("uz");

    useEffect(() => {
        const saved = localStorage.getItem("nationality") as Language;
        if (saved) setNationality(saved);
    }, []);

    const isUz = nationality === "uz";

    const content = {
        uz: {
            about: "Biz haqimizda",
            aboutText: "SU Academy - Yapon tilini o'rganish uchun eng zamonaviy platforma. Biz bilan orzularingizga erishing.",
            links: "Foydali havolalar",
            contact: "Bog'lanish",
            rights: "Barcha huquqlar himoyalangan.",
            items: [
                { label: "Bosh sahifa", href: "/home" },
                { label: "Darslar", href: "/lessons" },
                { label: "Obuna", href: "/subscription" },
                { label: "O'yinlar", href: "/games" },
            ]
        },
        ja: {
            about: "私たちについて",
            aboutText: "SU Academyは、ウズベク語を学ぶための最先端のプラットフォームです。私たちと一緒に夢を実現しましょう。",
            links: "役に立つリンク",
            contact: "お問い合わせ",
            rights: "全著作権所有。",
            items: [
                { label: "ホーム", href: "/home" },
                { label: "レッスン", href: "/lessons" },
                { label: "サブスクリプション", href: "/subscription" },
                { label: "ゲーム", href: "/games" },
            ]
        }
    };

    const t = content[nationality === "uz" ? "uz" : "ja"];

    return (
        <footer className={`relative mt-20 pt-20 pb-10 overflow-hidden ${isUz ? "bg-slate-900" : "bg-zinc-900"}`}>
            {/* Background Gradients */}
            <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
                <div className={`absolute -top-[50%] -left-[10%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-20 ${isUz ? "bg-blue-600" : "bg-orange-600"}`}></div>
                <div className={`absolute -bottom-[50%] -right-[10%] w-[80%] h-[80%] rounded-full blur-[120px] opacity-20 ${isUz ? "bg-purple-600" : "bg-red-600"}`}></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-16">
                    {/* Brand Section */}
                    <div className="space-y-6">
                        <Link href="/home" className="flex items-center gap-2 group">
                            {isUz ? (
                                <img src="/images/logo.png" alt="SU Academy" className="h-10 w-auto object-contain brightness-0 invert" />
                            ) : (
                                <img src="/images/logo_jp.png" alt="SU Academy" className="h-10 w-auto object-contain brightness-0 invert" />
                            )}
                        </Link>
                        <p className="text-gray-400 leading-relaxed max-w-sm">
                            {t.aboutText}
                        </p>
                        <div className="flex gap-4">
                            {/* Social Icons Placeholder */}
                            {[1, 2, 3].map((i) => (
                                <div key={i} className={`w-10 h-10 rounded-full flex items-center justify-center transition-all cursor-pointer ${isUz ? "bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white" : "bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white"}`}>
                                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 0c-6.627 0-12 5.373-12 12s5.373 12 12 12 12-5.373 12-12-5.373-12-12-12zm3 8h-1.35c-.538 0-.65.221-.65.778v1.222h2l-.209 2h-1.791v7h-3v-7h-2v-2h2v-2.308c0-1.769.931-2.692 3.029-2.692 1.159 0 1.928.087 2.219.125v1.867z" /></svg>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Links Section */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            {t.links}
                            <span className={`absolute -bottom-2 left-0 w-1/2 h-1 rounded-full ${isUz ? "bg-blue-500" : "bg-orange-500"}`}></span>
                        </h3>
                        <ul className="space-y-4">
                            {t.items.map((item, idx) => (
                                <li key={idx}>
                                    <Link href={item.href} className={`text-gray-400 transition-colors flex items-center gap-2 group ${isUz ? "hover:text-blue-400" : "hover:text-orange-400"}`}>
                                        <span className={`w-1.5 h-1.5 rounded-full transition-all group-hover:scale-150 ${isUz ? "bg-blue-500" : "bg-orange-500"}`}></span>
                                        {item.label}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Contact or Addon */}
                    <div>
                        <h3 className="text-white font-bold text-lg mb-6 relative inline-block">
                            {t.contact}
                            <span className={`absolute -bottom-2 left-0 w-1/2 h-1 rounded-full ${isUz ? "bg-blue-500" : "bg-orange-500"}`}></span>
                        </h3>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3 text-gray-400">
                                <svg className={`w-6 h-6 mt-0.5 ${isUz ? "text-blue-500" : "text-orange-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                <span>info@su_academy.uz</span>
                            </li>
                            <li className="flex items-start gap-3 text-gray-400">
                                <svg className={`w-6 h-6 mt-0.5 ${isUz ? "text-blue-500" : "text-orange-500"}`} fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                                <span>Tashkent, Uzbekistan</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-8 text-center">
                    <p className="text-gray-500 text-sm">
                        &copy; {new Date().getFullYear()} SU Academy. {t.rights}
                    </p>
                </div>
            </div>
        </footer>
    );
}
