import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

function neo() {
  const X = getX();
  const dark = X.bg + '40';
  const light = '#ffffff12';
  return {
    raised: '4px 4px 10px ' + dark + ', -2px -2px 6px ' + light,
    concave: 'inset 3px 3px 8px ' + dark + ', inset -2px -2px 5px ' + light,
    bezel: 'inset 0 1px 0 ' + light + ', inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ' + dark,
    metal: 'linear-gradient(135deg, ' + X.surface + ', ' + X.bgAlt + ' 40%, ' + X.surface + ' 60%, ' + X.bgAlt + ')',
  };
}

// ── Vacuum Tube Amplifier ────────────────────────────────────────────
export function VacuumTubeAmp({ title = 'Tube Amplifier', tubes = 4 }: { title?: string; tubes?: number } = {}) {
  const X = getX();
  const n = neo();
  const tubeTemps = Array.from({ length: tubes }, (_, i) => useLive(320 + i * 15, 20, 1800 + i * 200));
  const powerOut = useLive(42, 3, 2000);
  const warmup = useLive(96, 2, 3000);

  const warmupPct = Math.min(100, Math.max(0, warmup));
  const status = warmupPct > 90 ? 'Operating' : warmupPct > 50 ? 'Warming Up' : 'Cold';
  const statusColor = warmupPct > 90 ? X.teal : warmupPct > 50 ? X.amber : X.textMut;

  return (
    <Card style={{ width: 350 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{status}</Badge>
      </div>

      {/* Tube chassis panel */}
      <div style={{
        padding: 16, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12, position: 'relative',
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-around', alignItems: 'flex-end' }}>
          {tubeTemps.map((temp, i) => {
            const heat = Math.min(1, Math.max(0, (temp - 250) / 150));
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                <svg width="48" height="80" viewBox="0 0 48 80" style={{ display: 'block' }}>
                  <defs>
                    <linearGradient id={`hifi-tube-glass-${i}`} x1="0" y1="0" x2="1" y2="0">
                      <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
                      <stop offset="40%" stopColor="#ffffff" stopOpacity="0.03" />
                      <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
                    </linearGradient>
                    <radialGradient id={`hifi-tube-glow-core-${i}`} cx="0.5" cy="0.55" r="0.2">
                      <stop offset="0%" stopColor="#ff8c00" stopOpacity={0.9 * heat} />
                      <stop offset="100%" stopColor="#ff8c00" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id={`hifi-tube-glow-mid-${i}`} cx="0.5" cy="0.55" r="0.35">
                      <stop offset="0%" stopColor="#ff6600" stopOpacity={0.25 * heat} />
                      <stop offset="100%" stopColor="#ff6600" stopOpacity="0" />
                    </radialGradient>
                    <radialGradient id={`hifi-tube-glow-ambient-${i}`} cx="0.5" cy="0.55" r="0.5">
                      <stop offset="0%" stopColor="#ff4400" stopOpacity={0.08 * heat} />
                      <stop offset="100%" stopColor="#ff4400" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  {/* Glass envelope */}
                  <rect x="10" y="6" width="28" height="50" rx="10" ry="10"
                    fill={`url(#hifi-tube-glass-${i})`}
                    stroke={X.borderLight} strokeWidth="0.8" />
                  {/* Ambient glow */}
                  <rect x="10" y="6" width="28" height="50" rx="10" ry="10"
                    fill={`url(#hifi-tube-glow-ambient-${i})`} />
                  {/* Mid glow */}
                  <rect x="10" y="6" width="28" height="50" rx="10" ry="10"
                    fill={`url(#hifi-tube-glow-mid-${i})`} />
                  {/* Core glow */}
                  <rect x="10" y="6" width="28" height="50" rx="10" ry="10"
                    fill={`url(#hifi-tube-glow-core-${i})`} />
                  {/* Wire mesh overlay */}
                  {[16, 22, 28, 34, 40, 46].map(y => (
                    <line key={y} x1="12" y1={y} x2="36" y2={y}
                      stroke={X.text} strokeWidth="0.3" opacity="0.12" />
                  ))}
                  {/* Tube base */}
                  <rect x="14" y="56" width="20" height="8" rx="2"
                    fill={X.bgAlt} stroke={X.borderLight} strokeWidth="0.5" />
                  {/* Pins */}
                  {[18, 24, 30].map(px => (
                    <line key={px} x1={px} y1="64" x2={px} y2="72"
                      stroke={X.textMut} strokeWidth="1.5" strokeLinecap="round" />
                  ))}
                </svg>
                <M style={{ fontSize: 8, color: heat > 0.7 ? X.amber : X.textMut, fontWeight: 600 }}>
                  {Math.round(temp)}&deg;C
                </M>
              </div>
            );
          })}
        </div>
      </div>

      {/* Bottom readouts */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <Lbl>Power Output</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: X.amber }}>{powerOut.toFixed(1)}W</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl>Warm-up</Lbl>
          <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Prog value={warmupPct} color={statusColor} h={4} style={{ width: 80 }} />
            <M style={{ fontSize: 10, color: statusColor, fontWeight: 600 }}>{Math.round(warmupPct)}%</M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Reel-to-Reel ─────────────────────────────────────────────────────
export function ReelToReel({ title = 'Reel-to-Reel' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(50);
  const [playing, setPlaying] = useState(true);
  const [counter, setCounter] = useState(1247);

  const leftSpeed = playing ? 4.5 : 0;
  const rightSpeed = playing ? 3.0 : 0;
  const maxSpeed = 4.5;
  const leftAngle = (tick * leftSpeed * 6) % 360;
  const rightAngle = (tick * rightSpeed * 6) % 360;

  // Increment counter when playing
  if (playing && tick % 4 === 0 && tick > 0) {
    // handled via effect in real scenario; for display we derive
  }

  const reelR = 38;
  const leftCx = 65, rightCx = 215, reelCy = 55;

  return (
    <Card style={{ width: 350 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={playing ? X.teal : X.textMut}>{playing ? 'Playing' : 'Stopped'}</Badge>
      </div>

      {/* Transport panel */}
      <div style={{
        padding: 12, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 280 115" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="hifi-reel-grad" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor={X.surface} />
              <stop offset="100%" stopColor={X.bgAlt} />
            </linearGradient>
          </defs>

          {/* Left reel */}
          <circle cx={leftCx} cy={reelCy} r={reelR} fill="none" stroke={X.borderLight} strokeWidth="2" />
          <circle cx={leftCx} cy={reelCy} r={reelR - 4} fill="url(#hifi-reel-grad)" stroke={X.border} strokeWidth="0.5" />
          <circle cx={leftCx} cy={reelCy} r="10" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />
          {/* Left spokes with motion blur */}
          <g style={{
            transformOrigin: `${leftCx}px ${reelCy}px`,
            transform: `rotate(${leftAngle}deg)`,
            filter: `blur(${Math.min(1.5, leftSpeed / maxSpeed)}px)`,
            transition: playing ? 'none' : 'filter 500ms ease',
          }}>
            {[0, 120, 240].map(a => (
              <line key={a} x1={leftCx} y1={reelCy - reelR + 6} x2={leftCx} y2={reelCy + reelR - 6}
                stroke={X.textMut} strokeWidth="1.2"
                style={{ transformOrigin: `${leftCx}px ${reelCy}px`, transform: `rotate(${a}deg)` }} />
            ))}
          </g>

          {/* Right reel */}
          <circle cx={rightCx} cy={reelCy} r={reelR} fill="none" stroke={X.borderLight} strokeWidth="2" />
          <circle cx={rightCx} cy={reelCy} r={reelR - 4} fill="url(#hifi-reel-grad)" stroke={X.border} strokeWidth="0.5" />
          <circle cx={rightCx} cy={reelCy} r="10" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />
          {/* Right spokes with motion blur */}
          <g style={{
            transformOrigin: `${rightCx}px ${reelCy}px`,
            transform: `rotate(${rightAngle}deg)`,
            filter: `blur(${Math.min(1.5, rightSpeed / maxSpeed)}px)`,
            transition: playing ? 'none' : 'filter 500ms ease',
          }}>
            {[0, 120, 240].map(a => (
              <line key={a} x1={rightCx} y1={reelCy - reelR + 6} x2={rightCx} y2={reelCy + reelR - 6}
                stroke={X.textMut} strokeWidth="1.2"
                style={{ transformOrigin: `${rightCx}px ${reelCy}px`, transform: `rotate(${a}deg)` }} />
            ))}
          </g>

          {/* Tape path between reels through head assembly */}
          <path
            d={`M ${leftCx + reelR - 2} ${reelCy} Q ${140} ${reelCy + 30} ${140} ${reelCy + 22} L ${140} ${reelCy + 22} Q ${140} ${reelCy + 30} ${rightCx - reelR + 2} ${reelCy}`}
            fill="none" stroke={X.amber} strokeWidth="1.5" opacity="0.6" />
          {/* Tape path simple arc */}
          <path
            d={`M ${leftCx} ${reelCy + reelR - 2} Q ${140} ${reelCy + 50} ${rightCx} ${reelCy + reelR - 2}`}
            fill="none" stroke={X.amber} strokeWidth="1.2" opacity="0.5" />

          {/* Head assembly */}
          <rect x="130" y={reelCy + 16} width="20" height="14" rx="2"
            fill={X.bgAlt} stroke={X.borderLight} strokeWidth="0.8" />
          <line x1="137" y1={reelCy + 18} x2="137" y2={reelCy + 28} stroke={X.textMut} strokeWidth="0.5" />
          <line x1="140" y1={reelCy + 18} x2="140" y2={reelCy + 28} stroke={X.textMut} strokeWidth="0.5" />
          <line x1="143" y1={reelCy + 18} x2="143" y2={reelCy + 28} stroke={X.textMut} strokeWidth="0.5" />
        </svg>
      </div>

      {/* Tape counter display */}
      <div style={{
        display: 'flex', justifyContent: 'center', marginBottom: 12,
        padding: '6px 16px', borderRadius: 6, background: '#1a1a10',
        boxShadow: n.concave, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 18, fontWeight: 800, color: X.amber, fontFamily: 'monospace', letterSpacing: '0.15em' }}>
          {String(Math.abs((counter + (playing ? Math.floor(tick / 4) : 0)) % 10000)).padStart(4, '0')}
        </M>
      </div>

      {/* Transport controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 6 }}>
        <Btn small ghost color={X.textMut} onClick={() => setPlaying(false)}>
          <svg width="10" height="10" viewBox="0 0 10 10"><rect x="1" y="1" width="3" height="8" fill="currentColor" /><rect x="6" y="1" width="3" height="8" fill="currentColor" /></svg>
          Stop
        </Btn>
        <Btn small color={playing ? X.teal : X.purple} onClick={() => setPlaying(true)}>
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="1,0 10,5 1,10" fill="currentColor" /></svg>
          Play
        </Btn>
        <Btn small ghost color={X.textMut} onClick={() => { setPlaying(false); setCounter(0); }}>
          <svg width="10" height="10" viewBox="0 0 10 10"><polygon points="5,0 0,5 5,10" fill="currentColor" /><polygon points="10,0 5,5 10,10" fill="currentColor" /></svg>
          Rewind
        </Btn>
      </div>
    </Card>
  );
}

// ── VU Meter ──────────────────────────────────────────────────────────
export function VUMeter({ title = 'VU Meter' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const levelL = useLive(-8, 6, 300);
  const levelR = useLive(-6, 7, 350);
  const [peakL, setPeakL] = useState(-20);
  const [peakR, setPeakR] = useState(-20);

  // Track peaks with slow decay
  const effectiveL = Math.max(-20, Math.min(3, levelL));
  const effectiveR = Math.max(-20, Math.min(3, levelR));

  // Map dB to angle: -20dB = -45deg, +3dB = +45deg
  const dbToAngle = (db: number) => ((db + 20) / 23) * 90 - 45;
  const angleL = dbToAngle(effectiveL);
  const angleR = dbToAngle(effectiveR);

  const MeterFace = ({ label, angle, db }: { label: string; angle: number; db: number }) => {
    const isRed = db > 0;
    return (
      <div style={{ flex: 1, position: 'relative' }}>
        <Lbl style={{ textAlign: 'center', marginBottom: 4 }}>{label}</Lbl>
        <div style={{
          height: 80, borderRadius: '80px 80px 4px 4px', overflow: 'hidden',
          background: 'linear-gradient(180deg, #f5f0e0, #e8e0c8)',
          boxShadow: n.bezel, position: 'relative',
        }}>
          {/* Scale markings */}
          <svg viewBox="0 0 120 70" style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0 }}>
            {/* Arc scale background */}
            <path d="M 15 65 A 50 50 0 0 1 105 65" fill="none" stroke="#88776640" strokeWidth="0.5" />

            {/* Scale labels */}
            {[
              { db: -20, x: 18, y: 58 },
              { db: -10, x: 30, y: 38 },
              { db: -7, x: 38, y: 32 },
              { db: -5, x: 46, y: 28 },
              { db: -3, x: 54, y: 26 },
              { db: 0, x: 68, y: 26 },
              { db: 1, x: 78, y: 28 },
              { db: 2, x: 88, y: 33 },
              { db: 3, x: 98, y: 40 },
            ].map(({ db: d, x, y }) => (
              <text key={d} x={x} y={y} textAnchor="middle" fontSize="5" fontWeight="600"
                fill={d >= 0 ? '#cc3333' : '#555544'} fontFamily="serif">
                {d > 0 ? '+' + d : d}
              </text>
            ))}

            {/* Red zone above 0dB */}
            <path d="M 68 62 A 50 50 0 0 1 102 62" fill="none" stroke="#cc333340" strokeWidth="8" />

            {/* Tick marks */}
            {Array.from({ length: 24 }, (_, i) => {
              const a = (-45 + i * (90 / 23)) * Math.PI / 180;
              const cx = 60, cy = 65, r1 = 44, r2 = 48;
              return (
                <line key={i}
                  x1={cx + Math.cos(a - Math.PI / 2) * r1} y1={cy + Math.sin(a - Math.PI / 2) * r1}
                  x2={cx + Math.cos(a - Math.PI / 2) * r2} y2={cy + Math.sin(a - Math.PI / 2) * r2}
                  stroke={i >= 20 ? '#cc3333' : '#555544'} strokeWidth={i % 5 === 0 ? '1' : '0.4'} />
              );
            })}

            {/* Needle */}
            <line x1="60" y1="65" x2={60 + Math.cos((angle - 90) * Math.PI / 180) * 42}
              y2={65 + Math.sin((angle - 90) * Math.PI / 180) * 42}
              stroke="#222" strokeWidth="1" strokeLinecap="round"
              style={{ transition: 'x2 300ms cubic-bezier(.34,1.56,.64,1), y2 300ms cubic-bezier(.34,1.56,.64,1)' }} />

            {/* Needle pivot */}
            <circle cx="60" cy="65" r="3" fill="#333" />

            {/* Peak hold mark */}
            {(() => {
              const peakAngle = dbToAngle(Math.max(effectiveL, effectiveR)) + 2;
              const pa = (peakAngle - 90) * Math.PI / 180;
              const px1 = 60 + Math.cos(pa) * 38, py1 = 65 + Math.sin(pa) * 38;
              const px2 = 60 + Math.cos(pa) * 43, py2 = 65 + Math.sin(pa) * 43;
              return <line x1={px1} y1={py1} x2={px2} y2={py2} stroke={X.red} strokeWidth="1.5" opacity="0.7"
                style={{ transition: 'x1 1200ms ease, y1 1200ms ease, x2 1200ms ease, y2 1200ms ease' }} />;
            })()}
          </svg>
        </div>
        <div style={{ textAlign: 'center', marginTop: 4 }}>
          <M style={{ fontSize: 10, fontWeight: 700, color: isRed ? X.red : X.text, fontFamily: 'monospace' }}>
            {db > 0 ? '+' : ''}{db.toFixed(1)} dB
          </M>
        </div>
      </div>
    );
  };

  return (
    <Card style={{ width: 350 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>Stereo</Badge>
      </div>

      <div style={{ display: 'flex', gap: 10 }}>
        <MeterFace label="L" angle={angleL} db={effectiveL} />
        <MeterFace label="R" angle={angleR} db={effectiveR} />
      </div>
    </Card>
  );
}

// ── Graphic Equalizer ─────────────────────────────────────────────────
export function GraphicEQ({ title = 'Equalizer' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const freqs = ['31', '62', '125', '250', '500', '1k', '2k', '4k', '8k', '16k'];
  const [bands, setBands] = useState(() => freqs.map(() => 50 + Math.round((Math.random() - 0.5) * 30)));

  const setBand = (i: number, val: number) => {
    const next = [...bands];
    next[i] = Math.max(0, Math.min(100, val));
    setBands(next);
  };

  const bandColor = (i: number) => {
    if (i < 3) return X.red;
    if (i < 7) return X.amber;
    return X.teal;
  };

  const trackH = 100;
  const knobH = 10;

  return (
    <Card style={{ width: 350 }} glow={X.purple}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Btn small ghost color={X.textMut} onClick={() => setBands(freqs.map(() => 50))}>Flat</Btn>
      </div>

      {/* EQ panel */}
      <div style={{
        padding: '14px 10px', borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 8,
      }}>
        <div style={{ display: 'flex', gap: 4, justifyContent: 'space-between' }}>
          {freqs.map((freq, i) => {
            const val = bands[i];
            const db = Math.round((val - 50) * 0.48);
            const c = bandColor(i);
            const knobTop = trackH - (val / 100) * (trackH - knobH);

            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 3, flex: 1 }}>
                <M style={{ fontSize: 7, color: db > 0 ? c : db < 0 ? X.pink : X.textMut, fontWeight: 600 }}>
                  {db > 0 ? '+' : ''}{db}
                </M>

                {/* Track */}
                <div
                  style={{
                    width: 18, height: trackH, borderRadius: 9,
                    background: X.bgAlt, boxShadow: n.concave,
                    position: 'relative', cursor: 'pointer',
                  }}
                  onClick={(e) => {
                    const r = e.currentTarget.getBoundingClientRect();
                    const pct = 100 - ((e.clientY - r.top) / r.height) * 100;
                    setBand(i, Math.round(pct));
                  }}
                >
                  {/* Fill indicator */}
                  <div style={{
                    position: 'absolute', bottom: 0, left: 3, right: 3,
                    height: `${val}%`, borderRadius: 6,
                    background: `linear-gradient(to top, ${c}30, ${c}08)`,
                    transition: `height 150ms ${ease.mv}`,
                  }} />

                  {/* Knob */}
                  <div style={{
                    position: 'absolute', left: 1, right: 1,
                    top: knobTop - knobH / 2, height: knobH,
                    borderRadius: 5, background: X.surface,
                    boxShadow: n.raised,
                    transition: `top 150ms ${ease.mv}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <div style={{ width: 8, height: 1.5, borderRadius: 1, background: c, opacity: 0.7 }} />
                  </div>
                </div>

                <M style={{ fontSize: 6, color: X.textMut, fontWeight: 500 }}>{freq}</M>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <Lbl style={{ marginBottom: 0 }}>10-Band Graphic EQ</Lbl>
      </div>
    </Card>
  );
}

// ── Tape Counter ──────────────────────────────────────────────────────
export function TapeCounter({ title = 'Tape Counter' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(200);
  const [count, setCount] = useState(0);
  const [running, setRunning] = useState(true);

  const current = running ? (count + tick) % 10000 : count;
  const digits = String(current).padStart(4, '0').split('').map(Number);
  const cellH = 28;

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={running ? X.teal : X.textMut}>{running ? 'Running' : 'Stopped'}</Badge>
      </div>

      {/* Metal housing */}
      <div style={{
        padding: 16, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
        display: 'flex', justifyContent: 'center', alignItems: 'center',
      }}>
        {/* Counter housing */}
        <div style={{
          display: 'flex', gap: 3, padding: '12px 18px',
          borderRadius: 8, background: '#111',
          boxShadow: n.bezel, border: `1px solid ${X.borderLight}`,
        }}>
          {digits.map((digit, i) => (
            <div key={i} style={{
              width: 32, height: cellH, overflow: 'hidden',
              borderRadius: 4, background: '#1a1a1a',
              boxShadow: 'inset 0 4px 6px rgba(0,0,0,0.3), inset 0 -4px 6px rgba(0,0,0,0.3)',
              position: 'relative',
            }}>
              {/* Drum column */}
              <div style={{
                display: 'flex', flexDirection: 'column',
                transition: `transform 300ms ${ease.sp}`,
                transform: `translateY(${-digit * cellH}px)`,
              }}>
                {Array.from({ length: 10 }, (_, d) => (
                  <div key={d} style={{
                    width: 32, height: cellH,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    color: '#e8e0c8', fontFamily: 'monospace',
                    fontSize: 18, fontWeight: 800,
                    background: d === digit
                      ? 'linear-gradient(180deg, #222 0%, #333 40%, #333 60%, #222 100%)'
                      : 'linear-gradient(180deg, #1a1a1a 0%, #222 40%, #222 60%, #1a1a1a 100%)',
                  }}>
                    {d}
                  </div>
                ))}
              </div>

              {/* Top curve shadow */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 8,
                background: 'linear-gradient(180deg, rgba(0,0,0,0.4), transparent)',
                pointerEvents: 'none',
              }} />
              {/* Bottom curve shadow */}
              <div style={{
                position: 'absolute', bottom: 0, left: 0, right: 0, height: 8,
                background: 'linear-gradient(0deg, rgba(0,0,0,0.4), transparent)',
                pointerEvents: 'none',
              }} />
            </div>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 8 }}>
        <Btn small ghost color={X.textMut} onClick={() => setRunning(!running)}>
          {running ? 'Pause' : 'Resume'}
        </Btn>
        <Btn small color={X.red} onClick={() => { setCount(0); setRunning(false); }}>
          Reset
        </Btn>
      </div>
    </Card>
  );
}

// ── Transformer ───────────────────────────────────────────────────────
export function TransformerHum({ title = 'Transformer' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(50);
  const voltage = useLive(240, 5);
  const current = useLive(2.4, 0.3);
  const temp = useLive(62, 3, 3000);

  const vibX = Math.sin(tick * 0.8) * 0.4;
  const status = temp > 75 ? 'Hot' : temp > 60 ? 'Nominal' : 'Cool';
  const statusColor = temp > 75 ? X.red : temp > 60 ? X.teal : X.indigo;

  return (
    <Card style={{ width: 350 }} glow={statusColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{status}</Badge>
      </div>

      {/* Transformer cross-section */}
      <div style={{
        padding: 14, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12, position: 'relative',
      }}>
        <svg viewBox="0 0 280 120" style={{ width: '100%', height: 'auto', display: 'block' }}>
          <defs>
            <linearGradient id="hifi-xfmr-core" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#666" />
              <stop offset="50%" stopColor="#555" />
              <stop offset="100%" stopColor="#444" />
            </linearGradient>
            <linearGradient id="hifi-xfmr-coil-pri" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.amber} stopOpacity="0.8" />
              <stop offset="100%" stopColor={X.red} stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="hifi-xfmr-coil-sec" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={X.teal} stopOpacity="0.8" />
              <stop offset="100%" stopColor={X.indigo} stopOpacity="0.6" />
            </linearGradient>
            <radialGradient id="hifi-rivet">
              <stop offset="0%" stopColor="#999" />
              <stop offset="40%" stopColor="#777" />
              <stop offset="100%" stopColor="#444" />
            </radialGradient>
          </defs>

          {/* Mounting plate */}
          <rect x="20" y="10" width="240" height="100" rx="4" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="0.8" />

          {/* Core group with vibration */}
          <g style={{ transform: `translateX(${vibX}px)` }}>
            {/* E-core top bar */}
            <rect x="60" y="22" width="160" height="12" rx="1" fill="url(#hifi-xfmr-core)" />
            {/* E-core bottom bar */}
            <rect x="60" y="86" width="160" height="12" rx="1" fill="url(#hifi-xfmr-core)" />
            {/* E-core left leg */}
            <rect x="60" y="22" width="14" height="76" rx="1" fill="url(#hifi-xfmr-core)" />
            {/* E-core center leg */}
            <rect x="133" y="22" width="14" height="76" rx="1" fill="url(#hifi-xfmr-core)" />
            {/* E-core right leg */}
            <rect x="206" y="22" width="14" height="76" rx="1" fill="url(#hifi-xfmr-core)" />

            {/* I-lamination lines */}
            {[28, 34, 40, 46, 52, 58, 64, 70, 76, 82].map(y => (
              <line key={y} x1="62" y1={y} x2="218" y2={y} stroke="#33333330" strokeWidth="0.3" />
            ))}

            {/* Primary coil (left window) */}
            <rect x="78" y="36" width="52" height="48" rx="6" fill="none" stroke="url(#hifi-xfmr-coil-pri)" strokeWidth="3" />
            <rect x="82" y="40" width="44" height="40" rx="4" fill="none" stroke="url(#hifi-xfmr-coil-pri)" strokeWidth="2" opacity="0.6" />
            <rect x="86" y="44" width="36" height="32" rx="3" fill="none" stroke="url(#hifi-xfmr-coil-pri)" strokeWidth="1.5" opacity="0.4" />
            {/* Winding lines */}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`pw${i}`} x1="78" y1={38 + i * 6} x2="130" y2={38 + i * 6}
                stroke={X.amber} strokeWidth="0.4" opacity="0.3" />
            ))}

            {/* Secondary coil (right window) */}
            <rect x="150" y="36" width="52" height="48" rx="6" fill="none" stroke="url(#hifi-xfmr-coil-sec)" strokeWidth="3" />
            <rect x="154" y="40" width="44" height="40" rx="4" fill="none" stroke="url(#hifi-xfmr-coil-sec)" strokeWidth="2" opacity="0.6" />
            <rect x="158" y="44" width="36" height="32" rx="3" fill="none" stroke="url(#hifi-xfmr-coil-sec)" strokeWidth="1.5" opacity="0.4" />
            {/* Winding lines */}
            {Array.from({ length: 8 }, (_, i) => (
              <line key={`sw${i}`} x1="150" y1={38 + i * 6} x2="202" y2={38 + i * 6}
                stroke={X.teal} strokeWidth="0.4" opacity="0.3" />
            ))}
          </g>

          {/* Rivet details */}
          {[
            { cx: 32, cy: 22 }, { cx: 248, cy: 22 },
            { cx: 32, cy: 98 }, { cx: 248, cy: 98 },
          ].map((r, i) => (
            <circle key={i} cx={r.cx} cy={r.cy} r="4" fill="url(#hifi-rivet)" stroke="#33333350" strokeWidth="0.5" />
          ))}
        </svg>
      </div>

      {/* Power rail LEDs */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Dot c={X.red} pulse s={7} />
          <M style={{ fontSize: 9, color: X.textMut, fontWeight: 600 }}>+V</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Dot c={X.teal} pulse s={7} />
          <M style={{ fontSize: 9, color: X.textMut, fontWeight: 600 }}>GND</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
          <Dot c={X.indigo} pulse s={7} />
          <M style={{ fontSize: 9, color: X.textMut, fontWeight: 600 }}>-V</M>
        </div>
      </div>

      {/* Readouts */}
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div>
          <Lbl>Voltage</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: X.amber }}>{voltage.toFixed(1)}V</M>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Lbl>Current</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: X.teal }}>{current.toFixed(2)}A</M>
        </div>
        <div style={{ textAlign: 'right' }}>
          <Lbl>Temp</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: statusColor }}>{Math.round(temp)}&deg;C</M>
        </div>
      </div>
    </Card>
  );
}
