
import React, { useState, useEffect } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './components/Dashboard';
import ProductManager from './components/ProductManager';
import WorkerManager from './components/WorkerManager';
import CustomerManager from './components/CustomerManager';
import FinanceManager from './components/FinanceManager';
import SalesManager from './components/SalesManager';
import InventoryManager from './components/InventoryManager';
import SettingsManager from './components/SettingsManager';
import { ViewType, Product, Worker, Customer, Transaction, ProductionRun, Inventory, AppSettings } from './types';
import { loadData, saveData, KEYS } from './utils/storage';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>('DASHBOARD');
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [isSidebarMobileOpen, setIsSidebarMobileOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  const [products, setProducts] = useState<Product[]>(() => loadData(KEYS.PRODUCTS, []));
  const [workers, setWorkers] = useState<Worker[]>(() => loadData(KEYS.WORKERS, []));
  const [customers, setCustomers] = useState<Customer[]>(() => loadData(KEYS.CUSTOMERS, []));
  const [transactions, setTransactions] = useState<Transaction[]>(() => loadData(KEYS.TRANSACTIONS, []));
  const [production, setProduction] = useState<ProductionRun[]>(() => loadData(KEYS.PRODUCTION, []));
  const [inventory, setInventory] = useState<Inventory>(() => loadData(KEYS.INVENTORY, { wood: 500, oil: 100 }));
  const [settings, setSettings] = useState<AppSettings>(() => loadData('baketrack_settings', { darkMode: false, accentColor: 'amber' }));

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => { saveData(KEYS.PRODUCTS, products); }, [products]);
  useEffect(() => { saveData(KEYS.WORKERS, workers); }, [workers]);
  useEffect(() => { saveData(KEYS.CUSTOMERS, customers); }, [customers]);
  useEffect(() => { saveData(KEYS.TRANSACTIONS, transactions); }, [transactions]);
  useEffect(() => { saveData(KEYS.PRODUCTION, production); }, [production]);
  useEffect(() => { saveData(KEYS.INVENTORY, inventory); }, [inventory]);
  useEffect(() => { saveData('baketrack_settings', settings); }, [settings]);

  const toggleSidebar = () => setIsSidebarMinimized(!isSidebarMinimized);

  const renderView = () => {
    const commonProps = { products, workers, customers, transactions, production, inventory, settings };
    switch (currentView) {
      case 'DASHBOARD': return <Dashboard {...commonProps} />;
      case 'PRODUCTS': return <ProductManager products={products} setProducts={setProducts} settings={settings} />;
      case 'WORKERS': return <WorkerManager workers={workers} setWorkers={setWorkers} transactions={transactions} setTransactions={setTransactions} settings={settings} />;
      case 'CUSTOMERS': return <CustomerManager customers={customers} setCustomers={setCustomers} transactions={transactions} setTransactions={setTransactions} settings={settings} />;
      case 'SALES': return <SalesManager {...commonProps} setCustomers={setCustomers} setTransactions={setTransactions} setProduction={setProduction} />;
      case 'FINANCE': return <FinanceManager transactions={transactions} setTransactions={setTransactions} settings={settings} />;
      case 'INVENTORY': return <InventoryManager inventory={inventory} setInventory={setInventory} transactions={transactions} setTransactions={setTransactions} settings={settings} />;
      case 'SETTINGS': return <SettingsManager settings={settings} setSettings={setSettings} />;
      default: return <Dashboard {...commonProps} />;
    }
  };

  const colorMap = {
    amber: 'from-amber-500 to-orange-600',
    blue: 'from-blue-600 to-indigo-700',
    emerald: 'from-emerald-500 to-teal-700',
    rose: 'from-rose-500 to-pink-700',
    slate: 'from-slate-700 to-slate-900'
  };

  const accentHex = {
    amber: '#f59e0b',
    blue: '#2563eb',
    emerald: '#10b981',
    rose: '#f43f5e',
    slate: '#475569'
  };

  const formattedTime = currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedDate = currentTime.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className={`flex h-screen overflow-hidden font-sans transition-all duration-500 ${settings.darkMode ? 'dark bg-[#05070a] text-slate-100' : 'bg-slate-50 text-slate-900'} print-layout-reset`}>
      
      <Sidebar 
        activeView={currentView} 
        setView={(v) => { setCurrentView(v); setIsSidebarMobileOpen(false); }} 
        isMinimized={isSidebarMinimized}
        onToggle={toggleSidebar}
        isMobileOpen={isSidebarMobileOpen}
        onCloseMobile={() => setIsSidebarMobileOpen(false)}
        accentColor={settings.accentColor}
      />

      <main className={`flex-1 overflow-y-auto transition-all duration-700 relative main-content-reset ${isSidebarMinimized ? 'mr-0' : 'lg:mr-80'}`}>
        
        {isSidebarMinimized && (
          <button 
            onClick={toggleSidebar}
            className={`fixed top-8 right-8 h-14 w-14 rounded-2xl shadow-2xl z-40 flex items-center justify-center text-white bg-gradient-to-tr ${colorMap[settings.accentColor]} animate-slide-left no-print border-4 ${settings.darkMode ? 'border-slate-800 shadow-amber-500/20' : 'border-white'} hover:scale-110 transition-transform`}
          >
            <i className="bi bi-list text-2xl"></i>
          </button>
        )}

        <div className="p-4 lg:p-12 max-w-[1600px] mx-auto min-h-screen">
          <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6 no-print animate-fade-in">
            <div className="flex items-center gap-6">
              <div className={`h-16 w-1 rounded-full bg-gradient-to-b ${colorMap[settings.accentColor]} hidden md:block`}></div>
              <div>
                <h1 className={`text-3xl lg:text-5xl font-black tracking-tight ${settings.darkMode ? 'text-white' : 'text-slate-900'}`}>
                  BakeTrack <span className={`text-transparent bg-clip-text bg-gradient-to-r ${colorMap[settings.accentColor]}`}>PRO</span>
                </h1>
                <p className={`${settings.darkMode ? 'text-slate-400' : 'text-slate-500'} font-bold text-xs uppercase tracking-[0.3em] mt-2`}>Diamond Edition Enterprise</p>
              </div>
            </div>
            
            <div className={`group px-8 py-4 rounded-[2.5rem] shadow-sm flex items-center gap-6 border transition-all duration-500 hover:shadow-xl ${settings.darkMode ? 'bg-[#0f172a] border-slate-800' : 'bg-white border-slate-100'}`}>
              <div className="text-right">
                <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">الاستعداد التشغيلي</p>
                <div className={`text-sm font-black flex flex-col items-end ${settings.darkMode ? 'text-slate-200' : 'text-slate-700'}`}>
                  <span className="flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    {formattedDate}
                  </span>
                  <span className={`text-lg font-black mt-1 ${settings.darkMode ? 'text-emerald-500' : 'text-emerald-600'}`}>{formattedTime}</span>
                </div>
              </div>
              <div className={`h-14 w-14 rounded-2xl flex items-center justify-center text-white bg-gradient-to-tr ${colorMap[settings.accentColor]} shadow-lg transition-transform group-hover:rotate-12`}>
                <i className="bi bi-cpu-fill text-xl"></i>
              </div>
            </div>
          </header>

          <div className="relative pb-20">
             {renderView()}
          </div>
        </div>
      </main>

      <style>{`
        /* التحريك والظهور */
        @keyframes slide-left { from { transform: translateX(50px); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
        .animate-slide-left { animation: slide-left 0.4s cubic-bezier(0.16, 1, 0.3, 1); }
        .animate-fade-in { animation: fade-in 0.6s ease-out; }
        @keyframes fade-in { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        
        /* القواعد العالمية للوضع المظلم لضمان الوضوح التام */
        .dark .text-slate-900, .dark .text-slate-800, .dark .text-slate-700, .dark h1, .dark h2, .dark h3, .dark h4 { color: #ffffff !important; }
        .dark .text-slate-500, .dark .text-slate-600 { color: #cbd5e1 !important; }
        .dark .bg-white { background-color: #0f172a !important; border-color: #1e293b !important; }
        .dark .bg-slate-50 { background-color: #1e293b !important; }
        .dark .border-slate-100, .dark .border-slate-50, .dark .border { border-color: #1e293b !important; }

        /* تطبيق لون الهوية على كافة الأزرار والأرقام */
        .bg-amber-500 { background-color: ${accentHex[settings.accentColor]} !important; }
        .text-amber-500 { color: ${accentHex[settings.accentColor]} !important; }
        .border-amber-500 { border-color: ${accentHex[settings.accentColor]} !important; }
        .ring-amber-500 { --tw-ring-color: ${accentHex[settings.accentColor]} !important; }

        /* تحسين SweetAlert العالمي لضمان وضوح 100% */
        .swal2-popup { border-radius: 2.5rem !important; font-family: 'Tajawal', sans-serif !important; padding: 2.5rem !important; box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.25) !important; }
        .swal2-title { color: #0f172a !important; font-weight: 800 !important; font-size: 1.8rem !important; }
        .swal2-html-container { color: #1e293b !important; font-weight: 700 !important; }
        .swal2-input, .swal2-select { border-radius: 1.25rem !important; background: #f8fafc !important; border: 2px solid #e2e8f0 !important; color: #0f172a !important; font-weight: 800 !important; height: 4rem !important; }
        .swal2-confirm { background-color: ${accentHex[settings.accentColor]} !important; color: #ffffff !important; border-radius: 1.25rem !important; font-weight: 800 !important; padding: 1rem 3rem !important; }
        
        /* الوضع المظلم لـ SweetAlert */
        .swal2-popup.swal2-dark { background: #0f172a !important; border: 2px solid #334155 !important; color: #ffffff !important; }
        .swal2-popup.swal2-dark .swal2-title { color: #ffffff !important; }
        .swal2-popup.swal2-dark .swal2-html-container { color: #cbd5e1 !important; }
        .swal2-popup.swal2-dark .swal2-input, .swal2-popup.swal2-dark .swal2-select { background: #1e293b !important; color: #ffffff !important; border: 1px solid #334155 !important; }

        /* تنسيقات الطباعة العالمية */
        @media print {
          body, html { 
            height: auto !important; 
            overflow: visible !important; 
            background: white !important;
          }
          .print-layout-reset {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
            position: static !important;
          }
          .main-content-reset {
            display: block !important;
            height: auto !important;
            overflow: visible !important;
            position: static !important;
            margin: 0 !important;
            padding: 0 !important;
          }
          .no-print { display: none !important; }
          #root { height: auto !important; }
        }
      `}</style>
    </div>
  );
};

export default App;
