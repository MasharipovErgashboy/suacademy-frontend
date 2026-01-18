"use client";

import Image from "next/image";
import { motion } from "framer-motion";

interface BookInfoCardProps {
    className?: string;
}

export default function BookInfoCard({ className = "" }: BookInfoCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-white rounded-3xl shadow-2xl p-6 md:p-8 max-w-sm w-full border border-slate-100 ${className}`}
        >
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6 text-center">Kitob Tafsilotlari</h2>

            {/* Book 3D Container */}
            <div className="flex justify-center mb-6 perspective-[1000px]">
                <div className="relative w-40 h-56 transform rotate-y-12 rotate-x-6 hover:rotate-0 transition-transform duration-500 shadow-xl rounded-md overflow-hidden">
                    <Image
                        src="/book-cover.png"
                        alt="Bir Kunda Bir Suhbat"
                        fill
                        className="object-cover"
                    />
                </div>
            </div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex text-yellow-400 gap-1">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                </div>
                <span className="text-slate-500 text-sm font-medium">(24 ta sharh)</span>
            </div>

            {/* Details List */}
            <div className="space-y-4 mb-8">
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Nomi</p>
                    <p className="text-slate-800 font-bold text-lg">Bir Kunda Bir Suhbat</p>
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Muallif</p>
                    <p className="text-slate-800 font-bold">Masharipov Ergashboy</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Tillar</p>
                        <p className="text-slate-800 font-bold">O'zbek, Yapon</p>
                    </div>
                    <div>
                        <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Betlar</p>
                        <p className="text-slate-800 font-bold">135</p>
                    </div>
                </div>
                <div>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mb-1">Nashr etilgan</p>
                    <p className="text-slate-800 font-bold">2025</p>
                </div>
            </div>

            <hr className="border-slate-100 mb-6" />

            {/* Price & Action */}
            <div className="flex items-end justify-between mb-4">
                <div>
                    <p className="text-slate-500 font-medium">Xarid varianti</p>
                </div>
                <p className="text-2xl font-extrabold text-slate-900">20 000 so'm</p>
            </div>

            <a
                href="https://asaxiy.uz/uz/product/ergashboy-masharipov-bir-kunda-bir-suhbat-yapon-tilida-urganing"
                target="_blank"
                rel="noopener noreferrer"
                className="block w-full text-center py-4 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
            >
                Xarid qilish (30% chegirma)
            </a>

        </motion.div>
    );
}
