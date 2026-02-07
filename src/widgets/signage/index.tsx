import { useState, useEffect } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

// ── Playlist Manager ─────────────────────────────────────────────────
export function PlaylistManager({ title = 'Playlist', maxItems = 5 }: { title?: string; maxItems?: number }) {
  const X = getX();
  const [active, setActive] = useState(0);
  const items = [
    { title: 'Welcome Video', duration: '0:30', type: 'video', color: X.purple },
    { title: 'Promo Banner', duration: '0:10', type: 'image', color: X.teal },
    { title: 'Live Dashboard', duration: '1:00', type: 'html', color: X.amber },
    { title: 'Product Showcase', duration: '0:45', type: 'video', color: X.purple },
    { title: 'Social Feed', duration: '0:20', type: 'html', color: X.amber },
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal} solid>{items.slice(0, maxItems).length} Items</Badge>
      </div>
      {items.slice(0, maxItems).map((item, i) => (
        <button key={i} onClick={() => setActive(i)} style={{
          width: '100%', display: 'flex', alignItems: 'center', gap: 8, padding: '7px 8px',
          borderRadius: X.rs, border: `1px solid ${active === i ? X.purple + '30' : 'transparent'}`,
          background: active === i ? X.purple + '0c' : 'transparent', cursor: 'pointer',
          marginBottom: 1, transition: 'background-color 180ms, border-color 180ms',
          animation: `sr 150ms ${ease.o} ${i * 25}ms both`,
        }}>
          {/* Drag handle */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 1.5, opacity: 0.3 }}>
            {[0, 1, 2].map(j => <div key={j} style={{ display: 'flex', gap: 1.5 }}><div style={{ width: 2, height: 2, borderRadius: 1, background: X.textMut }} /><div style={{ width: 2, height: 2, borderRadius: 1, background: X.textMut }} /></div>)}
          </div>
          <div style={{ width: 3, height: 24, borderRadius: 2, background: active === i ? X.purple : X.border, flexShrink: 0, transition: 'background 200ms' }} />
          <div style={{ flex: 1, textAlign: 'left' }}>
            <M style={{ fontSize: 10, fontWeight: 600, color: active === i ? X.text : X.textSec, display: 'block' }}>{item.title}</M>
            <M style={{ fontSize: 8, color: X.textMut }}>{item.duration}</M>
          </div>
          <Badge color={item.color} style={{ fontSize: 7 }}>{item.type}</Badge>
          {active === i && <Dot c={X.teal} pulse s={5} />}
        </button>
      ))}
    </Card>
  );
}

// ── Content Preview ──────────────────────────────────────────────────
export function ContentPreview({ title = 'Content Preview', resolution = '1920x1080' }: { title?: string; resolution?: string }) {
  const X = getX();
  const [published, setPublished] = useState(true);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ fontSize: 13, fontWeight: 700, color: X.text, marginBottom: 10 }}>{title}</div>
      {/* Thumbnail placeholder */}
      <div style={{
        width: '100%', height: 100, borderRadius: X.rs,
        background: `linear-gradient(135deg, ${X.purple}40, ${X.pink}30, ${X.indigo}40)`,
        marginBottom: 10, display: 'flex', alignItems: 'center', justifyContent: 'center',
        border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 20, color: X.textMut, opacity: 0.6 }}>&#9654;</M>
      </div>
      <div style={{ marginBottom: 8 }}>
        <M style={{ fontSize: 12, fontWeight: 700, color: X.text, display: 'block', marginBottom: 2 }}>Welcome Promo 2026</M>
        <M style={{ fontSize: 8, color: X.textMut }}>Last edited 2h ago</M>
      </div>
      {([['Resolution', resolution], ['Duration', '0:30'], ['Format', 'MP4 / H.264'], ['Size', '24.8 MB']] as [string, string][]).map(([l, v], i) => (
        <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 0', borderBottom: i < 3 ? `1px solid ${X.borderLight}` : 'none' }}>
          <M style={{ fontSize: 9, color: X.textMut }}>{l}</M>
          <M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>{v}</M>
        </div>
      ))}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
        <Lbl>Status</Lbl>
        <Btn small ghost active={published} onClick={() => setPublished(!published)} color={published ? X.teal : X.textMut}>
          <Dot c={published ? X.teal : X.textMut} s={5} />
          {published ? 'Published' : 'Draft'}
        </Btn>
      </div>
    </Card>
  );
}

// ── Screen Zoning ────────────────────────────────────────────────────
export function ScreenZoning({ title = 'Screen Zones', aspectRatio = '16:9' }: { title?: string; aspectRatio?: string }) {
  const X = getX();
  const [selected, setSelected] = useState(0);
  const zones = [
    { name: 'Main Content', color: X.purple, content: 'Video Feed' },
    { name: 'Ticker', color: X.teal, content: 'News Scroll' },
    { name: 'Logo', color: X.amber, content: 'Brand Logo' },
    { name: 'Widget', color: X.indigo, content: 'Weather' },
  ];

  // 2x2 grid layout positions
  const positions: { x: number; y: number; w: number; h: number }[] = [
    { x: 0, y: 0, w: 60, h: 65 },   // Main (larger)
    { x: 0, y: 65, w: 100, h: 35 },  // Ticker (full bottom strip)
    { x: 60, y: 0, w: 40, h: 32 },   // Logo (top right)
    { x: 60, y: 32, w: 40, h: 33 },  // Widget (mid right)
  ];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{zones.length} Zones</Badge>
      </div>
      {/* Zone layout visualization */}
      <div style={{ position: 'relative', width: '100%', paddingBottom: aspectRatio === '4:3' ? '75%' : aspectRatio === '21:9' ? '42.86%' : '56.25%', borderRadius: X.rs, overflow: 'hidden', border: `1px solid ${X.border}`, marginBottom: 10, background: X.bgAlt }}>
        {zones.map((z, i) => (
          <div key={i} onClick={() => setSelected(i)} style={{
            position: 'absolute',
            left: `${positions[i].x}%`, top: `${positions[i].y}%`,
            width: `${positions[i].w}%`, height: `${positions[i].h}%`,
            background: selected === i ? z.color + '25' : z.color + '10',
            border: `1px solid ${selected === i ? z.color : z.color + '40'}`,
            cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
            transition: 'background-color 180ms, border-color 180ms',
            boxSizing: 'border-box',
          }}>
            <M style={{ fontSize: 7, fontWeight: 600, color: z.color }}>{z.name}</M>
            <M style={{ fontSize: 6, color: X.textMut }}>{z.content}</M>
          </div>
        ))}
      </div>
      <div style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}` }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 2 }}>
          <M style={{ fontSize: 9, fontWeight: 600, color: zones[selected].color }}>{zones[selected].name}</M>
          <Btn small ghost color={X.purple} onClick={() => {}}>Assign</Btn>
        </div>
        <M style={{ fontSize: 8, color: X.textMut }}>Content: {zones[selected].content}</M>
      </div>
    </Card>
  );
}

// ── Schedule Calendar ────────────────────────────────────────────────
export function ScheduleCalendar({ title = 'Weekly Schedule', view = 'week' }: { title?: string; view?: 'week' | 'day' | 'month' }) {
  const X = getX();
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const hours = ['06', '09', '12', '15', '18', '21'];
  type Block = { start: number; span: number; label: string; color: string };
  const schedule: Block[][] = [
    [{ start: 0, span: 2, label: 'Morning', color: X.teal }, { start: 2, span: 3, label: 'Promo', color: X.purple }, { start: 5, span: 1, label: 'Night', color: X.indigo }],
    [{ start: 0, span: 2, label: 'Morning', color: X.teal }, { start: 2, span: 3, label: 'Promo', color: X.purple }, { start: 5, span: 1, label: 'Night', color: X.indigo }],
    [{ start: 0, span: 2, label: 'Morning', color: X.teal }, { start: 2, span: 2, label: 'Sale', color: X.red }, { start: 4, span: 1, label: 'Promo', color: X.purple }, { start: 5, span: 1, label: 'Night', color: X.indigo }],
    [{ start: 0, span: 2, label: 'Morning', color: X.teal }, { start: 2, span: 3, label: 'Promo', color: X.purple }, { start: 5, span: 1, label: 'Night', color: X.indigo }],
    [{ start: 0, span: 2, label: 'Morning', color: X.teal }, { start: 2, span: 3, label: 'Sale', color: X.red }, { start: 5, span: 1, label: 'Night', color: X.indigo }],
    [{ start: 0, span: 3, label: 'Weekend', color: X.amber }, { start: 3, span: 3, label: 'Night', color: X.indigo }],
    [{ start: 0, span: 3, label: 'Weekend', color: X.amber }, { start: 3, span: 3, label: 'Night', color: X.indigo }],
  ];

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>This Week</Badge>
      </div>
      {/* Time axis */}
      <div style={{ display: 'grid', gridTemplateColumns: '28px repeat(6, 1fr)', gap: 1, marginBottom: 2 }}>
        <div />
        {hours.map(h => <M key={h} style={{ fontSize: 7, color: X.textMut, textAlign: 'center' }}>{h}:00</M>)}
      </div>
      {/* Day rows */}
      {days.map((day, di) => (
        <div key={di} style={{ display: 'flex', alignItems: 'center', gap: 2, marginBottom: 2 }}>
          <M style={{ fontSize: 7, color: X.textMut, width: 24, flexShrink: 0 }}>{day}</M>
          <div style={{ flex: 1, display: 'flex', height: 16, borderRadius: 3, overflow: 'hidden', gap: 1 }}>
            {schedule[di].map((block, bi) => (
              <div key={bi} style={{
                flex: block.span, background: block.color + '25',
                borderLeft: `2px solid ${block.color}`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                borderRadius: 2,
              }}>
                <M style={{ fontSize: 6, color: block.color, fontWeight: 600 }}>{block.label}</M>
              </div>
            ))}
          </div>
        </div>
      ))}
      {/* Legend */}
      <div style={{ display: 'flex', gap: 8, marginTop: 8, flexWrap: 'wrap' }}>
        {[['Promo', X.purple], ['Sale', X.red], ['Morning', X.teal], ['Weekend', X.amber], ['Night', X.indigo]].map(([l, c]) => (
          <div key={l} style={{ display: 'flex', alignItems: 'center', gap: 3 }}><Dot c={c as string} s={4} /><M style={{ fontSize: 7, color: X.textMut }}>{l}</M></div>
        ))}
      </div>
    </Card>
  );
}

// ── Proof of Play ────────────────────────────────────────────────────
export function ProofOfPlay({ title = 'Proof of Play', period = 'Today' }: { title?: string; period?: string }) {
  const X = getX();
  const plays = useLive(1842, 50, 5000);
  const impressions = useLive(24300, 800, 6000);
  const completion = useLive(94.2, 2, 4000);
  const [hourly] = useState(() => Array.from({ length: 12 }, () => 40 + Math.random() * 120));
  const mx = Math.max(...hourly, 1);
  const labels = ['6a', '8a', '10a', '12p', '2p', '4p', '6p', '8p', '10p', '12a', '2a', '4a'];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{period}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Plays</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.text }}>{Math.round(plays).toLocaleString()}</M></div>
        <div><Lbl style={{ marginBottom: 2 }}>Impressions</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.textSec }}>{Math.round(impressions / 1000).toFixed(1)}k</M></div>
        <div><Lbl style={{ marginBottom: 2 }}>Completion</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.teal }}>{completion.toFixed(0)}%</M></div>
      </div>
      <Lbl style={{ marginBottom: 4 }}>Plays / Hour</Lbl>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 36 }}>
        {hourly.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <div style={{ width: '100%', height: `${(v / mx) * 100}%`, background: X.purple, borderRadius: 2, opacity: 0.3 + (v / mx) * 0.7, transition: 'height 300ms', minHeight: 2 }} />
            <M style={{ fontSize: 5, color: X.textMut }}>{labels[i]}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Brightness Schedule ──────────────────────────────────────────────
export function BrightnessSchedule({ title = 'Brightness', maxBrightness = 100 }: { title?: string; maxBrightness?: number }) {
  const X = getX();
  const [mode, setMode] = useState<'day' | 'night' | 'custom'>('custom');
  const currentBrightness = useLive(75, 5, 3000);

  // Brightness curve: 24 points, 0-100%
  const curve = Array.from({ length: 24 }, (_, h) => {
    if (mode === 'day') return 100;
    if (mode === 'night') return 30;
    // Custom: low at night, ramp up in morning, peak midday, taper evening
    if (h < 6) return 20;
    if (h < 9) return 20 + ((h - 6) / 3) * 60;
    if (h < 17) return 85 + Math.sin(((h - 9) / 8) * Math.PI) * 15;
    if (h < 21) return 85 - ((h - 17) / 4) * 55;
    return 25;
  });

  const mx = 100;
  const pts = curve.map((v, i) => `${(i / 23) * 100},${100 - (v / mx) * 85}`).join(' ');

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <M style={{ fontSize: 14, fontWeight: 800, color: X.amber }}>{Math.round(currentBrightness)}%</M>
      </div>
      <div style={{ display: 'flex', gap: 4, marginBottom: 10 }}>
        {(['day', 'night', 'custom'] as const).map(m => (
          <Btn key={m} small ghost active={mode === m} onClick={() => setMode(m)} color={m === 'day' ? X.amber : m === 'night' ? X.indigo : X.purple}>{m}</Btn>
        ))}
      </div>
      <Lbl style={{ marginBottom: 4 }}>Brightness Curve (24h)</Lbl>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 44, overflow: 'hidden', marginBottom: 6 }}>
        <defs>
          <linearGradient id="br-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={X.amber} stopOpacity=".2" />
            <stop offset="100%" stopColor={X.amber} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${pts} 100,100`} fill="url(#br-g)" />
        <polyline points={pts} fill="none" stroke={X.amber} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
        {/* Day/night separator lines */}
        <line x1={25} y1="0" x2={25} y2="100" stroke={X.borderLight} strokeWidth=".5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
        <line x1={75} y1="0" x2={75} y2="100" stroke={X.borderLight} strokeWidth=".5" strokeDasharray="2 2" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <M style={{ fontSize: 7, color: X.textMut }}>00:00</M>
        <M style={{ fontSize: 7, color: X.textMut }}>06:00</M>
        <M style={{ fontSize: 7, color: X.textMut }}>12:00</M>
        <M style={{ fontSize: 7, color: X.textMut }}>18:00</M>
        <M style={{ fontSize: 7, color: X.textMut }}>24:00</M>
      </div>
    </Card>
  );
}
