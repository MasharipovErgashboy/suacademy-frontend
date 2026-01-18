"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { MouseEvent } from "react";

interface BookInfoCardProps {
    className?: string;
}

export default function BookInfoCard({ className = "" }: BookInfoCardProps) {
    const x = useMotionValue(0);
    const y = useMotionValue(0);

    const mouseX = useSpring(x, { stiffness: 150, damping: 15 });
    const mouseY = useSpring(y, { stiffness: 150, damping: 15 });

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

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`bg-white rounded-3xl shadow-xl p-6 md:p-8 max-w-sm w-full border border-slate-100 ${className}`}
        >
            <h2 className="text-2xl font-extrabold text-slate-800 mb-6 text-center tracking-tight">Kitob Tafsilotlari</h2>

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
                        src="/book-cover.png"
                        alt="Bir Kunda Bir Suhbat"
                        fill
                        className="object-cover"
                    />
                    {/* Gloss / Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 hover:opacity-100 transition-opacity pointer-events-none mix-blend-overlay"></div>
                </motion.div>
            </motion.div>

            {/* Rating */}
            <div className="flex items-center justify-center gap-2 mb-6">
                <div className="flex text-amber-400 gap-1 drop-shadow-sm">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <svg key={i} className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                            <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
                        </svg>
                    ))}
                </div>
                <span className="text-slate-400 text-sm font-semibold tracking-wide">(24 ta sharh)</span>
            </div>

            {/* Details List */}
            <div className="space-y-5 mb-8">
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Nomi</p>
                    <p className="text-slate-800 font-bold text-lg leading-tight">Bir Kunda Bir Suhbat</p>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Muallif</p>
                    <p className="text-slate-800 font-bold">Masharipov Ergashboy</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Tillar</p>
                        <p className="text-slate-800 font-bold">O'zbek, Yapon</p>
                    </div>
                    <div>
                        <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Betlar</p>
                        <p className="text-slate-800 font-bold">135</p>
                    </div>
                </div>
                <div>
                    <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1.5">Nashr etilgan</p>
                    <p className="text-slate-800 font-bold">2025</p>
                </div>
            </div>

            <hr className="border-slate-100 mb-6" />

            {/* Price & Action */}
            <div className="flex items-end justify-between mb-4">
                <div>
                    <p className="text-slate-400 font-bold text-xs uppercase tracking-wider mb-1">Narx</p>
                    <div className="flex items-baseline gap-2">
                        <span className="text-3xl font-extrabold text-slate-900 tracking-tight">20 000</span>
                        <span className="text-sm font-bold text-slate-500">so'm</span>
                    </div>
                </div>
            </div>

            <a
                href="https://asaxiy.uz/uz/product/ergashboy-masharipov-bir-kunda-bir-suhbat-yapon-tilida-urganing"
                target="_blank"
                rel="noopener noreferrer"
                className="group relative block w-full text-center py-4 bg-blue-600 hover:bg-blue-500 text-white font-bold rounded-2xl shadow-lg shadow-blue-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] overflow-hidden"
            >
                <span className="relative z-10 flex items-center justify-center gap-2">
                    Xarid qilish
                    <span className="bg-white/20 px-2 py-0.5 rounded text-xs">30% OFF</span>
                </span>
                <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out"></div>
            </a>

        </motion.div>
    );
}
