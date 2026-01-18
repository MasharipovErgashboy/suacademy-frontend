import { pdfjs } from 'react-pdf';

if (typeof window !== "undefined") {
    // We use the specific version corresponding to react-pdf@7.7.1
    // This is the most reliable way to avoid local path resolution issues
    pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js`;
    console.log("PDF Config: Worker initialized with cdnjs (v3.11.174)");
}
