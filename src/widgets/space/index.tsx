import { useState } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog, Btn } from '../primitives';
import { useAnim, useLive, useTick } from '../hooks';

function neo() {
  const X = getX();
  const dark = X.bg + '40';
  const light = '#ffffff12';
  return {
    raised: `4px 4px 10px ${dark}, -2px -2px 6px ${light}`,
    concave: `inset 3px 3px 8px ${dark}, inset -2px -2px 5px ${light}`,
    bezel: `inset 0 1px 0 ${light}, inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ${dark}`,
    metal: `linear-gradient(135deg, ${X.surface}, ${X.bgAlt} 40%, ${X.surface} 60%, ${X.bgAlt})`,
  };
}

// ── Orbit Tracker ────────────────────────────────────────────────────
export function OrbitTracker({ title = 'Orbit Tracker', orbitType = 'LEO' }: { title?: string; orbitType?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);
  const altitude = useLive(orbitType === 'GEO' ? 35786 : orbitType === 'MEO' ? 20200 : 408, 12, 2500);
  const velocity = useLive(orbitType === 'GEO' ? 3.07 : orbitType === 'MEO' ? 3.89 : 7.66, 0.05, 3000);
  const period = useLive(orbitType === 'GEO' ? 1436 : orbitType === 'MEO' ? 720 : 92.7, 0.3, 4000);
  const inclination = useLive(orbitType === 'GEO' ? 0.05 : orbitType === 'MEO' ? 55 : 51.6, 0.02, 5000);

  const satAngle = (tick * 3) % 360;
  const orbitColor = orbitType === 'GEO' ? X.amber : orbitType === 'MEO' ? X.indigo : X.teal;

  const cx = 70, cy = 70, rx = 55, ry = 20;
  const rad = (satAngle * Math.PI) / 180;
  const satX = cx + rx * Math.cos(rad);
  const satY = cy + ry * Math.sin(rad);

  return (
    <Card style={{ width: 350 }} glow={orbitColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={orbitColor}>{orbitType}</Badge>
      </div>

      {/* Orbital ring display */}
      <div style={{
        borderRadius: 10, padding: 8, marginBottom: 12,
        background: n.metal, boxShadow: n.concave,
      }}>
        <svg viewBox="0 0 140 100" style={{ width: '100%', height: 100, display: 'block' }}>
          <defs>
            <radialGradient id="space-rg" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor={X.indigo} stopOpacity=".3" />
              <stop offset="100%" stopColor={X.indigo} stopOpacity="0" />
            </radialGradient>
            <linearGradient id="space-orbit-glow" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={orbitColor} stopOpacity="0" />
              <stop offset="30%" stopColor={orbitColor} stopOpacity=".6" />
              <stop offset="70%" stopColor={orbitColor} stopOpacity=".6" />
              <stop offset="100%" stopColor={orbitColor} stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Earth */}
          <circle cx={cx} cy={cy} r="12" fill="url(#space-rg)" stroke={X.indigo} strokeWidth=".5" />
          <circle cx={cx} cy={cy} r="8" fill={X.bgAlt} stroke={X.border} strokeWidth=".8" />
          <circle cx={cx} cy={cy} r="4" fill={X.indigo} opacity=".5" />
          {/* Concave orbit path */}
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
            fill="none" stroke={X.border} strokeWidth="1.5" strokeDasharray="4 3" />
          <ellipse cx={cx} cy={cy} rx={rx} ry={ry}
            fill="none" stroke={orbitColor} strokeWidth=".5" opacity=".4" />
          {/* Satellite dot with glow */}
          <circle cx={satX} cy={satY} r="6" fill={orbitColor} opacity=".15" />
          <circle cx={satX} cy={satY} r="3" fill={orbitColor}
            style={{ filter: `drop-shadow(0 0 4px ${orbitColor})` }} />
          <circle cx={satX} cy={satY} r="1.2" fill="#fff" opacity=".8" />
          {/* Orbit label */}
          <text x="6" y="12" fontFamily="monospace" fontSize="6" fill={X.textMut}>
            {orbitType} ORBIT
          </text>
        </svg>
      </div>

      {/* Telemetry readouts */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
        {[
          { label: 'Altitude', value: `${Math.round(altitude)} km`, color: orbitColor },
          { label: 'Velocity', value: `${velocity.toFixed(2)} km/s`, color: X.teal },
          { label: 'Period', value: `${period.toFixed(1)} min`, color: X.amber },
          { label: 'Incl.', value: `${inclination.toFixed(2)}\u00B0`, color: X.indigo },
        ].map((item, i) => (
          <div key={i} style={{
            padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>{item.label}</Lbl>
            <M style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.value}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Sat Telemetry ────────────────────────────────────────────────────
export function SatTelemetry({ title = 'Sat Telemetry', channelCount = 4 }: { title?: string; channelCount?: number } = {}) {
  const X = getX();
  const n = neo();

  const battery = useLive(78, 5, 2800);
  const signal = useLive(62, 8, 2200);
  const temp = useLive(22, 4, 3200);
  const attitude = useLive(0.4, 0.15, 2600);

  const animBatt = useAnim(battery, 1200);
  const animSig = useAnim(signal, 1100);
  const animTemp = useAnim(Math.min(100, Math.max(0, ((temp + 40) / 120) * 100)), 1300);
  const animAtt = useAnim(Math.min(100, (attitude / 2) * 100), 1400);

  const battColor = battery > 60 ? X.teal : battery > 30 ? X.amber : X.red;
  const sigColor = signal > 50 ? X.teal : signal > 25 ? X.amber : X.red;
  const tempColor = temp > 50 ? X.red : temp > 35 ? X.amber : X.teal;
  const attColor = attitude < 0.5 ? X.teal : attitude < 1.2 ? X.amber : X.red;

  const gauges = [
    { label: 'Battery', value: `${battery.toFixed(0)}%`, pct: animBatt, color: battColor, icon: 'BAT' },
    { label: 'Signal', value: `${signal.toFixed(0)} dBm`, pct: animSig, color: sigColor, icon: 'SIG' },
    { label: 'Temp', value: `${temp.toFixed(1)}\u00B0C`, pct: animTemp, color: tempColor, icon: 'TMP' },
    { label: 'Attitude', value: `${attitude.toFixed(2)}\u00B0`, pct: animAtt, color: attColor, icon: 'ATT' },
  ].slice(0, channelCount);

  const status = gauges.every(g => g.pct > 25) ? 'Nominal' : 'Warning';

  return (
    <Card style={{ width: 350 }} glow={status === 'Nominal' ? X.teal : X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={status === 'Nominal' ? X.teal : X.amber}>{status}</Badge>
      </div>

      {/* 2x2 gauge cluster */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
        {gauges.map((g, i) => (
          <div key={i} style={{
            padding: 10, borderRadius: 8,
            background: n.metal, boxShadow: n.bezel,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
          }}>
            {/* Mini gauge arc */}
            <svg viewBox="0 0 60 38" style={{ width: 60, height: 38, display: 'block', marginBottom: 4 }}>
              <defs>
                <linearGradient id={`space-gauge-${i}`} x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor={g.color} stopOpacity=".3" />
                  <stop offset="100%" stopColor={g.color} />
                </linearGradient>
              </defs>
              {/* Background arc */}
              <path d="M6,34 A24,24 0 0,1 54,34" fill="none" stroke={X.border} strokeWidth="4" strokeLinecap="round" />
              {/* Value arc */}
              <path d="M6,34 A24,24 0 0,1 54,34" fill="none" stroke={`url(#space-gauge-${i})`}
                strokeWidth="4" strokeLinecap="round"
                strokeDasharray={`${(g.pct / 100) * 75.4} 75.4`}
                style={{ transition: `stroke-dasharray 800ms ${ease.o}` }} />
              {/* Needle */}
              {(() => {
                const angle = -180 + (g.pct / 100) * 180;
                const rad = (angle * Math.PI) / 180;
                const nx = 30 + 18 * Math.cos(rad);
                const ny = 34 + 18 * Math.sin(rad);
                return <line x1="30" y1="34" x2={nx} y2={ny}
                  stroke={g.color} strokeWidth="1" strokeLinecap="round"
                  style={{ transition: `x2 800ms ${ease.o}, y2 800ms ${ease.o}` }} />;
              })()}
              <circle cx="30" cy="34" r="2.5" fill={X.surface} stroke={g.color} strokeWidth=".8" />
              {/* Icon */}
              <text x="30" y="10" textAnchor="middle" fontFamily="monospace" fontSize="6"
                fill={X.textMut} fontWeight="bold">{g.icon}</text>
            </svg>
            <M style={{ fontSize: 12, fontWeight: 800, color: g.color, marginBottom: 2 }}>{g.value}</M>
            <Lbl>{g.label}</Lbl>
          </div>
        ))}
      </div>

      <div style={{
        marginTop: 10, padding: '6px 8px', borderRadius: 6,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Channels: {channelCount}</M>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={status === 'Nominal' ? X.teal : X.amber} pulse s={5} />
          <M style={{ fontSize: 8, color: X.textMut }}>Downlink Active</M>
        </div>
      </div>
    </Card>
  );
}

// ── Solar Array Angle ────────────────────────────────────────────────
export function SolarArrayAngle({ title = 'Solar Array', panelCount = 2 }: { title?: string; panelCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const sunAngle = useLive(45, 8, 3000);
  const panelAngle = useLive(42, 6, 2800);
  const power = useLive(4.2, 0.5, 2500);
  const efficiency = useLive(88, 3, 3200);

  const animSun = useAnim(sunAngle, 1200);
  const animPanel = useAnim(panelAngle, 1400);
  const effColor = efficiency > 80 ? X.teal : efficiency > 60 ? X.amber : X.red;
  const sunColor = X.amber;

  return (
    <Card style={{ width: 350 }} glow={sunColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={effColor}>{efficiency.toFixed(0)}% Eff.</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Rotary angle indicator with metallic bezel */}
        <div style={{
          width: 120, height: 120, borderRadius: '50%',
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 96, height: 96, display: 'block' }}>
            <defs>
              <radialGradient id="space-sun-glow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor={sunColor} stopOpacity=".25" />
                <stop offset="100%" stopColor={sunColor} stopOpacity="0" />
              </radialGradient>
              <linearGradient id="space-panel-fill" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={X.indigo} stopOpacity=".6" />
                <stop offset="100%" stopColor={X.indigo} />
              </linearGradient>
            </defs>
            {/* Dial background */}
            <circle cx="50" cy="50" r="44" fill={X.bgAlt} stroke={X.border} strokeWidth=".8" />
            {/* Degree markings */}
            {Array.from({ length: 36 }, (_, i) => {
              const a = (i * 10 * Math.PI) / 180;
              const isMajor = i % 9 === 0;
              const r1 = isMajor ? 36 : 39;
              const r2 = 42;
              return <line key={i}
                x1={50 + r1 * Math.cos(a)} y1={50 + r1 * Math.sin(a)}
                x2={50 + r2 * Math.cos(a)} y2={50 + r2 * Math.sin(a)}
                stroke={isMajor ? X.textMut : X.border} strokeWidth={isMajor ? 1 : 0.4} />;
            })}
            {/* Sun direction indicator */}
            {(() => {
              const a = ((animSun - 90) * Math.PI) / 180;
              return (
                <g>
                  <circle cx={50 + 30 * Math.cos(a)} cy={50 + 30 * Math.sin(a)} r="8"
                    fill="url(#space-sun-glow)" />
                  <circle cx={50 + 30 * Math.cos(a)} cy={50 + 30 * Math.sin(a)} r="4"
                    fill={sunColor} opacity=".7"
                    style={{ filter: `drop-shadow(0 0 3px ${sunColor})` }} />
                </g>
              );
            })()}
            {/* Panel angle needle */}
            {(() => {
              const a = ((animPanel - 90) * Math.PI) / 180;
              const nx = 50 + 26 * Math.cos(a);
              const ny = 50 + 26 * Math.sin(a);
              return (
                <g>
                  <line x1="50" y1="50" x2={nx} y2={ny}
                    stroke={X.indigo} strokeWidth="2" strokeLinecap="round"
                    style={{ transition: `x2 600ms ${ease.o}, y2 600ms ${ease.o}` }} />
                  {/* Panel icon at needle tip */}
                  <rect x={nx - 5} y={ny - 2} width="10" height="4" rx="1"
                    fill="url(#space-panel-fill)" stroke={X.indigo} strokeWidth=".5"
                    style={{
                      transformOrigin: `${nx}px ${ny}px`,
                      transform: `rotate(${animPanel}deg)`,
                      transition: `transform 600ms ${ease.o}`,
                    }} />
                </g>
              );
            })()}
            {/* Center hub */}
            <circle cx="50" cy="50" r="5" fill={X.surface} stroke={X.border} strokeWidth=".8" />
            <circle cx="50" cy="50" r="2" fill={X.textMut} />
            {/* Labels */}
            <text x="50" y="18" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={X.textMut}>0</text>
            <text x="88" y="52" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={X.textMut}>90</text>
            <text x="50" y="88" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={X.textMut}>180</text>
            <text x="12" y="52" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={X.textMut}>270</text>
          </svg>
        </div>

        {/* Readouts */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 3 }}>Power Output</Lbl>
            <M style={{ fontSize: 26, fontWeight: 800, color: effColor, display: 'block' }}>
              {power.toFixed(1)}
            </M>
            <M style={{ fontSize: 9, color: X.textMut }}>kW ({panelCount} panels)</M>
          </div>
          <div style={{
            padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl>Efficiency</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: effColor }}>{efficiency.toFixed(0)}%</M>
            </div>
            <Prog value={efficiency} color={effColor} h={4} />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Sun Angle</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: sunColor }}>
                {sunAngle.toFixed(1)}{'\u00B0'}
              </M>
            </div>
            <div style={{ flex: 1 }}>
              <Lbl style={{ marginBottom: 2 }}>Panel Angle</Lbl>
              <M style={{ fontSize: 11, fontWeight: 700, color: X.indigo }}>
                {panelAngle.toFixed(1)}{'\u00B0'}
              </M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Link Budget ──────────────────────────────────────────────────────
export function LinkBudget({ title = 'Link Budget', frequencyBand = 'Ka' }: { title?: string; frequencyBand?: string } = {}) {
  const X = getX();
  const n = neo();
  const signalStrength = useLive(72, 6, 2400);
  const linkMargin = useLive(6.2, 1.5, 3000);
  const ber = useLive(1e-9, 5e-10, 3500);
  const dataRate = useLive(frequencyBand === 'Ka' ? 150 : frequencyBand === 'Ku' ? 75 : 25, 5, 2800);
  const cnr = useLive(12.5, 1.2, 3200);

  const barCount = 8;
  const barValues = Array.from({ length: barCount }, (_, i) =>
    Math.min(100, Math.max(5, signalStrength - (barCount - 1 - i) * 6 + useLive(0, 3, 2000 + i * 200)))
  );

  const sigColor = signalStrength > 60 ? X.teal : signalStrength > 35 ? X.amber : X.red;
  const marginColor = linkMargin > 3 ? X.teal : linkMargin > 1 ? X.amber : X.red;
  const bandColor = frequencyBand === 'Ka' ? X.purple : frequencyBand === 'Ku' ? X.indigo : X.teal;

  return (
    <Card style={{ width: 350 }} glow={sigColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Badge color={bandColor}>{frequencyBand}-Band</Badge>
          <Dot c={sigColor} pulse s={6} />
        </div>
      </div>

      {/* Signal strength bars */}
      <div style={{
        padding: 12, borderRadius: 8, marginBottom: 12,
        background: n.metal, boxShadow: n.concave,
      }}>
        <Lbl style={{ marginBottom: 8 }}>Signal Strength</Lbl>
        <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 60 }}>
          {barValues.map((v, i) => {
            const h = Math.max(4, (v / 100) * 56);
            const active = v > 15;
            return (
              <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                <div style={{
                  width: '100%', height: h, borderRadius: 3,
                  background: active
                    ? `linear-gradient(0deg, ${sigColor}60, ${sigColor})`
                    : X.border,
                  boxShadow: active ? `0 0 8px ${sigColor}30, inset 0 1px 0 #ffffff15` : 'none',
                  transition: `height 600ms ${ease.sp}, background 400ms ${ease.o}`,
                }} />
              </div>
            );
          })}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 4 }}>
          <M style={{ fontSize: 8, color: X.textMut }}>Low</M>
          <M style={{ fontSize: 12, fontWeight: 800, color: sigColor }}>{signalStrength.toFixed(0)}%</M>
          <M style={{ fontSize: 8, color: X.textMut }}>High</M>
        </div>
      </div>

      {/* Link metrics */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 8, marginBottom: 10 }}>
        <div style={{
          padding: '6px 8px', borderRadius: 6, textAlign: 'center',
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        }}>
          <Lbl style={{ marginBottom: 2 }}>Margin</Lbl>
          <M style={{ fontSize: 12, fontWeight: 800, color: marginColor }}>
            {linkMargin.toFixed(1)} dB
          </M>
        </div>
        <div style={{
          padding: '6px 8px', borderRadius: 6, textAlign: 'center',
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        }}>
          <Lbl style={{ marginBottom: 2 }}>C/N</Lbl>
          <M style={{ fontSize: 12, fontWeight: 800, color: X.indigo }}>
            {cnr.toFixed(1)} dB
          </M>
        </div>
        <div style={{
          padding: '6px 8px', borderRadius: 6, textAlign: 'center',
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        }}>
          <Lbl style={{ marginBottom: 2 }}>Data Rate</Lbl>
          <M style={{ fontSize: 12, fontWeight: 800, color: bandColor }}>
            {dataRate.toFixed(0)} Mbps
          </M>
        </div>
      </div>

      {/* BER readout */}
      <div style={{
        padding: '6px 10px', borderRadius: 6,
        background: n.metal, boxShadow: n.raised,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <M style={{ fontSize: 9, color: X.textMut }}>BER</M>
        <M style={{ fontSize: 11, fontWeight: 700, color: ber < 1e-8 ? X.teal : X.amber, fontFamily: getX().m }}>
          {ber.toExponential(1)}
        </M>
      </div>
    </Card>
  );
}

// ── Thruster Control ─────────────────────────────────────────────────
export function ThrusterControl({ title = 'Thruster Control', thrusterCount = 8 }: { title?: string; thrusterCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const [firing, setFiring] = useState<Set<number>>(new Set());
  const [armed, setArmed] = useState(false);
  const fuelLevel = useLive(64, 2, 3000);
  const pressure = useLive(220, 8, 2800);
  const totalImpulse = useLive(12.4, 0.3, 4000);

  const fuelColor = fuelLevel > 50 ? X.teal : fuelLevel > 25 ? X.amber : X.red;
  const count = Math.min(thrusterCount, 12);

  const thrusterLabels = ['FWD', 'AFT', 'P-UP', 'P-DN', 'Y-L', 'Y-R', 'R-CW', 'R-CC', 'T9', 'T10', 'T11', 'T12'];

  const handleFire = (idx: number) => {
    if (!armed) return;
    setFiring(prev => {
      const next = new Set(prev);
      if (next.has(idx)) { next.delete(idx); } else { next.add(idx); }
      return next;
    });
  };

  return (
    <Card style={{ width: 350 }} glow={firing.size > 0 ? X.amber : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Badge color={armed ? X.red : X.textMut}>{armed ? 'ARMED' : 'SAFE'}</Badge>
          {firing.size > 0 && <Dot c={X.amber} pulse s={7} />}
        </div>
      </div>

      {/* Thruster button matrix */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${Math.min(count, 4)}, 1fr)`,
        gap: 8, marginBottom: 12,
        padding: 10, borderRadius: 8,
        background: n.metal, boxShadow: n.concave,
      }}>
        {Array.from({ length: count }, (_, i) => {
          const isFiring = firing.has(i);
          const thrustColor = isFiring ? X.amber : X.textMut;
          return (
            <div key={i}
              onClick={() => handleFire(i)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: '8px 4px', borderRadius: 8,
                background: isFiring
                  ? `linear-gradient(180deg, ${X.amber}20, ${X.amber}08)`
                  : X.bgAlt,
                border: `1px solid ${isFiring ? X.amber + '60' : X.borderLight}`,
                cursor: armed ? 'pointer' : 'not-allowed',
                opacity: armed ? 1 : 0.5,
                transition: `all 150ms ${ease.mv}`,
              }}>
              {/* LED indicator */}
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: isFiring
                  ? `radial-gradient(circle, ${X.amber}, ${X.red})`
                  : X.border,
                boxShadow: isFiring
                  ? `0 0 8px ${X.amber}80, 0 0 16px ${X.amber}30`
                  : `inset 1px 1px 3px ${X.bg}40`,
                transition: `all 200ms ${ease.mv}`,
              }} />
              {/* Push button */}
              <div style={{
                width: 28, height: 28, borderRadius: '50%',
                background: n.metal,
                boxShadow: isFiring ? n.concave : n.raised,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `box-shadow 150ms ${ease.mv}`,
              }}>
                <div style={{
                  width: 18, height: 18, borderRadius: '50%',
                  background: isFiring
                    ? `radial-gradient(circle, ${X.amber}40, ${X.bgAlt})`
                    : X.bgAlt,
                  border: `1px solid ${isFiring ? X.amber + '40' : X.border}`,
                }} />
              </div>
              <M style={{ fontSize: 7, fontWeight: 700, color: thrustColor }}>{thrusterLabels[i]}</M>
            </div>
          );
        })}
      </div>

      {/* Fuel & Pressure */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
            <Lbl>Fuel</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: fuelColor }}>{fuelLevel.toFixed(0)}%</M>
          </div>
          <Prog value={fuelLevel} color={fuelColor} h={4} />
        </div>
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 2 }}>Chamber</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.textSec }}>{pressure.toFixed(0)} bar</M>
        </div>
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 2 }}>Impulse</Lbl>
          <M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>{totalImpulse.toFixed(1)} Ns</M>
        </div>
      </div>

      <Btn small color={armed ? X.teal : X.red} onClick={() => { setArmed(!armed); if (armed) setFiring(new Set()); }}>
        {armed ? 'Disarm System' : 'Arm Thrusters'}
      </Btn>
    </Card>
  );
}

// ── Ground Station ───────────────────────────────────────────────────
export function GroundStation({ title = 'Ground Station', antennaCount = 3 }: { title?: string; antennaCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(60);

  const elevation = useLive(42, 5, 2600);
  const azimuth = useLive(185, 12, 2200);
  const snr = useLive(18.5, 2, 3000);
  const tracking = useLive(1, 0.3, 8000) > 0.5;

  const animEl = useAnim(elevation, 1200);
  const animAz = useAnim((azimuth / 360) * 100, 1400);

  const trackColor = tracking ? X.teal : X.red;
  const dishRotation = (tick * 2) % 360;
  const count = Math.min(antennaCount, 5);

  const antennas = Array.from({ length: count }, (_, i) => ({
    name: `ANT-${i + 1}`,
    el: useLive(30 + i * 10, 4, 2400 + i * 300),
    az: useLive(120 + i * 50, 8, 2000 + i * 400),
    linked: useLive(1, 0.2, 6000 + i * 1000) > 0.4,
  }));

  return (
    <Card style={{ width: 350 }} glow={trackColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
          <Dot c={trackColor} pulse={tracking} s={7} />
          <Badge color={trackColor}>{tracking ? 'Tracking' : 'Searching'}</Badge>
        </div>
      </div>

      <div style={{ display: 'flex', gap: 14, marginBottom: 12 }}>
        {/* Beveled panel with dish SVG */}
        <div style={{
          width: 120, height: 120, borderRadius: 10,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexShrink: 0,
        }}>
          <svg viewBox="0 0 100 100" style={{ width: 96, height: 96, display: 'block' }}>
            <defs>
              <linearGradient id="space-dish-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={X.textMut} stopOpacity=".4" />
                <stop offset="100%" stopColor={X.surface} stopOpacity=".8" />
              </linearGradient>
              <radialGradient id="space-signal-pulse" cx="50%" cy="30%" r="50%">
                <stop offset="0%" stopColor={trackColor} stopOpacity=".4" />
                <stop offset="100%" stopColor={trackColor} stopOpacity="0" />
              </radialGradient>
            </defs>
            {/* Ground */}
            <rect x="0" y="82" width="100" height="18" rx="2" fill={X.bgAlt} />
            <line x1="0" y1="82" x2="100" y2="82" stroke={X.border} strokeWidth=".5" />
            {/* Pedestal */}
            <rect x="44" y="60" width="12" height="22" rx="2" fill={X.border}
              stroke={X.textMut} strokeWidth=".5" />
            <rect x="40" y="76" width="20" height="6" rx="2" fill={X.border}
              stroke={X.textMut} strokeWidth=".5" />
            {/* Dish with rotation */}
            <g style={{
              transformOrigin: '50px 60px',
              transform: `rotate(${Math.sin(dishRotation * Math.PI / 180) * 15}deg)`,
              transition: `transform 200ms ${ease.o}`,
            }}>
              {/* Main dish */}
              <ellipse cx="50" cy="45" rx="30" ry="18" fill="url(#space-dish-fill)"
                stroke={X.textMut} strokeWidth=".8" />
              {/* Feed horn */}
              <line x1="50" y1="45" x2="50" y2="25" stroke={X.textMut} strokeWidth="1" />
              <circle cx="50" cy="24" r="3" fill={trackColor} opacity=".8"
                style={{ filter: tracking ? `drop-shadow(0 0 3px ${trackColor})` : 'none' }} />
              {/* Signal waves when tracking */}
              {tracking && [12, 18, 24].map((r, i) => (
                <circle key={i} cx="50" cy="24" r={r} fill="none"
                  stroke={trackColor} strokeWidth=".4"
                  opacity={0.5 - i * 0.15}
                  strokeDasharray="3 4" />
              ))}
            </g>
            {/* Status text */}
            <text x="50" y="96" textAnchor="middle" fontFamily="monospace" fontSize="5" fill={X.textMut}>
              EL: {elevation.toFixed(0)}{'\u00B0'} AZ: {azimuth.toFixed(0)}{'\u00B0'}
            </text>
          </svg>
        </div>

        {/* Elevation & Azimuth gauges */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl>Elevation</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{elevation.toFixed(1)}{'\u00B0'}</M>
            </div>
            <Prog value={animEl * (100 / 90)} color={X.teal} h={5} />
          </div>
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.concave,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
              <Lbl>Azimuth</Lbl>
              <M style={{ fontSize: 10, fontWeight: 700, color: X.indigo }}>{azimuth.toFixed(1)}{'\u00B0'}</M>
            </div>
            <Prog value={animAz} color={X.indigo} h={5} />
          </div>
          <div style={{
            padding: '6px 8px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>SNR</Lbl>
            <M style={{ fontSize: 14, fontWeight: 800, color: snr > 15 ? X.teal : X.amber }}>
              {snr.toFixed(1)} dB
            </M>
          </div>
        </div>
      </div>

      {/* Antenna table */}
      <div style={{
        borderRadius: 6, overflow: 'hidden',
        border: `1px solid ${X.borderLight}`,
      }}>
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 40px',
          padding: '4px 8px', background: X.bgAlt,
        }}>
          <Lbl>Antenna</Lbl>
          <Lbl>El.</Lbl>
          <Lbl>Az.</Lbl>
          <Lbl style={{ textAlign: 'center' }}>Link</Lbl>
        </div>
        {antennas.map((ant, i) => (
          <div key={i} style={{
            display: 'grid', gridTemplateColumns: '1fr 1fr 1fr 40px',
            padding: '4px 8px',
            borderTop: `1px solid ${X.borderLight}`,
          }}>
            <M style={{ fontSize: 9, fontWeight: 600, color: X.textSec }}>{ant.name}</M>
            <M style={{ fontSize: 9, color: X.textMut }}>{ant.el.toFixed(1)}{'\u00B0'}</M>
            <M style={{ fontSize: 9, color: X.textMut }}>{ant.az.toFixed(1)}{'\u00B0'}</M>
            <div style={{ textAlign: 'center' }}>
              <Dot c={ant.linked ? X.teal : X.red} pulse={ant.linked} s={5} />
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}
