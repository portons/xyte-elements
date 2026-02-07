/**
 * Shared mock data generators matching real device-widgets patterns.
 * These align with convertWidgetFormToWidgetProps output shapes.
 */

// ── Spline Chart Data ─────────────────────────────────────────────────
export interface SplineDataPoint {
  timestamp: number;
  [key: string]: number;
}

export function mockSplineData(
  measurements: string[],
  points = 24,
  baseValues?: Record<string, number>,
): SplineDataPoint[] {
  const now = Date.now();
  const hour = 3600000;
  return Array.from({ length: points }, (_, i) => {
    const entry: SplineDataPoint = { timestamp: now - (points - 1 - i) * hour };
    for (const m of measurements) {
      const base = baseValues?.[m] ?? 50;
      entry[m] = base + (Math.random() - 0.5) * base * 0.4;
    }
    return entry;
  });
}

// ── Scatter Chart Data ────────────────────────────────────────────────
export interface ScatterDataPoint {
  timestamp: number;
  event: string;
  value: number;
}

export function mockScatterData(events: string[], points = 30): ScatterDataPoint[] {
  const now = Date.now();
  const hour = 3600000;
  return Array.from({ length: points }, (_, i) => ({
    timestamp: now - (points - 1 - i) * hour * (0.5 + Math.random()),
    event: events[Math.floor(Math.random() * events.length)],
    value: Math.random() * 100,
  }));
}

// ── Timeline Data ─────────────────────────────────────────────────────
export type TimelineStatus = 'online' | 'degraded' | 'offline' | 'maintenance';

export interface TimelineSegment {
  status: TimelineStatus;
  startTime: number;
  endTime: number;
}

export function mockTimelineData(
  hours = 24,
  segmentCount = 8,
): TimelineSegment[] {
  const now = Date.now();
  const totalMs = hours * 3600000;
  const segmentMs = totalMs / segmentCount;
  const statuses: TimelineStatus[] = ['online', 'online', 'online', 'degraded', 'online', 'online', 'maintenance', 'online'];

  return Array.from({ length: segmentCount }, (_, i) => ({
    status: statuses[i % statuses.length],
    startTime: now - totalMs + i * segmentMs,
    endTime: now - totalMs + (i + 1) * segmentMs,
  }));
}

// ── Measurement Config (matching MeasurementType) ─────────────────────
export interface MockMeasurement {
  key: string;
  label: string;
  unit: string;
  color: string;
}

export const MOCK_MEASUREMENTS: MockMeasurement[] = [
  { key: 'temperature', label: 'Temperature', unit: '°C', color: '#FF5252' },
  { key: 'humidity', label: 'Humidity', unit: '%', color: '#448AFF' },
  { key: 'cpu_usage', label: 'CPU Usage', unit: '%', color: '#7C4DFF' },
  { key: 'memory_usage', label: 'Memory', unit: '%', color: '#536DFE' },
  { key: 'signal_strength', label: 'Signal', unit: 'dBm', color: '#00BFA5' },
  { key: 'power_draw', label: 'Power', unit: 'W', color: '#FFC107' },
];

// ── Device State (matching lastDeviceState.data shape) ────────────────
export const MOCK_DEVICE_STATE = {
  power: 'on' as const,
  input: 'hdmi1',
  volume: 65,
  mute: false,
  brightness: 80,
  contrast: 50,
  temperature: 42,
  signal_strength: 95,
  firmware_version: 'v4.2.1',
  uptime_seconds: 86400,
  ip_address: '192.168.1.42',
  mac_address: 'A8:5E:45:3B:C1:9F',
  model: 'NEC PA804UL',
  serial: 'SN-2024-001234',
  last_command_time: Date.now() - 120000,
  error_count: 0,
};

// ── Segment definitions (for gauge/bar widgets) ───────────────────────
export interface GaugeSegment {
  from: number;
  to: number;
  color: string;
  label?: string;
}

export const MOCK_GAUGE_SEGMENTS: GaugeSegment[] = [
  { from: 0, to: 30, color: '#00BFA5', label: 'Low' },
  { from: 30, to: 70, color: '#FFC107', label: 'Normal' },
  { from: 70, to: 100, color: '#FF5252', label: 'High' },
];

// ── Switch definitions (for grouped toggles) ─────────────────────────
export interface MockSwitch {
  id: string;
  title: string;
  isChecked: boolean;
  color?: string;
}

export const MOCK_SWITCHES: MockSwitch[] = [
  { id: 'auto_brightness', title: 'Auto-Brightness', isChecked: true },
  { id: 'standby', title: 'Standby Mode', isChecked: false },
  { id: 'eco_mode', title: 'Eco Mode', isChecked: true, color: '#00BFA5' },
  { id: 'cec', title: 'CEC Control', isChecked: true },
  { id: 'fan_override', title: 'Fan Override', isChecked: false, color: '#FF5252' },
];

// ── State controller options ──────────────────────────────────────────
export interface StateOption {
  value: string;
  label: string;
  icon?: string;
}

export const MOCK_STATE_OPTIONS: StateOption[] = [
  { value: 'hdmi1', label: 'HDMI 1' },
  { value: 'hdmi2', label: 'HDMI 2' },
  { value: 'dp1', label: 'DisplayPort' },
  { value: 'usbc', label: 'USB-C' },
];
