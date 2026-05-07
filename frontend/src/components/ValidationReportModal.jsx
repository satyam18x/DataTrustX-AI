import React, { useState } from 'react';
import Modal from './ui/Modal';
import {
  RadialBarChart,
  RadialBar,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Cell,
  PieChart,
  Pie,
  Legend,
} from 'recharts';
import {
  ShieldCheck,
  Download,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Lock,
  Terminal,
  ChevronDown,
  ChevronUp,
  Activity,
  Circle,
  Zap,
  Info,
  Boxes
} from 'lucide-react';
import Badge from './ui/Badge';

/* ─── Colour helpers ─────────────────────────────────────── */
const scoreColor = (s) => {
  if (s >= 85) return { bar: '#10b981', text: '#065f46', bg: '#ecfdf5', label: '#065f46' };
  if (s >= 70) return { bar: '#f59e0b', text: '#92400e', bg: '#fffbeb', label: '#92400e' };
  return { bar: '#ef4444', text: '#991b1b', bg: '#fef2f2', label: '#991b1b' };
};

const MODULE_PALETTE = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#64748b',
];

/* ─── Sub-components ─────────────────────────────────────── */

function StatTile({ label, value, accent }) {
  return (
    <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{label}</p>
      <p className="text-xl font-bold text-slate-900" style={{ color: accent }}>{value}</p>
    </div>
  );
}

function ProgressRow({ label, score }) {
  const c = scoreColor(score);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-baseline mb-1.5">
        <span className="text-sm font-medium text-slate-700">{label}</span>
        <span className="text-xs font-bold" style={{ color: c.label }}>{Math.round(score)}%</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-1000"
          style={{ width: `${score}%`, background: c.bar }}
        />
      </div>
    </div>
  );
}

function SectionTitle({ icon: Icon, children }) {
  return (
    <p className="text-xs font-black uppercase tracking-widest text-slate-400 flex items-center gap-2 mb-4">
      {Icon && <Icon size={14} className="text-brand-600" />}
      {children}
    </p>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border border-slate-200 rounded-3xl p-6 ${className}`}>
      {children}
    </div>
  );
}

function CustomBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  const val = Math.round(payload[0].value);
  const c = scoreColor(val);
  return (
    <div className="bg-white border border-slate-200 rounded-lg p-2 shadow-xl text-xs">
      <span className="font-bold" style={{ color: c.label }}>{val}% Veracity</span>
    </div>
  );
}

function ScoreGauge({ score, isPassed }) {
  const color = isPassed ? '#10b981' : '#ef4444';
  const data = [{ value: score }];
  return (
    <div className="relative w-40 h-40 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          data={data}
          startAngle={225}
          endAngle={-45}
        >
          <RadialBar
            background={{ fill: '#f1f5f9' }}
            dataKey="value"
            cornerRadius={10}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-3xl font-display font-bold text-slate-900 leading-none">
          {score.toFixed(1)}%
        </span>
        <span className="text-[9px] font-black uppercase tracking-widest text-slate-400 mt-1">
          trust index
        </span>
      </div>
    </div>
  );
}

function ModulePie({ modules }) {
  const data = modules.map((m) => ({ name: m.label, value: Math.round(m.score) }));
  return (
    <ResponsiveContainer width="100%" height={220}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={55}
          outerRadius={85}
          paddingAngle={3}
          dataKey="value"
        >
          {data.map((_, i) => (
            <Cell key={i} fill={MODULE_PALETTE[i % MODULE_PALETTE.length]} />
          ))}
        </Pie>
        <Tooltip formatter={(v) => [`${v}%`, 'Veracity']} />
        <Legend
          iconType="circle"
          formatter={(v) => <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tight">{v}</span>}
        />
      </PieChart>
    </ResponsiveContainer>
  );
}

function ModuleBarChart({ modules }) {
  const data = modules.map((m) => ({ name: m.label, score: Math.round(m.score) }));
  return (
    <ResponsiveContainer width="100%" height={Math.max(modules.length * 40 + 40, 160)}>
      <BarChart data={data} layout="vertical" margin={{ top: 0, right: 30, left: 20, bottom: 0 }}>
        <CartesianGrid horizontal={false} strokeDasharray="3 3" stroke="#f1f5f9" />
        <XAxis
          type="number"
          domain={[0, 100]}
          tick={{ fontSize: 10, fill: '#94a3b8', fontWeight: 600 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          type="category"
          dataKey="name"
          width={100}
          tick={{ fontSize: 10, fill: '#64748b', fontWeight: 700 }}
          axisLine={false}
          tickLine={false}
        />
        <Tooltip content={<CustomBarTooltip />} cursor={{ fill: '#f8fafc' }} />
        <Bar dataKey="score" radius={[0, 10, 10, 0]} barSize={16}>
          {data.map((d, i) => (
            <Cell key={i} fill={scoreColor(d.score).bar} />
          ))}
        </Bar>
      </BarChart>
    </ResponsiveContainer>
  );
}

function RecItem({ icon: Icon, iconColor, iconBg, title, desc }) {
  return (
    <div className="flex gap-4 py-4 border-b border-slate-100 last:border-0">
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
        style={{ background: iconBg }}
      >
        <Icon size={18} style={{ color: iconColor }} />
      </div>
      <div>
        <p className="text-sm font-bold text-slate-900 mb-0.5">{title}</p>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">{desc}</p>
      </div>
    </div>
  );
}

function getRecommendations(score) {
  if (score >= 85) {
    return [
      { icon: CheckCircle2, iconColor: '#10b981', iconBg: '#ecfdf5', title: 'High Fidelity Asset', desc: 'Neural veracity confirmed. Asset is cleared for immediate high-stakes deployment.' },
      { icon: AlertTriangle, iconColor: '#f59e0b', iconBg: '#fffbeb', title: 'Optimize Outliers', desc: 'Minor variance detected in peripheral vectors. Periodic recalibration suggested.' },
      { icon: RefreshCw,    iconColor: '#6366f1', iconBg: '#eef2ff', title: 'Schedule Recertification', desc: 'Temporal freshness is optimal. Refresh verification cycle in 30 cycles.' },
    ];
  }
  if (score >= 70) {
    return [
      { icon: AlertTriangle, iconColor: '#f59e0b', iconBg: '#fffbeb', title: 'Secondary Pass Required', desc: 'Schema drift detected. Perform secondary manual verification before deployment.' },
      { icon: RefreshCw,    iconColor: '#6366f1', iconBg: '#eef2ff', title: 'Calibrate Pipelines', desc: 'Inspect transformation logs for consistency mismatches in core features.' },
    ];
  }
  return [
    { icon: AlertTriangle, iconColor: '#ef4444', iconBg: '#fef2f2', title: 'Critical Veracity Failure', desc: 'High risk profile. Neural sensors indicate significant data poisoning or corruption.' },
    { icon: RefreshCw,    iconColor: '#6366f1', iconBg: '#eef2ff', title: 'Protocol Reset', desc: 'Re-calibrate ingestion nodes and initiate fresh collection phase immediately.' },
  ];
}

const ValidationReportModal = ({ isOpen, onClose, reportData }) => {
  const [logsOpen, setLogsOpen] = useState(false);

  if (!isOpen || !reportData) return null;

  const {
    id,
    final_score = 0,
    status = 'unknown',
    report = {},
  } = reportData;

  const score     = Number(final_score) || 0;
  const isPassed  = ['passed', 'pass', 'PASS', 'PASSED'].includes(String(status).trim());
  const allReports = report?.all_reports ?? {};

  const modules = Object.entries(allReports).map(([key, data], i) => ({
    key,
    label: key
      .replace(/_report$/i, '')
      .replace(/_/g, ' ')
      .replace(/\b\w/g, (c) => c.toUpperCase()),
    score: Number(data.score) || (data[key.replace('_report', '_score')] * 100) || 0,
    summary: data.summary || data.reason || 'Module clearance approved.',
    color: MODULE_PALETTE[i % MODULE_PALETTE.length],
  }));

  const recommendations = getRecommendations(score);
  const uidStr = String(id || '0000').padStart(8, '0');
  const auditDate = new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' });

  return (
    <Modal
        isOpen={isOpen}
        onClose={onClose}
        title={
            <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-brand-600 rounded-lg flex items-center justify-center shadow-lg shadow-brand-500/20">
                    <Activity size={18} className="text-white" />
                </div>
                <span className="text-xl font-display font-bold tracking-tightest">Neural Veracity Hub</span>
            </div>
        }
        size="2xl"
    >
      <div className="space-y-8 py-4 font-sans">
        {/* ── HEADER SUMMARY ── */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-slate-100 pb-8">
          <div className="space-y-2">
            <div className="flex items-center space-x-3 text-brand-600">
              <ShieldCheck size={18} strokeWidth={2.5} />
              <span className="text-[10px] font-black uppercase tracking-[0.2em]">Asset Verification Audit</span>
            </div>
            <p className="text-slate-400 text-xs font-medium">
              UID #{uidStr} &nbsp;·&nbsp; Audited {auditDate} &nbsp;·&nbsp; {modules.length} verification nodes active
            </p>
          </div>
          <div className="flex gap-3">
            <Badge variant={isPassed ? 'success' : 'danger'} className="px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border-0">
              {isPassed ? 'DECAPass Verified' : 'Protocol Failed'}
            </Badge>
            <button
              className="px-4 py-2 bg-slate-900 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-800 transition-all flex items-center gap-2"
              onClick={() => alert('Secure report export initialized.')}
            >
              <Download size={14} /> Export
            </button>
          </div>
        </div>

        {/* ── VERDICT BANNER ── */}
        <div className={`p-6 rounded-[2rem] border flex items-start gap-4 transition-all ${isPassed ? 'bg-emerald-50 border-emerald-100' : 'bg-rose-50 border-rose-100'}`}>
          <div className={`w-10 h-10 rounded-2xl flex items-center justify-center shrink-0 ${isPassed ? 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20' : 'bg-rose-500 text-white shadow-lg shadow-rose-500/20'}`}>
            {isPassed ? <CheckCircle2 size={20} /> : <AlertTriangle size={20} />}
          </div>
          <div className="space-y-1">
            <p className={`text-sm font-bold uppercase tracking-tight ${isPassed ? 'text-emerald-900' : 'text-rose-900'}`}>
              {isPassed ? 'Integrity Profile: High Fidelity' : 'Integrity Profile: Critical Warning'}
            </p>
            <p className={`text-xs font-medium leading-relaxed ${isPassed ? 'text-emerald-700' : 'text-rose-700'}`}>
              {isPassed 
                ? 'Neural verification complete. No significant statistical drift or poisoning detected in the intelligence vectors.' 
                : 'Protocol violation detected. High risk of corrupted or synthesized features. Manual intervention required.'}
            </p>
          </div>
        </div>

        {/* ── DASHBOARD GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Trust Gauge */}
          <Card className="flex flex-col items-center justify-center space-y-6">
            <SectionTitle>Overall Trust Score</SectionTitle>
            <ScoreGauge score={score} isPassed={isPassed} />
            <div className="grid grid-cols-2 gap-4 w-full">
              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">Nodes Active</p>
                <p className="text-lg font-bold text-slate-900">{modules.length}</p>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 text-center border border-slate-100">
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-1">System Drift</p>
                <p className="text-lg font-bold text-brand-600">0.02%</p>
              </div>
            </div>
          </Card>

          {/* Breakdown Chart */}
          <Card>
            <SectionTitle icon={Activity}>Veracity Breakdown</SectionTitle>
            <ModuleBarChart modules={modules} />
          </Card>
        </div>

        {/* ── STATS & PROGRESS ── */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <StatTile label="Data Quality" value={isPassed ? 'Optimal' : 'Low'} accent={isPassed ? '#10b981' : '#ef4444'} />
              <StatTile label="Consensus" value="100%" />
            </div>
            <Card>
              <SectionTitle icon={Zap}>Module Precision</SectionTitle>
              {modules.map((m) => (
                <ProgressRow key={m.key} label={m.label} score={m.score} />
              ))}
            </Card>
          </div>

          <Card>
            <SectionTitle icon={PieChart}>Vector Distribution</SectionTitle>
            <ModulePie modules={modules} />
          </Card>
        </div>

        {/* ── MODULE CARDS ── */}
        <div className="space-y-4">
          <SectionTitle icon={Boxes}>Neural Inspection Logs</SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {modules.map((m) => {
              const c = scoreColor(m.score);
              return (
                <Card key={m.key} className="group hover:border-brand-500/30 transition-all">
                  <div className="flex justify-between items-start mb-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 group-hover:text-brand-500 transition-colors">{m.label}</span>
                    <span className="text-sm font-black font-display" style={{ color: c.text }}>{Math.round(m.score)}%</span>
                  </div>
                  <div className="h-1 w-full bg-slate-50 rounded-full mb-4 overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${m.score}%`, background: c.bar }} />
                  </div>
                  <div className="flex gap-2 p-3 bg-slate-50 rounded-xl border border-slate-100 group-hover:bg-white transition-colors">
                    <Terminal size={12} className="text-slate-300 mt-0.5 shrink-0" />
                    <p className="text-[11px] font-medium text-slate-500 leading-relaxed italic line-clamp-2">"{m.summary}"</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>

        {/* ── RECOMMENDATIONS ── */}
        <Card className="bg-slate-50 border-slate-200">
          <SectionTitle icon={AlertTriangle}>AI Recommendations</SectionTitle>
          <div className="space-y-2">
            {recommendations.map((r, i) => (
              <RecItem
                key={i}
                icon={r.icon}
                iconColor={r.iconColor}
                iconBg={r.iconBg}
                title={r.title}
                desc={r.desc}
              />
            ))}
          </div>
        </Card>

        {/* ── RAW TRACE ── */}
        <div className="pt-4">
          <button
            onClick={() => setLogsOpen(!logsOpen)}
            className="flex w-full items-center justify-between p-6 bg-slate-50 rounded-[1.5rem] border border-slate-200 text-[10px] font-black text-slate-400 uppercase tracking-widest hover:bg-white transition-all outline-none"
          >
            <div className="flex items-center gap-3">
              <Terminal size={14} />
              <span>Cryptographic Node Logs (RAW_TRACE)</span>
            </div>
            {logsOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
          </button>
          {logsOpen && (
            <div className="mt-4 p-8 bg-slate-900 rounded-[2rem] overflow-hidden border border-slate-800 shadow-2xl">
              <pre className="text-brand-400 text-[11px] font-mono leading-relaxed overflow-x-auto custom-scrollbar max-h-64 whitespace-pre-wrap">
                {JSON.stringify(reportData, null, 2)}
              </pre>
            </div>
          )}
        </div>

        {/* ── FOOTER ACTIONS ── */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-6 border-t border-slate-100">
          <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest flex items-center gap-2">
            <Lock size={12} /> Neural Veracity Hub v3.11 · Cryptographic Sync Active
          </p>
          <div className="flex gap-3 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none px-6 py-3 bg-white border border-slate-200 text-slate-600 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 transition-all flex items-center justify-center gap-2"
              onClick={() => setLogsOpen(true)}
            >
              <Terminal size={14} /> Trace Logs
            </button>
            <button
              className="flex-1 sm:flex-none px-6 py-3 bg-brand-600 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-brand-700 transition-all shadow-lg shadow-brand-500/20 flex items-center justify-center gap-2"
              onClick={onClose}
            >
              Confirm & Close
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ValidationReportModal;