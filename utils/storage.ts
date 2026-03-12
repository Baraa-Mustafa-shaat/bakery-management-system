
import { Product, Worker, Customer, Transaction, ProductionRun, Inventory } from '../types';

const KEYS = {
  PRODUCTS: 'baketrack_products',
  WORKERS: 'baketrack_workers',
  CUSTOMERS: 'baketrack_customers',
  TRANSACTIONS: 'baketrack_transactions',
  PRODUCTION: 'baketrack_production',
  INVENTORY: 'baketrack_inventory'
};

export const loadData = <T,>(key: string, defaultValue: T): T => {
  const saved = localStorage.getItem(key);
  return saved ? JSON.parse(saved) : defaultValue;
};

export const saveData = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

export const initData = () => {
  if (!localStorage.getItem(KEYS.PRODUCTS)) {
    const initialServices: Product[] = [
      // Fix: Removed 'woodConsumption' and 'oilConsumption' as they don't exist in the 'Product' type
      { id: '1', name: 'خبز صينية (كبيرة)', type: 'TRAY', serviceFee: 15, unit: 'صينية' },
      { id: '2', name: 'خبز عجين (بالرغيف)', type: 'BREAD', serviceFee: 0.5, unit: 'رغيف' },
      { id: '3', name: 'خبز معمول (بالكيلو)', type: 'MAAMOUL', serviceFee: 10, unit: 'كيلو' }
    ];
    saveData(KEYS.PRODUCTS, initialServices);
  }
  if (!localStorage.getItem(KEYS.INVENTORY)) {
    const initialInventory: Inventory = { wood: 500, oil: 100 };
    saveData(KEYS.INVENTORY, initialInventory);
  }
};

export { KEYS };
