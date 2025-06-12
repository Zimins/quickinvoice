'use client';

import React, { useState } from 'react';
import { Quote, CompanyInfo } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';
import { Eye, Palette } from 'lucide-react';
import { PDFPreview } from './PDFPreview';
import { PDFTemplate } from './PDFTemplates';

type PDFStyle = 'modern' | 'classic' | 'colorful' | 'business';

const styleDescriptions: Record<PDFStyle, { name: string; description: string }> = {
  modern: {
    name: '모던 & 미니멀',
    description: '깔끔하고 현대적인 디자인. 파란색 포인트'
  },
  classic: {
    name: '클래식 & 전문적',
    description: '전통적이고 격식있는 디자인. 흑백 위주'
  },
  colorful: {
    name: '컬러풀 & 창의적',
    description: '밝고 친근한 디자인. 보라색 테마'
  },
  business: {
    name: '비즈니스 & 공식적',
    description: '전문적인 기업 스타일. 영문 혼용'
  }
};

export const QuotePDFGenerator: React.FC = () => {
  const { currentQuote, companyInfo } = useQuoteStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [selectedStyle, setSelectedStyle] = useState<PDFStyle>('modern');
  const [showStyleSelector, setShowStyleSelector] = useState(false);

  const isValid = currentQuote.customer && 
    currentQuote.project && 
    currentQuote.items && 
    currentQuote.items.length > 0 &&
    currentQuote.bankInfo;

  const generatePDF = async () => {
    if (!isValid) return;

    setIsGenerating(true);

    try {
      // Dynamically import the PDF library only when needed
      const { Font, pdf, renderToStream } = await import('@react-pdf/renderer');

      // Register Nanum Gothic font (working Korean font from the GitHub issue)
      Font.register({
        family: "Nanum Gothic",
        src: "https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf",
      });

      Font.register({
        family: "Nanum Gothic Bold",
        src: "https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-ExtraBold.ttf",
      });

      const quote: Quote = {
        id: Date.now().toString(),
        quoteNumber: `Q${new Date().getFullYear()}${String(new Date().getMonth() + 1).padStart(2, '0')}${String(new Date().getDate()).padStart(2, '0')}-001`,
        customer: currentQuote.customer!,
        project: currentQuote.project!,
        items: currentQuote.items!,
        subtotal: currentQuote.subtotal || 0,
        vat: currentQuote.vat || 0,
        total: currentQuote.total || 0,
        bankInfo: currentQuote.bankInfo!,
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      // Generate PDF with selected style
      const pdfDocument = <PDFTemplate quote={quote} companyInfo={companyInfo} style={selectedStyle} />;
      
      // Generate PDF blob
      const blob = await pdf(pdfDocument).toBlob();
      setPdfBlob(blob);
      
      // Set filename
      const generatedFileName = `견적서_${quote.customer.companyName}_${selectedStyle}_${new Date().toISOString().split('T')[0]}.pdf`;
      setFileName(generatedFileName);
      
      // Open preview
      setIsPreviewOpen(true);
    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF 생성 중 오류가 발생했습니다. 다시 시도해주세요.');
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isValid) {
    return (
      <div className="card">
        <p>견적서를 생성하려면 모든 정보를 입력해주세요.</p>
      </div>
    );
  }

  return (
    <>
      <div className="card">
        <h2>견적서 다운로드</h2>
        
        {/* 스타일 선택 섹션 */}
        <div className="mb-4">
          <button 
            className="btn btn-outline mb-3"
            onClick={() => setShowStyleSelector(!showStyleSelector)}
          >
            <Palette size={16} /> PDF 스타일 선택
          </button>
          
          {showStyleSelector && (
            <div className="grid grid-2 gap-3 p-4 bg-gray-50 rounded-lg">
              {(Object.entries(styleDescriptions) as [PDFStyle, { name: string; description: string }][]).map(([style, info]) => (
                <div 
                  key={style}
                  className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                    selectedStyle === style 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-gray-300 hover:border-gray-400'
                  }`}
                  onClick={() => setSelectedStyle(style)}
                >
                  <h4 className="font-semibold mb-1">{info.name}</h4>
                  <p className="text-sm text-gray-600">{info.description}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button 
            className="btn btn-primary" 
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              '견적서 생성 중...'
            ) : (
              <>
                <Eye size={16} /> 미리보기
              </>
            )}
          </button>
          <span className="text-sm text-gray-600">
            선택된 스타일: <strong>{styleDescriptions[selectedStyle].name}</strong>
          </span>
        </div>
      </div>

      <PDFPreview
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        pdfBlob={pdfBlob}
        fileName={fileName}
      />
    </>
  );
};