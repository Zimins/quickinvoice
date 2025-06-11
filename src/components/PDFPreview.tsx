'use client';

import React, { useState, useEffect } from 'react';
import { Modal } from './Modal';
import { Download, Loader } from 'lucide-react';

interface PDFPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  pdfBlob: Blob | null;
  fileName: string;
}

export const PDFPreview: React.FC<PDFPreviewProps> = ({ isOpen, onClose, pdfBlob, fileName }) => {
  const [pdfUrl, setPdfUrl] = useState<string>('');

  useEffect(() => {
    if (pdfBlob) {
      const url = URL.createObjectURL(pdfBlob);
      setPdfUrl(url);
      
      return () => {
        URL.revokeObjectURL(url);
      };
    }
  }, [pdfBlob]);

  const handleDownload = () => {
    if (pdfUrl) {
      const link = document.createElement('a');
      link.href = pdfUrl;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="견적서 미리보기">
      <div className="pdf-preview-container">
        {pdfUrl ? (
          <>
            <div className="pdf-preview-actions">
              <button className="btn btn-primary" onClick={handleDownload}>
                <Download size={16} /> PDF 다운로드
              </button>
            </div>
            <div className="pdf-preview-frame">
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
            </div>
          </>
        ) : (
          <div className="flex justify-center items-center h-64">
            <Loader className="animate-spin" size={32} />
          </div>
        )}
      </div>
    </Modal>
  );
};