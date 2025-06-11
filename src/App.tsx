import React from 'react';
import './App.css';
import { CustomerForm } from './components/CustomerForm';
import { ProjectForm } from './components/ProjectForm';
import { QuoteItemSelector } from './components/QuoteItemSelector';
import { BankInfoForm } from './components/BankInfoForm';
import { QuotePDFGenerator } from './components/QuotePDF';
import { useQuoteStore } from './store/useQuoteStore';
import { RotateCcw } from 'lucide-react';

function App() {
  const { resetQuote } = useQuoteStore();

  return (
    <div className="container">
      <header className="flex-between mb-4">
        <h1>웹 개발 견적서 작성기</h1>
        <button className="btn btn-secondary" onClick={resetQuote}>
          <RotateCcw size={16} /> 초기화
        </button>
      </header>
      
      <CustomerForm />
      <ProjectForm />
      <QuoteItemSelector />
      <BankInfoForm />
      <QuotePDFGenerator />
    </div>
  );
}

export default App;