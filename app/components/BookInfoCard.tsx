"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

interface Book {
    id: number;
    title: string;
    description: string;
    detailed_description: string;
    language: string;
    page_count: number;
    published_year: number;
    price: number;
    author_name: string;
    author_bio: string;
    author_image: string | null;
    cover_image: string | null;
    nationality: string;
}

interface BookInfoCardProps {
    className?: string;
    book?: Book | null;
    nationality?: string;
}

const translations = {
    uz: {
        title: "Kitob Tafsilotlari",
        loading: "Yuklanmoqda...",
        labels: {
            name: "Nomi",
            author: "Muallif",
            languages: "Tillar",
            pages: "Betlar",
            published: "Nashr etilgan",
            price: "Narx",
        },
        reviews: "ta sharh",
        buy: "Xarid qilish",
        currency: "so'm"
    },
    ja: {
        title: "書籍詳細",
        loading: "読み込み中...",
        labels: {
            name: "タイトル",
            author: "著者",
            languages: "言語",
            pages: "ページ数",
            published: "出版年",
            price: "価格",
        },
        reviews: "件のレビュー",
        buy: "購入する",
        currency: "スム"
    }
};

export default function BookInfoCard({ className = "", book, nationality = "uz" }: BookInfoCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

    const isUz = nationality === "uz";
    const t = isUz ? translations.uz : translations.ja;

    // Theme Colors
    const buttonBg = isUz ? "bg-blue-600 hover:bg-blue-500" : "bg-orange-500 hover:bg-orange-600";
    const buttonShadow = isUz ? "shadow-blue-500/20" : "shadow-orange-500/20";
    const ratingColor = isUz ? "text-amber-400" : "text-orange-400";

    function handleMouseMove({ currentTarget, clientX, clientY }: MouseEvent) {
        const { left, top, width, height } = currentTarget.getBoundingClientRect();
        const xPct = (clientX - left) / width - 0.5;
        const yPct = (clientY - top) / height - 0.5;
        x.set(xPct);
        y.set(yPct);
    }

    function handleMouseLeave() {
        x.set(0);
        y.set(0);
    }

    const rotateX = useTransform(mouseY, [-0.5, 0.5], [10, -10]);
    const rotateY = useTransform(mouseX, [-0.5, 0.5], [-10, 10]);
    const brightness = useTransform(mouseY, [-0.5, 0.5], [1.1, 0.9]);

    // Format Data for Nationality
    const getFormattedData = () => {
        if (!book) return {
            title: t.loading,
            author: "-",
            language: "-",
            pages: 0,
            year: 0,
            price: 0,
            cover: "/book-cover.png"
        };

        let title = book.title;
        let author = book.author_name;
        let language = book.language;
        let pages: string | number = book.page_count;
        let year: string | number = book.published_year;

        if (!isUz) {
            // Apply Japanese Formatting overrides if valid
            // Translate specific demo content if matches
            if (title.includes("Bir kunda")) title = "一日一会話";
            if (author.includes("Ergashboy")) author = "マシャリポフ・エルガシュボイ";

            // Format Language
            if (language.includes("English")) language = language.replace("English", "英語");
            if (language.includes("Uzbek")) language = language.replace("Uzbek", "ウズベク語");
            if (language.includes("Japanese")) language = language.replace("Japanese", "日本語");

            // Suffixes
            pages = `${book.page_count}ページ`;
            year = `${book.published_year}年`;
        }

        return {
            title,
            author,
            language,
            pages,
            year,
            price: book.price,
            cover: book.cover_image ? `http://localhost:8000${book.cover_image}` : "/book-cover.png"
        };
    };

    const data = getFormattedData();

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-sm w-full border border-slate-100 ${className}`}
        >
            {isUz && (
                <h2 className="text-2xl font-extrabold text-slate-800 mb-6 text-center tracking-tight">{t.title}</h2>
            )}

            {/* Book 3D Container with Tilt */}
            <motion.div
                className="flex justify-center mb-8 perspective-[1000px] cursor-pointer"
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                style={{ perspective: 1000 }}
            >
                <motion.div
                    style={{
                        rotateX,
                        rotateY,
                        filter: `brightness(${brightness})`,
                        transformStyle: "preserve-3d"
                    }}
                    className="relative w-44 h-64 shadow-2xl rounded-lg overflow-hidden transition-shadow duration-300 hover:shadow-[0_20px_40px_-10px_rgba(0,0,0,0.3)]"
                >
                    <Image
                        src={data.cover}
                        alt={data.title}
                        fill
                        className="object-cover"
                        unoptimized
                    />
                    {/* Gloss / Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay"></div>
                </motion.div>
            </motion.div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className={`flex gap-1 drop-shadow-sm ${ratingColor}`}>
                    {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                </div>
                <span className="text-slate-400 text-sm font-semibold tracking-wide">(24 {t.reviews})</span>
            </div>

            {/* Details List - ONLY VISIBLE FOR UZBEK USERS */}
            {isUz && (
                <div className="space-y-5 mb-8">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">{t.labels.name}</p>
                        <p className="text-slate-800 font-bold text-lg leading-tight">{data.title}</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">{t.labels.author}</p>
                        <p className="text-slate-800 font-bold">{data.author}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">{t.labels.languages}</p>
                            <p className="text-slate-800 font-bold">{data.language}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">{t.labels.pages}</p>
                            <p className="text-slate-800 font-bold">{data.pages}</p>
                        </div>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">{t.labels.published}</p>
                        <p className="text-slate-800 font-bold">{data.year}</p>
                    </div>
                </div>
            )}

            <hr className="border-slate-100 mb-6" />

            {/* Price & Action */}
            <div className="flex items-end justify-between mb-4">
                <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">{t.labels.price}</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">{data.price.toLocaleString().replace(/,/g, ' ')}</span>
                        <span className="text-sm font-bold text-slate-500">{t.currency}</span>
                    </div>
                </div>
            </div>

            <a
                href="https://asaxiy.uz/uz/product/ergashboy-masharipov-bir-kunda-bir-suhbat-yapon-tilida-urganing"
                target="_blank"
                rel="noopener noreferrer"
                className={`group relative block w-full text-center py-4 text-white font-bold rounded-2xl shadow-lg transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden ${buttonBg} ${buttonShadow}`}
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    {t.buy}
                    <span className="relative ml-2 inline-flex items-center justify-center px-2 py-0.5 overflow-hidden text-xs font-medium text-red-600 bg-white rounded">
                        <span className="absolute inset-0 bg-white opacity-90"></span>
                        <span className="relative">30% OFF</span>
                    </span>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </a>

        </motion.div>
    );
}
