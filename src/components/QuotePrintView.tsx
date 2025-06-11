'use client';

import React, { forwardRef } from 'react';
import { Quote, CompanyInfo } from '@/types';

interface QuotePrintViewProps {
  quote: Quote;
  companyInfo: CompanyInfo;
}

export const QuotePrintView = forwardRef<HTMLDivElement, QuotePrintViewProps>(
  ({ quote, companyInfo }, ref) => {
    const formatDate = (date: Date) => {
      return new Date(date).toLocaleDateString('ko-KR');
    };

    const formatCurrency = (amount: number) => {
      return `₩${amount.toLocaleString('ko-KR')}`;
    };

    return (
      <div ref={ref} className="quote-print-view" style={{
        width: '210mm',
        minHeight: '297mm',
        padding: '20mm',
        backgroundColor: 'white',
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Noto Sans KR", sans-serif',
        color: '#000',
      }}>
        {/* 헤더 */}
        <div style={{ borderBottom: '3px solid #333', paddingBottom: '20px', marginBottom: '30px' }}>
          <h1 style={{ fontSize: '36px', fontWeight: 'bold', textAlign: 'center', marginBottom: '20px' }}>
            견 적 서
          </h1>
          <div style={{ textAlign: 'center', color: '#666', fontSize: '14px' }}>
            <p style={{ margin: '5px 0' }}>{companyInfo.name}</p>
            <p style={{ margin: '5px 0' }}>{companyInfo.address}</p>
            <p style={{ margin: '5px 0' }}>
              TEL: {companyInfo.phone} | Email: {companyInfo.email}
            </p>
          </div>
        </div>

        {/* 견적번호 및 날짜 */}
        <div style={{ textAlign: 'right', marginBottom: '30px', fontSize: '14px' }}>
          <p>견적번호: {quote.quoteNumber}</p>
          <p>작성일: {formatDate(quote.createdAt)}</p>
        </div>

        {/* 고객 정보 */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '15px' }}>
            고객 정보
          </h2>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ width: '150px', padding: '8px 0', fontWeight: 'bold' }}>회사명</td>
                <td style={{ padding: '8px 0' }}>{quote.customer.companyName}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>담당자</td>
                <td style={{ padding: '8px 0' }}>{quote.customer.contactPerson}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>연락처</td>
                <td style={{ padding: '8px 0' }}>{quote.customer.phone}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>이메일</td>
                <td style={{ padding: '8px 0' }}>{quote.customer.email}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 프로젝트 정보 */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '15px' }}>
            프로젝트 정보
          </h2>
          <table style={{ width: '100%', fontSize: '14px' }}>
            <tbody>
              <tr>
                <td style={{ width: '150px', padding: '8px 0', fontWeight: 'bold' }}>프로젝트명</td>
                <td style={{ padding: '8px 0' }}>{quote.project.projectName}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>견적일</td>
                <td style={{ padding: '8px 0' }}>{formatDate(quote.project.quoteDate)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>유효기간</td>
                <td style={{ padding: '8px 0' }}>{formatDate(quote.project.validUntil)}</td>
              </tr>
              <tr>
                <td style={{ padding: '8px 0', fontWeight: 'bold' }}>프로젝트 기간</td>
                <td style={{ padding: '8px 0' }}>{quote.project.projectDuration}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* 견적 내역 */}
        <div style={{ marginBottom: '30px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '15px' }}>
            견적 내역
          </h2>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
            <thead>
              <tr style={{ backgroundColor: '#333', color: 'white' }}>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #333' }}>카테고리</th>
                <th style={{ padding: '12px', textAlign: 'left', border: '1px solid #333' }}>항목</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #333' }}>단가</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #333' }}>수량</th>
                <th style={{ padding: '12px', textAlign: 'center', border: '1px solid #333' }}>일수</th>
                <th style={{ padding: '12px', textAlign: 'right', border: '1px solid #333' }}>금액</th>
              </tr>
            </thead>
            <tbody>
              {quote.items.map((item, index) => (
                <tr key={index}>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>{item.category}</td>
                  <td style={{ padding: '12px', border: '1px solid #ddd' }}>
                    <div>{item.name}</div>
                    {item.description && (
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                        {item.description}
                      </div>
                    )}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                    {formatCurrency(item.unitPrice)}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {item.quantity}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'center', border: '1px solid #ddd' }}>
                    {item.manDays}
                  </td>
                  <td style={{ padding: '12px', textAlign: 'right', border: '1px solid #ddd' }}>
                    {formatCurrency(item.totalPrice)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 합계 */}
        <div style={{ marginTop: '30px', borderTop: '3px solid #333', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '16px' }}>
            <span>소계</span>
            <span>{formatCurrency(quote.subtotal)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px', fontSize: '16px' }}>
            <span>부가세 (10%)</span>
            <span>{formatCurrency(quote.vat)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '20px', fontWeight: 'bold', color: '#4CAF50' }}>
            <span>총 합계</span>
            <span>{formatCurrency(quote.total)}</span>
          </div>
        </div>

        {/* 입금 계좌 정보 */}
        <div style={{ marginTop: '40px', marginBottom: '40px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 'bold', backgroundColor: '#f5f5f5', padding: '10px', marginBottom: '15px' }}>
            입금 계좌 정보
          </h2>
          <p style={{ fontSize: '14px' }}>
            {quote.bankInfo.bankName} | {quote.bankInfo.accountHolder} | {quote.bankInfo.accountNumber}
          </p>
        </div>

        {/* 푸터 */}
        <div style={{ 
          marginTop: '60px', 
          paddingTop: '20px', 
          borderTop: '1px solid #ddd', 
          textAlign: 'center',
          fontSize: '12px',
          color: '#666'
        }}>
          <p>{companyInfo.name}</p>
          <p>대표: {companyInfo.representative} | 사업자등록번호: {companyInfo.businessNumber}</p>
        </div>
      </div>
    );
  }
);

QuotePrintView.displayName = 'QuotePrintView';