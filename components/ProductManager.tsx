
import React, { useState } from 'react';
import { Product, AppSettings } from '../types';
import Swal from 'sweetalert2';

// Fix: Added settings to ProductManagerProps to match the props passed in App.tsx
interface ProductManagerProps {
  products: Product[];
  setProducts: React.Dispatch<React.SetStateAction<Product[]>>;
  settings: AppSettings;
}

const ProductManager: React.FC<ProductManagerProps> = ({ products, setProducts, settings }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newProduct, setNewProduct] = useState<Partial<Product>>({
    name: '',
    type: 'BREAD',
    serviceFee: 0,
    unit: 'رغيف'
  });

  const handleAddProduct = () => {
    if (!newProduct.name || newProduct.serviceFee === undefined) {
      Swal.fire('نقص في البيانات', 'يرجى إكمال جميع الحقول', 'warning');
      return;
    }
    const productToAdd: Product = {
      ...newProduct as Product,
      id: Math.random().toString(36).substr(2, 9),
    };
    setProducts([...products, productToAdd]);
    setIsAdding(false);
    setNewProduct({ name: '', type: 'BREAD', serviceFee: 0, unit: 'رغيف' });
    Swal.fire('نجاح', 'تم تحديث قائمة التعرفة بنجاح', 'success');
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black dark:text-white">تعرفة الخدمات</h2>
        <button 
          onClick={() => setIsAdding(true)}
          className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-2xl font-black shadow-xl transition-all"
        >
          + تعريف خدمة جديدة
        </button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:bg-slate-900 dark:border-slate-800 animate-slide-up">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">اسم الخدمة</label>
              <input type="text" placeholder="مثلاً: صينية سمك" value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl font-bold dark:text-white"/>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">أجرة الخبز (₪)</label>
              <input type="number" value={newProduct.serviceFee} onChange={e => setNewProduct({...newProduct, serviceFee: Number(e.target.value)})} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl font-bold dark:text-white"/>
            </div>
            <div>
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 block">الوحدة</label>
              <input type="text" placeholder="صينية / كيلو" value={newProduct.unit} onChange={e => setNewProduct({...newProduct, unit: e.target.value})} className="w-full bg-slate-50 dark:bg-slate-800 border-none p-5 rounded-2xl font-bold dark:text-white"/>
            </div>
          </div>
          <div className="mt-10 flex gap-4">
            <button onClick={handleAddProduct} className="bg-slate-900 dark:bg-amber-500 text-white px-10 py-4 rounded-2xl font-black">حفظ في القائمة</button>
            <button onClick={() => setIsAdding(false)} className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-10 py-4 rounded-2xl font-black">إلغاء</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {products.map(p => (
          <div key={p.id} className="bg-white p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:bg-slate-900 dark:border-slate-800 hover:shadow-2xl transition-all duration-500 group relative">
             <div className="flex justify-between items-start mb-6">
                <div className="h-14 w-14 bg-slate-50 dark:bg-slate-800 rounded-2xl flex items-center justify-center text-slate-400">
                   <i className="bi bi-tag-fill text-2xl"></i>
                </div>
                <button onClick={() => setProducts(products.filter(item => item.id !== p.id))} className="text-slate-300 hover:text-rose-500 transition-colors"><i className="bi bi-trash3-fill"></i></button>
             </div>
             <h3 className="text-xl font-black text-slate-800 dark:text-white mb-2">{p.name}</h3>
             <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-amber-500">{p.serviceFee}</span>
                <span className="text-sm font-bold text-slate-400">₪ / {p.unit}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductManager;
