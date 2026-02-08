import { useState, useEffect, useMemo } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── Anomaly Detector ─────────────────────────────────────────────────
export function AnomalyDetector({ title = 'Anomaly Detection', threshold = 70, confidence }: { title?: string; threshold?: number; confidence: number }) {
  const X = getX();
  const tick = useTick(2000);

  const data = useMemo(() => Array.from({ length: 30 }, (_, i) => {
    const base = 40 + Math.sin(i * 0.4) * 20;
    const isAnomaly = i === 8 || i === 19 || i === 25;
    return { v: isAnomaly ? base + 35 + Math.random() * 15 : base + (Math.random() - 0.5) * 10, anomaly: isAnomaly };
  }), []);

  const anomalyCount = data.filter(d => d.anomaly).length;
  const mn = Math.min(...data.map(d => d.v));
  const mx = Math.max(...data.map(d => d.v));
  const pts = data.map((d, i) => `${(i / 29) * 100},${100 - ((d.v - mn) / (mx - mn || 1)) * 80}`).join(' ');

  return (
    <Card glow={X.red} style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red}><Dot c={X.red} pulse s={4} />{anomalyCount} found</Badge>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 60, overflow: 'hidden', marginBottom: 8 }}>
        <defs>
          <linearGradient id="anom-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={X.purple} stopOpacity=".15" />
            <stop offset="100%" stopColor={X.purple} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${pts} 100,100`} fill="url(#anom-g)" />
        <polyline points={pts} fill="none" stroke={X.purple} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {data.map((d, i) => d.anomaly ? (
          <circle key={i} cx={(i / 29) * 100} cy={100 - ((d.v - mn) / (mx - mn || 1)) * 80} r="3" fill={X.red} stroke={X.bg} strokeWidth="1" vectorEffect="non-scaling-stroke">
            <animate attributeName="r" values="3;4.5;3" dur="1.5s" repeatCount="indefinite" />
          </circle>
        ) : null)}
        <line x1="0" y1={100 - ((mn + (mx - mn) * (threshold / 100) - mn) / (mx - mn || 1)) * 80} x2="100" y2={100 - ((mn + (mx - mn) * (threshold / 100) - mn) / (mx - mn || 1)) * 80} stroke={X.amber} strokeWidth=".5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" opacity=".6" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl style={{ marginBottom: 2 }}>Confidence</Lbl>
          <M style={{ fontSize: 14, fontWeight: 800, color: X.teal }}>{confidence.toFixed(1)}%</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl style={{ marginBottom: 2 }}>Threshold</Lbl>
          <M style={{ fontSize: 10, fontWeight: 600, color: X.amber }}>{threshold}%</M>
        </div>
      </div>
    </Card>
  );
}

// ── Predictive Maintenance ───────────────────────────────────────────
export function PredictiveMaintenance({ title = 'Predictive Maintenance', criticalThreshold = 30 }: { title?: string; criticalThreshold?: number }) {
  const X = getX();
  const [components] = useState([
    { name: 'Motor', life: 82, date: '2026-04-12', color: X.teal },
    { name: 'Belt', life: 45, date: '2026-03-01', color: X.amber },
    { name: 'Bearing', life: 23, date: '2026-02-18', color: X.red },
    { name: 'Filter', life: 67, date: '2026-03-22', color: X.amber },
  ]);

  return (
    <Card glow={X.amber} style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red}>{components.filter(c => c.life < criticalThreshold).length} critical</Badge>
      </div>
      {components.map((c, i) => {
        const barColor = c.life > 60 ? X.teal : c.life > 35 ? X.amber : X.red;
        return (
          <div key={i} style={{ marginBottom: i < components.length - 1 ? 10 : 0, animation: `sr 180ms ${ease.o} ${i * 30}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Dot c={barColor} s={5} />
                <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{c.name}</M>
              </div>
              <M style={{ fontSize: 9, fontWeight: 700, color: barColor }}>{c.life}%</M>
            </div>
            <Prog value={c.life} color={barColor} h={3} style={{ marginBottom: 2 }} />
            <M style={{ fontSize: 8, color: X.textMut }}>Est. failure: {c.date}</M>
          </div>
        );
      })}
    </Card>
  );
}

// ── AI Insights ──────────────────────────────────────────────────────
export function AIInsights({ title = 'AI Insights', maxVisible = 5 }: { title?: string; maxVisible?: number }) {
  const X = getX();
  const init = [
    { id: 0, sev: 'critical' as const, title: 'Motor overheating pattern', desc: 'Temperature rising 2.3% daily. Predicted failure within 14 days.', time: '2m ago', icon: '\u26A0' },
    { id: 1, sev: 'warning' as const, title: 'Unusual network latency', desc: 'Latency spike correlates with building HVAC schedule.', time: '18m ago', icon: '\u26A1' },
    { id: 2, sev: 'info' as const, title: 'Energy optimization', desc: 'Switching to eco mode during 11pm-6am saves 23% power.', time: '1h ago', icon: '\uD83D\uDCA1' },
    { id: 3, sev: 'warning' as const, title: 'Belt wear detected', desc: 'Vibration signature matches early-stage belt degradation.', time: '3h ago', icon: '\uD83D\uDD27' },
    { id: 4, sev: 'info' as const, title: 'Usage trend shift', desc: 'Peak usage moved from 2pm to 10am over last 30 days.', time: '5h ago', icon: '\uD83D\uDCC8' },
  ];

  const [insights, setInsights] = useState(init);
  const dismiss = (id: number) => setInsights(prev => prev.filter(ins => ins.id !== id));

  const sevColors: Record<string, string> = { critical: X.red, warning: X.amber, info: X.purple };

  return (
    <Card noPad style={{ width: 370 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
          <svg width="12" height="12" viewBox="0 0 16 16" style={{ display: 'block' }}><path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" fill={X.purple} opacity=".7" /></svg>
        </div>
        <Badge color={X.purple}>{insights.length} active</Badge>
      </div>
      <div style={{ padding: '0 6px 8px', maxHeight: maxVisible * 48, overflowY: 'auto' }}>
        {insights.map((ins, i) => {
          const c = sevColors[ins.sev] || X.purple;
          return (
            <div key={ins.id} style={{ display: 'flex', gap: 8, padding: '7px 6px', borderRadius: X.rs, borderLeft: `2px solid ${c}`, marginBottom: 3, background: c + '08', animation: `sr 180ms ${ease.o} ${i * 30}ms both` }}>
              <div style={{ width: 22, height: 22, borderRadius: 6, background: c + '15', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 11, flexShrink: 0 }}>{ins.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 4 }}>
                  <M style={{ fontSize: 10, fontWeight: 600, color: X.text, display: 'block', marginBottom: 1 }}>{ins.title}</M>
                  <Badge color={c} style={{ flexShrink: 0 }}>{ins.sev}</Badge>
                </div>
                <M style={{ fontSize: 8, color: X.textSec, display: 'block', lineHeight: 1.4, marginBottom: 2 }}>{ins.desc}</M>
                <M style={{ fontSize: 7, color: X.textMut }}>{ins.time}</M>
              </div>
              <button onClick={() => dismiss(ins.id)} style={{ width: 16, height: 16, borderRadius: '50%', border: 'none', background: X.bgAlt, color: X.textMut, fontSize: 9, cursor: 'pointer', flexShrink: 0, alignSelf: 'flex-start', lineHeight: 1 }}>{'\u2715'}</button>
            </div>
          );
        })}
        {insights.length === 0 && (
          <div style={{ textAlign: 'center', padding: 16 }}>
            <M style={{ fontSize: 10, color: X.textMut }}>All insights dismissed</M>
          </div>
        )}
      </div>
    </Card>
  );
}

// ── Sentiment Gauge ──────────────────────────────────────────────────
export function SentimentGauge({ title = 'Satisfaction', layout = 'gauge', score }: { title?: string; layout?: 'gauge' | 'compact'; score: number }) {
  const X = getX();
  const animScore = useAnim(78);
  const [trend] = useState<'up' | 'down'>('up');

  const getEmoji = (s: number) => {
    if (s >= 80) return '\uD83D\uDE04';
    if (s >= 60) return '\uD83D\uDE42';
    if (s >= 40) return '\uD83D\uDE10';
    if (s >= 20) return '\uD83D\uDE1F';
    return '\uD83D\uDE1E';
  };

  const getColor = (s: number) => {
    if (s >= 70) return X.teal;
    if (s >= 40) return X.amber;
    return X.red;
  };

  const c = getColor(score);
  const size = 120;
  const r = 45;
  const circ = 2 * Math.PI * r;
  const arc = 240;
  const pct = Math.min(score / 100, 1);
  const offset = circ - (pct * arc / 360) * circ;

  return (
    <Card glow={c} style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 4, textAlign: 'center' }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 4 }}>
        <div style={{ width: size, height: size * 0.75, position: 'relative', overflow: 'hidden' }}>
          <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ display: 'block', marginTop: -size * 0.1 }}>
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={X.borderLight} strokeWidth={6} strokeDasharray={`${circ * arc / 360} ${circ * (1 - arc / 360)}`} strokeLinecap="round" transform={`rotate(150 ${size / 2} ${size / 2})`} />
            <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={c} strokeWidth={6} strokeDasharray={`${circ * arc / 360} ${circ * (1 - arc / 360)}`} strokeDashoffset={offset} strokeLinecap="round" transform={`rotate(150 ${size / 2} ${size / 2})`} style={{ transition: `stroke-dashoffset 800ms ${ease.mv}, stroke 400ms`, filter: `drop-shadow(0 0 4px ${c}40)` }} />
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', paddingTop: 4 }}>
            <span style={{ fontSize: 22 }}>{getEmoji(score)}</span>
            <M style={{ fontSize: 18, fontWeight: 800, color: X.text }}>{Math.round(score)}</M>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 4 }}>
        <Badge color={c}>
          {trend === 'up' ? '\u25B2' : '\u25BC'} {trend === 'up' ? '+3.2%' : '-1.8%'}
        </Badge>
        <M style={{ fontSize: 8, color: X.textMut }}>vs last week</M>
      </div>
    </Card>
  );
}

// ── Usage Forecaster ─────────────────────────────────────────────────
export function UsageForecaster({ title = 'Usage Forecast', dataPoints = 30 }: { title?: string; dataPoints?: number }) {
  const X = getX();
  const [view, setView] = useState<'7d' | '30d'>('7d');

  const actual = useMemo(() => Array.from({ length: 20 }, (_, i) => 30 + Math.sin(i * 0.5) * 15 + (Math.random() - 0.5) * 8), []);
  const predicted = useMemo(() => Array.from({ length: 30 }, (_, i) => 30 + Math.sin(i * 0.5) * 15 + i * 0.5), []);
  const upper = useMemo(() => predicted.map(v => v + 8 + Math.random() * 4), [predicted]);
  const lower = useMemo(() => predicted.map(v => v - 8 - Math.random() * 4), [predicted]);

  const all = [...actual, ...predicted, ...upper, ...lower];
  const mn = Math.min(...all);
  const mx = Math.max(...all);
  const norm = (v: number) => 100 - ((v - mn) / (mx - mn || 1)) * 80;

  const actualPts = actual.map((v, i) => `${(i / 29) * 100},${norm(v)}`).join(' ');
  const predPts = predicted.map((v, i) => `${(i / 29) * 100},${norm(v)}`).join(' ');
  const bandPts = upper.map((v, i) => `${(i / 29) * 100},${norm(v)}`).join(' ') + ' ' + [...lower].reverse().map((v, i) => `${((lower.length - 1 - i) / 29) * 100},${norm(v)}`).join(' ');

  return (
    <Card glow={X.indigo} style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
          <M style={{ fontSize: 8, color: X.textMut }}>Actual vs Predicted</M>
        </div>
        <div style={{ display: 'flex', gap: 2 }}>
          {(['7d', '30d'] as const).map(v => (
            <Btn key={v} small ghost active={view === v} onClick={() => setView(v)} color={X.indigo}>{v}</Btn>
          ))}
        </div>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 80, overflow: 'hidden', marginBottom: 8 }}>
        <polygon points={bandPts} fill={X.indigo} opacity=".08" />
        <polyline points={actualPts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        <polyline points={predPts} fill="none" stroke={X.indigo} strokeWidth="1.5" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" />
        <line x1={((actual.length - 1) / 29) * 100} y1="5" x2={((actual.length - 1) / 29) * 100} y2="95" stroke={X.textMut} strokeWidth=".5" strokeDasharray="1 2" vectorEffect="non-scaling-stroke" opacity=".4" />
        <text x={((actual.length - 1) / 29) * 100 + 1} y="8" fontSize="4" fill={X.textMut} fontFamily="monospace">now</text>
      </svg>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 2, background: X.teal, borderRadius: 1 }} />
          <M style={{ fontSize: 8, color: X.textMut }}>Actual</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 12, height: 2, background: X.indigo, borderRadius: 1, borderTop: `1px dashed ${X.indigo}` }} />
          <M style={{ fontSize: 8, color: X.textMut }}>Predicted</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <div style={{ width: 8, height: 6, background: X.indigo + '20', borderRadius: 1 }} />
          <M style={{ fontSize: 8, color: X.textMut }}>CI Band</M>
        </div>
      </div>
    </Card>
  );
}

// ── Model Performance ────────────────────────────────────────────────
export function ModelPerformance({ title = 'Model Performance', maxEpochs = 50 }: { title?: string; maxEpochs?: number }) {
  const X = getX();
  const [training, setTraining] = useState(false);
  const [epoch, setEpoch] = useState(0);

  const metrics = [
    { name: 'Accuracy', value: 96.4, color: X.teal },
    { name: 'Precision', value: 94.1, color: X.purple },
    { name: 'Recall', value: 91.8, color: X.indigo },
    { name: 'F1 Score', value: 92.9, color: X.pink },
  ];

  useEffect(() => {
    if (!training) return;
    const i = setInterval(() => {
      setEpoch(prev => {
        if (prev >= maxEpochs) { setTraining(false); return 0; }
        return prev + 1;
      });
    }, 200);
    return () => clearInterval(i);
  }, [training, maxEpochs]);

  return (
    <Card glow={X.purple} style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {training
          ? <Badge color={X.amber} solid>Training {epoch}/{maxEpochs}</Badge>
          : <Badge color={X.teal}>Deployed</Badge>
        }
      </div>
      {metrics.map((m, i) => (
        <div key={i} style={{ marginBottom: i < metrics.length - 1 ? 8 : 0, animation: `sr 180ms ${ease.o} ${i * 30}ms both` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <M style={{ fontSize: 9, color: X.textSec }}>{m.name}</M>
            <M style={{ fontSize: 10, fontWeight: 700, color: m.color }}>{m.value.toFixed(1)}%</M>
          </div>
          <Prog value={m.value} color={m.color} h={3} />
        </div>
      ))}
      <div style={{ marginTop: 10, display: 'flex', gap: 4 }}>
        <Btn onClick={() => { setTraining(true); setEpoch(0); }} color={X.purple} small disabled={training}>
          {training ? 'Training...' : 'Retrain'}
        </Btn>
        <M style={{ fontSize: 8, color: X.textMut, display: 'flex', alignItems: 'center' }}>Last trained 2h ago</M>
      </div>
      {training && <Prog value={(epoch / maxEpochs) * 100} color={X.amber} h={2} style={{ marginTop: 6 }} />}
    </Card>
  );
}

// ── NLP Command Parser ───────────────────────────────────────────────
export function NLPCommandParser({ title = 'NLP Parser', modelVersion = 'NLU v2' }: { title?: string; modelVersion?: string }) {
  const X = getX();
  const [input, setInput] = useState('');
  const [parsed, setParsed] = useState<{ intent: string; entities: { type: string; value: string }[]; confidence: number } | null>(null);
  const [parsing, setParsing] = useState(false);

  const examples: Record<string, { intent: string; entities: { type: string; value: string }[]; confidence: number }> = {
    'turn off projector in room 3': { intent: 'device.power_off', entities: [{ type: 'device', value: 'projector' }, { type: 'location', value: 'room 3' }], confidence: 96.2 },
    'set volume to 80': { intent: 'device.set_volume', entities: [{ type: 'parameter', value: 'volume' }, { type: 'value', value: '80' }], confidence: 98.1 },
    'show camera feed': { intent: 'display.show_feed', entities: [{ type: 'source', value: 'camera' }], confidence: 91.5 },
    'dim lights to 40 percent': { intent: 'lighting.set_level', entities: [{ type: 'device', value: 'lights' }, { type: 'value', value: '40%' }], confidence: 94.7 },
    'schedule reboot at midnight': { intent: 'system.schedule_reboot', entities: [{ type: 'action', value: 'reboot' }, { type: 'time', value: 'midnight' }], confidence: 89.3 },
  };

  const parse = () => {
    if (!input.trim()) return;
    setParsing(true);
    setParsed(null);
    setTimeout(() => {
      const lower = input.toLowerCase().trim();
      const match = Object.keys(examples).find(k => lower.includes(k.split(' ')[0]) && lower.includes(k.split(' ').slice(-1)[0]));
      if (match) {
        setParsed(examples[match]);
      } else {
        setParsed({
          intent: 'unknown.query',
          entities: input.split(' ').filter(w => w.length > 3).slice(0, 2).map(w => ({ type: 'token', value: w })),
          confidence: 42 + Math.random() * 30,
        });
      }
      setParsing(false);
    }, 600 + Math.random() * 400);
  };

  const confColor = (c: number) => c >= 85 ? X.teal : c >= 60 ? X.amber : X.red;

  return (
    <Card glow={X.pink} style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
          <svg width="12" height="12" viewBox="0 0 16 16" style={{ display: 'block' }}><path d="M8 0l1.8 6.2L16 8l-6.2 1.8L8 16l-1.8-6.2L0 8l6.2-1.8z" fill={X.pink} opacity=".7" /></svg>
        </div>
        <Badge color={X.pink}>{modelVersion}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && parse()}
          placeholder="e.g. turn off projector in room 3"
          style={{
            flex: 1, padding: '6px 8px', borderRadius: X.rs, border: `1px solid ${X.border}`,
            background: X.bgAlt, color: X.text, fontFamily: X.m, fontSize: 10, outline: 'none',
          }}
        />
        <Btn onClick={parse} color={X.pink} small disabled={parsing || !input.trim()}>
          {parsing ? '...' : 'Parse'}
        </Btn>
      </div>
      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', marginBottom: 8 }}>
        {['turn off projector in room 3', 'set volume to 80', 'show camera feed'].map((ex, i) => (
          <button key={i} onClick={() => setInput(ex)} style={{
            padding: '2px 6px', borderRadius: 10, border: `1px solid ${X.borderLight}`,
            background: 'transparent', color: X.textMut, fontFamily: X.m, fontSize: 7,
            cursor: 'pointer', transition: `border-color 150ms ${ease.mv}`,
          }}>{ex}</button>
        ))}
      </div>
      {parsed && (
        <div style={{ padding: '8px', borderRadius: X.rs, background: X.bg, border: `1px solid ${X.borderLight}`, animation: `fu 150ms ${ease.o}` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
            <Lbl>Intent</Lbl>
            <M style={{ fontSize: 9, fontWeight: 700, color: confColor(parsed.confidence) }}>{parsed.confidence.toFixed(1)}%</M>
          </div>
          <div style={{ padding: '3px 6px', borderRadius: 4, background: X.purple + '12', marginBottom: 8 }}>
            <M style={{ fontSize: 10, fontWeight: 600, color: X.purple }}>{parsed.intent}</M>
          </div>
          <Lbl style={{ marginBottom: 4 }}>Entities</Lbl>
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap' }}>
            {parsed.entities.map((ent, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                <Badge color={X.indigo} style={{ fontSize: 7 }}>{ent.type}</Badge>
                <M style={{ fontSize: 9, color: X.text, fontWeight: 600 }}>{ent.value}</M>
              </div>
            ))}
          </div>
          <Prog value={parsed.confidence} color={confColor(parsed.confidence)} h={2} style={{ marginTop: 6 }} />
        </div>
      )}
      {!parsed && !parsing && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <M style={{ fontSize: 9, color: X.textMut }}>Type a command to parse</M>
        </div>
      )}
      {parsing && (
        <div style={{ textAlign: 'center', padding: '10px 0' }}>
          <M style={{ fontSize: 9, color: X.pink, animation: `bl 1s step-end infinite` }}>Analyzing...</M>
        </div>
      )}
    </Card>
  );
}
