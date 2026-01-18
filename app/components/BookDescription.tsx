"use client";

import { motion } from "framer-motion";

interface Book {
    title?: string;
    description?: string;
    detailed_description: string;
    author_name: string;
    author_bio: string;
    author_image: string | null;
}

const translations = {
    uz: {
        about_book: "Kitob haqida",
        about_author: "Muallif haqida",
        no_info: "Ma'lumot mavjud emas."
    },
    ja: {
        about_book: "本について",
        about_author: "著者について",
        no_info: "情報は利用できません。"
    }
};

export default function BookDescription({ book, nationality = "uz" }: { book?: Book | null, nationality?: string }) {
    if (!book) return null;

    const isUz = nationality === "uz";
    const t = isUz ? translations.uz : translations.ja;
    const decorColor = isUz ? "bg-blue-500" : "bg-orange-500";

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100"
        >
            <h3 className="text-2xl font-bold text-slate-800 mb-6 flex items-center gap-3">
                <span className={`w-1 h-8 rounded-full ${decorColor}`}></span>
                {t.about_book}
            </h3>

            <div className="prose prose-slate max-w-none">
                <div className="mb-8 font-medium text-slate-600 whitespace-pre-line text-lg leading-relaxed">
                    {book.detailed_description || book.description || t.no_info}
                </div>

                <h3 className="text-xl font-bold text-slate-800 mb-4">{t.about_author}</h3>
                <div className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-white shadow-md flex-shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                            src={book.author_image ? `http://localhost:8000${book.author_image}` : "https://ui-avatars.com/api/?name=" + book.author_name}
                            alt={book.author_name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div>
                        <h4 className="font-bold text-slate-900 text-xl">{book.author_name}</h4>
                        <p className="text-slate-600 text-md mt-2 leading-snug whitespace-pre-line">
                            {book.author_bio}
                        </p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
}
