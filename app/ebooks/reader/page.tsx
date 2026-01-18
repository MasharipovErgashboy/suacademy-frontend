"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, fetchWithAuth, BACKEND_URL } from "../../lib/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import dynamic from "next/dynamic";
import { motion, AnimatePresence, Variants } from "framer-motion";
import { pdfjs } from 'react-pdf';

// Dynamically import react-pdf components with no SSR
const Document = dynamic(() => import('react-pdf').then(mod => mod.Document), {
    ssr: false,
    loading: () => <div className="animate-spin w-12 h-12 border-4 rounded-full border-t-transparent border-blue-500"></div>
});

const Page = dynamic(() => import('react-pdf').then(mod => mod.Page), {
    ssr: false
});

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure worker options object to be passed directly to Document
// This is the most robust way to ensure the worker is loaded correctly in v7
const pdfOptions = {
    cMapUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/cmaps/`,
    cMapPacked: true,
    standardFontDataUrl: `https://unpkg.com/pdfjs-dist@${pdfjs.version}/standard_fonts/`,
    workerSrc: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`
};

const variants: Variants = {
    enter: (direction: number) => ({
        x: direction > 0 ? 500 : -500,
        opacity: 0,
        scale: 0.95
    }),
    center: {
        zIndex: 1,
        x: 0,
        opacity: 1,
        scale: 1,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    },
    exit: (direction: number) => ({
        zIndex: 0,
        x: direction < 0 ? 500 : -500,
        opacity: 0,
        scale: 0.95,
        transition: {
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 }
        }
    })
};

export default function EBookReaderPage() {
    const router = useRouter();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [scale, setScale] = useState(1.0);
    const [direction, setDirection] = useState(0);

    useEffect(() => {
        // Auth check
        if (!isAuthenticated()) {
            router.push('/login');
            return;
        }

        // Disable right-click
        const handleContextMenu = (e: MouseEvent) => e.preventDefault();
        document.addEventListener('contextmenu', handleContextMenu);

        // Disable keyboard shortcuts
        const handleKeyDown = (e: KeyboardEvent) => {
            if (
                (e.ctrlKey && (e.key === 's' || e.key === 'p')) ||
                e.key === 'F12' ||
                (e.ctrlKey && e.shiftKey && e.key === 'I')
            ) {
                e.preventDefault();
            }
        };
        document.addEventListener('keydown', handleKeyDown);

        // Fetch PDF via API (secure streaming)
        const fetchPDF = async () => {
            try {
                const res = await fetchWithAuth(`${BACKEND_URL}/ebooks/pdf/`);
                if (res.ok) {
                    const blob = await res.blob();
                    const url = URL.createObjectURL(blob);
                    setPdfUrl(url);
                } else {
                    setPdfUrl(null);
                }
            } catch (err) {
                console.warn("PDF fetch warning:", err);
                setPdfUrl(null);
            } finally {
                setLoading(false);
            }
        };

        fetchPDF();

        // Handle resize for responsive scale
        const handleResize = () => {
            if (window.innerWidth < 640) setScale(0.6);
            else if (window.innerWidth < 1024) setScale(0.8);
            else setScale(1.0);
        };
        handleResize();
        window.addEventListener('resize', handleResize);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('resize', handleResize);
        };
    }, [router]);

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const changePage = (offset: number) => {
        const newPage = Math.max(1, Math.min(pageNumber + offset, numPages || 1));
        if (newPage !== pageNumber) {
            setDirection(offset);
            setPageNumber(newPage);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col select-none overflow-x-hidden">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-start py-8 px-4 relative">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="animate-spin w-12 h-12 border-4 rounded-full border-t-transparent border-blue-500 mb-4"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Kitob yuklanmoqda...</p>
                    </div>
                ) : pdfUrl ? (
                    <div className="flex flex-col items-center w-full max-w-5xl gap-8 z-10">

                        {/* Wrapper for absolute positioning of animations */}
                        <div className="relative w-full flex justify-center perspective-[1000px]">

                            {/* Floating Controls (Desktop/Center) */}
                            <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-4 bg-white/90 backdrop-blur-md p-3 rounded-2xl shadow-2xl border border-slate-200/50 transition-transform hover:scale-105">
                                <button
                                    onClick={() => changePage(-1)}
                                    disabled={pageNumber <= 1}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-500 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-700 transition-all active:scale-95 shadow-sm"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                </button>

                                <div className="flex flex-col items-center min-w-[80px]">
                                    <span className="font-extrabold text-slate-800 text-lg leading-tight">
                                        {pageNumber}
                                    </span>
                                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                        / {numPages || '--'}
                                    </span>
                                </div>

                                <button
                                    onClick={() => changePage(1)}
                                    disabled={pageNumber >= (numPages || 1)}
                                    className="w-12 h-12 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-blue-500 hover:text-white disabled:opacity-30 disabled:hover:bg-slate-100 disabled:hover:text-slate-700 transition-all active:scale-95 shadow-sm"
                                >
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                </button>
                            </div>

                            {/* PDF Viewer Container */}
                            <div
                                className="bg-white p-1 shadow-2xl rounded-sm relative min-h-[600px] flex justify-center items-center"
                                onContextMenu={(e) => e.preventDefault()}
                                style={{
                                    boxShadow: "0 20px 50px -12px rgba(0, 0, 0, 0.25)"
                                }}
                            >
                                <Document
                                    file={pdfUrl}
                                    onLoadSuccess={onDocumentLoadSuccess}
                                    loading={
                                        <div className="flex items-center justify-center h-96 w-96">
                                            <div className="animate-spin w-8 h-8 border-4 rounded-full border-t-transparent border-blue-500"></div>
                                        </div>
                                    }
                                    error={
                                        <div className="text-red-500 p-8 text-center">
                                            <p>Xatolik yuz berdi</p>
                                        </div>
                                    }
                                    options={pdfOptions}
                                >
                                    <AnimatePresence initial={false} custom={direction} mode="wait">
                                        <motion.div
                                            key={pageNumber}
                                            custom={direction}
                                            variants={variants}
                                            initial="enter"
                                            animate="center"
                                            exit="exit"
                                            className="origin-top"
                                        >
                                            <Page
                                                pageNumber={pageNumber}
                                                scale={scale}
                                                renderTextLayer={false}
                                                renderAnnotationLayer={false}
                                                className="shadow-inner"
                                            />
                                        </motion.div>
                                    </AnimatePresence>
                                </Document>

                                {/* Protection Overlay */}
                                <div className="absolute inset-0 z-10 bg-transparent mix-blend-multiply pointer-events-none"></div>
                            </div>
                        </div>

                    </div>
                ) : (
                    <div className="text-center py-20 animate-in fade-in zoom-in duration-500">
                        <div className="text-6xl mb-6 grayscale opacity-80">🔒</div>
                        <h2 className="text-3xl font-bold text-slate-800 mb-3">Kitob topilmadi</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8 text-lg">
                            Ushbu kitobga ruxsatingiz yo'q yoki fayl hali yuklanmagan.
                        </p>
                        <button
                            onClick={() => router.push('/ebooks')}
                            className="px-8 py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all hover:scale-105 shadow-xl"
                        >
                            Ortga qaytish
                        </button>
                    </div>
                )}
            </main>

            <style jsx global>{`
                body {
                    user-select: none;
                    background-color: #f1f5f9;
                }
                canvas {
                     pointer-events: none; 
                }
                @media print {
                    body { display: none; }
                }
            `}</style>
            <Footer />
        </div>
    );
}
