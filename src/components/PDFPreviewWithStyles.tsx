'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Download, Loader, Palette } from 'lucide-react';
import { Quote, CompanyInfo } from '@/types';
import { PDFTemplate } from './PDFTemplates';

type PDFStyle = 'modern' | 'classic' | 'colorful' | 'business';

const styleDescriptions: Record<PDFStyle, { name: string; description: string }> = {
  modern: {
    name: '모던 & 미니멀',
    description: '깔끔하고 현대적인 디자인'
  },
  classic: {
    name: '클래식 & 전문적',
    description: '전통적이고 격식있는 디자인'
  },
  colorful: {
    name: '컬러풀 & 창의적',
    description: '밝고 친근한 디자인'
  },
  business: {
    name: '비즈니스 & 공식적',
    description: '전문적인 기업 스타일'
  }
};

interface PDFPreviewWithStylesProps {
  isOpen: boolean;
  onClose: () => void;
  quote: Quote;
  companyInfo: CompanyInfo;
}

export const PDFPreviewWithStyles: React.FC<PDFPreviewWithStylesProps> = ({ 
  isOpen, 
  onClose, 
  quote,
  companyInfo 
}) => {
  const [selectedStyle, setSelectedStyle] = useState<PDFStyle>('modern');
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [pdfUrl, setPdfUrl] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);

  // PDF 생성 함수
  const generatePDF = async (style: PDFStyle) => {
    setIsGenerating(true);
    try {
      const { Font, pdf } = await import('@react-pdf/renderer');

      // Register fonts
      Font.register({
        family: "Nanum Gothic",
        src: "https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-Regular.ttf",
      });

      Font.register({
        family: "Nanum Gothic Bold",
        src: "https://fonts.gstatic.com/ea/nanumgothic/v5/NanumGothic-ExtraBold.ttf",
      });

      // Generate PDF with selected style
      const pdfDocument = <PDFTemplate quote={quote} companyInfo={companyInfo} style={style} />;
      const blob = await pdf(pdfDocument).toBlob();
      
      setPdfBlob(blob);
      
      // Create URL for preview
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
      const url = URL.createObjectURL(blob);
      setPdfUrl(url);
    } catch (error) {
      console.error('PDF generation error:', error);
    } finally {
      setIsGenerating(false);
    }
  };

  // 스타일이 변경될 때마다 새로운 PDF 생성
  useEffect(() => {
    if (isOpen && quote) {
      generatePDF(selectedStyle);
    }
  }, [selectedStyle, isOpen]);

  // 컴포넌트가 언마운트될 때 URL 정리
  useEffect(() => {
    return () => {
      if (pdfUrl) {
        URL.revokeObjectURL(pdfUrl);
      }
    };
  }, [pdfUrl]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = `견적서_${quote.customer.companyName}_${selectedStyle}_${new Date().toISOString().split('T')[0]}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="견적서 미리보기">
      <div className="pdf-preview-container">
        {/* 스타일 선택 탭 */}
        <div className="style-selector-tabs">
          <div className="flex gap-2 mb-4 p-3 bg-gray-50 rounded-lg overflow-x-auto">
            {(Object.entries(styleDescriptions) as [PDFStyle, typeof styleDescriptions[PDFStyle]][]).map(([style, info]) => (
              <button
                key={style}
                className={`style-tab ${selectedStyle === style ? 'active' : ''}`}
                onClick={() => setSelectedStyle(style)}
                disabled={isGenerating}
              >
                <Palette size={14} className="inline mr-1" />
                <span className="font-medium">{info.name}</span>
                <span className="block text-xs mt-1">{info.description}</span>
              </button>
            ))}
          </div>
        </div>

        {/* 다운로드 버튼 */}
        <div className="pdf-preview-actions">
          <button 
            className="btn btn-primary" 
            onClick={handleDownload}
            disabled={isGenerating || !pdfUrl}
          >
            <Download size={16} /> PDF 다운로드
          </button>
        </div>

        {/* PDF 미리보기 */}
        <div className="pdf-preview-frame">
          {isGenerating ? (
            <div className="flex justify-center items-center h-96">
              <div className="text-center">
                <Loader className="animate-spin mx-auto mb-4" size={32} />
                <p>PDF 생성 중...</p>
              </div>
            </div>
          ) : pdfUrl ? (
            <iframe
              src={pdfUrl}
              width="100%"
              height="600px"
              title="PDF Preview"
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
              }}
            />
          ) : (
            <div className="flex justify-center items-center h-64">
              <p>PDF를 생성할 수 없습니다.</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
};