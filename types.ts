
export type PaymentMethod = 'CASH' | 'BANK' | 'PREPAID' | 'DEBT';
export type ThemeColor = 'amber' | 'blue' | 'emerald' | 'rose' | 'slate';
export type BankProvider = 'بنك فلسطين' | 'البنك الإسلامي العربي' | 'البنك الإسلامي الفلسطيني' | 'جوال بي (Jawwal Pay)' | 'بال بي (PalPay)' | 'أخرى';

export interface Product {
  id: string;
  name: string;
  type: 'BREAD' | 'TRAY' | 'MAAMOUL' | 'OTHER';
  serviceFee: number;
  unit: string;
}

export interface Inventory {
  wood: number; 
  oil: number; 
}

export interface Worker {
  id: string;
  name: string;
  phone: string; // تم إضافة حقل الهاتف
  dailyWage: number;
  balance: number;
  lastAttendance?: string;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  prepaidBalance: number;
  debt: number;
}

export interface Transaction {
  id: string;
  date: string;
  type: 'SALE' | 'EXPENSE' | 'WORKER_PAYMENT' | 'CUSTOMER_PAYMENT';
  amount: number;
  description: string;
  paymentMethod: PaymentMethod;
  customerId?: string;
  workerId?: string;
  bankDetails?: {
    senderProvider: BankProvider;
    recipientProvider: BankProvider;
    senderAccount: string;
    recipientAccount: string;
    senderOtherProvider?: string;
    recipientOtherProvider?: string;
  };
}

export interface ProductionRun {
  id: string;
  date: string;
  productId: string;
  quantity: number;
  workerId: string;
}

export type ViewType = 'DASHBOARD' | 'PRODUCTS' | 'WORKERS' | 'CUSTOMERS' | 'SALES' | 'FINANCE' | 'INVENTORY' | 'SETTINGS';

export interface AppSettings {
  darkMode: boolean;
  accentColor: ThemeColor;
}
