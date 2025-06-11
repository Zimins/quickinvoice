'use client';

import React, { useState } from 'react';
import { Quote, CompanyInfo } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';
import { Eye } from 'lucide-react';
import { PDFPreview } from './PDFPreview';

export const QuotePDFGenerator: React.FC = () => {
  const { currentQuote, companyInfo } = useQuoteStore();
  const [isGenerating, setIsGenerating] = useState(false);
  const [pdfBlob, setPdfBlob] = useState<Blob | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [fileName, setFileName] = useState('');

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
      const { Document, Page, Text, View, StyleSheet, pdf } = await import('@react-pdf/renderer');

      // Don't register any custom fonts - use default fonts only
      const styles = StyleSheet.create({
        page: {
          fontSize: 10,
          padding: 30,
          backgroundColor: '#FFFFFF',
        },
        header: {
          marginBottom: 20,
          borderBottom: '2px solid #333',
          paddingBottom: 10,
        },
        title: {
          fontSize: 24,
          fontWeight: 'bold',
          marginBottom: 10,
          textAlign: 'center',
        },
        companyInfo: {
          fontSize: 9,
          marginBottom: 5,
          color: '#666',
        },
        section: {
          marginBottom: 15,
        },
        sectionTitle: {
          fontSize: 12,
          fontWeight: 'bold',
          marginBottom: 10,
          backgroundColor: '#f5f5f5',
          padding: 5,
        },
        infoRow: {
          flexDirection: 'row',
          marginBottom: 5,
        },
        infoLabel: {
          width: 100,
          fontWeight: 'bold',
        },
        infoValue: {
          flex: 1,
        },
        table: {
          marginTop: 10,
        },
        tableHeader: {
          flexDirection: 'row',
          backgroundColor: '#333',
          color: '#fff',
          padding: 8,
        },
        tableRow: {
          flexDirection: 'row',
          borderBottom: '1px solid #ddd',
          padding: 8,
        },
        tableCell: {
          flex: 1,
          fontSize: 9,
        },
        tableCellRight: {
          flex: 1,
          fontSize: 9,
          textAlign: 'right',
        },
        totalSection: {
          marginTop: 20,
          borderTop: '2px solid #333',
          paddingTop: 10,
        },
        totalRow: {
          flexDirection: 'row',
          justifyContent: 'space-between',
          marginBottom: 5,
          paddingHorizontal: 20,
        },
        grandTotal: {
          fontSize: 14,
          fontWeight: 'bold',
          color: '#4CAF50',
        },
        footer: {
          position: 'absolute',
          bottom: 30,
          left: 30,
          right: 30,
          fontSize: 8,
          color: '#666',
          borderTop: '1px solid #ddd',
          paddingTop: 10,
        },
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

      const formatDate = (date: Date) => {
        return new Date(date).toLocaleDateString('ko-KR').replace(/\./g, '-').replace(/\s/g, '').replace(/-$/, '');
      };

      const formatCurrency = (amount: number) => {
        return amount.toLocaleString('ko-KR') + ' KRW';
      };

      const QuotePDFDocument = (
        <Document>
          <Page size="A4" style={styles.page}>
            <View style={styles.header}>
              <Text style={styles.title}>QUOTATION</Text>
              <Text style={styles.companyInfo}>{companyInfo.name}</Text>
              <Text style={styles.companyInfo}>{companyInfo.address}</Text>
              <Text style={styles.companyInfo}>
                TEL: {companyInfo.phone} | Email: {companyInfo.email}
              </Text>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Customer Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Company:</Text>
                <Text style={styles.infoValue}>{quote.customer.companyName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Contact:</Text>
                <Text style={styles.infoValue}>{quote.customer.contactPerson}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{quote.customer.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Email:</Text>
                <Text style={styles.infoValue}>{quote.customer.email}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Project Information</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Project Name:</Text>
                <Text style={styles.infoValue}>{quote.project.projectName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Quote Date:</Text>
                <Text style={styles.infoValue}>{formatDate(quote.project.quoteDate)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Valid Until:</Text>
                <Text style={styles.infoValue}>{formatDate(quote.project.validUntil)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Duration:</Text>
                <Text style={styles.infoValue}>{quote.project.projectDuration}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Quote Items</Text>
              <View style={styles.table}>
                <View style={styles.tableHeader}>
                  <Text style={[styles.tableCell, { flex: 1 }]}>Category</Text>
                  <Text style={[styles.tableCell, { flex: 2 }]}>Item</Text>
                  <Text style={[styles.tableCell, { flex: 1 }]}>Unit Price</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>Qty</Text>
                  <Text style={[styles.tableCell, { flex: 0.5 }]}>Days</Text>
                  <Text style={[styles.tableCellRight, { flex: 1 }]}>Total</Text>
                </View>
                {quote.items.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{item.category}</Text>
                    <Text style={[styles.tableCell, { flex: 2 }]}>{item.name}</Text>
                    <Text style={[styles.tableCell, { flex: 1 }]}>{formatCurrency(item.unitPrice)}</Text>
                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.quantity}</Text>
                    <Text style={[styles.tableCell, { flex: 0.5 }]}>{item.manDays}</Text>
                    <Text style={[styles.tableCellRight, { flex: 1 }]}>{formatCurrency(item.totalPrice)}</Text>
                  </View>
                ))}
              </View>
            </View>

            <View style={styles.totalSection}>
              <View style={styles.totalRow}>
                <Text>Subtotal</Text>
                <Text>{formatCurrency(quote.subtotal)}</Text>
              </View>
              <View style={styles.totalRow}>
                <Text>VAT (10%)</Text>
                <Text>{formatCurrency(quote.vat)}</Text>
              </View>
              <View style={[styles.totalRow, styles.grandTotal]}>
                <Text>Total</Text>
                <Text>{formatCurrency(quote.total)}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Bank Information</Text>
              <Text style={{ marginTop: 5 }}>
                {quote.bankInfo.bankName} | {quote.bankInfo.accountHolder} | {quote.bankInfo.accountNumber}
              </Text>
            </View>

            <View style={styles.footer}>
              <Text>{companyInfo.name}</Text>
              <Text>CEO: {companyInfo.representative} | Business No: {companyInfo.businessNumber}</Text>
            </View>
          </Page>
        </Document>
      );

      // Generate PDF blob
      const blob = await pdf(QuotePDFDocument).toBlob();
      setPdfBlob(blob);
      
      // Set filename
      const generatedFileName = `Quote_${new Date().toISOString().split('T')[0]}.pdf`;
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
        <div className="flex gap-2">
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
        </div>
        <p className="text-sm text-gray-600 mt-2">
          * PDF는 영문으로 생성됩니다. 한글 데이터는 그대로 표시됩니다.
        </p>
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