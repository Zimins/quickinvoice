import React, { useState, useEffect } from 'react';
import { QuoteItem } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';
import { defaultPresetItems, presetCategories } from '@/data/presetItems';
import { Plus, Trash2 } from 'lucide-react';

export const QuoteItemSelector: React.FC = () => {
  const { currentQuote, addItem, updateItem, removeItem, calculateTotals, presetItems } = useQuoteStore();
  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [customItem, setCustomItem] = useState<Partial<QuoteItem>>({
    category: presetCategories[0],
    name: '',
    description: '',
    unitPrice: 0,
    quantity: 1,
    manDays: 1,
  });

  const allPresetItems = [...defaultPresetItems, ...presetItems];
  const filteredItems = selectedCategory === '전체' 
    ? allPresetItems 
    : allPresetItems.filter(item => item.category === selectedCategory);

  useEffect(() => {
    calculateTotals();
  }, [currentQuote.items, calculateTotals]);

  const handleAddPresetItem = (presetItem: QuoteItem) => {
    const newItem: QuoteItem = {
      ...presetItem,
      id: Date.now().toString(),
      totalPrice: presetItem.unitPrice * presetItem.quantity,
    };
    addItem(newItem);
  };

  const handleAddCustomItem = () => {
    if (!customItem.name || !customItem.unitPrice) {
      alert('항목명과 단가를 입력해주세요.');
      return;
    }

    const newItem: QuoteItem = {
      id: Date.now().toString(),
      category: customItem.category || presetCategories[0],
      name: customItem.name,
      description: customItem.description || '',
      unitPrice: Number(customItem.unitPrice),
      quantity: Number(customItem.quantity) || 1,
      manDays: Number(customItem.manDays) || 1,
      totalPrice: Number(customItem.unitPrice) * (Number(customItem.quantity) || 1),
    };

    addItem(newItem);
    setCustomItem({
      category: presetCategories[0],
      name: '',
      description: '',
      unitPrice: 0,
      quantity: 1,
      manDays: 1,
    });
  };

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
    <div className="card">
      <h2>견적 항목</h2>
      
      <div className="mb-4">
        <h3>사전 정의 항목</h3>
        <div className="flex gap-2 mb-4">
          <button
            className={`btn ${selectedCategory === '전체' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => setSelectedCategory('전체')}
          >
            전체
          </button>
          {presetCategories.map(category => (
            <button
              key={category}
              className={`btn ${selectedCategory === category ? 'btn-primary' : 'btn-outline'}`}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>
        
        <div className="grid grid-3 gap-3">
          {filteredItems.map(item => (
            <div key={item.id} className="card" style={{ padding: '16px', cursor: 'pointer' }}>
              <h4>{item.name}</h4>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '8px' }}>{item.description}</p>
              <p style={{ fontWeight: 'bold' }}>₩{item.unitPrice.toLocaleString()}</p>
              <p style={{ fontSize: '14px', color: '#666' }}>작업일수: {item.manDays}일</p>
              <button 
                className="btn btn-primary btn-sm mt-2"
                onClick={() => handleAddPresetItem(item)}
              >
                <Plus size={16} /> 추가
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-4">
        <h3>사용자 정의 항목 추가</h3>
        <div className="grid grid-3 gap-2">
          <div className="form-group">
            <label>카테고리</label>
            <select
              className="form-control"
              value={customItem.category}
              onChange={(e) => setCustomItem({ ...customItem, category: e.target.value })}
            >
              {presetCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>항목명</label>
            <input
              type="text"
              className="form-control"
              value={customItem.name}
              onChange={(e) => setCustomItem({ ...customItem, name: e.target.value })}
              placeholder="항목명"
            />
          </div>
          <div className="form-group">
            <label>설명</label>
            <input
              type="text"
              className="form-control"
              value={customItem.description}
              onChange={(e) => setCustomItem({ ...customItem, description: e.target.value })}
              placeholder="설명"
            />
          </div>
          <div className="form-group">
            <label>단가</label>
            <input
              type="number"
              className="form-control"
              value={customItem.unitPrice}
              onChange={(e) => setCustomItem({ ...customItem, unitPrice: Number(e.target.value) })}
              placeholder="단가"
            />
          </div>
          <div className="form-group">
            <label>수량</label>
            <input
              type="number"
              className="form-control"
              value={customItem.quantity}
              onChange={(e) => setCustomItem({ ...customItem, quantity: Number(e.target.value) })}
              placeholder="수량"
            />
          </div>
          <div className="form-group">
            <label>작업일수</label>
            <input
              type="number"
              className="form-control"
              value={customItem.manDays}
              onChange={(e) => setCustomItem({ ...customItem, manDays: Number(e.target.value) })}
              placeholder="작업일수"
            />
          </div>
        </div>
        <button className="btn btn-primary" onClick={handleAddCustomItem}>
          <Plus size={16} /> 항목 추가
        </button>
      </div>

      <div>
        <h3>선택된 항목</h3>
        {currentQuote.items && currentQuote.items.length > 0 ? (
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
        ) : (
          <p>선택된 항목이 없습니다.</p>
        )}
        
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
      </div>
    </div>
  );
};