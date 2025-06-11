'use client';

import React, { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Quote } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';
import { Eye, Download } from 'lucide-react';
import { QuotePrintView } from './QuotePrintView';
import { Modal } from './Modal';

export const QuotePDFGenerator: React.FC = () => {
  const { currentQuote, companyInfo } = useQuoteStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const printRef = useRef<HTMLDivElement>(null);

  const isValid = currentQuote.customer && 
    currentQuote.project && 
    currentQuote.items && 
    currentQuote.items.length > 0 &&
    currentQuote.bankInfo;

  const generatePDF = async () => {
    if (!printRef.current) return;

    setIsGenerating(true);

    try {
      // HTML 요소를 캔버스로 변환
      const canvas = await html2canvas(printRef.current, {
        scale: 2, // 고해상도
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff',
      });

      // 캔버스를 이미지로 변환
      const imgData = canvas.toDataURL('image/png');

      // PDF 생성
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // A4 크기에 맞게 이미지 크기 조정
      const imgWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const imgHeight = (canvas.height * imgWidth) / canvas.width;
      let heightLeft = imgHeight;
      let position = 0;

      // 첫 페이지에 이미지 추가
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;

      // 여러 페이지가 필요한 경우
      while (heightLeft >= 0) {
        position = heightLeft - imgHeight;
        pdf.addPage();
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
        heightLeft -= pageHeight;
      }

      // PDF 다운로드
      const fileName = `견적서_${currentQuote.customer?.companyName || 'unnamed'}_${new Date().toISOString().split('T')[0]}.pdf`;
      pdf.save(fileName);

    } catch (error) {
      console.error('PDF generation error:', error);
      alert('PDF 생성 중 오류가 발생했습니다.');
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

  return (
    <>
      <div className="card">
        <h2>견적서 다운로드</h2>
        <div className="flex gap-2">
          <button 
            className="btn btn-outline" 
            onClick={() => setShowPreview(true)}
          >
            <Eye size={16} /> 미리보기
          </button>
          <button 
            className="btn btn-primary" 
            onClick={generatePDF}
            disabled={isGenerating}
          >
            {isGenerating ? (
              '생성 중...'
            ) : (
              <>
                <Download size={16} /> PDF 다운로드
              </>
            )}
          </button>
        </div>
        <p className="text-sm text-gray-600 mt-2">
          * 한글이 완벽하게 지원됩니다.
        </p>
      </div>

      {/* 미리보기 모달 */}
      <Modal isOpen={showPreview} onClose={() => setShowPreview(false)} title="견적서 미리보기">
        <div style={{ overflowX: 'auto', overflowY: 'auto', maxHeight: '70vh' }}>
          <QuotePrintView quote={quote} companyInfo={companyInfo} />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <button className="btn btn-outline" onClick={() => setShowPreview(false)}>
            닫기
          </button>
          <button className="btn btn-primary" onClick={generatePDF} disabled={isGenerating}>
            {isGenerating ? '생성 중...' : 'PDF 다운로드'}
          </button>
        </div>
      </Modal>

      {/* 숨겨진 프린트 영역 */}
      <div style={{ position: 'absolute', left: '-9999px', top: 0 }}>
        <QuotePrintView ref={printRef} quote={quote} companyInfo={companyInfo} />
      </div>
    </>
  );
};