export interface QuoteItem {
  id: string;
  category: string;
  name: string;
  description: string;
  unitPrice: number;
  quantity: number;
  manDays: number;
  totalPrice: number;
}

export interface CustomerInfo {
  companyName: string;
  contactPerson: string;
  phone: string;
  email: string;
  address: string;
}

export interface ProjectInfo {
  projectName: string;
  quoteDate: Date;
  validUntil: Date;
  projectDuration: string;
  deliveryDate: Date;
}

export interface BankInfo {
  bankName: string;
  accountHolder: string;
  accountNumber: string;
}

export interface CompanyInfo {
  name: string;
  representative: string;
  businessNumber: string;
  address: string;
  phone: string;
  email: string;
  logo?: string;
}

export interface Quote {
  id: string;
  quoteNumber: string;
  customer: CustomerInfo;
  project: ProjectInfo;
  items: QuoteItem[];
  subtotal: number;
  vat: number;
  total: number;
  bankInfo: BankInfo;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}