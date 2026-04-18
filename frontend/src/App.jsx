import { useState } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Record from './pages/Record';
import EHR from './pages/EHR';
import Report from './pages/Report';

const PAGES = {
  dashboard: <Dashboard />,
  record:    <Record    />,
  ehr:       <EHR       />,
  report:    <Report    />,
};

function AppInner() {
  const [page, setPage] = useState('dashboard');

  return (
    <div className="flex h-screen overflow-hidden bg-slate-50 dark:bg-slate-900">
      <Sidebar active={page} onNavigate={setPage} />
      <main className="flex-1 overflow-y-auto px-8 py-8">
        <div key={page}>{PAGES[page]}</div>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppInner />
    </ThemeProvider>
  );
}
