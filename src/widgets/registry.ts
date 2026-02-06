import React from 'react';

import type { WidgetControlSpec, WidgetStoryDefinition, XyteWidgetMode } from '../explorer/types';
import {
  AVoIPStats,
  AlertFeed,
  AspectRatio,
  AudioEQ,
  AudioSpectrum,
  BandwidthMonitor,
  BulkActions,
  CertStatus,
  Climate,
  CodeTester,
  CmdBtn,
  ColorTemp,
  CommandLog,
  CrosspointMatrix,
  DeviceCard,
  DeviceTable,
  DisplayAdjust,
  DisplayOrientation,
  EDIDManager,
  FirmwareUpdate,
  Gauge,
  InputSelector,
  KPI,
  LampLife,
  LatencyGraph,
  MacroBuilder,
  Mixer,
  NetworkInfo,
  Occupancy,
  PTZControl,
  PoEManager,
  PortStatus,
  PowerMonitor,
  PowerSequencer,
  QuickControls,
  ResolutionPicker,
  ScenePresets,
  Schedule,
  SignalFlow,
  ThermostatControl,
  Toggle,
  UptimeTimeline,
  VideoWall,
  VolumeKnob,
} from './library';

const story = (
  id: string,
  title: string,
  category: string,
  Component: React.ComponentType<any>,
  defaultProps: Record<string, unknown> = {},
  controls: WidgetControlSpec[] = [],
  defaultMode: XyteWidgetMode = 'modern',
): WidgetStoryDefinition => ({
  id,
  title,
  category,
  defaultMode,
  defaultProps,
  controls,
  render: (props) => React.createElement(Component, props),
});

export const WIDGET_STORIES: WidgetStoryDefinition[] = [
  story('kpi', 'KPI Tile', 'Fleet', KPI, { value: 1247, prev: 1180, label: 'Devices Online', color: '#00BFA5' }, [
    { key: 'value', label: 'Value', kind: 'number', min: 0, max: 10000, step: 1 },
    { key: 'prev', label: 'Previous', kind: 'number', min: 0, max: 10000, step: 1 },
    { key: 'label', label: 'Label', kind: 'select', options: [
      { label: 'Devices Online', value: 'Devices Online' },
      { label: 'Uptime %', value: 'Uptime %' },
      { label: 'Commands/hr', value: 'Commands/hr' },
    ] },
  ]),
  story('device-card', 'Device Card', 'Fleet', DeviceCard, { name: 'NEC PA804UL', type: 'Projector', status: 'online', signal: 95, ip: '192.168.1.42', fw: 'v4.2.1', temp: 42 }, [
    { key: 'signal', label: 'Signal', kind: 'number', min: 0, max: 100, step: 1 },
    { key: 'temp', label: 'Temp', kind: 'number', min: 0, max: 100, step: 1 },
    { key: 'status', label: 'Status', kind: 'select', options: [
      { label: 'online', value: 'online' },
      { label: 'warning', value: 'warning' },
      { label: 'error', value: 'error' },
      { label: 'offline', value: 'offline' },
    ] },
  ]),
  story('gauge', 'Telemetry Gauge', 'Fleet', Gauge, { value: 72, max: 100, label: 'CPU', unit: '%' }, [
    { key: 'value', label: 'Value', kind: 'number', min: 0, max: 100, step: 1 },
    { key: 'max', label: 'Max', kind: 'number', min: 1, max: 200, step: 1 },
  ]),
  story('device-table', 'Device Inventory Table', 'Fleet', DeviceTable),
  story('uptime-timeline', 'Uptime Timeline', 'Fleet', UptimeTimeline),

  story('ptz-control', 'PTZ Control', 'AV Controls', PTZControl),
  story('mixer', 'Audio Mixer', 'AV Controls', Mixer),
  story('quick-controls', 'Quick Controls', 'AV Controls', QuickControls),
  story('input-selector', 'Input Selector', 'AV Controls', InputSelector),
  story('display-adjust', 'Display Adjust', 'AV Controls', DisplayAdjust),
  story('color-temp', 'Color Temperature', 'AV Controls', ColorTemp),
  story('toggle', 'Toggle Control', 'AV Controls', Toggle, { label: 'Auto-brightness', initial: true }, [
    { key: 'label', label: 'Label', kind: 'select', options: [
      { label: 'Auto-brightness', value: 'Auto-brightness' },
      { label: 'Standby', value: 'Standby' },
      { label: 'Eco Mode', value: 'Eco Mode' },
    ] },
    { key: 'initial', label: 'Initially On', kind: 'boolean' },
  ]),
  story('cmd-btn', 'Command Button', 'AV Controls', CmdBtn, { label: 'Reboot' }, [
    { key: 'label', label: 'Action', kind: 'select', options: [
      { label: 'Reboot', value: 'Reboot' },
      { label: 'Identify', value: 'Identify' },
      { label: 'Power Off', value: 'Power Off' },
    ] },
  ]),

  story('audio-spectrum', 'Audio Spectrum', 'Audio', AudioSpectrum),
  story('audio-eq', 'Audio EQ', 'Audio', AudioEQ),
  story('volume-knob', 'Volume Knob', 'Audio', VolumeKnob, { label: 'Master' }, [
    { key: 'label', label: 'Label', kind: 'select', options: [
      { label: 'Master', value: 'Master' },
      { label: 'Monitor', value: 'Monitor' },
      { label: 'Sub', value: 'Sub' },
    ] },
  ]),

  story('video-wall', 'Video Wall', 'Display & Routing', VideoWall),
  story('crosspoint-matrix', 'Crosspoint Matrix', 'Display & Routing', CrosspointMatrix),
  story('signal-flow', 'Signal Flow', 'Display & Routing', SignalFlow),
  story('resolution-picker', 'Resolution Picker', 'Display & Routing', ResolutionPicker),
  story('aspect-ratio', 'Aspect Ratio', 'Display & Routing', AspectRatio),
  story('edid-manager', 'EDID Manager', 'Display & Routing', EDIDManager),
  story('display-orientation', 'Display Orientation', 'Display & Routing', DisplayOrientation),

  story('scene-presets', 'Scene Presets', 'Room & Climate', ScenePresets),
  story('power-sequencer', 'Power Sequencer', 'Room & Climate', PowerSequencer),
  story('macro-builder', 'Macro Builder', 'Room & Climate', MacroBuilder),
  story('thermostat', 'Thermostat Control', 'Room & Climate', ThermostatControl, { form: 'hybrid', unit: 'celsius' }, [
    { key: 'form', label: 'Form', kind: 'select', options: [
      { label: 'Rotary', value: 'rotary' },
      { label: 'Digital', value: 'digital' },
      { label: 'Hybrid', value: 'hybrid' },
    ] },
    { key: 'unit', label: 'Unit', kind: 'select', options: [
      { label: 'Celsius', value: 'celsius' },
      { label: 'Fahrenheit', value: 'fahrenheit' },
    ] },
  ]),
  story('climate', 'Climate Card', 'Room & Climate', Climate),
  story('occupancy', 'Occupancy', 'Room & Climate', Occupancy),
  story('schedule', 'Schedule', 'Room & Climate', Schedule),

  story('network-info', 'Network Info', 'Network & Infrastructure', NetworkInfo),
  story('bandwidth-monitor', 'Bandwidth Monitor', 'Network & Infrastructure', BandwidthMonitor),
  story('avoip-stats', 'AVoIP Stats', 'Network & Infrastructure', AVoIPStats),
  story('latency-graph', 'Latency Graph', 'Network & Infrastructure', LatencyGraph),
  story('power-monitor', 'Power Monitor', 'Network & Infrastructure', PowerMonitor),
  story('poe-manager', 'PoE Manager', 'Network & Infrastructure', PoEManager),
  story('port-status', 'Port Status', 'Network & Infrastructure', PortStatus),
  story('cert-status', 'Certificate Status', 'Network & Infrastructure', CertStatus),
  story('lamp-life', 'Lamp Life', 'Network & Infrastructure', LampLife, { hours: 12400, max: 20000 }, [
    { key: 'hours', label: 'Hours', kind: 'number', min: 0, max: 30000, step: 50 },
    { key: 'max', label: 'Max Life', kind: 'number', min: 1000, max: 40000, step: 500 },
  ]),

  story('alert-feed', 'Alert Feed', 'Incidents & Logs', AlertFeed),
  story('command-log', 'Command Log', 'Incidents & Logs', CommandLog),
  story('bulk-actions', 'Bulk Actions', 'Incidents & Logs', BulkActions),
  story('code-tester', 'Code Tester', 'Incidents & Logs', CodeTester),
  story('firmware-update', 'Firmware Update', 'Incidents & Logs', FirmwareUpdate),
];

export const WIDGET_CATEGORIES = Array.from(new Set(WIDGET_STORIES.map((storyItem) => storyItem.category)));

export const getWidgetStory = (id: string) =>
  WIDGET_STORIES.find((storyItem) => storyItem.id === id) ?? WIDGET_STORIES[0];
