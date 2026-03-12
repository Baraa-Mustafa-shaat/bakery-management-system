
import React, { useState, useMemo } from 'react';
import { Product, Customer, Transaction, ProductionRun, Worker, PaymentMethod, BankProvider } from '../types';
import Swal from 'sweetalert2';

interface SalesManagerProps {
  products: Product[];
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  production: ProductionRun[];
  setProduction: React.Dispatch<React.SetStateAction<ProductionRun[]>>;
  workers: Worker[];
  settings: any;
}

const SalesManager: React.FC<SalesManagerProps> = ({ 
  products, customers, setCustomers, transactions, setTransactions, production, setProduction, workers, settings
}) => {
  const [sellData, setSellData] = useState({ 
    productId: '', 
    quantity: 1, 
    customerId: '', 
    paymentMethod: 'CASH' as PaymentMethod,
    senderProvider: 'بنك فلسطين' as BankProvider,
    recipientProvider: 'بنك فلسطين' as BankProvider,
    senderOtherProvider: '',
    recipientOtherProvider: '',
    fromAccount: '',
    toAccount: ''
  });

  const providers: BankProvider[] = ['بنك فلسطين', 'البنك الإسلامي العربي', 'البنك الإسلامي الفلسطيني', 'جوال بي (Jawwal Pay)', 'بال بي (PalPay)', 'أخرى'];

  const selectedCustomer = useMemo(() => 
    customers.find(c => c.id === sellData.customerId), 
    [sellData.customerId, customers]
  );

  const currentOrderPrice = useMemo(() => {
    const service = products.find(p => p.id === sellData.productId);
    if (!service) return 0;
    return Math.round(service.serviceFee * sellData.quantity);
  }, [sellData.productId, sellData.quantity, products]);

  const handleProcessBaking = () => {
    const { productId, quantity, customerId, paymentMethod, senderProvider, recipientProvider, fromAccount, toAccount, senderOtherProvider, recipientOtherProvider } = sellData;
    
    if (!productId || quantity <= 0) {
      Swal.fire({ icon: 'warning', title: 'بيانات ناقصة', text: 'يرجى اختيار الخدمة والكمية', customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } });
      return;
    }

    if (paymentMethod === 'BANK') {
        if (!fromAccount.trim() || !toAccount.trim()) {
            Swal.fire({ icon: 'error', title: 'بيانات بنكية ناقصة', text: 'يجب إدخال أسماء أصحاب الحسابات للطرفين', customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } });
            return;
        }
        if ((senderProvider === 'أخرى' && !senderOtherProvider.trim()) || (recipientProvider === 'أخرى' && !recipientOtherProvider.trim())) {
            Swal.fire({ icon: 'error', title: 'بيانات ناقصة', text: 'يرجى إدخال اسم البنك اليدوي في خانة "أخرى"', customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } });
            return;
        }
    }

    const service = products.find(p => p.id === productId);
    if (!service) return;

    const transaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      type: 'SALE',
      amount: currentOrderPrice,
      description: `خبز ${quantity} ${service.unit} - ${service.name}`,
      paymentMethod,
      customerId,
      bankDetails: paymentMethod === 'BANK' ? {
        senderProvider,
        recipientProvider,
        senderAccount: fromAccount,
        recipientAccount: toAccount,
        senderOtherProvider: senderProvider === 'أخرى' ? senderOtherProvider : undefined,
        recipientOtherProvider: recipientProvider === 'أخرى' ? recipientOtherProvider : undefined
      } : undefined
    };

    setTransactions([transaction, ...transactions]);
    setProduction([{
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      productId, quantity,
      workerId: workers[0]?.id || 'system'
    }, ...production]);

    if (selectedCustomer) {
      setCustomers(customers.map(c => {
        if (c.id === customerId) {
          if (paymentMethod === 'PREPAID') return { ...c, prepaidBalance: c.prepaidBalance - currentOrderPrice };
          if (paymentMethod === 'DEBT') return { ...c, debt: c.debt + currentOrderPrice };
        }
        return c;
      }));
    }

    Swal.fire({ icon: 'success', title: 'تمت العملية', text: `تم تسجيل الطلب بمبلغ ${currentOrderPrice} ₪`, customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } });
    setSellData({ ...sellData, quantity: 1, fromAccount: '', toAccount: '', senderOtherProvider: '', recipientOtherProvider: '' });
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 animate-slide-up pb-10">
      {selectedCustomer && selectedCustomer.debt > 0 && (
        <div className="bg-rose-600 text-white p-6 rounded-[2.5rem] shadow-xl flex items-center gap-6 animate-pulse border-4 border-rose-400">
           <div className="h-14 w-14 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
              <i className="bi bi-exclamation-octagon-fill text-2xl"></i>
           </div>
           <div>
              <h4 className="text-xl font-black">تنبيه: هذا الزبون مدين للفرن!</h4>
              <p className="font-bold opacity-90">يوجد ذمة مالية سابقة بقيمة <span className="underline decoration-2 underline-offset-4">{selectedCustomer.debt} ₪</span>. يرجى مراجعة الحساب.</p>
           </div>
        </div>
      )}

      <div className={`p-8 lg:p-12 rounded-[3.5rem] shadow-2xl border ${settings.darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}>
        <div className="flex items-center justify-between mb-12">
            <div>
                <h3 className="text-3xl font-black dark:text-white">تسجيل إرسالية خبز</h3>
                <p className="text-sm font-bold text-slate-400 mt-1">تأكد من اختيار نوع الخدمة بدقة</p>
            </div>
            <div className="h-16 w-16 bg-amber-500/10 text-amber-500 rounded-3xl flex items-center justify-center">
                <i className="bi bi-cart-check-fill text-3xl"></i>
            </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">الخدمة المطلوبة</label>
            <select className="w-full bg-slate-50 dark:bg-[#1e293b] dark:text-white border-none p-5 rounded-3xl font-black outline-none" value={sellData.productId} onChange={e => setSellData({...sellData, productId: e.target.value})}>
              <option value="">اختر من القائمة...</option>
              {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.serviceFee} ₪)</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">الكمية / العدد</label>
            <input type="number" className="w-full bg-slate-50 dark:bg-[#1e293b] dark:text-white border-none p-5 rounded-3xl font-black outline-none" value={sellData.quantity} onChange={e => setSellData({...sellData, quantity: Math.max(1, Number(e.target.value))})}/>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">الزبون المستلم</label>
            <select className="w-full bg-slate-50 dark:bg-[#1e293b] dark:text-white border-none p-5 rounded-3xl font-black outline-none" value={sellData.customerId} onChange={e => setSellData({...sellData, customerId: e.target.value})}>
              <option value="">زبون نقدي (كاش عابر)</option>
              {customers.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>

          <div className="space-y-3">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest px-2">طريقة تحصيل المبلغ</label>
            <select className="w-full bg-slate-50 dark:bg-[#1e293b] dark:text-white border-none p-5 rounded-3xl font-black outline-none" value={sellData.paymentMethod} onChange={e => setSellData({...sellData, paymentMethod: e.target.value as PaymentMethod})}>
              <option value="CASH">نقدي (استلام فوري)</option>
              <option value="BANK">حوالة بنكية / تطبيق</option>
              <option value="PREPAID">خصم من الرصيد المسبق</option>
              <option value="DEBT">تقييد كدين ذمة</option>
            </select>
          </div>
        </div>

        {sellData.paymentMethod === 'BANK' && (
          <div className="mt-10 p-8 bg-blue-50/10 rounded-[2.5rem] border-2 border-dashed border-blue-500/20 dark:bg-blue-900/10 space-y-8 animate-fade-in">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-blue-500 uppercase">المرسل (الزبون)</p>
                   <select className="w-full p-4 bg-white dark:bg-[#1e293b] rounded-2xl border-none font-bold" value={sellData.senderProvider} onChange={e => setSellData({...sellData, senderProvider: e.target.value as BankProvider})}>
                      {providers.map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                   {sellData.senderProvider === 'أخرى' && <input type="text" placeholder="اسم البنك الآخر" className="w-full p-4 bg-white dark:bg-[#1e293b] rounded-2xl border-none font-bold" value={sellData.senderOtherProvider} onChange={e => setSellData({...sellData, senderOtherProvider: e.target.value})}/>}
                   <input type="text" placeholder="اسم صاحب حساب الزبون" className="w-full p-4 bg-white dark:bg-[#1e293b] rounded-2xl border-none font-bold ring-2 ring-blue-500/20" value={sellData.fromAccount} onChange={e => setSellData({...sellData, fromAccount: e.target.value})}/>
                </div>
                <div className="space-y-4">
                   <p className="text-[10px] font-black text-emerald-500 uppercase">المستقبل (الفرن)</p>
                   <select className="w-full p-4 bg-white dark:bg-[#1e293b] rounded-2xl border-none font-bold" value={sellData.recipientProvider} onChange={e => setSellData({...sellData, recipientProvider: e.target.value as BankProvider})}>
                      {providers.map(p => <option key={p} value={p}>{p}</option>)}
                   </select>
                   {sellData.recipientProvider === 'أخرى' && <input type="text" placeholder="اسم بنك الفرن الآخر" className="w-full p-4 bg-white dark:bg-[#1e293b] rounded-2xl border-none font-bold" value={sellData.recipientOtherProvider} onChange={e => setSellData({...sellData, recipientOtherProvider: e.target.value})}/>}
                   <input type="text" placeholder="اسم صاحب حساب الفرن" className="w-full p-4 bg-white dark:bg-[#1e293b] rounded-2xl border-none font-bold ring-2 ring-emerald-500/20" value={sellData.toAccount} onChange={e => setSellData({...sellData, toAccount: e.target.value})}/>
                </div>
             </div>
          </div>
        )}

        <div className="mt-16 border-t border-slate-100 dark:border-slate-800 pt-10 flex flex-col md:flex-row gap-10">
          <div className="flex-1 grid grid-cols-2 gap-6">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl">
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">تكلفة الإرسالية</p>
               <h4 className="text-3xl font-black text-slate-900 dark:text-white">{currentOrderPrice} ₪</h4>
            </div>
            {sellData.paymentMethod === 'DEBT' && selectedCustomer && (
              <div className="bg-rose-50 dark:bg-rose-900/10 p-6 rounded-3xl border border-rose-500/10">
                 <p className="text-[10px] font-black text-rose-500 uppercase tracking-widest mb-1">إجمالي الدين الجديد</p>
                 <h4 className="text-3xl font-black text-rose-600">{selectedCustomer.debt + currentOrderPrice} ₪</h4>
              </div>
            )}
            {sellData.paymentMethod === 'PREPAID' && selectedCustomer && (
              <div className="bg-blue-50 dark:bg-blue-900/10 p-6 rounded-3xl border border-blue-500/10">
                 <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">الرصيد المتبقي</p>
                 <h4 className="text-3xl font-black text-blue-600">{selectedCustomer.prepaidBalance - currentOrderPrice} ₪</h4>
              </div>
            )}
          </div>
          <button onClick={handleProcessBaking} className="w-full md:w-auto bg-slate-900 dark:bg-amber-500 hover:scale-105 text-white px-20 py-6 rounded-[2.5rem] text-xl font-black shadow-2xl transition-all">إتمام العملية</button>
        </div>
      </div>
    </div>
  );
};

export default SalesManager;
