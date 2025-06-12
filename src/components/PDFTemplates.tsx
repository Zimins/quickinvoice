import React from 'react';
import { Document, Page, Text, View, Image } from '@react-pdf/renderer';
import { Quote, CompanyInfo } from '@/types';
import { pdfStyles } from './PDFStyles';

interface PDFTemplateProps {
  quote: Quote;
  companyInfo: CompanyInfo;
  style: 'modern' | 'classic' | 'colorful' | 'business';
}

export const PDFTemplate: React.FC<PDFTemplateProps> = ({ quote, companyInfo, style }) => {
  const styles = pdfStyles[style] as any;

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleDateString('ko-KR');
  };

  const formatCurrency = (amount: number) => {
    return `₩${amount.toLocaleString('ko-KR')}`;
  };

  // 비즈니스 스타일의 특별한 헤더
  if (style === 'business') {
    return (
      <Document>
        <Page size="A4" style={styles.page}>
          <View style={styles.header}>
            <View style={styles.headerLeft}>
              <Text style={styles.title}>QUOTATION</Text>
              <Text style={styles.subtitle}>견적서 번호: {quote.quoteNumber}</Text>
            </View>
            <View style={styles.headerRight}>
              <Text style={styles.companyInfo}>{companyInfo.name}</Text>
              <Text style={styles.companyInfo}>{companyInfo.address}</Text>
              <Text style={styles.companyInfo}>TEL: {companyInfo.phone}</Text>
              <Text style={styles.companyInfo}>Email: {companyInfo.email}</Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 20 }}>
            <View style={{ flex: 1 }}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Customer Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>COMPANY</Text>
                  <Text style={styles.infoValue}>{quote.customer.companyName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>CONTACT</Text>
                  <Text style={styles.infoValue}>{quote.customer.contactPerson}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>PHONE</Text>
                  <Text style={styles.infoValue}>{quote.customer.phone}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>EMAIL</Text>
                  <Text style={styles.infoValue}>{quote.customer.email}</Text>
                </View>
              </View>
            </View>

            <View style={{ flex: 1 }}>
              <View style={styles.section}>
                <Text style={styles.sectionTitle}>Project Details</Text>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>PROJECT</Text>
                  <Text style={styles.infoValue}>{quote.project.projectName}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>DATE</Text>
                  <Text style={styles.infoValue}>{formatDate(quote.project.quoteDate)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>VALID UNTIL</Text>
                  <Text style={styles.infoValue}>{formatDate(quote.project.validUntil)}</Text>
                </View>
                <View style={styles.infoRow}>
                  <Text style={styles.infoLabel}>DURATION</Text>
                  <Text style={styles.infoValue}>{quote.project.projectDuration}</Text>
                </View>
              </View>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Quotation Details</Text>
            <View style={styles.table}>
              <View style={styles.tableHeader}>
                <Text style={[styles.tableCell, { flex: 1 }]}>Category</Text>
                <Text style={[styles.tableCell, { flex: 2 }]}>Description</Text>
                <Text style={[styles.tableCell, { flex: 1 }]}>Unit Price</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>Qty</Text>
                <Text style={[styles.tableCell, { flex: 0.5 }]}>Days</Text>
                <Text style={[styles.tableCellRight, { flex: 1 }]}>Amount</Text>
              </View>
              {quote.items.map((item, index) => (
                <View key={index} style={[styles.tableRow, index % 2 === 1 && styles.tableRowAlt]}>
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
              <Text>Total Amount</Text>
              <Text>{formatCurrency(quote.total)}</Text>
            </View>
          </View>

          <View style={styles.footer}>
            <Text>{companyInfo.name} | CEO: {companyInfo.representative} | Business No: {companyInfo.businessNumber}</Text>
            <Text style={{ marginTop: 5 }}>Bank: {quote.bankInfo.bankName} | Account: {quote.bankInfo.accountNumber} | Holder: {quote.bankInfo.accountHolder}</Text>
          </View>
        </Page>
      </Document>
    );
  }

  // 다른 스타일들의 공통 템플릿
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>
            {style === 'colorful' ? '✨ 견적서 ✨' : '견 적 서'}
          </Text>
          <Text style={styles.companyInfo}>{companyInfo.name}</Text>
          <Text style={styles.companyInfo}>{companyInfo.address}</Text>
          <Text style={styles.companyInfo}>
            TEL: {companyInfo.phone} | Email: {companyInfo.email}
          </Text>
        </View>

        <View style={{ flexDirection: 'row', gap: 20, marginBottom: 20 }}>
          <View style={{ flex: 1 }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>고객 정보</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>회사명:</Text>
                <Text style={styles.infoValue}>{quote.customer.companyName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>담당자:</Text>
                <Text style={styles.infoValue}>{quote.customer.contactPerson}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>연락처:</Text>
                <Text style={styles.infoValue}>{quote.customer.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>이메일:</Text>
                <Text style={styles.infoValue}>{quote.customer.email}</Text>
              </View>
            </View>
          </View>

          <View style={{ flex: 1 }}>
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>프로젝트 정보</Text>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>프로젝트명:</Text>
                <Text style={styles.infoValue}>{quote.project.projectName}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>견적일:</Text>
                <Text style={styles.infoValue}>{formatDate(quote.project.quoteDate)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>유효기간:</Text>
                <Text style={styles.infoValue}>{formatDate(quote.project.validUntil)}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>프로젝트 기간:</Text>
                <Text style={styles.infoValue}>{quote.project.projectDuration}</Text>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>견적 내역</Text>
          <View style={styles.table}>
            <View style={styles.tableHeader}>
              <Text style={[styles.tableCell, { flex: 1 }]}>카테고리</Text>
              <Text style={[styles.tableCell, { flex: 2 }]}>항목</Text>
              <Text style={[styles.tableCell, { flex: 1 }]}>단가</Text>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>수량</Text>
              <Text style={[styles.tableCell, { flex: 0.5 }]}>일수</Text>
              <Text style={[styles.tableCellRight, { flex: 1 }]}>금액</Text>
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
            <Text>소계</Text>
            <Text>{formatCurrency(quote.subtotal)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text>부가세 (10%)</Text>
            <Text>{formatCurrency(quote.vat)}</Text>
          </View>
          <View style={[styles.totalRow, styles.grandTotal]}>
            <Text>총 합계</Text>
            <Text>{formatCurrency(quote.total)}</Text>
          </View>
        </View>

        {style !== 'colorful' && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>입금 계좌 정보</Text>
            <Text style={{ marginTop: 5 }}>
              {quote.bankInfo.bankName} | {quote.bankInfo.accountHolder} | {quote.bankInfo.accountNumber}
            </Text>
          </View>
        )}

        <View style={style === 'colorful' ? styles.footer : { ...styles.footer, position: 'absolute' }}>
          {style === 'colorful' && (
            <>
              <Text style={{ fontWeight: 'bold', marginBottom: 8 }}>입금 계좌 정보</Text>
              <Text style={{ marginBottom: 10 }}>
                {quote.bankInfo.bankName} | {quote.bankInfo.accountHolder} | {quote.bankInfo.accountNumber}
              </Text>
            </>
          )}
          <Text>{companyInfo.name}</Text>
          <Text>대표: {companyInfo.representative} | 사업자등록번호: {companyInfo.businessNumber}</Text>
        </View>
      </Page>
    </Document>
  );
};