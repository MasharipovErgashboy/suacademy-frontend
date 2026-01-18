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
                            {/* Telegram */}
                            <a
                                href="https://t.me/su_academya"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 ${isUz ? "bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white" : "bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white"}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z" />
                                </svg>
                            </a>

                            {/* Instagram */}
                            <a
                                href="https://www.instagram.com/su_akademya/"
                                target="_blank"
                                rel="noopener noreferrer"
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all hover:-translate-y-1 ${isUz ? "bg-blue-500/10 hover:bg-blue-500 text-blue-500 hover:text-white" : "bg-orange-500/10 hover:bg-orange-500 text-orange-500 hover:text-white"}`}
                            >
                                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                                </svg>
                            </a>
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
