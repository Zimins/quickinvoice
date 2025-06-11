import React from 'react';
import { BankInfo } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';

export const BankInfoForm: React.FC = () => {
  const { currentQuote, setBankInfo } = useQuoteStore();
  const bankInfo = currentQuote.bankInfo || {
    bankName: '국민은행',
    accountHolder: '',
    accountNumber: '',
  };

  const handleChange = (field: keyof BankInfo, value: string) => {
    setBankInfo({
      ...bankInfo,
      [field]: value,
    });
  };

  return (
    <div className="card">
      <h2>입금 계좌 정보</h2>
      <div className="grid grid-3">
        <div className="form-group">
          <label>은행명</label>
          <input
            type="text"
            className="form-control"
            value={bankInfo.bankName}
            onChange={(e) => handleChange('bankName', e.target.value)}
            placeholder="은행명을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label>예금주</label>
          <input
            type="text"
            className="form-control"
            value={bankInfo.accountHolder}
            onChange={(e) => handleChange('accountHolder', e.target.value)}
            placeholder="예금주명을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label>계좌번호</label>
          <input
            type="text"
            className="form-control"
            value={bankInfo.accountNumber}
            onChange={(e) => handleChange('accountNumber', e.target.value)}
            placeholder="계좌번호를 입력하세요"
          />
        </div>
      </div>
    </div>
  );
};