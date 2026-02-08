import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useTick } from '../hooks';

function neo() { const X = getX(); const dark = X.bg + '40'; const light = '#ffffff12'; return { raised: '4px 4px 10px ' + dark + ', -2px -2px 6px ' + light, concave: 'inset 3px 3px 8px ' + dark + ', inset -2px -2px 5px ' + light, bezel: 'inset 0 1px 0 ' + light + ', inset 0 -1px 0 rgba(0,0,0,0.3), 0 2px 8px ' + dark, metal: 'linear-gradient(135deg, ' + X.surface + ', ' + X.bgAlt + ' 40%, ' + X.surface + ' 60%, ' + X.bgAlt + ')' }; }

// -- Nixie Tube Display ------------------------------------------------
export function NixieTubeDisplay({ title = 'Nixie Display', digits = 6 } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(1000);

  const displayNumber = tick % Math.pow(10, digits);
  const digitStr = String(displayNumber).padStart(digits, '0');
  const allDigits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  const nixieOrange = '#ff8c00';

  return (
    <Card style={{ width: 350 }} glow={nixieOrange}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={nixieOrange}>COUNTING</Badge>
      </div>

      {/* Tubes row */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 10 }}>
        {digitStr.split('').map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            {/* Glass envelope */}
            <div style={{
              width: 38, height: 60, borderRadius: '10px 10px 4px 4px',
              border: `1px solid ${X.textMut}25`,
              background: `radial-gradient(ellipse at 50% 60%, ${nixieOrange}12 0%, ${nixieOrange}06 40%, ${X.bg}cc 80%)`,
              position: 'relative', overflow: 'hidden',
              boxShadow: `inset 0 0 12px ${nixieOrange}08, ${n.concave}`,
            }}>
              {/* Ghost cathode digits */}
              {allDigits.map(g => (
                <span key={g} style={{
                  position: 'absolute',
                  top: '50%', left: '50%',
                  transform: 'translate(-50%, -50%)',
                  fontFamily: X.m, fontSize: 28, fontWeight: 700,
                  color: `${X.textMut}08`,
                  lineHeight: 1,
                  userSelect: 'none',
                }}>{g}</span>
              ))}

              {/* Active digit */}
              <span style={{
                position: 'absolute',
                top: '50%', left: '50%',
                transform: 'translate(-50%, -50%)',
                fontFamily: X.m, fontSize: 28, fontWeight: 700,
                color: nixieOrange,
                textShadow: `0 0 8px ${nixieOrange}80, 0 0 16px ${nixieOrange}40, 0 0 24px ${nixieOrange}20`,
                lineHeight: 1,
                zIndex: 2,
              }}>{d}</span>

              {/* Wire mesh lines */}
              {[0.25, 0.42, 0.58, 0.75].map((pos, wi) => (
                <div key={wi} style={{
                  position: 'absolute', top: `${pos * 100}%`, left: 2, right: 2,
                  height: 1, background: `${X.textMut}1e`, zIndex: 3,
                }} />
              ))}

              {/* Warm core glow layers */}
              <div style={{
                position: 'absolute', top: '45%', left: '50%',
                width: 20, height: 20,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${nixieOrange}18 0%, transparent 70%)`,
                zIndex: 1, pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', top: '45%', left: '50%',
                width: 34, height: 34,
                transform: 'translate(-50%, -50%)',
                borderRadius: '50%',
                background: `radial-gradient(circle, ${nixieOrange}0c 0%, transparent 70%)`,
                zIndex: 1, pointerEvents: 'none',
              }} />
              <div style={{
                position: 'absolute', inset: 0,
                background: `radial-gradient(ellipse at 50% 55%, ${nixieOrange}06 0%, transparent 60%)`,
                zIndex: 0, pointerEvents: 'none',
              }} />
            </div>

            {/* Base with pins */}
            <div style={{
              width: 30, height: 8, borderRadius: '0 0 3px 3px',
              background: n.metal, boxShadow: n.raised,
              border: `1px solid ${X.borderLight}`,
              borderTop: 'none',
            }} />
            <div style={{ display: 'flex', gap: 4, marginTop: 2 }}>
              {[0, 1].map(p => (
                <div key={p} style={{
                  width: 2, height: 6, borderRadius: 1,
                  background: `${X.textMut}40`,
                }} />
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Counter readout */}
      <div style={{
        padding: '6px 10px', borderRadius: X.rs,
        background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <Lbl>Counter</Lbl>
        <M style={{ fontSize: 12, fontWeight: 700, color: nixieOrange, fontVariantNumeric: 'tabular-nums' }}>{digitStr}</M>
      </div>
    </Card>
  );
}

// -- Toggle Switch Bank ------------------------------------------------
export function ToggleSwitchBank({ title = 'Switch Bank' } = {}) {
  const X = getX();
  const n = neo();
  const [switches, setSwitches] = useState([false, true, true, false, true, false, false, true]);

  const toggle = (idx: number) => {
    setSwitches(prev => { const next = [...prev]; next[idx] = !next[idx]; return next; });
  };

  const decValue = switches.reduce((acc, v, i) => acc + (v ? 1 << (7 - i) : 0), 0);
  const binStr = switches.map(v => v ? '1' : '0').join('');
  const hexStr = decValue.toString(16).toUpperCase().padStart(2, '0');
  const octStr = decValue.toString(8).padStart(3, '0');

  return (
    <Card style={{ width: 350 }} glow={X.teal}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.teal}>{decValue}</Badge>
      </div>

      {/* Metal faceplate */}
      <div style={{
        padding: '14px 10px 10px',
        borderRadius: X.rs,
        background: n.metal,
        boxShadow: n.raised,
        border: `1px solid ${X.borderLight}`,
        marginBottom: 10,
      }}>
        {/* Label strip */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 6 }}>
          {switches.map((_, i) => (
            <M key={i} style={{ fontSize: 7, fontWeight: 700, color: X.textMut, width: 30, textAlign: 'center' }}>
              D{7 - i}
            </M>
          ))}
        </div>

        {/* LED indicators */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 8 }}>
          {switches.map((on, i) => (
            <div key={i} style={{
              width: 8, height: 8, borderRadius: '50%',
              background: on ? X.teal : `${X.textMut}20`,
              boxShadow: on ? `0 0 6px ${X.teal}80, 0 0 12px ${X.teal}30` : 'none',
              transition: `background 100ms ${ease.mv}, box-shadow 100ms ${ease.mv}`,
            }} />
          ))}
        </div>

        {/* Toggle switches */}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {switches.map((on, i) => (
            <div key={i} onClick={() => toggle(i)} style={{
              width: 30, height: 44, cursor: 'pointer',
              display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
              position: 'relative',
            }}>
              {/* Track */}
              <div style={{
                width: 10, height: 30, borderRadius: 5,
                background: X.bgAlt,
                boxShadow: n.concave,
                position: 'relative',
              }}>
                {/* Bat handle */}
                <div style={{
                  position: 'absolute',
                  left: '50%', width: 14, height: 20, borderRadius: 3,
                  background: `linear-gradient(180deg, ${X.text}cc, ${X.textMut}80)`,
                  boxShadow: n.raised,
                  transform: on
                    ? 'translate(-50%, -6px) rotateX(0deg)'
                    : 'translate(-50%, 16px) rotateX(180deg)',
                  transition: `transform 100ms cubic-bezier(.4,0,.2,1)`,
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Readouts */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 6,
      }}>
        {[
          { label: 'BIN', value: binStr, color: X.teal },
          { label: 'HEX', value: '0x' + hexStr, color: X.indigo },
          { label: 'OCT', value: '0o' + octStr, color: X.purple },
          { label: 'DEC', value: String(decValue), color: X.amber },
        ].map((r, i) => (
          <div key={i} style={{
            padding: '5px 6px', borderRadius: X.rs,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 2 }}>{r.label}</Lbl>
            <M style={{ fontSize: r.label === 'BIN' ? 7 : 10, fontWeight: 700, color: r.color, fontVariantNumeric: 'tabular-nums' }}>{r.value}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// -- Mag Tape Reel -----------------------------------------------------
export function MagTapeReel({ title = 'Tape Drive' } = {}) {
  const X = getX();
  const n = neo();
  const [mode, setMode] = useState<'stop' | 'play' | 'rewind'>('play');
  const tick = useTick(40);
  const [tapePos, setTapePos] = useState(35);

  const spinning = mode !== 'stop';
  const supplyAngle = spinning ? (mode === 'rewind' ? tick * 8 : tick * 2) : 0;
  const takeupAngle = spinning ? (mode === 'rewind' ? tick * 3 : tick * 7) : 0;

  // Tension arm angle based on mode
  const tensionAngle = mode === 'play' ? -15 : mode === 'rewind' ? 25 : 5;

  // Tape position counter
  const counter = spinning ? (mode === 'rewind' ? Math.max(0, 999 - (tick % 1000)) : tick % 1000) : tapePos;

  const spokeCount = 6;
  const reelRadius = 36;
  const hubRadius = 12;

  const renderSpokes = (cx: number, cy: number, angle: number) => {
    const spokes = [];
    for (let s = 0; s < spokeCount; s++) {
      const a = ((s * 360) / spokeCount + angle) * (Math.PI / 180);
      const x1 = cx + Math.cos(a) * hubRadius;
      const y1 = cy + Math.sin(a) * hubRadius;
      const x2 = cx + Math.cos(a) * (reelRadius - 4);
      const y2 = cy + Math.sin(a) * (reelRadius - 4);
      spokes.push(
        <line key={s} x1={x1} y1={y1} x2={x2} y2={y2}
          stroke={X.textMut} strokeWidth="2" strokeOpacity="0.5" />
      );
    }
    return spokes;
  };

  return (
    <Card style={{ width: 350 }} glow={X.indigo}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={mode === 'play' ? X.teal : mode === 'rewind' ? X.amber : X.textMut}>
          {mode === 'play' ? 'PLAY' : mode === 'rewind' ? 'REW' : 'STOP'}
        </Badge>
      </div>

      {/* Tape SVG */}
      <svg id="retro-tape" viewBox="0 0 300 150" style={{ width: '100%', height: 140, display: 'block', marginBottom: 8 }}>
        <defs>
          <radialGradient id="retro-tape-reel-g">
            <stop offset="0%" stopColor={X.surface} />
            <stop offset="100%" stopColor={X.bgAlt} />
          </radialGradient>
        </defs>

        {/* Background panel */}
        <rect x="10" y="5" width="280" height="140" rx="6" fill={X.bgAlt} stroke={X.borderLight} strokeWidth="1" />

        {/* Supply reel (left) */}
        <circle cx="85" cy="70" r={reelRadius} fill="url(#retro-tape-reel-g)" stroke={X.border} strokeWidth="1.5" />
        <circle cx="85" cy="70" r={hubRadius} fill={X.bg} stroke={X.borderLight} strokeWidth="1" />
        {renderSpokes(85, 70, supplyAngle)}
        <circle cx="85" cy="70" r={reelRadius - 2} fill="none" stroke={X.textMut} strokeWidth="0.5" strokeOpacity="0.3" />

        {/* Take-up reel (right) */}
        <circle cx="215" cy="70" r={reelRadius} fill="url(#retro-tape-reel-g)" stroke={X.border} strokeWidth="1.5" />
        <circle cx="215" cy="70" r={hubRadius} fill={X.bg} stroke={X.borderLight} strokeWidth="1" />
        {renderSpokes(215, 70, takeupAngle)}
        <circle cx="215" cy="70" r={reelRadius - 2} fill="none" stroke={X.textMut} strokeWidth="0.5" strokeOpacity="0.3" />

        {/* Tape path */}
        <path
          d={`M ${85 + reelRadius} 70 Q 120 115, 150 115 Q 180 115, ${215 - reelRadius} 70`}
          fill="none" stroke={X.amber} strokeWidth="2" strokeOpacity="0.6"
        />

        {/* Head assembly */}
        <rect x="143" y="108" width="14" height="18" rx="2" fill={X.surface} stroke={X.border} strokeWidth="1" />
        <line x1="147" y1="112" x2="147" y2="122" stroke={X.textMut} strokeWidth="0.5" />
        <line x1="153" y1="112" x2="153" y2="122" stroke={X.textMut} strokeWidth="0.5" />

        {/* Tension arm */}
        <g transform={`rotate(${tensionAngle}, 185, 115)`} style={{ transition: `transform 300ms ${ease.mv}` }}>
          <line x1="185" y1="115" x2="195" y2="95" stroke={X.textMut} strokeWidth="1.5" />
          <circle cx="195" cy="95" r="3" fill={X.surface} stroke={X.border} strokeWidth="1" />
        </g>

        {/* Speed indicator text */}
        <text x="150" y="20" textAnchor="middle" fill={X.textMut} fontSize="7" fontFamily={X.m} opacity="0.6">
          {mode === 'play' ? '7.5 IPS FWD' : mode === 'rewind' ? 'HIGH SPEED REW' : 'STOPPED'}
        </text>
      </svg>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
        <Btn small color={X.amber} ghost={mode !== 'rewind'} active={mode === 'rewind'}
          onClick={() => setMode(mode === 'rewind' ? 'stop' : 'rewind')}>REW</Btn>
        <Btn small color={X.red} ghost={mode !== 'stop'} active={mode === 'stop'}
          onClick={() => setMode('stop')}>STOP</Btn>
        <Btn small color={X.teal} ghost={mode !== 'play'} active={mode === 'play'}
          onClick={() => setMode(mode === 'play' ? 'stop' : 'play')}>PLAY</Btn>
      </div>

      {/* Tape position counter */}
      <div style={{
        display: 'flex', justifyContent: 'center', gap: 2, padding: '6px 0',
        background: X.bgAlt, borderRadius: X.rs, border: `1px solid ${X.borderLight}`,
      }}>
        <Lbl style={{ marginRight: 8, alignSelf: 'center' }}>COUNTER</Lbl>
        {String(counter).padStart(4, '0').split('').map((ch, i) => (
          <div key={i} style={{
            width: 18, height: 22, borderRadius: 2,
            background: X.bg, border: `1px solid ${X.borderLight}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden',
          }}>
            <M style={{ fontSize: 14, fontWeight: 800, color: X.text, fontVariantNumeric: 'tabular-nums' }}>{ch}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// -- Core Memory Grid --------------------------------------------------
export function CoreMemoryGrid({ title = 'Core Memory' } = {}) {
  const X = getX();
  const n = neo();
  const nixieOrange = '#ff8c00';

  const [cores, setCores] = useState<boolean[]>(() => {
    const arr: boolean[] = [];
    for (let i = 0; i < 64; i++) arr.push(Math.random() > 0.6);
    return arr;
  });
  const [selectedRow, setSelectedRow] = useState(0);

  const toggleCore = (idx: number) => {
    setCores(prev => { const next = [...prev]; next[idx] = !next[idx]; return next; });
  };

  const rowBits = cores.slice(selectedRow * 8, selectedRow * 8 + 8);
  const rowValue = rowBits.reduce((acc, v, i) => acc + (v ? 1 << (7 - i) : 0), 0);
  const setCount = cores.filter(Boolean).length;

  const gridSize = 8;
  const cellSize = 28;
  const coreRadius = 8;
  const holeRadius = 3;

  return (
    <Card style={{ width: 350 }} glow={nixieOrange}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={nixieOrange}>{setCount}/64 Set</Badge>
      </div>

      {/* Core grid */}
      <div style={{ position: 'relative', marginBottom: 10 }}>
        <svg id="retro-core-grid" viewBox={`-2 -2 ${gridSize * cellSize + 4} ${gridSize * cellSize + 4}`}
          style={{ width: '100%', height: gridSize * cellSize + 4, display: 'block' }}>

          {/* Threading wires - horizontal */}
          {Array.from({ length: gridSize }, (_, r) => (
            <line key={'h' + r}
              x1={0} y1={r * cellSize + cellSize / 2}
              x2={gridSize * cellSize} y2={r * cellSize + cellSize / 2}
              stroke={X.textMut} strokeWidth="0.5" strokeOpacity="0.25" />
          ))}
          {/* Threading wires - vertical */}
          {Array.from({ length: gridSize }, (_, c) => (
            <line key={'v' + c}
              x1={c * cellSize + cellSize / 2} y1={0}
              x2={c * cellSize + cellSize / 2} y2={gridSize * cellSize}
              stroke={X.textMut} strokeWidth="0.5" strokeOpacity="0.25" />
          ))}

          {/* Cores */}
          {Array.from({ length: gridSize }, (_, r) =>
            Array.from({ length: gridSize }, (_, c) => {
              const idx = r * gridSize + c;
              const isSet = cores[idx];
              const cx = c * cellSize + cellSize / 2;
              const cy = r * cellSize + cellSize / 2;
              const isSelectedRow = r === selectedRow;
              return (
                <g key={idx} onClick={() => { toggleCore(idx); setSelectedRow(r); }} style={{ cursor: 'pointer' }}>
                  {/* Outer ring (toroid) */}
                  <circle cx={cx} cy={cy} r={coreRadius}
                    fill={isSet ? `${nixieOrange}30` : `${X.textMut}15`}
                    stroke={isSet ? nixieOrange : `${X.textMut}40`}
                    strokeWidth={isSet ? 1.5 : 0.8} />
                  {/* Glow for set cores */}
                  {isSet && <circle cx={cx} cy={cy} r={coreRadius + 2}
                    fill="none" stroke={nixieOrange} strokeWidth="0.5" strokeOpacity="0.3" />}
                  {/* Inner hole */}
                  <circle cx={cx} cy={cy} r={holeRadius}
                    fill={X.bg} stroke={isSet ? `${nixieOrange}60` : `${X.textMut}20`}
                    strokeWidth="0.5" />
                  {/* Row selection highlight */}
                  {isSelectedRow && <rect x={c * cellSize} y={r * cellSize} width={cellSize} height={cellSize}
                    fill={`${X.indigo}08`} stroke="none" rx="2" />}
                </g>
              );
            })
          )}
        </svg>
      </div>

      {/* Row address and data readout */}
      <div style={{
        display: 'flex', gap: 8, alignItems: 'stretch',
      }}>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: X.rs,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
        }}>
          <Lbl style={{ marginBottom: 3 }}>Row {selectedRow} Binary</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: nixieOrange, fontVariantNumeric: 'tabular-nums', letterSpacing: '0.15em' }}>
            {rowBits.map(b => b ? '1' : '0').join('')}
          </M>
        </div>
        <div style={{
          padding: '6px 8px', borderRadius: X.rs,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          minWidth: 60, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Addr</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.indigo }}>0x{selectedRow.toString(16).toUpperCase()}{rowValue.toString(16).toUpperCase().padStart(2, '0')}</M>
        </div>
        <div style={{
          padding: '6px 8px', borderRadius: X.rs,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          minWidth: 44, textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Dec</Lbl>
          <M style={{ fontSize: 12, fontWeight: 700, color: X.teal }}>{rowValue}</M>
        </div>
      </div>
    </Card>
  );
}

// -- Punch Card Reader -------------------------------------------------
export function PunchCardReader({ title = 'Card Reader' } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(200);

  // Generate a pseudo-random punch pattern for each card
  const cardPattern = (cardIdx: number) => {
    const holes: { row: number; col: number }[] = [];
    for (let r = 0; r < 12; r++) {
      for (let c = 0; c < 20; c++) {
        const seed = (cardIdx * 257 + r * 31 + c * 17) % 97;
        if (seed < 28) holes.push({ row: r, col: c });
      }
    }
    return holes;
  };

  const currentCard = Math.floor(tick / 12);
  const cardPhase = tick % 12; // 0-11 phases of card feeding
  const cardY = 100 - (cardPhase / 11) * 120; // card translates upward

  const cardsProcessed = currentCard;
  const counterDigits = String(cardsProcessed % 1000).padStart(3, '0');

  // Decoded characters from "card"
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 +-*/=';
  const decodedLine = Array.from({ length: 16 }, (_, i) => {
    const seed = (currentCard * 41 + i * 13) % chars.length;
    return chars[seed];
  }).join('');

  const holes = cardPattern(currentCard);

  return (
    <Card style={{ width: 350 }} glow={X.amber}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>READING</Badge>
      </div>

      {/* Card feed area */}
      <div style={{
        position: 'relative', height: 120, overflow: 'hidden',
        borderRadius: X.rs, background: X.bgAlt,
        border: `1px solid ${X.borderLight}`,
        marginBottom: 8,
      }}>
        {/* Read station slot */}
        <div style={{
          position: 'absolute', top: 30, left: 0, right: 0, height: 3,
          background: X.amber, opacity: 0.5, zIndex: 3,
          boxShadow: `0 0 8px ${X.amber}40`,
        }} />
        <div style={{
          position: 'absolute', top: 28, left: 0, right: 0, height: 7,
          border: `1px solid ${X.amber}30`, borderLeft: 'none', borderRight: 'none',
          zIndex: 2,
        }} />

        {/* Punch card */}
        <div style={{
          position: 'absolute', left: 20, right: 20,
          height: 90,
          top: cardY,
          background: '#f5f0e0',
          borderRadius: 2,
          border: '1px solid #d4c9a8',
          transition: `top 180ms linear`,
          overflow: 'hidden',
        }}>
          {/* Corner cut */}
          <div style={{
            position: 'absolute', top: 0, left: 0,
            width: 8, height: 8,
            background: X.bgAlt,
            clipPath: 'polygon(0 0, 100% 0, 0 100%)',
          }} />

          {/* Punch holes */}
          {holes.map((h, i) => (
            <div key={i} style={{
              position: 'absolute',
              left: 10 + h.col * 13,
              top: 4 + h.row * 7,
              width: 8, height: 4,
              borderRadius: 1,
              background: X.bgAlt,
            }} />
          ))}
        </div>

        {/* Hopper label */}
        <M style={{
          position: 'absolute', bottom: 4, left: 8,
          fontSize: 7, color: X.textMut, opacity: 0.5,
        }}>HOPPER</M>
        <M style={{
          position: 'absolute', top: 8, left: 8,
          fontSize: 7, color: X.textMut, opacity: 0.5,
        }}>STACKER</M>
      </div>

      {/* Data readout */}
      <div style={{
        padding: '6px 8px', borderRadius: X.rs,
        background: X.bg, border: `1px solid ${X.borderLight}`,
        marginBottom: 8,
      }}>
        <Lbl style={{ marginBottom: 3 }}>Decoded Output</Lbl>
        <M style={{
          fontSize: 11, fontWeight: 600, color: X.teal,
          fontFamily: 'monospace', letterSpacing: '0.12em',
          display: 'block', overflow: 'hidden', whiteSpace: 'nowrap',
        }}>{decodedLine}</M>
      </div>

      {/* Mechanical counter + stack */}
      <div style={{ display: 'flex', gap: 8 }}>
        <div style={{
          flex: 1, padding: '6px 8px', borderRadius: X.rs,
          background: n.metal, boxShadow: n.raised,
          border: `1px solid ${X.borderLight}`,
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Lbl style={{ marginBottom: 0 }}>CARDS</Lbl>
          <div style={{ display: 'flex', gap: 2 }}>
            {counterDigits.split('').map((d, i) => (
              <div key={i} style={{
                width: 16, height: 22, borderRadius: 2,
                background: X.bg, border: `1px solid ${X.borderLight}`,
                overflow: 'hidden', position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', width: '100%',
                  display: 'flex', flexDirection: 'column', alignItems: 'center',
                  transform: `translateY(${-parseInt(d) * 22}px)`,
                  transition: `transform 150ms ${ease.mv}`,
                }}>
                  {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
                    <M key={n} style={{
                      height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: 13, fontWeight: 800, color: X.text, fontVariantNumeric: 'tabular-nums',
                    }}>{n}</M>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div style={{
          padding: '6px 10px', borderRadius: X.rs,
          background: X.bgAlt, border: `1px solid ${X.borderLight}`,
          textAlign: 'center',
        }}>
          <Lbl style={{ marginBottom: 3 }}>Stack</Lbl>
          <M style={{ fontSize: 16, fontWeight: 800, color: X.amber }}>{cardsProcessed}</M>
        </div>
      </div>
    </Card>
  );
}

// -- Blinken Lights ----------------------------------------------------
export function BlinkenLights({ title = 'Blinken Lights' } = {}) {
  const X = getX();
  const n = neo();
  const [halted, setHalted] = useState(false);
  const [stepping, setStepping] = useState(false);
  const tick = useTick(100);

  const primes = [2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37, 41, 43, 47, 53];
  const greenColor = '#22c55e';
  const amberColor = '#f59e0b';

  const getLedState = (ledIdx: number): boolean => {
    if (halted && !stepping) return false;
    const effectiveTick = stepping ? tick : tick;
    return ((effectiveTick * primes[ledIdx]) % 7) > 3;
  };

  const doStep = () => {
    setStepping(true);
    setTimeout(() => setStepping(false), 200);
  };

  const registerLabels = ['ACC', 'PC', 'IR', 'SP', 'MAR', 'MDR', 'FLAGS', 'TMP'];

  return (
    <Card style={{ width: 350 }} glow={halted ? X.red : greenColor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={halted ? X.red : greenColor}>{halted ? 'HALTED' : 'RUNNING'}</Badge>
      </div>

      {/* Metal faceplate */}
      <div style={{
        padding: '12px 10px', borderRadius: X.rs,
        background: n.metal, boxShadow: n.raised,
        border: `1px solid ${X.borderLight}`,
        marginBottom: 10,
      }}>
        {/* Register labels - top row */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 4 }}>
          {registerLabels.slice(0, 8).map((lbl, i) => (
            <M key={i} style={{
              fontSize: 6, fontWeight: 700, color: X.textMut,
              width: 30, textAlign: 'center', letterSpacing: '0.05em',
            }}>{lbl}</M>
          ))}
        </div>

        {/* Top row - green LEDs */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 4 }}>
          {Array.from({ length: 8 }, (_, i) => {
            const on = getLedState(i);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: on ? greenColor : `${greenColor}18`,
                  boxShadow: on ? `0 0 6px ${greenColor}, 0 0 12px ${greenColor}60` : `inset 0 1px 2px ${X.bg}40`,
                  border: `1px solid ${on ? greenColor : X.borderLight}`,
                  transition: `background 60ms ${ease.mv}, box-shadow 60ms ${ease.mv}`,
                }} />
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: `${X.textMut}15`, margin: '6px 0' }} />

        {/* Bottom row labels */}
        <div style={{ display: 'flex', justifyContent: 'space-around', marginBottom: 4 }}>
          {['D7', 'D6', 'D5', 'D4', 'D3', 'D2', 'D1', 'D0'].map((lbl, i) => (
            <M key={i} style={{
              fontSize: 6, fontWeight: 700, color: X.textMut,
              width: 30, textAlign: 'center',
            }}>{lbl}</M>
          ))}
        </div>

        {/* Bottom row - amber LEDs */}
        <div style={{ display: 'flex', justifyContent: 'space-around' }}>
          {Array.from({ length: 8 }, (_, i) => {
            const on = getLedState(i + 8);
            return (
              <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: 30 }}>
                <div style={{
                  width: 12, height: 12, borderRadius: '50%',
                  background: on ? amberColor : `${amberColor}18`,
                  boxShadow: on ? `0 0 6px ${amberColor}, 0 0 12px ${amberColor}60` : `inset 0 1px 2px ${X.bg}40`,
                  border: `1px solid ${on ? amberColor : X.borderLight}`,
                  transition: `background 60ms ${ease.mv}, box-shadow 60ms ${ease.mv}`,
                }} />
              </div>
            );
          })}
        </div>
      </div>

      {/* Control buttons */}
      <div style={{ display: 'flex', gap: 6, justifyContent: 'center', marginBottom: 8 }}>
        <Btn small color={X.teal} ghost={halted} active={!halted}
          onClick={() => { setHalted(false); setStepping(false); }}>RUN</Btn>
        <Btn small color={X.amber} ghost
          onClick={() => { setHalted(true); doStep(); }}
          disabled={!halted && false}>STEP</Btn>
        <Btn small color={X.red} ghost={!halted} active={halted}
          onClick={() => setHalted(true)}>HALT</Btn>
      </div>

      {/* Status readouts */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 4,
      }}>
        {[
          { lbl: 'ACC', val: halted ? '00' : ((tick * 3) % 256).toString(16).toUpperCase().padStart(2, '0') },
          { lbl: 'PC', val: halted ? String(tick % 256).padStart(3, '0') : ((tick * 2) % 4096).toString(16).toUpperCase().padStart(3, '0') },
          { lbl: 'IR', val: halted ? 'NOP' : ['LDA', 'STA', 'ADD', 'SUB', 'JMP', 'BRZ', 'HLT', 'AND'][tick % 8] },
          { lbl: 'SR', val: (halted ? '0' : ((tick % 4) > 1 ? '1' : '0')) + (halted ? '0' : ((tick % 3) > 1 ? '1' : '0')) + '00' },
        ].map((r, i) => (
          <div key={i} style={{
            padding: '4px 6px', borderRadius: X.rs,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`,
            textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 2 }}>{r.lbl}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: halted ? X.textMut : greenColor, fontVariantNumeric: 'tabular-nums' }}>{r.val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}
