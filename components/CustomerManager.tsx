
import React, { useState } from 'react';
import { Customer, Transaction, PaymentMethod, BankProvider } from '../types';
import Swal from 'sweetalert2';

interface CustomerManagerProps {
  customers: Customer[];
  setCustomers: React.Dispatch<React.SetStateAction<Customer[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: any;
}

const CustomerManager: React.FC<CustomerManagerProps> = ({ customers, setCustomers, transactions, setTransactions, settings }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');

  const validatePhone = (phone: string) => {
    const regex = /^(056|059)\d{7}$/;
    return regex.test(phone);
  };

  const handleAddCustomer = () => {
    if (!name.trim() || !validatePhone(phone)) {
       Swal.fire('خطأ في البيانات', 'يرجى إدخال اسم صحيح ورقم جوال فلسطيني يبدأ بـ 056 أو 059 ويتكون من 10 أرقام', 'error');
       return;
    }
    const newCust: Customer = {
      id: Math.random().toString(36).substr(2, 9),
      name,
      phone,
      prepaidBalance: 0,
      debt: 0
    };
    setCustomers([...customers, newCust]);
    setIsAdding(false);
    setName('');
    setPhone('');
  };

  const handlePayment = (customer: Customer) => {
    Swal.fire({
      title: `دفعة مالية من: ${customer.name}`,
      customClass: { popup: settings.darkMode ? 'swal2-dark' : '' },
      html: `
        <div class="text-right space-y-4 font-sans p-2">
          <div class="flex justify-between items-center bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl">
             <div>
                <p class="text-[10px] font-black text-slate-400 uppercase">الدين الحالي</p>
                <p class="text-xl font-black text-rose-500">${customer.debt} ₪</p>
             </div>
             <div class="text-left">
                <p class="text-[10px] font-black text-slate-400 uppercase">الرصيد المسبق</p>
                <p class="text-xl font-black text-blue-500">${customer.prepaidBalance} ₪</p>
             </div>
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-slate-400">المبلغ المدفوع</label>
            <input id="pay-amount" type="number" class="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none font-bold" placeholder="أدخل المبلغ المستلم">
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase text-slate-400">طريقة الاستلام</label>
            <select id="pay-method" class="w-full p-4 bg-slate-100 dark:bg-slate-800 rounded-2xl border-none font-bold">
              <option value="CASH">نقدي (كاش)</option>
              <option value="BANK">تحويل بنكي / محفظة</option>
            </select>
          </div>
          <div id="bank-fields" class="hidden space-y-4 p-4 bg-blue-50/10 dark:bg-blue-900/10 rounded-2xl border border-blue-500/20">
             <div>
                <label class="text-[10px] font-black uppercase text-blue-500 block mb-1">حساب الزبون (المرسل)</label>
                <select id="pay-sender-provider" class="w-full p-3 bg-white dark:bg-slate-700 rounded-xl border-none text-sm font-bold mb-2">
                   <option value="بنك فلسطين">بنك فلسطين</option>
                   <option value="جوال بي (Jawwal Pay)">جوال بي (Jawwal Pay)</option>
                   <option value="بال بي (PalPay)">بال بي (PalPay)</option>
                   <option value="أخرى">أخرى</option>
                </select>
                <input id="from-other" placeholder="اسم البنك/المحفظة الآخر" class="hidden w-full p-3 mb-2 bg-white dark:bg-slate-700 rounded-xl border-none text-sm font-bold">
                <input id="from-acc" type="text" placeholder="اسم صاحب حساب الزبون *" class="w-full p-3 bg-white dark:bg-slate-700 rounded-xl border-none text-sm font-bold">
             </div>
             <div>
                <label class="text-[10px] font-black uppercase text-emerald-500 block mb-1">حساب الفرن (المستقبل)</label>
                <select id="pay-recipient-provider" class="w-full p-3 bg-white dark:bg-slate-700 rounded-xl border-none text-sm font-bold mb-2">
                   <option value="بنك فلسطين">بنك فلسطين</option>
                   <option value="جوال بي (Jawwal Pay)">جوال بي (Jawwal Pay)</option>
                   <option value="بال بي (PalPay)">بال بي (PalPay)</option>
                   <option value="أخرى">أخرى</option>
                </select>
                <input id="to-other" placeholder="اسم بنك الفرن الآخر" class="hidden w-full p-3 mb-2 bg-white dark:bg-slate-700 rounded-xl border-none text-sm font-bold">
                <input id="to-acc" type="text" placeholder="اسم صاحب حساب الفرن *" class="w-full p-3 bg-white dark:bg-slate-700 rounded-xl border-none text-sm font-bold">
             </div>
          </div>
        </div>
      `,
      didOpen: () => {
        const methodSelect = document.getElementById('pay-method') as HTMLSelectElement;
        const bankFields = document.getElementById('bank-fields');
        const senderProv = document.getElementById('pay-sender-provider') as HTMLSelectElement;
        const recipProv = document.getElementById('pay-recipient-provider') as HTMLSelectElement;
        const fromOther = document.getElementById('from-other') as HTMLInputElement;
        const toOther = document.getElementById('to-other') as HTMLInputElement;

        methodSelect.addEventListener('change', () => {
          if (methodSelect.value === 'BANK') bankFields?.classList.remove('hidden');
          else bankFields?.classList.add('hidden');
        });

        senderProv.addEventListener('change', () => {
          if (senderProv.value === 'أخرى') fromOther.classList.remove('hidden');
          else fromOther.classList.add('hidden');
        });

        recipProv.addEventListener('change', () => {
          if (recipProv.value === 'أخرى') toOther.classList.remove('hidden');
          else toOther.classList.add('hidden');
        });
      },
      showCancelButton: true,
      confirmButtonText: 'تأكيد العملية الموحدة',
      cancelButtonText: 'إلغاء',
      preConfirm: () => {
        const amountStr = (document.getElementById('pay-amount') as HTMLInputElement).value;
        const method = (document.getElementById('pay-method') as HTMLSelectElement).value;
        const fromAcc = (document.getElementById('from-acc') as HTMLInputElement).value;
        const toAcc = (document.getElementById('to-acc') as HTMLInputElement).value;
        const senderProv = (document.getElementById('pay-sender-provider') as HTMLSelectElement).value;
        const recipProv = (document.getElementById('pay-recipient-provider') as HTMLSelectElement).value;
        const fromOtherVal = (document.getElementById('from-other') as HTMLInputElement).value;
        const toOtherVal = (document.getElementById('to-other') as HTMLInputElement).value;

        if (!amountStr || Number(amountStr) <= 0) {
          Swal.showValidationMessage('يرجى إدخال مبلغ صحيح');
          return false;
        }
        if (method === 'BANK') {
           if (!fromAcc.trim() || !toAcc.trim()) {
              Swal.showValidationMessage('يجب إدخال أسماء أصحاب الحسابات');
              return false;
           }
           if ((senderProv === 'أخرى' && !fromOtherVal.trim()) || (recipProv === 'أخرى' && !toOtherVal.trim())) {
              Swal.showValidationMessage('يجب كتابة اسم البنك اليدوي');
              return false;
           }
        }

        return {
          totalPaid: Math.round(Number(amountStr)),
          method: method as PaymentMethod,
          fromAccount: fromAcc,
          toAccount: toAcc,
          senderProvider: senderProv as BankProvider,
          recipientProvider: recipProv as BankProvider,
          senderOtherProvider: fromOtherVal,
          recipientOtherProvider: toOtherVal
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { totalPaid, method, fromAccount, toAccount, senderProvider, recipientProvider, senderOtherProvider, recipientOtherProvider } = result.value;
        
        const debtBefore = customer.debt;
        const paidToDebt = Math.min(debtBefore, totalPaid);
        const remainingForPrepaid = totalPaid - paidToDebt;

        const transaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          type: 'CUSTOMER_PAYMENT',
          amount: totalPaid,
          description: `دفعة مالية من ${customer.name}`,
          paymentMethod: method,
          customerId: customer.id,
          bankDetails: method === 'BANK' ? {
            senderProvider,
            recipientProvider,
            senderAccount: fromAccount,
            recipientAccount: toAccount,
            senderOtherProvider: senderProvider === 'أخرى' ? senderOtherProvider : undefined,
            recipientOtherProvider: recipientProvider === 'أخرى' ? recipientOtherProvider : undefined
          } : undefined
        };

        setTransactions([transaction, ...transactions]);
        setCustomers(customers.map(c => {
          if (c.id === customer.id) {
            return {
              ...c,
              debt: c.debt - paidToDebt,
              prepaidBalance: c.prepaidBalance + remainingForPrepaid
            };
          }
          return c;
        }));

        Swal.fire({ 
          icon: 'success', 
          title: 'تمت المعالجة المالية', 
          html: `<div class="text-right">خصم من الدين: ${paidToDebt} ₪<br>إضافة للرصيد: ${remainingForPrepaid} ₪</div>`,
          customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } 
        });
      }
    });
  };

  return (
    <div className="space-y-6 animate-fade-in pb-10">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black dark:text-white">إدارة الزبائن والديون</h2>
        <button onClick={() => setIsAdding(true)} className="bg-amber-500 hover:bg-amber-600 text-white px-8 py-4 rounded-3xl flex items-center gap-3 font-black shadow-lg transition-transform active:scale-95">
          <i className="bi bi-person-plus-fill text-xl"></i>
          إضافة زبون جديد
        </button>
      </div>

      {isAdding && (
        <div className="bg-white dark:bg-[#0f172a] p-10 rounded-[3rem] shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row gap-6 items-end animate-slide-up">
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">اسم الزبون الكامل</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1e293b] border-none p-5 rounded-3xl font-black text-lg" />
          </div>
          <div className="flex-1 w-full space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">رقم الجوال (056 / 059)</label>
            <input type="text" value={phone} onChange={e => setPhone(e.target.value)} className={`w-full bg-slate-50 dark:bg-[#1e293b] border-none p-5 rounded-3xl font-black text-lg ${phone && !validatePhone(phone) ? 'ring-2 ring-rose-500' : ''}`} placeholder="059xxxxxxx" />
          </div>
          <div className="flex gap-4">
            <button onClick={handleAddCustomer} className="bg-slate-900 dark:bg-amber-500 text-white px-12 py-5 rounded-3xl font-black shadow-xl">حفظ الزبون</button>
            <button onClick={() => setIsAdding(false)} className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-10 py-5 rounded-3xl font-black">إلغاء</button>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {customers.map(customer => (
          <div key={customer.id} className="bg-white dark:bg-[#0f172a] p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col md:flex-row justify-between items-center gap-8 hover:shadow-2xl transition-all duration-500 group relative overflow-hidden">
            <div className="flex items-center gap-6 relative z-10">
              <div className={`h-20 w-20 rounded-3xl flex items-center justify-center text-3xl transition-transform group-hover:scale-110 duration-500 ${customer.debt > 0 ? 'bg-rose-500/10 text-rose-500' : 'bg-emerald-500/10 text-emerald-500'}`}>
                <i className={`bi ${customer.debt > 0 ? 'bi-person-exclamation' : 'bi-person-check-fill'}`}></i>
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-800 dark:text-white group-hover:text-amber-500 transition-colors">{customer.name}</h3>
                <p className="text-sm text-slate-400 font-bold tracking-[0.2em] uppercase mt-1">{customer.phone}</p>
              </div>
            </div>

            <div className="flex flex-col items-center md:items-end gap-6 w-full md:w-auto relative z-10">
              <div className="flex gap-8">
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">رصيد مسبق</p>
                  <p className="text-2xl font-black text-blue-600">{customer.prepaidBalance} ₪</p>
                </div>
                <div className="text-center">
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-widest mb-1">دين ذمة</p>
                  <p className={`text-2xl font-black ${customer.debt > 0 ? 'text-rose-500 animate-pulse' : 'text-slate-300'}`}>{customer.debt} ₪</p>
                </div>
              </div>
              <button onClick={() => handlePayment(customer)} className="w-full md:w-auto bg-slate-900 dark:bg-white dark:text-slate-900 text-white px-10 py-4 rounded-2xl font-black shadow-xl hover:scale-105 transition-all">
                دفعة مالية جديدة
              </button>
            </div>
            <div className={`absolute -bottom-10 -right-10 w-40 h-40 rounded-full blur-3xl opacity-10 transition-colors ${customer.debt > 0 ? 'bg-rose-500' : 'bg-emerald-500'}`}></div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomerManager;
