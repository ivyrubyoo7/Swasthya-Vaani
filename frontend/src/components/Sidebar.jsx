import {
  LayoutDashboard, Mic, FileText, BarChart2,
  Sun, Moon, LogOut, Activity
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard',  Icon: LayoutDashboard },
  { id: 'record',    label: 'Record',     Icon: Mic             },
  { id: 'ehr',       label: 'EHR Data',   Icon: FileText        },
  { id: 'report',    label: 'Report',     Icon: BarChart2       },
];

export default function Sidebar({ active, onNavigate }) {
  const { dark, toggleTheme } = useTheme();

  return (
    <aside className="
      w-56 shrink-0 flex flex-col h-screen
      bg-white dark:bg-slate-900
      border-r border-slate-100 dark:border-slate-800
    ">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center shrink-0">
            <Activity size={16} className="text-white" strokeWidth={2.2} />
          </div>
          <div>
            <p className="font-display text-[14px] font-600 text-slate-900 dark:text-white leading-tight">
              Swasthya Vaani
            </p>
            <p className="text-[11px] text-slate-400 dark:text-slate-500">Doctor Dashboard</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 flex flex-col gap-0.5">
        {NAV_ITEMS.map(({ id, label, Icon }) => (
          <button
            key={id}
            onClick={() => onNavigate(id)}
            className={`
              w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium transition-all
              ${active === id
                ? 'bg-brand-50 dark:bg-brand-900/40 text-brand-600 dark:text-brand-400'
                : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200'
              }
            `}
          >
            <Icon size={17} strokeWidth={active === id ? 2.2 : 1.8} />
            {label}
          </button>
        ))}
      </nav>

      {/* Bottom actions */}
      <div className="px-3 pb-5 flex flex-col gap-0.5 border-t border-slate-100 dark:border-slate-800 pt-3">
        <button
          onClick={toggleTheme}
          className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-700 dark:hover:text-slate-200 transition-all"
        >
          {dark ? <Sun size={17} strokeWidth={1.8} /> : <Moon size={17} strokeWidth={1.8} />}
          {dark ? 'Light Mode' : 'Dark Mode'}
        </button>
        <button className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-xl text-[13.5px] font-medium text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-all">
          <LogOut size={17} strokeWidth={1.8} />
          Logout
        </button>
      </div>
    </aside>
  );
}
