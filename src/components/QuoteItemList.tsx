import React, { useEffect, useState } from 'react';
import { useQuoteStore } from '@/store/useQuoteStore';
import { QuoteItem } from '@/types';
import { Trash2, Plus } from 'lucide-react';
import { QuoteItemModal } from './QuoteItemModal';

export const QuoteItemList: React.FC = () => {
  const { currentQuote, updateItem, removeItem, calculateTotals } = useQuoteStore();
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    calculateTotals();
  }, [currentQuote.items, calculateTotals]);

  const handleUpdateItem = (id: string, field: keyof QuoteItem, value: any) => {
    const item = currentQuote.items?.find(i => i.id === id);
    if (!item) return;

    const updates: Partial<QuoteItem> = { [field]: value };
    
    if (field === 'unitPrice' || field === 'quantity') {
      const unitPrice = field === 'unitPrice' ? Number(value) : item.unitPrice;
      const quantity = field === 'quantity' ? Number(value) : item.quantity;
      updates.totalPrice = unitPrice * quantity;
    }

    updateItem(id, updates);
  };

  return (
    <>
      <div className="card">
        <div className="flex-between mb-4">
          <h2>견적 항목</h2>
          <button 
            className="btn btn-primary"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus size={16} /> 항목 추가
          </button>
        </div>

        {currentQuote.items && currentQuote.items.length > 0 ? (
          <>
            <table className="table">
              <thead>
                <tr>
                  <th>카테고리</th>
                  <th>항목명</th>
                  <th>설명</th>
                  <th>단가</th>
                  <th>수량</th>
                  <th>작업일수</th>
                  <th>금액</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {currentQuote.items.map(item => (
                  <tr key={item.id}>
                    <td>{item.category}</td>
                    <td>{item.name}</td>
                    <td>{item.description}</td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.unitPrice}
                        onChange={(e) => handleUpdateItem(item.id, 'unitPrice', e.target.value)}
                        style={{ width: '120px' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.quantity}
                        onChange={(e) => handleUpdateItem(item.id, 'quantity', e.target.value)}
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        className="form-control"
                        value={item.manDays}
                        onChange={(e) => handleUpdateItem(item.id, 'manDays', e.target.value)}
                        style={{ width: '80px' }}
                      />
                    </td>
                    <td className="text-right">₩{item.totalPrice.toLocaleString()}</td>
                    <td>
                      <button
                        className="btn btn-danger btn-sm"
                        onClick={() => removeItem(item.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            
            <div className="total-section">
              <div className="total-row">
                <span>소계</span>
                <span>₩{currentQuote.subtotal?.toLocaleString() || 0}</span>
              </div>
              <div className="total-row">
                <span>부가세 (10%)</span>
                <span>₩{currentQuote.vat?.toLocaleString() || 0}</span>
              </div>
              <div className="total-row grand-total">
                <span>총 합계</span>
                <span>₩{currentQuote.total?.toLocaleString() || 0}</span>
              </div>
            </div>
          </>
        ) : (
          <div className="text-center py-8">
            <p className="text-gray-500 mb-4">선택된 항목이 없습니다.</p>
            <button 
              className="btn btn-primary"
              onClick={() => setIsModalOpen(true)}
            >
              <Plus size={16} /> 첫 번째 항목 추가하기
            </button>
          </div>
        )}
      </div>

      <QuoteItemModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  );
};