
import React, { useState, useMemo } from 'react';
import { Transaction, AppSettings } from '../types';

interface FinanceManagerProps {
  transactions: Transaction[];
  setTransactions: React.Dispatch<React.SetStateAction<Transaction[]>>;
  settings: AppSettings;
}

const FinanceManager: React.FC<FinanceManagerProps> = ({ transactions, settings }) => {
  const today = new Date().toISOString().split('T')[0];
  const firstDayOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];

  const [dateFrom, setDateFrom] = useState(firstDayOfMonth);
  const [dateTo, setDateTo] = useState(today);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(t => {
      const tDate = t.date.split('T')[0];
      return tDate >= dateFrom && tDate <= dateTo;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, dateFrom, dateTo]);

  const totalIn = filteredTransactions.filter(t => t.type === 'SALE' || t.type === 'CUSTOMER_PAYMENT').reduce((s, t) => s + t.amount, 0);
  const totalOut = filteredTransactions.filter(t => t.type === 'EXPENSE' || t.type === 'WORKER_PAYMENT').reduce((s, t) => s + t.amount, 0);

  const handlePrint = () => {
    window.print();
  };

  const getStatus = (type: string) => {
    if (type === 'SALE' || type === 'CUSTOMER_PAYMENT') return { label: 'وارد', color: 'text-emerald-600', printColor: '#059669' };
    return { label: 'صادر', color: 'text-rose-600', printColor: '#e11d48' };
  };

  const getMethodLabel = (method: string) => {
    switch(method) {
      case 'CASH': return 'نقدي';
      case 'BANK': return 'بنكي';
      case 'PREPAID': return 'رصيد';
      case 'DEBT': return 'دين';
      default: return method;
    }
  };

  const chunkTransactions = (array: Transaction[], size: number) => {
    const chunked = [];
    for (let i = 0; i < array.length; i += size) {
      chunked.push(array.slice(i, i + size));
    }
    return chunked;
  };

  const printPages = chunkTransactions(filteredTransactions, 30);

  return (
    <div className="space-y-8 animate-fade-in pb-20">
      <div className="no-print bg-white dark:bg-[#0f172a] p-8 rounded-[2.5rem] shadow-sm border border-slate-100 dark:border-slate-800 space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-center gap-6">
           <div className="flex items-center gap-4">
              <div className="h-12 w-12 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center">
                 <i className="bi bi-calendar-range-fill text-xl"></i>
              </div>
              <div>
                 <h3 className="text-xl font-black dark:text-white">تحديد الفترة الزمنية</h3>
                 <p className="text-xs font-bold text-slate-400">اختر النطاق لاستخراج التقارير والطباعة</p>
              </div>
           </div>
           <button 
             onClick={handlePrint} 
             className="w-full md:w-auto bg-slate-900 dark:bg-blue-600 text-white px-10 py-4 rounded-2xl font-black shadow-2xl hover:scale-105 transition-all flex items-center justify-center gap-3"
           >
             <i className="bi bi-printer-fill text-xl"></i>
             طباعة التقرير المختار (PDF)
           </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4 border-t border-slate-50 dark:border-slate-800">
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">من تاريخ</label>
              <input type="date" value={dateFrom} onChange={(e) => setDateFrom(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1e293b] dark:text-white border-none p-4 rounded-2xl font-bold outline-none" />
           </div>
           <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-2">إلى تاريخ</label>
              <input type="date" value={dateTo} onChange={(e) => setDateTo(e.target.value)} className="w-full bg-slate-50 dark:bg-[#1e293b] dark:text-white border-none p-4 rounded-2xl font-bold outline-none" />
           </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 no-print">
        <div className={`p-8 rounded-[2.5rem] border ${settings.darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">وارد الفترة</p>
          <h4 className="text-3xl font-black text-emerald-500">{totalIn.toLocaleString()} ₪</h4>
        </div>
        <div className={`p-8 rounded-[2.5rem] border ${settings.darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">صادر الفترة</p>
          <h4 className="text-3xl font-black text-rose-500">{totalOut.toLocaleString()} ₪</h4>
        </div>
        <div className={`p-8 rounded-[2.5rem] border ${settings.darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
          <p className="text-xs font-black text-slate-400 uppercase tracking-widest mb-1">صافي الفترة</p>
          <h4 className="text-3xl font-black text-blue-500">{(totalIn - totalOut).toLocaleString()} ₪</h4>
        </div>
      </div>

      <div className={`rounded-[2.5rem] border overflow-hidden no-print ${settings.darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100 shadow-sm'}`}>
        <div className="overflow-x-auto">
          <table className="w-full text-right border-collapse">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/50 text-slate-400 text-[10px] font-black uppercase tracking-widest border-b dark:border-slate-800">
                <th className="py-5 px-8">التاريخ والوقت</th>
                <th className="py-5 px-8">البيان والتفاصيل</th>
                <th className="py-5 px-8 text-center">الطريقة</th>
                <th className="py-5 px-8 text-center">الحالة</th>
                <th className="py-5 px-8 text-left">المبلغ</th>
              </tr>
            </thead>
            <tbody className="text-sm divide-y dark:divide-slate-800">
              {filteredTransactions.map(t => {
                const status = getStatus(t.type);
                return (
                  <tr key={t.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/20 transition-colors">
                    <td className="py-5 px-8">
                       <p className="font-bold text-slate-700 dark:text-white">{new Date(t.date).toLocaleDateString('ar-EG')}</p>
                       <p className="text-[10px] text-slate-400 font-bold">{new Date(t.date).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</p>
                    </td>
                    <td className="py-5 px-8 font-bold">{t.description}</td>
                    <td className="py-5 px-8 text-center"><span className="px-3 py-1 bg-slate-100 dark:bg-slate-800 rounded-lg text-[10px] font-black">{getMethodLabel(t.paymentMethod)}</span></td>
                    <td className={`py-5 px-8 text-center font-black ${status.color}`}>{status.label}</td>
                    <td className={`py-5 px-8 text-left font-black text-lg ${status.label === 'وارد' ? 'text-emerald-500' : 'text-rose-500'}`}>
                      {t.amount} ₪
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* حاوية الطباعة النهائية */}
      <div className="print-report-container hidden print:block">
        {printPages.map((pageGroup, pageIndex) => (
          <div key={pageIndex} className="print-page bg-white p-[15mm] text-slate-900" style={{ pageBreakAfter: 'always' }}>
            <div className="flex justify-between items-center mb-10 border-b-4 border-slate-900 pb-6">
               <div className="text-right">
                  <h1 className="text-4xl font-black text-slate-900">BakeTrack PRO</h1>
                  <p className="text-slate-500 font-bold">تقرير مالي من <span className="text-slate-900">{dateFrom}</span> إلى <span className="text-slate-900">{dateTo}</span></p>
               </div>
               <div className="text-left font-bold text-xs leading-relaxed">
                  <p>الصفحة: {pageIndex + 1} من {printPages.length}</p>
                  <p>تاريخ الاستخراج: {new Date().toLocaleDateString('ar-EG')}</p>
               </div>
            </div>

            <table className="w-full border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-[10px] font-black">
                  <th className="p-3 border border-slate-900 text-right">التاريخ</th>
                  <th className="p-3 border border-slate-900 text-right">الوقت</th>
                  <th className="p-3 border border-slate-900 text-right">البيان</th>
                  <th className="p-3 border border-slate-900 text-center">الطريقة</th>
                  <th className="p-3 border border-slate-900 text-center">الحالة</th>
                  <th className="p-3 border border-slate-900 text-left">المبلغ</th>
                </tr>
              </thead>
              <tbody>
                {pageGroup.map(t => {
                  const status = getStatus(t.type);
                  return (
                    <tr key={t.id} className="text-[10px] border-b border-slate-200">
                      <td className="p-3 border border-slate-100">{new Date(t.date).toLocaleDateString('ar-EG')}</td>
                      <td className="p-3 border border-slate-100">{new Date(t.date).toLocaleTimeString('ar-EG', {hour:'2-digit', minute:'2-digit'})}</td>
                      <td className="p-3 border border-slate-100 font-bold">{t.description}</td>
                      <td className="p-3 border border-slate-100 text-center">{getMethodLabel(t.paymentMethod)}</td>
                      <td className="p-3 border border-slate-100 text-center font-black" style={{ color: status.printColor }}>{status.label}</td>
                      <td className="p-3 border border-slate-100 text-left font-black">{t.amount} ₪</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            {pageIndex === printPages.length - 1 && (
              <div className="mt-12 grid grid-cols-3 gap-6 border-t-2 border-slate-900 pt-8">
                 <div className="bg-slate-50 p-5 rounded-2xl text-center border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">إجمالي الوارد</p>
                    <p className="text-2xl font-black text-emerald-600">{totalIn} ₪</p>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-2xl text-center border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">إجمالي الصادر</p>
                    <p className="text-2xl font-black text-rose-600">{totalOut} ₪</p>
                 </div>
                 <div className="bg-slate-50 p-5 rounded-2xl text-center border border-slate-200">
                    <p className="text-[9px] font-black text-slate-400 mb-1 uppercase">صافي الأرباح</p>
                    <p className="text-2xl font-black text-blue-600">{totalIn - totalOut} ₪</p>
                 </div>
              </div>
            )}
          </div>
        ))}
      </div>

      <style>{`
        @media print {
          /* إعادة ضبط التدفق لضمان طباعة كل الصفحات */
          .print-report-container { 
            display: block !important; 
            visibility: visible !important;
            position: static !important;
            width: 100% !important;
          }
          .print-page { 
            page-break-after: always !important; 
            width: 210mm !important;
            min-height: 297mm !important;
            box-sizing: border-box !important;
            margin: 0 auto !important;
          }
          .no-print { display: none !important; }
        }
      `}</style>
    </div>
  );
};

export default FinanceManager;
