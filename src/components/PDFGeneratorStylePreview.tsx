'use client';

import React, { useState } from 'react';
import { Quote } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';
import { Eye } from 'lucide-react';
import { PDFPreviewWithStyles } from './PDFPreviewWithStyles';

export const QuotePDFGenerator: React.FC = () => {
  const { currentQuote, companyInfo } = useQuoteStore();
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);

  const isValid = currentQuote.customer && 
    currentQuote.project && 
    currentQuote.items && 
    currentQuote.items.length > 0 &&
    currentQuote.bankInfo;

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
        <p className="text-sm text-gray-600 mb-4">
          미리보기에서 다양한 스타일을 선택할 수 있습니다.
        </p>
        <button 
          className="btn btn-primary" 
          onClick={() => setIsPreviewOpen(true)}
        >
          <Eye size={16} /> 미리보기 및 스타일 선택
        </button>
      </div>

      <PDFPreviewWithStyles
        isOpen={isPreviewOpen}
        onClose={() => setIsPreviewOpen(false)}
        quote={quote}
        companyInfo={companyInfo}
      />
    </>
  );
};