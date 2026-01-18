"use client";

import { useEffect, useState, useRef } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, fetchWithAuth, BACKEND_URL } from "../../lib/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import BookInfoCard from "../../components/BookInfoCard";
import BookDescription from "../../components/BookDescription";
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
    const [isFullScreen, setIsFullScreen] = useState(false);

    // Ref for the container we want to make full screen
    const readerContainerRef = useRef<HTMLDivElement>(null);

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
            // Add Arrow key navigation
            if (e.key === 'ArrowRight') changePage(1);
            if (e.key === 'ArrowLeft') changePage(-1);
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

        // Handle full screen change events
        const handleFullScreenChange = () => {
            setIsFullScreen(!!document.fullscreenElement);
        };
        document.addEventListener('fullscreenchange', handleFullScreenChange);

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('fullscreenchange', handleFullScreenChange);
        };
    }, [router, pageNumber, numPages]); // Added dependencies for page navigation via keys

    // Resize logic needs to be independent to react to full screen changes
    useEffect(() => {
        const handleResize = () => {
            if (isFullScreen) {
                // In full screen, fit to height mostly
                const h = window.innerHeight;
                const w = window.innerWidth;
                if (w > h) {
                    setScale(1.2);
                } else {
                    setScale(window.innerWidth / 600);
                }
            } else {
                if (window.innerWidth < 640) setScale(0.6);
                else if (window.innerWidth < 1024) setScale(0.8);
                else setScale(1.0);
            }
        };
        handleResize();
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [isFullScreen]);


    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const changePage = (offset: number) => {
        setNumPages((currentNumPages) => {
            if (!currentNumPages) return null;
            setPageNumber((currentPage) => {
                const newPage = Math.max(1, Math.min(currentPage + offset, currentNumPages));
                if (newPage !== currentPage) {
                    setDirection(offset);
                    return newPage;
                }
                return currentPage;
            });
            return currentNumPages;
        });
    };

    const toggleFullScreen = () => {
        if (!readerContainerRef.current) return;

        if (!document.fullscreenElement) {
            readerContainerRef.current.requestFullscreen().catch(err => {
                console.error(`Error attempting to enable full-screen mode: ${err.message} (${err.name})`);
            });
        } else {
            document.exitFullscreen();
        }
    };

    // Calculate progress percentage
    const progress = numPages ? (pageNumber / numPages) * 100 : 0;

    return (
        <div className="min-h-screen bg-slate-50 flex flex-col select-none overflow-x-hidden">

            {/* Dynamic Background Mesh */}
            <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
                <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-20 w-[500px] h-[500px] bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10">
                <Header />
            </div>

            <main className="relative z-10 flex-grow w-full max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="animate-spin w-12 h-12 border-4 rounded-full border-t-transparent border-blue-500 mb-4"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Kitob yuklanmoqda...</p>
                    </div>
                ) : pdfUrl ? (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">

                        {/* LEFT COLUMN: Reader & Description */}
                        <div className="lg:col-span-2 flex flex-col gap-8">

                            {/* PDF Reader Container */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5 }}
                                ref={readerContainerRef}
                                className={`relative group ${isFullScreen ? 'bg-slate-900 flex items-center justify-center overflow-auto' : ''}`}
                            >
                                {/* Reading Progress Bar (Top) */}
                                {!isFullScreen && (
                                    <div className="absolute top-0 left-0 right-0 h-1.5 bg-slate-100 rounded-t-3xl overflow-hidden z-20">
                                        <motion.div
                                            className="h-full bg-gradient-to-r from-blue-400 to-indigo-500"
                                            initial={{ width: 0 }}
                                            animate={{ width: `${progress}%` }}
                                            transition={{ duration: 0.3 }}
                                        />
                                    </div>
                                )}

                                {/* Floating Controls */}
                                <div className={`
                                    absolute bottom-8 left-1/2 -translate-x-1/2 z-50 flex items-center gap-3 bg-white/90 backdrop-blur-xl p-2.5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.12)] border border-white/40 transition-all duration-300 hover:scale-[1.02] hover:bg-white
                                     ${isFullScreen ? 'fixed bottom-10' : ''}
                                `}>
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => changePage(-1)}
                                        disabled={pageNumber <= 1}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" /></svg>
                                    </motion.button>

                                    <div className="flex flex-col items-center min-w-[70px] px-2 select-none">
                                        <span className="font-extrabold text-slate-800 text-lg leading-none">{pageNumber}</span>
                                        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider mt-0.5">/ {numPages || '--'}</span>
                                    </div>

                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={() => changePage(1)}
                                        disabled={pageNumber >= (numPages || 1)}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-700 disabled:opacity-30 disabled:hover:bg-transparent transition-colors"
                                    >
                                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" /></svg>
                                    </motion.button>

                                    <div className="w-px h-6 bg-slate-200 mx-1"></div>

                                    {/* Full Screen Toggle */}
                                    <motion.button
                                        whileHover={{ scale: 1.1 }}
                                        whileTap={{ scale: 0.9 }}
                                        onClick={toggleFullScreen}
                                        className="w-10 h-10 flex items-center justify-center rounded-xl hover:bg-slate-100 text-slate-700 transition-colors"
                                        title={isFullScreen ? "Kichik ekran" : "To'liq ekran"}
                                    >
                                        {isFullScreen ? (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 7m0 13V7" /></svg>
                                        ) : (
                                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" /></svg>
                                        )}
                                    </motion.button>
                                </div>

                                {/* Main Viewer Area */}
                                <div
                                    className={`
                                        bg-white rounded-3xl shadow-xl overflow-hidden relative flex justify-center items-center select-none min-h-[500px] border border-slate-100
                                        ${isFullScreen ? 'h-full w-full rounded-none shadow-none bg-slate-900 border-none' : 'transition-transform duration-300 hover:shadow-2xl'}
                                    `}
                                    onContextMenu={(e) => e.preventDefault()}
                                >
                                    <Document
                                        file={pdfUrl}
                                        onLoadSuccess={onDocumentLoadSuccess}
                                        loading={
                                            <div className="flex items-center justify-center h-96 w-full">
                                                <div className="animate-spin w-8 h-8 border-4 rounded-full border-t-transparent border-blue-500"></div>
                                            </div>
                                        }
                                        error={
                                            <div className="text-red-500 p-8 text-center bg-red-50 rounded-xl m-4">
                                                <p className="font-bold">Xatolik yuz berdi</p>
                                                <p className="text-sm mt-2">Faylni yuklashning imkoni bo'lmadi.</p>
                                            </div>
                                        }
                                    >
                                        <AnimatePresence initial={false} custom={direction} mode="wait">
                                            <motion.div
                                                key={pageNumber}
                                                custom={direction}
                                                variants={variants}
                                                initial="enter"
                                                animate="center"
                                                exit="exit"
                                                className={`origin-top ${isFullScreen ? 'flex items-center justify-center min-h-screen' : ''}`}
                                            >
                                                <Page
                                                    pageNumber={pageNumber}
                                                    scale={scale}
                                                    renderTextLayer={false}
                                                    renderAnnotationLayer={false}
                                                    className={isFullScreen ? "" : "shadow-lg"}
                                                />
                                            </motion.div>
                                        </AnimatePresence>
                                    </Document>

                                    {/* Protection Overlay */}
                                    <div className="absolute inset-0 z-10 bg-transparent mix-blend-multiply pointer-events-none"></div>
                                </div>
                            </motion.div>

                            {/* Book Description Area */}
                            <BookDescription />

                        </div>

                        {/* RIGHT COLUMN: Info Card (Sticky) */}
                        <div className="lg:col-span-1">
                            <div className="sticky top-24">
                                <BookInfoCard />
                            </div>
                        </div>

                    </div>
                ) : (
                    // Access Denied / Not Found State
                    <div className="flex flex-col items-center justify-center min-h-[80vh] w-full animate-in fade-in zoom-in duration-500">
                        <BookInfoCard className="max-w-md mx-auto" />
                        <div className="mt-8 text-center max-w-md">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2">Ushbu kitob sizda mavjud emas</h2>
                            <p className="text-slate-500 mb-6">To'liq foydalanish uchun kitobni xarid qiling.</p>
                            <button
                                onClick={() => router.push('/ebooks')}
                                className="text-blue-500 hover:text-slate-800 font-medium underline underline-offset-4"
                            >
                                Bosh sahifaga qaytish
                            </button>
                        </div>
                    </div>
                )}
            </main>

            <style jsx global>{`
                body {
                    user-select: none;
                }
                canvas {
                     pointer-events: none; 
                }
                @media print {
                    body { display: none; }
                }
                @keyframes blob {
                    0% { transform: translate(0px, 0px) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                    100% { transform: translate(0px, 0px) scale(1); }
                }
                .animate-blob {
                    animation: blob 7s infinite;
                }
                .animation-delay-2000 {
                    animation-delay: 2s;
                }
                .animation-delay-4000 {
                    animation-delay: 4s;
                }
            `}</style>
            <Footer />
        </div>
    );
}
