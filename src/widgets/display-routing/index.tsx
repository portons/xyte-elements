import { useState } from 'react';
import { getX, ease, Card, Btn, Lbl, M, Dot } from '../primitives';
import { Toggle } from '../av-controls';

// ── Video Wall ────────────────────────────────────────────────────────
export function VideoWall({ title = 'Video Wall', columns = 4 }: { title?: string; columns?: number }) {
  const X = getX();
  const layouts: Record<string, [number, number]> = { '1×1': [1, 1], '2×2': [2, 2], '3×3': [3, 3], '1×3': [3, 1] };
  const [layout, setLayout] = useState('2×2');
  const [sel, setSel] = useState<number | null>(null);
  const allSources = ['HDMI 1', 'HDMI 2', 'SDI 1', 'NDI', 'DP 1', 'USB-C'];
  const sources = allSources.slice(0, columns);
  const [assigns, setAssigns] = useState<Record<number, string>>({});
  const [c, r] = layouts[layout];
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 8 }}>{title}</div>
      <div style={{ display: 'flex', gap: 3, marginBottom: 8 }}>
        {Object.keys(layouts).map(k => <Btn key={k} small ghost active={layout === k} onClick={() => { setLayout(k); setSel(null); setAssigns({}); }}>{k}</Btn>)}
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${c}, 1fr)`, gridTemplateRows: `repeat(${r}, 1fr)`, gap: 2, aspectRatio: layout === '1×3' ? '3/1' : '16/10', marginBottom: sel !== null ? 8 : 0 }}>
        {Array.from({ length: c * r }, (_, i) => (
          <button key={i} onClick={() => setSel(i === sel ? null : i)} style={{ borderRadius: X.rs, border: `1px solid ${sel === i ? X.purple + '50' : X.border}`, background: sel === i ? X.purple + '10' : X.bgAlt, cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', transition: 'background-color 180ms, border-color 180ms, transform 180ms', gap: 1, padding: 2 }}>
            <M style={{ fontSize: 10, color: sel === i ? X.purple : X.textSec, fontWeight: 700 }}>{i + 1}</M>
            {assigns[i] && <M style={{ fontSize: 6, color: X.teal }}>{assigns[i]}</M>}
          </button>
        ))}
      </div>
      {sel !== null && (
        <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', animation: `fu 150ms ${ease.o}` }}>
          {sources.map(s => <Btn key={s} small ghost active={assigns[sel] === s} onClick={() => setAssigns({ ...assigns, [sel]: s })} color={X.teal}>{s}</Btn>)}
        </div>
      )}
    </Card>
  );
}

// ── Crosspoint Matrix ─────────────────────────────────────────────────
export function CrosspointMatrix({ title = 'Crosspoint Matrix', size = 4 }: { title?: string; size?: number }) {
  const X = getX();
  const allIns = ['HDMI 1', 'HDMI 2', 'SDI', 'NDI', 'DP 1', 'USB-C'];
  const allOuts = ['Display A', 'Display B', 'Projector', 'Record', 'Stream', 'Aux'];
  const ins = allIns.slice(0, size);
  const outs = allOuts.slice(0, size);
  const [routes, setRoutes] = useState<Record<number, number>>({ 0: 0, 1: 1, 2: 0, 3: 2 });
  return (
    <Card style={{ width: 370 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `60px repeat(${ins.length}, 1fr)`, gap: 2 }}>
        <div />
        {ins.map((inp, i) => <M key={i} style={{ fontSize: 7, color: X.textMut, textAlign: 'center', transform: 'rotate(-35deg)', transformOrigin: 'center', padding: '0 0 4px' }}>{inp}</M>)}
        {outs.map((out, oi) => (
          <div key={`row-${oi}`} style={{ display: 'contents' }}>
            <M style={{ fontSize: 8, color: X.textSec, display: 'flex', alignItems: 'center' }}>{out}</M>
            {ins.map((_, ii) => (
              <button key={`${oi}-${ii}`} onClick={() => setRoutes({ ...routes, [oi]: ii })} style={{
                width: '100%', aspectRatio: '1', borderRadius: X.rs, cursor: 'pointer',
                border: routes[oi] === ii ? `1px solid ${X.teal}40` : `1px solid ${X.borderLight}`,
                background: routes[oi] === ii ? X.teal + '20' : X.bgAlt,
                display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'background-color 150ms, border-color 150ms, transform 150ms',
              }}>
                {routes[oi] === ii && <Dot c={X.teal} s={6} />}
              </button>
            ))}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Signal Flow ───────────────────────────────────────────────────────
export function SignalFlow({ title = 'Signal Flow', source = 'HDMI 1' }: { title?: string; source?: string }) {
  const X = getX();
  const chain = [{ n: 'Source', d: source }, { n: 'Switcher', d: 'DM-NVX' }, { n: 'Scaler', d: 'Processor' }, { n: 'Output', d: 'Projector' }];
  return (
    <Card>
      <Lbl style={{ marginBottom: 8 }}>{title}</Lbl>
      <div style={{ display: 'flex', alignItems: 'center', gap: 0 }}>
        {chain.map((c, i) => (
          <div key={i} style={{ display: 'flex', alignItems: 'center' }}>
            <div style={{ padding: '6px 10px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.border}`, textAlign: 'center' }}>
              <M style={{ fontSize: 9, fontWeight: 600, color: X.text, display: 'block' }}>{c.n}</M>
              <M style={{ fontSize: 7, color: X.textMut }}>{c.d}</M>
            </div>
            {i < chain.length - 1 && <div style={{ width: 16, height: 0, borderTop: `1px dashed ${X.teal}40`, position: 'relative' }}><div style={{ position: 'absolute', right: -2, top: -3, fontSize: 8, color: X.teal }}>›</div></div>}
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Resolution Picker ─────────────────────────────────────────────────
export function ResolutionPicker({ title = 'Resolution', defaultRate = 0 }: { title?: string; defaultRate?: number }) {
  const X = getX();
  const res = ['3840×2160', '2560×1440', '1920×1080', '1280×720', '1024×768', 'Custom'];
  const rates = ['60 Hz', '50 Hz', '30 Hz', '24 Hz'];
  const [selR, setSelR] = useState(0);
  const [selF, setSelF] = useState(defaultRate);
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 8 }}>
        {res.map((r, i) => <Btn key={i} small ghost active={selR === i} onClick={() => setSelR(i)} color={X.purple} style={{ width: '100%', justifyContent: 'flex-start' }}>{r}</Btn>)}
      </div>
      <Lbl style={{ marginBottom: 4 }}>Refresh Rate</Lbl>
      <div style={{ display: 'flex', gap: 2 }}>
        {rates.map((r, i) => <Btn key={i} small ghost active={selF === i} onClick={() => setSelF(i)} color={X.teal}>{r}</Btn>)}
      </div>
    </Card>
  );
}

// ── Aspect Ratio ──────────────────────────────────────────────────────
export function AspectRatio({ title = 'Aspect Ratio', defaultIndex = 0 }: { title?: string; defaultIndex?: number }) {
  const X = getX();
  const ratios = [{ l: '16:9', w: 16, h: 9 }, { l: '4:3', w: 4, h: 3 }, { l: '21:9', w: 21, h: 9 }, { l: '1:1', w: 1, h: 1 }, { l: 'Auto', w: 16, h: 9 }];
  const [sel, setSel] = useState(defaultIndex);
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <div style={{ width: 80, height: 80 * (ratios[sel].h / ratios[sel].w), borderRadius: 4, border: `2px solid ${X.purple}`, background: X.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', transition: `height 300ms ${ease.sp}, border-color 300ms ${ease.sp}, transform 300ms ${ease.sp}` }}>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.purple }}>{ratios[sel].l}</M>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 2, flexWrap: 'wrap', justifyContent: 'center' }}>
        {ratios.map((r, i) => <Btn key={i} small ghost active={sel === i} onClick={() => setSel(i)} color={X.purple}>{r.l}</Btn>)}
      </div>
    </Card>
  );
}

// ── EDID Manager ──────────────────────────────────────────────────────
export function EDIDManager({ title = 'EDID Manager', profileCount = 4 }: { title?: string; profileCount?: number }) {
  const X = getX();
  const allEdids = [{ n: 'Native', r: '3840×2160', s: 'HDMI 2.0' }, { n: 'Clone A', r: '1920×1080', s: 'HDMI 1.4' }, { n: 'Clone B', r: '2560×1440', s: 'DP 1.2' }, { n: 'Custom', r: '3840×2160', s: 'HDMI 2.1' }, { n: 'Backup', r: '1920×1080', s: 'HDMI 2.0' }, { n: 'Legacy', r: '1024×768', s: 'VGA' }];
  const edids = allEdids.slice(0, profileCount);
  const [sel, setSel] = useState(0);
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{profileCount} Profiles</Badge>
      </div>
      {edids.map((e, i) => (
        <button key={i} onClick={() => setSel(i)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', borderRadius: X.rs, border: `1px solid ${sel === i ? X.purple + '30' : 'transparent'}`, background: sel === i ? X.purple + '0c' : 'transparent', cursor: 'pointer', textAlign: 'left', marginBottom: 1, transition: 'background-color 150ms, border-color 150ms, transform 150ms' }}>
          <div style={{ width: 3, height: 18, borderRadius: 2, background: sel === i ? X.purple : X.border }} />
          <div style={{ flex: 1 }}>
            <M style={{ fontSize: 10, fontWeight: 600, color: sel === i ? X.text : X.textSec, display: 'block' }}>{e.n}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{e.r} · {e.s}</M>
          </div>
          {sel === i && <Dot c={X.teal} s={5} />}
        </button>
      ))}
    </Card>
  );
}

// ── Display Orientation ───────────────────────────────────────────────
export function DisplayOrientation({ title = 'Orientation', defaultRotation = 0 }: { title?: string; defaultRotation?: number }) {
  const X = getX();
  const [rot, setRot] = useState(defaultRotation);
  const [flip, setFlip] = useState({ h: false, v: false });
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 10 }}>
        <div style={{ width: 80, height: 50, borderRadius: 4, border: `2px solid ${X.purple}`, background: X.bgAlt, display: 'flex', alignItems: 'center', justifyContent: 'center', transform: `rotate(${rot}deg) scaleX(${flip.h ? -1 : 1}) scaleY(${flip.v ? -1 : 1})`, transition: `transform 400ms ${ease.sp}` }}>
          <M style={{ fontSize: 8, color: X.purple }}>16:9</M>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 3, justifyContent: 'center', marginBottom: 6 }}>
        {[0, 90, 180, 270].map(r => <Btn key={r} small ghost active={rot === r} onClick={() => setRot(r)} color={X.purple}>{r}°</Btn>)}
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
        <Toggle label="Flip H" color={X.indigo} initial={flip.h} />
        <Toggle label="Flip V" color={X.indigo} initial={flip.v} />
      </div>
    </Card>
  );
}

import { Badge } from '../primitives';
