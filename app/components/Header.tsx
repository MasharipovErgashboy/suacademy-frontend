"use client";


import Link from "next/link";
import FeedbackModal from "./FeedbackModal";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { translations, Language } from "../lib/translations";
import { API_BASE_URL, fetchWithAuth, isAuthenticated } from "../lib/auth";
import { AnimatePresence, motion } from "framer-motion";

export default function Header() {

    const pathname = usePathname();
    const [nationality, setNationality] = useState<Language>("uz");
    const [user, setUser] = useState<any>(null);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

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
    const isUz = nationality === "uz";

    const navItems = [
        { label: t.home, href: "/home" },
        { label: t.lessons, href: "/lessons" },
        { label: t.vocabulary, href: "/vocabulary" },
        { label: t.ebooks, href: "/ebooks" },
        { label: t.ai, href: "/ai" },
        { label: nationality === "uz" ? "O'yinlar" : "ゲーム", href: "/games" },
    ];

    return (
        <>
            <header className="bg-white/95 backdrop-blur-xl shadow-sm sticky top-0 z-50 border-b border-slate-100/50">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <Link href="/home" className="flex items-center gap-2 group relative z-50">
                        {isUz ? (
                            <div className="flex items-center text-2xl font-black tracking-tighter">
                                <span className="text-blue-600">SU</span>
                                <span className="text-slate-900 ml-1">Academy</span>
                            </div>
                        ) : (
                            <div className="flex items-center text-2xl font-black tracking-tighter">
                                <span className="text-white bg-[#FE9B19] px-2 rounded-md mr-1">SU</span>
                                <span className="text-slate-900">Academy</span>
                            </div>
                        )}
                    </Link>

                    {/* Desktop Navigation */}
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
                        {/* Mobile Menu Button - Visible on mobile */}
                        <button
                            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                            className="lg:hidden relative z-50 w-10 h-10 flex flex-col justify-center items-center gap-1.5 focus:outline-none"
                            aria-label="Toggle Menu"
                        >
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: 45, y: 8 } : { rotate: 0, y: 0 }}
                                className={`w-8 h-1 rounded-full transition-all ${isUz ? "bg-slate-800" : "bg-slate-800"}`}
                            ></motion.span>
                            <motion.span
                                animate={isMobileMenuOpen ? { opacity: 0 } : { opacity: 1 }}
                                className={`w-8 h-1 rounded-full transition-all ${isUz ? "bg-slate-800" : "bg-slate-800"}`}
                            ></motion.span>
                            <motion.span
                                animate={isMobileMenuOpen ? { rotate: -45, y: -8 } : { rotate: 0, y: 0 }}
                                className={`w-8 h-1 rounded-full transition-all ${isUz ? "bg-slate-800" : "bg-slate-800"}`}
                            ></motion.span>
                        </button>

                        {/* Desktop Subscription & Profile */}
                        <div className="hidden lg:flex items-center gap-3">
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
                </div>

                {/* Mobile Menu Overlay - Premium Slide-in Drawer */}
                <AnimatePresence>
                    {isMobileMenuOpen && (
                        <>
                            {/* Backdrop */}
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                onClick={() => setIsMobileMenuOpen(false)}
                                className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm lg:hidden"
                            />

                            {/* Drawer */}
                            <motion.div
                                initial={{ x: "100%" }}
                                animate={{ x: 0 }}
                                exit={{ x: "100%" }}
                                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                                className="fixed top-0 right-0 bottom-0 z-50 w-[80%] max-w-sm bg-white/95 backdrop-blur-xl shadow-2xl lg:hidden border-l border-white/50 flex flex-col"
                            >
                                {/* Drawer Header */}
                                <div className="p-6 flex items-center justify-between border-b border-slate-100">
                                    <div className="flex items-center gap-2">
                                        {isUz ? (
                                            <div className="flex items-center text-xl font-black tracking-tighter">
                                                <span className="text-blue-600">SU</span>
                                                <span className="text-slate-900 ml-1">Academy</span>
                                            </div>
                                        ) : (
                                            <div className="flex items-center text-xl font-black tracking-tighter">
                                                <span className="text-white bg-[#FE9B19] px-2 rounded-md mr-1">SU</span>
                                                <span className="text-slate-900">Academy</span>
                                            </div>
                                        )}
                                    </div>
                                    <button
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className="p-2 rounded-full hover:bg-slate-100 transition-colors"
                                    >
                                        <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                                    </button>
                                </div>

                                {/* Drawer Body */}
                                <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-2">
                                    {navItems.map((item, idx) => {
                                        const isActive = pathname.startsWith(item.href);
                                        return (
                                            <motion.div
                                                key={item.href}
                                                initial={{ opacity: 0, x: 20 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: idx * 0.05 }}
                                            >
                                                <Link
                                                    href={item.href}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className={`block text-lg font-bold py-3 px-4 rounded-xl transition-all ${isActive
                                                        ? (isUz ? "bg-blue-50 text-blue-600" : "bg-orange-50 text-[#FE9B19]")
                                                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                                                        }`}
                                                >
                                                    {item.label}
                                                </Link>
                                            </motion.div>
                                        );
                                    })}

                                    <div className="h-px bg-slate-100 my-4"></div>

                                    {/* Mobile Actions */}
                                    <motion.div
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: 0.3 }}
                                        className="space-y-3"
                                    >
                                        <Link
                                            href="/subscription"
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 text-white shadow-lg shadow-blue-200 transition-transform active:scale-95 ${isUz ? "bg-blue-600" : "bg-[#FE9B19]"}`}
                                        >
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" /></svg>
                                            <span>{isUz ? "Premium Obuna" : "プレミアム"}</span>
                                        </Link>

                                        {user ? (
                                            <Link
                                                href="/profile"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full py-3.5 rounded-xl bg-slate-50 border border-slate-200 font-bold text-slate-700 flex items-center justify-center gap-3 hover:bg-slate-100 transition-colors"
                                            >
                                                <div className="w-6 h-6 rounded-full overflow-hidden border border-slate-300">
                                                    <img
                                                        src={user.image ? `http://127.0.0.1:8000${user.image}` : `https://ui-avatars.com/api/?name=${user.username}&background=0D8ABC&color=fff`}
                                                        alt={user.username}
                                                        className="w-full h-full object-cover"
                                                    />
                                                </div>
                                                {user.username}
                                            </Link>
                                        ) : (
                                            <Link
                                                href="/login"
                                                onClick={() => setIsMobileMenuOpen(false)}
                                                className="w-full py-3.5 rounded-xl bg-slate-900 text-white font-bold text-center shadow-lg shadow-slate-200"
                                            >
                                                {isUz ? "Kirish" : "ログイン"}
                                            </Link>
                                        )}
                                    </motion.div>
                                </div>

                                {/* Drawer Footer */}
                                <div className="p-6 border-t border-slate-100/50">
                                    <div className="text-center text-xs text-slate-400 font-medium">
                                        © 2024 SU Academy
                                    </div>
                                </div>
                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </header>

            {/* Feedback Modal Integration */}
            <FeedbackModal isOpen={isFeedbackOpen} onClose={() => setIsFeedbackOpen(false)} nationality={nationality} />

            {/* Floating Feedback Button */}
            <button
                onClick={() => setIsFeedbackOpen(true)}
                className={`fixed bottom-8 right-8 z-50 w-16 h-16 text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 transition-all duration-300 animate-bounce-slow ${isUz ? "bg-blue-600 shadow-blue-500/40 hover:bg-blue-700" : "bg-[#FE9B19] shadow-orange-500/40 hover:bg-orange-600"}`}
                title={isUz ? "Fikr-mulohaza" : "フィードバック"}
            >
                <span className={`absolute inline-flex h-full w-full rounded-full opacity-20 animate-ping ${isUz ? "bg-blue-400" : "bg-orange-400"}`}></span>
                <svg className="w-7 h-7 relative z-10" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" /></svg>
            </button>
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
