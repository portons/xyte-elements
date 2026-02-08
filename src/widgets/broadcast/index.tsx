import { useState, useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── Stream Health ────────────────────────────────────────────────────
export function StreamHealth({ title = 'Stream Health', bitrateTarget = 8000, bitrate, viewers, frameDrops }: { title?: string; bitrateTarget?: number; bitrate: number; viewers: number; frameDrops: number }) {
  const X = getX();
  const tick = useTick(1000);
  const upH = Math.floor(tick / 3600);
  const upM = Math.floor((tick % 3600) / 60);
  const upS = tick % 60;
  const uptime = `${String(upH).padStart(2, '0')}:${String(upM).padStart(2, '0')}:${String(upS).padStart(2, '0')}`;
  const quality = bitrate > bitrateTarget ? 'Excellent' : bitrate > bitrateTarget * 0.625 ? 'Good' : 'Poor';
  const qc = quality === 'Excellent' ? X.teal : quality === 'Good' ? X.amber : X.red;
  const bitrateHistory = useMemo(() => Array.from({ length: 30 }, () => 7500 + Math.random() * 2000), []);
  const mn = Math.min(...bitrateHistory), mx = Math.max(...bitrateHistory);
  const pts = bitrateHistory.map((v, i) => `${(i / 29) * 100},${100 - ((v - mn) / (mx - mn || 1)) * 80}`).join(' ');
  return (
    <Card glow={X.red} style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={X.red} pulse s={7} />
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        </div>
        <Badge color={qc} solid>{quality}</Badge>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 32, overflow: 'hidden', marginBottom: 8 }}>
        <defs><linearGradient id="sh-g" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor={X.teal} stopOpacity=".2" /><stop offset="100%" stopColor={X.teal} stopOpacity="0" /></linearGradient></defs>
        <polygon points={`0,100 ${pts} 100,100`} fill="url(#sh-g)" />
        <polyline points={pts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 6 }}>
        {([
          ['Bitrate', `${(bitrate / 1000).toFixed(1)} Mbps`, X.teal],
          ['Frame Drops', `${Math.max(0, frameDrops).toFixed(2)}%`, frameDrops > 0.2 ? X.amber : X.teal],
          ['Uptime', uptime, X.purple],
          ['Viewers', Math.round(viewers).toLocaleString(), X.indigo],
        ] as [string, string, string][]).map(([l, v, c], i) => (
          <div key={i} style={{ padding: '5px 6px', borderRadius: X.rs, background: X.bgAlt, animation: `fu 150ms ${ease.o} ${i * 25}ms both` }}>
            <Lbl style={{ marginBottom: 3 }}>{l}</Lbl>
            <M style={{ fontSize: 11, fontWeight: 700, color: c }}>{v}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Encoder Status ───────────────────────────────────────────────────
export function EncoderStatus({ title = 'Encoder Status', cpuWarningThreshold = 80 }: { title?: string; cpuWarningThreshold?: number }) {
  const X = getX();
  const encoders = useMemo(() => [
    { name: 'ENC-01 Main', input: '3840×2160p60', bitrate: '12 Mbps', status: 'encoding' },
    { name: 'ENC-02 Backup', input: '1920×1080p60', bitrate: '8 Mbps', status: 'encoding' },
    { name: 'ENC-03 Web', input: '1280×720p30', bitrate: '4 Mbps', status: 'idle' },
    { name: 'ENC-04 Record', input: '1920×1080p60', bitrate: '15 Mbps', status: 'error' },
  ], []);
  const cpuLoads = [
    72,
    45,
    12,
    0,
  ];
  const sc: Record<string, string> = { encoding: X.teal, idle: X.amber, error: X.red };
  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{encoders.filter(e => e.status === 'encoding').length}/{encoders.length} Active</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        {encoders.map((enc, i) => (
          <div key={i} style={{ padding: '6px 8px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${enc.status === 'error' ? X.red + '25' : X.borderLight}`, animation: `sr 150ms ${ease.o} ${i * 30}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Dot c={sc[enc.status]} pulse={enc.status === 'encoding'} s={5} />
                <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{enc.name}</M>
              </div>
              <M style={{ fontSize: 8, color: sc[enc.status], fontWeight: 600, textTransform: 'uppercase' }}>{enc.status}</M>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 6 }}>
              <M style={{ fontSize: 8, color: X.textMut }}>{enc.input}</M>
              <M style={{ fontSize: 8, color: X.textSec }}>{enc.bitrate}</M>
              <div style={{ flex: 1, maxWidth: 60 }}>
                <Prog value={cpuLoads[i]} color={cpuLoads[i] > cpuWarningThreshold ? X.red : cpuLoads[i] > 50 ? X.amber : X.teal} h={3} />
              </div>
              <M style={{ fontSize: 8, fontWeight: 600, color: X.textMut, minWidth: 28, textAlign: 'right' }}>{Math.round(cpuLoads[i])}%</M>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Multiviewer ──────────────────────────────────────────────────────
export function Multiviewer({ title = 'Multiviewer', columns = 3 }: { title?: string; columns?: number }) {
  const X = getX();
  const [pgm, setPgm] = useState(0);
  const [pvw, setPvw] = useState(1);
  const sources = useMemo(() => [
    { label: 'CAM 1 Wide', color: X.indigo },
    { label: 'CAM 2 Close', color: X.purple },
    { label: 'CAM 3 Stage', color: X.teal },
    { label: 'GFX Overlay', color: X.pink },
    { label: 'VTR Playback', color: X.amber },
    { label: 'NDI Feed', color: X.red },
  ], []);
  return (
    <Card noPad style={{ width: 440 }}>
      <div style={{ padding: '12px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 6 }}>
          <Badge color={X.red} solid>PGM</Badge>
          <Badge color={X.teal}>PVW</Badge>
        </div>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: `repeat(${columns}, 1fr)`, gap: 3, padding: '0 6px 8px' }}>
        {sources.map((src, i) => {
          const tally = i === pgm ? 'program' : i === pvw ? 'preview' : 'off';
          const borderColor = tally === 'program' ? X.red : tally === 'preview' ? X.teal : X.borderLight;
          return (
            <div key={i} onClick={() => { if (i === pgm) return; if (i === pvw) { setPgm(i); setPvw(pgm); } else setPvw(i); }}
              style={{ cursor: 'pointer', borderRadius: X.rs, overflow: 'hidden', border: `2px solid ${borderColor}`, background: X.bgAlt, transition: `border-color 180ms ${ease.mv}` }}>
              <div style={{ height: 48, background: `linear-gradient(135deg, ${src.color}30, ${src.color}10)`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
                <M style={{ fontSize: 9, fontWeight: 600, color: src.color, opacity: 0.7 }}>{src.label}</M>
                {tally === 'program' && <div style={{ position: 'absolute', top: 3, right: 3, width: 6, height: 6, borderRadius: '50%', background: X.red, animation: 'br 2s ease infinite', boxShadow: `0 0 6px ${X.red}60` }} />}
                {tally === 'preview' && <div style={{ position: 'absolute', top: 3, right: 3, width: 6, height: 6, borderRadius: '50%', background: X.teal }} />}
              </div>
              <div style={{ padding: '3px 5px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <M style={{ fontSize: 7, color: X.textMut }}>SRC {i + 1}</M>
                {tally !== 'off' && <M style={{ fontSize: 6, fontWeight: 700, color: tally === 'program' ? X.red : X.teal, textTransform: 'uppercase' }}>{tally === 'program' ? 'PGM' : 'PVW'}</M>}
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Tally Light ──────────────────────────────────────────────────────
export function TallyLight({ title = 'Tally Lights', cameraCount = 8 }: { title?: string; cameraCount?: number }) {
  const X = getX();
  const tick = useTick(4000);
  const cameras = useMemo(() => [
    { num: 1, op: 'J. Smith' },
    { num: 2, op: 'A. Chen' },
    { num: 3, op: 'M. Garcia' },
    { num: 4, op: 'R. Patel' },
    { num: 5, op: 'S. Kim' },
    { num: 6, op: 'D. Wilson' },
    { num: 7, op: 'L. Brown' },
    { num: 8, op: 'K. Davis' },
  ], []);
  const visibleCameras = cameras.slice(0, cameraCount);
  const states = useMemo(() => {
    const s = visibleCameras.map(() => 'off' as 'program' | 'preview' | 'off');
    const pgm = tick % visibleCameras.length;
    const pvw = (tick + 1) % visibleCameras.length;
    s[pgm] = 'program';
    s[pvw] = 'preview';
    return s;
  }, [tick, visibleCameras.length]);
  const sc: Record<string, string> = { program: X.red, preview: X.teal, off: X.borderLight };
  const sl: Record<string, string> = { program: 'PROGRAM', preview: 'PREVIEW', off: 'OFF' };
  return (
    <Card noPad style={{ width: 420 }}>
      <div style={{ padding: '12px 14px 8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red}><Dot c={X.red} pulse s={4} /> On Air</Badge>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 3, padding: '0 6px 8px' }}>
        {visibleCameras.map((cam, i) => {
          const st = states[i];
          const c = sc[st];
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '8px 4px 6px', borderRadius: X.rs, background: st === 'program' ? X.red + '12' : st === 'preview' ? X.teal + '0a' : X.bgAlt, border: `1px solid ${st === 'off' ? X.borderLight : c + '30'}`, transition: `all 300ms ${ease.mv}` }}>
              <div style={{ width: 28, height: 20, borderRadius: 4, background: c, display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 4, boxShadow: st !== 'off' ? `0 0 8px ${c}40` : 'none', transition: `background 300ms ${ease.mv}, box-shadow 300ms ${ease.mv}` }}>
                <M style={{ fontSize: 10, fontWeight: 800, color: st !== 'off' ? '#fff' : X.textMut }}>{cam.num}</M>
              </div>
              <M style={{ fontSize: 6, fontWeight: 700, color: c, letterSpacing: '.05em', marginBottom: 2 }}>{sl[st]}</M>
              <M style={{ fontSize: 7, color: X.textMut }}>{cam.op}</M>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Playout Schedule ─────────────────────────────────────────────────
export function PlayoutSchedule({ title = 'Playout Schedule', maxItems = 6 }: { title?: string; maxItems?: number }) {
  const X = getX();
  const tick = useTick(1000);
  const items = useMemo(() => [
    { title: 'Evening News Open', dur: '00:32', type: 'Graphics', time: '18:00:00' },
    { title: 'Lead Story — Election', dur: '04:15', type: 'Live', time: '18:00:32' },
    { title: 'Package — Economy', dur: '02:48', type: 'VTR', time: '18:04:47' },
    { title: 'Weather Segment', dur: '03:10', type: 'Live', time: '18:07:35' },
    { title: 'Sports Highlights', dur: '02:30', type: 'VTR', time: '18:10:45' },
    { title: 'Closing Credits', dur: '00:25', type: 'Graphics', time: '18:13:15' },
  ], []);
  const currentIdx = tick % items.length === 0 ? 0 : 0;
  const tc: Record<string, string> = { Live: X.red, VTR: X.indigo, Graphics: X.pink };
  return (
    <Card style={{ width: 400 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.red} solid><Dot c="#fff" pulse s={4} /> On Air</Badge>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
        {items.slice(0, maxItems).map((item, i) => {
          const isCurrent = i === currentIdx;
          const isNext = i === currentIdx + 1;
          return (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '5px 8px', borderRadius: X.rs, background: isCurrent ? X.red + '10' : isNext ? X.amber + '08' : 'transparent', border: `1px solid ${isCurrent ? X.red + '25' : isNext ? X.amber + '15' : 'transparent'}`, animation: `sr 120ms ${ease.o} ${i * 20}ms both` }}>
              <div style={{ width: 3, height: 24, borderRadius: 2, background: isCurrent ? X.red : isNext ? X.amber : X.borderLight, flexShrink: 0 }} />
              <M style={{ fontSize: 9, color: X.textMut, fontWeight: 500, minWidth: 50 }}>{item.time}</M>
              <div style={{ flex: 1, minWidth: 0 }}>
                <M style={{ fontSize: 10, fontWeight: 600, color: X.text, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{item.title}</M>
                <M style={{ fontSize: 8, color: X.textMut }}>{item.dur}</M>
              </div>
              <Badge color={tc[item.type]} style={{ flexShrink: 0 }}>{item.type}</Badge>
              {isCurrent && <M style={{ fontSize: 7, fontWeight: 700, color: X.red }}>NOW</M>}
              {isNext && <M style={{ fontSize: 7, fontWeight: 700, color: X.amber }}>NEXT</M>}
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Audio Loudness ───────────────────────────────────────────────────
export function AudioLoudness({ title = 'Audio Loudness', standard = 'EBU R128', intLufs }: { title?: string; standard?: string; intLufs: number }) {
  const X = getX();
  const channels = useMemo(() => [
    { name: 'L', base: -18 },
    { name: 'R', base: -17 },
    { name: 'C', base: -20 },
    { name: 'LFE', base: -24 },
  ], []);
  const levels = [
    -18,
    -17,
    -20,
    -24,
  ];
  const peaks = useMemo(() => [-1.2, -0.8, -2.4, -3.1], []);
  const meterMin = -48;
  const meterMax = 0;
  const toPercent = (v: number) => Math.max(0, Math.min(100, ((v - meterMin) / (meterMax - meterMin)) * 100));
  const barColor = (v: number) => v > -6 ? X.red : v > -14 ? X.amber : X.teal;
  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.indigo}>{standard}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <M style={{ fontSize: 22, fontWeight: 800, color: intLufs > -22 ? X.amber : X.teal }}>{intLufs.toFixed(1)}</M>
        <M style={{ fontSize: 9, color: X.textMut, alignSelf: 'flex-end', marginBottom: 3, marginLeft: 3 }}>LUFS</M>
      </div>
      <div style={{ display: 'flex', gap: 8, alignItems: 'flex-end', height: 80, marginBottom: 6 }}>
        {channels.map((ch, i) => {
          const pct = toPercent(levels[i]);
          const peakPct = toPercent(peaks[i]);
          return (
            <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3 }}>
              <M style={{ fontSize: 8, fontWeight: 600, color: barColor(levels[i]) }}>{levels[i].toFixed(1)}</M>
              <div style={{ width: '100%', height: 60, borderRadius: 3, background: X.bgAlt, position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: `${pct}%`, borderRadius: 3, transition: 'height 80ms linear', background: `linear-gradient(to top, ${X.teal}, ${X.amber} 70%, ${X.red} 95%)` }} />
                <div style={{ position: 'absolute', left: 0, right: 0, height: 2, borderRadius: 1, background: X.pink, bottom: `${peakPct}%`, boxShadow: `0 0 4px ${X.pink}40` }} />
              </div>
              <M style={{ fontSize: 8, fontWeight: 600, color: X.textMut }}>{ch.name}</M>
            </div>
          );
        })}
        <div style={{ width: 1, height: '100%', position: 'relative' }}>
          {[-48, -24, -14, -6, 0].map((db, i) => (
            <div key={i} style={{ position: 'absolute', bottom: `${toPercent(db)}%`, right: 4, transform: 'translateY(50%)' }}>
              <M style={{ fontSize: 6, color: X.textMut }}>{db}</M>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Integrated</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.teal }}>{intLufs.toFixed(1)} LUFS</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>True Peak</Lbl><M style={{ fontSize: 9, fontWeight: 600, color: X.amber }}>−0.8 dBTP</M></div>
      </div>
    </Card>
  );
}

// ── Caption Monitor ──────────────────────────────────────────────────
export function CaptionMonitor({ title = 'Caption Monitor', language = 'EN-US', wpm, delay, accuracy }: { title?: string; language?: string; wpm: number; delay: number; accuracy: number }) {
  const X = getX();
  const tick = useTick(3000);
  const captions = useMemo(() => [
    'The economic forecast for the quarter shows significant growth across all major sectors.',
    'Meanwhile, international markets continue to respond positively to the new trade agreement.',
    'In sports, the championship finals are set to begin this weekend with record attendance expected.',
    'Weather conditions are expected to improve through the end of the week with clearing skies.',
    'Breaking news — a major infrastructure bill has just been signed into law.',
  ], []);
  const currentCaption = captions[tick % captions.length];
  const animatedAcc = useAnim(accuracy, 800);
  return (
    <Card style={{ width: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={X.teal} pulse s={6} />
          <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        </div>
        <Badge color={X.indigo}>{language}</Badge>
      </div>
      <div style={{ padding: '10px 12px', borderRadius: X.rs, background: X.bgAlt, border: `1px solid ${X.borderLight}`, marginBottom: 10, minHeight: 40, display: 'flex', alignItems: 'center' }}>
        <M style={{ fontSize: 12, color: X.text, lineHeight: 1.5, fontWeight: 500 }}>{currentCaption}</M>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 6 }}>
        {([
          ['WPM', Math.round(wpm).toString(), wpm > 180 ? X.amber : X.teal],
          ['Delay', `${delay.toFixed(1)}s`, delay > 2 ? X.red : delay > 1.5 ? X.amber : X.teal],
          ['Accuracy', `${animatedAcc.toFixed(1)}%`, accuracy > 96 ? X.teal : accuracy > 90 ? X.amber : X.red],
        ] as [string, string, string][]).map(([l, v, c], i) => (
          <div key={i} style={{ padding: '5px 6px', borderRadius: X.rs, background: X.bgAlt, textAlign: 'center', animation: `fu 150ms ${ease.o} ${i * 25}ms both` }}>
            <Lbl style={{ marginBottom: 3 }}>{l}</Lbl>
            <M style={{ fontSize: 12, fontWeight: 700, color: c }}>{v}</M>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 8, padding: '4px 0' }}>
        <M style={{ fontSize: 8, color: X.textMut }}>CEA-608 / 708 Compliant</M>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.teal} s={4} />
          <M style={{ fontSize: 8, color: X.teal, fontWeight: 600 }}>Live</M>
        </div>
      </div>
    </Card>
  );
}
