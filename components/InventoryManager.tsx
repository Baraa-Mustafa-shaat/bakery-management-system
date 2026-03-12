
import React, { useState } from 'react';
import { Inventory, Transaction, PaymentMethod, BankProvider } from '../types';
import Swal from 'sweetalert2';

interface InventoryManagerProps {
  inventory: Inventory;
  setInventory: React.Dispatch<React.SetStateAction<Inventory>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: any;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ inventory, setInventory, transactions, setTransactions, settings }) => {
  // Buy Stock State
  const [purchase, setPurchase] = useState({
    type: 'wood' as 'wood' | 'oil',
    quantity: 0,
    unitPrice: 0,
    paymentMethod: 'CASH' as PaymentMethod,
    senderProvider: 'بنك فلسطين' as BankProvider,
    recipientProvider: 'بنك فلسطين' as BankProvider,
    senderOtherProvider: '',
    recipientOtherProvider: '',
    fromAccount: '',
    toAccount: ''
  });

  // End of Day Audit State
  const [audit, setAudit] = useState({
    remainingWood: inventory.wood,
    remainingOil: inventory.oil
  });

  const handlePurchase = () => {
    const totalCost = purchase.quantity * purchase.unitPrice;
    if (purchase.quantity <= 0 || purchase.unitPrice <= 0) {
      Swal.fire({ icon: 'error', title: 'خطأ', text: 'يرجى إدخال الكمية وسعر الوحدة', customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } });
      return;
    }

    const materialName = purchase.type === 'wood' ? 'حطب' : 'زيت';
    const unitName = purchase.type === 'wood' ? 'كجم' : 'لتر';

    const newTransaction: Transaction = {
      id: Math.random().toString(36).substr(2, 9),
      date: new Date().toISOString(),
      type: 'EXPENSE',
      amount: totalCost,
      description: `شراء ${purchase.quantity} ${unitName} ${materialName}`,
      paymentMethod: purchase.paymentMethod,
      bankDetails: purchase.paymentMethod === 'BANK' ? {
        senderProvider: purchase.senderProvider,
        recipientProvider: purchase.recipientProvider,
        senderAccount: purchase.fromAccount,
        recipientAccount: purchase.toAccount,
        senderOtherProvider: purchase.senderProvider === 'أخرى' ? purchase.senderOtherProvider : undefined,
        recipientOtherProvider: purchase.recipientProvider === 'أخرى' ? purchase.recipientOtherProvider : undefined
      } : undefined
    };

    setTransactions([newTransaction, ...transactions]);
    setInventory({
      ...inventory,
      [purchase.type]: inventory[purchase.type] + purchase.quantity
    });
    
    setPurchase({ ...purchase, quantity: 0, unitPrice: 0, fromAccount: '', toAccount: '', senderOtherProvider: '', recipientOtherProvider: '' });
    Swal.fire({ icon: 'success', title: 'تم التحديث', text: 'تمت إضافة الكمية للمخزون بنجاح', customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } });
  };

  const handleAudit = () => {
    setInventory({ wood: audit.remainingWood, oil: audit.remainingOil });
    Swal.fire({ icon: 'success', title: 'تم الجرد', text: 'تم تحديث الكميات الحالية', customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } });
  };

  const providers: BankProvider[] = ['بنك فلسطين', 'البنك الإسلامي العربي', 'البنك الإسلامي الفلسطيني', 'جوال بي (Jawwal Pay)', 'بال بي (PalPay)', 'أخرى'];

  return (
    <div className="space-y-10 animate-fade-in pb-10">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <h2 className="text-3xl font-black dark:text-white">إدارة التزويد والجرد</h2>
        <div className="flex gap-4 bg-white dark:bg-[#0f172a] p-2 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
           <div className="px-4 py-1 text-center border-l border-slate-700">
              <p className="text-[10px] font-bold text-slate-400 uppercase">مخزون الحطب</p>
              <p className="text-lg font-black text-amber-600">{inventory.wood.toLocaleString('en-US')} كجم</p>
           </div>
           <div className="px-4 py-1 text-center">
              <p className="text-[10px] font-bold text-slate-400 uppercase">مخزون الزيت</p>
              <p className="text-lg font-black text-blue-600">{inventory.oil.toLocaleString('en-US')} لتر</p>
           </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        <div className="bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] shadow-xl border border-slate-100 dark:border-slate-800">
          <h3 className="text-xl font-bold text-slate-800 dark:text-white mb-6 flex items-center gap-3">
            <i className="bi bi-cart-plus-fill text-emerald-500"></i>
            شراء مواد جديدة
          </h3>
          
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <button onClick={() => setPurchase({...purchase, type: 'wood'})} className={`py-4 rounded-2xl font-bold transition-all ${purchase.type === 'wood' ? 'bg-amber-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-[#1e293b] text-slate-400'}`}>حطب</button>
              <button onClick={() => setPurchase({...purchase, type: 'oil'})} className={`py-4 rounded-2xl font-bold transition-all ${purchase.type === 'oil' ? 'bg-blue-500 text-white shadow-lg' : 'bg-slate-50 dark:bg-[#1e293b] text-slate-400'}`}>زيت</button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <input type="number" placeholder="الكمية" className="w-full p-4 bg-slate-50 dark:bg-[#1e293b] border-none rounded-2xl font-bold" value={purchase.quantity || ''} onChange={e => setPurchase({...purchase, quantity: Number(e.target.value)})}/>
              <input type="number" placeholder="سعر الوحدة" className="w-full p-4 bg-slate-50 dark:bg-[#1e293b] border-none rounded-2xl font-bold" value={purchase.unitPrice || ''} onChange={e => setPurchase({...purchase, unitPrice: Number(e.target.value)})}/>
            </div>

            <select className="w-full p-4 bg-slate-50 dark:bg-[#1e293b] border-none rounded-2xl font-bold" value={purchase.paymentMethod} onChange={e => setPurchase({...purchase, paymentMethod: e.target.value as PaymentMethod})}>
              <option value="CASH">نقدي (كاش)</option>
              <option value="BANK">تحويل بنكي</option>
            </select>

            {purchase.paymentMethod === 'BANK' && (
              <div className="space-y-6 animate-fade-in p-4 bg-blue-50/10 dark:bg-blue-900/10 rounded-2xl border border-blue-500/20">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    {/* Fix: Changed class to className */}
                    <label className="text-[10px] font-black uppercase text-blue-500 block mb-1">من حساب الفرن (المرسل)</label>
                    <select className="w-full p-3 bg-white dark:bg-[#1e293b] border-none rounded-xl font-bold" value={purchase.senderProvider} onChange={e => setPurchase({...purchase, senderProvider: e.target.value as BankProvider})}>
                       {providers.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {purchase.senderProvider === 'أخرى' && <input type="text" placeholder="اسم البنك" className="w-full p-3 bg-white dark:bg-[#1e293b] border-none rounded-xl font-bold" value={purchase.senderOtherProvider} onChange={e => setPurchase({...purchase, senderOtherProvider: e.target.value})}/>}
                    <input type="text" placeholder="رقم حساب المرسل" className="w-full p-3 bg-white dark:bg-[#1e293b] border-none rounded-xl font-bold" value={purchase.fromAccount} onChange={e => setPurchase({...purchase, fromAccount: e.target.value})}/>
                  </div>
                  <div className="space-y-2">
                    {/* Fix: Changed class to className */}
                    <label className="text-[10px] font-black uppercase text-emerald-500 block mb-1">إلى حساب التاجر (المستقبل)</label>
                    <select className="w-full p-3 bg-white dark:bg-[#1e293b] border-none rounded-xl font-bold" value={purchase.recipientProvider} onChange={e => setPurchase({...purchase, recipientProvider: e.target.value as BankProvider})}>
                       {providers.map(p => <option key={p} value={p}>{p}</option>)}
                    </select>
                    {purchase.recipientProvider === 'أخرى' && <input type="text" placeholder="اسم البنك" className="w-full p-3 bg-white dark:bg-[#1e293b] border-none rounded-xl font-bold" value={purchase.recipientOtherProvider} onChange={e => setPurchase({...purchase, recipientOtherProvider: e.target.value})}/>}
                    <input type="text" placeholder="رقم حساب التاجر" className="w-full p-3 bg-white dark:bg-[#1e293b] border-none rounded-xl font-bold" value={purchase.toAccount} onChange={e => setPurchase({...purchase, toAccount: e.target.value})}/>
                  </div>
                </div>
              </div>
            )}

            <button onClick={handlePurchase} className="w-full bg-slate-900 dark:bg-amber-500 text-white py-4 rounded-2xl font-black">تأكيد الشراء</button>
          </div>
        </div>

        <div className="bg-slate-900 p-8 rounded-[2.5rem] shadow-xl text-white">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-3"><i className="bi bi-clipboard-check text-amber-500"></i> جرد نهاية اليوم</h3>
          <div className="space-y-8">
            <input type="number" className="w-full p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black text-2xl" value={audit.remainingWood} onChange={e => setAudit({...audit, remainingWood: Number(e.target.value)})}/>
            <input type="number" className="w-full p-5 bg-slate-800 border-2 border-slate-700 rounded-2xl font-black text-2xl" value={audit.remainingOil} onChange={e => setAudit({...audit, remainingOil: Number(e.target.value)})}/>
            <button onClick={handleAudit} className="w-full bg-amber-500 text-white font-black py-5 rounded-2xl shadow-lg">حفظ الجرد اليومي</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InventoryManager;
