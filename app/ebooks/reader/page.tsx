"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { isAuthenticated, fetchWithAuth, BACKEND_URL } from "../../lib/auth";
import Header from "../../components/Header";
import Footer from "../../components/Footer";

export default function EBookReaderPage() {
    const router = useRouter();
    const [pdfUrl, setPdfUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const [pageNumber, setPageNumber] = useState(1);
    const [numPages, setNumPages] = useState<number | null>(null);

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

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
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
                console.error("Failed to fetch PDF");
            }
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-100 flex flex-col select-none">
            <Header />

            <main className="flex-grow flex flex-col items-center justify-center p-4">
                {loading ? (
                    <div className="animate-spin w-12 h-12 border-4 rounded-full border-t-transparent border-blue-500"></div>
                ) : pdfUrl ? (
                    <div className="w-full max-w-5xl h-[80vh] bg-white shadow-2xl rounded-lg overflow-hidden relative">
                        {/* PDF Viewer Placeholder - replacing actual PDF rendering for now as libraries need install */}
                        <iframe
                            src={`${pdfUrl}#toolbar=0&navpanes=0&scrollbar=0`}
                            className="w-full h-full border-none"
                            title="E-Book Reader"
                        />

                        {/* Overlay for additional protection */}
                        <div className="absolute inset-0 pointer-events-none bg-transparent"></div>
                    </div>
                ) : (
                    <div className="text-center">
                        <h2 className="text-2xl font-bold text-slate-700 mb-2">Kitob topilmadi</h2>
                        <p className="text-slate-500">Iltimos, keyinroq urinib ko'ring yoki administratorga murojaat qiling.</p>
                        <button
                            onClick={() => router.push('/ebooks')}
                            className="mt-4 px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
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
                @media print {
                    body { display: none; }
                }
            `}</style>

            <Footer />
        </div>
    );
}
