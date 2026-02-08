import { useState } from 'react';
import { getX, ease, Card, Badge, Btn, Prog, Lbl, M, Dot } from '../primitives';
import { useAnim, useTick } from '../hooks';

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

// ── Oscilloscope ────────────────────────────────────────────────────
export function Oscilloscope({ title = 'Oscilloscope', frequency = 2 }: { title?: string; frequency?: number } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(50);

  const phosphor = '#33ff33';
  const displayW = 300;
  const displayH = 140;
  const centerY = displayH / 2;
  const amplitude = 45;
  const points = 80;

  function buildWave(t: number): string {
    const pts: string[] = [];
    for (let i = 0; i <= points; i++) {
      const x = (i / points) * displayW;
      const y = centerY + Math.sin((x / displayW) * Math.PI * 2 * frequency + t * 0.1) * amplitude;
      pts.push(`${x.toFixed(1)},${y.toFixed(1)}`);
    }
    return pts.join(' ');
  }

  return (
    <Card style={{ width: 350 }} glow={phosphor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={phosphor}>Live</Badge>
      </div>

      {/* Scope display */}
      <div style={{
        padding: 6, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
      }}>
        <div style={{
          borderRadius: 6, background: '#0a0a0a', position: 'relative', overflow: 'hidden',
          border: `1px solid ${phosphor}18`,
          boxShadow: `inset 0 0 20px rgba(0,0,0,0.8), 0 0 6px ${phosphor}12`,
        }}>
          <svg viewBox={`0 0 ${displayW} ${displayH}`} style={{ width: '100%', height: displayH, display: 'block' }}>
            <defs>
              <filter id="lab-osc-glow">
                <feGaussianBlur stdDeviation="2" result="blur" />
                <feMerge>
                  <feMergeNode in="blur" />
                  <feMergeNode in="SourceGraphic" />
                </feMerge>
              </filter>
            </defs>

            {/* Grid lines */}
            {Array.from({ length: 11 }, (_, i) => (
              <line key={`gv${i}`} x1={i * (displayW / 10)} y1="0" x2={i * (displayW / 10)} y2={displayH}
                stroke="#ffffff" strokeWidth="0.3" opacity="0.08" strokeDasharray="2 4" />
            ))}
            {Array.from({ length: 7 }, (_, i) => (
              <line key={`gh${i}`} x1="0" y1={i * (displayH / 6)} x2={displayW} y2={i * (displayH / 6)}
                stroke="#ffffff" strokeWidth="0.3" opacity="0.08" strokeDasharray="2 4" />
            ))}
            {/* Center crosshair */}
            <line x1="0" y1={centerY} x2={displayW} y2={centerY}
              stroke="#ffffff" strokeWidth="0.4" opacity="0.12" />
            <line x1={displayW / 2} y1="0" x2={displayW / 2} y2={displayH}
              stroke="#ffffff" strokeWidth="0.4" opacity="0.12" />

            {/* Afterglow trails */}
            <polyline points={buildWave(tick - 4)} fill="none" stroke={phosphor} strokeWidth="1.2" opacity="0.07" />
            <polyline points={buildWave(tick - 3)} fill="none" stroke={phosphor} strokeWidth="1.2" opacity="0.15" />
            <polyline points={buildWave(tick - 2)} fill="none" stroke={phosphor} strokeWidth="1.4" opacity="0.3" />
            <polyline points={buildWave(tick - 1)} fill="none" stroke={phosphor} strokeWidth="1.6" opacity="0.6" />

            {/* Main trace */}
            <polyline points={buildWave(tick)} fill="none" stroke={phosphor} strokeWidth="2"
              filter="url(#lab-osc-glow)" />
          </svg>
        </div>
      </div>

      {/* Readouts */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Div/Time', '1.0 ms', X.textSec],
          ['V/Div', '2.0 V', X.textSec],
          ['Freq', `${frequency} kHz`, phosphor],
          ['Trigger', 'Auto', X.amber],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '5px 6px', borderRadius: 5,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
            animation: `fu 150ms ${ease.o} ${i * 30}ms both`,
          }}>
            <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Spectrum Analyzer ───────────────────────────────────────────────
export function LabSpectrumAnalyzer({ title = 'Spectrum Analyzer' }: { title?: string } = {}) {
  const X = getX();
  const n = neo();
  const tick = useTick(120);

  const phosphor = '#33ff33';
  const barCount = 16;

  // Live bar heights (0-100)
  const barValues = [
    72, 85, 60, 90,
    45, 78, 55, 68,
    82, 40, 65, 75,
    50, 88, 58, 70,
  ];

  // Peak-hold tracking
  const [peaks, setPeaks] = useState<number[]>(() => new Array(barCount).fill(0));

  // Decay peaks over time
  if (tick >= 0) {
    const newPeaks = peaks.map((peak, i) => {
      const clamped = Math.max(0, Math.min(100, barValues[i]));
      if (clamped > peak) return clamped;
      return Math.max(clamped, peak - 1.5);
    });
    const changed = newPeaks.some((p, i) => Math.abs(p - peaks[i]) > 0.01);
    if (changed && tick % 2 === 0) {
      // Update through effect to avoid render loop
      setTimeout(() => setPeaks(newPeaks), 0);
    }
  }

  const displayW = 300;
  const displayH = 130;
  const barW = (displayW - 40) / barCount - 2;
  const freqLabels = ['31', '63', '125', '250', '500', '1k', '2k', '4k', '8k', '10k', '12k', '14k', '16k', '18k', '20k', '22k'];
  const dbLabels = ['0', '-20', '-40', '-60', '-80'];

  return (
    <Card style={{ width: 350 }} glow={phosphor}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={phosphor}>FFT</Badge>
      </div>

      {/* Analyzer display */}
      <div style={{
        padding: 6, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
      }}>
        <div style={{
          borderRadius: 6, background: '#0a0a0a', position: 'relative', overflow: 'hidden',
          border: `1px solid ${phosphor}18`,
          boxShadow: `inset 0 0 20px rgba(0,0,0,0.8), 0 0 6px ${phosphor}12`,
        }}>
          <svg viewBox={`0 0 ${displayW} ${displayH}`} style={{ width: '100%', height: displayH, display: 'block' }}>
            {/* dB scale lines */}
            {dbLabels.map((db, i) => {
              const y = 8 + i * ((displayH - 24) / (dbLabels.length - 1));
              return (
                <g key={`db${i}`}>
                  <line x1="28" y1={y} x2={displayW - 6} y2={y}
                    stroke="#ffffff" strokeWidth="0.3" opacity="0.06" strokeDasharray="1 3" />
                  <text x="24" y={y + 2} textAnchor="end" fontFamily="monospace" fontSize="5" fill={X.textMut} opacity="0.5">
                    {db}
                  </text>
                </g>
              );
            })}

            {/* Bars */}
            {barValues.map((raw, i) => {
              const val = Math.max(0, Math.min(100, raw));
              const barH = (val / 100) * (displayH - 24);
              const bx = 32 + i * (barW + 2);
              const by = displayH - 12 - barH;
              const peakY = displayH - 12 - (Math.max(0, Math.min(100, peaks[i])) / 100) * (displayH - 24);

              return (
                <g key={i}>
                  {/* Bar glow */}
                  <rect x={bx} y={by} width={barW} height={barH} rx="1"
                    fill={phosphor} opacity="0.15"
                    style={{ filter: 'blur(2px)' }} />
                  {/* Bar */}
                  <rect x={bx} y={by} width={barW} height={barH} rx="1"
                    fill={phosphor} opacity="0.85" />
                  {/* Peak hold line */}
                  <line x1={bx} y1={peakY} x2={bx + barW} y2={peakY}
                    stroke={phosphor} strokeWidth="1.2" opacity="0.9" />
                </g>
              );
            })}

            {/* Frequency labels */}
            {freqLabels.map((f, i) => {
              const bx = 32 + i * (barW + 2) + barW / 2;
              return (
                <text key={`f${i}`} x={bx} y={displayH - 2} textAnchor="middle"
                  fontFamily="monospace" fontSize="4" fill={X.textMut} opacity="0.5">
                  {i % 2 === 0 ? f : ''}
                </text>
              );
            })}
          </svg>
        </div>
      </div>

      {/* Bottom readouts */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Mode', 'FFT', X.textSec],
          ['Window', 'Hanning', X.textSec],
          ['Span', '22 kHz', phosphor],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '5px 6px', borderRadius: 5,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Function Generator ──────────────────────────────────────────────
export function FunctionGenerator({ title = 'Function Gen', freq }: { title?: string; freq: number } = {} as any) {
  const X = getX();
  const n = neo();
  const tick = useTick(60);

  const waveforms = ['sine', 'square', 'triangle', 'sawtooth'] as const;
  const [waveIdx, setWaveIdx] = useState(0);
  const selectedWave = waveforms[waveIdx];

  const knobAngle = waveIdx * 90 - 135;

  const previewW = 280;
  const previewH = 60;

  function buildWaveform(type: string, t: number): string {
    const pts: string[] = [];
    const steps = 60;
    for (let i = 0; i <= steps; i++) {
      const x = (i / steps) * previewW;
      const phase = (i / steps) * Math.PI * 2 * 3 + t * 0.08;
      let y = 0;
      if (type === 'sine') {
        y = Math.sin(phase);
      } else if (type === 'square') {
        y = Math.sin(phase) >= 0 ? 1 : -1;
      } else if (type === 'triangle') {
        y = (2 / Math.PI) * Math.asin(Math.sin(phase));
      } else if (type === 'sawtooth') {
        const p = ((phase % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
        y = (p / Math.PI) - 1;
      }
      pts.push(`${x.toFixed(1)},${(previewH / 2 - y * (previewH / 2 - 4)).toFixed(1)}`);
    }
    return pts.join(' ');
  }

  // Nixie digit rendering
  const freqStr = Math.round(Math.max(0, freq)).toString().padStart(5, ' ');

  function NixieDigit({ char, idx }: { char: string; idx: number }) {
    const nixieOrange = '#ff8c00';
    const ghostDigits = '0123456789';

    return (
      <div key={idx} style={{
        width: 26, height: 40, position: 'relative',
        borderRadius: 6,
        background: `radial-gradient(ellipse at center, #1a0800 0%, #0d0400 60%, #080200 100%)`,
        border: `1px solid ${X.borderLight}`,
        boxShadow: `inset 0 0 10px rgba(0,0,0,0.7), 0 0 3px ${nixieOrange}08`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        overflow: 'hidden',
      }}>
        {/* Wire mesh lines */}
        {[0.28, 0.42, 0.58, 0.72].map((p, li) => (
          <div key={li} style={{
            position: 'absolute', top: `${p * 100}%`, left: 0, right: 0,
            height: 1, background: '#ffffff', opacity: 0.12, pointerEvents: 'none',
          }} />
        ))}

        {/* Ghost digits behind */}
        {char.trim() && ghostDigits.split('').map((gd, gi) => (
          <span key={gi} style={{
            position: 'absolute',
            fontFamily: 'monospace', fontSize: 22, fontWeight: 700,
            color: X.textMut + '08',
            pointerEvents: 'none',
            lineHeight: 1,
          }}>{gd}</span>
        ))}

        {/* Active digit with glow */}
        {char.trim() && (
          <span style={{
            position: 'relative', zIndex: 2,
            fontFamily: 'monospace', fontSize: 22, fontWeight: 700,
            color: nixieOrange,
            textShadow: `0 0 8px ${nixieOrange}80, 0 0 16px ${nixieOrange}40, 0 0 2px ${nixieOrange}`,
            lineHeight: 1,
          }}>{char}</span>
        )}

        {/* Glass tube envelope highlight */}
        <div style={{
          position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 5,
          background: 'linear-gradient(180deg, rgba(255,255,255,0.04) 0%, transparent 30%, transparent 70%, rgba(255,255,255,0.02) 100%)',
          pointerEvents: 'none',
        }} />
      </div>
    );
  }

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{selectedWave}</Badge>
      </div>

      {/* Waveform preview */}
      <div style={{
        padding: 6, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
      }}>
        <div style={{
          borderRadius: 6, background: '#0a0a0a', overflow: 'hidden',
          border: `1px solid ${X.amber}18`,
        }}>
          <svg viewBox={`0 0 ${previewW} ${previewH}`} style={{ width: '100%', height: previewH, display: 'block' }}>
            {/* Center line */}
            <line x1="0" y1={previewH / 2} x2={previewW} y2={previewH / 2}
              stroke="#ffffff" strokeWidth="0.3" opacity="0.1" />
            {/* Waveform */}
            <polyline points={buildWaveform(selectedWave, tick)} fill="none"
              stroke={X.amber} strokeWidth="1.8" opacity="0.9"
              style={{ filter: `drop-shadow(0 0 3px ${X.amber}50)` }} />
          </svg>
        </div>
      </div>

      {/* Controls row */}
      <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 12 }}>
        {/* Rotary knob */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Lbl>Waveform</Lbl>
          <div
            onClick={() => setWaveIdx((waveIdx + 1) % waveforms.length)}
            style={{
              width: 50, height: 50, borderRadius: '50%',
              background: n.metal, boxShadow: n.bezel,
              cursor: 'pointer', position: 'relative',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: `transform 200ms ${ease.sp}`,
              transform: `rotate(${knobAngle}deg)`,
            }}
          >
            {/* Knob indicator line */}
            <div style={{
              width: 2, height: 16, borderRadius: 1,
              background: X.amber,
              position: 'absolute', top: 5,
              boxShadow: `0 0 4px ${X.amber}60`,
            }} />
            {/* Knob center dot */}
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: X.bgAlt, border: `1px solid ${X.border}`,
            }} />
          </div>
        </div>

        {/* Nixie frequency display */}
        <div style={{ flex: 1 }}>
          <Lbl style={{ marginBottom: 4 }}>Frequency (Hz)</Lbl>
          <div style={{
            display: 'flex', gap: 3, padding: '6px 8px',
            borderRadius: 8, background: '#060300',
            border: `1px solid ${X.borderLight}`,
            boxShadow: 'inset 0 0 12px rgba(0,0,0,0.8)',
          }}>
            {freqStr.split('').map((ch, i) => (
              <NixieDigit key={i} char={ch} idx={i} />
            ))}
            <div style={{
              display: 'flex', alignItems: 'flex-end', paddingBottom: 4, marginLeft: 2,
            }}>
              <M style={{ fontSize: 9, color: X.textMut }}>Hz</M>
            </div>
          </div>
        </div>
      </div>

      {/* Output info */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Amplitude', '5.0 Vpp', X.textSec],
          ['Offset', '0.0 V', X.textSec],
          ['Output', 'ON', X.teal],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '5px 6px', borderRadius: 5,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Multimeter ──────────────────────────────────────────────────────
export function Multimeter({ title = 'Multimeter', voltage }: { title?: string; voltage: number } = {} as any) {
  const X = getX();
  const n = neo();

  const modes = ['V DC', 'V AC', 'A DC', '\u03A9', 'Hz'] as const;
  const [modeIdx, setModeIdx] = useState(0);
  const selectedMode = modes[modeIdx];

  const knobAngle = -90 + modeIdx * (180 / (modes.length - 1));

  // 7-segment digit rendering via SVG paths
  // Segments: a(top), b(top-right), c(bottom-right), d(bottom), e(bottom-left), f(top-left), g(middle)
  const segmentPaths: Record<string, string> = {
    a: 'M 4,1 L 18,1 L 16,4 L 6,4 Z',
    b: 'M 19,2 L 19,14 L 17,12 L 17,5 Z',
    c: 'M 19,16 L 19,28 L 17,25 L 17,18 Z',
    d: 'M 4,29 L 18,29 L 16,26 L 6,26 Z',
    e: 'M 3,16 L 3,28 L 5,25 L 5,18 Z',
    f: 'M 3,2 L 3,14 L 5,12 L 5,5 Z',
    g: 'M 4,15 L 18,15 L 16,17.5 L 6,17.5 Z',
  };

  const digitSegments: Record<string, string[]> = {
    '0': ['a', 'b', 'c', 'd', 'e', 'f'],
    '1': ['b', 'c'],
    '2': ['a', 'b', 'd', 'e', 'g'],
    '3': ['a', 'b', 'c', 'd', 'g'],
    '4': ['b', 'c', 'f', 'g'],
    '5': ['a', 'c', 'd', 'f', 'g'],
    '6': ['a', 'c', 'd', 'e', 'f', 'g'],
    '7': ['a', 'b', 'c'],
    '8': ['a', 'b', 'c', 'd', 'e', 'f', 'g'],
    '9': ['a', 'b', 'c', 'd', 'f', 'g'],
    '-': ['g'],
    ' ': [],
  };

  function renderReading(): string {
    let v = voltage;
    if (selectedMode === 'V DC' || selectedMode === 'V AC') {
      return v.toFixed(2);
    } else if (selectedMode === 'A DC') {
      return (v * 0.08).toFixed(3);
    } else if (selectedMode === '\u03A9') {
      return (v * 82).toFixed(0);
    } else {
      return (v * 4.8).toFixed(1);
    }
  }

  function unitLabel(): string {
    if (selectedMode === 'V DC' || selectedMode === 'V AC') return 'V';
    if (selectedMode === 'A DC') return 'A';
    if (selectedMode === '\u03A9') return '\u03A9';
    return 'Hz';
  }

  const readingStr = renderReading();
  const displayChars = readingStr.replace('.', '').padStart(5, ' ').slice(0, 5);
  const dotPosition = readingStr.indexOf('.');

  const lcdDark = '#1a2a1a';
  const lcdActive = '#2d3d2d';

  // Lead connection states
  const [redLead, setRedLead] = useState(true);
  const [blackLead, setBlackLead] = useState(true);

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={X.amber}>{selectedMode}</Badge>
      </div>

      {/* LCD Display */}
      <div style={{
        padding: 8, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
      }}>
        <div style={{
          padding: '12px 16px', borderRadius: 6,
          background: `linear-gradient(180deg, #c8d8b0, #b8c8a0)`,
          boxShadow: 'inset 0 1px 3px rgba(0,0,0,0.15)',
          position: 'relative',
        }}>
          {/* Unit label */}
          <div style={{
            position: 'absolute', top: 6, right: 10,
            fontFamily: 'monospace', fontSize: 11, fontWeight: 700, color: lcdDark,
          }}>{unitLabel()}</div>

          {/* 7-segment display */}
          <div style={{ display: 'flex', gap: 4, alignItems: 'flex-end' }}>
            {displayChars.split('').map((ch, i) => {
              const activeSegs = digitSegments[ch] || [];
              const allSegs = ['a', 'b', 'c', 'd', 'e', 'f', 'g'];
              // Count chars before this one in original string to find decimal
              let charsBeforeDot = dotPosition >= 0 ? readingStr.slice(0, dotPosition).replace('.', '').length : -1;
              // Show dot after this digit position if it matches
              const rawBeforeThis = readingStr.replace('.', '').padStart(5, ' ').slice(0, i + 1);
              const showDot = dotPosition >= 0 && (i === charsBeforeDot - 1);

              return (
                <div key={i} style={{ position: 'relative' }}>
                  <svg viewBox="0 0 22 30" style={{ width: 28, height: 40, display: 'block' }}>
                    {allSegs.map((seg) => {
                      const isActive = activeSegs.includes(seg);
                      return (
                        <path key={seg} d={segmentPaths[seg]}
                          fill={isActive ? lcdDark : lcdActive + '15'}
                          opacity={isActive ? 1 : 0.25}
                        />
                      );
                    })}
                  </svg>
                  {/* Decimal point */}
                  {showDot && (
                    <div style={{
                      position: 'absolute', bottom: 2, right: -3,
                      width: 4, height: 4, borderRadius: '50%',
                      background: lcdDark,
                    }} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Rotary mode selector */}
      <div style={{ display: 'flex', gap: 14, alignItems: 'center', marginBottom: 12 }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <Lbl>Mode Select</Lbl>
          <div style={{ position: 'relative' }}>
            {/* Mode labels around knob */}
            {modes.map((m, i) => {
              const angle = (-90 + i * (180 / (modes.length - 1))) * (Math.PI / 180);
              const r = 38;
              const lx = Math.cos(angle) * r;
              const ly = Math.sin(angle) * r;
              return (
                <div key={i} style={{
                  position: 'absolute', left: 25 + lx - 12, top: 25 + ly - 5,
                  fontFamily: 'monospace', fontSize: 7, color: modeIdx === i ? X.amber : X.textMut,
                  fontWeight: modeIdx === i ? 700 : 400, width: 24, textAlign: 'center',
                  transition: `color 150ms ${ease.mv}`,
                }}>{m}</div>
              );
            })}

            <div
              onClick={() => setModeIdx((modeIdx + 1) % modes.length)}
              style={{
                width: 50, height: 50, borderRadius: '50%',
                background: n.metal, boxShadow: n.bezel,
                cursor: 'pointer', position: 'relative',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: `transform 200ms ${ease.sp}`,
                transform: `rotate(${knobAngle}deg)`,
              }}
            >
              <div style={{
                width: 2, height: 16, borderRadius: 1,
                background: X.amber,
                position: 'absolute', top: 5,
                boxShadow: `0 0 4px ${X.amber}60`,
              }} />
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: X.bgAlt, border: `1px solid ${X.border}`,
              }} />
            </div>
          </div>
        </div>

        {/* Lead indicators */}
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div
            onClick={() => setRedLead(!redLead)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: redLead ? X.red : X.red + '30',
              boxShadow: redLead ? `0 0 8px ${X.red}60` : 'none',
              transition: `background 200ms ${ease.mv}, box-shadow 200ms ${ease.mv}`,
            }} />
            <M style={{ fontSize: 10, fontWeight: 600, color: redLead ? X.text : X.textMut }}>Red Lead</M>
            <M style={{ fontSize: 8, color: redLead ? X.teal : X.textMut, marginLeft: 'auto' }}>{redLead ? 'Connected' : 'Open'}</M>
          </div>
          <div
            onClick={() => setBlackLead(!blackLead)}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '6px 10px', borderRadius: 6,
              background: X.bgAlt, border: `1px solid ${X.borderLight}`,
              cursor: 'pointer',
            }}
          >
            <div style={{
              width: 10, height: 10, borderRadius: '50%',
              background: blackLead ? '#333333' : '#33333330',
              boxShadow: blackLead ? '0 0 8px rgba(80,80,80,0.5)' : 'none',
              border: `1px solid ${blackLead ? '#666' : X.borderLight}`,
              transition: `background 200ms ${ease.mv}, box-shadow 200ms ${ease.mv}`,
            }} />
            <M style={{ fontSize: 10, fontWeight: 600, color: blackLead ? X.text : X.textMut }}>Black Lead</M>
            <M style={{ fontSize: 8, color: blackLead ? X.teal : X.textMut, marginLeft: 'auto' }}>{blackLead ? 'Connected' : 'Open'}</M>
          </div>
        </div>
      </div>

      {/* Status bar */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', padding: '5px 8px',
        borderRadius: 6, background: X.bgAlt, border: `1px solid ${X.borderLight}`,
      }}>
        <M style={{ fontSize: 8, color: X.textMut }}>Auto Range</M>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
          <Dot c={redLead && blackLead ? X.teal : X.amber} pulse={redLead && blackLead} s={5} />
          <M style={{ fontSize: 8, color: redLead && blackLead ? X.teal : X.amber, fontWeight: 600 }}>
            {redLead && blackLead ? 'Measuring' : 'Check Leads'}
          </M>
        </div>
      </div>
    </Card>
  );
}

// ── Centrifuge ───────────────────────────────────────────────────────
export function Centrifuge({ title = 'Centrifuge', rpm = 12000, temperature }: { title?: string; rpm?: number; temperature: number } = {} as any) {
  const X = getX();
  const n = neo();
  const tick = useTick(40);

  const currentRPM = rpm;
  const [timerMin] = useState(() => Math.floor(Math.random() * 10) + 5);
  const timerSec = (timerMin * 60 - (tick % (timerMin * 60)));
  const timerDisplay = `${Math.floor(timerSec / 60)}:${(timerSec % 60).toString().padStart(2, '0')}`;

  const rotorAngle = (tick * 18) % 360; // 18 degrees per tick at 40ms = fast spin
  const tubeCount = 6;
  const rotorR = 55;
  const tubeR = 16;
  const tiltAngle = Math.min(35, (Math.abs(currentRPM) / rpm) * 35);
  const blurAmount = Math.min(1.5, Math.abs(currentRPM) / rpm);

  const rpmPct = Math.min(100, (Math.abs(currentRPM) / (rpm * 1.1)) * 100);
  const animRpm = useAnim(rpmPct, 1000);
  const rpmColor = Math.abs(currentRPM) > rpm * 1.05 ? X.red : Math.abs(currentRPM) > rpm * 0.9 ? X.teal : X.amber;

  const viewSize = 180;
  const cx = viewSize / 2;
  const cy = viewSize / 2;

  const tubeColors = [X.teal, X.indigo, X.purple, X.amber, X.pink, X.red];

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Dot c={rpmColor} pulse s={7} />
          <Badge color={rpmColor}>Spinning</Badge>
        </div>
      </div>

      {/* Centrifuge top-down view */}
      <div style={{
        padding: 10, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
        display: 'flex', justifyContent: 'center',
      }}>
        <div style={{ position: 'relative', width: viewSize, height: viewSize }}>
          {/* Outer housing ring */}
          <svg viewBox={`0 0 ${viewSize} ${viewSize}`} style={{
            width: viewSize, height: viewSize, display: 'block', position: 'absolute', top: 0, left: 0,
          }}>
            <defs>
              <radialGradient id="lab-cent-housing">
                <stop offset="70%" stopColor={X.bgAlt} />
                <stop offset="100%" stopColor={X.surface} />
              </radialGradient>
              <radialGradient id="lab-cent-lid">
                <stop offset="0%" stopColor="transparent" />
                <stop offset="60%" stopColor="transparent" />
                <stop offset="85%" stopColor={X.indigo + '08'} />
                <stop offset="100%" stopColor={X.purple + '12'} />
              </radialGradient>
            </defs>
            {/* Housing */}
            <circle cx={cx} cy={cy} r="85" fill="url(#lab-cent-housing)"
              stroke={X.border} strokeWidth="1" />
          </svg>

          {/* Spinning rotor group */}
          <svg viewBox={`0 0 ${viewSize} ${viewSize}`} style={{
            width: viewSize, height: viewSize, display: 'block',
            position: 'absolute', top: 0, left: 0,
            transform: `rotate(${rotorAngle}deg)`,
            transformOrigin: `${cx}px ${cy}px`,
            filter: `blur(${blurAmount}px)`,
          }}>
            {/* Rotor disc */}
            <circle cx={cx} cy={cy} r={rotorR + 8} fill={X.bgAlt}
              stroke={X.borderLight} strokeWidth="0.5" opacity="0.6" />
            <circle cx={cx} cy={cy} r={rotorR} fill="none"
              stroke={X.border} strokeWidth="0.5" strokeDasharray="3 6" />

            {/* Center hub */}
            <circle cx={cx} cy={cy} r="10" fill={X.surface}
              stroke={X.border} strokeWidth="0.8" />
            <circle cx={cx} cy={cy} r="4" fill={X.borderLight} />

            {/* Tube holders arranged radially */}
            {Array.from({ length: tubeCount }, (_, i) => {
              const baseAngle = (i / tubeCount) * Math.PI * 2 - Math.PI / 2;
              const tx = cx + Math.cos(baseAngle) * rotorR;
              const ty = cy + Math.sin(baseAngle) * rotorR;
              const angleDeg = (baseAngle * 180) / Math.PI;

              return (
                <g key={i} transform={`rotate(${tiltAngle} ${tx} ${ty})`}>
                  {/* Tube holder arm */}
                  <line x1={cx} y1={cy} x2={tx} y2={ty}
                    stroke={X.borderLight} strokeWidth="2" opacity="0.4" />
                  {/* Tube holder slot */}
                  <circle cx={tx} cy={ty} r={tubeR / 2 + 2} fill={X.bgAlt}
                    stroke={X.border} strokeWidth="0.5" />
                  {/* Sample tube */}
                  <ellipse cx={tx} cy={ty} rx={tubeR / 2 - 1} ry={tubeR / 2}
                    fill={tubeColors[i] + '40'}
                    stroke={tubeColors[i] + '80'} strokeWidth="0.8" />
                  {/* Liquid level in tube */}
                  <ellipse cx={tx} cy={ty + 2} rx={tubeR / 2 - 3} ry={tubeR / 2 - 2}
                    fill={tubeColors[i] + '60'} />
                </g>
              );
            })}
          </svg>

          {/* Glass lid overlay */}
          <svg viewBox={`0 0 ${viewSize} ${viewSize}`} style={{
            width: viewSize, height: viewSize, display: 'block',
            position: 'absolute', top: 0, left: 0, pointerEvents: 'none',
          }}>
            <circle cx={cx} cy={cy} r="82" fill="url(#lab-cent-lid)" />
            {/* Lid rim reflection */}
            <circle cx={cx} cy={cy} r="82" fill="none"
              stroke="#ffffff" strokeWidth="0.5" opacity="0.08" />
            <ellipse cx={cx - 15} cy={cy - 20} rx="30" ry="15"
              fill="#ffffff" opacity="0.03" transform="rotate(-25 75 70)" />
          </svg>
        </div>
      </div>

      {/* RPM bar */}
      <div style={{ marginBottom: 10 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
          <Lbl style={{ marginBottom: 0 }}>RPM</Lbl>
          <M style={{ fontSize: 11, fontWeight: 800, color: rpmColor }}>
            {Math.round(Math.abs(currentRPM)).toLocaleString()}
          </M>
        </div>
        <Prog value={animRpm} color={rpmColor} h={5} />
      </div>

      {/* Bottom metrics */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['Target', `${rpm.toLocaleString()} RPM`, X.textSec],
          ['Temp', `${temperature.toFixed(1)} \u00B0C`, temperature > 6 ? X.amber : X.teal],
          ['Timer', timerDisplay, X.indigo],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '5px 6px', borderRadius: 5,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}

// ── Titration Apparatus ─────────────────────────────────────────────
export function TitrationApparatus({ title = 'Titration', pH, volume }: { title?: string; pH: number; volume: number } = {} as any) {
  const X = getX();
  const n = neo();
  const tick = useTick(80);

  // pH to color mapping
  function pHColor(p: number): string {
    if (p <= 1) return '#ff2020';
    if (p <= 3) return '#ff6020';
    if (p <= 5) return '#ddcc00';
    if (p <= 6) return '#90dd20';
    if (p <= 8) return '#20cc40';
    if (p <= 10) return '#2080dd';
    if (p <= 12) return '#4040dd';
    return '#8020cc';
  }

  function pHGradient(p: number): string {
    const c1 = pHColor(Math.floor(p));
    const c2 = pHColor(Math.ceil(p));
    return `linear-gradient(180deg, ${c1}80, ${c2}cc)`;
  }

  const currentColor = pHColor(Math.round(pH));
  const svgW = 300;
  const svgH = 220;

  // Burette dimensions
  const buretteX = 60;
  const buretteTop = 10;
  const buretteBot = 155;
  const buretteW = 14;
  const liquidLevel = buretteTop + 15 + ((50 - Math.min(50, volume)) / 50) * (buretteBot - buretteTop - 30);

  // Flask dimensions
  const flaskCx = 160;
  const flaskTop = 130;
  const flaskBot = 205;
  const flaskW = 80;
  const flaskNeckW = 16;
  const flaskFillLevel = flaskTop + 30 + (1 - Math.min(1, (50 - Math.min(50, volume)) / 50)) * 0.3 * (flaskBot - flaskTop - 30);

  // Drip animation
  const dripCycle = 40;
  const dripPhase = tick % dripCycle;
  const dripY = buretteBot + 8 + (dripPhase / dripCycle) * (flaskTop - buretteBot - 10);
  const showDrip = dripPhase < dripCycle * 0.8;

  return (
    <Card style={{ width: 350 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
        <div style={{ fontSize: 13, fontWeight: 700, color: X.text }}>{title}</div>
        <Badge color={currentColor}>pH {pH.toFixed(1)}</Badge>
      </div>

      {/* Titration scene */}
      <div style={{
        padding: 8, borderRadius: 10, background: n.metal,
        boxShadow: n.concave, marginBottom: 12,
      }}>
        <svg viewBox={`0 0 ${svgW} ${svgH}`} style={{ width: '100%', height: svgH, display: 'block' }}>
          <defs>
            <linearGradient id="lab-tit-liquid" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentColor} stopOpacity="0.3" />
              <stop offset="100%" stopColor={currentColor} stopOpacity="0.8" />
            </linearGradient>
            <linearGradient id="lab-tit-burette" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ffffff" stopOpacity="0.08" />
              <stop offset="30%" stopColor="#ffffff" stopOpacity="0.03" />
              <stop offset="70%" stopColor="#ffffff" stopOpacity="0.01" />
              <stop offset="100%" stopColor="#ffffff" stopOpacity="0.06" />
            </linearGradient>
            <linearGradient id="lab-tit-flask-fill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={currentColor} stopOpacity="0.4" />
              <stop offset="100%" stopColor={currentColor} stopOpacity="0.9" />
            </linearGradient>
            <clipPath id="lab-tit-flask-clip">
              <path d={`M ${flaskCx - flaskNeckW / 2} ${flaskTop} L ${flaskCx + flaskNeckW / 2} ${flaskTop} L ${flaskCx + flaskNeckW / 2} ${flaskTop + 25} L ${flaskCx + flaskW / 2} ${flaskBot - 10} Q ${flaskCx + flaskW / 2} ${flaskBot} ${flaskCx + flaskW / 2 - 10} ${flaskBot} L ${flaskCx - flaskW / 2 + 10} ${flaskBot} Q ${flaskCx - flaskW / 2} ${flaskBot} ${flaskCx - flaskW / 2} ${flaskBot - 10} L ${flaskCx - flaskNeckW / 2} ${flaskTop + 25} Z`} />
            </clipPath>
          </defs>

          {/* Stand/clamp */}
          <rect x={buretteX - 20} y={buretteTop - 5} width="3" height={buretteBot + 30} rx="1"
            fill={X.textMut} opacity="0.3" />
          <rect x={buretteX - 20} y={buretteTop + 5} width="30" height="3" rx="1"
            fill={X.textMut} opacity="0.3" />
          {/* Base plate */}
          <rect x={flaskCx - 50} y={flaskBot + 2} width="100" height="5" rx="2"
            fill={X.textMut} opacity="0.2" />

          {/* Burette body (glass tube) */}
          <rect x={buretteX - buretteW / 2} y={buretteTop} width={buretteW} height={buretteBot - buretteTop}
            rx="2" fill="none" stroke={X.textMut} strokeWidth="0.8" opacity="0.4" />
          {/* Glass reflection */}
          <rect x={buretteX - buretteW / 2} y={buretteTop} width={buretteW} height={buretteBot - buretteTop}
            rx="2" fill="url(#lab-tit-burette)" />

          {/* Burette liquid fill */}
          <rect x={buretteX - buretteW / 2 + 1.5} y={liquidLevel}
            width={buretteW - 3} height={buretteBot - liquidLevel - 2}
            fill={currentColor} opacity="0.5" rx="1" />

          {/* Burette scale markings */}
          {Array.from({ length: 11 }, (_, i) => {
            const my = buretteTop + 15 + i * ((buretteBot - buretteTop - 30) / 10);
            const isMajor = i % 5 === 0;
            return (
              <g key={`bm${i}`}>
                <line x1={buretteX + buretteW / 2} y1={my}
                  x2={buretteX + buretteW / 2 + (isMajor ? 8 : 4)} y2={my}
                  stroke={X.textMut} strokeWidth="0.4" opacity="0.5" />
                {isMajor && (
                  <text x={buretteX + buretteW / 2 + 10} y={my + 2}
                    fontFamily="monospace" fontSize="5" fill={X.textMut} opacity="0.6">
                    {i * 5}
                  </text>
                )}
              </g>
            );
          })}

          {/* Stopcock */}
          <rect x={buretteX - 8} y={buretteBot} width="16" height="6" rx="2"
            fill={X.bgAlt} stroke={X.border} strokeWidth="0.5" />
          <circle cx={buretteX} cy={buretteBot + 3} r="2.5"
            fill={X.surface} stroke={X.borderLight} strokeWidth="0.3" />
          {/* Stopcock handle */}
          <rect x={buretteX + 6} y={buretteBot + 1} width="10" height="4" rx="1"
            fill={X.amber} opacity="0.6" />

          {/* Drip tip */}
          <line x1={buretteX} y1={buretteBot + 6} x2={buretteX} y2={buretteBot + 12}
            stroke={X.textMut} strokeWidth="1" opacity="0.3" />

          {/* Falling droplet */}
          {showDrip && (
            <circle cx={buretteX} cy={dripY} r="2"
              fill={currentColor} opacity="0.8"
              style={{ filter: `drop-shadow(0 0 2px ${currentColor}60)` }} />
          )}

          {/* Erlenmeyer flask outline */}
          <path d={`M ${flaskCx - flaskNeckW / 2} ${flaskTop} L ${flaskCx + flaskNeckW / 2} ${flaskTop} L ${flaskCx + flaskNeckW / 2} ${flaskTop + 25} L ${flaskCx + flaskW / 2} ${flaskBot - 10} Q ${flaskCx + flaskW / 2} ${flaskBot} ${flaskCx + flaskW / 2 - 10} ${flaskBot} L ${flaskCx - flaskW / 2 + 10} ${flaskBot} Q ${flaskCx - flaskW / 2} ${flaskBot} ${flaskCx - flaskW / 2} ${flaskBot - 10} L ${flaskCx - flaskNeckW / 2} ${flaskTop + 25} Z`}
            fill="none" stroke={X.textMut} strokeWidth="0.8" opacity="0.4" />

          {/* Flask glass reflection */}
          <path d={`M ${flaskCx - flaskNeckW / 2} ${flaskTop} L ${flaskCx + flaskNeckW / 2} ${flaskTop} L ${flaskCx + flaskNeckW / 2} ${flaskTop + 25} L ${flaskCx + flaskW / 2} ${flaskBot - 10} Q ${flaskCx + flaskW / 2} ${flaskBot} ${flaskCx + flaskW / 2 - 10} ${flaskBot} L ${flaskCx - flaskW / 2 + 10} ${flaskBot} Q ${flaskCx - flaskW / 2} ${flaskBot} ${flaskCx - flaskW / 2} ${flaskBot - 10} L ${flaskCx - flaskNeckW / 2} ${flaskTop + 25} Z`}
            fill="url(#lab-tit-burette)" />

          {/* Flask liquid fill */}
          <g clipPath="url(#lab-tit-flask-clip)">
            <rect x={flaskCx - flaskW / 2} y={flaskFillLevel}
              width={flaskW} height={flaskBot - flaskFillLevel}
              fill="url(#lab-tit-flask-fill)" />
            {/* Meniscus curve */}
            <path d={`M ${flaskCx - 30} ${flaskFillLevel + 1} Q ${flaskCx} ${flaskFillLevel - 3} ${flaskCx + 30} ${flaskFillLevel + 1}`}
              fill={currentColor} opacity="0.3" />
            <path d={`M ${flaskCx - 30} ${flaskFillLevel + 1} Q ${flaskCx} ${flaskFillLevel - 3} ${flaskCx + 30} ${flaskFillLevel + 1}`}
              fill="none" stroke={currentColor} strokeWidth="0.6" opacity="0.7" />
          </g>

          {/* pH indicator color strip */}
          <rect x={svgW - 30} y={20} width="12" height={svgH - 50} rx="3"
            fill="none" stroke={X.borderLight} strokeWidth="0.5" />
          {/* pH gradient strip */}
          {Array.from({ length: 14 }, (_, i) => {
            const py = 22 + i * ((svgH - 54) / 14);
            const ph = 14 - i;
            return (
              <rect key={`phs${i}`} x={svgW - 29} y={py} width="10" height={(svgH - 54) / 14}
                fill={pHColor(ph)} opacity="0.6" rx="0" />
            );
          })}
          {/* pH marker */}
          {(() => {
            const markerY = 22 + ((14 - Math.max(1, Math.min(14, pH))) / 14) * (svgH - 54);
            return (
              <g>
                <line x1={svgW - 34} y1={markerY} x2={svgW - 30} y2={markerY}
                  stroke={currentColor} strokeWidth="1.5" />
                <text x={svgW - 38} y={markerY + 2} textAnchor="end"
                  fontFamily="monospace" fontSize="6" fontWeight="700" fill={currentColor}>
                  {pH.toFixed(1)}
                </text>
              </g>
            );
          })()}

          {/* pH scale labels */}
          {[1, 4, 7, 10, 14].map(p => {
            const ly = 22 + ((14 - p) / 14) * (svgH - 54);
            return (
              <text key={`pl${p}`} x={svgW - 17} y={ly + 2} textAnchor="start"
                fontFamily="monospace" fontSize="4" fill={X.textMut} opacity="0.5">
                {p}
              </text>
            );
          })}
        </svg>
      </div>

      {/* Readouts */}
      <div style={{ display: 'flex', gap: 6 }}>
        {([
          ['pH', pH.toFixed(2), currentColor],
          ['Volume', `${volume.toFixed(1)} mL`, X.textSec],
          ['Endpoint', pH >= 6.5 && pH <= 7.5 ? 'Near' : 'Titrating', pH >= 6.5 && pH <= 7.5 ? X.teal : X.amber],
        ] as [string, string, string][]).map(([label, val, c], i) => (
          <div key={i} style={{
            flex: 1, padding: '5px 6px', borderRadius: 5,
            background: X.bgAlt, border: `1px solid ${X.borderLight}`, textAlign: 'center',
          }}>
            <Lbl style={{ marginBottom: 2 }}>{label}</Lbl>
            <M style={{ fontSize: 10, fontWeight: 700, color: c, display: 'block' }}>{val}</M>
          </div>
        ))}
      </div>
    </Card>
  );
}
