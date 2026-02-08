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
  // AI & Analytics
  AnomalyDetector,
  PredictiveMaintenance,
  AIInsights,
  SentimentGauge,
  UsageForecaster,
  ModelPerformance,
  NLPCommandParser,
  // Collaboration
  MeetingStatus,
  ScreenShare,
  ChatFeed,
  WhiteboardMini,
  PollWidget,
  TaskTracker,
  // Core Widgets
  StatusIndicator,
  NumericMetric,
  ValueDisplay,
  TextDisplay,
  ToggleSwitch,
  ActionButton,
  StateSelector,
  BarSlider,
  GaugeWidget,
  BarWidget,
  SplineChart,
  ScatterChart,
  DeviceMap,
  StatusTimeline,
  GroupedToggles,
  // Energy
  SolarPanel,
  BatteryBank,
  GridStatus,
  CarbonTracker,
  EnergyFlow,
  CostMonitor,
  // Security
  ThreatMap,
  AccessLog,
  VulnerabilityScanner,
  FirewallRules,
  EncryptionStatus,
  ComplianceChecker,
  SecurityScore,
  // Signage
  PlaylistManager,
  ContentPreview,
  ScreenZoning,
  ScheduleCalendar,
  ProofOfPlay,
  BrightnessSchedule,
  // Spatial
  FloorPlan,
  ZoneHeatmap,
  WayfindingStatus,
  BeaconManager,
  AssetTracker,
  EnvironmentalSensor,
  // Agriculture
  SoilMoisture,
  IrrigationControl,
  WeatherStation,
  CropHealth,
  DroneView,
  HarvestTracker,
  // Broadcast
  StreamHealth,
  EncoderStatus,
  Multiviewer,
  TallyLight,
  PlayoutSchedule,
  AudioLoudness,
  CaptionMonitor,
  // Datacenter
  RackThermal,
  ServerHealth,
  VMDensity,
  BandwidthPipe,
  UPSStatus,
  CoolingEfficiency,
  PatchPanel,
  // Education
  ClassroomAV,
  AttendanceBoard,
  DigitalBulletin,
  BellSchedule,
  LibraryOccupancy,
  ExamTimer,
  // Healthcare
  PatientMonitor,
  VitalsChart,
  BedManager,
  NurseCallBoard,
  LabResults,
  PharmacyQueue,
  TriageStatus,
  // Hospitality
  RoomStatus,
  MinibarTracker,
  GuestServices,
  HousekeepingBoard,
  CheckInKiosk,
  PoolSensors,
  // Logistics
  FleetGPS,
  RouteOptimizer,
  WarehouseMap,
  DeliveryTracker,
  DockSchedule,
  FuelMonitor,
  // Manufacturing
  AssemblyLine,
  OEEGauge,
  QualityGate,
  PLCStatus,
  TankLevel,
  ConveyorSpeed,
  ShiftSchedule,
  // Retail
  POSAnalytics,
  InventoryLevel,
  FootTraffic,
  QueueMonitor,
  PriceTag,
  ShrinkageAlert,
  LoyaltyDash,
  // Smart Building
  HVACZone,
  ElevatorStatus,
  ParkingOccupancy,
  WaterMeter,
  LightingScene,
  AccessDoor,
  FirePanel,
  // Aerospace
  FlightBoard,
  RunwayStatus,
  BaggageFlow,
  FuelFarm,
  AircraftMaintenance,
  GateAssignment,
  // Pharmaceutical
  CleanRoom,
  BatchReactor,
  Chromatograph,
  ColdChain,
  QualityLab,
  ComplianceTracker,
  // Telecom
  CellTower,
  SpectrumAnalyzer,
  SubscriberMetrics,
  NetworkSlicing,
  SIMInventory,
  CallQuality,
  // Maritime
  VesselTracker,
  ContainerYard,
  TideMonitor,
  CraneOps,
  BerthSchedule,
  CargoManifest,
  // Construction
  SiteProgress,
  CraneMonitor,
  MaterialsTracker,
  WeatherSite,
  SafetyBoard,
  ConcreteMonitor,
  EquipmentFleet,
  // Mining
  MineShaftDepth,
  OreGradeAnalyzer,
  VentilationFan,
  ConveyorLoad,
  BlastSequencer,
  CageWinder,
  // Water Treatment
  WaterFlowRate,
  ChemicalDosing,
  FiltrationBank,
  WaterTankLevel,
  TurbidityMeter,
  PumpStation,
  // Robotics
  RobotArmPose,
  JointTorque,
  VisionFeed,
  TaskQueue,
  GripperStatus,
  CycleCounter,
  // Nuclear
  ReactorStatus,
  CoolingLoop,
  RadiationLevel,
  ContainmentStatus,
  FuelRodPosition,
  EmergencyPanel,
  // Semiconductor
  FabCleanRoom,
  WaferYield,
  LithographyStep,
  DefectMap,
  EtchChamber,
  WaferTransport,
  // Railway
  TrackOccupancy,
  SignalHead,
  TrainSchedule,
  PantographMonitor,
  PointsSwitch,
  PlatformDisplay,
  // Brewing
  FermentationVessel,
  BrewTempCurve,
  CarbonationLevel,
  MashTunControl,
  GravityReading,
  BatchTracker,
  // Offshore Oil
  WellheadPressure,
  BOPStatus,
  MudWeight,
  DrillDepth,
  GasSeparator,
  RigTension,
  // Stadium & Events
  CrowdDensity,
  TicketGate,
  LightingRig,
  PASystem,
  ScoreBoard,
  TurnstileFlow,
  // Space & Satellite
  OrbitTracker,
  SatTelemetry,
  SolarArrayAngle,
  LinkBudget,
  ThrusterControl,
  GroundStation,
  // Aviation Cockpit
  AttitudeIndicator,
  Altimeter,
  AirspeedIndicator,
  HeadingCompass,
  VerticalSpeed,
  AnnunciatorPanel,
  // Submarine
  DepthGauge,
  BallastTank,
  TorpedoStatus,
  SonarDisplay,
  HullPressure,
  DivePlane,
  // Vintage HiFi
  VacuumTubeAmp,
  ReelToReel,
  VUMeter,
  GraphicEQ,
  TapeCounter,
  TransformerHum,
  // Watchmaking
  Chronograph,
  MoonPhase,
  PowerReserve,
  TourbillonCage,
  DateWheel,
  BalanceWheel,
  // Automotive
  Speedometer,
  Tachometer,
  BoostGauge,
  OilTemp,
  FuelGauge,
  EngDiagnostics,
  // Oscilloscope & Lab
  Oscilloscope,
  LabSpectrumAnalyzer,
  FunctionGenerator,
  Multimeter,
  Centrifuge,
  TitrationApparatus,
  // Weather Station
  MercuryBarometer,
  Anemometer,
  RainGauge,
  WindVane,
  Hygrometer,
  StormGlass,
  // Steam & Mechanical
  BoilerPressure,
  SteamValve,
  Flywheel,
  Governor,
  PistonIndicator,
  SteamWhistle,
  // Printing & Typography
  InkDensityMeter,
  CMYKRegistration,
  PaperTension,
  PressCylinder,
  ColorSeparation,
  DryingOven,
  // Vintage Computing
  NixieTubeDisplay,
  ToggleSwitchBank,
  MagTapeReel,
  CoreMemoryGrid,
  PunchCardReader,
  BlinkenLights,
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
  story('device-table', 'Device Inventory Table', 'Fleet', DeviceTable, { title: 'Device Inventory', maxRows: 8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Device Inventory', value: 'Device Inventory' }, { label: 'Fleet Devices', value: 'Fleet Devices' }, { label: 'Asset Table', value: 'Asset Table' },
    ] },
    { key: 'maxRows', label: 'Max Rows', kind: 'number', min: 3, max: 8, step: 1 },
  ]),
  story('uptime-timeline', 'Uptime Timeline', 'Fleet', UptimeTimeline, { title: '30-Day Uptime', days: 30 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: '30-Day Uptime', value: '30-Day Uptime' }, { label: '7-Day Uptime', value: '7-Day Uptime' }, { label: 'Availability', value: 'Availability' },
    ] },
    { key: 'days', label: 'Days', kind: 'number', min: 7, max: 90, step: 1 },
  ]),

  story('ptz-control', 'PTZ Control', 'AV Controls', PTZControl, { title: 'PTZ Camera', cameraModel: 'PTZ Optics 30X' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'PTZ Camera', value: 'PTZ Camera' }, { label: 'Camera Control', value: 'Camera Control' }, { label: 'PTZ Panel', value: 'PTZ Panel' },
    ] },
    { key: 'cameraModel', label: 'Camera Model', kind: 'select', options: [
      { label: 'PTZ Optics 30X', value: 'PTZ Optics 30X' }, { label: 'Sony SRG-300H', value: 'Sony SRG-300H' }, { label: 'Panasonic AW-UE150', value: 'Panasonic AW-UE150' },
    ] },
  ]),
  story('mixer', 'Audio Mixer', 'AV Controls', Mixer, { title: 'Audio Mixer', channels: 8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Audio Mixer', value: 'Audio Mixer' }, { label: 'Channel Mixer', value: 'Channel Mixer' }, { label: 'DSP Mixer', value: 'DSP Mixer' },
    ] },
    { key: 'channels', label: 'Channels', kind: 'number', min: 2, max: 8, step: 1 },
  ]),
  story('quick-controls', 'Quick Controls', 'AV Controls', QuickControls, { title: 'Quick Controls', columns: 3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Quick Controls', value: 'Quick Controls' }, { label: 'Room Controls', value: 'Room Controls' }, { label: 'System Controls', value: 'System Controls' },
    ] },
    { key: 'columns', label: 'Columns', kind: 'number', min: 2, max: 4, step: 1 },
  ]),
  story('input-selector', 'Input Selector', 'AV Controls', InputSelector, { title: 'Input Source', defaultInput: 'hdmi1' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Input Source', value: 'Input Source' }, { label: 'Source Select', value: 'Source Select' }, { label: 'Input Router', value: 'Input Router' },
    ] },
    { key: 'defaultInput', label: 'Default Input', kind: 'select', options: [
      { label: 'HDMI 1', value: 'hdmi1' }, { label: 'HDMI 2', value: 'hdmi2' }, { label: 'SDI', value: 'sdi' }, { label: 'NDI', value: 'ndi' },
    ] },
  ]),
  story('display-adjust', 'Display Adjust', 'AV Controls', DisplayAdjust, { title: 'Display Adjust', brightness: 75 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Display Adjust', value: 'Display Adjust' }, { label: 'Picture Settings', value: 'Picture Settings' }, { label: 'Image Controls', value: 'Image Controls' },
    ] },
    { key: 'brightness', label: 'Brightness', kind: 'number', min: 0, max: 100, step: 5 },
  ]),
  story('color-temp', 'Color Temperature', 'AV Controls', ColorTemp, { title: 'Color Temperature', defaultTemp: 6500 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Color Temperature', value: 'Color Temperature' }, { label: 'White Balance', value: 'White Balance' }, { label: 'Color Calibration', value: 'Color Calibration' },
    ] },
    { key: 'defaultTemp', label: 'Default Temp (K)', kind: 'number', min: 2700, max: 10000, step: 100 },
  ]),
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

  story('audio-spectrum', 'Audio Spectrum', 'Audio', AudioSpectrum, { title: 'Audio Spectrum', bars: 32 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Audio Spectrum', value: 'Audio Spectrum' }, { label: 'Frequency Analyzer', value: 'Frequency Analyzer' }, { label: 'Spectrum Display', value: 'Spectrum Display' },
    ] },
    { key: 'bars', label: 'Bars', kind: 'number', min: 8, max: 64, step: 4 },
  ]),
  story('audio-eq', 'Audio EQ', 'Audio', AudioEQ, { title: 'Parametric EQ', bandCount: 10 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Parametric EQ', value: 'Parametric EQ' }, { label: 'Graphic EQ', value: 'Graphic EQ' }, { label: 'Equalizer', value: 'Equalizer' },
    ] },
    { key: 'bandCount', label: 'Bands', kind: 'number', min: 4, max: 10, step: 1 },
  ]),
  story('volume-knob', 'Volume Knob', 'Audio', VolumeKnob, { label: 'Master' }, [
    { key: 'label', label: 'Label', kind: 'select', options: [
      { label: 'Master', value: 'Master' },
      { label: 'Monitor', value: 'Monitor' },
      { label: 'Sub', value: 'Sub' },
    ] },
  ]),

  story('video-wall', 'Video Wall', 'Display & Routing', VideoWall, { title: 'Video Wall', columns: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Video Wall', value: 'Video Wall' }, { label: 'Wall Controller', value: 'Wall Controller' }, { label: 'Display Grid', value: 'Display Grid' },
    ] },
    { key: 'columns', label: 'Sources', kind: 'number', min: 2, max: 6, step: 1 },
  ]),
  story('crosspoint-matrix', 'Crosspoint Matrix', 'Display & Routing', CrosspointMatrix, { title: 'Crosspoint Matrix', size: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Crosspoint Matrix', value: 'Crosspoint Matrix' }, { label: 'Routing Matrix', value: 'Routing Matrix' }, { label: 'Signal Matrix', value: 'Signal Matrix' },
    ] },
    { key: 'size', label: 'Matrix Size', kind: 'number', min: 2, max: 6, step: 1 },
  ]),
  story('signal-flow', 'Signal Flow', 'Display & Routing', SignalFlow, { title: 'Signal Flow', source: 'HDMI 1' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Signal Flow', value: 'Signal Flow' }, { label: 'Signal Chain', value: 'Signal Chain' }, { label: 'AV Pipeline', value: 'AV Pipeline' },
    ] },
    { key: 'source', label: 'Source', kind: 'select', options: [
      { label: 'HDMI 1', value: 'HDMI 1' }, { label: 'HDMI 2', value: 'HDMI 2' }, { label: 'SDI', value: 'SDI' }, { label: 'NDI', value: 'NDI' },
    ] },
  ]),
  story('resolution-picker', 'Resolution Picker', 'Display & Routing', ResolutionPicker, { title: 'Resolution', defaultRate: 0 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Resolution', value: 'Resolution' }, { label: 'Output Resolution', value: 'Output Resolution' }, { label: 'Display Mode', value: 'Display Mode' },
    ] },
    { key: 'defaultRate', label: 'Default Rate', kind: 'number', min: 0, max: 3, step: 1 },
  ]),
  story('aspect-ratio', 'Aspect Ratio', 'Display & Routing', AspectRatio, { title: 'Aspect Ratio', defaultIndex: 0 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Aspect Ratio', value: 'Aspect Ratio' }, { label: 'Screen Ratio', value: 'Screen Ratio' }, { label: 'Display Ratio', value: 'Display Ratio' },
    ] },
    { key: 'defaultIndex', label: 'Default Ratio', kind: 'number', min: 0, max: 4, step: 1 },
  ]),
  story('edid-manager', 'EDID Manager', 'Display & Routing', EDIDManager, { title: 'EDID Manager', profileCount: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'EDID Manager', value: 'EDID Manager' }, { label: 'EDID Profiles', value: 'EDID Profiles' }, { label: 'Display EDID', value: 'Display EDID' },
    ] },
    { key: 'profileCount', label: 'Profiles', kind: 'number', min: 2, max: 6, step: 1 },
  ]),
  story('display-orientation', 'Display Orientation', 'Display & Routing', DisplayOrientation, { title: 'Orientation', defaultRotation: 0 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Orientation', value: 'Orientation' }, { label: 'Display Rotation', value: 'Display Rotation' }, { label: 'Screen Orientation', value: 'Screen Orientation' },
    ] },
    { key: 'defaultRotation', label: 'Default Rotation', kind: 'number', min: 0, max: 270, step: 90 },
  ]),

  story('scene-presets', 'Scene Presets', 'Room & Climate', ScenePresets, { title: 'Room Presets', switchDelay: 600 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Room Presets', value: 'Room Presets' }, { label: 'Scene Manager', value: 'Scene Manager' }, { label: 'Presets', value: 'Presets' },
    ] },
    { key: 'switchDelay', label: 'Switch Delay (ms)', kind: 'number', min: 200, max: 2000, step: 100 },
  ]),
  story('power-sequencer', 'Power Sequencer', 'Room & Climate', PowerSequencer, { title: 'Power Sequencer', deviceCount: 6 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Power Sequencer', value: 'Power Sequencer' }, { label: 'Power Control', value: 'Power Control' }, { label: 'Startup Sequence', value: 'Startup Sequence' },
    ] },
    { key: 'deviceCount', label: 'Devices', kind: 'number', min: 2, max: 6, step: 1 },
  ]),
  story('macro-builder', 'Macro Builder', 'Room & Climate', MacroBuilder, { title: 'Macro: Startup', stepCount: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Macro: Startup', value: 'Macro: Startup' }, { label: 'Macro: Shutdown', value: 'Macro: Shutdown' }, { label: 'Macro: Custom', value: 'Macro: Custom' },
    ] },
    { key: 'stepCount', label: 'Steps', kind: 'number', min: 2, max: 6, step: 1 },
  ]),
  story('thermostat', 'Thermostat Control', 'Room & Climate', ThermostatControl, { form: 'hybrid', unit: 'celsius', ambientC: 22.4 }, [
    { key: 'form', label: 'Form', kind: 'select', options: [
      { label: 'Rotary', value: 'rotary' },
      { label: 'Digital', value: 'digital' },
      { label: 'Hybrid', value: 'hybrid' },
    ] },
    { key: 'unit', label: 'Unit', kind: 'select', options: [
      { label: 'Celsius', value: 'celsius' },
      { label: 'Fahrenheit', value: 'fahrenheit' },
    ] },
    { key: 'ambientC', label: 'Ambient Temp (°C)', kind: 'number' as const, min: 15, max: 35, step: 0.5 },
  ]),
  story('climate', 'Climate Card', 'Room & Climate', Climate, { title: 'Climate', defaultTarget: 22, temp: 22.4, hum: 45 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Climate', value: 'Climate' }, { label: 'Room Climate', value: 'Room Climate' }, { label: 'Temperature', value: 'Temperature' },
    ] },
    { key: 'defaultTarget', label: 'Target Temp (\u00B0C)', kind: 'number', min: 16, max: 28, step: 1 },
    { key: 'temp', label: 'Temperature (\u00B0C)', kind: 'number' as const, min: 10, max: 40, step: 0.5 },
    { key: 'hum', label: 'Humidity (%)', kind: 'number' as const, min: 10, max: 95, step: 1 },
  ]),
  story('occupancy', 'Occupancy', 'Room & Climate', Occupancy, { title: 'Occupancy', capacity: 30, occ: 12 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Occupancy', value: 'Occupancy' }, { label: 'Room Occupancy', value: 'Room Occupancy' }, { label: 'People Count', value: 'People Count' },
    ] },
    { key: 'capacity', label: 'Max Capacity', kind: 'number', min: 10, max: 100, step: 5 },
    { key: 'occ', label: 'Occupancy Count', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('schedule', 'Schedule', 'Room & Climate', Schedule, { title: 'Room Schedule', maxEvents: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Room Schedule', value: 'Room Schedule' }, { label: 'Daily Schedule', value: 'Daily Schedule' }, { label: 'Event Calendar', value: 'Event Calendar' },
    ] },
    { key: 'maxEvents', label: 'Max Events', kind: 'number', min: 2, max: 6, step: 1 },
  ]),

  story('network-info', 'Network Info', 'Network & Infrastructure', NetworkInfo, { title: 'Network', vlan: 10, j: 1.2, lat: 2.1 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Network', value: 'Network' }, { label: 'Network Info', value: 'Network Info' }, { label: 'Connection Details', value: 'Connection Details' },
    ] },
    { key: 'vlan', label: 'VLAN ID', kind: 'number', min: 1, max: 4094, step: 1 },
    { key: 'j', label: 'Jitter (ms)', kind: 'number' as const, min: 0, max: 10, step: 0.1 },
    { key: 'lat', label: 'Latency (ms)', kind: 'number' as const, min: 0, max: 10, step: 0.1 },
  ]),
  story('bandwidth-monitor', 'Bandwidth Monitor', 'Network & Infrastructure', BandwidthMonitor, { title: 'Bandwidth', sampleCount: 30 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Bandwidth', value: 'Bandwidth' }, { label: 'Bandwidth Monitor', value: 'Bandwidth Monitor' }, { label: 'Throughput', value: 'Throughput' },
    ] },
    { key: 'sampleCount', label: 'Samples', kind: 'number', min: 10, max: 60, step: 5 },
  ]),
  story('avoip-stats', 'AVoIP Stats', 'Network & Infrastructure', AVoIPStats, { title: 'AV-over-IP', codec: 'H.265', bitrate: 42, latency: 1.8, drops: 0.2 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'AV-over-IP', value: 'AV-over-IP' }, { label: 'AVoIP Stats', value: 'AVoIP Stats' }, { label: 'Stream Stats', value: 'Stream Stats' },
    ] },
    { key: 'codec', label: 'Codec', kind: 'select', options: [
      { label: 'H.265', value: 'H.265' }, { label: 'H.264', value: 'H.264' }, { label: 'JPEG 2000', value: 'JPEG 2000' },
    ] },
    { key: 'bitrate', label: 'Bitrate (Mbps)', kind: 'number' as const, min: 1, max: 100, step: 1 },
    { key: 'latency', label: 'Latency (ms)', kind: 'number' as const, min: 0, max: 10, step: 0.1 },
    { key: 'drops', label: 'Packet Loss (%)', kind: 'number' as const, min: 0, max: 5, step: 0.05 },
  ]),
  story('latency-graph', 'Latency Graph', 'Network & Infrastructure', LatencyGraph, { title: 'Latency', warningMs: 3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Latency', value: 'Latency' }, { label: 'Network Latency', value: 'Network Latency' }, { label: 'Round-trip Time', value: 'Round-trip Time' },
    ] },
    { key: 'warningMs', label: 'Warning (ms)', kind: 'number', min: 1, max: 10, step: 1 },
  ]),
  story('power-monitor', 'Power Monitor', 'Network & Infrastructure', PowerMonitor, { title: 'Power', nominalWatts: 850 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Power', value: 'Power' }, { label: 'Power Monitor', value: 'Power Monitor' }, { label: 'Energy Usage', value: 'Energy Usage' },
    ] },
    { key: 'nominalWatts', label: 'Nominal Watts', kind: 'number', min: 100, max: 2000, step: 50 },
  ]),
  story('poe-manager', 'PoE Manager', 'Network & Infrastructure', PoEManager, { title: 'PoE Manager', budget: 240 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'PoE Manager', value: 'PoE Manager' }, { label: 'PoE Status', value: 'PoE Status' }, { label: 'Power over Ethernet', value: 'Power over Ethernet' },
    ] },
    { key: 'budget', label: 'Power Budget (W)', kind: 'number', min: 60, max: 740, step: 20 },
  ]),
  story('port-status', 'Port Status', 'Network & Infrastructure', PortStatus, { title: 'I/O Ports', columns: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'I/O Ports', value: 'I/O Ports' }, { label: 'Port Status', value: 'Port Status' }, { label: 'Connectors', value: 'Connectors' },
    ] },
    { key: 'columns', label: 'Columns', kind: 'number', min: 2, max: 4, step: 1 },
  ]),
  story('cert-status', 'Certificate Status', 'Network & Infrastructure', CertStatus, { title: 'Certificates', warningDays: 90 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Certificates', value: 'Certificates' }, { label: 'Cert Status', value: 'Cert Status' }, { label: 'TLS Certificates', value: 'TLS Certificates' },
    ] },
    { key: 'warningDays', label: 'Warning Days', kind: 'number', min: 30, max: 180, step: 15 },
  ]),
  story('lamp-life', 'Lamp Life', 'Network & Infrastructure', LampLife, { hours: 12400, max: 20000 }, [
    { key: 'hours', label: 'Hours', kind: 'number', min: 0, max: 30000, step: 50 },
    { key: 'max', label: 'Max Life', kind: 'number', min: 1000, max: 40000, step: 500 },
  ]),

  story('alert-feed', 'Alert Feed', 'Incidents & Logs', AlertFeed, { title: 'Alerts', maxAlerts: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Alerts', value: 'Alerts' }, { label: 'Alert Feed', value: 'Alert Feed' }, { label: 'Notifications', value: 'Notifications' },
    ] },
    { key: 'maxAlerts', label: 'Max Alerts', kind: 'number', min: 1, max: 4, step: 1 },
  ]),
  story('command-log', 'Command Log', 'Incidents & Logs', CommandLog, { title: 'Command Log', protocol: 'RS-232' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Command Log', value: 'Command Log' }, { label: 'Protocol Log', value: 'Protocol Log' }, { label: 'Activity Log', value: 'Activity Log' },
    ] },
    { key: 'protocol', label: 'Protocol', kind: 'select', options: [
      { label: 'RS-232', value: 'RS-232' }, { label: 'TCP/IP', value: 'TCP/IP' }, { label: 'IR', value: 'IR' },
    ] },
  ]),
  story('bulk-actions', 'Bulk Actions', 'Incidents & Logs', BulkActions, { title: 'Bulk Actions', maxDevices: 5 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Bulk Actions', value: 'Bulk Actions' }, { label: 'Batch Operations', value: 'Batch Operations' }, { label: 'Multi-Device', value: 'Multi-Device' },
    ] },
    { key: 'maxDevices', label: 'Max Devices', kind: 'number', min: 2, max: 5, step: 1 },
  ]),
  story('code-tester', 'Code Tester', 'Incidents & Logs', CodeTester, { title: 'Command Tester', defaultProtocol: 'rs232' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Command Tester', value: 'Command Tester' }, { label: 'Protocol Tester', value: 'Protocol Tester' }, { label: 'Code Console', value: 'Code Console' },
    ] },
    { key: 'defaultProtocol', label: 'Default Protocol', kind: 'select', options: [
      { label: 'RS-232', value: 'rs232' }, { label: 'IR', value: 'ir' }, { label: 'TCP', value: 'tcp' },
    ] },
  ]),
  story('firmware-update', 'Firmware Update', 'Incidents & Logs', FirmwareUpdate, { title: 'Firmware Update', targetVersion: 'v4.3.0' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Firmware Update', value: 'Firmware Update' }, { label: 'OTA Update', value: 'OTA Update' }, { label: 'System Update', value: 'System Update' },
    ] },
    { key: 'targetVersion', label: 'Target Version', kind: 'select', options: [
      { label: 'v4.3.0', value: 'v4.3.0' }, { label: 'v4.4.0-beta', value: 'v4.4.0-beta' }, { label: 'v5.0.0', value: 'v5.0.0' },
    ] },
  ]),

  // Core Widget Primitives
  story('status-indicator', 'Status Indicator', 'Core Widgets', StatusIndicator, { title: 'Status', value: 'Online' }, [
    { key: 'value', label: 'Value', kind: 'select', options: [
      { label: 'Online', value: 'Online' }, { label: 'Offline', value: 'Offline' }, { label: 'Warning', value: 'Warning' },
    ] },
  ]),
  story('numeric-metric', 'Numeric Metric', 'Core Widgets', NumericMetric, { title: 'CPU Load', value: 72, unit: '%' }, [
    { key: 'value', label: 'Value', kind: 'number', min: 0, max: 100, step: 1 },
  ]),
  story('value-display', 'Value Display', 'Core Widgets', ValueDisplay, { title: 'IP Address', value: '192.168.1.1' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'IP Address', value: 'IP Address' }, { label: 'MAC Address', value: 'MAC Address' }, { label: 'Hostname', value: 'Hostname' },
    ] },
  ]),
  story('text-display', 'Text Display', 'Core Widgets', TextDisplay, { title: 'Notes', content: 'System running normally.' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Notes', value: 'Notes' }, { label: 'Description', value: 'Description' }, { label: 'Log', value: 'Log' },
    ] },
  ]),
  story('toggle-switch', 'Toggle Switch', 'Core Widgets', ToggleSwitch, { title: 'Power', isChecked: true }, [
    { key: 'isChecked', label: 'Checked', kind: 'boolean' },
    { key: 'isDeviceOffline', label: 'Device Offline', kind: 'boolean' },
  ]),
  story('action-button', 'Action Button', 'Core Widgets', ActionButton, { title: 'Reboot' }, [
    { key: 'isLoading', label: 'Loading', kind: 'boolean' },
    { key: 'isDeviceOffline', label: 'Device Offline', kind: 'boolean' },
  ]),
  story('state-selector', 'State Selector', 'Core Widgets', StateSelector, { title: 'Mode', value: 'auto', options: [{ label: 'Auto', value: 'auto' }, { label: 'Manual', value: 'manual' }] }, [
    { key: 'value', label: 'Value', kind: 'select', options: [
      { label: 'Auto', value: 'auto' }, { label: 'Manual', value: 'manual' },
    ] },
  ]),
  story('bar-slider', 'Bar Slider', 'Core Widgets', BarSlider, { title: 'Volume', value: 65, min: 0, max: 100, unit: '%' }, [
    { key: 'value', label: 'Value', kind: 'number', min: 0, max: 100, step: 1 },
  ]),
  story('gauge-widget', 'Gauge Widget', 'Core Widgets', GaugeWidget, { title: 'Temperature', value: 42, min: 0, max: 100, unit: '°C' }, [
    { key: 'value', label: 'Value', kind: 'number', min: 0, max: 100, step: 1 },
  ]),
  story('bar-widget', 'Bar Widget', 'Core Widgets', BarWidget, { title: 'Level', value: 75, min: 0, max: 100, unit: '%' }, [
    { key: 'value', label: 'Value', kind: 'number', min: 0, max: 100, step: 1 },
  ]),
  story('spline-chart', 'Spline Chart', 'Core Widgets', SplineChart, { title: 'Trend' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Trend', value: 'Trend' }, { label: 'History', value: 'History' }, { label: 'Performance', value: 'Performance' },
    ] },
  ]),
  story('scatter-chart', 'Scatter Chart', 'Core Widgets', ScatterChart, { title: 'Events' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Events', value: 'Events' }, { label: 'Incidents', value: 'Incidents' }, { label: 'Alerts', value: 'Alerts' },
    ] },
  ]),
  story('device-map', 'Device Map', 'Core Widgets', DeviceMap, { title: 'Location', lat: 40.7128, lng: -74.006 }, [
    { key: 'lat', label: 'Latitude', kind: 'number', min: -90, max: 90, step: 0.1 },
    { key: 'lng', label: 'Longitude', kind: 'number', min: -180, max: 180, step: 0.1 },
  ]),
  story('status-timeline', 'Status Timeline', 'Core Widgets', StatusTimeline, { title: 'Uptime' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Uptime', value: 'Uptime' }, { label: 'Availability', value: 'Availability' }, { label: 'Status', value: 'Status' },
    ] },
  ]),
  story('grouped-toggles', 'Grouped Toggles', 'Core Widgets', GroupedToggles, { title: 'Settings' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Settings', value: 'Settings' }, { label: 'Controls', value: 'Controls' }, { label: 'Options', value: 'Options' },
    ] },
  ]),

  // AI & Analytics
  story('anomaly-detector', 'Anomaly Detector', 'AI & Analytics', AnomalyDetector, { title: 'Anomaly Detection', threshold: 70, confidence: 94 }, [
    { key: 'threshold', label: 'Threshold %', kind: 'number' as const, min: 10, max: 95, step: 5 },
    { key: 'confidence', label: 'Confidence %', kind: 'number' as const, min: 50, max: 100, step: 1 },
  ]),
  story('predictive-maintenance', 'Predictive Maintenance', 'AI & Analytics', PredictiveMaintenance, { title: 'Predictive Maintenance', criticalThreshold: 30 }, [
    { key: 'criticalThreshold', label: 'Critical Below %', kind: 'number', min: 5, max: 50, step: 5 },
  ]),
  story('ai-insights', 'AI Insights', 'AI & Analytics', AIInsights, { title: 'AI Insights', maxVisible: 5 }, [
    { key: 'maxVisible', label: 'Max Visible', kind: 'number', min: 2, max: 10, step: 1 },
  ]),
  story('sentiment-gauge', 'Sentiment Gauge', 'AI & Analytics', SentimentGauge, { title: 'Satisfaction', layout: 'gauge', score: 78 }, [
    { key: 'layout', label: 'Layout', kind: 'select', options: [
      { label: 'Gauge', value: 'gauge' }, { label: 'Compact', value: 'compact' },
    ] },
    { key: 'score', label: 'Score', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('usage-forecaster', 'Usage Forecaster', 'AI & Analytics', UsageForecaster, { title: 'Usage Forecast', dataPoints: 30 }, [
    { key: 'dataPoints', label: 'Data Points', kind: 'number', min: 10, max: 60, step: 5 },
  ]),
  story('model-performance', 'Model Performance', 'AI & Analytics', ModelPerformance, { title: 'Model Performance', maxEpochs: 50 }, [
    { key: 'maxEpochs', label: 'Max Epochs', kind: 'number', min: 10, max: 200, step: 10 },
  ]),
  story('nlp-command-parser', 'NLP Command Parser', 'AI & Analytics', NLPCommandParser, { title: 'NLP Parser', modelVersion: 'NLU v2' }, [
    { key: 'modelVersion', label: 'Model', kind: 'select', options: [
      { label: 'NLU v2', value: 'NLU v2' }, { label: 'NLU v1', value: 'NLU v1' }, { label: 'GPT-4o', value: 'GPT-4o' },
    ] },
  ]),

  // Collaboration
  story('meeting-status', 'Meeting Status', 'Collaboration', MeetingStatus, { title: 'Meeting Status', meetingName: 'Q1 AV Review' }, [
    { key: 'meetingName', label: 'Meeting', kind: 'select', options: [
      { label: 'Q1 AV Review', value: 'Q1 AV Review' }, { label: 'Team Standup', value: 'Team Standup' }, { label: 'Board Meeting', value: 'Board Meeting' },
    ] },
  ]),
  story('screen-share', 'Screen Share', 'Collaboration', ScreenShare, { title: 'Screen Share', resolution: '1920x1080', fps: 30 }, [
    { key: 'resolution', label: 'Resolution', kind: 'select', options: [
      { label: '1920x1080', value: '1920x1080' }, { label: '3840x2160', value: '3840x2160' }, { label: '1280x720', value: '1280x720' },
    ] },
    { key: 'fps', label: 'FPS', kind: 'number' as const, min: 10, max: 60, step: 5 },
  ]),
  story('chat-feed', 'Chat Feed', 'Collaboration', ChatFeed, { title: 'Chat', maxMessages: 5 }, [
    { key: 'maxMessages', label: 'Max Messages', kind: 'number', min: 3, max: 20, step: 1 },
  ]),
  story('whiteboard-mini', 'Whiteboard Mini', 'Collaboration', WhiteboardMini, { title: 'Whiteboard', activeUsers: 4 }, [
    { key: 'activeUsers', label: 'Active Users', kind: 'number', min: 1, max: 12, step: 1 },
  ]),
  story('poll-widget', 'Poll Widget', 'Collaboration', PollWidget, { title: 'Live Poll', question: 'Preferred AV platform?' }, [
    { key: 'question', label: 'Question', kind: 'select', options: [
      { label: 'Preferred AV platform?', value: 'Preferred AV platform?' }, { label: 'Best meeting time?', value: 'Best meeting time?' }, { label: 'Room setup preference?', value: 'Room setup preference?' },
    ] },
  ]),
  story('task-tracker', 'Task Tracker', 'Collaboration', TaskTracker, { title: 'Task Tracker', view: 'list' }, [
    { key: 'view', label: 'View', kind: 'select', options: [
      { label: 'List', value: 'list' }, { label: 'Board', value: 'board' },
    ] },
  ]),

  // Energy
  story('solar-panel', 'Solar Panel', 'Energy', SolarPanel, { title: 'Solar Production', panelCount: 24, output: 4.8, daily: 28.4, efficiency: 21.3 }, [
    { key: 'panelCount', label: 'Panel Count', kind: 'number', min: 1, max: 100, step: 1 },
    { key: 'output', label: 'Output (kW)', kind: 'number', min: 0, max: 15, step: 0.1 },
    { key: 'daily', label: 'Daily Yield (kWh)', kind: 'number', min: 0, max: 85, step: 0.1 },
    { key: 'efficiency', label: 'Efficiency (%)', kind: 'number', min: 0, max: 100, step: 0.1 },
  ]),
  story('battery-bank', 'Battery Bank', 'Energy', BatteryBank, { title: 'Battery', capacity: 100, charge: 72, rate: 1.4 }, [
    { key: 'capacity', label: 'Capacity (kWh)', kind: 'number', min: 10, max: 500, step: 10 },
    { key: 'charge', label: 'Charge (%)', kind: 'number', min: 0, max: 100, step: 1 },
    { key: 'rate', label: 'Rate (kW)', kind: 'number', min: -5, max: 5, step: 0.1 },
  ]),
  story('grid-status', 'Grid Status', 'Energy', GridStatus, { title: 'Grid Status', nominalVoltage: 230, importW: 320, freq: 50.0, voltage: 230 }, [
    { key: 'nominalVoltage', label: 'Nominal Voltage', kind: 'select', options: [
      { label: '230V', value: '230' }, { label: '120V', value: '120' }, { label: '480V', value: '480' },
    ] },
    { key: 'importW', label: 'Import (W)', kind: 'number', min: -1000, max: 1000, step: 1 },
    { key: 'freq', label: 'Frequency (Hz)', kind: 'number', min: 49, max: 51, step: 0.01 },
    { key: 'voltage', label: 'Voltage (V)', kind: 'number', min: 200, max: 260, step: 1 },
  ]),
  story('carbon-tracker', 'Carbon Tracker', 'Energy', CarbonTracker, { title: 'CO\u2082 Tracker', unit: 'kg', dailyCO2: 12.4, monthlyCO2: 348, reduction: 23 }, [
    { key: 'unit', label: 'Unit', kind: 'select', options: [
      { label: 'kg', value: 'kg' }, { label: 'lbs', value: 'lbs' }, { label: 'tonnes', value: 'tonnes' },
    ] },
    { key: 'dailyCO2', label: 'Daily CO\u2082', kind: 'number', min: 0, max: 35, step: 0.1 },
    { key: 'monthlyCO2', label: 'Monthly CO\u2082', kind: 'number', min: 0, max: 1000, step: 1 },
    { key: 'reduction', label: 'Reduction (%)', kind: 'number', min: 0, max: 100, step: 1 },
  ]),
  story('energy-flow', 'Energy Flow', 'Energy', EnergyFlow, { title: 'Energy Flow', showBattery: true, solarW: 4200, gridW: 800, battW: 1200, loadW: 5800 }, [
    { key: 'showBattery', label: 'Show Battery', kind: 'boolean' },
    { key: 'solarW', label: 'Solar (W)', kind: 'number', min: 0, max: 12000, step: 100 },
    { key: 'gridW', label: 'Grid (W)', kind: 'number', min: 0, max: 2400, step: 10 },
    { key: 'battW', label: 'Battery (W)', kind: 'number', min: 0, max: 3600, step: 10 },
    { key: 'loadW', label: 'Load (W)', kind: 'number', min: 0, max: 15000, step: 100 },
  ]),
  story('cost-monitor', 'Cost Monitor', 'Energy', CostMonitor, { title: 'Energy Cost', currency: '$', rate: 0.14, dailyCost: 8.42, monthlyCost: 247 }, [
    { key: 'currency', label: 'Currency', kind: 'select', options: [
      { label: 'USD ($)', value: '$' }, { label: 'EUR (\u20AC)', value: '\u20AC' }, { label: 'GBP (\u00A3)', value: '\u00A3' },
    ] },
    { key: 'rate', label: 'Rate ($/kWh)', kind: 'number', min: 0, max: 0.5, step: 0.01 },
    { key: 'dailyCost', label: 'Daily Cost ($)', kind: 'number', min: 0, max: 25, step: 0.01 },
    { key: 'monthlyCost', label: 'Monthly Cost ($)', kind: 'number', min: 0, max: 750, step: 1 },
  ]),

  // Security
  story('threat-map', 'Threat Map', 'Security', ThreatMap, { title: 'Threat Map', refreshInterval: 3000, liveThreats: 57 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Threat Map', value: 'Threat Map' }, { label: 'Global Threats', value: 'Global Threats' }, { label: 'Threat Overview', value: 'Threat Overview' },
    ] },
    { key: 'refreshInterval', label: 'Refresh (ms)', kind: 'number', min: 1000, max: 10000, step: 500 },
    { key: 'liveThreats', label: 'Live Threats', kind: 'number' as const, min: 0, max: 200, step: 5 },
  ]),
  story('access-log', 'Access Log', 'Security', AccessLog, { title: 'Access Log', maxEntries: 8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Access Log', value: 'Access Log' }, { label: 'Auth Events', value: 'Auth Events' }, { label: 'Login History', value: 'Login History' },
    ] },
    { key: 'maxEntries', label: 'Max Entries', kind: 'number', min: 3, max: 20, step: 1 },
  ]),
  story('vulnerability-scanner', 'Vulnerability Scanner', 'Security', VulnerabilityScanner, { title: 'Vuln Scanner', scanSpeed: 80 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Vuln Scanner', value: 'Vuln Scanner' }, { label: 'Security Scan', value: 'Security Scan' }, { label: 'CVE Scanner', value: 'CVE Scanner' },
    ] },
    { key: 'scanSpeed', label: 'Scan Speed (ms)', kind: 'number', min: 20, max: 200, step: 10 },
  ]),
  story('firewall-rules', 'Firewall Rules', 'Security', FirewallRules, { title: 'Firewall Rules', defaultAction: 'deny' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Firewall Rules', value: 'Firewall Rules' }, { label: 'Network Policy', value: 'Network Policy' }, { label: 'ACL Rules', value: 'ACL Rules' },
    ] },
    { key: 'defaultAction', label: 'Default Action', kind: 'select', options: [
      { label: 'Deny', value: 'deny' }, { label: 'Allow', value: 'allow' },
    ] },
  ]),
  story('encryption-status', 'Encryption Status', 'Security', EncryptionStatus, { title: 'Encryption', minKeyBits: 256 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Encryption', value: 'Encryption' }, { label: 'Crypto Status', value: 'Crypto Status' }, { label: 'Key Management', value: 'Key Management' },
    ] },
    { key: 'minKeyBits', label: 'Min Key Bits', kind: 'number', min: 128, max: 4096, step: 128 },
  ]),
  story('compliance-checker', 'Compliance Checker', 'Security', ComplianceChecker, { title: 'Compliance', threshold: 90 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Compliance', value: 'Compliance' }, { label: 'Audit Status', value: 'Audit Status' }, { label: 'Policy Check', value: 'Policy Check' },
    ] },
    { key: 'threshold', label: 'Pass Threshold', kind: 'number', min: 50, max: 100, step: 5 },
  ]),
  story('security-score', 'Security Score', 'Security', SecurityScore, { title: 'Security Score', targetScore: 80 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Security Score', value: 'Security Score' }, { label: 'Risk Score', value: 'Risk Score' }, { label: 'Posture Score', value: 'Posture Score' },
    ] },
    { key: 'targetScore', label: 'Target Score', kind: 'number', min: 50, max: 100, step: 5 },
  ]),

  // Signage
  story('playlist-manager', 'Playlist Manager', 'Signage', PlaylistManager, { title: 'Playlist', maxItems: 5 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Playlist', value: 'Playlist' }, { label: 'Media Queue', value: 'Media Queue' }, { label: 'Content Lineup', value: 'Content Lineup' },
    ] },
    { key: 'maxItems', label: 'Max Items', kind: 'number', min: 2, max: 10, step: 1 },
  ]),
  story('content-preview', 'Content Preview', 'Signage', ContentPreview, { title: 'Content Preview', resolution: '1920x1080' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Content Preview', value: 'Content Preview' }, { label: 'Media Preview', value: 'Media Preview' }, { label: 'Asset Preview', value: 'Asset Preview' },
    ] },
    { key: 'resolution', label: 'Resolution', kind: 'select', options: [
      { label: '1920x1080', value: '1920x1080' }, { label: '3840x2160', value: '3840x2160' }, { label: '1280x720', value: '1280x720' },
    ] },
  ]),
  story('screen-zoning', 'Screen Zoning', 'Signage', ScreenZoning, { title: 'Screen Zones', aspectRatio: '16:9' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Screen Zones', value: 'Screen Zones' }, { label: 'Layout Editor', value: 'Layout Editor' }, { label: 'Zone Config', value: 'Zone Config' },
    ] },
    { key: 'aspectRatio', label: 'Aspect Ratio', kind: 'select', options: [
      { label: '16:9', value: '16:9' }, { label: '4:3', value: '4:3' }, { label: '21:9', value: '21:9' },
    ] },
  ]),
  story('schedule-calendar', 'Schedule Calendar', 'Signage', ScheduleCalendar, { title: 'Weekly Schedule', view: 'week' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Weekly Schedule', value: 'Weekly Schedule' }, { label: 'Content Calendar', value: 'Content Calendar' }, { label: 'Playout Schedule', value: 'Playout Schedule' },
    ] },
    { key: 'view', label: 'View', kind: 'select', options: [
      { label: 'Week', value: 'week' }, { label: 'Day', value: 'day' }, { label: 'Month', value: 'month' },
    ] },
  ]),
  story('proof-of-play', 'Proof of Play', 'Signage', ProofOfPlay, { title: 'Proof of Play', period: 'Today', plays: 1842, impressions: 24300, completion: 94.2 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Proof of Play', value: 'Proof of Play' }, { label: 'Play Report', value: 'Play Report' }, { label: 'Ad Verification', value: 'Ad Verification' },
    ] },
    { key: 'period', label: 'Period', kind: 'select', options: [
      { label: 'Today', value: 'Today' }, { label: 'This Week', value: 'This Week' }, { label: 'This Month', value: 'This Month' },
    ] },
    { key: 'plays', label: 'Plays', kind: 'number' as const, min: 0, max: 5000, step: 50 },
    { key: 'impressions', label: 'Impressions', kind: 'number' as const, min: 0, max: 100000, step: 500 },
    { key: 'completion', label: 'Completion %', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('brightness-schedule', 'Brightness Schedule', 'Signage', BrightnessSchedule, { title: 'Brightness', maxBrightness: 100, currentBrightness: 75 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Brightness', value: 'Brightness' }, { label: 'Display Brightness', value: 'Display Brightness' }, { label: 'Backlight', value: 'Backlight' },
    ] },
    { key: 'maxBrightness', label: 'Max Brightness', kind: 'number', min: 50, max: 100, step: 5 },
    { key: 'currentBrightness', label: 'Current Brightness', kind: 'number' as const, min: 0, max: 100, step: 5 },
  ]),

  // Spatial
  story('floor-plan', 'Floor Plan', 'Spatial', FloorPlan, { title: 'Floor Plan', floorNumber: 1 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Floor Plan', value: 'Floor Plan' }, { label: 'Building Map', value: 'Building Map' }, { label: 'Site Layout', value: 'Site Layout' },
    ] },
    { key: 'floorNumber', label: 'Floor', kind: 'number', min: 1, max: 50, step: 1 },
  ]),
  story('zone-heatmap', 'Zone Heatmap', 'Spatial', ZoneHeatmap, { title: 'Activity Heatmap', highThreshold: 75 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Activity Heatmap', value: 'Activity Heatmap' }, { label: 'Occupancy Map', value: 'Occupancy Map' }, { label: 'Usage Heatmap', value: 'Usage Heatmap' },
    ] },
    { key: 'highThreshold', label: 'High Threshold', kind: 'number', min: 50, max: 100, step: 5 },
  ]),
  story('wayfinding-status', 'Wayfinding Status', 'Spatial', WayfindingStatus, { title: 'Wayfinding', floor: '3F', activeRoutes: 12 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Wayfinding', value: 'Wayfinding' }, { label: 'Navigation', value: 'Navigation' }, { label: 'Kiosk Status', value: 'Kiosk Status' },
    ] },
    { key: 'floor', label: 'Floor', kind: 'select', options: [
      { label: '1F', value: '1F' }, { label: '2F', value: '2F' }, { label: '3F', value: '3F' },
    ] },
    { key: 'activeRoutes', label: 'Active Routes', kind: 'number' as const, min: 0, max: 50, step: 1 },
  ]),
  story('beacon-manager', 'Beacon Manager', 'Spatial', BeaconManager, { title: 'BLE Beacons', lowBatteryThreshold: 20 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'BLE Beacons', value: 'BLE Beacons' }, { label: 'Beacon Fleet', value: 'Beacon Fleet' }, { label: 'iBeacon Status', value: 'iBeacon Status' },
    ] },
    { key: 'lowBatteryThreshold', label: 'Low Battery %', kind: 'number', min: 5, max: 50, step: 5 },
  ]),
  story('asset-tracker', 'Asset Tracker', 'Spatial', AssetTracker, { title: 'Asset Tracker', showStatus: 'all' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Asset Tracker', value: 'Asset Tracker' }, { label: 'Equipment Locator', value: 'Equipment Locator' }, { label: 'Inventory Tracker', value: 'Inventory Tracker' },
    ] },
    { key: 'showStatus', label: 'Filter Status', kind: 'select', options: [
      { label: 'All', value: 'all' }, { label: 'Stationary', value: 'stationary' }, { label: 'Moving', value: 'moving' },
    ] },
  ]),
  story('environmental-sensor', 'Environmental Sensor', 'Spatial', EnvironmentalSensor, { title: 'Environment', tempUnit: 'C', temp: 22.4, humidity: 45, co2: 420, noise: 38, light: 450 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Environment', value: 'Environment' }, { label: 'Room Sensors', value: 'Room Sensors' }, { label: 'Air Quality', value: 'Air Quality' },
    ] },
    { key: 'tempUnit', label: 'Temp Unit', kind: 'select', options: [
      { label: 'Celsius', value: 'C' }, { label: 'Fahrenheit', value: 'F' },
    ] },
    { key: 'temp', label: 'Temperature', kind: 'number' as const, min: -10, max: 50, step: 0.5 },
    { key: 'humidity', label: 'Humidity %', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'co2', label: 'CO2 (ppm)', kind: 'number' as const, min: 300, max: 2000, step: 10 },
    { key: 'noise', label: 'Noise (dB)', kind: 'number' as const, min: 0, max: 120, step: 1 },
    { key: 'light', label: 'Light (lux)', kind: 'number' as const, min: 0, max: 2000, step: 10 },
  ]),

  // Agriculture
  story('soil-moisture', 'Soil Moisture', 'Agriculture', SoilMoisture, { title: 'Soil Moisture', zoneCount: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Soil Moisture', value: 'Soil Moisture' }, { label: 'Ground Hydration', value: 'Ground Hydration' }, { label: 'Field Moisture', value: 'Field Moisture' },
    ] },
    { key: 'zoneCount', label: 'Zones', kind: 'number', min: 1, max: 4, step: 1 },
  ]),
  story('irrigation-control', 'Irrigation Control', 'Agriculture', IrrigationControl, { title: 'Irrigation Control', volumeUnit: 'gal' }, [
    { key: 'volumeUnit', label: 'Volume Unit', kind: 'select', options: [
      { label: 'Gallons', value: 'gal' }, { label: 'Liters', value: 'L' }, { label: 'Cubic Meters', value: 'm\u00B3' },
    ] },
  ]),
  story('weather-station', 'Weather Station', 'Agriculture', WeatherStation, { title: 'Weather Station', tempUnit: 'C', temp: 24.6, humidity: 62, windSpeed: 12.3, rainfall: 2.4, uvIndex: 6.2, pressure: 1013.2 }, [
    { key: 'tempUnit', label: 'Temp Unit', kind: 'select', options: [
      { label: 'Celsius', value: 'C' }, { label: 'Fahrenheit', value: 'F' },
    ] },
    { key: 'temp', label: 'Temperature', kind: 'number' as const, min: -10, max: 50, step: 0.5 },
    { key: 'humidity', label: 'Humidity %', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'windSpeed', label: 'Wind Speed', kind: 'number' as const, min: 0, max: 60, step: 0.5 },
    { key: 'rainfall', label: 'Rainfall mm', kind: 'number' as const, min: 0, max: 50, step: 0.2 },
    { key: 'uvIndex', label: 'UV Index', kind: 'number' as const, min: 0, max: 12, step: 0.5 },
    { key: 'pressure', label: 'Pressure hPa', kind: 'number' as const, min: 980, max: 1040, step: 0.5 },
  ]),
  story('crop-health', 'Crop Health', 'Agriculture', CropHealth, { title: 'Crop Health', ndviThreshold: 0.5 }, [
    { key: 'ndviThreshold', label: 'NDVI Warning', kind: 'number', min: 0.1, max: 0.9, step: 0.1 },
  ]),
  story('drone-view', 'Drone Fleet', 'Agriculture', DroneView, { title: 'Drone Fleet', lowBatteryThreshold: 20 }, [
    { key: 'lowBatteryThreshold', label: 'Low Battery %', kind: 'number', min: 5, max: 50, step: 5 },
  ]),
  story('harvest-tracker', 'Harvest Tracker', 'Agriculture', HarvestTracker, { title: 'Harvest Tracker', yieldUnit: 'tons' }, [
    { key: 'yieldUnit', label: 'Yield Unit', kind: 'select', options: [
      { label: 'Tons', value: 'tons' }, { label: 'Bushels', value: 'bu' }, { label: 'Kilograms', value: 'kg' },
    ] },
  ]),

  // Broadcast
  story('stream-health', 'Stream Health', 'Broadcast', StreamHealth, { title: 'Stream Health', bitrateTarget: 8000, bitrate: 8500, viewers: 12400, frameDrops: 0.12 }, [
    { key: 'bitrateTarget', label: 'Bitrate Target', kind: 'number', min: 2000, max: 20000, step: 1000 },
    { key: 'bitrate', label: 'Bitrate (kbps)', kind: 'number', min: 1000, max: 20000, step: 500 },
    { key: 'viewers', label: 'Viewers', kind: 'number', min: 0, max: 100000, step: 1000 },
    { key: 'frameDrops', label: 'Frame Drops %', kind: 'number', min: 0, max: 5, step: 0.05 },
  ]),
  story('encoder-status', 'Encoder Status', 'Broadcast', EncoderStatus, { title: 'Encoder Status', cpuWarningThreshold: 80 }, [
    { key: 'cpuWarningThreshold', label: 'CPU Warning %', kind: 'number', min: 50, max: 95, step: 5 },
  ]),
  story('multiviewer', 'Multiviewer', 'Broadcast', Multiviewer, { title: 'Multiviewer', columns: 3 }, [
    { key: 'columns', label: 'Columns', kind: 'number', min: 2, max: 4, step: 1 },
  ]),
  story('tally-light', 'Tally Lights', 'Broadcast', TallyLight, { title: 'Tally Lights', cameraCount: 8 }, [
    { key: 'cameraCount', label: 'Cameras', kind: 'number', min: 2, max: 8, step: 1 },
  ]),
  story('playout-schedule', 'Playout Schedule', 'Broadcast', PlayoutSchedule, { title: 'Playout Schedule', maxItems: 6 }, [
    { key: 'maxItems', label: 'Max Items', kind: 'number', min: 3, max: 6, step: 1 },
  ]),
  story('audio-loudness', 'Audio Loudness', 'Broadcast', AudioLoudness, { title: 'Audio Loudness', standard: 'EBU R128', intLufs: -23 }, [
    { key: 'standard', label: 'Standard', kind: 'select', options: [
      { label: 'EBU R128', value: 'EBU R128' }, { label: 'ATSC A/85', value: 'ATSC A/85' }, { label: 'ITU BS.1770', value: 'ITU BS.1770' },
    ] },
    { key: 'intLufs', label: 'Integrated LUFS', kind: 'number', min: -48, max: 0, step: 0.5 },
  ]),
  story('caption-monitor', 'Caption Monitor', 'Broadcast', CaptionMonitor, { title: 'Caption Monitor', language: 'EN-US', wpm: 160, delay: 1.2, accuracy: 97.5 }, [
    { key: 'language', label: 'Language', kind: 'select', options: [
      { label: 'EN-US', value: 'EN-US' }, { label: 'ES-ES', value: 'ES-ES' }, { label: 'FR-FR', value: 'FR-FR' },
    ] },
    { key: 'wpm', label: 'Words/min', kind: 'number', min: 50, max: 300, step: 10 },
    { key: 'delay', label: 'Delay (s)', kind: 'number', min: 0, max: 5, step: 0.1 },
    { key: 'accuracy', label: 'Accuracy %', kind: 'number', min: 50, max: 100, step: 0.5 },
  ]),

  // Datacenter
  story('rack-thermal', 'Rack Thermal Map', 'Datacenter', RackThermal, { title: 'Rack Thermal Map', alertTemp: 45 }, [
    { key: 'alertTemp', label: 'Alert Temp (\u00B0C)', kind: 'number', min: 35, max: 60, step: 1 },
  ]),
  story('server-health', 'Server Health', 'Datacenter', ServerHealth, { title: 'Server Health', warningThreshold: 65 }, [
    { key: 'warningThreshold', label: 'Warning %', kind: 'number', min: 40, max: 90, step: 5 },
  ]),
  story('vm-density', 'VM Density', 'Datacenter', VMDensity, { title: 'VM Density', optimalScore: 85 }, [
    { key: 'optimalScore', label: 'Optimal Score', kind: 'number', min: 60, max: 100, step: 5 },
  ]),
  story('bandwidth-pipe', 'Bandwidth', 'Datacenter', BandwidthPipe, { title: 'Bandwidth', highUtilThreshold: 85 }, [
    { key: 'highUtilThreshold', label: 'High Util %', kind: 'number', min: 60, max: 95, step: 5 },
  ]),
  story('ups-status', 'UPS Status', 'Datacenter', UPSStatus, { title: 'UPS Status', nominalVoltage: 230, load: 62, runtime: 24, inputV: 230, outputV: 230 }, [
    { key: 'nominalVoltage', label: 'Nominal Voltage', kind: 'select', options: [
      { label: '230V', value: '230' }, { label: '120V', value: '120' }, { label: '208V', value: '208' },
    ] },
    { key: 'load', label: 'Load (%)', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'runtime', label: 'Runtime (min)', kind: 'number' as const, min: 0, max: 60, step: 1 },
    { key: 'inputV', label: 'Input Voltage', kind: 'number' as const, min: 180, max: 260, step: 1 },
    { key: 'outputV', label: 'Output Voltage', kind: 'number' as const, min: 180, max: 260, step: 1 },
  ]),
  story('cooling-efficiency', 'Cooling Efficiency', 'Datacenter', CoolingEfficiency, { title: 'Cooling Efficiency', pueTarget: 1.4, supplyTemp: 12.4, returnTemp: 22.6 }, [
    { key: 'pueTarget', label: 'PUE Target', kind: 'number', min: 1.0, max: 2.0, step: 0.1 },
    { key: 'supplyTemp', label: 'Supply Temp (C)', kind: 'number' as const, min: 5, max: 25, step: 0.5 },
    { key: 'returnTemp', label: 'Return Temp (C)', kind: 'number' as const, min: 15, max: 40, step: 0.5 },
  ]),
  story('patch-panel', 'Patch Panel', 'Datacenter', PatchPanel, { title: 'Patch Panel', portsPerRow: 6 }, [
    { key: 'portsPerRow', label: 'Ports/Row', kind: 'number', min: 3, max: 8, step: 1 },
  ]),

  // Education
  story('classroom-av', 'Classroom AV', 'Education', ClassroomAV, { title: 'Classroom AV', room: 'Room 204', source: 'HDMI', audioLevel: 72 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Classroom AV', value: 'Classroom AV' }, { label: 'Room Controls', value: 'Room Controls' }, { label: 'AV Panel', value: 'AV Panel' },
    ] },
    { key: 'source', label: 'Source', kind: 'select', options: [
      { label: 'HDMI', value: 'HDMI' }, { label: 'Wireless', value: 'Wireless' }, { label: 'Doc Cam', value: 'Doc Cam' },
    ] },
    { key: 'audioLevel', label: 'Audio Level (%)', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('attendance-board', 'Attendance Board', 'Education', AttendanceBoard, { title: 'Attendance Board', warningThreshold: 75 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Attendance Board', value: 'Attendance Board' }, { label: 'Daily Attendance', value: 'Daily Attendance' }, { label: 'Roll Call', value: 'Roll Call' },
    ] },
    { key: 'warningThreshold', label: 'Warning %', kind: 'number', min: 50, max: 95, step: 5 },
  ]),
  story('digital-bulletin', 'Digital Bulletin', 'Education', DigitalBulletin, { title: 'Digital Bulletin', maxPosts: 5 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Digital Bulletin', value: 'Digital Bulletin' }, { label: 'Announcements', value: 'Announcements' }, { label: 'Campus News', value: 'Campus News' },
    ] },
    { key: 'maxPosts', label: 'Max Posts', kind: 'number', min: 2, max: 10, step: 1 },
  ]),
  story('bell-schedule', 'Bell Schedule', 'Education', BellSchedule, { title: 'Bell Schedule', currentPeriod: 3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Bell Schedule', value: 'Bell Schedule' }, { label: 'Class Schedule', value: 'Class Schedule' }, { label: 'Period Tracker', value: 'Period Tracker' },
    ] },
    { key: 'currentPeriod', label: 'Current Period', kind: 'number', min: 0, max: 7, step: 1 },
  ]),
  story('library-occupancy', 'Library Occupancy', 'Education', LibraryOccupancy, { title: 'Library Occupancy', capacity: 120, currentOcc: 78, noiseLevel: 38 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Library Occupancy', value: 'Library Occupancy' }, { label: 'Library Status', value: 'Library Status' }, { label: 'Study Space', value: 'Study Space' },
    ] },
    { key: 'capacity', label: 'Capacity', kind: 'number', min: 20, max: 500, step: 10 },
    { key: 'currentOcc', label: 'Current Occupancy', kind: 'number' as const, min: 0, max: 500, step: 1 },
    { key: 'noiseLevel', label: 'Noise Level', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('exam-timer', 'Exam Timer', 'Education', ExamTimer, { title: 'Exam Timer', totalMin: 120, elapsedMin: 47 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Exam Timer', value: 'Exam Timer' }, { label: 'Test Clock', value: 'Test Clock' }, { label: 'Assessment Timer', value: 'Assessment Timer' },
    ] },
    { key: 'totalMin', label: 'Duration (min)', kind: 'number', min: 15, max: 240, step: 15 },
  ]),

  // Healthcare
  story('patient-monitor', 'Patient Monitor', 'Healthcare', PatientMonitor, { title: 'Patient Monitor', hr: 72, spo2: 98 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Patient Monitor', value: 'Patient Monitor' }, { label: 'Bedside Monitor', value: 'Bedside Monitor' }, { label: 'Vital Signs', value: 'Vital Signs' },
    ] },
    { key: 'hr', label: 'Heart Rate', kind: 'number', min: 40, max: 180, step: 1 },
  ]),
  story('vitals-chart', 'Vitals Chart', 'Healthcare', VitalsChart, { title: 'Vitals Trend - 24h' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Vitals Trend - 24h', value: 'Vitals Trend - 24h' }, { label: 'Vitals Trend - 12h', value: 'Vitals Trend - 12h' }, { label: 'Patient History', value: 'Patient History' },
    ] },
  ]),
  story('bed-manager', 'Bed Manager', 'Healthcare', BedManager, { title: 'Bed Occupancy' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Bed Occupancy', value: 'Bed Occupancy' }, { label: 'Ward Status', value: 'Ward Status' }, { label: 'Bed Management', value: 'Bed Management' },
    ] },
  ]),
  story('nurse-call-board', 'Nurse Call Board', 'Healthcare', NurseCallBoard, { title: 'Nurse Call Board' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Nurse Call Board', value: 'Nurse Call Board' }, { label: 'Call Station', value: 'Call Station' }, { label: 'Patient Calls', value: 'Patient Calls' },
    ] },
  ]),
  story('lab-results', 'Lab Results', 'Healthcare', LabResults, { title: 'Lab Results', panelType: 'CBC + Chem' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Lab Results', value: 'Lab Results' }, { label: 'Diagnostics', value: 'Diagnostics' }, { label: 'Blood Work', value: 'Blood Work' },
    ] },
    { key: 'panelType', label: 'Panel', kind: 'select', options: [
      { label: 'CBC + Chem', value: 'CBC + Chem' }, { label: 'CBC Only', value: 'CBC Only' }, { label: 'Metabolic', value: 'Metabolic' },
    ] },
  ]),
  story('pharmacy-queue', 'Pharmacy Queue', 'Healthcare', PharmacyQueue, { title: 'Pharmacy Queue' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Pharmacy Queue', value: 'Pharmacy Queue' }, { label: 'Rx Queue', value: 'Rx Queue' }, { label: 'Dispensary', value: 'Dispensary' },
    ] },
  ]),
  story('triage-status', 'Triage Status', 'Healthcare', TriageStatus, { title: 'Triage Status', maxBeds: 30 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Triage Status', value: 'Triage Status' }, { label: 'ED Overview', value: 'ED Overview' }, { label: 'ER Triage', value: 'ER Triage' },
    ] },
    { key: 'maxBeds', label: 'ED Capacity', kind: 'number', min: 10, max: 100, step: 5 },
  ]),

  // Hospitality
  story('room-status', 'Room Status', 'Hospitality', RoomStatus, { title: 'Room Status', floorFilter: 'all' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Room Status', value: 'Room Status' }, { label: 'Floor View', value: 'Floor View' }, { label: 'Room Board', value: 'Room Board' },
    ] },
    { key: 'floorFilter', label: 'Floor', kind: 'select', options: [
      { label: 'All Floors', value: 'all' }, { label: 'Floor 1', value: '1' }, { label: 'Floor 2', value: '2' },
    ] },
  ]),
  story('minibar-tracker', 'Minibar Inventory', 'Hospitality', MinibarTracker, { title: 'Minibar Inventory', currency: '$' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Minibar Inventory', value: 'Minibar Inventory' }, { label: 'In-Room Supplies', value: 'In-Room Supplies' }, { label: 'Minibar Stock', value: 'Minibar Stock' },
    ] },
    { key: 'currency', label: 'Currency', kind: 'select', options: [
      { label: 'USD ($)', value: '$' }, { label: 'EUR (\u20AC)', value: '\u20AC' }, { label: 'GBP (\u00A3)', value: '\u00A3' },
    ] },
  ]),
  story('guest-services', 'Guest Services', 'Hospitality', GuestServices, { title: 'Guest Services', priorityFilter: 'all' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Guest Services', value: 'Guest Services' }, { label: 'Concierge', value: 'Concierge' }, { label: 'Service Requests', value: 'Service Requests' },
    ] },
    { key: 'priorityFilter', label: 'Priority', kind: 'select', options: [
      { label: 'All', value: 'all' }, { label: 'VIP Only', value: 'vip' }, { label: 'Urgent', value: 'high' },
    ] },
  ]),
  story('housekeeping-board', 'Housekeeping', 'Hospitality', HousekeepingBoard, { title: 'Housekeeping', targetMinutes: 30 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Housekeeping', value: 'Housekeeping' }, { label: 'Room Cleaning', value: 'Room Cleaning' }, { label: 'HK Board', value: 'HK Board' },
    ] },
    { key: 'targetMinutes', label: 'Target (min)', kind: 'number', min: 15, max: 60, step: 5 },
  ]),
  story('check-in-kiosk', 'Check-In / Out', 'Hospitality', CheckInKiosk, { title: 'Check-In / Out', vipCount: 6, queueLen: 5, avgTime: 4.2 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Check-In / Out', value: 'Check-In / Out' }, { label: 'Front Desk', value: 'Front Desk' }, { label: 'Reception', value: 'Reception' },
    ] },
    { key: 'vipCount', label: 'VIP Guests', kind: 'number', min: 0, max: 20, step: 1 },
    { key: 'queueLen', label: 'Queue Length', kind: 'number' as const, min: 0, max: 20, step: 1 },
    { key: 'avgTime', label: 'Avg Check-in (min)', kind: 'number' as const, min: 1, max: 15, step: 0.5 },
  ]),
  story('pool-sensors', 'Pool & Spa', 'Hospitality', PoolSensors, { title: 'Pool & Spa', targetTemp: 28, waterTemp: 28.2, pH: 7.3, chlorine: 1.4, filterPressure: 12 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Pool & Spa', value: 'Pool & Spa' }, { label: 'Aquatics', value: 'Aquatics' }, { label: 'Pool Monitor', value: 'Pool Monitor' },
    ] },
    { key: 'targetTemp', label: 'Target Temp (\u00B0C)', kind: 'number', min: 20, max: 38, step: 1 },
    { key: 'waterTemp', label: 'Water Temp (°C)', kind: 'number' as const, min: 15, max: 40, step: 0.1 },
    { key: 'pH', label: 'pH Level', kind: 'number' as const, min: 6.0, max: 8.5, step: 0.05 },
    { key: 'chlorine', label: 'Chlorine (ppm)', kind: 'number' as const, min: 0, max: 5, step: 0.1 },
    { key: 'filterPressure', label: 'Filter PSI', kind: 'number' as const, min: 0, max: 30, step: 1 },
  ]),

  // Logistics
  story('fleet-gps', 'Fleet GPS', 'Logistics', FleetGPS, { title: 'Fleet GPS', speedUnit: 'mph' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Fleet GPS', value: 'Fleet GPS' }, { label: 'Vehicle Tracker', value: 'Vehicle Tracker' }, { label: 'Fleet Locator', value: 'Fleet Locator' },
    ] },
    { key: 'speedUnit', label: 'Speed Unit', kind: 'select', options: [
      { label: 'mph', value: 'mph' }, { label: 'km/h', value: 'km/h' },
    ] },
  ]),
  story('route-optimizer', 'Route Optimizer', 'Logistics', RouteOptimizer, { title: 'Route Optimizer', efficiencyThreshold: 85 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Route Optimizer', value: 'Route Optimizer' }, { label: 'Route Planner', value: 'Route Planner' }, { label: 'Dispatch Routes', value: 'Dispatch Routes' },
    ] },
    { key: 'efficiencyThreshold', label: 'Efficiency Threshold %', kind: 'number', min: 50, max: 100, step: 5 },
  ]),
  story('warehouse-map', 'Warehouse Zones', 'Logistics', WarehouseMap, { title: 'Warehouse Zones', capacityWarning: 70 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Warehouse Zones', value: 'Warehouse Zones' }, { label: 'Storage Map', value: 'Storage Map' }, { label: 'Facility Layout', value: 'Facility Layout' },
    ] },
    { key: 'capacityWarning', label: 'Capacity Warning %', kind: 'number', min: 40, max: 95, step: 5 },
  ]),
  story('delivery-tracker', 'Delivery Tracker', 'Logistics', DeliveryTracker, { title: 'Delivery Tracker', statusFilter: 'all' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Delivery Tracker', value: 'Delivery Tracker' }, { label: 'Parcel Status', value: 'Parcel Status' }, { label: 'Shipment Tracker', value: 'Shipment Tracker' },
    ] },
    { key: 'statusFilter', label: 'Status Filter', kind: 'select', options: [
      { label: 'All', value: 'all' }, { label: 'In Transit', value: 'in-transit' }, { label: 'Delayed', value: 'delayed' },
    ] },
  ]),
  story('dock-schedule', 'Dock Schedule', 'Logistics', DockSchedule, { title: 'Dock Schedule', dockCount: 6 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Dock Schedule', value: 'Dock Schedule' }, { label: 'Loading Bay', value: 'Loading Bay' }, { label: 'Dock Manager', value: 'Dock Manager' },
    ] },
    { key: 'dockCount', label: 'Visible Docks', kind: 'number', min: 2, max: 6, step: 1 },
  ]),
  story('fuel-monitor', 'Fuel Monitor', 'Logistics', FuelMonitor, { title: 'Fuel Monitor', lowThreshold: 25 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Fuel Monitor', value: 'Fuel Monitor' }, { label: 'Fuel Tracker', value: 'Fuel Tracker' }, { label: 'Fleet Fuel', value: 'Fleet Fuel' },
    ] },
    { key: 'lowThreshold', label: 'Low Fuel %', kind: 'number', min: 10, max: 50, step: 5 },
  ]),

  // Manufacturing
  story('assembly-line', 'Assembly Line', 'Manufacturing', AssemblyLine, { title: 'Assembly Line', targetThroughput: 150, throughput: 142 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Assembly Line', value: 'Assembly Line' }, { label: 'Production Line', value: 'Production Line' }, { label: 'Line Status', value: 'Line Status' },
    ] },
    { key: 'targetThroughput', label: 'Target Throughput', kind: 'number', min: 50, max: 500, step: 10 },
    { key: 'throughput', label: 'Throughput', kind: 'number' as const, min: 50, max: 300, step: 1 },
  ]),
  story('oee-gauge', 'OEE Monitor', 'Manufacturing', OEEGauge, { title: 'OEE Monitor', oeeTarget: 85, availability: 91.2, performance: 84.7, quality: 97.3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'OEE Monitor', value: 'OEE Monitor' }, { label: 'OEE Dashboard', value: 'OEE Dashboard' }, { label: 'Efficiency Gauge', value: 'Efficiency Gauge' },
    ] },
    { key: 'oeeTarget', label: 'OEE Target %', kind: 'number', min: 50, max: 100, step: 5 },
    { key: 'availability', label: 'Availability %', kind: 'number' as const, min: 50, max: 100, step: 0.1 },
    { key: 'performance', label: 'Performance %', kind: 'number' as const, min: 50, max: 100, step: 0.1 },
    { key: 'quality', label: 'Quality %', kind: 'number' as const, min: 50, max: 100, step: 0.1 },
  ]),
  story('quality-gate', 'Quality Gate', 'Manufacturing', QualityGate, { title: 'Quality Gate', defectTarget: 3, defectRate: 2.48 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Quality Gate', value: 'Quality Gate' }, { label: 'QC Station', value: 'QC Station' }, { label: 'Inspection Gate', value: 'Inspection Gate' },
    ] },
    { key: 'defectTarget', label: 'Defect Target %', kind: 'number', min: 1, max: 10, step: 0.5 },
    { key: 'defectRate', label: 'Defect Rate %', kind: 'number' as const, min: 0, max: 15, step: 0.1 },
  ]),
  story('plc-status', 'PLC Controller', 'Manufacturing', PLCStatus, { title: 'PLC Controller', plcModel: 'Siemens S7-1500', cycleTime: 24.6, scanRate: 4.2 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'PLC Controller', value: 'PLC Controller' }, { label: 'PLC Status', value: 'PLC Status' }, { label: 'Controller Panel', value: 'Controller Panel' },
    ] },
    { key: 'plcModel', label: 'PLC Model', kind: 'select', options: [
      { label: 'Siemens S7-1500', value: 'Siemens S7-1500' }, { label: 'Allen-Bradley CompactLogix', value: 'Allen-Bradley CompactLogix' }, { label: 'Mitsubishi FX5U', value: 'Mitsubishi FX5U' },
    ] },
    { key: 'cycleTime', label: 'Cycle Time (ms)', kind: 'number' as const, min: 5, max: 100, step: 0.1 },
    { key: 'scanRate', label: 'Scan Rate (ms)', kind: 'number' as const, min: 1, max: 20, step: 0.1 },
  ]),
  story('tank-level', 'Tank Levels', 'Manufacturing', TankLevel, { title: 'Tank Levels', lowLevelThreshold: 30 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Tank Levels', value: 'Tank Levels' }, { label: 'Fluid Storage', value: 'Fluid Storage' }, { label: 'Tank Monitor', value: 'Tank Monitor' },
    ] },
    { key: 'lowLevelThreshold', label: 'Low Level %', kind: 'number', min: 10, max: 50, step: 5 },
  ]),
  story('conveyor-speed', 'Conveyor Belt', 'Manufacturing', ConveyorSpeed, { title: 'Conveyor Belt', targetSpeed: 2.0, speed: 1.82, tension: 342, itemsMin: 48 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Conveyor Belt', value: 'Conveyor Belt' }, { label: 'Belt Monitor', value: 'Belt Monitor' }, { label: 'Conveyor Status', value: 'Conveyor Status' },
    ] },
    { key: 'targetSpeed', label: 'Target Speed (m/s)', kind: 'number', min: 0.5, max: 5.0, step: 0.1 },
    { key: 'speed', label: 'Speed (m/s)', kind: 'number' as const, min: 0.5, max: 5.0, step: 0.01 },
    { key: 'tension', label: 'Tension (N)', kind: 'number' as const, min: 100, max: 500, step: 1 },
    { key: 'itemsMin', label: 'Items/min', kind: 'number' as const, min: 10, max: 100, step: 1 },
  ]),
  story('shift-schedule', 'Shift Schedule', 'Manufacturing', ShiftSchedule, { title: 'Shift Schedule', shiftCount: 3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Shift Schedule', value: 'Shift Schedule' }, { label: 'Crew Roster', value: 'Crew Roster' }, { label: 'Shift Board', value: 'Shift Board' },
    ] },
    { key: 'shiftCount', label: 'Shifts Shown', kind: 'number', min: 1, max: 3, step: 1 },
  ]),

  // Retail
  story('pos-analytics', 'POS Analytics', 'Retail', POSAnalytics, { title: 'POS Analytics', currency: '$', revenue: 24380, avgTx: 28.8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'POS Analytics', value: 'POS Analytics' }, { label: 'Sales Dashboard', value: 'Sales Dashboard' }, { label: 'Transaction Monitor', value: 'Transaction Monitor' },
    ] },
    { key: 'currency', label: 'Currency', kind: 'select', options: [
      { label: 'USD ($)', value: '$' }, { label: 'EUR (\u20AC)', value: '\u20AC' }, { label: 'GBP (\u00A3)', value: '\u00A3' },
    ] },
    { key: 'revenue', label: 'Revenue', kind: 'number' as const, min: 5000, max: 100000, step: 1000 },
    { key: 'avgTx', label: 'Avg Transaction', kind: 'number' as const, min: 5, max: 100, step: 0.5 },
  ]),
  story('inventory-level', 'Inventory Levels', 'Retail', InventoryLevel, { title: 'Inventory Levels', showReorderLine: true }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Inventory Levels', value: 'Inventory Levels' }, { label: 'Stock Status', value: 'Stock Status' }, { label: 'Warehouse Levels', value: 'Warehouse Levels' },
    ] },
    { key: 'showReorderLine', label: 'Show Reorder Line', kind: 'boolean' },
  ]),
  story('foot-traffic', 'Foot Traffic', 'Retail', FootTraffic, { title: 'Foot Traffic', maxCapacity: 300, occupancy: 186 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Foot Traffic', value: 'Foot Traffic' }, { label: 'Store Traffic', value: 'Store Traffic' }, { label: 'Visitor Counter', value: 'Visitor Counter' },
    ] },
    { key: 'maxCapacity', label: 'Max Capacity', kind: 'number', min: 50, max: 1000, step: 50 },
    { key: 'occupancy', label: 'Occupancy', kind: 'number' as const, min: 0, max: 500, step: 5 },
  ]),
  story('queue-monitor', 'Queue Monitor', 'Retail', QueueMonitor, { title: 'Queue Monitor', longQueueThreshold: 5, r1: 3, r2: 5, r3: 1, r4: 0 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Queue Monitor', value: 'Queue Monitor' }, { label: 'Checkout Queues', value: 'Checkout Queues' }, { label: 'Wait Times', value: 'Wait Times' },
    ] },
    { key: 'longQueueThreshold', label: 'Long Queue At', kind: 'number', min: 2, max: 10, step: 1 },
    { key: 'r1', label: 'Register 1', kind: 'number' as const, min: 0, max: 15, step: 1 },
    { key: 'r2', label: 'Register 2', kind: 'number' as const, min: 0, max: 15, step: 1 },
    { key: 'r3', label: 'Register 3', kind: 'number' as const, min: 0, max: 15, step: 1 },
    { key: 'r4', label: 'Register 4', kind: 'number' as const, min: 0, max: 15, step: 1 },
  ]),
  story('price-tag', 'Dynamic Pricing', 'Retail', PriceTag, { title: 'Dynamic Pricing', currency: '$' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Dynamic Pricing', value: 'Dynamic Pricing' }, { label: 'Price Manager', value: 'Price Manager' }, { label: 'Price Board', value: 'Price Board' },
    ] },
    { key: 'currency', label: 'Currency', kind: 'select', options: [
      { label: 'USD ($)', value: '$' }, { label: 'EUR (\u20AC)', value: '\u20AC' }, { label: 'GBP (\u00A3)', value: '\u00A3' },
    ] },
  ]),
  story('shrinkage-alert', 'Shrinkage Alerts', 'Retail', ShrinkageAlert, { title: 'Shrinkage Alerts', severityFilter: 'all' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Shrinkage Alerts', value: 'Shrinkage Alerts' }, { label: 'Loss Prevention', value: 'Loss Prevention' }, { label: 'Shrinkage Monitor', value: 'Shrinkage Monitor' },
    ] },
    { key: 'severityFilter', label: 'Severity Filter', kind: 'select', options: [
      { label: 'All', value: 'all' }, { label: 'High Only', value: 'high' }, { label: 'Medium+', value: 'medium' },
    ] },
  ]),
  story('loyalty-dash', 'Loyalty Program', 'Retail', LoyaltyDash, { title: 'Loyalty Program', redemptionTarget: 70, pointsDist: 284000 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Loyalty Program', value: 'Loyalty Program' }, { label: 'Rewards Dashboard', value: 'Rewards Dashboard' }, { label: 'Member Status', value: 'Member Status' },
    ] },
    { key: 'redemptionTarget', label: 'Redemption Target %', kind: 'number', min: 30, max: 100, step: 5 },
    { key: 'pointsDist', label: 'Points Distributed', kind: 'number' as const, min: 50000, max: 1000000, step: 10000 },
  ]),

  // Smart Building
  story('hvac-zone', 'HVAC Zone', 'Smart Building', HVACZone, { title: 'HVAC Zone', zone: 'Zone A — Lobby', setpoint: 22, mode: 'auto', humidity: 44, fanSpeed: 65 }, [
    { key: 'setpoint', label: 'Setpoint (°C)', kind: 'number', min: 16, max: 28, step: 1 },
    { key: 'mode', label: 'Mode', kind: 'select', options: [
      { label: 'Auto', value: 'auto' }, { label: 'Heat', value: 'heat' }, { label: 'Cool', value: 'cool' },
    ] },
  ]),
  story('elevator-status', 'Elevator Status', 'Smart Building', ElevatorStatus, { title: 'Elevator Status', totalFloors: 15 }, [
    { key: 'totalFloors', label: 'Total Floors', kind: 'number', min: 5, max: 50, step: 1 },
  ]),
  story('parking-occupancy', 'Parking Occupancy', 'Smart Building', ParkingOccupancy, { title: 'Parking Occupancy', warningThreshold: 65 }, [
    { key: 'warningThreshold', label: 'Warning %', kind: 'number', min: 40, max: 90, step: 5 },
  ]),
  story('water-meter', 'Water Consumption', 'Smart Building', WaterMeter, { title: 'Water Consumption', flowUnit: 'L/min', flowRate: 3.8, dailyUsage: 2840, monthlyUsage: 68400, pressure: 4.2 }, [
    { key: 'flowUnit', label: 'Flow Unit', kind: 'select', options: [
      { label: 'L/min', value: 'L/min' }, { label: 'gal/min', value: 'gal/min' }, { label: 'm³/hr', value: 'm³/hr' },
    ] },
  ]),
  story('lighting-scene', 'Lighting Control', 'Smart Building', LightingScene, { title: 'Lighting Control', defaultScene: 'Meeting', totalPower: 4.2 }, [
    { key: 'defaultScene', label: 'Default Scene', kind: 'select', options: [
      { label: 'Meeting', value: 'Meeting' }, { label: 'Presentation', value: 'Presentation' }, { label: 'Off', value: 'Off' },
    ] },
  ]),
  story('access-door', 'Door Access', 'Smart Building', AccessDoor, { title: 'Door Access', maxDoors: 8 }, [
    { key: 'maxDoors', label: 'Max Doors', kind: 'number', min: 3, max: 8, step: 1 },
  ]),
  story('fire-panel', 'Fire Alarm Panel', 'Smart Building', FirePanel, { title: 'Fire Alarm Panel', zoneLayout: '4x2' }, [
    { key: 'zoneLayout', label: 'Zone Layout', kind: 'select', options: [
      { label: '4 Columns', value: '4x2' }, { label: '2 Columns', value: '2x4' },
    ] },
  ]),

  // Aerospace
  story('flight-board', 'Flight Board', 'Aerospace', FlightBoard, { title: 'Departures', maxFlights: 6 }, [
    { key: 'maxFlights', label: 'Max Flights', kind: 'number', min: 3, max: 6, step: 1 },
  ]),
  story('runway-status', 'Runway Status', 'Aerospace', RunwayStatus, { title: 'Runway Status', windUnit: 'kt' }, [
    { key: 'windUnit', label: 'Wind Unit', kind: 'select', options: [
      { label: 'Knots', value: 'kt' }, { label: 'km/h', value: 'km/h' }, { label: 'mph', value: 'mph' },
    ] },
  ]),
  story('baggage-flow', 'Baggage Flow', 'Aerospace', BaggageFlow, { title: 'Baggage System', rateUnit: 'bags/min', currentRate: 142 }, [
    { key: 'rateUnit', label: 'Rate Unit', kind: 'select', options: [
      { label: 'bags/min', value: 'bags/min' }, { label: 'bags/hr', value: 'bags/hr' },
    ] },
    { key: 'currentRate', label: 'Current Rate', kind: 'number' as const, min: 0, max: 300, step: 5 },
  ]),
  story('fuel-farm', 'Fuel Farm', 'Aerospace', FuelFarm, { title: 'Fuel Farm', lowLevelThreshold: 30, dailyConsumption: 42.5 }, [
    { key: 'lowLevelThreshold', label: 'Low Level %', kind: 'number' as const, min: 10, max: 50, step: 5 },
    { key: 'dailyConsumption', label: 'Daily Consumption (kL)', kind: 'number' as const, min: 10, max: 100, step: 2.5 },
  ]),
  story('aircraft-maintenance', 'Aircraft Maintenance', 'Aerospace', AircraftMaintenance, { title: 'Maintenance Schedule', maxAircraft: 5 }, [
    { key: 'maxAircraft', label: 'Max Aircraft', kind: 'number', min: 2, max: 5, step: 1 },
  ]),
  story('gate-assignment', 'Gate Assignment', 'Aerospace', GateAssignment, { title: 'Gate Assignment', columns: 4 }, [
    { key: 'columns', label: 'Columns', kind: 'number', min: 2, max: 6, step: 1 },
  ]),

  // Pharmaceutical
  story('clean-room', 'Clean Room', 'Pharmaceutical', CleanRoom, { title: 'Clean Room Monitor', particleLimit: 100, particleCount: 85, diffPressure: 12.5, temperature: 21.0, humidity: 45, prevParticle: 90 }, [
    { key: 'particleLimit', label: 'Particle Limit', kind: 'number' as const, min: 50, max: 1000, step: 50 },
    { key: 'particleCount', label: 'Particle Count', kind: 'number' as const, min: 10, max: 500, step: 5 },
    { key: 'diffPressure', label: 'Diff Pressure (Pa)', kind: 'number' as const, min: 5, max: 25, step: 0.5 },
    { key: 'temperature', label: 'Temperature (°C)', kind: 'number' as const, min: 18, max: 26, step: 0.5 },
    { key: 'humidity', label: 'Humidity (% RH)', kind: 'number' as const, min: 30, max: 70, step: 1 },
    { key: 'prevParticle', label: 'Prev Particle Count', kind: 'number' as const, min: 10, max: 500, step: 5 },
  ]),
  story('batch-reactor', 'Batch Reactor', 'Pharmaceutical', BatchReactor, { title: 'Batch Reactors', tempWarning: 60 }, [
    { key: 'tempWarning', label: 'Temp Warning (°C)', kind: 'number', min: 40, max: 100, step: 5 },
  ]),
  story('chromatograph', 'HPLC Chromatograph', 'Pharmaceutical', Chromatograph, { title: 'HPLC Chromatogram', method: 'USP-42', runTime: 18.4 }, [
    { key: 'method', label: 'Method', kind: 'select', options: [
      { label: 'USP-42', value: 'USP-42' }, { label: 'EP-10', value: 'EP-10' }, { label: 'JP-XVIII', value: 'JP-XVIII' },
    ] },
    { key: 'runTime', label: 'Run Time (min)', kind: 'number' as const, min: 5, max: 30, step: 0.2 },
  ]),
  story('cold-chain', 'Cold Chain', 'Pharmaceutical', ColdChain, { title: 'Cold Chain Monitor', tempUnit: 'C' }, [
    { key: 'tempUnit', label: 'Temp Unit', kind: 'select', options: [
      { label: 'Celsius', value: 'C' }, { label: 'Fahrenheit', value: 'F' },
    ] },
  ]),
  story('quality-lab', 'Quality Lab', 'Pharmaceutical', QualityLab, { title: 'Quality Lab Results', maxSamples: 6 }, [
    { key: 'maxSamples', label: 'Max Samples', kind: 'number', min: 3, max: 6, step: 1 },
  ]),
  story('compliance-tracker', 'GxP Compliance', 'Pharmaceutical', ComplianceTracker, { title: 'GxP Compliance', passThreshold: 95 }, [
    { key: 'passThreshold', label: 'Pass Threshold %', kind: 'number', min: 80, max: 100, step: 5 },
  ]),

  // Telecom
  story('cell-tower', 'Cell Tower Status', 'Telecom', CellTower, { title: 'Cell Towers', signalWarning: -85 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Cell Towers', value: 'Cell Towers' }, { label: 'Tower Status', value: 'Tower Status' }, { label: 'Base Stations', value: 'Base Stations' },
    ] },
    { key: 'signalWarning', label: 'Signal Warning (dBm)', kind: 'number', min: -100, max: -60, step: 5 },
  ]),
  story('spectrum-analyzer', 'Spectrum Analyzer', 'Telecom', SpectrumAnalyzer, { title: 'Spectrum Analyzer', binCount: 32 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Spectrum Analyzer', value: 'Spectrum Analyzer' }, { label: 'RF Spectrum', value: 'RF Spectrum' }, { label: 'Frequency Scan', value: 'Frequency Scan' },
    ] },
    { key: 'binCount', label: 'Frequency Bins', kind: 'number', min: 16, max: 64, step: 8 },
  ]),
  story('subscriber-metrics', 'Subscriber Metrics', 'Telecom', SubscriberMetrics, { title: 'Subscribers', arpu: 42.50, activeSessions: 184200 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Subscribers', value: 'Subscribers' }, { label: 'Customer Base', value: 'Customer Base' }, { label: 'User Metrics', value: 'User Metrics' },
    ] },
    { key: 'arpu', label: 'ARPU ($)', kind: 'number', min: 10, max: 100, step: 5 },
    { key: 'activeSessions', label: 'Active Sessions', kind: 'number', min: 0, max: 500000, step: 5000 },
  ]),
  story('network-slicing', 'Network Slicing', 'Telecom', NetworkSlicing, { title: '5G Network Slices', slaTarget: 99 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: '5G Network Slices', value: '5G Network Slices' }, { label: 'Network Slicing', value: 'Network Slicing' }, { label: 'Slice Manager', value: 'Slice Manager' },
    ] },
    { key: 'slaTarget', label: 'SLA Target %', kind: 'number', min: 95, max: 100, step: 0.5 },
  ]),
  story('sim-inventory', 'SIM Inventory', 'Telecom', SIMInventory, { title: 'SIM Inventory', dataWarning: 80 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'SIM Inventory', value: 'SIM Inventory' }, { label: 'SIM Management', value: 'SIM Management' }, { label: 'eSIM Fleet', value: 'eSIM Fleet' },
    ] },
    { key: 'dataWarning', label: 'Data Warning %', kind: 'number', min: 50, max: 95, step: 5 },
  ]),
  story('call-quality', 'Call Quality', 'Telecom', CallQuality, { title: 'Call Quality', mosTarget: 4, mos: 4.2, jitter: 12, latency: 28, packetLoss: 0.3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Call Quality', value: 'Call Quality' }, { label: 'Voice Quality', value: 'Voice Quality' }, { label: 'QoS Monitor', value: 'QoS Monitor' },
    ] },
    { key: 'mosTarget', label: 'MOS Target', kind: 'number', min: 2, max: 5, step: 0.5 },
    { key: 'mos', label: 'MOS Score', kind: 'number', min: 1, max: 5, step: 0.1 },
    { key: 'jitter', label: 'Jitter (ms)', kind: 'number', min: 0, max: 50, step: 1 },
    { key: 'latency', label: 'Latency (ms)', kind: 'number', min: 0, max: 200, step: 5 },
    { key: 'packetLoss', label: 'Packet Loss %', kind: 'number', min: 0, max: 5, step: 0.1 },
  ]),

  // Maritime
  story('vessel-tracker', 'Vessel Tracker', 'Maritime', VesselTracker, { title: 'Vessel Tracker', speedUnit: 'kn' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Vessel Tracker', value: 'Vessel Tracker' }, { label: 'Ship Tracker', value: 'Ship Tracker' }, { label: 'AIS Monitor', value: 'AIS Monitor' },
    ] },
    { key: 'speedUnit', label: 'Speed Unit', kind: 'select', options: [
      { label: 'Knots', value: 'kn' }, { label: 'km/h', value: 'km/h' }, { label: 'mph', value: 'mph' },
    ] },
  ]),
  story('container-yard', 'Container Yard', 'Maritime', ContainerYard, { title: 'Container Yard', capacityWarning: 90 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Container Yard', value: 'Container Yard' }, { label: 'Yard Operations', value: 'Yard Operations' }, { label: 'TEU Tracker', value: 'TEU Tracker' },
    ] },
    { key: 'capacityWarning', label: 'Capacity Warning %', kind: 'number', min: 60, max: 100, step: 5 },
  ]),
  story('tide-monitor', 'Tide Monitor', 'Maritime', TideMonitor, { title: 'Tide Monitor', depthUnit: 'meters', tideLevel: 3.8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Tide Monitor', value: 'Tide Monitor' }, { label: 'Tidal Data', value: 'Tidal Data' }, { label: 'Water Level', value: 'Water Level' },
    ] },
    { key: 'depthUnit', label: 'Depth Unit', kind: 'select', options: [
      { label: 'Meters', value: 'meters' }, { label: 'Feet', value: 'feet' }, { label: 'Fathoms', value: 'fathoms' },
    ] },
    { key: 'tideLevel', label: 'Tide Level (m)', kind: 'number' as const, min: 0, max: 8, step: 0.1 },
  ]),
  story('crane-ops', 'Crane Operations', 'Maritime', CraneOps, { title: 'Quay Cranes', efficiencyTarget: 90 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Quay Cranes', value: 'Quay Cranes' }, { label: 'Crane Operations', value: 'Crane Operations' }, { label: 'Port Cranes', value: 'Port Cranes' },
    ] },
    { key: 'efficiencyTarget', label: 'Efficiency Target %', kind: 'number', min: 70, max: 100, step: 5 },
  ]),
  story('berth-schedule', 'Berth Schedule', 'Maritime', BerthSchedule, { title: 'Berth Schedule', statusFilter: 'all' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Berth Schedule', value: 'Berth Schedule' }, { label: 'Berth Allocation', value: 'Berth Allocation' }, { label: 'Dock Schedule', value: 'Dock Schedule' },
    ] },
    { key: 'statusFilter', label: 'Status Filter', kind: 'select', options: [
      { label: 'All', value: 'all' }, { label: 'Occupied', value: 'occupied' }, { label: 'Available', value: 'available' },
    ] },
  ]),
  story('cargo-manifest', 'Cargo Manifest', 'Maritime', CargoManifest, { title: 'Cargo Manifest', hazmatHighlight: true }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Cargo Manifest', value: 'Cargo Manifest' }, { label: 'Freight Summary', value: 'Freight Summary' }, { label: 'Cargo Overview', value: 'Cargo Overview' },
    ] },
    { key: 'hazmatHighlight', label: 'Hazmat Highlight', kind: 'boolean' },
  ]),

  // Construction
  story('site-progress', 'Site Progress', 'Construction', SiteProgress, { title: 'Site Progress', targetDate: 'Jan 2026' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Site Progress', value: 'Site Progress' }, { label: 'Project Status', value: 'Project Status' }, { label: 'Build Progress', value: 'Build Progress' },
    ] },
    { key: 'targetDate', label: 'Target Date', kind: 'select', options: [
      { label: 'Jan 2026', value: 'Jan 2026' }, { label: 'Mar 2026', value: 'Mar 2026' }, { label: 'Jun 2026', value: 'Jun 2026' },
    ] },
  ]),
  story('crane-monitor', 'Crane Monitor', 'Construction', CraneMonitor, { title: 'Crane Monitor', windLimit: 25 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Crane Monitor', value: 'Crane Monitor' }, { label: 'Tower Cranes', value: 'Tower Cranes' }, { label: 'Crane Status', value: 'Crane Status' },
    ] },
    { key: 'windLimit', label: 'Wind Limit (mph)', kind: 'number', min: 15, max: 40, step: 5 },
  ]),
  story('materials-tracker', 'Materials Tracker', 'Construction', MaterialsTracker, { title: 'Materials Tracker', statusFilter: 'all' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Materials Tracker', value: 'Materials Tracker' }, { label: 'Material Inventory', value: 'Material Inventory' }, { label: 'Supply Tracker', value: 'Supply Tracker' },
    ] },
    { key: 'statusFilter', label: 'Status Filter', kind: 'select', options: [
      { label: 'All', value: 'all' }, { label: 'Critical', value: 'critical' }, { label: 'Low', value: 'low' },
    ] },
  ]),
  story('weather-site', 'Site Weather', 'Construction', WeatherSite, { title: 'Site Weather', tempUnit: 'F', temp: 82, wind: 18, gusts: 26, humidity: 54, precip: 12 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Site Weather', value: 'Site Weather' }, { label: 'Weather Station', value: 'Weather Station' }, { label: 'Field Conditions', value: 'Field Conditions' },
    ] },
    { key: 'tempUnit', label: 'Temp Unit', kind: 'select', options: [
      { label: 'Fahrenheit', value: 'F' }, { label: 'Celsius', value: 'C' },
    ] },
    { key: 'temp', label: 'Temperature', kind: 'number' as const, min: 30, max: 120, step: 1 },
    { key: 'wind', label: 'Wind mph', kind: 'number' as const, min: 0, max: 60, step: 1 },
    { key: 'gusts', label: 'Gusts mph', kind: 'number' as const, min: 0, max: 80, step: 1 },
    { key: 'humidity', label: 'Humidity %', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'precip', label: 'Precip %', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('safety-board', 'Safety Board', 'Construction', SafetyBoard, { title: 'Safety Board', incidentGoal: 0, workersOnSite: 84 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Safety Board', value: 'Safety Board' }, { label: 'Safety Dashboard', value: 'Safety Dashboard' }, { label: 'EHS Board', value: 'EHS Board' },
    ] },
    { key: 'incidentGoal', label: 'Incident Goal', kind: 'number', min: 0, max: 10, step: 1 },
    { key: 'workersOnSite', label: 'Workers On Site', kind: 'number' as const, min: 0, max: 200, step: 1 },
  ]),
  story('concrete-monitor', 'Concrete Monitor', 'Construction', ConcreteMonitor, { title: 'Concrete Monitor', targetPSI: 4000, slump: 4.2, airContent: 5.8, concreteTemp: 72 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Concrete Monitor', value: 'Concrete Monitor' }, { label: 'Pour Monitor', value: 'Pour Monitor' }, { label: 'Cure Tracker', value: 'Cure Tracker' },
    ] },
    { key: 'targetPSI', label: 'Target PSI', kind: 'number', min: 2000, max: 8000, step: 500 },
    { key: 'slump', label: 'Slump in', kind: 'number' as const, min: 1, max: 8, step: 0.1 },
    { key: 'airContent', label: 'Air Content %', kind: 'number' as const, min: 1, max: 10, step: 0.1 },
    { key: 'concreteTemp', label: 'Concrete Temp F', kind: 'number' as const, min: 40, max: 110, step: 1 },
  ]),
  story('equipment-fleet', 'Equipment Fleet', 'Construction', EquipmentFleet, { title: 'Equipment Fleet', lowFuelThreshold: 25 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Equipment Fleet', value: 'Equipment Fleet' }, { label: 'Heavy Equipment', value: 'Heavy Equipment' }, { label: 'Fleet Status', value: 'Fleet Status' },
    ] },
    { key: 'lowFuelThreshold', label: 'Low Fuel %', kind: 'number', min: 10, max: 50, step: 5 },
  ]),

  // ── Mining ──────────────────────────────────────────────────────────
  story('mine-shaft-depth', 'Mine Shaft Depth', 'Mining', MineShaftDepth, { title: 'Mine Shaft', maxDepth: 800, currentDepth: 520, temperature: 34, humidity: 78 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Mine Shaft', value: 'Mine Shaft' }, { label: 'Shaft Monitor', value: 'Shaft Monitor' }, { label: 'Depth Tracker', value: 'Depth Tracker' },
    ] },
    { key: 'maxDepth', label: 'Max Depth (m)', kind: 'number', min: 200, max: 2000, step: 100 },
    { key: 'currentDepth', label: 'Current Depth (m)', kind: 'number', min: 0, max: 800, step: 10 },
    { key: 'temperature', label: 'Temperature (°C)', kind: 'number', min: 20, max: 50, step: 1 },
    { key: 'humidity', label: 'Humidity (%)', kind: 'number', min: 40, max: 100, step: 1 },
  ]),
  story('ore-grade', 'Ore Grade Analyzer', 'Mining', OreGradeAnalyzer, { title: 'Ore Grade', gradeThreshold: 65 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Ore Grade', value: 'Ore Grade' }, { label: 'Grade Analysis', value: 'Grade Analysis' }, { label: 'Assay Results', value: 'Assay Results' },
    ] },
    { key: 'gradeThreshold', label: 'Threshold %', kind: 'number', min: 30, max: 95, step: 5 },
  ]),
  story('ventilation-fan', 'Ventilation Fan', 'Mining', VentilationFan, { title: 'Ventilation', rpmTarget: 1200, airflow: 42, power: 18.5 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Ventilation', value: 'Ventilation' }, { label: 'Fan Status', value: 'Fan Status' }, { label: 'Air Flow', value: 'Air Flow' },
    ] },
    { key: 'rpmTarget', label: 'Target RPM', kind: 'number', min: 600, max: 2400, step: 100 },
    { key: 'airflow', label: 'Airflow (m³/s)', kind: 'number', min: 0, max: 100, step: 1 },
    { key: 'power', label: 'Power (kW)', kind: 'number', min: 0, max: 50, step: 0.5 },
  ]),
  story('conveyor-load', 'Conveyor Load', 'Mining', ConveyorLoad, { title: 'Conveyor Load', capacityWarning: 80, loadPct: 68, speed: 2.4, throughput: 340, motorTemp: 62 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Conveyor Load', value: 'Conveyor Load' }, { label: 'Belt Status', value: 'Belt Status' }, { label: 'Load Monitor', value: 'Load Monitor' },
    ] },
    { key: 'capacityWarning', label: 'Warning %', kind: 'number', min: 50, max: 95, step: 5 },
    { key: 'loadPct', label: 'Load (%)', kind: 'number', min: 0, max: 100, step: 1 },
    { key: 'speed', label: 'Speed (m/s)', kind: 'number', min: 0, max: 5, step: 0.1 },
    { key: 'throughput', label: 'Throughput (t/h)', kind: 'number', min: 0, max: 600, step: 10 },
    { key: 'motorTemp', label: 'Motor Temp (°C)', kind: 'number', min: 30, max: 100, step: 1 },
  ]),
  story('blast-sequencer', 'Blast Sequencer', 'Mining', BlastSequencer, { title: 'Blast Sequence', countdown: 30 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Blast Sequence', value: 'Blast Sequence' }, { label: 'Detonation', value: 'Detonation' }, { label: 'Blast Control', value: 'Blast Control' },
    ] },
    { key: 'countdown', label: 'Countdown (s)', kind: 'number', min: 10, max: 120, step: 5 },
  ]),
  story('cage-winder', 'Cage Winder', 'Mining', CageWinder, { title: 'Cage Winder', speedUnit: 'm/s', speed: 8.2, depth: 420, loadWeight: 12.4, ropeStress: 62 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Cage Winder', value: 'Cage Winder' }, { label: 'Hoist System', value: 'Hoist System' }, { label: 'Winder Control', value: 'Winder Control' },
    ] },
    { key: 'speedUnit', label: 'Speed Unit', kind: 'select', options: [
      { label: 'm/s', value: 'm/s' }, { label: 'ft/min', value: 'ft/min' },
    ] },
    { key: 'speed', label: 'Speed', kind: 'number', min: 0, max: 14, step: 0.1 },
    { key: 'depth', label: 'Depth (m)', kind: 'number', min: 0, max: 800, step: 10 },
    { key: 'loadWeight', label: 'Load Weight (t)', kind: 'number', min: 0, max: 25, step: 0.1 },
    { key: 'ropeStress', label: 'Rope Stress (%)', kind: 'number', min: 0, max: 100, step: 1 },
  ]),

  // ── Water Treatment ─────────────────────────────────────────────────
  story('water-flow-rate', 'Water Flow Rate', 'Water Treatment', WaterFlowRate, { title: 'Flow Rate', flowUnit: 'L/min' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Flow Rate', value: 'Flow Rate' }, { label: 'Water Flow', value: 'Water Flow' }, { label: 'Flow Monitor', value: 'Flow Monitor' },
    ] },
    { key: 'flowUnit', label: 'Unit', kind: 'select', options: [
      { label: 'L/min', value: 'L/min' }, { label: 'GPM', value: 'GPM' }, { label: 'm³/h', value: 'm³/h' },
    ] },
  ]),
  story('chemical-dosing', 'Chemical Dosing', 'Water Treatment', ChemicalDosing, { title: 'Chemical Dosing', phTarget: 7.0, chlorine: 1.2, fluoride: 0.7 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Chemical Dosing', value: 'Chemical Dosing' }, { label: 'pH Control', value: 'pH Control' }, { label: 'Dosing System', value: 'Dosing System' },
    ] },
    { key: 'phTarget', label: 'pH Target', kind: 'number' as const, min: 5, max: 9, step: 0.5 },
    { key: 'chlorine', label: 'Chlorine (ppm)', kind: 'number' as const, min: 0, max: 3, step: 0.1 },
    { key: 'fluoride', label: 'Fluoride (ppm)', kind: 'number' as const, min: 0, max: 2, step: 0.05 },
  ]),
  story('filtration-bank', 'Filtration Bank', 'Water Treatment', FiltrationBank, { title: 'Filtration Bank', stageCount: 4, pressures: [12.4, 18.7, 24.1, 31.5] }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Filtration Bank', value: 'Filtration Bank' }, { label: 'Filter Status', value: 'Filter Status' }, { label: 'Multi-Stage Filter', value: 'Multi-Stage Filter' },
    ] },
    { key: 'stageCount', label: 'Stages', kind: 'number', min: 2, max: 6, step: 1 },
  ]),
  story('water-tank-level', 'Water Tank Level', 'Water Treatment', WaterTankLevel, { title: 'Tank Level', tankCount: 3, levels: [72, 45, 88] }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Tank Level', value: 'Tank Level' }, { label: 'Water Storage', value: 'Water Storage' }, { label: 'Reservoir', value: 'Reservoir' },
    ] },
    { key: 'tankCount', label: 'Tanks', kind: 'number', min: 1, max: 6, step: 1 },
  ]),
  story('turbidity-meter', 'Turbidity Meter', 'Water Treatment', TurbidityMeter, { title: 'Turbidity', ntuLimit: 4, ntu: 2.1 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Turbidity', value: 'Turbidity' }, { label: 'Water Clarity', value: 'Water Clarity' }, { label: 'NTU Monitor', value: 'NTU Monitor' },
    ] },
    { key: 'ntuLimit', label: 'NTU Limit', kind: 'number' as const, min: 1, max: 10, step: 1 },
    { key: 'ntu', label: 'NTU Reading', kind: 'number' as const, min: 0, max: 10, step: 0.1 },
  ]),
  story('pump-station', 'Pump Station', 'Water Treatment', PumpStation, { title: 'Pump Station', pressureUnit: 'PSI', pressures: [48, 42, 55], flows: [115, 72, 96], rpms: [1480, 1220, 1380] }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Pump Station', value: 'Pump Station' }, { label: 'Pump House', value: 'Pump House' }, { label: 'Booster Station', value: 'Booster Station' },
    ] },
    { key: 'pressureUnit', label: 'Unit', kind: 'select', options: [
      { label: 'PSI', value: 'PSI' }, { label: 'bar', value: 'bar' }, { label: 'kPa', value: 'kPa' },
    ] },
  ]),

  // ── Robotics ────────────────────────────────────────────────────────
  story('robot-arm-pose', 'Robot Arm Pose', 'Robotics', RobotArmPose, { title: 'Robot Arm', joints: 6, angles: [12.5, -8.3, 64.1, 22.7, -15.4, 40.2] }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Robot Arm', value: 'Robot Arm' }, { label: 'Arm Status', value: 'Arm Status' }, { label: 'Manipulator', value: 'Manipulator' },
    ] },
    { key: 'joints', label: 'Joints', kind: 'number', min: 3, max: 8, step: 1 },
  ]),
  story('joint-torque', 'Joint Torque', 'Robotics', JointTorque, { title: 'Joint Torque', torqueLimit: 100, torques: [62, 78, 45, 91] }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Joint Torque', value: 'Joint Torque' }, { label: 'Torque Monitor', value: 'Torque Monitor' }, { label: 'Load Analysis', value: 'Load Analysis' },
    ] },
    { key: 'torqueLimit', label: 'Limit (Nm)', kind: 'number', min: 20, max: 500, step: 10 },
  ]),
  story('vision-feed', 'Vision Feed', 'Robotics', VisionFeed, { title: 'Vision Feed', confidence: 85, fps: 29.8, detections: 3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Vision Feed', value: 'Vision Feed' }, { label: 'Camera View', value: 'Camera View' }, { label: 'Object Detection', value: 'Object Detection' },
    ] },
    { key: 'confidence', label: 'Confidence %', kind: 'number', min: 50, max: 99, step: 5 },
    { key: 'fps', label: 'FPS', kind: 'number' as const, min: 1, max: 60, step: 0.5 },
    { key: 'detections', label: 'Detections', kind: 'number' as const, min: 0, max: 20, step: 1 },
  ]),
  story('task-queue', 'Task Queue', 'Robotics', TaskQueue, { title: 'Task Queue', maxTasks: 8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Task Queue', value: 'Task Queue' }, { label: 'Job Queue', value: 'Job Queue' }, { label: 'Work Orders', value: 'Work Orders' },
    ] },
    { key: 'maxTasks', label: 'Max Tasks', kind: 'number', min: 4, max: 16, step: 2 },
  ]),
  story('gripper-status', 'Gripper Status', 'Robotics', GripperStatus, { title: 'Gripper', forceUnit: 'N', force: 24.6 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Gripper', value: 'Gripper' }, { label: 'End Effector', value: 'End Effector' }, { label: 'Grip Control', value: 'Grip Control' },
    ] },
    { key: 'forceUnit', label: 'Force Unit', kind: 'select', options: [
      { label: 'N', value: 'N' }, { label: 'lbf', value: 'lbf' },
    ] },
    { key: 'force', label: 'Grip Force', kind: 'number' as const, min: 0, max: 50, step: 0.5 },
  ]),
  story('cycle-counter', 'Cycle Counter', 'Robotics', CycleCounter, { title: 'Cycle Counter', targetCycles: 10000, cycleRate: 12.4, uptime: 98.7 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Cycle Counter', value: 'Cycle Counter' }, { label: 'Production Count', value: 'Production Count' }, { label: 'Cycle Tracker', value: 'Cycle Tracker' },
    ] },
    { key: 'targetCycles', label: 'Target', kind: 'number', min: 1000, max: 50000, step: 1000 },
    { key: 'cycleRate', label: 'Cycle Rate (/min)', kind: 'number' as const, min: 0, max: 30, step: 0.5 },
    { key: 'uptime', label: 'Uptime %', kind: 'number' as const, min: 0, max: 100, step: 0.1 },
  ]),

  // ── Nuclear ─────────────────────────────────────────────────────────
  story('reactor-status', 'Reactor Status', 'Nuclear', ReactorStatus, { title: 'Reactor Status', powerLevel: 85, temp: 315 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Reactor Status', value: 'Reactor Status' }, { label: 'Core Monitor', value: 'Core Monitor' }, { label: 'Power Plant', value: 'Power Plant' },
    ] },
    { key: 'powerLevel', label: 'Power %', kind: 'number', min: 0, max: 100, step: 5 },
    { key: 'temp', label: 'Core Temp (\u00b0C)', kind: 'number' as const, min: 200, max: 500, step: 5 },
  ]),
  story('cooling-loop', 'Cooling Loop', 'Nuclear', CoolingLoop, { title: 'Cooling Loop', flowWarning: 85, flowRate: 92, inletTemp: 285, outletTemp: 320, pressure: 155 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Cooling Loop', value: 'Cooling Loop' }, { label: 'Coolant System', value: 'Coolant System' }, { label: 'Heat Exchanger', value: 'Heat Exchanger' },
    ] },
    { key: 'flowWarning', label: 'Warning %', kind: 'number', min: 50, max: 95, step: 5 },
    { key: 'flowRate', label: 'Flow Rate %', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'inletTemp', label: 'Inlet Temp (\u00b0C)', kind: 'number' as const, min: 200, max: 350, step: 5 },
    { key: 'outletTemp', label: 'Outlet Temp (\u00b0C)', kind: 'number' as const, min: 250, max: 400, step: 5 },
    { key: 'pressure', label: 'Pressure (bar)', kind: 'number' as const, min: 100, max: 200, step: 5 },
  ]),
  story('radiation-level', 'Radiation Level', 'Nuclear', RadiationLevel, { title: 'Radiation Level', alertThreshold: 80, level: 42, dose: 0.12 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Radiation Level', value: 'Radiation Level' }, { label: 'Dose Rate', value: 'Dose Rate' }, { label: 'Rad Monitor', value: 'Rad Monitor' },
    ] },
    { key: 'alertThreshold', label: 'Alert %', kind: 'number', min: 40, max: 95, step: 5 },
    { key: 'level', label: 'Level %', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'dose', label: 'Dose (mSv/h)', kind: 'number' as const, min: 0, max: 1, step: 0.01 },
  ]),
  story('containment-status', 'Containment Status', 'Nuclear', ContainmentStatus, { title: 'Containment', sealCount: 4, pressure: 1.02 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Containment', value: 'Containment' }, { label: 'Containment Seals', value: 'Containment Seals' }, { label: 'Barrier Status', value: 'Barrier Status' },
    ] },
    { key: 'sealCount', label: 'Seals', kind: 'number', min: 2, max: 8, step: 1 },
    { key: 'pressure', label: 'Pressure (atm)', kind: 'number' as const, min: 0.9, max: 1.5, step: 0.01 },
  ]),
  story('fuel-rod-position', 'Fuel Rod Position', 'Nuclear', FuelRodPosition, { title: 'Fuel Rods', rodCount: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Fuel Rods', value: 'Fuel Rods' }, { label: 'Rod Position', value: 'Rod Position' }, { label: 'Control Rods', value: 'Control Rods' },
    ] },
    { key: 'rodCount', label: 'Rods', kind: 'number', min: 2, max: 8, step: 1 },
  ]),
  story('emergency-panel', 'Emergency Panel', 'Nuclear', EmergencyPanel, { title: 'Emergency', scramEnabled: true, elapsed: 0 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Emergency', value: 'Emergency' }, { label: 'SCRAM Panel', value: 'SCRAM Panel' }, { label: 'Emergency Controls', value: 'Emergency Controls' },
    ] },
    { key: 'scramEnabled', label: 'SCRAM Enabled', kind: 'boolean' as const },
    { key: 'elapsed', label: 'Elapsed (s)', kind: 'number' as const, min: 0, max: 3600, step: 10 },
  ]),

  // ── Semiconductor ───────────────────────────────────────────────────
  story('fab-clean-room', 'Fab Clean Room', 'Semiconductor', FabCleanRoom, { title: 'Clean Room', isoClass: 5, temp: 21.5, humidity: 43, pressure: 1.2 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Clean Room', value: 'Clean Room' }, { label: 'Fab Environment', value: 'Fab Environment' }, { label: 'ISO Room', value: 'ISO Room' },
    ] },
    { key: 'isoClass', label: 'ISO Class', kind: 'number' as const, min: 1, max: 9, step: 1 },
    { key: 'temp', label: 'Temperature', kind: 'number' as const, min: 18, max: 28, step: 0.5 },
    { key: 'humidity', label: 'Humidity %', kind: 'number' as const, min: 30, max: 65, step: 1 },
    { key: 'pressure', label: 'Pressure Pa', kind: 'number' as const, min: 0.5, max: 2.5, step: 0.1 },
  ]),
  story('wafer-yield', 'Wafer Yield', 'Semiconductor', WaferYield, { title: 'Wafer Yield', targetYield: 95, waferTemp: 22.3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Wafer Yield', value: 'Wafer Yield' }, { label: 'Die Yield', value: 'Die Yield' }, { label: 'Wafer Map', value: 'Wafer Map' },
    ] },
    { key: 'targetYield', label: 'Target %', kind: 'number' as const, min: 70, max: 99, step: 1 },
    { key: 'waferTemp', label: 'Wafer Temp', kind: 'number' as const, min: 18, max: 30, step: 0.1 },
  ]),
  story('lithography-step', 'Lithography Step', 'Semiconductor', LithographyStep, { title: 'Lithography', layerCount: 7, exposureDose: 245, alignOffset: 0.8, focusDepth: 42 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Lithography', value: 'Lithography' }, { label: 'Layer Progress', value: 'Layer Progress' }, { label: 'Exposure Step', value: 'Exposure Step' },
    ] },
    { key: 'layerCount', label: 'Layers', kind: 'number' as const, min: 3, max: 15, step: 1 },
    { key: 'exposureDose', label: 'Dose mJ', kind: 'number' as const, min: 100, max: 400, step: 5 },
    { key: 'alignOffset', label: 'Align nm', kind: 'number' as const, min: 0.1, max: 2.0, step: 0.1 },
    { key: 'focusDepth', label: 'Focus nm', kind: 'number' as const, min: 20, max: 80, step: 1 },
  ]),
  story('defect-map', 'Defect Map', 'Semiconductor', DefectMap, { title: 'Defect Map', dpiThreshold: 15 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Defect Map', value: 'Defect Map' }, { label: 'Inspection Map', value: 'Inspection Map' }, { label: 'Defect Analysis', value: 'Defect Analysis' },
    ] },
    { key: 'dpiThreshold', label: 'DPI Threshold', kind: 'number', min: 5, max: 50, step: 5 },
  ]),
  story('etch-chamber', 'Etch Chamber', 'Semiconductor', EtchChamber, { title: 'Etch Chamber', pressureUnit: 'mTorr', chamberPressure: 85, gasFlow: 120, rfPower: 750, etchRate: 2.4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Etch Chamber', value: 'Etch Chamber' }, { label: 'Plasma Etch', value: 'Plasma Etch' }, { label: 'RIE Chamber', value: 'RIE Chamber' },
    ] },
    { key: 'pressureUnit', label: 'Unit', kind: 'select', options: [
      { label: 'mTorr', value: 'mTorr' }, { label: 'Pa', value: 'Pa' },
    ] },
    { key: 'chamberPressure', label: 'Pressure', kind: 'number' as const, min: 20, max: 200, step: 5 },
    { key: 'gasFlow', label: 'Gas Flow', kind: 'number' as const, min: 20, max: 250, step: 10 },
    { key: 'rfPower', label: 'RF Power W', kind: 'number' as const, min: 100, max: 1200, step: 50 },
    { key: 'etchRate', label: 'Etch Rate', kind: 'number' as const, min: 0.5, max: 5.0, step: 0.1 },
  ]),
  story('wafer-transport', 'Wafer Transport', 'Semiconductor', WaferTransport, { title: 'Wafer Transport', lotSize: 25, speed: 1.8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Wafer Transport', value: 'Wafer Transport' }, { label: 'FOUP Handler', value: 'FOUP Handler' }, { label: 'Lot Transport', value: 'Lot Transport' },
    ] },
    { key: 'lotSize', label: 'Lot Size', kind: 'number' as const, min: 10, max: 50, step: 5 },
    { key: 'speed', label: 'Speed m/s', kind: 'number' as const, min: 0.5, max: 3.0, step: 0.1 },
  ]),

  // ── Railway ─────────────────────────────────────────────────────────
  story('track-occupancy', 'Track Occupancy', 'Railway', TrackOccupancy, { title: 'Track Occupancy', sections: 8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Track Occupancy', value: 'Track Occupancy' }, { label: 'Track Status', value: 'Track Status' }, { label: 'Block Signals', value: 'Block Signals' },
    ] },
    { key: 'sections', label: 'Sections', kind: 'number', min: 4, max: 16, step: 2 },
  ]),
  story('signal-head', 'Signal Head', 'Railway', SignalHead, { title: 'Signal Head', aspectCount: 3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Signal Head', value: 'Signal Head' }, { label: 'Signal Status', value: 'Signal Status' }, { label: 'Aspect Display', value: 'Aspect Display' },
    ] },
    { key: 'aspectCount', label: 'Aspects', kind: 'number', min: 2, max: 4, step: 1 },
  ]),
  story('train-schedule', 'Train Schedule', 'Railway', TrainSchedule, { title: 'Departures', maxTrains: 5 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Departures', value: 'Departures' }, { label: 'Timetable', value: 'Timetable' }, { label: 'Train Board', value: 'Train Board' },
    ] },
    { key: 'maxTrains', label: 'Max Trains', kind: 'number', min: 3, max: 8, step: 1 },
  ]),
  story('pantograph-monitor', 'Pantograph Monitor', 'Railway', PantographMonitor, { title: 'Pantograph', voltageUnit: 'kV', voltage: 25.0, currentDraw: 420, contactForce: 78, temperature: 52 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Pantograph', value: 'Pantograph' }, { label: 'Catenary Monitor', value: 'Catenary Monitor' }, { label: 'OHL Status', value: 'OHL Status' },
    ] },
    { key: 'voltageUnit', label: 'Unit', kind: 'select', options: [
      { label: 'kV', value: 'kV' }, { label: 'V', value: 'V' },
    ] },
    { key: 'voltage', label: 'Voltage (kV)', kind: 'number' as const, min: 0, max: 30, step: 0.5 },
    { key: 'currentDraw', label: 'Current Draw (A)', kind: 'number' as const, min: 0, max: 600, step: 10 },
    { key: 'contactForce', label: 'Contact Force (N)', kind: 'number' as const, min: 0, max: 150, step: 1 },
    { key: 'temperature', label: 'Temperature (\u00B0C)', kind: 'number' as const, min: 20, max: 100, step: 1 },
  ]),
  story('points-switch', 'Points Switch', 'Railway', PointsSwitch, { title: 'Points Control', switchCount: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Points Control', value: 'Points Control' }, { label: 'Switch Panel', value: 'Switch Panel' }, { label: 'Turnout Control', value: 'Turnout Control' },
    ] },
    { key: 'switchCount', label: 'Switches', kind: 'number', min: 2, max: 6, step: 1 },
  ]),
  story('platform-display', 'Platform Display', 'Railway', PlatformDisplay, { title: 'Platform Status', platformCount: 6 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Platform Status', value: 'Platform Status' }, { label: 'Platform Board', value: 'Platform Board' }, { label: 'Station Display', value: 'Station Display' },
    ] },
    { key: 'platformCount', label: 'Platforms', kind: 'number', min: 2, max: 8, step: 1 },
  ]),

  // ── Brewing ─────────────────────────────────────────────────────────
  story('fermentation-vessel', 'Fermentation Vessel', 'Brewing', FermentationVessel, { title: 'Fermentation', vesselCount: 3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Fermentation', value: 'Fermentation' }, { label: 'Vessels', value: 'Vessels' }, { label: 'Fermenters', value: 'Fermenters' },
    ] },
    { key: 'vesselCount', label: 'Vessels', kind: 'number', min: 1, max: 4, step: 1 },
  ]),
  story('brew-temp-curve', 'Brew Temp Curve', 'Brewing', BrewTempCurve, { title: 'Temp Curve', targetTemp: 20 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Temp Curve', value: 'Temp Curve' }, { label: 'Ferment Temp', value: 'Ferment Temp' }, { label: 'Temperature', value: 'Temperature' },
    ] },
    { key: 'targetTemp', label: 'Target °C', kind: 'number', min: 4, max: 35, step: 1 },
  ]),
  story('carbonation-level', 'Carbonation Level', 'Brewing', CarbonationLevel, { title: 'CO₂ Level', co2Unit: 'psi', pressure: 12.5, volumes: 2.4, temp: 4.2 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'CO₂ Level', value: 'CO₂ Level' }, { label: 'Carbonation', value: 'Carbonation' }, { label: 'CO₂ Pressure', value: 'CO₂ Pressure' },
    ] },
    { key: 'co2Unit', label: 'Unit', kind: 'select', options: [
      { label: 'psi', value: 'psi' }, { label: 'bar', value: 'bar' }, { label: 'vol', value: 'vol' },
    ] },
    { key: 'pressure', label: 'Pressure', kind: 'number' as const, min: 0, max: 30, step: 0.5 },
    { key: 'volumes', label: 'Volumes', kind: 'number' as const, min: 0, max: 5, step: 0.1 },
    { key: 'temp', label: 'Carb Temp (C)', kind: 'number' as const, min: 0, max: 20, step: 0.5 },
  ]),
  story('mash-tun-control', 'Mash Tun Control', 'Brewing', MashTunControl, { title: 'Mash Tun', recipeSteps: 4, temp: 65 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Mash Tun', value: 'Mash Tun' }, { label: 'Mash Control', value: 'Mash Control' }, { label: 'Brew Kettle', value: 'Brew Kettle' },
    ] },
    { key: 'recipeSteps', label: 'Steps', kind: 'number', min: 2, max: 6, step: 1 },
    { key: 'temp', label: 'Temperature (C)', kind: 'number' as const, min: 40, max: 80, step: 1 },
  ]),
  story('gravity-reading', 'Gravity Reading', 'Brewing', GravityReading, { title: 'Gravity', ogTarget: 1.055, sg: 1.042 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Gravity', value: 'Gravity' }, { label: 'Hydrometer', value: 'Hydrometer' }, { label: 'SG Reading', value: 'SG Reading' },
    ] },
    { key: 'ogTarget', label: 'OG Target', kind: 'number' as const, min: 1.030, max: 1.100, step: 0.001 },
    { key: 'sg', label: 'Specific Gravity', kind: 'number' as const, min: 1.000, max: 1.080, step: 0.001 },
  ]),
  story('brew-batch-tracker', 'Batch Tracker', 'Brewing', BatchTracker, { title: 'Batch Tracker', maxBatches: 6 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Batch Tracker', value: 'Batch Tracker' }, { label: 'Batch Status', value: 'Batch Status' }, { label: 'Brew Log', value: 'Brew Log' },
    ] },
    { key: 'maxBatches', label: 'Max Batches', kind: 'number', min: 2, max: 8, step: 1 },
  ]),

  // ── Offshore Oil ────────────────────────────────────────────────────
  story('wellhead-pressure', 'Wellhead Pressure', 'Offshore Oil', WellheadPressure, { title: 'Wellhead Pressure', maxPSI: 5000, psi: 3200, temp: 185, flowRate: 1240 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Wellhead Pressure', value: 'Wellhead Pressure' }, { label: 'Well Gauge', value: 'Well Gauge' }, { label: 'Pressure Monitor', value: 'Pressure Monitor' },
    ] },
    { key: 'maxPSI', label: 'Max PSI', kind: 'number', min: 1000, max: 15000, step: 1000 },
    { key: 'psi', label: 'PSI', kind: 'number' as const, min: 0, max: 8000, step: 50 },
    { key: 'temp', label: 'Temperature (F)', kind: 'number' as const, min: 0, max: 500, step: 1 },
    { key: 'flowRate', label: 'Flow Rate (bbl/d)', kind: 'number' as const, min: 0, max: 3000, step: 10 },
  ]),
  story('bop-status', 'BOP Status', 'Offshore Oil', BOPStatus, { title: 'BOP Status', ramCount: 4, testPressure: 4800, annularPressure: 1200 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'BOP Status', value: 'BOP Status' }, { label: 'Blowout Preventer', value: 'Blowout Preventer' }, { label: 'BOP Panel', value: 'BOP Panel' },
    ] },
    { key: 'ramCount', label: 'Ram Count', kind: 'number', min: 2, max: 6, step: 1 },
    { key: 'testPressure', label: 'Test Pressure (PSI)', kind: 'number' as const, min: 0, max: 12000, step: 100 },
    { key: 'annularPressure', label: 'Annular Pressure (PSI)', kind: 'number' as const, min: 0, max: 3000, step: 50 },
  ]),
  story('mud-weight', 'Mud Weight', 'Offshore Oil', MudWeight, { title: 'Mud Weight', weightUnit: 'ppg', weight: 12.4, viscosity: 48, pH: 9.8, chlorides: 18000 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Mud Weight', value: 'Mud Weight' }, { label: 'Drilling Fluid', value: 'Drilling Fluid' }, { label: 'Mud Properties', value: 'Mud Properties' },
    ] },
    { key: 'weightUnit', label: 'Unit', kind: 'select', options: [
      { label: 'ppg', value: 'ppg' }, { label: 'SG', value: 'SG' }, { label: 'kg/m³', value: 'kg/m³' },
    ] },
    { key: 'weight', label: 'Weight (ppg)', kind: 'number' as const, min: 0, max: 25, step: 0.1 },
    { key: 'viscosity', label: 'Viscosity (sec/qt)', kind: 'number' as const, min: 0, max: 120, step: 1 },
    { key: 'pH', label: 'pH', kind: 'number' as const, min: 0, max: 14, step: 0.1 },
    { key: 'chlorides', label: 'Chlorides (ppm)', kind: 'number' as const, min: 0, max: 50000, step: 500 },
  ]),
  story('drill-depth', 'Drill Depth', 'Offshore Oil', DrillDepth, { title: 'Drill Depth', depthUnit: 'ft', currentDepth: 8400, rop: 42, wob: 28, torque: 14200 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Drill Depth', value: 'Drill Depth' }, { label: 'Well Depth', value: 'Well Depth' }, { label: 'Bit Depth', value: 'Bit Depth' },
    ] },
    { key: 'depthUnit', label: 'Unit', kind: 'select', options: [
      { label: 'ft', value: 'ft' }, { label: 'm', value: 'm' },
    ] },
    { key: 'currentDepth', label: 'Current Depth (ft)', kind: 'number' as const, min: 0, max: 25000, step: 100 },
    { key: 'rop', label: 'ROP (ft/h)', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'wob', label: 'WOB (klb)', kind: 'number' as const, min: 0, max: 70, step: 1 },
    { key: 'torque', label: 'Torque (ft-lb)', kind: 'number' as const, min: 0, max: 40000, step: 100 },
  ]),
  story('gas-separator', 'Gas Separator', 'Offshore Oil', GasSeparator, { title: 'Gas Separator', flowUnit: 'MCF/d', gasFlow: 320, liquidFlow: 180, pressure: 85, efficiency: 94 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Gas Separator', value: 'Gas Separator' }, { label: 'Separation Unit', value: 'Separation Unit' }, { label: 'Gas Processing', value: 'Gas Processing' },
    ] },
    { key: 'flowUnit', label: 'Flow Unit', kind: 'select', options: [
      { label: 'MCF/d', value: 'MCF/d' }, { label: 'MMSCF/d', value: 'MMSCF/d' },
    ] },
    { key: 'gasFlow', label: 'Gas Flow (MCF/d)', kind: 'number' as const, min: 0, max: 800, step: 10 },
    { key: 'liquidFlow', label: 'Liquid Flow (bbl/d)', kind: 'number' as const, min: 0, max: 450, step: 5 },
    { key: 'pressure', label: 'Pressure (PSI)', kind: 'number' as const, min: 0, max: 200, step: 1 },
    { key: 'efficiency', label: 'Efficiency (%)', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('rig-tension', 'Rig Tension', 'Offshore Oil', RigTension, { title: 'Rig Tension', loadLimit: 500, hookLoad: 320, torque: 18500, rpm: 120, standpipe: 3200 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Rig Tension', value: 'Rig Tension' }, { label: 'Drill String', value: 'Drill String' }, { label: 'Load Monitor', value: 'Load Monitor' },
    ] },
    { key: 'loadLimit', label: 'Limit (klb)', kind: 'number', min: 100, max: 1000, step: 50 },
    { key: 'hookLoad', label: 'Hook Load (klb)', kind: 'number' as const, min: 0, max: 800, step: 10 },
    { key: 'torque', label: 'Torque (ft-lb)', kind: 'number' as const, min: 0, max: 50000, step: 500 },
    { key: 'rpm', label: 'RPM', kind: 'number' as const, min: 0, max: 300, step: 1 },
    { key: 'standpipe', label: 'Standpipe (PSI)', kind: 'number' as const, min: 0, max: 8000, step: 50 },
  ]),

  // ── Stadium & Events ────────────────────────────────────────────────
  story('crowd-density', 'Crowd Density', 'Stadium & Events', CrowdDensity, { title: 'Crowd Density', maxCapacity: 50000 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Crowd Density', value: 'Crowd Density' }, { label: 'Crowd Monitor', value: 'Crowd Monitor' }, { label: 'Venue Capacity', value: 'Venue Capacity' },
    ] },
    { key: 'maxCapacity', label: 'Max Capacity', kind: 'number', min: 5000, max: 100000, step: 5000 },
  ]),
  story('ticket-gate', 'Ticket Gate', 'Stadium & Events', TicketGate, { title: 'Ticket Gates', gateCount: 8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Ticket Gates', value: 'Ticket Gates' }, { label: 'Gate Status', value: 'Gate Status' }, { label: 'Entry Points', value: 'Entry Points' },
    ] },
    { key: 'gateCount', label: 'Gates', kind: 'number', min: 2, max: 16, step: 2 },
  ]),
  story('lighting-rig', 'Lighting Rig', 'Stadium & Events', LightingRig, { title: 'Lighting Rig', fixtureCount: 6 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Lighting Rig', value: 'Lighting Rig' }, { label: 'Stage Lights', value: 'Stage Lights' }, { label: 'Fixture Control', value: 'Fixture Control' },
    ] },
    { key: 'fixtureCount', label: 'Fixtures', kind: 'number', min: 3, max: 12, step: 1 },
  ]),
  story('pa-system', 'PA System', 'Stadium & Events', PASystem, { title: 'PA System', zoneCount: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'PA System', value: 'PA System' }, { label: 'Audio System', value: 'Audio System' }, { label: 'Sound Check', value: 'Sound Check' },
    ] },
    { key: 'zoneCount', label: 'Zones', kind: 'number', min: 2, max: 8, step: 1 },
  ]),
  story('score-board', 'Score Board', 'Stadium & Events', ScoreBoard, { title: 'Scoreboard', sport: 'Football', homeScore: 2, awayScore: 1 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Scoreboard', value: 'Scoreboard' }, { label: 'Match Score', value: 'Match Score' }, { label: 'Game Board', value: 'Game Board' },
    ] },
    { key: 'sport', label: 'Sport', kind: 'select', options: [
      { label: 'Football', value: 'Football' }, { label: 'Basketball', value: 'Basketball' }, { label: 'Hockey', value: 'Hockey' }, { label: 'Tennis', value: 'Tennis' },
    ] },
    { key: 'homeScore', label: 'Home Score', kind: 'number' as const, min: 0, max: 20, step: 1 },
    { key: 'awayScore', label: 'Away Score', kind: 'number' as const, min: 0, max: 20, step: 1 },
  ]),
  story('turnstile-flow', 'Turnstile Flow', 'Stadium & Events', TurnstileFlow, { title: 'Turnstile Flow', entryPoints: 4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Turnstile Flow', value: 'Turnstile Flow' }, { label: 'Entry Flow', value: 'Entry Flow' }, { label: 'Gate Counter', value: 'Gate Counter' },
    ] },
    { key: 'entryPoints', label: 'Entry Points', kind: 'number', min: 2, max: 8, step: 1 },
  ]),

  // ── Space & Satellite ───────────────────────────────────────────────
  story('orbit-tracker', 'Orbit Tracker', 'Space & Satellite', OrbitTracker, { title: 'Orbit Tracker', orbitType: 'LEO' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Orbit Tracker', value: 'Orbit Tracker' }, { label: 'Orbital Position', value: 'Orbital Position' }, { label: 'Sat Track', value: 'Sat Track' },
    ] },
    { key: 'orbitType', label: 'Orbit', kind: 'select', options: [
      { label: 'LEO', value: 'LEO' }, { label: 'MEO', value: 'MEO' }, { label: 'GEO', value: 'GEO' },
    ] },
  ]),
  story('sat-telemetry', 'Sat Telemetry', 'Space & Satellite', SatTelemetry, { title: 'Sat Telemetry', channelCount: 4, battery: 78, signal: 62, temp: 22, attitude: 0.4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Sat Telemetry', value: 'Sat Telemetry' }, { label: 'Spacecraft Health', value: 'Spacecraft Health' }, { label: 'TM Data', value: 'TM Data' },
    ] },
    { key: 'channelCount', label: 'Channels', kind: 'number', min: 2, max: 6, step: 1 },
    { key: 'battery', label: 'Battery', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'signal', label: 'Signal', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'temp', label: 'Temperature', kind: 'number' as const, min: -50, max: 200, step: 0.5 },
    { key: 'attitude', label: 'Attitude', kind: 'number' as const, min: 0, max: 1, step: 0.01 },
  ]),
  story('solar-array-angle', 'Solar Array Angle', 'Space & Satellite', SolarArrayAngle, { title: 'Solar Array', panelCount: 2, sunAngle: 45, panelAngle: 42, power: 4.2, efficiency: 88 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Solar Array', value: 'Solar Array' }, { label: 'Panel Angle', value: 'Panel Angle' }, { label: 'Array Control', value: 'Array Control' },
    ] },
    { key: 'panelCount', label: 'Panels', kind: 'number', min: 1, max: 4, step: 1 },
    { key: 'sunAngle', label: 'Sun Angle', kind: 'number' as const, min: 0, max: 90, step: 1 },
    { key: 'panelAngle', label: 'Panel Angle', kind: 'number' as const, min: 0, max: 90, step: 1 },
    { key: 'power', label: 'Power', kind: 'number' as const, min: 0, max: 10, step: 0.1 },
    { key: 'efficiency', label: 'Efficiency', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('link-budget', 'Link Budget', 'Space & Satellite', LinkBudget, { title: 'Link Budget', frequencyBand: 'Ka', signalStrength: 72, linkMargin: 6.2, ber: 1e-9, cnr: 12.5 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Link Budget', value: 'Link Budget' }, { label: 'RF Link', value: 'RF Link' }, { label: 'Signal Budget', value: 'Signal Budget' },
    ] },
    { key: 'frequencyBand', label: 'Band', kind: 'select', options: [
      { label: 'Ka', value: 'Ka' }, { label: 'Ku', value: 'Ku' }, { label: 'S', value: 'S' }, { label: 'X', value: 'X' },
    ] },
    { key: 'signalStrength', label: 'Signal Strength', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'linkMargin', label: 'Link Margin', kind: 'number' as const, min: 0, max: 15, step: 0.1 },
    { key: 'ber', label: 'BER', kind: 'number' as const, min: 0, max: 1e-6, step: 1e-10 },
    { key: 'cnr', label: 'C/N Ratio', kind: 'number' as const, min: 0, max: 30, step: 0.1 },
  ]),
  story('thruster-control', 'Thruster Control', 'Space & Satellite', ThrusterControl, { title: 'Thruster Control', thrusterCount: 8, fuelLevel: 64, pressure: 220, totalImpulse: 12.4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Thruster Control', value: 'Thruster Control' }, { label: 'Propulsion', value: 'Propulsion' }, { label: 'RCS Panel', value: 'RCS Panel' },
    ] },
    { key: 'thrusterCount', label: 'Thrusters', kind: 'number', min: 4, max: 12, step: 2 },
    { key: 'fuelLevel', label: 'Fuel Level', kind: 'number' as const, min: 0, max: 100, step: 1 },
    { key: 'pressure', label: 'Pressure', kind: 'number' as const, min: 0, max: 500, step: 1 },
    { key: 'totalImpulse', label: 'Total Impulse', kind: 'number' as const, min: 0, max: 30, step: 0.1 },
  ]),
  story('ground-station', 'Ground Station', 'Space & Satellite', GroundStation, { title: 'Ground Station', antennaCount: 3, elevation: 42, azimuth: 185, snr: 18.5, tracking: true }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Ground Station', value: 'Ground Station' }, { label: 'Earth Station', value: 'Earth Station' }, { label: 'Tracking Station', value: 'Tracking Station' },
    ] },
    { key: 'antennaCount', label: 'Antennas', kind: 'number', min: 1, max: 5, step: 1 },
    { key: 'elevation', label: 'Elevation', kind: 'number' as const, min: 0, max: 90, step: 1 },
    { key: 'azimuth', label: 'Azimuth', kind: 'number' as const, min: 0, max: 360, step: 1 },
    { key: 'snr', label: 'SNR', kind: 'number' as const, min: 0, max: 40, step: 0.1 },
    { key: 'tracking', label: 'Tracking', kind: 'boolean' as const },
  ]),

  // ── Aviation Cockpit ────────────────────────────────────────────────
  story('attitude-indicator', 'Attitude Indicator', 'Aviation Cockpit', AttitudeIndicator, { title: 'Attitude', pitch: 10, roll: 15 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Attitude', value: 'Attitude' }, { label: 'Artificial Horizon', value: 'Artificial Horizon' }, { label: 'AHRS', value: 'AHRS' },
    ] },
  ]),
  story('altimeter', 'Altimeter', 'Aviation Cockpit', Altimeter, { title: 'Altimeter', altitude: 24500, maxAlt: 35000 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Altimeter', value: 'Altimeter' }, { label: 'Altitude', value: 'Altitude' }, { label: 'ALT', value: 'ALT' },
    ] },
    { key: 'altitude', label: 'Altitude (ft)', kind: 'number' as const, min: 0, max: 45000, step: 500 },
    { key: 'maxAlt', label: 'Max Altitude', kind: 'number', min: 10000, max: 50000, step: 5000 },
  ]),
  story('airspeed-indicator', 'Airspeed Indicator', 'Aviation Cockpit', AirspeedIndicator, { title: 'Airspeed', airspeed: 165, vne: 250 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Airspeed', value: 'Airspeed' }, { label: 'ASI', value: 'ASI' }, { label: 'IAS', value: 'IAS' },
    ] },
    { key: 'airspeed', label: 'Airspeed (kts)', kind: 'number' as const, min: 0, max: 280, step: 5 },
    { key: 'vne', label: 'VNE (kts)', kind: 'number', min: 150, max: 400, step: 10 },
  ]),
  story('heading-compass', 'Heading Compass', 'Aviation Cockpit', HeadingCompass, { title: 'Heading', heading: 270, wobble: 0 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Heading', value: 'Heading' }, { label: 'HSI', value: 'HSI' }, { label: 'Compass', value: 'Compass' },
    ] },
    { key: 'heading', label: 'Heading (deg)', kind: 'number' as const, min: 0, max: 360, step: 5 },
    { key: 'wobble', label: 'Wobble (deg)', kind: 'number' as const, min: -5, max: 5, step: 0.5 },
  ]),
  story('vertical-speed', 'Vertical Speed', 'Aviation Cockpit', VerticalSpeed, { title: 'Vertical Speed', vsi: 500 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Vertical Speed', value: 'Vertical Speed' }, { label: 'VSI', value: 'VSI' }, { label: 'Climb Rate', value: 'Climb Rate' },
    ] },
    { key: 'vsi', label: 'VSI (ft/min)', kind: 'number' as const, min: -2000, max: 2000, step: 100 },
  ]),
  story('annunciator-panel', 'Annunciator Panel', 'Aviation Cockpit', AnnunciatorPanel, { title: 'Annunciator' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Annunciator', value: 'Annunciator' }, { label: 'CAS Panel', value: 'CAS Panel' }, { label: 'Warning Panel', value: 'Warning Panel' },
    ] },
  ]),

  // ── Submarine ──────────────────────────────────────────────────────
  story('depth-gauge', 'Depth Gauge', 'Submarine', DepthGauge, { title: 'Depth', depth: 185, maxDepth: 400 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Depth', value: 'Depth' }, { label: 'Depth Gauge', value: 'Depth Gauge' }, { label: 'Fathometer', value: 'Fathometer' },
    ] },
    { key: 'depth', label: 'Depth (m)', kind: 'number' as const, min: 0, max: 500, step: 5 },
    { key: 'maxDepth', label: 'Max Depth (m)', kind: 'number', min: 100, max: 1000, step: 50 },
  ]),
  story('ballast-tank', 'Ballast Tank', 'Submarine', BallastTank, { title: 'Ballast', fillPct: 65 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Ballast', value: 'Ballast' }, { label: 'MBT', value: 'MBT' }, { label: 'Trim Tank', value: 'Trim Tank' },
    ] },
    { key: 'fillPct', label: 'Fill %', kind: 'number' as const, min: 0, max: 100, step: 5 },
  ]),
  story('torpedo-status', 'Torpedo Status', 'Submarine', TorpedoStatus, { title: 'Torpedo Bay' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Torpedo Bay', value: 'Torpedo Bay' }, { label: 'Weapons Bay', value: 'Weapons Bay' }, { label: 'Tube Status', value: 'Tube Status' },
    ] },
  ]),
  story('sonar-display', 'Sonar Display', 'Submarine', SonarDisplay, { title: 'Sonar' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Sonar', value: 'Sonar' }, { label: 'Passive Sonar', value: 'Passive Sonar' }, { label: 'Active Sonar', value: 'Active Sonar' },
    ] },
  ]),
  story('hull-pressure', 'Hull Pressure', 'Submarine', HullPressure, { title: 'Hull Pressure', psi: 380, maxPSI: 600 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Hull Pressure', value: 'Hull Pressure' }, { label: 'Hull Integrity', value: 'Hull Integrity' }, { label: 'Pressure', value: 'Pressure' },
    ] },
    { key: 'psi', label: 'Pressure (PSI)', kind: 'number' as const, min: 0, max: 700, step: 10 },
    { key: 'maxPSI', label: 'Max PSI', kind: 'number', min: 200, max: 1000, step: 50 },
  ]),
  story('dive-plane', 'Dive Plane', 'Submarine', DivePlane, { title: 'Dive Planes', planeAngle: 12 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Dive Planes', value: 'Dive Planes' }, { label: 'Hydroplanes', value: 'Hydroplanes' }, { label: 'Trim Control', value: 'Trim Control' },
    ] },
    { key: 'planeAngle', label: 'Plane Angle (deg)', kind: 'number' as const, min: -25, max: 25, step: 1 },
  ]),

  // ── Vintage HiFi ──────────────────────────────────────────────────
  story('vacuum-tube-amp', 'Vacuum Tube Amp', 'Vintage HiFi', VacuumTubeAmp, { title: 'Tube Amplifier', tubes: 4, powerOut: 42, warmup: 96 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Tube Amplifier', value: 'Tube Amplifier' }, { label: 'Valve Amp', value: 'Valve Amp' }, { label: 'Power Amp', value: 'Power Amp' },
    ] },
    { key: 'tubes', label: 'Tubes', kind: 'number' as const, min: 2, max: 8, step: 1 },
    { key: 'powerOut', label: 'Power Output (W)', kind: 'number' as const, min: 10, max: 100, step: 1 },
    { key: 'warmup', label: 'Warm-up (%)', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('reel-to-reel', 'Reel-to-Reel', 'Vintage HiFi', ReelToReel, { title: 'Reel-to-Reel' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Reel-to-Reel', value: 'Reel-to-Reel' }, { label: 'Tape Deck', value: 'Tape Deck' }, { label: 'Master Recorder', value: 'Master Recorder' },
    ] },
  ]),
  story('vu-meter', 'VU Meter', 'Vintage HiFi', VUMeter, { title: 'VU Meter', levelL: -8, levelR: -6 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'VU Meter', value: 'VU Meter' }, { label: 'Level Meter', value: 'Level Meter' }, { label: 'Peak Meter', value: 'Peak Meter' },
    ] },
    { key: 'levelL', label: 'Level L (dB)', kind: 'number' as const, min: -20, max: 3, step: 1 },
    { key: 'levelR', label: 'Level R (dB)', kind: 'number' as const, min: -20, max: 3, step: 1 },
  ]),
  story('graphic-eq', 'Graphic EQ', 'Vintage HiFi', GraphicEQ, { title: 'Equalizer' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Equalizer', value: 'Equalizer' }, { label: 'Graphic EQ', value: 'Graphic EQ' }, { label: '10-Band EQ', value: '10-Band EQ' },
    ] },
  ]),
  story('tape-counter', 'Tape Counter', 'Vintage HiFi', TapeCounter, { title: 'Tape Counter' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Tape Counter', value: 'Tape Counter' }, { label: 'Counter', value: 'Counter' }, { label: 'Position', value: 'Position' },
    ] },
  ]),
  story('transformer-hum', 'Transformer', 'Vintage HiFi', TransformerHum, { title: 'Transformer', voltage: 240, current: 2.4, temp: 62 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Transformer', value: 'Transformer' }, { label: 'Power Supply', value: 'Power Supply' }, { label: 'PSU', value: 'PSU' },
    ] },
    { key: 'voltage', label: 'Voltage (V)', kind: 'number' as const, min: 100, max: 260, step: 5 },
    { key: 'current', label: 'Current (A)', kind: 'number' as const, min: 0.5, max: 5, step: 0.1 },
    { key: 'temp', label: 'Temperature (C)', kind: 'number' as const, min: 30, max: 90, step: 1 },
  ]),

  // ── Watchmaking ───────────────────────────────────────────────────
  story('chronograph', 'Chronograph', 'Watchmaking', Chronograph, { title: 'Chronograph' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Chronograph', value: 'Chronograph' }, { label: 'Stopwatch', value: 'Stopwatch' }, { label: 'Timer', value: 'Timer' },
    ] },
  ]),
  story('moon-phase', 'Moon Phase', 'Watchmaking', MoonPhase, { title: 'Moon Phase', day: 14 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Moon Phase', value: 'Moon Phase' }, { label: 'Lunar', value: 'Lunar' }, { label: 'Phase de Lune', value: 'Phase de Lune' },
    ] },
    { key: 'day', label: 'Lunar Day', kind: 'number', min: 0, max: 29, step: 1 },
  ]),
  story('power-reserve', 'Power Reserve', 'Watchmaking', PowerReserve, { title: 'Power Reserve', hours: 72, liveHours: 48 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Power Reserve', value: 'Power Reserve' }, { label: 'Réserve de Marche', value: 'Réserve de Marche' }, { label: 'Wind Indicator', value: 'Wind Indicator' },
    ] },
    { key: 'hours', label: 'Max Hours', kind: 'number' as const, min: 24, max: 120, step: 12 },
    { key: 'liveHours', label: 'Reserve Hours', kind: 'number' as const, min: 0, max: 120, step: 1 },
  ]),
  story('tourbillon-cage', 'Tourbillon Cage', 'Watchmaking', TourbillonCage, { title: 'Tourbillon', oscillationRate: 28800 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Tourbillon', value: 'Tourbillon' }, { label: 'Flying Tourbillon', value: 'Flying Tourbillon' }, { label: 'Cage', value: 'Cage' },
    ] },
    { key: 'oscillationRate', label: 'Oscillation (vph)', kind: 'number' as const, min: 18000, max: 36000, step: 1800 },
  ]),
  story('date-wheel', 'Date Wheel', 'Watchmaking', DateWheel, { title: 'Date', currentDate: 15 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Date', value: 'Date' }, { label: 'Date Display', value: 'Date Display' }, { label: 'Calendar', value: 'Calendar' },
    ] },
    { key: 'currentDate', label: 'Date', kind: 'number', min: 1, max: 31, step: 1 },
  ]),
  story('balance-wheel', 'Balance Wheel', 'Watchmaking', BalanceWheel, { title: 'Balance Wheel', frequency: 28800, amplitude: 300 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Balance Wheel', value: 'Balance Wheel' }, { label: 'Oscillator', value: 'Oscillator' }, { label: 'Escapement', value: 'Escapement' },
    ] },
    { key: 'frequency', label: 'BPH', kind: 'number' as const, min: 18000, max: 36000, step: 3600 },
    { key: 'amplitude', label: 'Amplitude (deg)', kind: 'number' as const, min: 180, max: 360, step: 5 },
  ]),

  // ── Automotive ────────────────────────────────────────────────────
  story('speedometer', 'Speedometer', 'Automotive', Speedometer, { title: 'Speed', maxSpeed: 260, speed: 95 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Speed', value: 'Speed' }, { label: 'Speedometer', value: 'Speedometer' }, { label: 'Velocity', value: 'Velocity' },
    ] },
    { key: 'maxSpeed', label: 'Max Speed', kind: 'number', min: 120, max: 400, step: 20 },
    { key: 'speed', label: 'Speed (km/h)', kind: 'number' as const, min: 0, max: 260, step: 5 },
  ]),
  story('tachometer', 'Tachometer', 'Automotive', Tachometer, { title: 'Tachometer', redline: 7000, rpm: 3200 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Tachometer', value: 'Tachometer' }, { label: 'RPM', value: 'RPM' }, { label: 'Rev Counter', value: 'Rev Counter' },
    ] },
    { key: 'redline', label: 'Redline RPM', kind: 'number', min: 5000, max: 10000, step: 500 },
    { key: 'rpm', label: 'RPM', kind: 'number' as const, min: 0, max: 8000, step: 100 },
  ]),
  story('boost-gauge', 'Boost Gauge', 'Automotive', BoostGauge, { title: 'Boost', maxBoost: 25, boost: 8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Boost', value: 'Boost' }, { label: 'Turbo', value: 'Turbo' }, { label: 'Manifold', value: 'Manifold' },
    ] },
    { key: 'maxBoost', label: 'Max Boost (PSI)', kind: 'number', min: 10, max: 40, step: 5 },
    { key: 'boost', label: 'Boost (PSI)', kind: 'number' as const, min: -30, max: 25, step: 1 },
  ]),
  story('oil-temp', 'Oil Temperature', 'Automotive', OilTemp, { title: 'Oil Temperature', temp: 92 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Oil Temperature', value: 'Oil Temperature' }, { label: 'Oil Temp', value: 'Oil Temp' }, { label: 'Lubricant Temp', value: 'Lubricant Temp' },
    ] },
    { key: 'temp', label: 'Temperature (C)', kind: 'number' as const, min: 50, max: 140, step: 1 },
  ]),
  story('fuel-gauge', 'Fuel Gauge', 'Automotive', FuelGauge, { title: 'Fuel Level', fuel: 62 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Fuel Level', value: 'Fuel Level' }, { label: 'Fuel', value: 'Fuel' }, { label: 'Tank Level', value: 'Tank Level' },
    ] },
    { key: 'fuel', label: 'Fuel Level (%)', kind: 'number' as const, min: 0, max: 100, step: 1 },
  ]),
  story('eng-diagnostics', 'Engine Diagnostics', 'Automotive', EngDiagnostics, { title: 'Engine Diagnostics', rpmVal: 2800, coolantVal: 92, intakeVal: 38, batteryVal: 13.8 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Engine Diagnostics', value: 'Engine Diagnostics' }, { label: 'OBD-II', value: 'OBD-II' }, { label: 'ECU Status', value: 'ECU Status' },
    ] },
    { key: 'rpmVal', label: 'RPM', kind: 'number' as const, min: 0, max: 8000, step: 100 },
    { key: 'coolantVal', label: 'Coolant (C)', kind: 'number' as const, min: 50, max: 130, step: 1 },
    { key: 'intakeVal', label: 'Intake (C)', kind: 'number' as const, min: 10, max: 80, step: 1 },
    { key: 'batteryVal', label: 'Battery (V)', kind: 'number' as const, min: 10, max: 16, step: 0.1 },
  ]),

  // ── Oscilloscope & Lab ────────────────────────────────────────────
  story('oscilloscope', 'Oscilloscope', 'Oscilloscope & Lab', Oscilloscope, { title: 'Oscilloscope', frequency: 2 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Oscilloscope', value: 'Oscilloscope' }, { label: 'Scope', value: 'Scope' }, { label: 'DSO', value: 'DSO' },
    ] },
    { key: 'frequency', label: 'Frequency', kind: 'number', min: 1, max: 10, step: 1 },
  ]),
  story('lab-spectrum-analyzer', 'Lab Spectrum Analyzer', 'Oscilloscope & Lab', LabSpectrumAnalyzer, { title: 'Spectrum Analyzer' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Spectrum Analyzer', value: 'Spectrum Analyzer' }, { label: 'FFT', value: 'FFT' }, { label: 'Spectrum', value: 'Spectrum' },
    ] },
  ]),
  story('function-generator', 'Function Generator', 'Oscilloscope & Lab', FunctionGenerator, { title: 'Function Gen', freq: 1000 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Function Gen', value: 'Function Gen' }, { label: 'Signal Generator', value: 'Signal Generator' }, { label: 'Waveform Gen', value: 'Waveform Gen' },
    ] },
    { key: 'freq', label: 'Frequency', kind: 'number', min: 100, max: 5000, step: 50 },
  ]),
  story('multimeter', 'Multimeter', 'Oscilloscope & Lab', Multimeter, { title: 'Multimeter', voltage: 12.47 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Multimeter', value: 'Multimeter' }, { label: 'DMM', value: 'DMM' }, { label: 'Volt Meter', value: 'Volt Meter' },
    ] },
    { key: 'voltage', label: 'Voltage', kind: 'number', min: 0, max: 50, step: 0.1 },
  ]),
  story('centrifuge', 'Centrifuge', 'Oscilloscope & Lab', Centrifuge, { title: 'Centrifuge', rpm: 12000, temperature: 4.0 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Centrifuge', value: 'Centrifuge' }, { label: 'Ultracentrifuge', value: 'Ultracentrifuge' }, { label: 'Spinner', value: 'Spinner' },
    ] },
    { key: 'rpm', label: 'Max RPM', kind: 'number', min: 5000, max: 20000, step: 1000 },
    { key: 'temperature', label: 'Temperature', kind: 'number', min: -10, max: 40, step: 0.5 },
  ]),
  story('titration-apparatus', 'Titration Apparatus', 'Oscilloscope & Lab', TitrationApparatus, { title: 'Titration', pH: 6.8, volume: 25.4 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Titration', value: 'Titration' }, { label: 'pH Analysis', value: 'pH Analysis' }, { label: 'Acid-Base', value: 'Acid-Base' },
    ] },
    { key: 'pH', label: 'pH', kind: 'number', min: 0, max: 14, step: 0.1 },
    { key: 'volume', label: 'Volume (mL)', kind: 'number', min: 0, max: 50, step: 0.5 },
  ]),

  // ── Weather Station ───────────────────────────────────────────────
  story('mercury-barometer', 'Mercury Barometer', 'Weather Station', MercuryBarometer, { title: 'Barometer', maxHPa: 1050, pressure: 1013, prevPressure: 1013 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Barometer', value: 'Barometer' }, { label: 'Pressure', value: 'Pressure' }, { label: 'Barograph', value: 'Barograph' },
    ] },
    { key: 'maxHPa', label: 'Max hPa', kind: 'number', min: 1000, max: 1100, step: 10 },
    { key: 'pressure', label: 'Pressure (hPa)', kind: 'number' as const, min: 950, max: 1050, step: 1 },
    { key: 'prevPressure', label: 'Prev Pressure (hPa)', kind: 'number' as const, min: 950, max: 1050, step: 1 },
  ]),
  story('anemometer', 'Anemometer', 'Weather Station', Anemometer, { title: 'Wind Speed', windSpeed: 24 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Wind Speed', value: 'Wind Speed' }, { label: 'Anemometer', value: 'Anemometer' }, { label: 'Wind Gauge', value: 'Wind Gauge' },
    ] },
    { key: 'windSpeed', label: 'Wind Speed (km/h)', kind: 'number' as const, min: 0, max: 120, step: 1 },
  ]),
  story('rain-gauge', 'Rain Gauge', 'Weather Station', RainGauge, { title: 'Rain Gauge', rainfall: 12.4, rate: 2.1 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Rain Gauge', value: 'Rain Gauge' }, { label: 'Pluviometer', value: 'Pluviometer' }, { label: 'Rainfall', value: 'Rainfall' },
    ] },
    { key: 'rainfall', label: 'Rainfall (mm)', kind: 'number' as const, min: 0, max: 50, step: 0.5 },
    { key: 'rate', label: 'Rate (mm/hr)', kind: 'number' as const, min: 0, max: 10, step: 0.1 },
  ]),
  story('wind-vane', 'Wind Vane', 'Weather Station', WindVane, { title: 'Wind Direction', direction: 225 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Wind Direction', value: 'Wind Direction' }, { label: 'Wind Vane', value: 'Wind Vane' }, { label: 'Weathercock', value: 'Weathercock' },
    ] },
    { key: 'direction', label: 'Direction (deg)', kind: 'number' as const, min: 0, max: 359, step: 1 },
  ]),
  story('hygrometer', 'Hygrometer', 'Weather Station', Hygrometer, { title: 'Humidity', dryTemp: 24, wetTemp: 20 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Humidity', value: 'Humidity' }, { label: 'Hygrometer', value: 'Hygrometer' }, { label: 'Wet/Dry Bulb', value: 'Wet/Dry Bulb' },
    ] },
    { key: 'dryTemp', label: 'Dry Temp (C)', kind: 'number' as const, min: 0, max: 45, step: 0.5 },
    { key: 'wetTemp', label: 'Wet Temp (C)', kind: 'number' as const, min: 0, max: 40, step: 0.5 },
  ]),
  story('storm-glass', 'Storm Glass', 'Weather Station', StormGlass, { title: 'Storm Glass', temp: 18 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Storm Glass', value: 'Storm Glass' }, { label: 'Weather Glass', value: 'Weather Glass' }, { label: 'FitzRoy', value: 'FitzRoy' },
    ] },
    { key: 'temp', label: 'Temperature (C)', kind: 'number' as const, min: -10, max: 40, step: 0.5 },
  ]),

  // ── Steam & Mechanical ────────────────────────────────────────────
  story('boiler-pressure', 'Boiler Pressure', 'Steam & Mechanical', BoilerPressure, { title: 'Boiler Pressure', maxPSI: 200, psi: 145 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Boiler Pressure', value: 'Boiler Pressure' }, { label: 'Steam Pressure', value: 'Steam Pressure' }, { label: 'Bourdon Gauge', value: 'Bourdon Gauge' },
    ] },
    { key: 'maxPSI', label: 'Max PSI', kind: 'number', min: 100, max: 500, step: 50 },
    { key: 'psi', label: 'PSI', kind: 'number' as const, min: 0, max: 300, step: 5 },
  ]),
  story('steam-valve', 'Steam Valve', 'Steam & Mechanical', SteamValve, { title: 'Steam Valve', flow: 340 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Steam Valve', value: 'Steam Valve' }, { label: 'Gate Valve', value: 'Gate Valve' }, { label: 'Throttle Valve', value: 'Throttle Valve' },
    ] },
    { key: 'flow', label: 'Flow (kg/hr)', kind: 'number' as const, min: 0, max: 600, step: 10 },
  ]),
  story('flywheel', 'Flywheel', 'Steam & Mechanical', Flywheel, { title: 'Flywheel' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Flywheel', value: 'Flywheel' }, { label: 'Inertia Wheel', value: 'Inertia Wheel' }, { label: 'Momentum Store', value: 'Momentum Store' },
    ] },
  ]),
  story('governor', 'Governor', 'Steam & Mechanical', Governor, { title: 'Governor', speed: 60 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Governor', value: 'Governor' }, { label: 'Centrifugal Gov', value: 'Centrifugal Gov' }, { label: 'Watt Governor', value: 'Watt Governor' },
    ] },
    { key: 'speed', label: 'Speed %', kind: 'number' as const, min: 0, max: 100, step: 5 },
  ]),
  story('piston-indicator', 'Piston Indicator', 'Steam & Mechanical', PistonIndicator, { title: 'Piston' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Piston', value: 'Piston' }, { label: 'Cylinder', value: 'Cylinder' }, { label: 'Reciprocator', value: 'Reciprocator' },
    ] },
  ]),
  story('steam-whistle', 'Steam Whistle', 'Steam & Mechanical', SteamWhistle, { title: 'Steam Whistle' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Steam Whistle', value: 'Steam Whistle' }, { label: 'Whistle', value: 'Whistle' }, { label: 'Horn', value: 'Horn' },
    ] },
  ]),

  // ── Printing & Typography ─────────────────────────────────────────
  story('ink-density-meter', 'Ink Density Meter', 'Printing & Typography', InkDensityMeter, { title: 'Ink Density' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Ink Density', value: 'Ink Density' }, { label: 'Densitometer', value: 'Densitometer' }, { label: 'Ink Control', value: 'Ink Control' },
    ] },
  ]),
  story('cmyk-registration', 'CMYK Registration', 'Printing & Typography', CMYKRegistration, { title: 'Registration', offset: 0.3 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Registration', value: 'Registration' }, { label: 'Color Register', value: 'Color Register' }, { label: 'Alignment', value: 'Alignment' },
    ] },
    { key: 'offset', label: 'Offset', kind: 'number' as const, min: 0, max: 1, step: 0.05 },
  ]),
  story('paper-tension', 'Paper Tension', 'Printing & Typography', PaperTension, { title: 'Paper Tension', maxTension: 100, tension: 65 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Paper Tension', value: 'Paper Tension' }, { label: 'Web Tension', value: 'Web Tension' }, { label: 'Tension Control', value: 'Tension Control' },
    ] },
    { key: 'maxTension', label: 'Max Tension', kind: 'number' as const, min: 50, max: 200, step: 10 },
    { key: 'tension', label: 'Tension (N/m)', kind: 'number' as const, min: 10, max: 150, step: 1 },
  ]),
  story('press-cylinder', 'Press Cylinder', 'Printing & Typography', PressCylinder, { title: 'Press Cylinder', speed: 8500, pressure: 4.2 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Press Cylinder', value: 'Press Cylinder' }, { label: 'Impression', value: 'Impression' }, { label: 'Blanket Cylinder', value: 'Blanket Cylinder' },
    ] },
    { key: 'speed', label: 'Speed (sph)', kind: 'number' as const, min: 3000, max: 15000, step: 500 },
    { key: 'pressure', label: 'Pressure (bar)', kind: 'number' as const, min: 2, max: 7, step: 0.1 },
  ]),
  story('color-separation', 'Color Separation', 'Printing & Typography', ColorSeparation, { title: 'Color Separation' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Color Separation', value: 'Color Separation' }, { label: 'CMYK Plates', value: 'CMYK Plates' }, { label: 'Halftone', value: 'Halftone' },
    ] },
  ]),
  story('drying-oven', 'Drying Oven', 'Printing & Typography', DryingOven, { title: 'Drying Oven', temp: 185, feedSpeed: 12.5 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Drying Oven', value: 'Drying Oven' }, { label: 'IR Dryer', value: 'IR Dryer' }, { label: 'Curing Oven', value: 'Curing Oven' },
    ] },
    { key: 'temp', label: 'Temperature (°C)', kind: 'number' as const, min: 100, max: 250, step: 5 },
    { key: 'feedSpeed', label: 'Feed Speed (m/min)', kind: 'number' as const, min: 5, max: 25, step: 0.5 },
  ]),

  // ── Vintage Computing ─────────────────────────────────────────────
  story('nixie-tube-display', 'Nixie Tube Display', 'Vintage Computing', NixieTubeDisplay, { title: 'Nixie Display', digits: 6 }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Nixie Display', value: 'Nixie Display' }, { label: 'Nixie Clock', value: 'Nixie Clock' }, { label: 'Tube Counter', value: 'Tube Counter' },
    ] },
    { key: 'digits', label: 'Digits', kind: 'number', min: 2, max: 8, step: 1 },
  ]),
  story('toggle-switch-bank', 'Toggle Switch Bank', 'Vintage Computing', ToggleSwitchBank, { title: 'Switch Bank' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Switch Bank', value: 'Switch Bank' }, { label: 'Console', value: 'Console' }, { label: 'Front Panel', value: 'Front Panel' },
    ] },
  ]),
  story('mag-tape-reel', 'Mag Tape Reel', 'Vintage Computing', MagTapeReel, { title: 'Tape Drive' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Tape Drive', value: 'Tape Drive' }, { label: 'Mag Tape', value: 'Mag Tape' }, { label: 'Reel-to-Reel', value: 'Reel-to-Reel' },
    ] },
  ]),
  story('core-memory-grid', 'Core Memory Grid', 'Vintage Computing', CoreMemoryGrid, { title: 'Core Memory' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Core Memory', value: 'Core Memory' }, { label: 'Magnetic Core', value: 'Magnetic Core' }, { label: 'Memory Plane', value: 'Memory Plane' },
    ] },
  ]),
  story('punch-card-reader', 'Punch Card Reader', 'Vintage Computing', PunchCardReader, { title: 'Card Reader' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Card Reader', value: 'Card Reader' }, { label: 'Punch Card', value: 'Punch Card' }, { label: 'Hollerith', value: 'Hollerith' },
    ] },
  ]),
  story('blinken-lights', 'Blinken Lights', 'Vintage Computing', BlinkenLights, { title: 'Blinken Lights' }, [
    { key: 'title', label: 'Title', kind: 'select', options: [
      { label: 'Blinken Lights', value: 'Blinken Lights' }, { label: 'Front Panel', value: 'Front Panel' }, { label: 'Register Display', value: 'Register Display' },
    ] },
  ]),
];

export const WIDGET_CATEGORIES = Array.from(new Set(WIDGET_STORIES.map((storyItem) => storyItem.category)));

export const getWidgetStory = (id: string) =>
  WIDGET_STORIES.find((storyItem) => storyItem.id === id) ?? WIDGET_STORIES[0];
