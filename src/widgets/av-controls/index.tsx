import { useState, useEffect, useRef, useCallback } from 'react';
import { getX, ease, Card, Badge, Btn, Slider, Lbl, M, Dot } from '../primitives';

// ── PTZ Control ───────────────────────────────────────────────────────
export function PTZControl({ title = 'PTZ Camera', cameraModel = 'PTZ Optics 30X' }: {
  title?: string; cameraModel?: string;
}) {
  const X = getX();
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [drag, setDrag] = useState(false);
  const [zoom, setZoom] = useState(50);
  const [focus, setFocus] = useState(75);
  const [iris, setIris] = useState(60);
  const [preset, setPreset] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const sz = 110;
  const onMove = useCallback((e: MouseEvent | React.MouseEvent) => {
    if (!ref.current) return;
    const r = ref.current.getBoundingClientRect();
    const cx = (e.clientX ?? 0) - r.left - r.width / 2;
    const cy = (e.clientY ?? 0) - r.top - r.height / 2;
    let dx = cx / (sz / 2), dy = cy / (sz / 2);
    const d = Math.hypot(dx, dy); if (d > 1) { dx /= d; dy /= d; }
    setPos({ x: dx, y: dy });
  }, []);
  useEffect(() => {
    if (!drag) return;
    const up = () => { setDrag(false); setPos({ x: 0, y: 0 }); };
    const mv = (e: MouseEvent) => onMove(e);
    window.addEventListener('mouseup', up); window.addEventListener('mousemove', mv);
    return () => { window.removeEventListener('mouseup', up); window.removeEventListener('mousemove', mv); };
  }, [drag, onMove]);

  return (
    <Card style={{ width: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12 }}>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div><M style={{ fontSize: 9, color: X.textSec }}>{cameraModel} · Preset {preset + 1}</M></div>
        <Badge color={X.teal} solid><Dot c="#fff" pulse s={4} />Live</Badge>
      </div>
      <div style={{ display: 'flex', gap: 14 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div ref={ref} onMouseDown={e => { setDrag(true); onMove(e); }} style={{ width: sz, height: sz, borderRadius: '50%', background: X.bgAlt, border: `1px solid ${drag ? X.purple + '50' : X.border}`, position: 'relative', cursor: 'grab', touchAction: 'none', transition: 'border-color 200ms' }}>
            <div style={{ position: 'absolute', top: '50%', left: 10, right: 10, height: 1, background: X.border }} />
            <div style={{ position: 'absolute', left: '50%', top: 10, bottom: 10, width: 1, background: X.border }} />
            <div style={{
              position: 'absolute', width: 22, height: 22, borderRadius: '50%',
              background: X.surface, border: `2px solid ${drag ? X.purple : X.border}`,
              left: `calc(50% + ${pos.x * (sz / 2 - 14)}px - 11px)`,
              top: `calc(50% + ${pos.y * (sz / 2 - 14)}px - 11px)`,
              transition: drag ? 'none' : `all 300ms ${ease.sp}`,
              boxShadow: drag ? `0 0 12px ${X.purple}30` : X.sh,
            }}>
              <div style={{ position: 'absolute', inset: 5, borderRadius: '50%', background: drag ? X.purple : X.textMut, transition: 'background 200ms' }} />
            </div>
          </div>
          <M style={{ fontSize: 8, color: X.textMut }}>P:{(pos.x * 180).toFixed(0)}° T:{(pos.y * -90).toFixed(0)}°</M>
        </div>
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Slider value={zoom} onChange={setZoom} label="Zoom" unit="%" color={X.purple} />
          <Slider value={focus} onChange={setFocus} label="Focus" unit="%" color={X.indigo} />
          <Slider value={iris} onChange={setIris} label="Iris" unit="%" color={X.teal} />
          <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', marginTop: 2 }}>
            {['Wide', 'Stage', 'Podium', 'Close'].map((p, i) => <Btn key={i} small ghost active={preset === i} onClick={() => setPreset(i)} color={X.purple}>{p}</Btn>)}
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Audio Mixer ───────────────────────────────────────────────────────
function Strip({ name = 'Mic 1', color }: { name?: string; color?: string }) {
  const X = getX();
  const c = color ?? X.purple;
  const [vol, setVol] = useState(65 + Math.random() * 20);
  const [muted, setMuted] = useState(false);
  const [lev, setLev] = useState(50);
  useEffect(() => { const i = setInterval(() => { setLev(muted ? 0 : Math.max(0, Math.min(100, vol + (Math.random() - 0.45) * 35))); }, 70); return () => clearInterval(i); }, [vol, muted]);
  const db = Math.round((vol / 100) * 48 - 48);
  return (
    <div style={{ width: 46, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 0, padding: '8px 3px 6px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
      <M style={{ fontSize: 7, color: X.textMut, marginBottom: 4 }}>{name}</M>
      <div style={{ display: 'flex', gap: 2, height: 64, marginBottom: 4 }}>
        <div style={{ width: 4, height: '100%', borderRadius: 2, background: X.borderLight, overflow: 'hidden', display: 'flex', flexDirection: 'column-reverse' }}>
          <div style={{ width: '100%', borderRadius: 2, height: `${lev}%`, transition: 'height 60ms', background: lev > 90 ? X.red : lev > 72 ? X.amber : c }} />
        </div>
        <div style={{ width: 6, height: '100%', borderRadius: 2, background: X.borderLight, position: 'relative', cursor: 'pointer' }}
          onClick={e => { const r = e.currentTarget.getBoundingClientRect(); setVol(Math.max(0, Math.min(100, 100 - ((e.clientY - r.top) / r.height) * 100))); }}>
          <div style={{ position: 'absolute', bottom: 0, width: '100%', height: `${vol}%`, borderRadius: 2, background: c + '18' }} />
          <div style={{ position: 'absolute', width: 14, height: 5, borderRadius: 2, background: muted ? X.textMut : c, left: -4, bottom: `calc(${vol}% - 2px)`, transition: 'bottom 60ms', boxShadow: `0 0 4px ${c}30` }} />
        </div>
      </div>
      <M style={{ fontSize: 10, fontWeight: 700, color: muted ? X.textMut : X.text, marginBottom: 3 }}>{muted ? '—' : db > 0 ? `+${db}` : db}</M>
      <button onClick={() => setMuted(!muted)} style={{ width: 20, height: 14, borderRadius: 3, border: 'none', background: muted ? X.red : X.borderLight, color: muted ? '#fff' : X.textMut, fontFamily: X.m, fontSize: 7, fontWeight: 700, cursor: 'pointer' }}>M</button>
    </div>
  );
}

export function Mixer({ title = 'Audio Mixer', channels = 8 }: {
  title?: string; channels?: number;
}) {
  const X = getX();
  const allChs = [{ n: 'Mic 1', c: X.purple }, { n: 'Mic 2', c: X.purple }, { n: 'Line L', c: X.indigo }, { n: 'Line R', c: X.indigo }, { n: 'PC', c: X.teal }, { n: 'BT', c: X.amber }, { n: 'HDMI', c: X.pink }, { n: 'Main', c: X.tealLight }];
  const chs = allChs.slice(0, channels);
  return (
    <Card noPad style={{ display: 'inline-flex', flexDirection: 'column' }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between' }}>
        <div><div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div><M style={{ fontSize: 9, color: X.textSec }}>QSC Core 110f · {channels}ch</M></div>
        <Badge color={X.teal}><Dot c={X.teal} pulse s={4} />DSP</Badge>
      </div>
      <div style={{ display: 'flex', gap: 2, padding: '2px 6px 8px' }}>{chs.map((ch, i) => <Strip key={i} name={ch.n} color={ch.c} />)}</div>
    </Card>
  );
}

// ── Quick Controls ────────────────────────────────────────────────────
export function QuickControls({ title = 'Quick Controls', columns = 3 }: {
  title?: string; columns?: number;
}) {
  const X = getX();
  const items: [string, string, string][] = [['⏻', 'Power', X.teal], ['🔇', 'Mute', X.pink], ['📺', 'Blank', X.indigo], ['🔒', 'Lock', X.amber], ['📡', 'Stream', X.purple], ['💡', 'Lights', X.amber], ['🔊', 'Vol+', X.teal], ['🔈', 'Vol−', X.teal], ['⟳', 'Reset', X.red]];
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 4 }}>
        {items.map(([icon, label, color], i) => {
          const [on, setOn] = useState(false);
          return (
            <button key={i} onClick={() => setOn(!on)} style={{
              padding: '10px 4px', borderRadius: X.rs, border: `1px solid ${on ? color + '30' : X.borderLight}`,
              background: on ? color + '12' : X.bgAlt, cursor: 'pointer', display: 'flex', flexDirection: 'column',
              alignItems: 'center', gap: 3, transition: 'background-color 180ms, border-color 180ms, color 180ms, transform 180ms',
            }}>
              <span style={{ fontSize: 16, filter: on ? 'none' : 'grayscale(1) opacity(.4)' }}>{icon}</span>
              <M style={{ fontSize: 7, color: on ? color : X.textMut, fontWeight: 600 }}>{label}</M>
            </button>
          );
        })}
      </div>
    </Card>
  );
}

// ── Input Selector ────────────────────────────────────────────────────
export function InputSelector({ title = 'Input Source', defaultInput = 'hdmi1' }: {
  title?: string; defaultInput?: string;
}) {
  const X = getX();
  const inputs = [
    { id: 'hdmi1', l: 'HDMI 1', sig: true, res: '3840×2160p60', st: 95 },
    { id: 'hdmi2', l: 'HDMI 2', sig: true, res: '1920×1080p60', st: 72 },
    { id: 'dp', l: 'DisplayPort', sig: false, st: 0 },
    { id: 'sdi', l: 'SDI', sig: true, res: '1080i59.94', st: 88 },
    { id: 'ndi', l: 'NDI', sig: true, res: '1080p30', st: 60 },
    { id: 'usbc', l: 'USB-C', sig: false, st: 0 },
  ];
  const [active, setActive] = useState(defaultInput);
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {inputs.map((inp, i) => (
          <button key={inp.id} onClick={() => inp.sig && setActive(inp.id)} style={{
            width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
            borderRadius: X.rs, border: `1px solid ${active === inp.id ? X.purple + '30' : 'transparent'}`,
            background: active === inp.id ? X.purple + '0c' : 'transparent',
            cursor: inp.sig ? 'pointer' : 'default', textAlign: 'left', transition: 'background-color 150ms, border-color 150ms, transform 150ms',
            opacity: inp.sig ? 1 : 0.4, animation: `sr 180ms ${ease.o} ${i * 25}ms both`,
          }}>
            <div style={{ width: 4, height: 20, borderRadius: 2, background: active === inp.id ? X.purple : inp.sig ? X.teal + '30' : X.border }} />
            <div style={{ flex: 1 }}>
              <M style={{ fontSize: 10, fontWeight: 600, color: active === inp.id ? X.purple : X.text, display: 'block' }}>{inp.l}</M>
              {inp.sig ? <M style={{ fontSize: 8, color: X.textMut }}>{inp.res}</M> : <M style={{ fontSize: 8, color: X.textMut }}>No signal</M>}
            </div>
            {inp.sig && <div style={{ width: 24 }}><Prog value={inp.st} color={inp.st > 80 ? X.teal : inp.st > 50 ? X.amber : X.red} h={2} /></div>}
          </button>
        ))}
      </div>
    </Card>
  );
}

// ── Display Adjust ────────────────────────────────────────────────────
export function DisplayAdjust({ title = 'Display Adjust', brightness = 75 }: {
  title?: string; brightness?: number;
}) {
  const X = getX();
  const [bright, setBright] = useState(brightness);
  const [contrast, setContrast] = useState(50);
  const [sat, setSat] = useState(60);
  const [sharp, setSharp] = useState(40);
  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
        <Slider value={bright} onChange={setBright} label="Brightness" unit="%" color={X.amber} />
        <Slider value={contrast} onChange={setContrast} label="Contrast" unit="%" color={X.purple} />
        <Slider value={sat} onChange={setSat} label="Saturation" unit="%" color={X.pink} />
        <Slider value={sharp} onChange={setSharp} label="Sharpness" unit="%" color={X.teal} />
      </div>
    </Card>
  );
}

// ── Color Temperature ─────────────────────────────────────────────────
export function ColorTemp({ title = 'Color Temperature', defaultTemp = 6500 }: {
  title?: string; defaultTemp?: number;
}) {
  const X = getX();
  const [temp, setTemp] = useState(defaultTemp);
  const c = temp < 4000 ? '#ffb347' : temp > 8000 ? '#a0c4ff' : '#ffffff';
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 11, fontWeight: 700, color: c }}>{temp}K</M>
      </div>
      <div style={{ height: 4, borderRadius: 2, background: 'linear-gradient(90deg, #ff8c00, #ffecb3, #ffffff, #a0c4ff, #6090ff)', marginBottom: 8 }} />
      <Slider value={temp} onChange={setTemp} min={2700} max={10000} color={X.purple} />
      <div style={{ display: 'flex', gap: 3, marginTop: 6 }}>
        {([['Warm', 3200], ['Neutral', 5600], ['Daylight', 6500], ['Cool', 9300]] as [string, number][]).map(([l, v]) => <Btn key={l} small ghost active={temp === v} onClick={() => setTemp(v)}>{l}</Btn>)}
      </div>
    </Card>
  );
}

// ── Toggle ────────────────────────────────────────────────────────────
export function Toggle({ label, color, initial = false }: { label?: string; color?: string; initial?: boolean }) {
  const X = getX();
  const c = color ?? X.purple;
  const [on, setOn] = useState(initial);
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 7 }}>
      <button onClick={() => setOn(!on)} style={{ width: 36, height: 20, borderRadius: 10, border: 'none', cursor: 'pointer', background: on ? c : X.borderLight, transition: `background 180ms ${ease.mv}`, position: 'relative', padding: 0 }}>
        <div style={{ width: 14, height: 14, borderRadius: '50%', background: '#fff', position: 'absolute', top: 3, left: on ? 19 : 3, transition: `left 180ms ${ease.sp}`, boxShadow: '0 1px 3px #0003' }} />
      </button>
      <span style={{ fontSize: 11, color: on ? X.text : X.textMut, fontWeight: 500 }}>{label}</span>
    </div>
  );
}

// ── Command Button ────────────────────────────────────────────────────
export function CmdBtn({ label = 'Reboot', color }: { label?: string; color?: string }) {
  const X = getX();
  const c = color ?? X.purple;
  const [st, setSt] = useState<'idle' | 'load' | 'done'>('idle');
  const click = () => { if (st !== 'idle') return; setSt('load'); setTimeout(() => { setSt('done'); setTimeout(() => setSt('idle'), 1200); }, 900); };
  return (
    <Btn onClick={click} color={st === 'idle' ? c : st === 'done' ? X.teal : X.borderLight} disabled={st === 'load'}>
      {st === 'load' ? <span style={{ display: 'inline-block', animation: 'sp .7s linear infinite' }}>⟳</span> : st === 'done' ? '✓' : label}
    </Btn>
  );
}

// Need Prog import for InputSelector
import { Prog } from '../primitives';
