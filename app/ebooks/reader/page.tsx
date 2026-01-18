"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, fetchWithAuth, BACKEND_URL } from "../../lib/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";
import dynamic from "next/dynamic";

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

// Import pdfjs only on client side
import { pdfjs } from 'react-pdf';

if (typeof window !== "undefined") {
    pdfjs.GlobalWorkerOptions.workerSrc = '/pdf.worker.min.js';
}

export default function EBookReaderPage() {
    const router = useRouter();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number | null>(null);
    const [scale, setScale] = useState(1.0);

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

        // Fetch PDF
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

    const fetchPDF = async () => {
        try {
            const res = await fetchWithAuth(`${BACKEND_URL}/ebooks/pdf/`);
            if (res.ok) {
                const blob = await res.blob();
                const url = URL.createObjectURL(blob);
                setPdfUrl(url);
            } else {
                // Gracefully handle missing book or other errors without spamming console.error
                setPdfUrl(null);
            }
        } catch (err) {
            // Network errors or other fetch issues
            console.warn("PDF fetch warning:", err); // Use warn instead of error
            setPdfUrl(null);
        } finally {
            setLoading(false);
        }
    };

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const changePage = (offset: number) => {
        setPageNumber(prevPage => Math.max(1, Math.min(prevPage + offset, numPages || 1)));
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col select-none">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-start p-4 md:p-8">
                {loading ? (
                    <div className="flex flex-col items-center justify-center min-h-[60vh]">
                        <div className="animate-spin w-12 h-12 border-4 rounded-full border-t-transparent border-blue-500 mb-4"></div>
                        <p className="text-slate-500 font-medium animate-pulse">Kitob yuklanmoqda...</p>
                    </div>
                ) : pdfUrl ? (
                    <div className="flex flex-col items-center w-full max-w-4xl gap-6">
                        {/* Controls */}
                        <div className="bg-white p-4 rounded-2xl shadow-lg flex items-center gap-6 sticky top-24 z-50">
                            <button
                                onClick={() => changePage(-1)}
                                disabled={pageNumber <= 1}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                ←
                            </button>
                            <span className="font-bold text-slate-700 min-w-[100px] text-center">
                                {pageNumber} / {numPages || '--'}
                            </span>
                            <button
                                onClick={() => changePage(1)}
                                disabled={pageNumber >= (numPages || 1)}
                                className="w-10 h-10 flex items-center justify-center rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                            >
                                →
                            </button>
                        </div>

                        {/* PDF Viewer */}
                        <div
                            className="bg-white p-4 md:p-8 shadow-2xl rounded-sm relative overflow-hidden min-h-[600px] flex justify-center"
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
                                    <div className="text-red-500 p-8 text-center">
                                        Serverdan kitobni yuklashda xatolik yuz berdi.
                                    </div>
                                }
                            >
                                <Page
                                    pageNumber={pageNumber}
                                    scale={scale}
                                    renderTextLayer={false}
                                    renderAnnotationLayer={false}
                                    className="shadow-md"
                                />
                            </Document>

                            {/* Protection Overlay */}
                            <div className="absolute inset-0 z-10 bg-transparent mix-blend-multiply pointer-events-none"></div>
                        </div>

                        <p className="text-slate-400 text-sm mt-4 text-center max-w-md">
                            &copy; SU Academy. Barcha huquqlar himoyalangan. Nusxa ko'chirish taqiqlanadi.
                        </p>
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <div className="text-6xl mb-6">🔒</div>
                        <h2 className="text-2xl font-bold text-slate-700 mb-2">Kitob topilmadi</h2>
                        <p className="text-slate-500 max-w-md mx-auto mb-8">
                            Hozircha kitob fayli yuklanmagan yoki sizda ruxsat yo'q.
                        </p>
                        <button
                            onClick={() => router.push('/ebooks')}
                            className="px-8 py-3 bg-blue-500 text-white font-bold rounded-xl hover:bg-blue-600 transition-colors shadow-lg shadow-blue-500/30"
                        >
                            Orqaga qaytish
                        </button>
                    </div>
                )}
            </main>

            <style jsx global>{`
                body {
                    user-select: none;
                    -webkit-user-select: none;
                    -moz-user-select: none;
                    -ms-user-select: none;
                }
                canvas {
                     pointer-events: none; /* Disable interaction with canvas to prevent image save */
                }
                @media print {
                    body { display: none; }
                }
            `}</style>

            <Footer />
        </div>
    );
}
