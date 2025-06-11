'use client';

import { CustomerForm } from '@/components/CustomerForm';
import { ProjectForm } from '@/components/ProjectForm';
import { QuoteItemList } from '@/components/QuoteItemList';
import { BankInfoForm } from '@/components/BankInfoForm';
import { QuotePDFGenerator } from '@/components/PDFGeneratorKorean';
import { useQuoteStore } from '@/store/useQuoteStore';
import { RotateCcw, TestTube } from 'lucide-react';

export default function Home() {
  const { resetQuote, setCustomerInfo, setProjectInfo, addItem, setBankInfo } = useQuoteStore();

  const fillTestData = () => {
    // 고객 정보 테스트 데이터
    setCustomerInfo({
      companyName: '테스트 주식회사',
      contactPerson: '김철수',
      phone: '010-1234-5678',
      email: 'test@example.com',
      address: '서울시 강남구 테헤란로 123',
    });

    // 프로젝트 정보 테스트 데이터
    setProjectInfo({
      projectName: '쇼핑몰 웹사이트 개발',
      quoteDate: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30일 후
      projectDuration: '3개월',
    });

    // 견적 항목 테스트 데이터
    const testItems = [
      {
        id: Date.now().toString() + '-1',
        category: '기획',
        name: '요구사항 분석',
        description: '비즈니스 요구사항 분석 및 문서화',
        unitPrice: 1500000,
        quantity: 1,
        manDays: 5,
        totalPrice: 1500000,
      },
      {
        id: Date.now().toString() + '-2',
        category: '디자인',
        name: 'UI/UX 디자인',
        description: '웹사이트 전체 UI/UX 디자인',
        unitPrice: 2000000,
        quantity: 1,
        manDays: 10,
        totalPrice: 2000000,
      },
      {
        id: Date.now().toString() + '-3',
        category: '개발',
        name: '프론트엔드 개발',
        description: 'React 기반 프론트엔드 개발',
        unitPrice: 3000000,
        quantity: 1,
        manDays: 20,
        totalPrice: 3000000,
      },
      {
        id: Date.now().toString() + '-4',
        category: '개발',
        name: '백엔드 개발',
        description: 'Node.js 기반 API 서버 개발',
        unitPrice: 3500000,
        quantity: 1,
        manDays: 25,
        totalPrice: 3500000,
      },
    ];

    // 기존 항목 모두 지우고 새로 추가
    resetQuote();
    
    // 고객 정보 다시 설정
    setCustomerInfo({
      companyName: '테스트 주식회사',
      contactPerson: '김철수',
      phone: '010-1234-5678',
      email: 'test@example.com',
      address: '서울시 강남구 테헤란로 123',
    });

    // 프로젝트 정보 다시 설정
    setProjectInfo({
      projectName: '쇼핑몰 웹사이트 개발',
      quoteDate: new Date(),
      validUntil: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      projectDuration: '3개월',
    });

    // 항목 추가
    testItems.forEach(item => addItem(item));

    // 은행 정보 테스트 데이터
    setBankInfo({
      bankName: '국민은행',
      accountHolder: '웹개발회사',
      accountNumber: '123-456-789012',
    });
  };

  return (
    <div className="container">
      <header className="flex-between mb-4">
        <h1>웹 개발 견적서 작성기</h1>
        <div className="flex gap-2">
          <button className="btn btn-outline" onClick={fillTestData}>
            <TestTube size={16} /> 테스트 데이터
          </button>
          <button className="btn btn-secondary" onClick={resetQuote}>
            <RotateCcw size={16} /> 초기화
          </button>
        </div>
      </header>
      
      <div className="grid grid-2 gap-4 mb-4">
        <CustomerForm />
        <ProjectForm />
      </div>
      
      <QuoteItemList />
      <BankInfoForm />
      <QuotePDFGenerator />
    </div>
  );
}