"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { BACKEND_URL, API_BASE_URL, fetchWithAuth, isAuthenticated, User } from "../lib/auth";
import Header from "../components/Header";

interface Notification {
    id: number;
    title: string;
    message: string;
    is_read: boolean;
    created_at: string;
}

export default function ProfilePage() {
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<"info" | "subscription" | "messages">("info");
    const [isEditing, setIsEditing] = useState(false);
    const [newUsername, setNewUsername] = useState("");
    const [message, setMessage] = useState<{ text: string; type: "success" | "error" } | null>(null);
    const [notifications, setNotifications] = useState<Notification[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Fetch Profile
    useEffect(() => {
        if (!isAuthenticated()) {
            router.push("/login");
            return;
        }
        fetchProfile();
        fetchNotifications();
    }, [router]);

    const fetchProfile = async () => {
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/profile/`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setUser(data);
                setNewUsername(data.username);
                localStorage.setItem("user", JSON.stringify(data));
                window.dispatchEvent(new Event("user-updated"));
            } else {
                if (res.status === 401) return;
                throw new Error("Failed to load profile");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchNotifications = async () => {
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/notifications/`, { cache: "no-store" });
            if (res.ok) {
                const data = await res.json();
                setNotifications(data);
            }
        } catch (e) {
            console.error("Notifications error", e);
        }
    };

    const markAsRead = async (id: number) => {
        try {
            await fetchWithAuth(`${API_BASE_URL}/notifications/${id}/read/`, { method: "POST" });
            fetchNotifications(); // Refresh list
        } catch (e) {
            console.error(e);
        }
    };

    const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            const formData = new FormData();
            formData.append("image", file);

            try {
                const token = localStorage.getItem("access_token");
                const res = await fetch(`${API_BASE_URL}/profile/`, {
                    method: "PATCH",
                    headers: { "Authorization": `Bearer ${token}` },
                    body: formData
                });

                if (res.ok) {
                    const updatedUser = await res.json();
                    setUser(updatedUser);
                    localStorage.setItem("user", JSON.stringify(updatedUser)); // Sync header
                    window.dispatchEvent(new Event("user-updated"));
                    setMessage({ text: "Profil rasmi yangilandi!", type: "success" });
                    setTimeout(() => setMessage(null), 3000);
                } else {
                    throw new Error("Rasm yuklashda xatolik");
                }
            } catch (err) {
                setMessage({ text: "Rasm yuklab bo'lmadi.", type: "error" });
            }
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        setMessage(null);
        try {
            const res = await fetchWithAuth(`${API_BASE_URL}/profile/`, {
                method: "PATCH",
                body: JSON.stringify({ username: newUsername })
            });

            if (res.ok) {
                const updatedUser = await res.json();
                setUser(updatedUser);
                setIsEditing(false);
                localStorage.setItem("user", JSON.stringify(updatedUser));
                window.dispatchEvent(new Event("user-updated"));
                setMessage({ text: "Ma'lumotlar saqlandi!", type: "success" });
                setTimeout(() => setMessage(null), 3000);
            } else {
                setMessage({ text: "Xatolik yuz berdi", type: "error" });
            }
        } catch (err) {
            setMessage({ text: "Server xatosi", type: "error" });
        }
    };

    const isUz = user?.nationality === "uz";
    const unreadCount = notifications.filter(n => !n.is_read).length;

    if (loading) return <div className="min-h-screen bg-[#FFF4E6] flex items-center justify-center"><div className={`animate-spin w-10 h-10 border-4 rounded-full border-t-transparent ${isUz ? "border-blue-500" : "border-[#FE9B19]"}`}></div></div>;
    if (!user) return null;



    return (
        <div className="min-h-screen bg-[#FFF4E6] pb-20">
            <Header />

            {/* Background Decorative Blobs */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className={`absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full blur-[100px] animate-pulse ${isUz ? "bg-blue-400/10" : "bg-orange-400/10"}`}></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-orange-400/10 blur-[100px] animate-pulse delay-1000"></div>
            </div>

            <div className="max-w-5xl mx-auto px-4 relative z-10 pt-8">

                {/* Profile Header Card */}
                <div className="bg-white/70 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-white/60 mb-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group hover:shadow-2xl transition-all duration-500">
                    <div className={`absolute top-0 right-0 w-64 h-64 bg-gradient-to-br rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 group-hover:scale-110 transition-transform duration-700 ${isUz ? "from-blue-500/20 to-purple-500/20" : "from-orange-500/20 to-red-500/20"}`}></div>

                    {/* Avatar Section */}
                    <div className="relative">
                        <div className={`w-36 h-36 rounded-full p-1 bg-gradient-to-br shadow-lg ${isUz ? "from-blue-500 to-indigo-500" : "from-[#FE9B19] to-orange-600"}`}>
                            <div className="w-full h-full rounded-full overflow-hidden border-4 border-white bg-white">
                                <img
                                    src={user.image ? `${BACKEND_URL}${user.image}` : `https://ui-avatars.com/api/?name=${user.username}&background=${isUz ? "0D8ABC" : "FE9B19"}&color=fff&size=256`}
                                    alt={user.username}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                        </div>
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            className={`absolute bottom-1 right-1 bg-white p-2.5 rounded-full shadow-lg transition-all hover:scale-110 border ${isUz ? "text-blue-600 hover:bg-blue-50 border-blue-100" : "text-[#FE9B19] hover:bg-orange-50 border-orange-100"}`}
                            title="Rasmni o'zgartirish"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        </button>
                        <input
                            type="file"
                            ref={fileInputRef}
                            className="hidden"
                            accept="image/*"
                            onChange={handleImageChange}
                        />
                    </div>

                    {/* Info Section */}
                    <div className="flex-1 text-center md:text-left z-10">
                        <div className="flex flex-col md:flex-row md:items-end gap-2 mb-2 justify-center md:justify-start">
                            <h1 className="text-4xl font-black text-slate-800 tracking-tight">{user.username}</h1>
                        </div>
                        <p className="text-slate-500 font-medium text-lg mb-6">{user.email}</p>

                        <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                            {user.is_premium ? (
                                <span className="px-4 py-1.5 bg-gradient-to-r from-amber-100 to-orange-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2 border border-amber-200 shadow-sm">
                                    <svg className="w-4 h-4 text-amber-500" fill="currentColor" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                                    Premium Member
                                </span>
                            ) : (
                                <span className="px-4 py-1.5 bg-slate-100 text-slate-600 rounded-full text-xs font-bold uppercase tracking-wider border border-slate-200">
                                    Free Account
                                </span>
                            )}
                            <span className="px-4 py-1.5 bg-blue-50 text-blue-600 rounded-full text-xs font-bold uppercase tracking-wider border border-blue-100">
                                ID: <span className="font-mono">{user.student_id || "---"}</span>
                            </span>
                        </div>
                    </div>
                </div>

                {/* Main Content Layout */}
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">

                    {/* Navigation Sidebar (Desktop) / Horizontal Scroll (Mobile) */}
                    <div className="lg:col-span-1">
                        <div className="bg-white/80 backdrop-blur-xl rounded-2xl p-2 shadow-lg border border-white/50 flex lg:flex-col overflow-x-auto lg:overflow-visible sticky top-24 z-20">
                            {[
                                { id: "info", label: isUz ? "Shaxsiy Ma'lumotlar" : "個人情報", icon: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" },
                                { id: "subscription", label: isUz ? "Obuna va To'lov" : "サブスクリプション", icon: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" },
                                { id: "messages", label: isUz ? "Xabarlar" : "メッセージ", icon: "M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z", count: unreadCount },
                            ].map(tab => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id as any)}
                                    className={`relative flex items-center gap-3 px-4 py-4 rounded-xl font-bold transition-all w-full text-left whitespace-nowrap ${activeTab === tab.id
                                        ? (isUz ? "bg-blue-600 text-white shadow-md shadow-blue-200" : "bg-[#FE9B19] text-white shadow-md shadow-orange-200")
                                        : (isUz ? "text-slate-500 hover:bg-blue-50 hover:text-blue-600" : "text-slate-500 hover:bg-orange-50 hover:text-[#FE9B19]")
                                        }`}
                                >
                                    <svg className="w-5 h-5 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={tab.icon} /></svg>
                                    {tab.label}
                                    {tab.count ? (
                                        <span className="absolute right-4 top-1/2 -translate-y-1/2 bg-red-500 text-white text-[10px] w-5 h-5 flex items-center justify-center rounded-full shadow-lg">
                                            {tab.count}
                                        </span>
                                    ) : null}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Tab Content */}
                    <div className="lg:col-span-3">
                        <div className="bg-white/80 backdrop-blur-xl rounded-[2rem] p-8 shadow-xl border border-white/50 min-h-[500px] relative">
                            {message && (
                                <div className={`absolute top-4 right-4 z-50 px-6 py-3 rounded-xl shadow-xl font-bold flex items-center gap-2 animate-bounce-in ${message.type === 'success' ? 'bg-green-500 text-white' : 'bg-red-500 text-white'}`}>
                                    {message.type === 'success' ? (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                                    ) : (
                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                    )}
                                    {message.text}
                                </div>
                            )}

                            {activeTab === "info" && (
                                <div className="max-w-2xl mx-auto space-y-8 animate-fade-in-up">
                                    <div className="text-center mb-8">
                                        <h2 className="text-3xl font-black text-slate-800 mb-2">{isUz ? "Profil Sozlamalari" : "プロフィールの設定"}</h2>
                                        <p className="text-slate-500 font-medium">{isUz ? "Hisob ma'lumotlarini boshqarish" : "アカウント情報の管理"}</p>
                                    </div>

                                    <form onSubmit={handleUpdateProfile} className="space-y-8">

                                        {/* Section 1: Identity */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                                            <div className="p-4 flex items-center gap-4 border-b border-slate-100">
                                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Username</label>
                                                    {isEditing ? (
                                                        <input
                                                            type="text"
                                                            value={newUsername}
                                                            onChange={(e) => setNewUsername(e.target.value)}
                                                            className="w-full font-bold text-slate-900 outline-none bg-transparent placeholder-slate-300"
                                                            placeholder="Enter username"
                                                            autoFocus
                                                        />
                                                    ) : (
                                                        <div className="font-bold text-slate-900 text-lg">{user.username}</div>
                                                    )}
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={() => setIsEditing(!isEditing)}
                                                    className={`p-2 rounded-full transition-colors ${isEditing ? 'bg-blue-100 text-blue-600' : 'hover:bg-slate-100 text-slate-400'}`}
                                                >
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" /></svg>
                                                </button>
                                            </div>

                                            <div className="p-4 flex items-center gap-4">
                                                <div className="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center text-amber-600">
                                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                                                </div>
                                                <div className="flex-1">
                                                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Email</label>
                                                    <div className="font-bold text-slate-900 text-lg truncate pr-4">{user.email}</div>
                                                </div>
                                                {user.is_verified && (
                                                    <span className="text-green-500" title="Verified">
                                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                    </span>
                                                )}
                                            </div>
                                        </div>

                                        {isEditing && (
                                            <div className="flex gap-4 animate-fade-in-up">
                                                <button
                                                    type="submit"
                                                    className={`flex-1 py-3 text-white rounded-xl font-bold shadow-lg transition-all active:scale-95 ${isUz ? "bg-blue-600 shadow-blue-200 hover:bg-blue-700" : "bg-[#FE9B19] shadow-orange-200 hover:bg-[#e68a14]"}`}
                                                >
                                                    {isUz ? "Saqlash" : "保存"}
                                                </button>
                                                <button
                                                    type="button"
                                                    onClick={() => { setIsEditing(false); setNewUsername(user.username); }}
                                                    className="px-6 py-3 bg-slate-100 text-slate-600 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                                                >
                                                    Cancel
                                                </button>
                                            </div>
                                        )}

                                        {/* Section 2: Actions */}
                                        <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden divide-y divide-slate-100">
                                            <button
                                                type="button"
                                                onClick={() => router.push("/forgot-password")}
                                                className="w-full p-5 flex items-center justify-between hover:bg-slate-50 transition-colors group text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500 group-hover:bg-indigo-100 group-hover:text-indigo-600 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
                                                    </div>
                                                    <span className="font-bold text-slate-700 group-hover:text-slate-900">{isUz ? "Parolni o'zgartirish" : "パスワードを変更"}</span>
                                                </div>
                                                <svg className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>

                                            <button
                                                type="button"
                                                onClick={() => {
                                                    if (confirm(isUz ? "Chiqishni tasdiqlaysizmi?" : "ログアウトしますか？")) {
                                                        localStorage.removeItem("access_token");
                                                        localStorage.removeItem("refresh_token");
                                                        localStorage.removeItem("user");
                                                        localStorage.removeItem("user_data");
                                                        window.dispatchEvent(new Event("user-updated"));
                                                        router.push("/login");
                                                    }
                                                }}
                                                className="w-full p-5 flex items-center justify-between hover:bg-red-50 transition-colors group text-left"
                                            >
                                                <div className="flex items-center gap-4">
                                                    <div className="w-8 h-8 rounded-lg bg-red-50 flex items-center justify-center text-red-500 group-hover:bg-red-100 group-hover:text-red-600 transition-colors">
                                                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                                                    </div>
                                                    <span className="font-bold text-slate-700 group-hover:text-red-600 transition-colors">{isUz ? "Chiqish" : "ログアウト"}</span>
                                                </div>
                                                <svg className="w-5 h-5 text-slate-300 group-hover:text-red-400 transform group-hover:translate-x-1 transition-all" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            )}

                            {activeTab === "subscription" && (
                                <div className="py-4">
                                    <h2 className="text-2xl font-black text-slate-800 mb-2">{isUz ? "Mening Obunam" : "私のサブスクリプション"}</h2>
                                    <p className="text-slate-500 mb-8">{isUz ? "Premium imkoniyatlardan foydalaning" : "プレミアム機能にアクセスする"}</p>

                                    {user.subscription ? (
                                        <div className="bg-slate-900 rounded-3xl p-8 text-white relative overflow-hidden shadow-2xl shadow-slate-300 group">
                                            <div className="absolute top-0 right-0 p-8 opacity-20 transform translate-x-10 -translate-y-10 group-hover:translate-x-0 group-hover:translate-y-0 transition-transform duration-700">
                                                <svg className="w-64 h-64" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" /></svg>
                                            </div>
                                            <div className="relative z-10">
                                                <div className="inline-block px-3 py-1 bg-amber-400 text-slate-900 rounded-lg text-xs font-bold uppercase tracking-wider mb-4">
                                                    Current Plan
                                                </div>
                                                <h3 className="text-4xl font-black mb-2 tracking-tight">{user.subscription.plan}</h3>
                                                <p className="text-slate-400 mb-8 max-w-sm">{isUz ? "Premium obuna sizga barcha maxsus darslar va materiallardan cheksiz foydalanish imkonini beradi." : "プレミアムサブスクリプションでは、すべての特別なレッスンと教材に無制限にアクセスできます。"}</p>

                                                <div className="flex items-center gap-6 text-sm text-slate-300 mb-8">
                                                    <div className="flex items-center gap-2 bg-white/10 px-3 py-1.5 rounded-full">
                                                        <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse shadow-[0_0_10px_rgba(74,222,128,0.5)]"></span>
                                                        <span className="font-bold text-white">Active</span>
                                                    </div>
                                                    <div>
                                                        Expires: <span className="text-white font-bold ml-2">{new Date(user.subscription.end_date).toLocaleDateString()}</span>
                                                    </div>
                                                </div>
                                                <button
                                                    onClick={() => router.push("/subscription")}
                                                    className="px-8 py-3 bg-white text-slate-900 rounded-xl font-bold hover:bg-amber-400 hover:text-slate-900 transition-colors shadow-lg shadow-white/10"
                                                >
                                                    {isUz ? "Obunani uzaytirish" : "サブスクリプションの延長"}
                                                </button>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-16 bg-white rounded-3xl border-2 border-dashed border-slate-200 hover:border-blue-300 transition-colors group">
                                            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-sm">
                                                <svg className="w-10 h-10 text-slate-400 group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z" /></svg>
                                            </div>
                                            <h3 className="text-xl font-bold text-slate-900 mb-3">{isUz ? "Hozircha obuna yo'q" : "サブスクリプションはありません"}</h3>
                                            <p className="text-slate-500 mb-8 max-w-xs mx-auto leading-relaxed">
                                                {isUz ? "Premium darslar va eksklyuziv materiallardan foydalanish uchun obuna bo'ling." : "プレミアムレッスンにアクセスするには、購読してください。"}
                                            </p>
                                            <button
                                                onClick={() => router.push("/subscription")}
                                                className={`px-10 py-4 text-white rounded-2xl font-bold shadow-xl transition-all hover:-translate-y-1 ${isUz ? "bg-blue-600 shadow-blue-200 hover:bg-blue-700 hover:shadow-blue-300" : "bg-[#FE9B19] shadow-orange-200 hover:bg-[#e68a14] hover:shadow-orange-300"}`}
                                            >
                                                {isUz ? "Premiumga o'tish" : "プレミアムを入手"}
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}


                            {activeTab === "messages" && (
                                <div>
                                    <h2 className="text-2xl font-black text-slate-800 mb-2">{isUz ? "Xabarlar" : "メッセージ"}</h2>
                                    <p className="text-slate-500 mb-8">{isUz ? "Adminstratsiyadan kelgan xabarlar" : "管理者からのメッセージ"}</p>

                                    {notifications.length > 0 ? (
                                        <div className="space-y-4">
                                            {notifications.map((notif) => (
                                                <div
                                                    key={notif.id}
                                                    onClick={() => !notif.is_read && markAsRead(notif.id)}
                                                    className={`p-6 rounded-2xl border transition-all cursor-pointer ${notif.is_read
                                                        ? "bg-white border-slate-100 opacity-60 hover:opacity-100"
                                                        : "bg-blue-50/50 border-blue-100 shadow-lg shadow-blue-500/5 relative overflow-hidden"
                                                        }`}
                                                >
                                                    {!notif.is_read && <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>}
                                                    <div className="flex justify-between items-start mb-2">
                                                        <h3 className={`text-lg font-bold ${notif.is_read ? 'text-slate-700' : 'text-blue-900'}`}>{notif.title}</h3>
                                                        <span className="text-xs text-slate-400 font-medium bg-white px-2 py-1 rounded-lg border border-slate-100">
                                                            {new Date(notif.created_at).toLocaleDateString()}
                                                        </span>
                                                    </div>
                                                    <p className="text-slate-600 leading-relaxed">{notif.message}</p>
                                                    {!notif.is_read && (
                                                        <div className="mt-4 flex justify-end">
                                                            <span className="text-xs font-bold text-blue-500 uppercase tracking-wider flex items-center gap-1">
                                                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                                                                New Message
                                                            </span>
                                                        </div>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    ) : (
                                        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
                                            <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-sm">
                                                <svg className="w-8 h-8 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" /></svg>
                                            </div>
                                            <p className="text-slate-500 font-medium">{isUz ? "Yangi xabarlar yo'q" : "新しいメッセージはありません"}</p>
                                        </div>
                                    )}
                                </div>
                            )}

                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
