import { useMemo } from 'react';
import { getX, ease, Card, Badge, Lbl, M, Dot, Prog } from '../primitives';
import { useAnim, useTick } from '../hooks';

// ── POS Analytics ───────────────────────────────────────────────────
export function POSAnalytics({ title = 'POS Analytics', currency = '$', revenue, avgTx }: {
  title?: string; currency?: string; revenue: number; avgTx: number;
}) {
  const X = getX();
  const txCount = useAnim(847, 1400);
  const hourly = useMemo(() => Array.from({ length: 24 }, (_, h) => {
    if (h < 6) return Math.random() * 120;
    if (h < 10) return 400 + Math.random() * 500;
    if (h < 14) return 800 + Math.random() * 600;
    if (h < 17) return 500 + Math.random() * 400;
    if (h < 21) return 700 + Math.random() * 500;
    return 200 + Math.random() * 200;
  }), []);
  const mx = Math.max(...hourly, 1);
  const pts = hourly.map((v, i) => `${(i / 23) * 100},${100 - (v / mx) * 85}`).join(' ');

  return (
    <Card style={{ width: 400 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal} solid><Dot c="#fff" pulse s={4} /> Live</Badge>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
        <M style={{ fontSize: 28, fontWeight: 800, color: X.teal }}>{Math.round(txCount).toLocaleString()}</M>
        <M style={{ fontSize: 10, color: X.textMut }}>transactions today</M>
      </div>
      <svg viewBox="0 0 100 100" preserveAspectRatio="none" style={{ display: 'block', width: '100%', height: 36, overflow: 'hidden', marginBottom: 10 }}>
        <defs>
          <linearGradient id="pos-g" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={X.teal} stopOpacity=".25" />
            <stop offset="100%" stopColor={X.teal} stopOpacity="0" />
          </linearGradient>
        </defs>
        <polygon points={`0,100 ${pts} 100,100`} fill="url(#pos-g)" />
        <polyline points={pts} fill="none" stroke={X.teal} strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
      </svg>
      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
        <div><Lbl style={{ marginBottom: 2 }}>Revenue</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.text }}>{currency}{Math.round(revenue).toLocaleString()}</M></div>
        <div style={{ textAlign: 'center' }}><Lbl style={{ marginBottom: 2 }}>Avg Transaction</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.purple }}>{currency}{avgTx.toFixed(2)}</M></div>
        <div style={{ textAlign: 'right' }}><Lbl style={{ marginBottom: 2 }}>Hourly Sales</Lbl><M style={{ fontSize: 11, fontWeight: 700, color: X.textSec }}>24h view</M></div>
      </div>
    </Card>
  );
}

// ── Inventory Level ─────────────────────────────────────────────────
export function InventoryLevel({ title = 'Inventory Levels', showReorderLine = true }: {
  title?: string; showReorderLine?: boolean;
} = {}) {
  const X = getX();
  const categories = useMemo(() => [
    { name: 'Electronics', stock: 342, max: 500, reorder: 100, color: X.purple },
    { name: 'Apparel', stock: 78, max: 400, reorder: 120, color: X.teal },
    { name: 'Groceries', stock: 1240, max: 2000, reorder: 500, color: X.amber },
    { name: 'Home & Garden', stock: 186, max: 300, reorder: 80, color: X.indigo },
    { name: 'Beauty', stock: 45, max: 200, reorder: 60, color: X.pink },
    { name: 'Sports', stock: 210, max: 350, reorder: 90, color: X.teal },
  ], []);
  const lowStock = categories.filter(c => c.stock <= c.reorder).length;

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        {lowStock > 0 && <Badge color={X.red}>{lowStock} Low Stock</Badge>}
      </div>
      {categories.map((cat, i) => {
        const pct = (cat.stock / cat.max) * 100;
        const reorderPct = (cat.reorder / cat.max) * 100;
        const isLow = cat.stock <= cat.reorder;
        return (
          <div key={i} style={{ marginBottom: i < categories.length - 1 ? 8 : 0, animation: `fu 150ms ${ease.o} ${i * 25}ms both` }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 3 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Dot c={isLow ? X.red : cat.color} pulse={isLow} s={5} />
                <M style={{ fontSize: 9, fontWeight: 600, color: X.text }}>{cat.name}</M>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <M style={{ fontSize: 9, fontWeight: 700, color: isLow ? X.red : cat.color }}>{cat.stock}</M>
                <M style={{ fontSize: 7, color: X.textMut }}>/ {cat.max}</M>
                {isLow && <Badge color={X.red} style={{ fontSize: 7 }}>REORDER</Badge>}
              </div>
            </div>
            <div style={{ position: 'relative', height: 4, borderRadius: 2, background: X.borderLight, overflow: 'visible' }}>
              <div style={{ height: '100%', borderRadius: 2, width: `${Math.min(pct, 100)}%`, background: isLow ? X.red : cat.color, transition: `width 500ms ${ease.sp}` }} />
              {showReorderLine && <div style={{ position: 'absolute', left: `${reorderPct}%`, top: -2, width: 1, height: 8, background: X.amber, opacity: 0.6 }} />}
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 8 }}>
        <div style={{ width: 1, height: 8, background: X.amber, opacity: 0.6 }} />
        <M style={{ fontSize: 7, color: X.textMut }}>Reorder threshold</M>
      </div>
    </Card>
  );
}

// ── Foot Traffic ────────────────────────────────────────────────────
export function FootTraffic({ title = 'Foot Traffic', maxCapacity = 300, occupancy }: {
  title?: string; maxCapacity?: number; occupancy: number;
}) {
  const X = getX();
  const hourly = useMemo(() => Array.from({ length: 24 }, (_, h) => {
    if (h < 7) return Math.floor(Math.random() * 10);
    if (h < 10) return 40 + Math.floor(Math.random() * 60);
    if (h < 14) return 120 + Math.floor(Math.random() * 80);
    if (h < 17) return 80 + Math.floor(Math.random() * 60);
    if (h < 20) return 100 + Math.floor(Math.random() * 70);
    return 20 + Math.floor(Math.random() * 30);
  }), []);
  const peakHour = hourly.indexOf(Math.max(...hourly));
  const mx = Math.max(...hourly, 1);
  const totalVisitors = useMemo(() => hourly.reduce((a, b) => a + b, 0), [hourly]);
  const occPct = Math.min((Math.round(occupancy) / maxCapacity) * 100, 100);
  const occColor = occPct > 85 ? X.red : occPct > 60 ? X.amber : X.teal;

  return (
    <Card style={{ width: 420 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={occColor}><Dot c={occColor} pulse s={4} /> {Math.round(occupancy)} / {maxCapacity}</Badge>
      </div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
        <div><Lbl style={{ marginBottom: 2 }}>Total Today</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.text }}>{totalVisitors.toLocaleString()}</M></div>
        <div><Lbl style={{ marginBottom: 2 }}>Peak Hour</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: X.purple }}>{peakHour}:00</M></div>
        <div><Lbl style={{ marginBottom: 2 }}>Occupancy</Lbl><M style={{ fontSize: 14, fontWeight: 800, color: occColor }}>{Math.round(occPct)}%</M></div>
      </div>
      <Lbl style={{ marginBottom: 4 }}>Visitors / Hour</Lbl>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 1.5, height: 40 }}>
        {hourly.map((v, i) => (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 1 }}>
            <div style={{
              width: '100%', height: `${(v / mx) * 100}%`,
              background: i === peakHour ? X.purple : X.teal,
              borderRadius: 1.5,
              opacity: i === peakHour ? 1 : 0.3 + (v / mx) * 0.6,
              transition: 'height 300ms',
              minHeight: 1,
              boxShadow: i === peakHour ? `0 0 6px ${X.purple}50` : 'none',
            }} />
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 2 }}>
        <M style={{ fontSize: 6, color: X.textMut }}>0h</M>
        <M style={{ fontSize: 6, color: X.textMut }}>6h</M>
        <M style={{ fontSize: 6, color: X.textMut }}>12h</M>
        <M style={{ fontSize: 6, color: X.textMut }}>18h</M>
        <M style={{ fontSize: 6, color: X.textMut }}>24h</M>
      </div>
      <Prog value={occPct} color={occColor} h={3} style={{ marginTop: 8 }} />
    </Card>
  );
}

// ── Queue Monitor ───────────────────────────────────────────────────
export function QueueMonitor({ title = 'Queue Monitor', longQueueThreshold = 5, r1, r2, r3, r4 }: {
  title?: string; longQueueThreshold?: number; r1: number; r2: number; r3: number; r4: number;
}) {
  const X = getX();
  const registers = useMemo(() => [
    { id: 1, name: 'Register 1', customers: 3, avgWait: 2.4 },
    { id: 2, name: 'Register 2', customers: 5, avgWait: 4.1 },
    { id: 3, name: 'Register 3', customers: 1, avgWait: 0.8 },
    { id: 4, name: 'Register 4', customers: 0, avgWait: 0 },
  ], []);
  const liveCounts = [Math.max(0, Math.round(r1)), Math.max(0, Math.round(r2)), Math.max(0, Math.round(r3)), Math.max(0, Math.round(r4))];
  const waits = [2.4, 4.1, 0.8, 0];
  const totalInQueue = liveCounts.reduce((a, b) => a + b, 0);

  const queueColor = (count: number) => count >= longQueueThreshold ? X.red : count >= Math.ceil(longQueueThreshold * 0.6) ? X.amber : count > 0 ? X.teal : X.textMut;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={totalInQueue > 10 ? X.red : X.teal}>{totalInQueue} in queue</Badge>
      </div>
      {registers.map((reg, i) => {
        const count = liveCounts[i];
        const c = queueColor(count);
        return (
          <div key={i} style={{
            padding: '7px 8px', borderRadius: X.rs, marginBottom: 3,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            border: `1px solid ${count >= longQueueThreshold ? X.red + '20' : 'transparent'}`,
            animation: `fu 150ms ${ease.o} ${i * 25}ms both`,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Dot c={count > 0 ? X.teal : X.textMut} pulse={count > 0} s={5} />
                <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{reg.name}</M>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <M style={{ fontSize: 8, color: X.textMut }}>~{waits[i].toFixed(1)}m wait</M>
                {count >= longQueueThreshold && <Badge color={X.red} style={{ fontSize: 7 }}>LONG</Badge>}
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 3, paddingLeft: 10 }}>
              {Array.from({ length: Math.min(count, 8) }, (_, j) => (
                <Dot key={j} c={c} s={7} />
              ))}
              {count === 0 && <M style={{ fontSize: 8, color: X.textMut, fontStyle: 'italic' }}>Empty</M>}
              {count > 8 && <M style={{ fontSize: 8, color: c, fontWeight: 600 }}>+{count - 8}</M>}
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <Lbl>Avg Wait (All)</Lbl>
        <M style={{ fontSize: 9, fontWeight: 700, color: X.amber }}>~{(waits.reduce((a, b) => a + b, 0) / waits.filter(w => w > 0).length || 0).toFixed(1)}m</M>
      </div>
    </Card>
  );
}

// ── Price Tag ───────────────────────────────────────────────────────
export function PriceTag({ title = 'Dynamic Pricing', currency = '$' }: {
  title?: string; currency?: string;
} = {}) {
  const X = getX();
  const products = useMemo(() => [
    { name: 'Wireless Earbuds', current: 49.99, previous: 59.99, trend: 'down' },
    { name: '4K Smart TV 55"', current: 399.00, previous: 449.00, trend: 'down' },
    { name: 'Running Shoes', current: 89.95, previous: 79.95, trend: 'up' },
    { name: 'Coffee Maker Pro', current: 129.00, previous: 159.00, trend: 'down' },
    { name: 'Organic Olive Oil', current: 12.49, previous: 11.99, trend: 'up' },
  ], []);

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{products.length} Products</Badge>
      </div>
      {products.map((p, i) => {
        const discount = ((p.previous - p.current) / p.previous * 100);
        const isDown = p.trend === 'down';
        const c = isDown ? X.teal : X.red;
        return (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px',
            borderRadius: X.rs, marginBottom: 2,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            animation: `sr 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <M style={{ fontSize: 9, fontWeight: 600, color: X.text, display: 'block', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.name}</M>
              <M style={{ fontSize: 8, color: X.textMut, textDecoration: 'line-through' }}>{currency}{p.previous.toFixed(2)}</M>
            </div>
            <M style={{ fontSize: 12, fontWeight: 800, color: X.text }}>{currency}{p.current.toFixed(2)}</M>
            <div style={{ display: 'flex', alignItems: 'center', gap: 2, minWidth: 44, justifyContent: 'flex-end' }}>
              <M style={{ fontSize: 10, color: c, fontWeight: 700 }}>{isDown ? '\u25BC' : '\u25B2'}</M>
              <Badge color={c} style={{ fontSize: 7 }}>{Math.abs(discount).toFixed(0)}%</Badge>
            </div>
          </div>
        );
      })}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 6 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><M style={{ color: X.teal, fontSize: 9 }}>{'\u25BC'}</M><M style={{ fontSize: 7, color: X.textMut }}>Price drop</M></div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 3 }}><M style={{ color: X.red, fontSize: 9 }}>{'\u25B2'}</M><M style={{ fontSize: 7, color: X.textMut }}>Price increase</M></div>
      </div>
    </Card>
  );
}

// ── Shrinkage Alert ─────────────────────────────────────────────────
export function ShrinkageAlert({ title = 'Shrinkage Alerts', severityFilter = 'all' }: {
  title?: string; severityFilter?: 'all' | 'high' | 'medium';
} = {}) {
  const X = getX();
  const tick = useTick(8000);
  const events = useMemo(() => [
    { time: '14:22', type: 'Theft', value: 89.99, location: 'Electronics Aisle', severity: 'high' },
    { time: '13:45', type: 'Damage', value: 24.50, location: 'Warehouse B', severity: 'low' },
    { time: '12:10', type: 'Admin Error', value: 312.00, location: 'Register 3', severity: 'medium' },
    { time: '11:38', type: 'Theft', value: 156.00, location: 'Apparel Section', severity: 'high' },
    { time: '10:05', type: 'Damage', value: 42.75, location: 'Loading Dock', severity: 'low' },
  ], []);
  const sevColor: Record<string, string> = { high: X.red, medium: X.amber, low: X.teal };
  const typeColor: Record<string, string> = { Theft: X.red, Damage: X.amber, 'Admin Error': X.purple };
  const filtered = severityFilter === 'all' ? events : events.filter(e => e.severity === severityFilter || (severityFilter === 'medium' && e.severity === 'high'));
  const totalLoss = useMemo(() => events.reduce((a, e) => a + e.value, 0), [events]);
  const animLoss = useAnim(totalLoss, 1000);

  return (
    <Card noPad style={{ width: 400 }}>
      <div style={{ padding: '12px 14px 6px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <M style={{ fontSize: 11, fontWeight: 800, color: X.red }}>${Math.round(animLoss).toLocaleString()}</M>
          <Badge color={X.red}><Dot c={X.red} pulse s={4} /> {filtered.length}</Badge>
        </div>
      </div>
      <div style={{ padding: '0 6px 8px' }}>
        {filtered.map((e, i) => (
          <div key={i} style={{
            display: 'flex', alignItems: 'center', gap: 6, padding: '6px 8px', borderRadius: 3,
            background: i % 2 === 0 ? X.bgAlt : 'transparent',
            borderLeft: `2px solid ${sevColor[e.severity]}`,
            animation: `sr 150ms ${ease.o} ${i * 20}ms both`,
          }}>
            <M style={{ fontSize: 8, color: X.textMut, minWidth: 30 }}>{e.time}</M>
            <Badge color={typeColor[e.type]} style={{ fontSize: 7, minWidth: 52 }}>{e.type}</Badge>
            <M style={{ fontSize: 9, color: X.text, flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.location}</M>
            <M style={{ fontSize: 10, fontWeight: 700, color: X.text, minWidth: 44, textAlign: 'right' }}>${e.value.toFixed(2)}</M>
            <Badge color={sevColor[e.severity]} style={{ fontSize: 6, minWidth: 32 }}>{e.severity.toUpperCase()}</Badge>
          </div>
        ))}
      </div>
      <div style={{ padding: '0 14px 10px', display: 'flex', justifyContent: 'space-between' }}>
        {(['Theft', 'Damage', 'Admin Error'] as const).map(t => (
          <div key={t} style={{ display: 'flex', alignItems: 'center', gap: 3 }}>
            <Dot c={typeColor[t]} s={4} />
            <M style={{ fontSize: 7, color: X.textMut }}>{t}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Loyalty Dashboard ───────────────────────────────────────────────
export function LoyaltyDash({ title = 'Loyalty Program', redemptionTarget = 70, pointsDist }: {
  title?: string; redemptionTarget?: number; pointsDist: number;
}) {
  const X = getX();
  const members = useAnim(12480, 1400);
  const redemptionRate = 67;
  const animRedemption = useAnim(redemptionRate, 1200);
  const tiers = useMemo(() => [
    { name: 'Gold', count: 1240, color: X.amber, pct: 10 },
    { name: 'Silver', count: 3720, color: X.textSec, pct: 30 },
    { name: 'Bronze', count: 7520, color: X.pink, pct: 60 },
  ], []);
  const totalMembers = tiers.reduce((a, t) => a + t.count, 0);
  const redemptionColor = redemptionRate > redemptionTarget ? X.teal : redemptionRate > redemptionTarget - 30 ? X.amber : X.red;

  return (
    <Card style={{ width: 370 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.purple}>{Math.round(members / 1000).toFixed(0)}k Members</Badge>
      </div>
      <div style={{ display: 'flex', gap: 10, marginBottom: 12 }}>
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 2 }}>Total Members</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: X.text, display: 'block' }}>{Math.round(members).toLocaleString()}</M>
        </div>
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 2 }}>Points Distributed</Lbl>
          <M style={{ fontSize: 18, fontWeight: 800, color: X.purple, display: 'block' }}>{(Math.round(pointsDist) / 1000).toFixed(0)}k</M>
        </div>
      </div>
      {/* Redemption gauge */}
      <Lbl style={{ marginBottom: 6 }}>Redemption Rate</Lbl>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
        <svg viewBox="0 0 80 44" style={{ width: 80, height: 44, overflow: 'visible' }}>
          <path d="M8 40 A32 32 0 0 1 72 40" fill="none" stroke={X.borderLight} strokeWidth="5" strokeLinecap="round" />
          <path d="M8 40 A32 32 0 0 1 72 40" fill="none" stroke={redemptionColor} strokeWidth="5" strokeLinecap="round"
            strokeDasharray={`${(animRedemption / 100) * 100.5} 100.5`}
            style={{ transition: `stroke-dasharray 800ms ${ease.sp}`, filter: `drop-shadow(0 0 4px ${redemptionColor}40)` }} />
          <text x="40" y="38" textAnchor="middle" fontFamily={X.m} fontSize="14" fontWeight="800" fill={redemptionColor}>{Math.round(animRedemption)}%</text>
        </svg>
        <div style={{ flex: 1 }}>
          <M style={{ fontSize: 9, color: X.textMut, display: 'block', marginBottom: 2 }}>Points redeemed vs issued</M>
          <Prog value={animRedemption} color={redemptionColor} h={3} />
        </div>
      </div>
      {/* Tier breakdown */}
      <Lbl style={{ marginBottom: 6 }}>Tier Breakdown</Lbl>
      {tiers.map((tier, i) => (
        <div key={i} style={{ marginBottom: i < tiers.length - 1 ? 6 : 0, animation: `fu 150ms ${ease.o} ${i * 25}ms both` }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Dot c={tier.color} s={6} />
              <M style={{ fontSize: 10, fontWeight: 600, color: X.text }}>{tier.name}</M>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <M style={{ fontSize: 9, fontWeight: 700, color: tier.color }}>{tier.count.toLocaleString()}</M>
              <M style={{ fontSize: 7, color: X.textMut }}>{tier.pct}%</M>
            </div>
          </div>
          <Prog value={(tier.count / totalMembers) * 100} color={tier.color} h={3} />
        </div>
      ))}
    </Card>
  );
}
