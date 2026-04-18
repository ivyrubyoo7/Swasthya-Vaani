import { Calendar, Activity, Clock } from 'lucide-react';
import StatCard from '../components/StatCard';

const APPOINTMENTS = [
  { name: 'Priya Mehta',   time: '09:00 AM · Follow-up',    status: 'Done',     color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { name: 'Rajan Verma',   time: '10:30 AM · General',       status: 'Done',     color: 'bg-emerald-50 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400' },
  { name: 'Anika Joshi',   time: '12:00 PM · Consultation',  status: 'Next',     color: 'bg-amber-50 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'         },
  { name: 'Suresh Nair',   time: '02:30 PM · Review',        status: 'Upcoming', color: 'bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'             },
];

const ACTIVITY = [
  { title: 'EHR Updated',        sub: 'Priya Mehta · 9:42 AM'   },
  { title: 'Recording Saved',    sub: 'Rajan Verma · 10:58 AM'  },
  { title: 'Report Generated',   sub: 'Mohan Iyer · Yesterday'  },
  { title: 'Note Transcribed',   sub: 'Anika Joshi · Yesterday' },
];

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-IN', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  return (
    <div className="animate-fade-in">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-display text-[22px] font-600 text-slate-900 dark:text-white">
          Good morning, Dr. Sharma 👋
        </h1>
        <p className="text-sm text-slate-400 dark:text-slate-500 mt-1">{today} · Here's your day at a glance</p>
      </div>

      {/* Welcome hero */}
      <div className="rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 p-6 mb-6 flex items-center justify-between">
        <div>
          <h2 className="font-display text-white text-lg font-600 mb-1">Ready to record today's consultations?</h2>
          <p className="text-brand-100 text-sm">Swasthya Vaani captures, transcribes, and structures your clinical notes.</p>
        </div>
        <span className="shrink-0 text-xs border border-white/30 bg-white/15 text-white rounded-full px-4 py-1.5 font-medium">
          AI-Powered
        </span>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-3 mb-6">
        <StatCard label="Patients Today"        value="14" note="3 pending"          accent="blue"  />
        <StatCard label="Consultations Done"     value="8"  note="↑ 2 from yesterday" accent="green" />
        <StatCard label="Pending Reports"        value="5"  note="Due today"          accent="amber" />
        <StatCard label="Recordings Transcribed" value="11" note="All processed"       accent="teal"  />
      </div>

      {/* Cards row */}
      <div className="grid grid-cols-2 gap-4">
        {/* Appointments */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Calendar size={15} className="text-brand-600 dark:text-brand-400" strokeWidth={2} />
            <h3 className="font-medium text-[13px] text-slate-700 dark:text-slate-200">Today's Appointments</h3>
          </div>
          <div className="flex flex-col gap-0">
            {APPOINTMENTS.map((a, i) => (
              <div key={i} className="flex items-center justify-between py-2.5 border-b border-slate-50 dark:border-slate-700 last:border-0">
                <div>
                  <p className="text-[13px] font-medium text-slate-800 dark:text-slate-100">{a.name}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{a.time}</p>
                </div>
                <span className={`text-[10px] font-600 px-2.5 py-1 rounded-full ${a.color}`}>{a.status}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Activity */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-100 dark:border-slate-700 p-5 shadow-card">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={15} className="text-brand-600 dark:text-brand-400" strokeWidth={2} />
            <h3 className="font-medium text-[13px] text-slate-700 dark:text-slate-200">Recent Activity</h3>
          </div>
          <div className="flex flex-col gap-0">
            {ACTIVITY.map((a, i) => (
              <div key={i} className="flex items-center gap-3 py-2.5 border-b border-slate-50 dark:border-slate-700 last:border-0">
                <div className="w-1.5 h-1.5 rounded-full bg-brand-400 shrink-0" />
                <div>
                  <p className="text-[13px] font-medium text-slate-800 dark:text-slate-100">{a.title}</p>
                  <p className="text-[11px] text-slate-400 dark:text-slate-500">{a.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
