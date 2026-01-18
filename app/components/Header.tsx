"use client";


import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { translations, Language } from "../lib/translations";
import { API_BASE_URL, fetchWithAuth, isAuthenticated } from "../lib/auth";

export default function Header() {

    const pathname = usePathname();
    const [nationality, setNationality] = useState<Language>("uz");
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const saved = localStorage.getItem("nationality") as Language;
        if (saved) setNationality(saved);

        // Load user from local storage
        const loadUser = () => {
            const userStr = localStorage.getItem("user");
            if (userStr) setUser(JSON.parse(userStr));
        };
        loadUser();

        // Check session validity (To handle deleted users)
        if (isAuthenticated()) {
            verifySession();
        }

        // Listen for user updates
        window.addEventListener("user-updated", loadUser);
        return () => window.removeEventListener("user-updated", loadUser);
    }, []);

    const verifySession = async () => {
        try {
            const response = await fetchWithAuth(`${API_BASE_URL}/profile/`);
            if (response.ok) {
                const userData = await response.json();
                localStorage.setItem("user", JSON.stringify(userData));
                window.dispatchEvent(new Event("user-updated"));
            }
        } catch (error) {
            console.error("Session verification failed:", error);
        }
    };

    const t = translations[nationality].header;

    const navItems = [
        { label: t.home, href: "/home" },
        { label: t.lessons, href: "/lessons" },
        { label: t.vocabulary, href: "/vocabulary" },
        { label: t.ebooks, href: "/ebooks" },
        { label: t.ai, href: "/ai" },
        { label: nationality === "uz" ? "O'yinlar" : "ゲーム", href: "/games" },
    ];

    const isUz = nationality === "uz";

    return (
        <>
            <header className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 border-b border-white/50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/home" className="flex items-center gap-2 group">
                        {isUz ? (
                            // Use uploaded logo for Uzbek users
                            // Text-based logo for proper dark mode coloring
                            <div className="flex items-center text-2xl font-black tracking-tighter">
                                <span className="text-blue-600">SU</span>
                                <span className="text-slate-900 ml-1">Academy</span>
                            </div>
                        ) : (
                            // Use uploaded logo for Japanese/Other users
                            // Text-based logo for proper dark mode coloring
                            <div className="flex items-center text-2xl font-black tracking-tighter">
                                <span className="text-[#FE9B19]">SU</span>
                                <span className="text-slate-900 ml-1">Academy</span>
                            </div>
                        )}
                    </Link>

                    {/* Navigation - Pill Style */}
                    <nav className="hidden lg:flex items-center gap-1 p-1.5 bg-slate-100 rounded-full border border-slate-200">
                        {navItems.map((item) => {
                            const isActive = pathname.startsWith(item.href);
                            return (
                                <Link
                                    key={item.href}
                                    href={item.href}
                                    className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${isActive
                                        ? (isUz ? "bg-white text-blue-600 shadow-md transform scale-105" : "bg-white text-[#FE9B19] shadow-md transform scale-105")
                                        : (isUz ? "text-slate-500 hover:text-slate-800 hover:bg-slate-200/50" : "text-slate-500 hover:text-slate-800 hover:bg-orange-100/50")
                                        }`}
                                >
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-3">
                        {/* Subscription Icon Button */}
                        <Link
                            href="/subscription"
                            className={`w-10 h-10 flex items-center justify-center rounded-full bg-gradient-to-r transition-all duration-300 shadow-md hover:scale-110 group ${isUz ? "from-blue-100 to-indigo-100 text-blue-600 hover:from-blue-400 hover:to-indigo-500 hover:text-white hover:shadow-blue-200" : "from-amber-100 to-orange-100 text-amber-600 hover:from-amber-400 hover:to-orange-500 hover:text-white hover:shadow-orange-200"}`}
                            title={isUz ? "Obuna" : "サブスクリプション"}
                        >
                            <svg className="w-5 h-5 transition-transform group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" /></svg>
                        </Link>

                        {/* Profile Link */}
                        {user ? (
                            <Link href="/profile" className="flex items-center gap-3 pl-1 pr-2 py-1 rounded-full hover:bg-slate-50 border border-transparent hover:border-slate-200 transition-all group">
                                <div className="w-9 h-9 rounded-full overflow-hidden border-2 border-white shadow-sm group-hover:scale-105 transition-transform">
                                    <img
                                        src={user.image ? `http://127.0.0.1:8000${user.image}` : `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                                        alt={user.username}
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                <span className="text-sm font-bold text-slate-700 max-w-[80px] truncate hidden md:block">{user.username}</span>
                            </Link>
                        ) : (
                            <Link href="/login" className="px-6 py-2.5 rounded-xl bg-slate-900 text-white font-bold text-sm hover:bg-slate-800 transition-all hover:shadow-lg hover:-translate-y-0.5">
                                {isUz ? "Kirish" : "ログイン"}
                            </Link>
                        )}
                    </div>
                </div>
            </header>

            {/* Floating Feedback Button */}
            <Link
                href="/feedback"
                className={`fixed bottom-8 right-8 z-50 w-16 h-16 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce-slow ${isUz ? "bg-blue-600 shadow-blue-500/40 hover:bg-blue-700" : "bg-[#FE9B19] shadow-orange-500/40 hover:bg-orange-600"}`}
                title={isUz ? "Fikr-mulohaza" : "フィードバック"}
            >
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-20 animate-ping ${isUz ? "bg-blue-400" : "bg-orange-400"}`}></span>
                <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </Link>
            <style jsx global>{`
                @keyframes bounce-slow {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-10px); }
                }
                .animate-bounce-slow {
                    animation: bounce-slow 3s infinite ease-in-out;
                }
                .animate-spin-slow {
                    animation: spin 3s linear infinite;
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }
            `}</style>
        </>
    );
}
