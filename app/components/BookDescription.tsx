"use client";

import { motion } from "framer-motion";

export default function BookDescription() {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className="w-1 h-8 bg-blue-500 rounded-full"></span>
                Kitob haqida
            </h3>

            <div className="prose prose-slate max-w-none">
                <div className="mb-8">
                    <p className="text-slate-600 text-lg leading-relaxed mb-4">
                        "Bir Kunda Bir Suhbat" — bu shunchaki darslik emas, balki ikki millat vakillarini bog'lovchi noyob ko'prikdir.
                    </p>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Ushbu kitob yapon tilidan umuman xabari yo'q o'quvchini <strong>1 oy ichida</strong> kundalik hayotda erkin muloqot qila oladigan darajaga olib chiqishga mo'ljallangan.
                        Xuddi shunday, yaponiyalik o'quvchilar uchun ham 1 oy davomida o'zbek tilida kundalik mavzularda gaplasha olish imkoniyatini yaratadi.
                        Bu kitob JLPT imtihonlari uchun emas, balki <strong>jonli va tezkor so'zlashuv</strong> uchun maxsus ishlab chiilgan.
                    </p>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4">Muallif haqida</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src="/author_ergashboy.jpg"
                            alt="Masharipov Ergashboy"
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-xl">Masharipov Ergashboy</h4>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
