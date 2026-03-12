
import React from 'react';
import { ViewType, ThemeColor } from '../types';

interface SidebarProps {
  activeView: ViewType;
  setView: (view: ViewType) => void;
  isMinimized: boolean;
  onToggle: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  accentColor: ThemeColor;
}

const Sidebar: React.FC<SidebarProps> = ({ activeView, setView, isMinimized, onToggle, isMobileOpen, onCloseMobile, accentColor }) => {
  const menuItems: { id: ViewType; label: string; icon: string }[] = [
    { id: 'DASHBOARD', label: 'لوحة التحكم', icon: 'bi-grid-1x2-fill' },
    { id: 'SALES', label: 'إرسالية خبز', icon: 'bi-fire' },
    { id: 'INVENTORY', label: 'المواد والمخزون', icon: 'bi-box-seam-fill' },
    { id: 'PRODUCTS', label: 'تعرفة الخدمات', icon: 'bi-tag-fill' },
    { id: 'WORKERS', label: 'شؤون العمال', icon: 'bi-people-fill' },
    { id: 'CUSTOMERS', label: 'الزبائن والديون', icon: 'bi-person-badge-fill' },
    { id: 'FINANCE', label: 'السجل المالي', icon: 'bi-graph-up-arrow' },
    { id: 'SETTINGS', label: 'الإعدادات', icon: 'bi-sliders' },
  ];

  const colorClasses = {
    amber: 'bg-amber-500 shadow-amber-500/40',
    blue: 'bg-blue-600 shadow-blue-600/40',
    emerald: 'bg-emerald-500 shadow-emerald-500/40',
    rose: 'bg-rose-500 shadow-rose-500/40',
    slate: 'bg-slate-700 shadow-slate-700/40',
  };

  const activeColor = {
    amber: 'bg-amber-500/10 text-amber-500 border-r-4 border-amber-500 shadow-[inset_0_0_20px_rgba(245,158,11,0.05)]',
    blue: 'bg-blue-600/10 text-blue-500 border-r-4 border-blue-600 shadow-[inset_0_0_20px_rgba(37,99,235,0.05)]',
    emerald: 'bg-emerald-500/10 text-emerald-500 border-r-4 border-emerald-500 shadow-[inset_0_0_20px_rgba(16,185,129,0.05)]',
    rose: 'bg-rose-500/10 text-rose-500 border-r-4 border-rose-500 shadow-[inset_0_0_20px_rgba(244,63,94,0.05)]',
    slate: 'bg-slate-500/10 text-slate-400 border-r-4 border-slate-500 shadow-[inset_0_0_20px_rgba(71,85,105,0.05)]',
  };

  return (
    <>
      {isMobileOpen && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-40 lg:hidden" onClick={onCloseMobile}></div>
      )}

      <div className={`
        fixed inset-y-0 right-0 z-50 w-80 bg-[#070b14] border-l border-white/5 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] flex flex-col no-print
        ${isMinimized ? 'translate-x-full opacity-0 pointer-events-none' : 'translate-x-0 opacity-100'}
        ${isMobileOpen ? 'translate-x-0 !opacity-100 !pointer-events-auto shadow-2xl' : ''}
      `}>
        <div className="p-10 flex flex-col items-center gap-8 relative">
          <button 
            onClick={onToggle}
            className={`
              relative h-32 w-32 rounded-[3rem] flex items-center justify-center transition-all duration-700 
              active:scale-90
              ${colorClasses[accentColor]}
              before:content-[''] before:absolute before:inset-0 before:rounded-[3rem] before:bg-inherit before:blur-2xl before:opacity-30 before:transition-opacity hover:before:opacity-80
              hover:animate-spin-fakhim
            `}
          >
            <i className="bi bi-fire text-7xl text-white"></i>
          </button>
          
          <div className="text-center mt-4">
            <h2 className="text-3xl font-black text-white tracking-tighter uppercase italic">BakeTrack</h2>
            <div className="flex items-center justify-center gap-2 mt-2">
               <span className="h-px w-6 bg-slate-800"></span>
               <p className={`text-[10px] font-black uppercase tracking-[0.4em] ${accentColor === 'amber' ? 'text-amber-500' : 'text-slate-500'}`}>Diamond Edition</p>
               <span className="h-px w-6 bg-slate-800"></span>
            </div>
          </div>
        </div>

        <nav className="flex-1 mt-6 px-6 space-y-3 overflow-y-auto custom-scrollbar">
          {menuItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`w-full flex items-center gap-5 px-6 py-5 rounded-2xl transition-all duration-300 group ${
                activeView === item.id 
                  ? `${activeColor[accentColor]} font-black scale-[1.02] shadow-xl` 
                  : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className={`transition-all duration-500 ${activeView === item.id ? 'scale-125' : 'group-hover:scale-125'}`}>
                 <i className={`bi ${item.icon} text-xl`}></i>
              </div>
              <span className="text-sm font-bold tracking-wide">{item.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-8 text-center border-t border-white/5">
           <p className="text-[10px] font-black text-slate-700 uppercase tracking-widest">Enterprise Solution © 2025</p>
        </div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar { width: 4px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
        
        @keyframes spin-fakhim {
            0% { transform: rotate(0deg) scale(1.1); }
            100% { transform: rotate(360deg) scale(1.1); }
        }
        .hover\\:animate-spin-fakhim:hover {
            animation: spin-fakhim 4s cubic-bezier(0.4, 0, 0.2, 1) infinite;
        }
      `}</style>
    </>
  );
};

export default Sidebar;
