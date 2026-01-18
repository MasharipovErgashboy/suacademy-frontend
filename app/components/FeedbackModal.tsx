"use client";

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchWithAuth, BACKEND_URL } from '../lib/auth';

interface FeedbackModalProps {
    isOpen: boolean;
    onClose: () => void;
    nationality: string;
}

const translations = {
    uz: {
        step1: "Platforma haqida umumiy bahoyingiz",
        step2: "Ushbu platforma sizga qanday foyda berdi?",
        step2_placeholder: "Fikringizni yozing...",
        step3: "Qaysi bo'lim sizga eng foydali bo'ldi?",
        step4: "Yana nimalarni qo'shishimizni xohlaysiz?",
        step4_placeholder: "Takliflaringiz...",
        submit: "Jo'natish",
        sending: "Yuborilmoqda...",
        success_title: "Rahmat!",
        success_msg: "Sizning fikringiz biz uchun juda muhim.",
        sections: {
            video_lessons: 'Video darslar',
            ebook: 'E-Kitob',
            vocabulary: "Lug'at",
            ai_chat: 'AI bilan suhbat',
            all: 'Barchasi Foydali'
        }
    },
    ja: {
        step1: "プラットフォームの全体的な評価",
        step2: "このプラットフォームはどのように役立ちましたか？",
        step2_placeholder: "ご意見をお書きください...",
        step3: "どのセクションが最も役に立ちましたか？",
        step4: "他に追加してほしい機能はありますか？",
        step4_placeholder: "ご提案...",
        submit: "送信",
        sending: "送信中...",
        success_title: "ありがとうございます！",
        success_msg: "あなたのご意見は私たちにとって非常に重要です。",
        sections: {
            video_lessons: 'ビデオレッスン',
            ebook: '電子書籍',
            vocabulary: "語彙 (辞書)",
            ai_chat: 'AIチャット',
            all: 'すべて役に立った'
        }
    }
};

export default function FeedbackModal({ isOpen, onClose, nationality }: FeedbackModalProps) {
    const [step, setStep] = useState('form'); // 'form' | 'success'
    const [loading, setLoading] = useState(false);

    const isUz = nationality === "uz";
    const t = isUz ? translations.uz : translations.ja;
    const themeColor = isUz ? "blue" : "orange";
    const themeColorHex = isUz ? "bg-blue-500" : "bg-orange-500";
    const themeText = isUz ? "text-blue-500" : "text-orange-500";
    const themeBorder = isUz ? "border-blue-500" : "border-orange-500"; // For checked state
    const themeHoverBorder = isUz ? "group-hover:border-blue-400" : "group-hover:border-orange-400";

    const sectionOptions = [
        { id: 'video_lessons', label: t.sections.video_lessons, icon: '▶️' },
        { id: 'ebook', label: t.sections.ebook, icon: '🎧' },
        { id: 'vocabulary', label: t.sections.vocabulary, icon: '🤖' },
        { id: 'ai_chat', label: t.sections.ai_chat, icon: '📘' },
        { id: 'all', label: t.sections.all, icon: '' }
    ];

    // Form State
    const [rating, setRating] = useState(0);
    const [benefits, setBenefits] = useState('');
    const [usefulSections, setUsefulSections] = useState<string[]>([]);
    const [suggestions, setSuggestions] = useState('');

    const toggleSection = (id: string) => {
        if (id === 'all') {
            if (usefulSections.includes('all')) {
                setUsefulSections([]);
            } else {
                setUsefulSections(sectionOptions.map(s => s.id));
            }
        } else {
            setUsefulSections(prev => {
                const newSections = prev.includes(id)
                    ? prev.filter(s => s !== id)
                    : [...prev, id];

                // Handle 'all' logic
                const allOtherIds = sectionOptions.map(s => s.id).filter(s => s !== 'all');
                const isAllSelected = allOtherIds.every(sid => newSections.includes(sid));

                if (isAllSelected && !newSections.includes('all')) return [...newSections, 'all'];
                if (!isAllSelected && newSections.includes('all')) return newSections.filter(s => s !== 'all');

                return newSections;
            });
        }
    };

    const handleSubmit = async () => {
        if (rating === 0) return; // Basic validation
        setLoading(true);

        try {
            const res = await fetchWithAuth(`${BACKEND_URL}/feedbacks/v1/feedbacks/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    rating,
                    benefits,
                    useful_sections: usefulSections,
                    suggestions
                })
            });

            if (res.ok) {
                setStep('success');
                setTimeout(() => {
                    onClose();
                    // Reset form after closing
                    setTimeout(() => {
                        setStep('form');
                        setRating(0);
                        setBenefits('');
                        setUsefulSections([]);
                        setSuggestions('');
                    }, 500);
                }, 3000);
            }
        } catch (err) {
            console.error('Feedback error:', err);
        } finally {
            setLoading(false);
        }
    };

    // Portal logic
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => setMounted(false);
    }, []);

    if (!mounted) return null;

    // Use portal to break out of parent stacking contexts
    return createPortal(
        <AnimatePresence>
            {isOpen && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 bg-black/50 z-[9999] backdrop-blur-sm"
                    />

                    {/* Modal Container */}
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: 20 }}
                        className="fixed inset-0 z-[10000] flex items-center justify-center p-4"
                        onClick={(e) => e.stopPropagation()} // Prevent clicking backdrop
                    >
                        <div className="bg-[#F8FCFB] w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative min-h-[500px] flex flex-col justify-center">

                            {/* Close Button */}
                            <button onClick={onClose} className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 transition-colors z-10">
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                            </button>

                            <AnimatePresence mode="wait">
                                {step === 'form' ? (
                                    <motion.div
                                        key="form"
                                        initial={{ opacity: 0, x: -20 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: 20 }}
                                        className="p-8 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
                                    >
                                        {/* Step 1: Rating */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full ${themeColorHex} text-white flex items-center justify-center font-bold text-lg shadow-md`}>1</div>
                                                <h3 className="font-semibold text-slate-800 text-lg">{t.step1}</h3>
                                            </div>
                                            <div className="flex gap-2 pl-11">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        onClick={() => setRating(star)}
                                                        className={`transition-transform hover:scale-110 ${rating >= star ? 'text-amber-400' : 'text-slate-200'}`}
                                                    >
                                                        <svg className={`w-8 h-8 ${rating >= star ? 'fill-current' : 'fill-none stroke-current stroke-2'}`} viewBox="0 0 24 24">
                                                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                                                        </svg>
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Step 2: Benefits */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full ${themeColorHex} text-white flex items-center justify-center font-bold text-lg shadow-md`}>2</div>
                                                <h3 className="font-semibold text-slate-800 text-lg">{t.step2}</h3>
                                            </div>
                                            <div className="pl-11">
                                                <input
                                                    type="text"
                                                    value={benefits}
                                                    onChange={(e) => setBenefits(e.target.value)}
                                                    className={`w-full h-12 px-4 rounded-xl border border-slate-200 focus:${themeBorder} focus:ring-2 focus:ring-${themeColor}-500/20 outline-none transition-all bg-white`}
                                                    placeholder={t.step2_placeholder}
                                                />
                                            </div>
                                        </div>

                                        {/* Step 3: Useful Sections */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full ${themeColorHex} text-white flex items-center justify-center font-bold text-lg shadow-md`}>3</div>
                                                <h3 className="font-semibold text-slate-800 text-lg">{t.step3}</h3>
                                            </div>
                                            <div className="pl-11 space-y-2">
                                                {sectionOptions.map((option) => (
                                                    <label key={option.id} className="flex items-center gap-3 cursor-pointer group select-none">
                                                        <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${usefulSections.includes(option.id) ? `${themeColorHex} ${themeBorder}` : `border-slate-300 bg-white ${themeHoverBorder}`}`}>
                                                            {usefulSections.includes(option.id) && (
                                                                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                                            )}
                                                        </div>
                                                        <span className="flex items-center gap-2 text-slate-700 font-medium">
                                                            {option.icon && <span>{option.icon}</span>}
                                                            {option.label}
                                                        </span>
                                                        {/* Hidden checkbox for semantic correctness */}
                                                        <input type="checkbox" className="hidden" onChange={() => toggleSection(option.id)} checked={usefulSections.includes(option.id)} />
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Step 4: Suggestions */}
                                        <div className="space-y-2">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-8 h-8 rounded-full ${themeColorHex} text-white flex items-center justify-center font-bold text-lg shadow-md`}>4</div>
                                                <h3 className="font-semibold text-slate-800 text-lg">{t.step4}</h3>
                                            </div>
                                            <div className="pl-11">
                                                <input
                                                    type="text"
                                                    value={suggestions}
                                                    onChange={(e) => setSuggestions(e.target.value)}
                                                    className={`w-full h-12 px-4 rounded-xl border border-slate-200 focus:${themeBorder} focus:ring-2 focus:ring-${themeColor}-500/20 outline-none transition-all bg-white`}
                                                    placeholder={t.step4_placeholder}
                                                />
                                            </div>
                                        </div>

                                        <button
                                            onClick={handleSubmit}
                                            disabled={loading || rating === 0}
                                            className={`w-full py-4 ${isUz ? "bg-blue-500 hover:bg-blue-600 shadow-blue-500/30" : "bg-orange-500 hover:bg-orange-600 shadow-orange-500/30"} active:scale-[0.98] text-white font-bold rounded-2xl shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4`}
                                        >
                                            {loading ? t.sending : t.submit}
                                        </button>

                                    </motion.div>
                                ) : (
                                    // Success State
                                    <motion.div
                                        key="success"
                                        initial={{ opacity: 0, scale: 0.8 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.8 }}
                                        className="p-12 flex flex-col items-center text-center"
                                    >
                                        <motion.div
                                            initial={{ scale: 0 }}
                                            animate={{ scale: 1 }}
                                            transition={{ type: "spring", stiffness: 200, delay: 0.1 }}
                                            className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mb-6"
                                        >
                                            <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                                        </motion.div>
                                        <h2 className="text-3xl font-extrabold text-slate-800 mb-2">{t.success_title}</h2>
                                        <p className="text-slate-500 text-lg font-medium">{t.success_msg}</p>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    </motion.div>
                </>
            )}
        </AnimatePresence>,
        document.body
    );
}
