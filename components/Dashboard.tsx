
import React from 'react';
import { Product, Worker, Customer, Transaction, ProductionRun, Inventory, AppSettings } from '../types';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DashboardProps {
  products: Product[];
  workers: Worker[];
  customers: Customer[];
  transactions: Transaction[];
  production: ProductionRun[];
  inventory: Inventory;
  settings: AppSettings;
}

const Dashboard: React.FC<DashboardProps> = ({ products, workers, customers, transactions, production, inventory, settings }) => {
  const totalRevenue = transactions.filter(t => t.type === 'SALE' || t.type === 'CUSTOMER_PAYMENT').reduce((sum, t) => sum + t.amount, 0);
  const totalExpenses = transactions.filter(t => t.type === 'EXPENSE' || t.type === 'WORKER_PAYMENT').reduce((sum, t) => sum + t.amount, 0);
  const totalDebts = customers.reduce((sum, c) => sum + c.debt, 0);

  const isWoodLow = inventory.wood < 300;
  const isOilLow = inventory.oil < 100;

  const chartData = [
    { name: 'السبت', value: 2100 },
    { name: 'الأحد', value: 1800 },
    { name: 'الإثنين', value: 2400 },
    { name: 'الثلاثاء', value: 2200 },
    { name: 'الأربعاء', value: 2800 },
    { name: 'الخميس', value: 3200 },
    { name: 'الجمعة', value: 3000 },
  ];

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Critical Inventory Alerts */}
      {(isWoodLow || isOilLow) && (
        <div className="bg-rose-600 text-white p-6 rounded-3xl shadow-xl animate-pulse flex flex-col md:flex-row items-center gap-6 border-4 border-rose-400">
          <div className="h-16 w-16 bg-white/20 rounded-2xl flex items-center justify-center shrink-0">
            <i className="bi bi-exclamation-triangle-fill text-3xl"></i>
          </div>
          <div>
            <h4 className="text-2xl font-black tracking-tight">تنبيه: المخزون منخفض جداً!</h4>
            <p className="text-rose-100 font-bold mt-1">الرجاء الاهتمام بتوفير المواد لضمان استمرار العمل...</p>
            <div className="flex gap-4 mt-3">
              {isWoodLow && <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/20">الحطب: {inventory.wood} كجم</span>}
              {isOilLow && <span className="bg-white/10 px-3 py-1 rounded-full text-xs font-bold border border-white/20">الزيت: {inventory.oil} لتر</span>}
            </div>
          </div>
        </div>
      )}

      {/* Upper Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <MetricCard title="إجمالي الدخل" value={`${totalRevenue.toLocaleString()} ₪`} icon="bi-cash-stack" trend="+12%" color="from-emerald-500 to-teal-600" />
        <MetricCard title="المصروفات" value={`${totalExpenses.toLocaleString()} ₪`} icon="bi-cart-dash" trend="-5%" color="from-rose-500 to-red-600" />
        <MetricCard title="الديون المستحقة" value={`${totalDebts.toLocaleString()} ₪`} icon="bi-person-exclamation" trend="تنبيه" color="from-amber-500 to-orange-600" />
        <MetricCard title="حالة المخزون" value={`${((inventory.wood + inventory.oil) / 10).toFixed(0)}%`} icon="bi-fuel-pump" trend="متوفر" color="from-slate-700 to-slate-900" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className={`lg:col-span-2 p-8 rounded-3xl shadow-sm border ${settings.darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}>
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-xl font-bold dark:text-white">الأداء المالي الأسبوعي</h3>
            <span className="text-xs font-bold text-slate-400 bg-slate-50 dark:bg-slate-800 px-3 py-1 rounded-full uppercase tracking-widest">آخر 7 أيام</span>
          </div>
          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={settings.darkMode ? '#fbbf24' : '#10b981'} stopOpacity={0.1}/>
                    <stop offset="95%" stopColor={settings.darkMode ? '#fbbf24' : '#10b981'} stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke={settings.darkMode ? '#1e293b' : '#f1f5f9'} />
                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <Tooltip contentStyle={{borderRadius: '12px', border: 'none', backgroundColor: settings.darkMode ? '#1e293b' : '#ffffff', color: settings.darkMode ? '#ffffff' : '#000000', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'}} />
                <Area type="monotone" dataKey="value" stroke={settings.darkMode ? '#fbbf24' : '#10b981'} strokeWidth={3} fillOpacity={1} fill="url(#colorValue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className={`p-8 rounded-3xl shadow-sm border space-y-8 ${settings.darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}>
          <h3 className="text-xl font-bold dark:text-white">مراقبة المواد</h3>
          
          <div className="space-y-6">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold dark:text-slate-300">مخزون الحطب</span>
                <span className={`text-sm font-bold ${isWoodLow ? 'text-rose-600' : 'text-emerald-600 dark:text-amber-500'}`}>{inventory.wood} كجم</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${isWoodLow ? 'bg-rose-500' : 'bg-amber-500'}`} style={{width: `${Math.min(100, (inventory.wood / 1000) * 100)}%`}}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-bold dark:text-slate-300">مخزون الزيت</span>
                <span className={`text-sm font-bold ${isOilLow ? 'text-rose-600' : 'text-blue-600 dark:text-blue-400'}`}>{inventory.oil} لتر</span>
              </div>
              <div className="w-full bg-slate-100 dark:bg-slate-800 h-3 rounded-full overflow-hidden">
                <div className={`h-full transition-all duration-1000 ${isOilLow ? 'bg-rose-500' : 'bg-blue-500'}`} style={{width: `${Math.min(100, (inventory.oil / 200) * 100)}%`}}></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-2xl">
            <h4 className="text-xs font-bold text-slate-400 mb-3 uppercase tracking-widest">إحصائيات اليوم</h4>
            <div className="space-y-3">
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">عمليات الخبز:</span>
                  <span className="font-black dark:text-white">{production.filter(p => new Date(p.date).toDateString() === new Date().toDateString()).length}</span>
               </div>
               <div className="flex justify-between text-sm">
                  <span className="text-slate-500 dark:text-slate-400 font-bold">تحصيل الديون:</span>
                  <span className="font-black text-emerald-600 dark:text-emerald-400">+{transactions.filter(t => t.type === 'CUSTOMER_PAYMENT' && new Date(t.date).toDateString() === new Date().toDateString()).reduce((s,t)=>s+t.amount,0)} ₪</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard = ({ title, value, icon, trend, color }: any) => (
  <div className={`relative overflow-hidden bg-gradient-to-br ${color} p-6 rounded-3xl shadow-lg animate-slide-up`}>
    <div className="relative z-10 flex flex-col h-full justify-between">
      <div className="flex justify-between items-start">
        <div className="p-2 bg-white/20 rounded-xl backdrop-blur-md">
          <i className={`bi ${icon} text-white text-xl`}></i>
        </div>
        <span className="text-xs font-bold text-white/80 bg-white/10 px-2 py-1 rounded-full">{trend}</span>
      </div>
      <div className="mt-4">
        <p className="text-white/70 text-sm font-bold uppercase tracking-wider">{title}</p>
        <h4 className="text-3xl font-black text-white mt-1">{value}</h4>
      </div>
    </div>
    <div className="absolute -right-4 -bottom-4 bg-white/10 w-24 h-24 rounded-full blur-2xl"></div>
  </div>
);

export default Dashboard;
