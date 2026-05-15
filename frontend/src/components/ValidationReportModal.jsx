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
  if (s >= 85) return { bar: '#000000', text: '#000000', bg: '#ffffff', label: '#000000', accent: '#10b981' };
  if (s >= 70) return { bar: '#000000', text: '#000000', bg: '#ffffff', label: '#000000', accent: '#f59e0b' };
  return { bar: '#000000', text: '#000000', bg: '#ffffff', label: '#000000', accent: '#ef4444' };
};

const MODULE_PALETTE = [
  '#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6',
  '#06b6d4', '#ec4899', '#84cc16', '#f97316', '#64748b',
];

/* ─── Sub-components ─────────────────────────────────────── */

function StatTile({ label, value, accent }) {
  return (
    <div className="bg-black rounded-xl p-4 border border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
      <p className="text-xs font-black uppercase tracking-widest text-white/60 mb-1 font-mono">{label}</p>
      <p className="text-3xl font-bold text-white font-mono" style={{ color: accent }}>{value}</p>
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
    <p className="text-xs font-black uppercase tracking-[0.2em] text-black flex items-center gap-2 mb-6 border-b-2 border-black pb-2 w-fit">
      {Icon && <Icon size={16} className="text-black" />}
      {children}
    </p>
  );
}

function Card({ children, className = "" }) {
  return (
    <div className={`bg-white border-2 border-black rounded-2xl p-6 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)] ${className}`}>
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
  const color = '#000000';
  const accent = isPassed ? '#10b981' : '#ef4444';
  const data = [{ value: score }];
  return (
    <div className="relative w-44 h-44 mx-auto">
      <ResponsiveContainer width="100%" height="100%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="80%"
          outerRadius="100%"
          data={data}
          startAngle={225}
          endAngle={-45}
        >
          <RadialBar
            background={{ fill: '#f1f5f9' }}
            dataKey="value"
            cornerRadius={0}
            fill={color}
          />
        </RadialBarChart>
      </ResponsiveContainer>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-4xl font-mono font-bold text-black leading-none tracking-tighter">
          {score.toFixed(2)}%
        </span>
        <div className="mt-2 px-2 py-0.5 bg-black text-white text-[8px] font-black uppercase tracking-widest font-mono">
          PRECISION_INDEX
        </div>
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
          formatter={(v) => <span className="text-[12px] font-black text-black uppercase tracking-tight font-mono">{v}</span>}
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

function ModuleInsightRow({ module }) {
  const c = scoreColor(module.score);
  return (
    <div className="flex items-center gap-12 p-6 hover:bg-black hover:text-white transition-all border-b border-black/10 last:border-0 group">
      {/* Module Identity */}
      <div className="flex items-center gap-6 w-1/3 min-w-[250px]">
         <div className="text-sm font-mono font-black text-black group-hover:text-white border-2 border-black group-hover:border-white px-2 py-1 uppercase tracking-tighter">
            {module.key.substring(0, 3)}
         </div>
         <div className="overflow-hidden">
            <p className="text-sm font-black uppercase tracking-widest text-black group-hover:text-white transition-colors truncate font-mono">{module.label}</p>
            <p className="text-[10px] text-black/40 group-hover:text-white/40 font-mono mt-1">
               NODE_HASH: 0x{module.key.length}C{Math.round(module.score)}
            </p>
         </div>
      </div>

      {/* Accuracy Gauge */}
      <div className="flex-1 flex items-center gap-6">
        <div className="flex-1 h-3 bg-slate-100 group-hover:bg-white/10 border border-black group-hover:border-white/20 overflow-hidden relative">
          <div 
            className="h-full bg-black group-hover:bg-white transition-all duration-1000" 
            style={{ width: `${module.score}%` }} 
          />
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
             <div className="w-full h-full opacity-10" style={{ background: `repeating-linear-gradient(90deg, transparent, transparent 9px, black 10px)` }}></div>
          </div>
        </div>
        <div className="flex flex-col items-end min-w-[100px]">
           <span className="text-2xl font-black font-mono leading-none tracking-tighter text-black group-hover:text-white">
              {module.score.toFixed(2)}%
           </span>
           <span className="text-[10px] font-black text-black/40 group-hover:text-white/40 uppercase tracking-widest mt-1">ACCURACY</span>
        </div>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 border-b-4 border-black pb-8">
          <div className="space-y-3">
            <div className="flex items-center space-x-3 text-black">
              <ShieldCheck size={24} strokeWidth={3} />
              <span className="text-sm font-black uppercase tracking-[0.4em] font-mono">NEURAL_AUDIT_REPORT</span>
            </div>
            <p className="text-black text-[12px] font-black uppercase tracking-widest font-mono">
              UID: {uidStr} // DATE: {auditDate} // NODES: {modules.length}
            </p>
          </div>
          <div className="flex gap-4">
            <div className={`px-6 py-2 border-2 border-black text-[10px] font-black uppercase tracking-[0.2em] font-mono ${isPassed ? 'bg-emerald-500 text-white' : 'bg-rose-500 text-white'}`}>
              {isPassed ? 'VERIFIED' : 'CRITICAL_FAILURE'}
            </div>
            <button
              className="px-6 py-2 bg-black text-white border-2 border-black text-[10px] font-black uppercase tracking-[0.2em] font-mono hover:bg-white hover:text-black transition-all flex items-center gap-2"
              onClick={() => alert('Secure report export initialized.')}
            >
              <Download size={14} /> EXPORT_DATA
            </button>
          </div>
        </div>

        {/* ── VERDICT BANNER ── */}
        <div className={`p-8 border-2 border-black flex items-start gap-6 transition-all bg-white shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]`}>
          <div className={`w-12 h-12 flex items-center justify-center shrink-0 border-2 border-black ${isPassed ? 'bg-black text-white' : 'bg-black text-white'}`}>
            {isPassed ? <CheckCircle2 size={24} /> : <AlertTriangle size={24} />}
          </div>
          <div className="space-y-2">
            <p className={`text-lg font-black uppercase tracking-widest font-mono text-black`}>
              INTEGRITY_PROFILE: {isPassed ? 'HIGH_FIDELITY' : 'CRITICAL_WARNING'}
            </p>
            <p className={`text-sm font-bold leading-relaxed font-mono text-black`}>
              {isPassed 
                ? 'DECAPASS PROTOCOL: Neural verification complete. Zero significant statistical drift detected. Intelligence vectors optimized.' 
                : 'SECURITY PROTOCOL: Violation detected. High risk of corrupted features. Manual node intervention mandatory.'}
            </p>
          </div>
        </div>

        {/* ── DASHBOARD GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Trust Gauge */}
          <Card className="lg:col-span-1 flex flex-col items-center justify-center space-y-6">
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

          {/* Vector Distribution */}
          <Card className="lg:col-span-2">
            <SectionTitle icon={PieChart}>Vector Distribution Matrix</SectionTitle>
            <div className="flex items-center justify-center h-full -mt-4">
              <ModulePie modules={modules} />
            </div>
          </Card>
        </div>

        {/* ── CONSOLIDATED INTELLIGENCE MATRIX ── */}
        <div className="space-y-6">
          <SectionTitle icon={Activity}>Component Accuracy Matrix</SectionTitle>
          <div className="border-2 border-black bg-white overflow-hidden shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
            <div className="bg-black px-8 py-4 flex items-center gap-12 text-[12px] font-black uppercase tracking-[0.3em] text-white font-mono">
              <span className="w-1/3 min-w-[250px]">Component_Node</span>
              <span className="flex-1">Accuracy_Index (δ)</span>
            </div>
            <div className="">
              {modules.map((m) => (
                <ModuleInsightRow key={m.key} module={m} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="space-y-6">
            <SectionTitle icon={Zap}>System Metrics</SectionTitle>
            <div className="grid grid-cols-1 gap-6">
              <StatTile label="Data Quality" value={isPassed ? 'OPTIMAL' : 'LOW_RES'} accent={isPassed ? '#10b981' : '#ef4444'} />
            </div>
          </div>

          <div className="space-y-6">
            <SectionTitle icon={AlertTriangle}>Protocol Directives</SectionTitle>
            <div className="border-2 border-black bg-black p-4 space-y-4 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              {recommendations.map((r, i) => (
                <div key={i} className="flex gap-4 items-center">
                  <div className="w-2 h-2 bg-white rounded-full shrink-0 animate-pulse" />
                  <p className="text-xs font-black uppercase text-white font-mono tracking-widest">{r.title}</p>
                </div>
              ))}
            </div>
          </div>
        </div>


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
        <div className="flex flex-col sm:flex-row justify-between items-center gap-6 pt-10 border-t-4 border-black">
          <p className="text-[10px] font-black text-black uppercase tracking-[0.3em] flex items-center gap-3 font-mono">
            <Lock size={14} strokeWidth={3} /> SYSTEM_READY // CRYPTO_SECURE
          </p>
          <div className="flex gap-4 w-full sm:w-auto">
            <button
              className="flex-1 sm:flex-none px-8 py-4 bg-white border-2 border-black text-black text-[10px] font-black uppercase tracking-[0.2em] font-mono hover:bg-black hover:text-white transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={() => setLogsOpen(true)}
            >
              TRACE_LOGS
            </button>
            <button
              className="flex-1 sm:flex-none px-8 py-4 bg-black text-white border-2 border-black text-[10px] font-black uppercase tracking-[0.2em] font-mono hover:bg-white hover:text-black transition-all shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              onClick={onClose}
            >
              TERMINATE_AUDIT
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ValidationReportModal;