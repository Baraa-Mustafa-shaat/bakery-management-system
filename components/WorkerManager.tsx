
import React, { useState } from 'react';
import { Worker, Transaction, PaymentMethod, BankProvider } from '../types';
import Swal from 'sweetalert2';

interface WorkerManagerProps {
  workers: Worker[];
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: any;
}

const WorkerManager: React.FC<WorkerManagerProps> = ({ workers, setWorkers, transactions, setTransactions, settings }) => {
  const [isAdding, setIsAdding] = useState(false);
  const [newWorker, setNewWorker] = useState({ name: '', phone: '', dailyWage: 80 });

  const validatePhone = (phone: string) => {
    const regex = /^(056|059)\d{7}$/;
    return regex.test(phone);
  };

  const payWorker = (worker: Worker) => {
    Swal.fire({
      title: `صرف أجور لـ ${worker.name}`,
      customClass: { popup: settings.darkMode ? 'swal2-dark' : '' },
      html: `
        <div class="text-right space-y-4 font-sans p-2">
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase">المبلغ المراد صرفه</label>
            <input id="pay-amount" type="number" class="w-full p-4 rounded-2xl border-none font-bold" value="${worker.balance}">
          </div>
          <div class="space-y-1">
            <label class="text-[10px] font-black uppercase">طريقة الدفع</label>
            <select id="pay-method" class="w-full p-4 rounded-2xl border-none font-bold">
              <option value="CASH">نقدي (كاش)</option>
              <option value="BANK">تحويل بنكي / محفظة</option>
            </select>
          </div>
          <div id="bank-fields" class="hidden space-y-4 p-4 bg-blue-50/5 dark:bg-blue-900/10 rounded-2xl border border-blue-500/20">
             <div>
                <label class="text-[10px] font-black uppercase text-blue-500 block mb-1">حساب الفرن (المرسل)</label>
                <select id="pay-sender-provider" class="w-full p-3 rounded-xl border-none text-sm font-bold mb-2">
                   <option value="بنك فلسطين">بنك فلسطين</option>
                   <option value="جوال بي (Jawwal Pay)">جوال بي (Jawwal Pay)</option>
                   <option value="بال بي (PalPay)">بال بي (PalPay)</option>
                   <option value="أخرى">أخرى (يدوي)</option>
                </select>
                <input id="from-other" placeholder="اسم البنك الآخر" class="hidden w-full p-3 mb-2 rounded-xl border-none text-sm font-bold">
                <input id="from-acc" type="text" placeholder="اسم صاحب حساب الفرن" class="w-full p-3 rounded-xl border-none text-sm font-bold">
             </div>
             <hr class="border-slate-700/50">
             <div>
                <label class="text-[10px] font-black uppercase text-emerald-500 block mb-1">حساب العامل (المستقبل)</label>
                <select id="pay-recipient-provider" class="w-full p-3 rounded-xl border-none text-sm font-bold mb-2">
                   <option value="بنك فلسطين">بنك فلسطين</option>
                   <option value="جوال بي (Jawwal Pay)">جوال بي (Jawwal Pay)</option>
                   <option value="بال بي (PalPay)">بال بي (PalPay)</option>
                   <option value="أخرى">أخرى (يدوي)</option>
                </select>
                <input id="to-other" placeholder="اسم بنك العامل الآخر" class="hidden w-full p-3 mb-2 rounded-xl border-none text-sm font-bold">
                <input id="to-acc" type="text" placeholder="اسم صاحب حساب العامل" class="w-full p-3 rounded-xl border-none text-sm font-bold">
             </div>
          </div>
        </div>
      `,
      didOpen: () => {
        const methodSelect = document.getElementById('pay-method') as HTMLSelectElement;
        const bankFields = document.getElementById('bank-fields');
        const senderProvider = document.getElementById('pay-sender-provider') as HTMLSelectElement;
        const recipientProvider = document.getElementById('pay-recipient-provider') as HTMLSelectElement;
        const fromOtherInput = document.getElementById('from-other') as HTMLInputElement;
        const toOtherInput = document.getElementById('to-other') as HTMLInputElement;

        methodSelect.addEventListener('change', () => {
          if (methodSelect.value === 'BANK') bankFields?.classList.remove('hidden');
          else bankFields?.classList.add('hidden');
        });

        senderProvider.addEventListener('change', () => {
          if (senderProvider.value === 'أخرى') fromOtherInput.classList.remove('hidden');
          else fromOtherInput.classList.add('hidden');
        });

        recipientProvider.addEventListener('change', () => {
          if (recipientProvider.value === 'أخرى') toOtherInput.classList.remove('hidden');
          else toOtherInput.classList.add('hidden');
        });
      },
      showCancelButton: true,
      confirmButtonText: 'تأكيد الصرف',
      cancelButtonText: 'إلغاء',
      preConfirm: () => {
        const method = (document.getElementById('pay-method') as HTMLSelectElement).value;
        const fromAcc = (document.getElementById('from-acc') as HTMLInputElement).value;
        const toAcc = (document.getElementById('to-acc') as HTMLInputElement).value;
        const senderProv = (document.getElementById('pay-sender-provider') as HTMLSelectElement).value;
        const recipProv = (document.getElementById('pay-recipient-provider') as HTMLSelectElement).value;
        const fromOther = (document.getElementById('from-other') as HTMLInputElement).value;
        const toOther = (document.getElementById('to-other') as HTMLInputElement).value;

        if (method === 'BANK') {
           if (!fromAcc.trim() || !toAcc.trim()) {
              Swal.showValidationMessage('يجب إدخال أسماء أصحاب الحسابات');
              return false;
           }
           if ((senderProv === 'أخرى' && !fromOther.trim()) || (recipProv === 'أخرى' && !toOther.trim())) {
              Swal.showValidationMessage('يجب كتابة اسم البنك اليدوي');
              return false;
           }
        }

        return {
          amount: Math.round(Number((document.getElementById('pay-amount') as HTMLInputElement).value)),
          method: method as PaymentMethod,
          senderProvider: senderProv as BankProvider,
          recipientProvider: recipProv as BankProvider,
          fromAccount: fromAcc,
          toAccount: toAcc,
          senderOtherProvider: fromOther,
          recipientOtherProvider: toOther
        }
      }
    }).then((result) => {
      if (result.isConfirmed) {
        const { amount, method, senderProvider, recipientProvider, fromAccount, toAccount, senderOtherProvider, recipientOtherProvider } = result.value;
        if (amount <= 0) return;
        
        const transaction: Transaction = {
          id: Math.random().toString(36).substr(2, 9),
          date: new Date().toISOString(),
          type: 'WORKER_PAYMENT',
          amount,
          description: `صرف أجور: ${worker.name}`,
          paymentMethod: method,
          workerId: worker.id,
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
        setWorkers(workers.map(w => w.id === worker.id ? { ...w, balance: w.balance - amount } : w));
        Swal.fire({ 
          icon: 'success', 
          title: 'تم بنجاح', 
          text: `تم صرف مبلغ ${amount} ₪ للعامل`, 
          customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } 
        });
      }
    });
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-black dark:text-white">شؤون العمال</h2>
        <button onClick={() => setIsAdding(true)} className="bg-slate-900 dark:bg-amber-500 text-white px-8 py-3 rounded-2xl font-black transition-all">+ إضافة عامل جديد</button>
      </div>

      {isAdding && (
        <div className="bg-white p-10 rounded-[2.5rem] shadow-xl dark:bg-[#0f172a] dark:border-slate-800 border border-slate-50 animate-slide-up">
           <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">اسم العامل الكامل</label>
                <input type="text" placeholder="الاسم" className="w-full p-4 bg-slate-50 dark:bg-[#1e293b] rounded-2xl border-none font-bold" value={newWorker.name} onChange={e => setNewWorker({...newWorker, name: e.target.value})}/>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">رقم الجوال (056 / 059)</label>
                <input type="text" placeholder="059xxxxxxx" className={`w-full p-4 bg-slate-50 dark:bg-[#1e293b] rounded-2xl border-none font-bold ${newWorker.phone && !validatePhone(newWorker.phone) ? 'ring-2 ring-rose-500' : ''}`} value={newWorker.phone} onChange={e => setNewWorker({...newWorker, phone: e.target.value})}/>
              </div>
              <div>
                <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-2 px-2">الأجر اليومي المتفق عليه (₪)</label>
                <input type="number" placeholder="الأجر اليومي" className="w-full p-4 bg-slate-50 dark:bg-[#1e293b] rounded-2xl border-none font-bold" value={newWorker.dailyWage} onChange={e => setNewWorker({...newWorker, dailyWage: Number(e.target.value)})}/>
              </div>
           </div>
           <div className="mt-8 flex gap-4">
              <button onClick={() => {
                 if (!newWorker.name || !validatePhone(newWorker.phone)) {
                   Swal.fire('خطأ في البيانات', 'يرجى إدخال اسم صحيح ورقم جوال فلسطيني يبدأ بـ 056 أو 059', 'error');
                   return;
                 }
                 setWorkers([...workers, { ...newWorker, id: Math.random().toString(), balance: 0 }]);
                 setIsAdding(false);
                 setNewWorker({ name: '', phone: '', dailyWage: 80 });
              }} className="bg-amber-500 text-white px-12 py-3 rounded-xl font-black">حفظ بيانات العامل</button>
              <button onClick={() => setIsAdding(false)} className="bg-slate-100 dark:bg-slate-800 text-slate-500 px-10 py-3 rounded-xl font-black">إلغاء</button>
           </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {workers.map(worker => (
          <div key={worker.id} className="bg-white p-8 rounded-[3rem] shadow-sm border border-slate-100 dark:bg-[#0f172a] dark:border-slate-800 group hover:shadow-2xl transition-all relative overflow-hidden">
            <div className="flex justify-between items-start mb-8">
               <div className="h-16 w-16 bg-amber-500/10 text-amber-600 rounded-2xl flex items-center justify-center">
                  <i className="bi bi-person-fill text-3xl"></i>
               </div>
               <div className="flex gap-2">
                 <a href={`tel:${worker.phone}`} className="h-10 w-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center hover:bg-emerald-500 hover:text-white transition-all shadow-sm">
                    <i className="bi bi-telephone-fill"></i>
                 </a>
                 <button onClick={() => setWorkers(workers.filter(w => w.id !== worker.id))} className="h-10 w-10 bg-rose-500/10 text-rose-500 rounded-xl flex items-center justify-center hover:bg-rose-500 hover:text-white transition-all shadow-sm">
                    <i className="bi bi-trash-fill"></i>
                 </button>
               </div>
            </div>
            <h3 className="text-2xl font-black text-slate-800 dark:text-white mb-1">{worker.name}</h3>
            <p className="text-xs font-bold text-slate-400 mb-6 tracking-[0.2em]">{worker.phone}</p>
            
            <div className="bg-slate-50 dark:bg-[#1e293b] p-6 rounded-3xl mb-8 border border-slate-100 dark:border-slate-800">
               <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black text-slate-400 uppercase">الأجر اليومي</span>
                  <span className="font-black text-slate-600 dark:text-slate-300">{worker.dailyWage} ₪</span>
               </div>
               <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">المستحقات المتراكمة</p>
               <h4 className="text-4xl font-black text-slate-900 dark:text-amber-500">{worker.balance} <span className="text-lg opacity-50">₪</span></h4>
            </div>

            <div className="flex gap-3">
               <button onClick={() => {
                  const today = new Date().toDateString();
                  if (worker.lastAttendance === today) return Swal.fire({ title: 'تنبيه الحضور', text: 'لقد قمت بتسجيل حضور هذا العامل لهذا اليوم مسبقاً', icon: 'info', customClass: { popup: settings.darkMode ? 'swal2-dark' : '' } });
                  setWorkers(workers.map(w => w.id === worker.id ? { ...w, balance: w.balance + w.dailyWage, lastAttendance: today } : w));
               }} className="flex-1 bg-amber-500 text-white font-black py-4 rounded-2xl shadow-lg transition-all active:scale-95">تسجيل حضور</button>
               <button onClick={() => payWorker(worker)} className="flex-1 bg-slate-900 dark:bg-white dark:text-slate-900 text-white font-black py-4 rounded-2xl transition-all active:scale-95">صرف الأجر</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WorkerManager;
