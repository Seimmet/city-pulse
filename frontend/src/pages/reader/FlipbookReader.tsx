
import { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getEdition } from '@/lib/api';
import { Document, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Loader2, ArrowLeft, ZoomIn, ZoomOut } from "lucide-react";

// Set worker
pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

export function FlipbookReader() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  
  // Responsive & Touch Logic
  const containerRef = useRef<HTMLDivElement>(null);
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const touchStart = useRef<number | null>(null);
  const touchEnd = useRef<number | null>(null);

  const { data: edition, isLoading, error } = useQuery({
    queryKey: ["edition", id],
    queryFn: () => getEdition(id!),
    enabled: !!id
  });

  // Handle Resize
  useEffect(() => {
    const resizeObserver = new ResizeObserver((entries) => {
      if (entries[0]) {
        setContainerWidth(entries[0].contentRect.width);
      }
    });
    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, []);

  // Swipe Handlers
  const minSwipeDistance = 50;
  
  const onTouchStart = (e: React.TouchEvent) => {
    touchEnd.current = null; 
    touchStart.current = e.targetTouches[0].clientX;
  };

  const onTouchMove = (e: React.TouchEvent) => {
    touchEnd.current = e.targetTouches[0].clientX;
  };

  const onTouchEnd = () => {
    if (!touchStart.current || !touchEnd.current) return;
    const distance = touchStart.current - touchEnd.current;
    const isLeftSwipe = distance > minSwipeDistance;
    const isRightSwipe = distance < -minSwipeDistance;
    
    if (isLeftSwipe) {
      // Next Page
      if (pageNumber < numPages) nextPage();
    } else if (isRightSwipe) {
      // Prev Page
      if (pageNumber > 1) previousPage();
    }
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
  }

  function changePage(offset: number) {
    setPageNumber(prevPageNumber => prevPageNumber + offset);
  }

  function previousPage() {
    changePage(-1);
  }

  function nextPage() {
    changePage(1);
  }

  function handleZoomIn() {
    setScale(prev => Math.min(prev + 0.2, 2.0));
  }

  function handleZoomOut() {
    setScale(prev => Math.max(prev - 0.2, 0.6));
  }

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
  if (error) return <div className="p-8 text-center text-red-500">Error loading edition: {(error as Error).message}</div>;

  return (
    <div className="min-h-screen bg-zinc-900 flex flex-col items-center py-8">
       {/* Top Bar */}
       <div className="w-full max-w-6xl px-4 mb-6 flex items-center justify-between text-white">
         <div className="flex items-center gap-4">
           <Button 
             variant="ghost" 
             className="text-white hover:text-gold hover:bg-white/10"
             onClick={() => navigate(-1)}
           >
             <ArrowLeft className="mr-2 h-4 w-4" /> Back
           </Button>
           <div>
             <h1 className="text-2xl font-serif hidden md:block">{edition.title}</h1>
             <p className="text-sm text-gray-400 hidden md:block">{edition.city_name} • {edition.publisher_name}</p>
           </div>
         </div>
         
         <div className="flex items-center gap-4">
            <div className="flex items-center bg-white/10 rounded-lg p-1">
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={handleZoomOut}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-xs w-12 text-center">{Math.round(scale * 100)}%</span>
              <Button variant="ghost" size="icon" className="h-8 w-8 text-white hover:bg-white/20" onClick={handleZoomIn}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
            <div className="text-sm font-medium bg-white/10 px-3 py-1.5 rounded-full whitespace-nowrap">
              {pageNumber} / {numPages}
            </div>
         </div>
       </div>
       
       {/* PDF Container */}
       <div 
         ref={containerRef}
         className="relative shadow-2xl bg-white transition-transform duration-200 w-full max-w-4xl flex justify-center"
         onTouchStart={onTouchStart}
         onTouchMove={onTouchMove}
         onTouchEnd={onTouchEnd}
       >
        <Document
          file={edition.pdf_url}
          onLoadSuccess={onDocumentLoadSuccess}
          loading={<div className="p-12 text-zinc-500">Loading PDF...</div>}
          error={<div className="p-12 text-red-500">Failed to load PDF file.</div>}
        >
          <Page 
            pageNumber={pageNumber} 
            renderTextLayer={false} 
            renderAnnotationLayer={false} 
            width={containerWidth ? Math.min(containerWidth, 1000) : undefined}
            scale={scale}
          />
        </Document>

        {/* Navigation Buttons (Desktop Hover / Mobile Tap targets) */}
        <button 
          onClick={previousPage} 
          disabled={pageNumber <= 1}
          className="absolute left-0 top-0 bottom-0 w-16 flex items-center justify-center hover:bg-black/5 disabled:opacity-0 transition-colors group"
        >
          <div className="bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronLeft className="h-6 w-6" />
          </div>
        </button>
        <button 
          onClick={nextPage} 
          disabled={pageNumber >= numPages}
          className="absolute right-0 top-0 bottom-0 w-16 flex items-center justify-center hover:bg-black/5 disabled:opacity-0 transition-colors group"
        >
          <div className="bg-black/50 p-2 rounded-full text-white opacity-0 group-hover:opacity-100 transition-opacity">
            <ChevronRight className="h-6 w-6" />
          </div>
        </button>
       </div>
       
       <div className="mt-4 text-gray-500 text-sm md:hidden">
         Swipe to turn pages
       </div>
    </div>
  );
}
