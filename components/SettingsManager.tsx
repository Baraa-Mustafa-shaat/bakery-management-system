
import React from 'react';
import { AppSettings, ThemeColor } from '../types';

interface SettingsManagerProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
}

const SettingsManager: React.FC<SettingsManagerProps> = ({ settings, setSettings }) => {
  const colors: { id: ThemeColor; label: string; class: string; glow: string }[] = [
    { id: 'amber', label: 'الذهبي الملكي', class: 'bg-amber-500', glow: 'shadow-amber-500/40' },
    { id: 'blue', label: 'الأزرق التقني', class: 'bg-blue-600', glow: 'shadow-blue-600/40' },
    { id: 'emerald', label: 'أخضر الزمرد', class: 'bg-emerald-500', glow: 'shadow-emerald-500/40' },
    { id: 'rose', label: 'الأحمر الفاخر', class: 'bg-rose-500', glow: 'shadow-rose-500/40' },
    { id: 'slate', label: 'الرمادي الصناعي', class: 'bg-slate-700', glow: 'shadow-slate-700/40' },
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-fade-in py-6">
      <div className="text-center space-y-3">
        <h2 className="text-5xl font-black text-slate-800 dark:text-white tracking-tighter">مركز التحكم المخصص</h2>
        <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">اضبط بيئة عملك بما يناسب ذوقك</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Appearance Card */}
        <div className="bg-white p-10 rounded-[3rem] shadow-2xl dark:bg-slate-900 border border-slate-50 dark:border-slate-800 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/5 -rotate-45 translate-x-12 -translate-y-12 transition-transform group-hover:scale-150 duration-700"></div>
          
          <h3 className="text-xl font-black mb-10 flex items-center gap-4 text-slate-800 dark:text-white">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <i className="bi bi-palette2"></i>
              </div>
              ألوان النظام (الهوية البصرية)
          </h3>

          <div className="grid grid-cols-1 gap-4">
            {colors.map(color => (
              <button
                key={color.id}
                onClick={() => setSettings({ ...settings, accentColor: color.id })}
                className={`flex items-center justify-between p-5 rounded-[2rem] transition-all duration-500 border ${settings.accentColor === color.id ? 'bg-slate-50 dark:bg-slate-800 border-slate-200 dark:border-slate-700 scale-[1.02] shadow-xl' : 'opacity-40 hover:opacity-100 border-transparent hover:bg-slate-50 dark:hover:bg-slate-800/50 grayscale hover:grayscale-0'}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-2xl ${color.class} ${color.glow} shadow-lg transition-transform duration-500 group-hover:rotate-12`}></div>
                  <span className="font-black text-sm text-slate-700 dark:text-slate-300">{color.label}</span>
                </div>
                {settings.accentColor === color.id && <i className="bi bi-patch-check-fill text-amber-500 text-xl"></i>}
              </button>
            ))}
          </div>
        </div>

        {/* Display & System Card */}
        <div className="space-y-8">
           <div className="bg-white p-10 rounded-[3rem] shadow-2xl dark:bg-slate-900 border border-slate-50 dark:border-slate-800 h-full">
              <h3 className="text-xl font-black mb-10 flex items-center gap-4 text-slate-800 dark:text-white">
                  <div className="h-10 w-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-500">
                    <i className="bi bi-display"></i>
                  </div>
                  خيارات العرض
              </h3>

              <div className="space-y-6">
                <div className="p-8 bg-slate-50 dark:bg-slate-800 rounded-[2.5rem] flex flex-col items-center text-center gap-6 border border-transparent hover:border-indigo-500/20 transition-all">
                  <div className={`h-20 w-20 rounded-3xl flex items-center justify-center transition-all duration-700 ${settings.darkMode ? 'bg-indigo-500 text-white rotate-[360deg] shadow-2xl shadow-indigo-500/40' : 'bg-amber-100 text-amber-500 shadow-xl'}`}>
                     <i className={`bi ${settings.darkMode ? 'bi-moon-stars-fill' : 'bi-sun-fill'} text-4xl`}></i>
                  </div>
                  <div>
                    <p className="font-black text-xl text-slate-800 dark:text-white">الوضع الليلي المتطور</p>
                    <p className="text-xs text-slate-400 font-bold mt-2">استخدم الوضع الداكن لراحة العين وكفاءة الاستخدام</p>
                  </div>
                  <button 
                    onClick={() => setSettings({ ...settings, darkMode: !settings.darkMode })}
                    className={`mt-4 px-10 py-4 rounded-2xl font-black transition-all ${settings.darkMode ? 'bg-white text-slate-950' : 'bg-slate-900 text-white'}`}
                  >
                    {settings.darkMode ? 'تفعيل الوضع النهاري' : 'تفعيل الوضع الليلي'}
                  </button>
                </div>

                <div className="p-6 bg-slate-50 dark:bg-slate-800/50 rounded-3xl border border-slate-100 dark:border-slate-800">
                   <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">معلومات النسخة</h4>
                   <div className="flex justify-between items-center text-sm">
                      <span className="text-slate-500 font-bold">إصدار التطبيق:</span>
                      <span className="font-black text-amber-500">PRO v4.5.2</span>
                   </div>
                   <div className="flex justify-between items-center text-sm mt-2">
                      <span className="text-slate-500 font-bold">آخر تحديث:</span>
                      <span className="font-black">اليوم - 12:40 م</span>
                   </div>
                </div>
              </div>
           </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 opacity-20 hover:opacity-100 transition-opacity">
        <i className="bi bi-shield-lock-fill"></i>
        <p className="text-[10px] font-black uppercase tracking-[0.5em]">System Secured & Encrypted</p>
      </div>
    </div>
  );
};

export default SettingsManager;
