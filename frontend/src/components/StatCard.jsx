export default function StatCard({ label, value, note, accent = 'blue' }) {
  const accents = {
    blue:  'text-brand-600 dark:text-brand-400',
    green: 'text-mint-400 dark:text-mint-400',
    amber: 'text-amber-500 dark:text-amber-400',
    teal:  'text-teal-600 dark:text-teal-400',
    red:   'text-red-500 dark:text-red-400',
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-4 shadow-card">
      <p className="text-xs text-slate-400 dark:text-slate-500 mb-1.5 font-medium">{label}</p>
      <p className={`text-2xl font-display font-600 ${accents[accent]}`}>{value}</p>
      {note && <p className="text-[11px] text-slate-400 dark:text-slate-500 mt-1">{note}</p>}
    </div>
  );
}
