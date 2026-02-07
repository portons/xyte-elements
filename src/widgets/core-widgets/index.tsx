import React, { useState, useEffect, useRef } from 'react';
import { getX, ease, Card, Badge, Btn, Slider, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Types ────────────────────────────────────────────────────────────

type Segment = { from: number; to: number; color: string; label?: string };

const DEFAULT_SEGMENTS: Segment[] = [
  { from: 0, to: 30, color: '#00BFA5' },
  { from: 30, to: 70, color: '#FFC107' },
  { from: 70, to: 100, color: '#FF5252' },
];

type SwitchItem = { id: string; title: string; isChecked: boolean };

const DEFAULT_SWITCHES: SwitchItem[] = [
  { id: 's1', title: 'Auto-Brightness', isChecked: true },
  { id: 's2', title: 'Standby', isChecked: false },
  { id: 's3', title: 'Eco Mode', isChecked: true },
];

// ── Helpers ──────────────────────────────────────────────────────────

function formatNumber(value: number, format?: string, decimals?: number): string {
  const d = decimals ?? 0;
  if (format === 'compact') {
    if (value >= 1_000_000) return (value / 1_000_000).toFixed(d) + 'M';
    if (value >= 1_000) return (value / 1_000).toFixed(d) + 'K';
  }
  if (format === 'percent') return value.toFixed(d) + '%';
  return d > 0 ? value.toFixed(d) : value.toLocaleString();
}

function segmentColor(value: number, segments: Segment[]): string {
  for (const seg of segments) {
    if (value >= seg.from && value <= seg.to) return seg.color;
  }
  return segments[segments.length - 1]?.color ?? '#888';
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

// ── 1. StatusIndicator ───────────────────────────────────────────────

export function StatusIndicator({ title = 'Status', color, value = 'Online' }: {
  title?: string; color?: string; value?: string;
}) {
  const X = getX();
  const c = color ?? X.teal;
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <Lbl>{title}</Lbl>
        <Badge color={c} solid>
          <Dot c="#fff" pulse s={5} />
          {value}
        </Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <div style={{
          width: 36, height: 36, borderRadius: '50%',
          background: c + '18', border: `2px solid ${c}40`,
          display: 'grid', placeItems: 'center',
          transition: `border-color 300ms ${ease.o}`,
        }}>
          <Dot c={c} pulse s={12} />
        </div>
        <div>
          <M style={{ fontSize: 16, fontWeight: 800, color: X.text, display: 'block' }}>{value}</M>
          <M style={{ fontSize: 9, color: X.textMut }}>{title}</M>
        </div>
      </div>
    </Card>
  );
}

// ── 2. NumericMetric ─────────────────────────────────────────────────

export function NumericMetric({ title = 'Metric', value = 0, unit = '', numberFormat, numberOfDecimals }: {
  title?: string; value?: number; unit?: string; numberFormat?: string; numberOfDecimals?: number;
}) {
  const X = getX();
  const animated = useAnim(value);
  const displayVal = formatNumber(animated, numberFormat, numberOfDecimals);
  return (
    <Card style={{ width: 350 }}>
      <Lbl style={{ marginBottom: 8 }}>{title}</Lbl>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <M style={{
          fontSize: 32, fontWeight: 800, color: X.text,
          background: X.gradPrimary, WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
        }}>
          {displayVal}
        </M>
        {unit && <M style={{ fontSize: 12, color: X.textMut, fontWeight: 600 }}>{unit}</M>}
      </div>
    </Card>
  );
}

// ── 3. ValueDisplay ──────────────────────────────────────────────────

export function ValueDisplay({ title = 'Value', value = '—', unit }: {
  title?: string; value?: string | number; unit?: string;
}) {
  const X = getX();
  return (
    <Card style={{ width: 350 }}>
      <Lbl style={{ marginBottom: 8 }}>{title}</Lbl>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
        <M style={{ fontSize: 22, fontWeight: 700, color: X.text }}>{value}</M>
        {unit && <M style={{ fontSize: 11, color: X.textMut, fontWeight: 600 }}>{unit}</M>}
      </div>
    </Card>
  );
}

// ── 4. TextDisplay ───────────────────────────────────────────────────

export function TextDisplay({ title = 'Info', content = '' }: {
  title?: string; content?: string;
}) {
  const X = getX();
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>{title}</div>
      <div style={{
        fontSize: 11, color: X.textSec, lineHeight: 1.5, fontFamily: X.f,
        padding: 10, borderRadius: X.rs, background: X.bgAlt,
        border: `1px solid ${X.borderLight}`,
        maxHeight: 120, overflowY: 'auto',
      }}>
        {content || <span style={{ color: X.textMut, fontStyle: 'italic' }}>No content</span>}
      </div>
    </Card>
  );
}

// ── 5. ToggleSwitch ──────────────────────────────────────────────────

export function ToggleSwitch({ title = 'Toggle', isChecked = false, color, isDeviceOffline = false, isLoading = false, onToggle }: {
  title?: string; isChecked?: boolean; color?: string; isDeviceOffline?: boolean; isLoading?: boolean; onToggle?: (val: boolean) => void;
}) {
  const X = getX();
  const c = color ?? X.purple;
  const [on, setOn] = useState(isChecked);

  useEffect(() => { setOn(isChecked); }, [isChecked]);

  const toggle = () => {
    if (isDeviceOffline || isLoading) return;
    const next = !on;
    setOn(next);
    onToggle?.(next);
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 12, fontWeight: 600, color: isDeviceOffline ? X.textMut : X.text }}>{title}</div>
          {isDeviceOffline && <M style={{ fontSize: 8, color: X.red }}>Device Offline</M>}
          {isLoading && <M style={{ fontSize: 8, color: X.amber, animation: 'br 1.2s ease infinite' }}>Sending...</M>}
        </div>
        <button onClick={toggle} style={{
          width: 42, height: 22, borderRadius: 11, border: 'none', padding: 0,
          cursor: isDeviceOffline || isLoading ? 'not-allowed' : 'pointer',
          background: isDeviceOffline ? X.borderLight : on ? c : X.borderLight,
          opacity: isDeviceOffline ? 0.4 : isLoading ? 0.6 : 1,
          transition: `background 200ms ${ease.mv}`,
          position: 'relative',
        }}>
          {isLoading && (
            <div style={{
              position: 'absolute', inset: 0, borderRadius: 11,
              border: `2px solid transparent`, borderTopColor: c,
              animation: 'sp .8s linear infinite',
            }} />
          )}
          <div style={{
            width: 16, height: 16, borderRadius: '50%', background: '#fff',
            position: 'absolute', top: 3, left: on ? 23 : 3,
            transition: `left 200ms ${ease.sp}`,
            boxShadow: '0 1px 3px #0003',
          }} />
        </button>
      </div>
    </Card>
  );
}

// ── 6. ActionButton ──────────────────────────────────────────────────

export function ActionButton({ title = 'Execute', color, isLoading = false, isDeviceOffline = false, onClick }: {
  title?: string; color?: string; isLoading?: boolean; isDeviceOffline?: boolean; onClick?: () => void;
}) {
  const X = getX();
  const c = color ?? X.purple;
  const [state, setState] = useState<'idle' | 'loading' | 'done'>('idle');

  const handleClick = () => {
    if (isDeviceOffline || state === 'loading') return;
    if (isLoading) return;
    setState('loading');
    onClick?.();
    setTimeout(() => {
      setState('done');
      setTimeout(() => setState('idle'), 1200);
    }, 1000);
  };

  const isActive = isLoading || state === 'loading';

  return (
    <Card style={{ width: 350 }}>
      <Lbl style={{ marginBottom: 8 }}>{title}</Lbl>
      <Btn
        onClick={handleClick}
        color={state === 'done' ? X.teal : isDeviceOffline ? X.textMut : c}
        disabled={isDeviceOffline || isActive}
        style={{ width: '100%', justifyContent: 'center', padding: '10px 14px' }}
      >
        {isActive ? (
          <span style={{ display: 'inline-block', animation: 'sp .7s linear infinite', fontSize: 12 }}>&#x27F3;</span>
        ) : state === 'done' ? (
          <span>&#x2713; Done</span>
        ) : (
          title
        )}
      </Btn>
      {isDeviceOffline && <M style={{ fontSize: 8, color: X.red, marginTop: 4, textAlign: 'center', display: 'block' }}>Device offline</M>}
    </Card>
  );
}

// ── 7. StateSelector ─────────────────────────────────────────────────

export function StateSelector({ title = 'Mode', value = '', options = [], color }: {
  title?: string; value?: string; options?: { label: string; value: string }[]; color?: string;
}) {
  const X = getX();
  const c = color ?? X.purple;
  const fallback = [
    { label: 'Auto', value: 'auto' },
    { label: 'Manual', value: 'manual' },
    { label: 'Schedule', value: 'schedule' },
  ];
  const opts = options.length > 0 ? options : fallback;
  const [selected, setSelected] = useState(value || opts[0]?.value || '');

  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {opts.map((opt, i) => {
          const active = selected === opt.value;
          return (
            <button key={opt.value} onClick={() => setSelected(opt.value)} style={{
              width: '100%', display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 10px', borderRadius: X.rs, textAlign: 'left', cursor: 'pointer',
              border: `1px solid ${active ? c + '30' : 'transparent'}`,
              background: active ? c + '0c' : 'transparent',
              transition: `background-color 180ms ${ease.mv}, border-color 180ms ${ease.mv}`,
              animation: `sr 150ms ${ease.o} ${i * 30}ms both`,
            }}>
              <div style={{
                width: 14, height: 14, borderRadius: '50%',
                border: `2px solid ${active ? c : X.border}`,
                display: 'grid', placeItems: 'center',
                transition: `border-color 200ms ${ease.mv}`,
              }}>
                {active && <div style={{ width: 6, height: 6, borderRadius: '50%', background: c, animation: `si 200ms ${ease.sp}` }} />}
              </div>
              <M style={{ fontSize: 11, fontWeight: active ? 600 : 400, color: active ? c : X.textSec }}>{opt.label}</M>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ── 8. BarSlider ─────────────────────────────────────────────────────

export function BarSlider({ title = 'Control', value = 50, min = 0, max = 100, unit = '', gradient, onChange }: {
  title?: string; value?: number; min?: number; max?: number; unit?: string; gradient?: string; onChange?: (v: number) => void;
}) {
  const X = getX();
  const [val, setVal] = useState(value);

  useEffect(() => { setVal(value); }, [value]);

  const handleChange = (v: number) => {
    setVal(v);
    onChange?.(v);
  };

  const pct = ((val - min) / (max - min)) * 100;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 14, fontWeight: 800, color: X.purple }}>{val}{unit}</M>
      </div>
      <Slider
        value={val}
        onChange={handleChange}
        min={min}
        max={max}
        color={gradient ? undefined : X.purple}
      />
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>{min}{unit}</M>
        <M style={{ fontSize: 8, color: X.textMut }}>{max}{unit}</M>
      </div>
    </Card>
  );
}

// ── 9. GaugeWidget ───────────────────────────────────────────────────

export function GaugeWidget({ title = 'Gauge', value = 50, min = 0, max = 100, unit = '%', segments }: {
  title?: string; value?: number; min?: number; max?: number; unit?: string; segments?: Segment[];
}) {
  const X = getX();
  const segs = segments ?? DEFAULT_SEGMENTS;
  const animated = useAnim(value);
  const pct = clamp((animated - min) / (max - min), 0, 1);
  const angle = -135 + pct * 270;
  const cx = 60, cy = 60, r = 48;
  const needleLen = 38;

  const segmentArcs = segs.map(seg => {
    const startPct = (seg.from - min) / (max - min);
    const endPct = (seg.to - min) / (max - min);
    const startAngle = (-135 + startPct * 270) * Math.PI / 180;
    const endAngle = (-135 + endPct * 270) * Math.PI / 180;
    const x1 = cx + r * Math.cos(startAngle);
    const y1 = cy + r * Math.sin(startAngle);
    const x2 = cx + r * Math.cos(endAngle);
    const y2 = cy + r * Math.sin(endAngle);
    const largeArc = (endPct - startPct) * 270 > 180 ? 1 : 0;
    return { d: `M ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2}`, color: seg.color };
  });

  const needleAngle = angle * Math.PI / 180;
  const nx = cx + needleLen * Math.cos(needleAngle);
  const ny = cy + needleLen * Math.sin(needleAngle);

  const currentColor = segmentColor(animated, segs);

  return (
    <Card style={{ width: 350 }}>
      <Lbl style={{ marginBottom: 6 }}>{title}</Lbl>
      <svg viewBox="0 0 120 90" style={{ width: '100%', display: 'block' }}>
        {/* Background arc */}
        <path
          d={`M ${cx + r * Math.cos(-135 * Math.PI / 180)} ${cy + r * Math.sin(-135 * Math.PI / 180)} A ${r} ${r} 0 1 1 ${cx + r * Math.cos((-135 + 270) * Math.PI / 180)} ${cy + r * Math.sin((-135 + 270) * Math.PI / 180)}`}
          fill="none" stroke={X.borderLight} strokeWidth={6} strokeLinecap="round"
        />
        {/* Segment arcs */}
        {segmentArcs.map((seg, i) => (
          <path key={i} d={seg.d} fill="none" stroke={seg.color} strokeWidth={6} strokeLinecap="round" opacity={0.7} />
        ))}
        {/* Needle */}
        <line
          x1={cx} y1={cy} x2={nx} y2={ny}
          stroke={currentColor} strokeWidth={2.5} strokeLinecap="round"
          style={{ transition: `all 600ms ${ease.sp}` }}
        />
        <circle cx={cx} cy={cy} r={4} fill={X.surface} stroke={currentColor} strokeWidth={2} />
      </svg>
      <div style={{ textAlign: 'center', marginTop: 2 }}>
        <M style={{ fontSize: 20, fontWeight: 800, color: currentColor }}>{Math.round(animated)}</M>
        <M style={{ fontSize: 10, color: X.textMut }}>{unit}</M>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        <M style={{ fontSize: 8, color: X.textMut }}>{min}</M>
        <M style={{ fontSize: 8, color: X.textMut }}>{max}</M>
      </div>
    </Card>
  );
}

// ── 10. BarWidget ────────────────────────────────────────────────────

export function BarWidget({ title = 'Level', value = 50, min = 0, max = 100, unit = '%', segments }: {
  title?: string; value?: number; min?: number; max?: number; unit?: string; segments?: Segment[];
}) {
  const X = getX();
  const segs = segments ?? DEFAULT_SEGMENTS;
  const animated = useAnim(value);
  const pct = clamp(((animated - min) / (max - min)) * 100, 0, 100);
  const currentColor = segmentColor(animated, segs);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 14, fontWeight: 800, color: currentColor }}>{Math.round(animated)}{unit}</M>
      </div>
      {/* Segmented background */}
      <div style={{
        height: 10, borderRadius: 5, overflow: 'hidden', position: 'relative',
        background: X.borderLight,
      }}>
        {segs.map((seg, i) => {
          const startPct = ((seg.from - min) / (max - min)) * 100;
          const widthPct = ((seg.to - seg.from) / (max - min)) * 100;
          return (
            <div key={i} style={{
              position: 'absolute', top: 0, bottom: 0,
              left: `${startPct}%`, width: `${widthPct}%`,
              background: seg.color, opacity: 0.15,
            }} />
          );
        })}
        <div style={{
          height: '100%', borderRadius: 5, width: `${pct}%`,
          background: currentColor,
          transition: `width 600ms ${ease.sp}`,
          position: 'relative', zIndex: 1,
          boxShadow: `0 0 8px ${currentColor}40`,
        }} />
      </div>
      {/* Segment labels */}
      <div style={{ display: 'flex', gap: 6, marginTop: 6, flexWrap: 'wrap' }}>
        {segs.map((seg, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 6, height: 6, borderRadius: 2, background: seg.color }} />
            <M style={{ fontSize: 8, color: X.textMut }}>{seg.label ?? `${seg.from}-${seg.to}`}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── 11. SplineChart ──────────────────────────────────────────────────

function generateSplineData(points = 24): number[] {
  const data: number[] = [];
  let val = 50 + Math.random() * 30;
  for (let i = 0; i < points; i++) {
    val += (Math.random() - 0.48) * 12;
    val = clamp(val, 10, 95);
    data.push(val);
  }
  return data;
}

export function SplineChart({ title = 'Trend', measurements, data }: {
  title?: string;
  measurements?: { label: string; color: string; data: number[] }[];
  data?: number[];
}) {
  const X = getX();
  const tick = useTick(3000);

  const [series] = useState(() => {
    if (measurements && measurements.length > 0) return measurements;
    if (data && data.length > 0) return [{ label: 'Value', color: X.purple, data }];
    return [
      { label: 'CPU', color: X.purple, data: generateSplineData() },
      { label: 'Memory', color: X.teal, data: generateSplineData() },
    ];
  });

  const w = 230, h = 80, pad = 2;

  const buildPath = (values: number[]) => {
    const maxVal = Math.max(...values, 1);
    const minVal = Math.min(...values, 0);
    const range = maxVal - minVal || 1;
    const points = values.map((v, i) => ({
      x: pad + (i / (values.length - 1)) * (w - pad * 2),
      y: pad + (1 - (v - minVal) / range) * (h - pad * 2),
    }));
    let d = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      const prev = points[i - 1];
      const curr = points[i];
      const cpx1 = prev.x + (curr.x - prev.x) * 0.4;
      const cpx2 = curr.x - (curr.x - prev.x) * 0.4;
      d += ` C ${cpx1} ${prev.y}, ${cpx2} ${curr.y}, ${curr.x} ${curr.y}`;
    }
    const areaD = d + ` L ${points[points.length - 1].x} ${h} L ${points[0].x} ${h} Z`;
    return { line: d, area: areaD };
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 8 }}>
          {series.map((s, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 6, height: 2, borderRadius: 1, background: s.color }} />
              <M style={{ fontSize: 8, color: X.textMut }}>{s.label}</M>
            </div>
          ))}
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
        {/* Grid lines */}
        {[0.25, 0.5, 0.75].map((frac, i) => (
          <line key={i} x1={pad} y1={pad + frac * (h - pad * 2)} x2={w - pad} y2={pad + frac * (h - pad * 2)} stroke={X.borderLight} strokeWidth={0.5} />
        ))}
        {series.map((s, i) => {
          const { line, area } = buildPath(s.data);
          return (
            <g key={i}>
              <defs>
                <linearGradient id={`spline-grad-${i}`} x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor={s.color} stopOpacity={0.25} />
                  <stop offset="100%" stopColor={s.color} stopOpacity={0} />
                </linearGradient>
              </defs>
              <path d={area} fill={`url(#spline-grad-${i})`} />
              <path d={line} fill="none" stroke={s.color} strokeWidth={1.5} strokeLinecap="round" />
            </g>
          );
        })}
      </svg>
    </Card>
  );
}

// ── 12. ScatterChart ─────────────────────────────────────────────────

function generateScatterData(count = 30): { x: number; y: number; label?: string }[] {
  const data: { x: number; y: number; label?: string }[] = [];
  const labels = ['Alert', 'Warning', 'Info', 'Error', 'Reset'];
  for (let i = 0; i < count; i++) {
    data.push({
      x: Math.random() * 100,
      y: Math.random() * 100,
      label: labels[Math.floor(Math.random() * labels.length)],
    });
  }
  return data;
}

export function ScatterChart({ title = 'Events', events, data }: {
  title?: string;
  events?: { x: number; y: number; label?: string; color?: string }[];
  data?: { x: number; y: number; label?: string; color?: string }[];
}) {
  const X = getX();
  const points = events ?? data ?? generateScatterData();
  const w = 230, h = 100, pad = 8;
  const colorMap: Record<string, string> = {
    Error: X.red, Alert: X.amber, Warning: X.amber, Info: X.teal, Reset: X.indigo,
  };

  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>{title}</div>
      <svg viewBox={`0 0 ${w} ${h}`} style={{ width: '100%', display: 'block' }}>
        {/* Grid */}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
          <line key={`h-${i}`} x1={pad} y1={pad + frac * (h - pad * 2)} x2={w - pad} y2={pad + frac * (h - pad * 2)} stroke={X.borderLight} strokeWidth={0.3} />
        ))}
        {[0, 0.25, 0.5, 0.75, 1].map((frac, i) => (
          <line key={`v-${i}`} x1={pad + frac * (w - pad * 2)} y1={pad} x2={pad + frac * (w - pad * 2)} y2={h - pad} stroke={X.borderLight} strokeWidth={0.3} />
        ))}
        {/* Points */}
        {points.map((pt, i) => {
          const px = pad + (pt.x / 100) * (w - pad * 2);
          const py = pad + (1 - pt.y / 100) * (h - pad * 2);
          const c = pt.color ?? colorMap[pt.label ?? ''] ?? X.purple;
          return (
            <g key={i}>
              <circle cx={px} cy={py} r={3} fill={c} opacity={0.7}>
                <animate attributeName="opacity" values="0;0.7" dur="0.3s" begin={`${i * 0.02}s`} fill="freeze" />
              </circle>
              <circle cx={px} cy={py} r={3} fill="none" stroke={c} strokeWidth={0.5} opacity={0.3} />
            </g>
          );
        })}
      </svg>
      <div style={{ display: 'flex', gap: 6, marginTop: 4, flexWrap: 'wrap' }}>
        {Object.entries(colorMap).slice(0, 4).map(([label, clr]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 5, height: 5, borderRadius: '50%', background: clr }} />
            <M style={{ fontSize: 7, color: X.textMut }}>{label}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── 13. DeviceMap ────────────────────────────────────────────────────

export function DeviceMap({ title = 'Location', lat, lng }: {
  title?: string; lat?: number; lng?: number;
}) {
  const X = getX();
  const hasCoords = lat != null && lng != null;
  const displayLat = lat ?? 40.7128;
  const displayLng = lng ?? -74.006;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {hasCoords && <Badge color={X.teal}><Dot c={X.teal} s={4} />Located</Badge>}
      </div>
      {/* Map placeholder */}
      <div style={{
        height: 120, borderRadius: X.rs,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Grid pattern to simulate map */}
        <svg viewBox="0 0 200 120" style={{ width: '100%', height: '100%', position: 'absolute' }}>
          {Array.from({ length: 9 }, (_, i) => (
            <line key={`v-${i}`} x1={20 + i * 20} y1={0} x2={20 + i * 20} y2={120} stroke={X.borderLight} strokeWidth={0.5} />
          ))}
          {Array.from({ length: 6 }, (_, i) => (
            <line key={`h-${i}`} x1={0} y1={20 + i * 20} x2={200} y2={20 + i * 20} stroke={X.borderLight} strokeWidth={0.5} />
          ))}
        </svg>
        {/* Pin */}
        <div style={{
          position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -100%)',
        }}>
          <div style={{
            width: 16, height: 16, borderRadius: '50% 50% 50% 0', transform: 'rotate(-45deg)',
            background: X.purple, boxShadow: `0 2px 8px ${X.purple}40`,
          }} />
          <div style={{
            width: 24, height: 24, borderRadius: '50%', background: X.purple + '15',
            border: `1px solid ${X.purple}30`, position: 'absolute',
            top: 4, left: -4, animation: 'br 2s ease infinite',
          }} />
        </div>
        {/* Coordinates overlay */}
        <div style={{
          position: 'absolute', bottom: 4, left: 4, padding: '2px 6px',
          borderRadius: 4, background: X.surface + 'dd', backdropFilter: 'blur(4px)',
        }}>
          <M style={{ fontSize: 8, color: X.textMut }}>{displayLat.toFixed(4)}, {displayLng.toFixed(4)}</M>
        </div>
      </div>
      {!hasCoords && (
        <M style={{ fontSize: 9, color: X.textMut, marginTop: 6, display: 'block', textAlign: 'center' }}>
          No coordinates available
        </M>
      )}
    </Card>
  );
}

// ── 14. StatusTimeline ───────────────────────────────────────────────

export function StatusTimeline({ title = 'Uptime', statusData }: {
  title?: string;
  statusData?: { start: number; end: number; color: string; label?: string }[];
}) {
  const X = getX();
  const defaultData = [
    { start: 0, end: 20, color: X.teal, label: 'Online' },
    { start: 20, end: 25, color: X.amber, label: 'Warning' },
    { start: 25, end: 60, color: X.teal, label: 'Online' },
    { start: 60, end: 65, color: X.red, label: 'Offline' },
    { start: 65, end: 80, color: X.teal, label: 'Online' },
    { start: 80, end: 85, color: X.amber, label: 'Warning' },
    { start: 85, end: 100, color: X.teal, label: 'Online' },
  ];
  const segments = statusData ?? defaultData;
  const total = Math.max(...segments.map(s => s.end), 100);

  // Collect unique labels for legend
  const uniqueLabels = new Map<string, string>();
  for (const seg of segments) {
    if (seg.label && !uniqueLabels.has(seg.label)) {
      uniqueLabels.set(seg.label, seg.color);
    }
  }

  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>{title}</div>
      <div style={{
        height: 16, borderRadius: 4, overflow: 'hidden',
        display: 'flex', background: X.borderLight,
      }}>
        {segments.map((seg, i) => {
          const widthPct = ((seg.end - seg.start) / total) * 100;
          return (
            <div key={i} style={{
              width: `${widthPct}%`, height: '100%',
              background: seg.color,
              transition: `width 300ms ${ease.o}`,
              opacity: 0.8,
              borderRight: i < segments.length - 1 ? `1px solid ${X.surface}` : 'none',
            }} />
          );
        })}
      </div>
      {/* Time axis labels */}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
        {['0h', '6h', '12h', '18h', '24h'].map((t, i) => (
          <M key={i} style={{ fontSize: 7, color: X.textMut }}>{t}</M>
        ))}
      </div>
      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
        {Array.from(uniqueLabels.entries()).map(([label, color]) => (
          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <div style={{ width: 8, height: 4, borderRadius: 1, background: color }} />
            <M style={{ fontSize: 8, color: X.textMut }}>{label}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── 15. GroupedToggles ───────────────────────────────────────────────

export function GroupedToggles({ title = 'Settings', switches }: {
  title?: string; switches?: SwitchItem[];
}) {
  const X = getX();
  const items = switches ?? DEFAULT_SWITCHES;
  const [states, setStates] = useState<Record<string, boolean>>(() => {
    const init: Record<string, boolean> = {};
    for (const sw of items) init[sw.id] = sw.isChecked;
    return init;
  });

  const toggle = (id: string) => {
    setStates(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const onCount = Object.values(states).filter(Boolean).length;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{onCount}/{items.length} on</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.map((sw, i) => {
          const on = states[sw.id] ?? false;
          return (
            <div key={sw.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '8px 10px', borderRadius: X.rs,
              background: on ? X.purple + '08' : 'transparent',
              border: `1px solid ${on ? X.purple + '18' : 'transparent'}`,
              transition: `background-color 200ms ${ease.mv}, border-color 200ms ${ease.mv}`,
              animation: `sr 150ms ${ease.o} ${i * 30}ms both`,
            }}>
              <M style={{ fontSize: 11, color: on ? X.text : X.textSec, fontWeight: on ? 600 : 400 }}>
                {sw.title}
              </M>
              <button onClick={() => toggle(sw.id)} style={{
                width: 36, height: 20, borderRadius: 10, border: 'none', padding: 0,
                cursor: 'pointer',
                background: on ? X.purple : X.borderLight,
                transition: `background 180ms ${ease.mv}`,
                position: 'relative',
              }}>
                <div style={{
                  width: 14, height: 14, borderRadius: '50%', background: '#fff',
                  position: 'absolute', top: 3, left: on ? 19 : 3,
                  transition: `left 180ms ${ease.sp}`,
                  boxShadow: '0 1px 3px #0003',
                }} />
              </button>
            </div>
          );
        })}
      </div>
    </Card>
  );
}
