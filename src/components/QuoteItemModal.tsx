import React, { useState } from 'react';
import { QuoteItem } from '@/types';
import { useQuoteStore } from '@/store/useQuoteStore';
import { defaultPresetItems, presetCategories } from '@/data/presetItems';
import { Plus } from 'lucide-react';
import { Modal } from './Modal';

interface QuoteItemModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const QuoteItemModal: React.FC<QuoteItemModalProps> = ({ isOpen, onClose }) => {
  const { addItem, presetItems } = useQuoteStore();
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

  const handleAddPresetItem = (presetItem: QuoteItem) => {
    const newItem: QuoteItem = {
      ...presetItem,
      id: Date.now().toString(),
      totalPrice: presetItem.unitPrice * presetItem.quantity,
    };
    addItem(newItem);
    onClose();
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
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="견적 항목 추가">
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-4">사전 정의 항목</h3>
        <div className="flex gap-2 mb-4 flex-wrap">
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
            <div key={item.id} className="card hover:shadow-lg transition-shadow cursor-pointer" style={{ padding: '16px' }}>
              <h4 className="font-semibold mb-1">{item.name}</h4>
              <p className="text-sm text-gray-600 mb-2">{item.description}</p>
              <p className="font-bold text-green-600">₩{item.unitPrice.toLocaleString()}</p>
              <p className="text-sm text-gray-500 mb-3">작업일수: {item.manDays}일</p>
              <button 
                className="btn btn-primary btn-sm w-full"
                onClick={() => handleAddPresetItem(item)}
              >
                <Plus size={16} /> 추가
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t pt-6">
        <h3 className="text-lg font-semibold mb-4">사용자 정의 항목 추가</h3>
        <div className="grid grid-2 gap-4">
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
              placeholder="항목명을 입력하세요"
            />
          </div>
          <div className="form-group col-span-2">
            <label>설명</label>
            <input
              type="text"
              className="form-control"
              value={customItem.description}
              onChange={(e) => setCustomItem({ ...customItem, description: e.target.value })}
              placeholder="항목에 대한 설명을 입력하세요"
            />
          </div>
          <div className="form-group">
            <label>단가</label>
            <input
              type="number"
              className="form-control"
              value={customItem.unitPrice}
              onChange={(e) => setCustomItem({ ...customItem, unitPrice: Number(e.target.value) })}
              placeholder="0"
            />
          </div>
          <div className="form-group">
            <label>수량</label>
            <input
              type="number"
              className="form-control"
              value={customItem.quantity}
              onChange={(e) => setCustomItem({ ...customItem, quantity: Number(e.target.value) })}
              placeholder="1"
            />
          </div>
          <div className="form-group">
            <label>작업일수</label>
            <input
              type="number"
              className="form-control"
              value={customItem.manDays}
              onChange={(e) => setCustomItem({ ...customItem, manDays: Number(e.target.value) })}
              placeholder="1"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button className="btn btn-primary" onClick={handleAddCustomItem}>
            <Plus size={16} /> 사용자 정의 항목 추가
          </button>
        </div>
      </div>
    </Modal>
  );
};