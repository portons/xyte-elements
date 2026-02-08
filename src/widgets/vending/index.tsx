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

// ── Product Grid ────────────────────────────────────────────────────
export function ProductGrid({ title = 'Planogram', rows = 4, cols = 5 }: { title?: string; rows?: number; cols?: number } = {}) {
  const X = getX();
  const n = neo();
  const r = Math.min(Math.max(rows, 2), 6);
  const c = Math.min(Math.max(cols, 3), 8);

  // Generate stock levels per slot (0-10)
  const slots = Array.from({ length: r * c }, (_, i) => {
    const seed = ((i * 7 + 13) % 11);
    return seed;
  });

  const getSlotColor = (level: number) => {
    if (level <= 1) return X.red;
    if (level <= 3) return X.amber;
    return X.teal;
  };

  const emptyCount = slots.filter(s => s <= 1).length;
  const lowCount = slots.filter(s => s > 1 && s <= 3).length;
  const totalSlots = r * c;
  const avgStock = Math.round((slots.reduce((a, b) => a + b, 0) / totalSlots / 10) * 100);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={emptyCount > 3 ? X.red : emptyCount > 0 ? X.amber : X.teal}>
          {emptyCount > 0 ? `${emptyCount} Empty` : 'Full'}
        </Badge>
      </div>

      {/* Grid */}
      <div style={{
        padding: 10, borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${c}, 1fr)`,
          gap: 4,
        }}>
          {slots.map((level, i) => {
            const color = getSlotColor(level);
            const row = Math.floor(i / c);
            const col = i % c;
            const label = String.fromCharCode(65 + row) + (col + 1);
            return (
              <div key={i} style={{
                aspectRatio: '1', borderRadius: 4,
                background: color + '18',
                border: `1px solid ${color}40`,
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', justifyContent: 'center', gap: 1,
                animation: `fu 100ms ${ease.o} ${i * 15}ms both`,
                position: 'relative',
              }}>
                <M style={{ fontSize: 7, color: X.textMut, fontFamily: 'monospace' }}>{label}</M>
                <M style={{ fontSize: 11, fontWeight: 800, color: color }}>{level}</M>
                {/* Fill indicator bar at bottom */}
                <div style={{
                  position: 'absolute', bottom: 2, left: 3, right: 3, height: 2,
                  borderRadius: 1, background: X.borderLight,
                }}>
                  <div style={{
                    height: '100%', borderRadius: 1,
                    width: `${(level / 10) * 100}%`,
                    background: color,
                    transition: `width 300ms ${ease.o}`,
                  }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Legend and stats */}
      <div style={{ display: 'flex', gap: 6 }}>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: 6,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          display: 'flex', alignItems: 'center', gap: 8, justifyContent: 'center',
        }}>
          {([
            [X.teal, 'Full'],
            [X.amber, 'Low'],
            [X.red, 'Empty'],
          ] as [string, string][]).map(([color, label], i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
              <div style={{ width: 8, height: 8, borderRadius: 2, background: color + '40', border: `1px solid ${color}60` }} />
              <M style={{ fontSize: 7, color: X.textMut }}>{label}</M>
            </div>
          ))}
        </div>
        <div style={{
          padding: '6px 12px', borderRadius: 6,
          background: n.metal, boxShadow: n.raised, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 1 }}>Avg Stock</Lbl>
          <M style={{ fontSize: 13, fontWeight: 800, color: avgStock > 70 ? X.teal : X.amber, display: 'block' }}>
            {avgStock}%
          </M>
        </div>
      </div>
    </Card>
  );
}

// ── Cash Level ──────────────────────────────────────────────────────
export function CashLevel({ title = 'Cash Level', coinsPct = 65, billsPct = 42, changePct = 78 }: { title?: string; coinsPct?: number; billsPct?: number; changePct?: number } = {}) {
  const X = getX();
  const n = neo();
  const animCoins = useAnim(coinsPct, 1000);
  const animBills = useAnim(billsPct, 1100);
  const animChange = useAnim(changePct, 1200);

  const categories = [
    { label: 'Coins', pct: coinsPct, anim: animCoins, icon: 'coin', color: X.amber },
    { label: 'Bills', pct: billsPct, anim: animBills, icon: 'bill', color: X.teal },
    { label: 'Change', pct: changePct, anim: animChange, icon: 'change', color: X.indigo },
  ];

  const getColor = (pct: number, base: string) =>
    pct > 90 ? X.red : pct > 70 ? X.amber : base;

  const anyFull = categories.some(c => c.pct > 90);
  const statusColor = anyFull ? X.red : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{anyFull ? 'Near Full' : 'Normal'}</Badge>
      </div>

      {/* Stacked bars */}
      <div style={{
        padding: 10, borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 200 100" style={{ width: '100%', height: 120, display: 'block' }}>
          {categories.map((cat, i) => {
            const barX = 30 + i * 60;
            const barW = 40;
            const barH = 75;
            const barY = 10;
            const fillH = (cat.anim / 100) * barH;
            const fillColor = getColor(cat.pct, cat.color);

            return (
              <g key={i}>
                {/* Bar background */}
                <rect x={barX} y={barY} width={barW} height={barH} rx="4"
                  fill={X.borderLight} opacity=".3" />

                {/* Fill level */}
                <rect x={barX} y={barY + barH - fillH} width={barW} height={fillH} rx="4"
                  fill={fillColor} opacity=".5"
                  style={{ transition: `y 800ms ${ease.o}, height 800ms ${ease.o}` }}>
                </rect>

                {/* Glass highlight */}
                <rect x={barX + 4} y={barY + 2} width={8} height={barH - 4} rx="2"
                  fill="white" opacity=".04" />

                {/* Percentage label */}
                <text x={barX + barW / 2} y={barY + barH / 2 + 3}
                  textAnchor="middle" fontSize="8" fontWeight="800"
                  fill={X.text} fontFamily="monospace">
                  {Math.round(cat.anim)}%
                </text>

                {/* Category label */}
                <text x={barX + barW / 2} y={barY + barH + 12}
                  textAnchor="middle" fontSize="5" fill={X.textMut} fontFamily="monospace">
                  {cat.label}
                </text>

                {/* Warning threshold line */}
                <line x1={barX - 2} y1={barY + barH * 0.1}
                  x2={barX + barW + 2} y2={barY + barH * 0.1}
                  stroke={X.red} strokeWidth=".4" strokeDasharray="2,2" opacity=".5" />
              </g>
            );
          })}

          {/* 90% threshold label */}
          <text x="25" y={10 + 75 * 0.1 + 1.5} fontSize="3.5" fill={X.red} fontFamily="monospace" textAnchor="end" opacity=".6">
            90%
          </text>
        </svg>
      </div>

      {/* Status indicators */}
      <div style={{ display: 'flex', gap: 6 }}>
        {categories.map((cat, i) => {
          const c = getColor(cat.pct, cat.color);
          return (
            <div key={i} style={{
              flex: 1, padding: '6px 8px', borderRadius: 6,
              background: n.metal, boxShadow: n.raised, textAlign: 'center',
              animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, marginBottom: 3 }}>
                <Dot c={c} s={5} pulse={cat.pct > 85} />
                <Lbl style={{ marginBottom: 0 }}>{cat.label}</Lbl>
              </div>
              <M style={{ fontSize: 13, fontWeight: 700, color: c, display: 'block' }}>
                {Math.round(cat.anim)}%
              </M>
            </div>
          );
        })}
      </div>
    </Card>
  );
}

// ── Sales Tracker ───────────────────────────────────────────────────
export function SalesTracker({ title = 'Sales Tracker', revenueToday = 342.50, revenueYesterday = 289.00, unitsToday = 87 }: { title?: string; revenueToday?: number; revenueYesterday?: number; unitsToday?: number } = {}) {
  const X = getX();
  const n = neo();
  const animToday = useAnim(revenueToday, 1000);
  const animYesterday = useAnim(revenueYesterday, 1100);

  const maxRev = Math.max(revenueToday, revenueYesterday) * 1.2;
  const revChange = revenueYesterday > 0 ? ((revenueToday - revenueYesterday) / revenueYesterday) * 100 : 0;
  const changeColor = revChange >= 0 ? X.teal : X.red;

  // Hourly breakdown (simplified: 8 hours of data)
  const hours = ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM', '4PM'];
  const todayHourly = [18, 42, 55, 72, 48, 35, 45, 27];
  const yestHourly = [12, 35, 48, 60, 52, 40, 30, 12];
  const maxHourly = Math.max(...todayHourly, ...yestHourly) * 1.2;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={changeColor}>
          {revChange >= 0 ? '+' : ''}{revChange.toFixed(1)}%
        </Badge>
      </div>

      {/* Bar chart */}
      <div style={{
        padding: 10, borderRadius: 8,
        background: X.bgAlt, boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox="0 0 220 90" style={{ width: '100%', height: 110, display: 'block' }}>
          {/* Grid lines */}
          {[0, 0.25, 0.5, 0.75, 1].map((p, i) => (
            <line key={i} x1="25" y1={10 + p * 60} x2="210" y2={10 + p * 60}
              stroke={X.borderLight} strokeWidth=".2" strokeDasharray="2,2" />
          ))}

          {/* Bars for each hour */}
          {hours.map((h, i) => {
            const groupX = 30 + i * 23;
            const barW = 8;
            const todayH = (todayHourly[i] / maxHourly) * 60;
            const yestH = (yestHourly[i] / maxHourly) * 60;

            return (
              <g key={i}>
                {/* Yesterday bar */}
                <rect x={groupX} y={10 + 60 - yestH} width={barW} height={yestH} rx="2"
                  fill={X.textMut} opacity=".25"
                  style={{ transition: `y 600ms ${ease.o}, height 600ms ${ease.o}` }} />

                {/* Today bar */}
                <rect x={groupX + barW + 2} y={10 + 60 - todayH} width={barW} height={todayH} rx="2"
                  fill={X.teal} opacity=".6"
                  style={{ transition: `y 600ms ${ease.o}, height 600ms ${ease.o}`,
                    filter: `drop-shadow(0 0 2px ${X.teal}30)` }} />

                {/* Hour label */}
                <text x={groupX + barW} y="80" textAnchor="middle" fontSize="3.5"
                  fill={X.textMut} fontFamily="monospace">{h}</text>
              </g>
            );
          })}

          {/* Legend */}
          <rect x="30" y="85" width="8" height="4" rx="1" fill={X.textMut} opacity=".25" />
          <text x="41" y="88.5" fontSize="3.5" fill={X.textMut} fontFamily="monospace">Yesterday</text>
          <rect x="80" y="85" width="8" height="4" rx="1" fill={X.teal} opacity=".6" />
          <text x="91" y="88.5" fontSize="3.5" fill={X.teal} fontFamily="monospace">Today</text>
        </svg>
      </div>

      {/* Revenue summary */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Today', `$${animToday.toFixed(0)}`, X.teal],
          ['Yesterday', `$${animYesterday.toFixed(0)}`, X.textSec],
          ['Units', `${unitsToday}`, X.indigo],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '6px 8px', borderRadius: 6,
            background: n.metal, boxShadow: n.raised, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
            <M style={{ fontSize: 14, fontWeight: 800, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Connectivity Status ─────────────────────────────────────────────
export function ConnectivityStatus({ title = 'Connectivity', signalStrength = 72, connectionType = 'cellular' as 'cellular' | 'wifi', lastHeartbeat = 15 }: { title?: string; signalStrength?: number; connectionType?: 'cellular' | 'wifi'; lastHeartbeat?: number } = {}) {
  const X = getX();
  const n = neo();
  const animSignal = useAnim(signalStrength, 1000);
  const tick = useTick(1000);

  const signalColor = signalStrength > 70 ? X.teal : signalStrength > 40 ? X.amber : X.red;
  const heartbeatColor = lastHeartbeat < 60 ? X.teal : lastHeartbeat < 300 ? X.amber : X.red;

  // Number of active bars (out of 4)
  const activeBars = signalStrength > 75 ? 4 : signalStrength > 50 ? 3 : signalStrength > 25 ? 2 : signalStrength > 5 ? 1 : 0;

  // Heartbeat pulse animation (ECG-like)
  const pulsePhase = (tick % 20) / 20;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={signalColor}>
          {connectionType === 'cellular' ? 'LTE' : 'WiFi'} {signalStrength}%
        </Badge>
      </div>

      <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
        {/* Signal bars */}
        <div style={{
          padding: '14px 16px', borderRadius: 8,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8,
        }}>
          <svg viewBox="0 0 60 50" style={{ width: 70, height: 55, display: 'block' }}>
            {/* 4 signal bars */}
            {[0, 1, 2, 3].map(i => {
              const barH = 12 + i * 9;
              const barX = 6 + i * 14;
              const isActive = i < activeBars;
              return (
                <rect key={i} x={barX} y={48 - barH} width="10" height={barH} rx="2"
                  fill={isActive ? signalColor : X.borderLight}
                  opacity={isActive ? '.7' : '.3'}
                  style={{ filter: isActive ? `drop-shadow(0 0 2px ${signalColor}30)` : 'none' }} />
              );
            })}

            {/* Connection type icon */}
            {connectionType === 'wifi' ? (
              <g transform="translate(30, 3)">
                {[12, 8, 4].map((r, i) => (
                  <path key={i}
                    d={`M${-r} ${r * 0.6} A ${r} ${r} 0 0 1 ${r} ${r * 0.6}`}
                    fill="none" stroke={i < (activeBars > 1 ? 3 : 1) ? signalColor : X.borderLight}
                    strokeWidth="1.5" opacity={i < activeBars ? '.7' : '.3'} />
                ))}
                <circle cx="0" cy="12" r="1.5" fill={signalColor} />
              </g>
            ) : (
              <text x="30" y="8" textAnchor="middle" fontSize="5" fontWeight="700"
                fill={signalColor} fontFamily="monospace">LTE</text>
            )}
          </svg>

          <M style={{ fontSize: 20, fontWeight: 800, color: signalColor, display: 'block' }}>
            {Math.round(animSignal)}%
          </M>
          <Lbl>Signal</Lbl>
        </div>

        {/* Heartbeat and details */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Heartbeat pulse visualization */}
          <div style={{
            padding: 8, borderRadius: 6,
            background: X.bgAlt, boxShadow: n.concave,
          }}>
            <Lbl style={{ marginBottom: 4 }}>Heartbeat</Lbl>
            <svg viewBox="0 0 150 35" style={{ width: '100%', height: 35, display: 'block' }}>
              {/* ECG-style line */}
              <polyline
                points="0,18 20,18 30,18 35,5 40,30 45,10 50,18 70,18 80,18 85,5 90,30 95,10 100,18 120,18 130,18 135,5 140,30 145,10 150,18"
                fill="none" stroke={heartbeatColor} strokeWidth="1" opacity=".6"
                strokeLinejoin="round" strokeLinecap="round" />

              {/* Sweep indicator */}
              <line x1={pulsePhase * 150} y1="0" x2={pulsePhase * 150} y2="35"
                stroke={heartbeatColor} strokeWidth=".8" opacity=".3" />
            </svg>
          </div>

          {/* Connection details */}
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          }}>
            {([
              ['Type', connectionType === 'cellular' ? 'Cellular LTE' : 'WiFi 802.11ac', signalColor],
              ['Last Ping', `${lastHeartbeat}s ago`, heartbeatColor],
              ['Uptime', '99.7%', X.teal],
            ] as [string, string, string][]).map(([label, val, c], i) => (
              <div key={i} style={{
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                padding: '3px 0',
                borderTop: i > 0 ? `1px solid ${X.borderLight}` : 'none',
              }}>
                <M style={{ fontSize: 8, color: X.textMut }}>{label}</M>
                <M style={{ fontSize: 9, fontWeight: 700, color: c }}>{val}</M>
              </div>
            ))}
          </div>

          {/* Status dot row */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '4px 8px', borderRadius: 6,
            background: n.metal, boxShadow: n.raised,
          }}>
            <Dot c={heartbeatColor} s={7} pulse />
            <M style={{ fontSize: 9, fontWeight: 600, color: heartbeatColor }}>
              {lastHeartbeat < 60 ? 'Connected' : lastHeartbeat < 300 ? 'Degraded' : 'Offline'}
            </M>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Temp Zone ───────────────────────────────────────────────────────
export function TempZone({ title = 'Temp Zone', currentTemp = 3.2, minTemp = 1, maxTemp = 7 }: { title?: string; currentTemp?: number; minTemp?: number; maxTemp?: number } = {}) {
  const X = getX();
  const n = neo();
  const animTemp = useAnim(currentTemp, 1000);

  const inRange = currentTemp >= minTemp && currentTemp <= maxTemp;
  const tempColor = !inRange ? X.red : currentTemp > (maxTemp - 1) ? X.amber : X.teal;

  // Thermometer dimensions
  const thermY = 8, thermH = 100, thermBulbR = 12;
  const displayMin = -5, displayMax = 15;
  const displayRange = displayMax - displayMin;

  // Convert temp to Y position (inverted: higher temp = higher position = lower Y)
  const tempToY = (t: number) => thermY + thermH - ((t - displayMin) / displayRange) * thermH;

  const currentY = tempToY(currentTemp);
  const minY = tempToY(minTemp);
  const maxY = tempToY(maxTemp);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={tempColor}>{inRange ? 'In Range' : 'Out of Range!'}</Badge>
      </div>

      <div style={{ display: 'flex', gap: 14 }}>
        {/* Vertical thermometer */}
        <div style={{
          padding: '10px 12px', borderRadius: 8,
          background: n.metal, boxShadow: n.bezel,
          display: 'flex', justifyContent: 'center',
        }}>
          <svg viewBox="0 0 60 140" style={{ width: 70, height: 160, display: 'block' }}>
            <defs>
              <linearGradient id="vend-therm-bg" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor={X.border} stopOpacity=".3" />
                <stop offset="50%" stopColor={X.bgAlt} stopOpacity=".15" />
                <stop offset="100%" stopColor={X.border} stopOpacity=".3" />
              </linearGradient>
              <linearGradient id="vend-therm-fill" x1="0" y1="1" x2="0" y2="0">
                <stop offset="0%" stopColor={tempColor} stopOpacity=".7" />
                <stop offset="100%" stopColor={tempColor} stopOpacity=".3" />
              </linearGradient>
            </defs>

            {/* Tube */}
            <rect x="22" y={thermY} width="16" height={thermH} rx="8"
              fill="url(#vend-therm-bg)" stroke={X.border} strokeWidth=".6" />

            {/* Acceptable range band (green zone) */}
            <rect x="23" y={maxY} width="14" height={minY - maxY} rx="0"
              fill={X.teal} opacity=".12" />
            <line x1="22" y1={maxY} x2="38" y2={maxY} stroke={X.teal} strokeWidth=".5" strokeDasharray="2,1" />
            <line x1="22" y1={minY} x2="38" y2={minY} stroke={X.teal} strokeWidth=".5" strokeDasharray="2,1" />

            {/* Mercury / fill level */}
            <clipPath id="vend-therm-clip">
              <rect x="23" y={thermY + 1} width="14" height={thermH - 2} rx="7" />
            </clipPath>
            <rect x="23" y={currentY} width="14" height={thermY + thermH - currentY}
              fill="url(#vend-therm-fill)" clipPath="url(#vend-therm-clip)"
              style={{ transition: `y 800ms ${ease.o}, height 800ms ${ease.o}` }} />

            {/* Bulb at bottom */}
            <circle cx="30" cy={thermY + thermH + thermBulbR - 2} r={thermBulbR}
              fill={tempColor} opacity=".5"
              style={{ filter: `drop-shadow(0 0 4px ${tempColor}40)` }} />
            <circle cx="30" cy={thermY + thermH + thermBulbR - 2} r={thermBulbR - 3}
              fill={tempColor} opacity=".7" />

            {/* Scale markings */}
            {[-5, 0, 5, 10, 15].map((t, i) => {
              const y = tempToY(t);
              return (
                <g key={i}>
                  <line x1="39" y1={y} x2="43" y2={y} stroke={X.textMut} strokeWidth=".4" />
                  <text x="46" y={y + 1.5} fontSize="4" fill={X.textMut} fontFamily="monospace">
                    {t}\u00b0
                  </text>
                </g>
              );
            })}

            {/* Current temp indicator arrow */}
            <polygon points={`18,${currentY} 22,${currentY - 2.5} 22,${currentY + 2.5}`}
              fill={tempColor}
              style={{ transition: `points 800ms ${ease.o}`, filter: `drop-shadow(0 0 2px ${tempColor}40)` }} />

            {/* Range labels */}
            <text x="15" y={maxY + 1.5} fontSize="3.5" fill={X.teal} fontFamily="monospace" textAnchor="end">
              max
            </text>
            <text x="15" y={minY + 1.5} fontSize="3.5" fill={X.teal} fontFamily="monospace" textAnchor="end">
              min
            </text>
          </svg>
        </div>

        {/* Temperature details */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Current temp display */}
          <div style={{
            padding: '12px 14px', borderRadius: 8,
            background: n.metal, boxShadow: n.concave, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 4 }}>Current Temperature</Lbl>
            <M style={{ fontSize: 32, fontWeight: 800, color: tempColor, display: 'block' }}>
              {animTemp.toFixed(1)}\u00b0C
            </M>
          </div>

          {/* Acceptable range */}
          <div style={{
            padding: '8px 10px', borderRadius: 6,
            background: X.bgAlt, border: `1px solid ${inRange ? X.teal + '40' : X.red + '40'}`,
          }}>
            <Lbl style={{ marginBottom: 4 }}>Acceptable Range</Lbl>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <M style={{ fontSize: 14, fontWeight: 700, color: X.teal }}>{minTemp}\u00b0C</M>
              <div style={{ flex: 1, margin: '0 8px' }}>
                <Prog value={inRange ? 100 : 0} color={inRange ? X.teal : X.red} h={3} />
              </div>
              <M style={{ fontSize: 14, fontWeight: 700, color: X.teal }}>{maxTemp}\u00b0C</M>
            </div>
          </div>

          {/* Compliance status */}
          <div style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 10px', borderRadius: 6,
            background: n.metal, boxShadow: n.raised,
          }}>
            <Dot c={tempColor} s={8} pulse={!inRange} />
            <div>
              <M style={{ fontSize: 10, fontWeight: 700, color: tempColor, display: 'block' }}>
                {inRange ? 'Compliant' : 'NON-COMPLIANT'}
              </M>
              <M style={{ fontSize: 7, color: X.textMut }}>
                {inRange ? 'Temperature within limits' : 'Immediate action required'}
              </M>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

// ── Service Alert ───────────────────────────────────────────────────
export function ServiceAlert({ title = 'Service Alerts', alerts = 3 }: { title?: string; alerts?: number } = {}) {
  const X = getX();
  const n = neo();
  const count = Math.min(Math.max(alerts, 0), 6);

  const alertDefs = [
    { type: 'Coin Box Full', severity: 'critical' as const, code: 'ERR-201', time: '2m ago' },
    { type: 'Slot A3 Jammed', severity: 'warning' as const, code: 'ERR-105', time: '18m ago' },
    { type: 'Row B Low Stock', severity: 'info' as const, code: 'INF-042', time: '1h ago' },
    { type: 'Bill Validator Error', severity: 'critical' as const, code: 'ERR-310', time: '2h ago' },
    { type: 'Door Sensor Trip', severity: 'warning' as const, code: 'WRN-088', time: '3h ago' },
    { type: 'Compressor Cycle', severity: 'info' as const, code: 'INF-015', time: '4h ago' },
  ].slice(0, count);

  const severityColors = {
    critical: X.red,
    warning: X.amber,
    info: X.indigo,
  };

  const criticalCount = alertDefs.filter(a => a.severity === 'critical').length;
  const warningCount = alertDefs.filter(a => a.severity === 'warning').length;
  const statusColor = criticalCount > 0 ? X.red : warningCount > 0 ? X.amber : X.teal;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={statusColor}>{count} Alert{count !== 1 ? 's' : ''}</Badge>
      </div>

      {/* Alert count summary */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 10 }}>
        {([
          ['Critical', criticalCount, X.red],
          ['Warning', warningCount, X.amber],
          ['Info', alertDefs.filter(a => a.severity === 'info').length, X.indigo],
        ] as [string, number, string][]).map(([label, cnt, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '5px 8px', borderRadius: 6,
            background: cnt > 0 ? c + '12' : X.bgAlt,
            border: `1px solid ${cnt > 0 ? c + '30' : X.borderLight}`,
            textAlign: 'center',
          }}>
            <M style={{ fontSize: 16, fontWeight: 800, color: cnt > 0 ? c : X.textMut, display: 'block' }}>
              {cnt}
            </M>
            <M style={{ fontSize: 7, color: X.textMut }}>{label}</M>
          </div>
        ))}
      </div>

      {/* Alert list */}
      <div style={{
        borderRadius: 8, overflow: 'hidden',
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        {count === 0 ? (
          <div style={{ padding: '16px 12px', textAlign: 'center' }}>
            <Dot c={X.teal} s={8} pulse />
            <M style={{ fontSize: 10, color: X.teal, display: 'block', marginTop: 6 }}>
              All Clear - No Active Alerts
            </M>
          </div>
        ) : (
          alertDefs.map((alert, i) => {
            const c = severityColors[alert.severity];
            return (
              <div key={i} style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 10px',
                borderTop: i > 0 ? `1px solid ${X.borderLight}` : 'none',
                animation: `fu 120ms ${ease.o} ${i * 40}ms both`,
              }}>
                {/* Severity indicator */}
                <div style={{
                  width: 3, height: 28, borderRadius: 2,
                  background: c,
                  boxShadow: `0 0 4px ${c}40`,
                }} />

                {/* Alert info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 5, marginBottom: 2 }}>
                    <Dot c={c} s={5} pulse={alert.severity === 'critical'} />
                    <M style={{ fontSize: 10, fontWeight: 700, color: X.text }}>{alert.type}</M>
                  </div>
                  <M style={{ fontSize: 8, color: X.textMut }}>{alert.code}</M>
                </div>

                {/* Severity badge and time */}
                <div style={{ textAlign: 'right', flexShrink: 0 }}>
                  <Badge color={c} style={{ fontSize: 7, padding: '1px 5px', marginBottom: 2 }}>
                    {alert.severity.toUpperCase()}
                  </Badge>
                  <M style={{ fontSize: 7, color: X.textMut, display: 'block' }}>{alert.time}</M>
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}
