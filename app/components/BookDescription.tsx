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
                        "Bir Kunda Bir Suhbat" — yapon tilini o'rganuvchilar uchun maxsus tayyorlangan noyob qo'llanma.
                        Ushbu kitob orqali siz yapon tilida kundalik muloqot qilish ko'nikmalaringizni tez va samarali rivojlantirasiz.
                    </p>
                    <p className="text-slate-600 text-lg leading-relaxed">
                        Har bir dars real hayotiy vaziyatlarga asoslangan bo'lib, yangi so'zlar, grammatik qoidalar va
                        madaniy jihatlarni o'z ichiga oladi. Kitob JLPT (Japanese Language Proficiency Test) imtihonlariga
                        tayyorgarlik ko'rayotganlar uchun ham ajoyib yordamchi hisoblanadi.
                    </p>
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4">Muallif haqida</h3>
                <div className="flex items-start gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-3xl flex-shrink-0">
                        👨‍🏫
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-lg">Masharipov Ergashboy</h4>
                        <p className="text-blue-500 font-medium text-sm mb-2">Yapon tili o'qituvchisi & Tarjimon</p>
                        <p className="text-slate-600 text-sm">
                            Ko'p yillik tajribaga ega pedagog. Yaponiyada tahsil olgan va faoliyat yuritgan.
                            O'zbek o'quvchilari uchun yapon tilini o'rgatishning oson va samarali metodikalarini ishlab chiqqan.
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
