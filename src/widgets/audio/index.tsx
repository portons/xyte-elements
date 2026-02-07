import { useState, useEffect, useRef } from 'react';
import { getX, ease, Card, Btn, Lbl, M } from '../primitives';

// ── Audio Spectrum ────────────────────────────────────────────────────
export function AudioSpectrum({ title = 'Audio Spectrum', bars: barCount = 32 }: {
  title?: string; bars?: number;
}) {
  const X = getX();
  const bars = barCount;
  const [levels, setLevels] = useState(() => Array(bars).fill(40));
  const [peaks, setPeaks] = useState(() => Array(bars).fill(40));
  useEffect(() => {
    const i = setInterval(() => {
      setLevels(prev => prev.map(v => Math.max(2, Math.min(100, v + (Math.random() * 100 - v) * 0.35))));
      setPeaks(prev => prev.map((pk, j) => { const nv = levels[j]; return nv > pk ? nv : Math.max(pk - 1.5, nv); }));
    }, 60);
    return () => clearInterval(i);
  }, [levels]);
  return (
    <Card>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <Lbl>{title}</Lbl>
        <M style={{ fontSize: 9, color: X.teal }}>−12.4 dBFS</M>
      </div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 36, position: 'relative' }}>
        {levels.map((lv, i) => (
          <div key={i} style={{ flex: 1, position: 'relative', height: '100%' }}>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, borderRadius: 1.5, height: Math.max(1, (lv / 100) * 34), background: lv > 90 ? X.red : lv > 72 ? X.amber : X.purple, transition: 'height 55ms linear', opacity: 0.6 + (lv / 100) * 0.4 }} />
            <div style={{ position: 'absolute', bottom: Math.max(0, (peaks[i] / 100) * 34), left: 0, right: 0, height: 1.5, borderRadius: 1, background: X.pink, opacity: 0.6 }} />
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Audio EQ ──────────────────────────────────────────────────────────
export function AudioEQ({ title = 'Parametric EQ', bandCount = 10 }: {
  title?: string; bandCount?: number;
}) {
  const X = getX();
  const allBands = ['32', '64', '125', '250', '500', '1K', '2K', '4K', '8K', '16K'];
  const bands = allBands.slice(0, bandCount);
  const [vals, setVals] = useState(() => bands.map(() => 50 + (Math.random() - 0.5) * 30));
  const setB = (i: number, v: number) => { const n = [...vals]; n[i] = v; setVals(n); };
  const presets: Record<string, number[]> = { Flat: bands.map(() => 50), 'V-Curve': [70, 65, 45, 35, 30, 30, 35, 50, 65, 72], Voice: [40, 45, 55, 70, 75, 72, 60, 45, 40, 38] };
  return (
    <Card style={{ width: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 2 }}>
          {Object.keys(presets).map(p => <Btn key={p} small ghost onClick={() => setVals(presets[p])} color={X.indigo}>{p}</Btn>)}
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3, alignItems: 'flex-end' }}>
        {bands.map((b, i) => {
          const db = Math.round((vals[i] - 50) * 0.48);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <M style={{ fontSize: 7, color: db > 0 ? X.teal : db < 0 ? X.pink : X.textMut, fontWeight: 600 }}>{db > 0 ? '+' : ''}{db}</M>
              <div style={{ width: '100%', height: 60, borderRadius: 3, background: X.bgAlt, position: 'relative', cursor: 'pointer' }}
                onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setB(i, Math.round(100 - ((e.clientY - r.top) / r.height) * 100)); }}>
                <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${vals[i]}%`, borderRadius: 3, background: `${X.purple}18`, transition: 'height 100ms' }} />
                <div style={{ position: 'absolute', width: '120%', left: '-10%', height: 3, borderRadius: 2, background: X.purple, bottom: `calc(${vals[i]}% - 1px)`, transition: 'bottom 100ms', boxShadow: `0 0 4px ${X.purple}40` }} />
              </div>
              <M style={{ fontSize: 6, color: X.textMut }}>{b}</M>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Volume Knob ───────────────────────────────────────────────────────
export function VolumeKnob({ label = 'Master Volume', color }: { label?: string; color?: string }) {
  const X = getX();
  const c = color ?? X.purple;
  const [vol, setVol] = useState(65);
  const [drag, setDrag] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const sz = 70, startA = 225, endA = -45, range = startA - endA;
  useEffect(() => {
    if (!drag) return;
    const mv = (e: MouseEvent) => {
      if (!ref.current) return;
      const r = ref.current.getBoundingClientRect();
      const dx = e.clientX - r.left - r.width / 2, dy = e.clientY - r.top - r.height / 2;
      const a = Math.atan2(-dx, dy) * (180 / Math.PI) + 180;
      const v = Math.max(0, Math.min(100, ((a - (360 - startA)) / range) * 100));
      setVol(Math.round(v));
    };
    const up = () => setDrag(false);
    window.addEventListener('mousemove', mv); window.addEventListener('mouseup', up);
    return () => { window.removeEventListener('mousemove', mv); window.removeEventListener('mouseup', up); };
  }, [drag]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <div ref={ref} onMouseDown={() => setDrag(true)} style={{ width: sz, height: sz, borderRadius: '50%', background: `conic-gradient(from 225deg, ${c} 0deg, ${c} ${(vol / 100) * range}deg, ${X.borderLight} ${(vol / 100) * range}deg, ${X.borderLight} ${range}deg, transparent ${range}deg)`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'grab', position: 'relative' }}>
        <div style={{ width: sz - 10, height: sz - 10, borderRadius: '50%', background: X.surface, display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: X.sh }}>
          <M style={{ fontSize: 14, fontWeight: 800, color: c }}>{vol}</M>
        </div>
        <div style={{ position: 'absolute', width: 3, height: 10, borderRadius: 2, background: c, top: 2, left: '50%', marginLeft: -1.5, transformOrigin: `50% ${sz / 2 - 2}px`, transform: `rotate(${startA - (vol / 100) * range - 180}deg)`, boxShadow: `0 0 4px ${c}40` }} />
      </div>
      <Lbl>{label}</Lbl>
    </div>
  );
}
