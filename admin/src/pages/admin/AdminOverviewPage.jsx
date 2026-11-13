import React from 'react';
import GlassCard from '../../components/ui/GlassCard';
import Badge from '../../components/ui/Badge';
import Button from '../../components/ui/Button';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
  MessageSquare,
  Users,
  CheckCircle,
  Clock,
  ArrowUpRight,
  TrendingUp,
  BarChart3,
  FileCheck2,
  CalendarCheck,
  AlertTriangle,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';
import {
  adminKpis,
  funnelStages,
  gradeDistribution,
  weeklyTrends,
  urgentTasks,
} from '../../features/admin/mockData';

const iconMap = {
  GraduationCap,
  Clock,
  CheckCircle,
  MessageSquare,
};

export const AdminOverviewPage = () => {
  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-display text-slate-900">
            Admissions Operations Dashboard
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Siddhant High School Super Admin OS &bull; Academic Intake Session 2026-2027
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link to="/admin/admissions">
            <Button variant="primary" size="sm">
              Review Candidate Queue &rarr;
            </Button>
          </Link>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {adminKpis.map((kpi, idx) => {
          const Icon = iconMap[kpi.iconName] || GraduationCap;
          return (
            <GlassCard key={kpi.id || idx} className="p-5 border-slate-200">
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-500">{kpi.label}</span>
                <div className={`w-8 h-8 rounded-lg ${kpi.bg} ${kpi.color} flex items-center justify-center`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div className="flex items-baseline justify-between">
                <span className="text-2xl font-bold font-mono text-slate-900">{kpi.value}</span>
                <span
                  className={`text-[11px] font-semibold ${
                    kpi.trend === 'positive'
                      ? 'text-emerald-600'
                      : kpi.trend === 'attention'
                      ? 'text-amber-600'
                      : 'text-purple-600'
                  }`}
                >
                  {kpi.change}
                </span>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* 2-Column Bento Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Application Stage Funnel (7-cols) */}
        <div className="lg:col-span-7 bg-white rounded-card border border-slate-200 p-6 shadow-subtle space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <FileCheck2 className="w-4 h-4 text-brand-interactive" />
                Admissions Conversion Funnel
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Current applicant trajectory across 5 evaluation gateposts
              </p>
            </div>
            <Badge variant="approved" size="sm">
              Cycle Active
            </Badge>
          </div>

          <div className="space-y-3.5 pt-2">
            {funnelStages.map((stage, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{stage.stage}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-slate-900">{stage.count}</span>
                    <span className="text-slate-400 text-[11px]">({stage.pct}%)</span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${stage.color} transition-all duration-700`}
                    style={{ width: `${stage.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Overall Session Conversion Rate</span>
            <span className="font-mono font-bold text-emerald-600">33.2% Target Exceeded</span>
          </div>
        </div>

        {/* Weekly Influx Sparkline & Grade Breakdown (5-cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Weekly Traffic Influx */}
          <div className="bg-white rounded-card border border-slate-200 p-6 shadow-subtle space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                7-Day Inbound Velocity
              </h3>
              <span className="text-xs font-mono font-bold text-brand-primary">146 this week</span>
            </div>

            {/* Sparkline Visual Columns */}
            <div className="h-32 flex items-end justify-between gap-2 pt-4 px-2 bg-slate-50 rounded-card border border-slate-100">
              {weeklyTrends.map((col, idx) => (
                <div key={idx} className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end group">
                  <span className="text-[10px] font-mono font-bold text-slate-600 opacity-0 group-hover:opacity-100 transition-opacity">
                    {col.count}
                  </span>
                  <div
                    className="w-full bg-blue-500 group-hover:bg-blue-600 rounded-t-[4px] transition-all"
                    style={{ height: col.height }}
                  />
                  <span className="text-[10px] font-medium text-slate-400 group-hover:text-slate-800">
                    {col.day}
                  </span>
                </div>
              ))}
            </div>
            <p className="text-[11px] text-slate-500">
              Peak application submissions occur on Friday evenings &amp; Saturdays following Open House webinars.
            </p>
          </div>
        </div>
      </div>

      {/* Grade-wise Capacity & Urgent Triage Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Grade-wise Capacity Utilization */}
        <div className="lg:col-span-6 bg-white rounded-card border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-brand-interactive" />
              Stream &amp; Grade Capacity Utilization
            </h3>
            <span className="text-xs text-slate-400 font-medium">Session 2026-27</span>
          </div>

          <div className="space-y-3 pt-1">
            {gradeDistribution.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-medium text-slate-700">{item.grade}</span>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-900 font-bold">{item.count} / {item.max}</span>
                    <span className={`text-[11px] font-semibold ${item.pct >= 90 ? 'text-rose-600' : 'text-slate-500'}`}>
                      {item.pct}% {item.pct >= 90 && '• Filling Fast'}
                    </span>
                  </div>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-full rounded-full ${
                      item.pct >= 95 ? 'bg-rose-500' : item.pct >= 85 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${item.pct}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Priority Action Desk */}
        <div className="lg:col-span-6 bg-white rounded-card border border-slate-200 p-6 shadow-subtle space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-600" />
              Action Required &amp; Operational Desk
            </h3>
            <Badge variant="pending" size="sm">
              {urgentTasks.length} Directives
            </Badge>
          </div>

          <div className="space-y-2.5">
            {urgentTasks.map((task) => (
              <div
                key={task.id}
                className="p-3.5 rounded-card border border-slate-200 hover:border-slate-300 bg-slate-50/70 hover:bg-slate-50 transition-all flex items-center justify-between gap-3"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">{task.title}</h4>
                  <p className="text-[11px] text-amber-700 font-medium mt-0.5">
                    Target: {task.deadline}
                  </p>
                </div>

                <Link
                  to={task.link}
                  className="px-3 py-1.5 rounded-[8px] bg-white border border-slate-300 hover:border-brand-primary text-slate-700 hover:text-brand-primary text-xs font-semibold shrink-0 flex items-center gap-1 transition-colors"
                >
                  <span>Resolve</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            ))}
          </div>

          <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
            <span>Siddhant High School Admin Session ID: SHS-SEC-9921</span>
            <span className="font-semibold text-emerald-600">System Healthy</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminOverviewPage;
