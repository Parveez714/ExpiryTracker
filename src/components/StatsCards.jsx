import React from 'react';
import { ShieldAlert, CheckCircle2, Clock, CalendarDays, RefreshCw } from 'lucide-react';

export function StatsCards({ records, selectedEmail }) {
  const activeCount = records.filter(r => r.Status?.toLowerCase() === 'active').length;
  const pendingCount = records.filter(r => r.Status?.toLowerCase() === 'pending renewal' || r.Status?.toLowerCase() === 'pending').length;
  const expiredCount = records.filter(r => r.Status?.toLowerCase() === 'expired').length;
  const recurringCount = records.filter(r => r.IsRecurring === 'Yes').length;

  const todayStr = new Date().toISOString().split('T')[0];

  const stats = [
    {
      title: 'Active Documents',
      value: activeCount,
      sublabel: `${records.length > 0 ? ((activeCount / records.length) * 100).toFixed(1) : 0}% active`,
      icon: CheckCircle2,
      textColor: 'text-[#00875A]',
      borderColor: 'border-[#00875A]/25',
      iconBg: 'bg-[#00875A]/10 text-[#00875A]',
    },
    {
      title: 'Pending Renewal',
      value: pendingCount,
      sublabel: 'Action required',
      icon: Clock,
      textColor: 'text-[#0066CC]',
      borderColor: 'border-[#0066CC]/25',
      iconBg: 'bg-[#0066CC]/10 text-[#0066CC]',
    },
    {
      title: 'Expired Documents',
      value: expiredCount,
      sublabel: 'Critical attention',
      icon: ShieldAlert,
      textColor: 'text-[#DE350B]',
      borderColor: 'border-[#DE350B]/25',
      iconBg: 'bg-[#DE350B]/10 text-[#DE350B]',
    },
    {
      title: 'Total Tracked',
      value: records.length,
      sublabel: `${recurringCount} recurring`,
      icon: CalendarDays,
      textColor: 'text-[#00875A]',
      borderColor: 'border-[#00875A]/25',
      iconBg: 'bg-[#00875A]/10 text-[#00875A]',
    },
  ];

  return (
    <div className="mb-6 relative z-10">
      {/* Top Header info matching UI.png */}
      <div className="text-center mb-4">
        <h2 className="text-base sm:text-lg font-bold text-[#1C1914] dark:text-white font-display">
          Compliance & Expiry Tracker
        </h2>
        <p className="text-[11px] text-[#6B6459] dark:text-[#909093] mt-0.5">
          as of {todayStr}
        </p>
      </div>

      {/* 4 Clean Metric Cards matching UI.png */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <div
              key={idx}
              className={`p-4 rounded-2xl border ${stat.borderColor} bg-white dark:bg-[#232325] dark:border-[#3A3A3C] shadow-sm flex flex-col justify-between transition-all duration-200 hover:shadow-md`}
            >
              <div className="flex items-start justify-between gap-2">
                <span className="text-[11px] font-medium text-[#6B6459] dark:text-[#D6D6D8]">{stat.title}</span>
                <div className={`p-1.5 rounded-lg ${stat.iconBg}`}>
                  <Icon className="w-4 h-4 stroke-[2.2]" />
                </div>
              </div>

              <div className="mt-2 text-center">
                <div className={`text-2xl sm:text-3xl font-bold font-display ${stat.textColor}`}>
                  {stat.value}
                </div>
                {stat.sublabel && (
                  <div className="text-[10px] text-[#96908A] dark:text-[#909093] mt-1">
                    {stat.sublabel}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}






