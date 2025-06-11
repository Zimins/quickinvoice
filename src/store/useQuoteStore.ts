import { create } from 'zustand';
import { Quote, QuoteItem, CustomerInfo, ProjectInfo, BankInfo, CompanyInfo } from '../types';

interface QuoteStore {
  currentQuote: Partial<Quote>;
  companyInfo: CompanyInfo;
  presetItems: QuoteItem[];
  
  setCustomerInfo: (customer: CustomerInfo) => void;
  setProjectInfo: (project: ProjectInfo) => void;
  setBankInfo: (bank: BankInfo) => void;
  setCompanyInfo: (company: CompanyInfo) => void;
  
  addItem: (item: QuoteItem) => void;
  updateItem: (id: string, item: Partial<QuoteItem>) => void;
  removeItem: (id: string) => void;
  
  calculateTotals: () => void;
  resetQuote: () => void;
  
  addPresetItem: (item: QuoteItem) => void;
  updatePresetItem: (id: string, item: Partial<QuoteItem>) => void;
  removePresetItem: (id: string) => void;
}

const defaultCompanyInfo: CompanyInfo = {
  name: '웹 개발 회사',
  representative: '홍길동',
  businessNumber: '123-45-67890',
  address: '서울특별시 강남구 테헤란로 123',
  phone: '02-1234-5678',
  email: 'contact@webdev.com',
};

const defaultBankInfo: BankInfo = {
  bankName: '',
  accountHolder: '',
  accountNumber: '',
};

export const useQuoteStore = create<QuoteStore>((set, get) => ({
  currentQuote: {
    items: [],
    subtotal: 0,
    vat: 0,
    total: 0,
  },
  companyInfo: defaultCompanyInfo,
  presetItems: [],
  
  setCustomerInfo: (customer) => set((state) => ({
    currentQuote: { ...state.currentQuote, customer }
  })),
  
  setProjectInfo: (project) => set((state) => ({
    currentQuote: { ...state.currentQuote, project }
  })),
  
  setBankInfo: (bank) => set((state) => ({
    currentQuote: { ...state.currentQuote, bankInfo: bank }
  })),
  
  setCompanyInfo: (company) => set({ companyInfo: company }),
  
  addItem: (item) => set((state) => ({
    currentQuote: {
      ...state.currentQuote,
      items: [...(state.currentQuote.items || []), item]
    }
  })),
  
  updateItem: (id, updatedItem) => set((state) => ({
    currentQuote: {
      ...state.currentQuote,
      items: state.currentQuote.items?.map(item => 
        item.id === id ? { ...item, ...updatedItem } : item
      ) || []
    }
  })),
  
  removeItem: (id) => set((state) => ({
    currentQuote: {
      ...state.currentQuote,
      items: state.currentQuote.items?.filter(item => item.id !== id) || []
    }
  })),
  
  calculateTotals: () => set((state) => {
    const items = state.currentQuote.items || [];
    const subtotal = items.reduce((sum, item) => sum + item.totalPrice, 0);
    const vat = subtotal * 0.1;
    const total = subtotal + vat;
    
    return {
      currentQuote: {
        ...state.currentQuote,
        subtotal,
        vat,
        total
      }
    };
  }),
  
  resetQuote: () => set({
    currentQuote: {
      items: [],
      subtotal: 0,
      vat: 0,
      total: 0,
    }
  }),
  
  addPresetItem: (item) => set((state) => ({
    presetItems: [...state.presetItems, item]
  })),
  
  updatePresetItem: (id, updatedItem) => set((state) => ({
    presetItems: state.presetItems.map(item => 
      item.id === id ? { ...item, ...updatedItem } : item
    )
  })),
  
  removePresetItem: (id) => set((state) => ({
    presetItems: state.presetItems.filter(item => item.id !== id)
  })),
}));