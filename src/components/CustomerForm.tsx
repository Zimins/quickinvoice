import React from 'react';
import { CustomerInfo } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';

export const CustomerForm: React.FC = () => {
  const { currentQuote, setCustomerInfo } = useQuoteStore();
  const customer = currentQuote.customer || {
    companyName: '',
    contactPerson: '',
    phone: '',
    email: '',
    address: '',
  };

  const handleChange = (field: keyof CustomerInfo, value: string) => {
    setCustomerInfo({
      ...customer,
      [field]: value,
    });
  };

  return (
    <div className="card">
      <h2>고객 정보</h2>
      <div className="grid grid-2">
        <div className="form-group">
          <label>회사명</label>
          <input
            type="text"
            className="form-control"
            value={customer.companyName}
            onChange={(e) => handleChange('companyName', e.target.value)}
            placeholder="회사명을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label>담당자명</label>
          <input
            type="text"
            className="form-control"
            value={customer.contactPerson}
            onChange={(e) => handleChange('contactPerson', e.target.value)}
            placeholder="담당자명을 입력하세요"
          />
        </div>
        <div className="form-group">
          <label>연락처</label>
          <input
            type="tel"
            className="form-control"
            value={customer.phone}
            onChange={(e) => handleChange('phone', e.target.value)}
            placeholder="연락처를 입력하세요"
          />
        </div>
        <div className="form-group">
          <label>이메일</label>
          <input
            type="email"
            className="form-control"
            value={customer.email}
            onChange={(e) => handleChange('email', e.target.value)}
            placeholder="이메일을 입력하세요"
          />
        </div>
      </div>
      <div className="form-group">
        <label>주소</label>
        <input
          type="text"
          className="form-control"
          value={customer.address}
          onChange={(e) => handleChange('address', e.target.value)}
          placeholder="주소를 입력하세요"
        />
      </div>
    </div>
  );
};