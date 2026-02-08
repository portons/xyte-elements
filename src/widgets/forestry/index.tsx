import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

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

// ── Fire Risk Index ─────────────────────────────────────────────────
export function FireRiskIndex({ title = 'Fire Risk Index', riskLevel = 42 }: { title?: string; riskLevel?: number } = {}) {
  const X = getX();
  const n = neo();
  const risk = Math.max(0, Math.min(100, riskLevel));
  const animRisk = useAnim(risk);

  const categories = [
    { max: 20, label: 'LOW', color: X.teal },
    { max: 40, label: 'MODERATE', color: '#4ade80' },
    { max: 60, label: 'HIGH', color: X.amber },
    { max: 80, label: 'VERY HIGH', color: '#f97316' },
    { max: 100, label: 'EXTREME', color: X.red },
  ];
  const cat = categories.find(c => risk <= c.max) || categories[categories.length - 1];
  const needleAngle = -135 + (animRisk / 100) * 270;

  return (
    <Card style={{ width: 350 }} glow={risk > 80 ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={cat.color} solid={risk > 80}>{cat.label}</Badge>
      </div>
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: 8 }}>
        <svg viewBox="0 0 120 80" style={{ width: 200, height: 130 }}>
          <defs>
            <linearGradient id="fr-arc" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor={X.teal} />
              <stop offset="30%" stopColor="#4ade80" />
              <stop offset="50%" stopColor={X.amber} />
              <stop offset="75%" stopColor="#f97316" />
              <stop offset="100%" stopColor={X.red} />
            </linearGradient>
          </defs>
          {/* Background arc */}
          <path d={describeArc(60, 55, 42, -135, 135)} fill="none" stroke={X.borderLight} strokeWidth="8" strokeLinecap="round" />
          {/* Colored segments */}
          {categories.map((seg, i) => {
            const startPct = i === 0 ? 0 : categories[i - 1].max;
            const sAngle = -135 + (startPct / 100) * 270;
            const eAngle = -135 + (seg.max / 100) * 270;
            return <path key={i} d={describeArc(60, 55, 42, sAngle, eAngle)} fill="none" stroke={seg.color} strokeWidth="8" strokeLinecap="butt" opacity="0.7" />;
          })}
          {/* Tick marks */}
          {Array.from({ length: 11 }, (_, i) => {
            const a = (-135 + i * 27) * (Math.PI / 180);
            return <line key={i} x1={60 + 34 * Math.cos(a)} y1={55 + 34 * Math.sin(a)} x2={60 + 37 * Math.cos(a)} y2={55 + 37 * Math.sin(a)} stroke={X.textMut} strokeWidth="0.8" />;
          })}
          {/* Needle */}
          <line x1="60" y1="55" x2={60 + 30 * Math.cos(needleAngle * Math.PI / 180)} y2={55 + 30 * Math.sin(needleAngle * Math.PI / 180)}
            stroke={cat.color} strokeWidth="2" strokeLinecap="round"
            style={{ transition: `x2 600ms ${ease.sp}, y2 600ms ${ease.sp}`, filter: `drop-shadow(0 0 3px ${cat.color}60)` }} />
          <circle cx="60" cy="55" r="4" fill={cat.color} style={{ filter: `drop-shadow(0 0 4px ${cat.color}50)` }} />
          {/* Value */}
          <text x="60" y="75" textAnchor="middle" fontFamily={X.m} fontSize="9" fontWeight="800" fill={cat.color}>{Math.round(risk)}</text>
          {/* Scale labels */}
          <text x="15" y="68" fontFamily={X.m} fontSize="5" fill={X.textMut}>0</text>
          <text x="100" y="68" fontFamily={X.m} fontSize="5" fill={X.textMut}>100</text>
        </svg>
      </div>
      <div style={{ textAlign: 'center', marginBottom: 6 }}>
        <M style={{ fontSize: 14, fontWeight: 800, color: cat.color, letterSpacing: '0.1em' }}>{cat.label}</M>
      </div>
      <Prog value={risk} color={cat.color} h={3} />
    </Card>
  );
}

// Helper for SVG arc paths
function describeArc(cx: number, cy: number, r: number, startAngle: number, endAngle: number) {
  const start = polarToCartesian(cx, cy, r, endAngle);
  const end = polarToCartesian(cx, cy, r, startAngle);
  const largeArc = endAngle - startAngle <= 180 ? '0' : '1';
  return `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 0 ${end.x} ${end.y}`;
}

function polarToCartesian(cx: number, cy: number, r: number, angleDeg: number) {
  const rad = (angleDeg * Math.PI) / 180;
  return { x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad) };
}

// ── Smoke Detector ──────────────────────────────────────────────────
export function SmokeDetector({ title = 'Smoke Detector', smokeDensity = 12, threshold = 50, status = 'clear' as 'clear' | 'haze' | 'smoke' }: { title?: string; smokeDensity?: number; threshold?: number; status?: 'clear' | 'haze' | 'smoke' } = {}) {
  const X = getX();
  const n = neo();
  const sc = status === 'smoke' ? X.red : status === 'haze' ? X.amber : X.teal;
  const densityPct = Math.min(100, (smokeDensity / threshold) * 100);
  const animDensity = useAnim(densityPct);
  const hazeOpacity = Math.min(0.5, smokeDensity / 100);

  return (
    <Card style={{ width: 350 }} glow={status === 'smoke' ? X.red : undefined}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <Dot c={sc} pulse={status === 'smoke'} s={7} />
          <Badge color={sc} solid={status === 'smoke'}>{status.toUpperCase()}</Badge>
        </div>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        {/* Sensor visualization */}
        <div style={{ width: 100, height: 100, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', flexShrink: 0 }}>
          <div style={{ width: 80, height: 80, borderRadius: '50%', background: X.bg, boxShadow: n.concave, position: 'relative', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 60 60" style={{ width: 55, height: 55, position: 'relative', zIndex: 1 }}>
              {/* Sensor body */}
              <circle cx="30" cy="30" r="18" fill="none" stroke={sc} strokeWidth="1.5" opacity="0.6" />
              <circle cx="30" cy="30" r="12" fill="none" stroke={sc} strokeWidth="1" opacity="0.4" />
              {/* IR beam lines */}
              <line x1="20" y1="30" x2="40" y2="30" stroke={sc} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
              <line x1="30" y1="20" x2="30" y2="40" stroke={sc} strokeWidth="0.8" strokeDasharray="2 2" opacity="0.5" />
              {/* Center LED */}
              <circle cx="30" cy="30" r="4" fill={sc} opacity="0.8" style={{ filter: `drop-shadow(0 0 4px ${sc})` }} />
              {/* Smoke particles */}
              {status !== 'clear' && Array.from({ length: 8 }, (_, i) => {
                const angle = (i / 8) * Math.PI * 2;
                const dist = 10 + (i % 3) * 4;
                return <circle key={i} cx={30 + dist * Math.cos(angle)} cy={30 + dist * Math.sin(angle)} r={1.5 + (i % 2)} fill="#ffffff" opacity={hazeOpacity * 0.8} />;
              })}
            </svg>
            {/* Haze overlay */}
            {status !== 'clear' && (
              <div style={{
                position: 'absolute', inset: 0, borderRadius: '50%',
                background: `radial-gradient(circle, rgba(200,200,200,${hazeOpacity}) 0%, transparent 70%)`,
              }} />
            )}
          </div>
        </div>
        {/* Readings */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Density</Lbl>
            <M style={{ fontSize: 18, fontWeight: 800, color: sc }}>{smokeDensity.toFixed(0)}</M>
            <M style={{ fontSize: 8, color: X.textMut, marginLeft: 3 }}>ug/m3</M>
          </div>
          <div>
            <Lbl style={{ marginBottom: 3 }}>Threshold</Lbl>
            <Prog value={animDensity} color={sc} h={4} />
            <M style={{ fontSize: 8, color: X.textMut, marginTop: 2 }}>{smokeDensity.toFixed(0)} / {threshold}</M>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Visibility</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{Math.max(0.1, 10 - smokeDensity / 10).toFixed(1)} km</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>PM2.5</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: sc }}>{(smokeDensity * 0.8).toFixed(0)}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>AQI</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: smokeDensity > 35 ? X.amber : X.teal }}>{Math.round(smokeDensity * 1.5)}</M></div>
      </div>
    </Card>
  );
}

// ── Canopy Density ──────────────────────────────────────────────────
export function CanopyDensity({ title = 'Canopy Density', ndviValue = 0.72, coverPct = 68 }: { title?: string; ndviValue?: number; coverPct?: number } = {}) {
  const X = getX();
  const n = neo();
  const cover = Math.max(0, Math.min(100, coverPct));
  const animCover = useAnim(cover);
  const ndvi = Math.max(-1, Math.min(1, ndviValue));
  const healthColor = ndvi > 0.6 ? X.teal : ndvi > 0.3 ? X.amber : X.red;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={healthColor}>{ndvi > 0.6 ? 'HEALTHY' : ndvi > 0.3 ? 'MODERATE' : 'STRESSED'}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        {/* Tree silhouette with density fill */}
        <div style={{ background: n.metal, borderRadius: 10, boxShadow: n.bezel, padding: 8, flexShrink: 0 }}>
          <svg viewBox="0 0 100 120" style={{ width: 110, height: 130, display: 'block' }}>
            <defs>
              <clipPath id="cd-tree">
                <path d="M50,8 L75,40 L65,40 L82,65 L70,65 L88,95 L12,95 L30,65 L18,65 L35,40 L25,40 Z" />
              </clipPath>
              <linearGradient id="cd-fill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor="#22c55e" stopOpacity="0.9" />
                <stop offset="50%" stopColor="#4ade80" stopOpacity="0.7" />
                <stop offset="100%" stopColor="#86efac" stopOpacity="0.4" />
              </linearGradient>
            </defs>
            {/* Tree outline */}
            <path d="M50,8 L75,40 L65,40 L82,65 L70,65 L88,95 L12,95 L30,65 L18,65 L35,40 L25,40 Z"
              fill={X.bg} stroke={X.borderLight} strokeWidth="1" />
            {/* Density fill (from bottom up based on coverPct) */}
            <rect x="0" y={8 + 87 * (1 - animCover / 100)} width="100" height={87 * (animCover / 100)}
              fill="url(#cd-fill)" clipPath="url(#cd-tree)"
              style={{ transition: `y 600ms ${ease.sp}, height 600ms ${ease.sp}` }} />
            {/* Trunk */}
            <rect x="44" y="95" width="12" height="18" rx="2" fill="#8B5E3C" opacity="0.7" />
            {/* NDVI value */}
            <text x="50" y="58" textAnchor="middle" fontFamily={X.m} fontSize="10" fontWeight="800" fill="#fff" style={{ textShadow: '0 1px 3px rgba(0,0,0,0.5)' }}>
              {(ndvi).toFixed(2)}
            </text>
            <text x="50" y="68" textAnchor="middle" fontFamily={X.m} fontSize="5" fill="#ffffffcc">NDVI</text>
          </svg>
        </div>
        {/* Stats */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          <div style={{ background: X.bg, borderRadius: 6, boxShadow: n.concave, padding: 8 }}>
            <Lbl style={{ marginBottom: 3 }}>Cover</Lbl>
            <M style={{ fontSize: 20, fontWeight: 800, color: healthColor }}>{cover.toFixed(0)}%</M>
            <Prog value={cover} color={healthColor} h={3} />
          </div>
          <div style={{ background: X.bg, borderRadius: 6, boxShadow: n.concave, padding: 8 }}>
            <Lbl style={{ marginBottom: 3 }}>NDVI Index</Lbl>
            <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
              {/* Mini NDVI bar */}
              {Array.from({ length: 10 }, (_, i) => {
                const threshold = (i / 10);
                const active = ndvi >= threshold;
                const bc = threshold > 0.6 ? '#22c55e' : threshold > 0.3 ? X.amber : X.red;
                return <div key={i} style={{
                  width: 8, height: 6 + i * 2, borderRadius: 2,
                  background: active ? bc : X.bgAlt, opacity: active ? 0.8 : 0.3,
                  transition: `background 200ms ${ease.mv}`,
                }} />;
              })}
            </div>
          </div>
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>LAI</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{(ndvi * 5).toFixed(1)}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Biomass</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: healthColor }}>{(cover * 1.8).toFixed(0)} t/ha</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Change</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>+2.1%</M></div>
      </div>
    </Card>
  );
}

// ── Weather Risk ────────────────────────────────────────────────────
export function WeatherRisk({ title = 'Weather Risk', windKph = 28, humidityPct = 35, tempC = 32 }: { title?: string; windKph?: number; humidityPct?: number; tempC?: number } = {}) {
  const X = getX();
  const n = neo();
  const windPct = Math.min(100, (windKph / 80) * 100);
  const humPct = Math.max(0, Math.min(100, humidityPct));
  const tempPct = Math.min(100, (tempC / 50) * 100);
  const animWind = useAnim(windPct);
  const animHum = useAnim(humPct);
  const animTemp = useAnim(tempPct);

  const gauges = [
    { label: 'WIND', value: windKph, unit: 'kph', pct: animWind, color: windKph > 50 ? X.red : windKph > 30 ? X.amber : X.teal },
    { label: 'HUMIDITY', value: humidityPct, unit: '%', pct: animHum, color: humidityPct < 20 ? X.red : humidityPct < 40 ? X.amber : X.teal },
    { label: 'TEMP', value: tempC, unit: '°C', pct: animTemp, color: tempC > 38 ? X.red : tempC > 30 ? X.amber : X.teal },
  ];

  const overallRisk = (windPct + (100 - humPct) + tempPct) / 3;
  const riskColor = overallRisk > 70 ? X.red : overallRisk > 45 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={riskColor}>{overallRisk > 70 ? 'DANGER' : overallRisk > 45 ? 'ELEVATED' : 'NORMAL'}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginBottom: 12 }}>
        {gauges.map((g, i) => {
          const angle = -135 + (g.pct / 100) * 270;
          return (
            <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
              <div style={{ width: 85, height: 85, borderRadius: '50%', background: n.metal, boxShadow: n.bezel, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <div style={{ width: 72, height: 72, borderRadius: '50%', background: X.bg, boxShadow: n.concave }}>
                  <svg viewBox="0 0 60 60" style={{ width: '100%', height: '100%' }}>
                    {/* Track */}
                    <path d={describeArc(30, 30, 22, -135, 135)} fill="none" stroke={X.borderLight} strokeWidth="3" strokeLinecap="round" />
                    {/* Value arc */}
                    <path d={describeArc(30, 30, 22, -135, -135 + (g.pct / 100) * 270)} fill="none" stroke={g.color} strokeWidth="3" strokeLinecap="round"
                      style={{ transition: `d 400ms ${ease.sp}`, filter: `drop-shadow(0 0 2px ${g.color}40)` }} />
                    {/* Needle */}
                    <line x1="30" y1="30" x2={30 + 16 * Math.cos(angle * Math.PI / 180)} y2={30 + 16 * Math.sin(angle * Math.PI / 180)}
                      stroke={g.color} strokeWidth="1.2" strokeLinecap="round"
                      style={{ transition: `x2 400ms ${ease.sp}, y2 400ms ${ease.sp}` }} />
                    <circle cx="30" cy="30" r="2" fill={g.color} />
                    {/* Value */}
                    <text x="30" y="42" textAnchor="middle" fontFamily={X.m} fontSize="7" fontWeight="800" fill={g.color}>{g.value}</text>
                    <text x="30" y="48" textAnchor="middle" fontFamily={X.m} fontSize="4" fill={X.textMut}>{g.unit}</text>
                  </svg>
                </div>
              </div>
              <Lbl style={{ marginBottom: 0 }}>{g.label}</Lbl>
            </div>
          );
        })}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Composite</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: riskColor }}>{overallRisk.toFixed(0)}%</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Dew Point</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{(tempC - ((100 - humidityPct) / 5)).toFixed(0)}°C</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Wind Dir</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textMut }}>NW</M></div>
      </div>
    </Card>
  );
}

// ── Watch Tower ─────────────────────────────────────────────────────
export function WatchTower({ title = 'Watch Towers', towerCount = 9 }: { title?: string; towerCount?: number } = {}) {
  const X = getX();
  const n = neo();
  const count = Math.max(1, Math.min(16, towerCount));
  const tick = useTick(3000);

  // Deterministic tower statuses
  const statuses = Array.from({ length: count }, (_, i) => {
    if (i === 2) return 'offline' as const;
    if (i === 5) return 'alert' as const;
    return 'active' as const;
  });

  const activeCount = statuses.filter(s => s === 'active').length;
  const alertCount = statuses.filter(s => s === 'alert').length;
  const offlineCount = statuses.filter(s => s === 'offline').length;

  const statusColor = (s: 'active' | 'alert' | 'offline') =>
    s === 'active' ? X.teal : s === 'alert' ? X.amber : X.red;

  const cols = Math.ceil(Math.sqrt(count));

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          {offlineCount > 0 && <Dot c={X.red} pulse s={6} />}
          <Badge color={offlineCount > 0 ? X.red : alertCount > 0 ? X.amber : X.teal}>
            {activeCount}/{count} ONLINE
          </Badge>
        </div>
      </div>
      <div style={{ background: n.metal, borderRadius: 8, boxShadow: n.bezel, padding: 12, marginBottom: 10 }}>
        <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 8 }}>
          {statuses.map((s, i) => {
            const c = statusColor(s);
            return (
              <div key={i} style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4,
                padding: 6, borderRadius: 6, background: X.bg, boxShadow: n.concave,
              }}>
                <svg viewBox="0 0 32 32" style={{ width: 28, height: 28 }}>
                  {/* Camera body */}
                  <rect x="8" y="10" width="16" height="10" rx="2" fill={c} opacity={s === 'offline' ? 0.3 : 0.7}
                    style={{ filter: s === 'active' ? `drop-shadow(0 0 2px ${c}60)` : 'none' }} />
                  {/* Lens */}
                  <circle cx="16" cy="15" r="3.5" fill={X.bg} stroke={c} strokeWidth="1" opacity={s === 'offline' ? 0.3 : 0.8} />
                  <circle cx="16" cy="15" r="1.5" fill={c} opacity={s === 'offline' ? 0.2 : 0.9} />
                  {/* Indicator LED */}
                  <circle cx="22" cy="12" r="1.2" fill={s === 'active' ? '#22c55e' : s === 'alert' ? X.amber : X.red}
                    style={{ filter: `drop-shadow(0 0 2px ${c})` }} />
                  {/* Mount */}
                  <rect x="14" y="20" width="4" height="6" fill={X.textMut} opacity="0.4" />
                  <rect x="10" y="26" width="12" height="2" rx="1" fill={X.textMut} opacity="0.3" />
                </svg>
                <M style={{ fontSize: 7, fontWeight: 700, color: c }}>T-{String(i + 1).padStart(2, '0')}</M>
              </div>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.teal} s={5} /><M style={{ fontSize: 9, color: X.textSec }}>Active {activeCount}</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.amber} s={5} /><M style={{ fontSize: 9, color: X.textSec }}>Alert {alertCount}</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={X.red} s={5} /><M style={{ fontSize: 9, color: X.textSec }}>Offline {offlineCount}</M>
        </div>
      </div>
    </Card>
  );
}

// ── Tree Inventory ──────────────────────────────────────────────────
export function TreeInventory({ title = 'Tree Inventory', totalTrees = 14200, speciesCount = 8, timberVolume = 3400 }: { title?: string; totalTrees?: number; speciesCount?: number; timberVolume?: number } = {}) {
  const X = getX();
  const n = neo();

  const species = [
    { name: 'Pine', pct: 32, color: '#22c55e' },
    { name: 'Oak', pct: 24, color: X.teal },
    { name: 'Birch', pct: 18, color: X.indigo },
    { name: 'Spruce', pct: 14, color: X.amber },
    { name: 'Maple', pct: 8, color: X.purple },
    { name: 'Other', pct: 4, color: X.textMut },
  ].slice(0, Math.min(speciesCount, 6));

  // Normalize percentages
  const totalPct = species.reduce((s, sp) => s + sp.pct, 0);
  const normalized = species.map(sp => ({ ...sp, pct: (sp.pct / totalPct) * 100 }));

  // Donut chart arcs
  let cumAngle = 0;
  const arcs = normalized.map(sp => {
    const start = cumAngle;
    const sweep = (sp.pct / 100) * 360;
    cumAngle += sweep;
    return { ...sp, startAngle: start - 90, endAngle: start + sweep - 90 };
  });

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{speciesCount} SPECIES</Badge>
      </div>
      <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 12 }}>
        {/* Donut chart */}
        <div style={{ flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: 120, height: 120 }}>
            {arcs.map((arc, i) => {
              const r = 36;
              const circumference = 2 * Math.PI * r;
              const startOffset = (arc.startAngle / 360) * circumference;
              const dashLength = ((arc.endAngle - arc.startAngle) / 360) * circumference;
              return (
                <circle key={i} cx="50" cy="50" r={r} fill="none"
                  stroke={arc.color} strokeWidth="12" strokeLinecap="butt"
                  strokeDasharray={`${dashLength} ${circumference - dashLength}`}
                  strokeDashoffset={-startOffset}
                  transform="rotate(-90 50 50)"
                  style={{ filter: `drop-shadow(0 0 2px ${arc.color}30)` }} />
              );
            })}
            {/* Center text */}
            <text x="50" y="46" textAnchor="middle" fontFamily={X.m} fontSize="10" fontWeight="800" fill={X.textBright}>
              {totalTrees >= 1000 ? `${(totalTrees / 1000).toFixed(1)}k` : totalTrees}
            </text>
            <text x="50" y="56" textAnchor="middle" fontFamily={X.m} fontSize="5" fill={X.textMut}>TREES</text>
          </svg>
        </div>
        {/* Legend */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }}>
          {normalized.map((sp, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: sp.color, flexShrink: 0 }} />
              <M style={{ fontSize: 9, color: X.textSec, flex: 1 }}>{sp.name}</M>
              <M style={{ fontSize: 9, fontWeight: 700, color: X.textBright }}>{sp.pct.toFixed(0)}%</M>
            </div>
          ))}
        </div>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: `1px solid ${X.borderLight}`, paddingTop: 8 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Total</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.teal }}>{totalTrees.toLocaleString()}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Volume</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.amber }}>{timberVolume.toLocaleString()} m3</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Density</Lbl><M style={{ fontSize: 10, fontWeight: 700, color: X.textSec }}>{(totalTrees / 50).toFixed(0)}/ha</M></div>
      </div>
    </Card>
  );
}
