/**
 * XYTE Elements — Widget Library Barrel
 *
 * Re-exports all widgets from category modules.
 * DashboardContent provides the full showcase layout.
 */

import { getX, ease, Card, Badge, Btn, Slider, Lbl, M, Dot, XyteLogo, Section, Prog } from './primitives';
export { setWidgetRuntimeTheme, getX, ease, Card, Badge, Btn, Slider, Lbl, M, Dot, XyteLogo, Section, Prog } from './primitives';

// ── Category re-exports ───────────────────────────────────────────────
export { KPI, DeviceCard, Gauge, DeviceTable, UptimeTimeline } from './fleet';
export { PTZControl, Mixer, QuickControls, InputSelector, DisplayAdjust, ColorTemp, Toggle, CmdBtn } from './av-controls';
export { AudioSpectrum, AudioEQ, VolumeKnob } from './audio';
export { VideoWall, CrosspointMatrix, SignalFlow, ResolutionPicker, AspectRatio, EDIDManager, DisplayOrientation } from './display-routing';
export { ScenePresets, PowerSequencer, MacroBuilder, ThermostatControl, Climate, Occupancy, Schedule } from './room-climate';
export { NetworkInfo, BandwidthMonitor, AVoIPStats, LatencyGraph, PowerMonitor, PoEManager, PortStatus, CertStatus, LampLife } from './network';
export { AlertFeed, CommandLog, BulkActions, CodeTester, FirmwareUpdate } from './incidents';
export { AnomalyDetector, PredictiveMaintenance, AIInsights, SentimentGauge, UsageForecaster, ModelPerformance, NLPCommandParser } from './ai-analytics';
export { MeetingStatus, ScreenShare, ChatFeed, WhiteboardMini, PollWidget, TaskTracker } from './collaboration';
export { StatusIndicator, NumericMetric, ValueDisplay, TextDisplay, ToggleSwitch, ActionButton, StateSelector, BarSlider, GaugeWidget, BarWidget, SplineChart, ScatterChart, DeviceMap, StatusTimeline, GroupedToggles } from './core-widgets';
export { SolarPanel, BatteryBank, GridStatus, CarbonTracker, EnergyFlow, CostMonitor } from './energy';
export { ThreatMap, AccessLog, VulnerabilityScanner, FirewallRules, EncryptionStatus, ComplianceChecker, SecurityScore } from './security';
export { PlaylistManager, ContentPreview, ScreenZoning, ScheduleCalendar, ProofOfPlay, BrightnessSchedule } from './signage';
export { FloorPlan, ZoneHeatmap, WayfindingStatus, BeaconManager, AssetTracker, EnvironmentalSensor } from './spatial';
export { SoilMoisture, IrrigationControl, WeatherStation, CropHealth, DroneView, HarvestTracker } from './agriculture';
export { StreamHealth, EncoderStatus, Multiviewer, TallyLight, PlayoutSchedule, AudioLoudness, CaptionMonitor } from './broadcast';
export { RackThermal, ServerHealth, VMDensity, BandwidthPipe, UPSStatus, CoolingEfficiency, PatchPanel } from './datacenter';
export { ClassroomAV, AttendanceBoard, DigitalBulletin, BellSchedule, LibraryOccupancy, ExamTimer } from './education';
export { PatientMonitor, VitalsChart, BedManager, NurseCallBoard, LabResults, PharmacyQueue, TriageStatus } from './healthcare';
export { RoomStatus, MinibarTracker, GuestServices, HousekeepingBoard, CheckInKiosk, PoolSensors } from './hospitality';
export { FleetGPS, RouteOptimizer, WarehouseMap, DeliveryTracker, DockSchedule, FuelMonitor } from './logistics';
export { AssemblyLine, OEEGauge, QualityGate, PLCStatus, TankLevel, ConveyorSpeed, ShiftSchedule } from './manufacturing';
export { POSAnalytics, InventoryLevel, FootTraffic, QueueMonitor, PriceTag, ShrinkageAlert, LoyaltyDash } from './retail';
export { HVACZone, ElevatorStatus, ParkingOccupancy, WaterMeter, LightingScene, AccessDoor, FirePanel } from './smart-building';
export { FlightBoard, RunwayStatus, BaggageFlow, FuelFarm, AircraftMaintenance, GateAssignment } from './aerospace';
export { CleanRoom, BatchReactor, Chromatograph, ColdChain, QualityLab, ComplianceTracker } from './pharma';
export { CellTower, SpectrumAnalyzer, SubscriberMetrics, NetworkSlicing, SIMInventory, CallQuality } from './telecom';
export { VesselTracker, ContainerYard, TideMonitor, CraneOps, BerthSchedule, CargoManifest } from './maritime';
export { SiteProgress, CraneMonitor, MaterialsTracker, WeatherSite, SafetyBoard, ConcreteMonitor, EquipmentFleet } from './construction';
export { MineShaftDepth, OreGradeAnalyzer, VentilationFan, ConveyorLoad, BlastSequencer, CageWinder } from './mining';
export { WaterFlowRate, ChemicalDosing, FiltrationBank, WaterTankLevel, TurbidityMeter, PumpStation } from './water';
export { RobotArmPose, JointTorque, VisionFeed, TaskQueue, GripperStatus, CycleCounter } from './robotics';
export { ReactorStatus, CoolingLoop, RadiationLevel, ContainmentStatus, FuelRodPosition, EmergencyPanel } from './nuclear';
export { FabCleanRoom, WaferYield, LithographyStep, DefectMap, EtchChamber, WaferTransport } from './semiconductor';
export { TrackOccupancy, SignalHead, TrainSchedule, PantographMonitor, PointsSwitch, PlatformDisplay } from './railway';
export { FermentationVessel, BrewTempCurve, CarbonationLevel, MashTunControl, GravityReading, BatchTracker } from './brewing';
export { WellheadPressure, BOPStatus, MudWeight, DrillDepth, GasSeparator, RigTension } from './offshore';
export { CrowdDensity, TicketGate, LightingRig, PASystem, ScoreBoard, TurnstileFlow } from './stadium';
export { OrbitTracker, SatTelemetry, SolarArrayAngle, LinkBudget, ThrusterControl, GroundStation } from './space';
export { AttitudeIndicator, Altimeter, AirspeedIndicator, HeadingCompass, VerticalSpeed, AnnunciatorPanel } from './aviation';
export { DepthGauge, BallastTank, TorpedoStatus, SonarDisplay, HullPressure, DivePlane } from './submarine';
export { VacuumTubeAmp, ReelToReel, VUMeter, GraphicEQ, TapeCounter, TransformerHum } from './hifi';
export { Chronograph, MoonPhase, PowerReserve, TourbillonCage, DateWheel, BalanceWheel } from './watchmaking';
export { Speedometer, Tachometer, BoostGauge, OilTemp, FuelGauge, EngDiagnostics } from './automotive';
export { Oscilloscope, LabSpectrumAnalyzer, FunctionGenerator, Multimeter, Centrifuge, TitrationApparatus } from './lab';
export { MercuryBarometer, Anemometer, RainGauge, WindVane, Hygrometer, StormGlass } from './weather';
export { BoilerPressure, SteamValve, Flywheel, Governor, PistonIndicator, SteamWhistle } from './steam';
export { InkDensityMeter, CMYKRegistration, PaperTension, PressCylinder, ColorSeparation, DryingOven } from './printing';
export { NixieTubeDisplay, ToggleSwitchBank, MagTapeReel, CoreMemoryGrid, PunchCardReader, BlinkenLights } from './retro';

// ── Local imports for DashboardContent ────────────────────────────────
import { KPI, DeviceCard, Gauge, DeviceTable, UptimeTimeline } from './fleet';
import { PTZControl, Mixer, QuickControls, InputSelector, DisplayAdjust, ColorTemp, Toggle, CmdBtn } from './av-controls';
import { AudioSpectrum, AudioEQ, VolumeKnob } from './audio';
import { VideoWall, CrosspointMatrix, SignalFlow, ResolutionPicker, AspectRatio, EDIDManager, DisplayOrientation } from './display-routing';
import { ScenePresets, PowerSequencer, MacroBuilder, ThermostatControl, Climate, Occupancy, Schedule } from './room-climate';
import { NetworkInfo, BandwidthMonitor, AVoIPStats, LatencyGraph, PowerMonitor, PoEManager, PortStatus, CertStatus, LampLife } from './network';
import { AlertFeed, CommandLog, BulkActions, CodeTester, FirmwareUpdate } from './incidents';
import { AnomalyDetector, PredictiveMaintenance, AIInsights, SentimentGauge, UsageForecaster, ModelPerformance, NLPCommandParser } from './ai-analytics';
import { MeetingStatus, ScreenShare, ChatFeed, WhiteboardMini, PollWidget, TaskTracker } from './collaboration';
import { StatusIndicator, NumericMetric, ValueDisplay, TextDisplay, ToggleSwitch, ActionButton, StateSelector, BarSlider, GaugeWidget, BarWidget, SplineChart, ScatterChart, DeviceMap, StatusTimeline, GroupedToggles } from './core-widgets';
import { SolarPanel, BatteryBank, GridStatus, CarbonTracker, EnergyFlow, CostMonitor } from './energy';
import { ThreatMap, AccessLog, VulnerabilityScanner, FirewallRules, EncryptionStatus, ComplianceChecker, SecurityScore } from './security';
import { PlaylistManager, ContentPreview, ScreenZoning, ScheduleCalendar, ProofOfPlay, BrightnessSchedule } from './signage';
import { FloorPlan, ZoneHeatmap, WayfindingStatus, BeaconManager, AssetTracker, EnvironmentalSensor } from './spatial';
import { SoilMoisture, IrrigationControl, WeatherStation, CropHealth, DroneView, HarvestTracker } from './agriculture';
import { StreamHealth, EncoderStatus, Multiviewer, TallyLight, PlayoutSchedule, AudioLoudness, CaptionMonitor } from './broadcast';
import { RackThermal, ServerHealth, VMDensity, BandwidthPipe, UPSStatus, CoolingEfficiency, PatchPanel } from './datacenter';
import { ClassroomAV, AttendanceBoard, DigitalBulletin, BellSchedule, LibraryOccupancy, ExamTimer } from './education';
import { PatientMonitor, VitalsChart, BedManager, NurseCallBoard, LabResults, PharmacyQueue, TriageStatus } from './healthcare';
import { RoomStatus, MinibarTracker, GuestServices, HousekeepingBoard, CheckInKiosk, PoolSensors } from './hospitality';
import { FleetGPS, RouteOptimizer, WarehouseMap, DeliveryTracker, DockSchedule, FuelMonitor } from './logistics';
import { AssemblyLine, OEEGauge, QualityGate, PLCStatus, TankLevel, ConveyorSpeed, ShiftSchedule } from './manufacturing';
import { POSAnalytics, InventoryLevel, FootTraffic, QueueMonitor, PriceTag, ShrinkageAlert, LoyaltyDash } from './retail';
import { HVACZone, ElevatorStatus, ParkingOccupancy, WaterMeter, LightingScene, AccessDoor, FirePanel } from './smart-building';
import { FlightBoard, RunwayStatus, BaggageFlow, FuelFarm, AircraftMaintenance, GateAssignment } from './aerospace';
import { CleanRoom, BatchReactor, Chromatograph, ColdChain, QualityLab, ComplianceTracker } from './pharma';
import { CellTower, SpectrumAnalyzer, SubscriberMetrics, NetworkSlicing, SIMInventory, CallQuality } from './telecom';
import { VesselTracker, ContainerYard, TideMonitor, CraneOps, BerthSchedule, CargoManifest } from './maritime';
import { SiteProgress, CraneMonitor, MaterialsTracker, WeatherSite, SafetyBoard, ConcreteMonitor, EquipmentFleet } from './construction';
import { MineShaftDepth, OreGradeAnalyzer, VentilationFan, ConveyorLoad, BlastSequencer, CageWinder } from './mining';
import { WaterFlowRate, ChemicalDosing, FiltrationBank, WaterTankLevel, TurbidityMeter, PumpStation } from './water';
import { RobotArmPose, JointTorque, VisionFeed, TaskQueue, GripperStatus, CycleCounter } from './robotics';
import { ReactorStatus, CoolingLoop, RadiationLevel, ContainmentStatus, FuelRodPosition, EmergencyPanel } from './nuclear';
import { FabCleanRoom, WaferYield, LithographyStep, DefectMap, EtchChamber, WaferTransport } from './semiconductor';
import { TrackOccupancy, SignalHead, TrainSchedule, PantographMonitor, PointsSwitch, PlatformDisplay } from './railway';
import { FermentationVessel, BrewTempCurve, CarbonationLevel, MashTunControl, GravityReading, BatchTracker } from './brewing';
import { WellheadPressure, BOPStatus, MudWeight, DrillDepth, GasSeparator, RigTension } from './offshore';
import { CrowdDensity, TicketGate, LightingRig, PASystem, ScoreBoard, TurnstileFlow } from './stadium';
import { OrbitTracker, SatTelemetry, SolarArrayAngle, LinkBudget, ThrusterControl, GroundStation } from './space';
import { AttitudeIndicator, Altimeter, AirspeedIndicator, HeadingCompass, VerticalSpeed, AnnunciatorPanel } from './aviation';
import { DepthGauge, BallastTank, TorpedoStatus, SonarDisplay, HullPressure, DivePlane } from './submarine';
import { VacuumTubeAmp, ReelToReel, VUMeter, GraphicEQ, TapeCounter, TransformerHum } from './hifi';
import { Chronograph, MoonPhase, PowerReserve, TourbillonCage, DateWheel, BalanceWheel } from './watchmaking';
import { Speedometer, Tachometer, BoostGauge, OilTemp, FuelGauge, EngDiagnostics } from './automotive';
import { Oscilloscope, LabSpectrumAnalyzer, FunctionGenerator, Multimeter, Centrifuge, TitrationApparatus } from './lab';
import { MercuryBarometer, Anemometer, RainGauge, WindVane, Hygrometer, StormGlass } from './weather';
import { BoilerPressure, SteamValve, Flywheel, Governor, PistonIndicator, SteamWhistle } from './steam';
import { InkDensityMeter, CMYKRegistration, PaperTension, PressCylinder, ColorSeparation, DryingOven } from './printing';
import { NixieTubeDisplay, ToggleSwitchBank, MagTapeReel, CoreMemoryGrid, PunchCardReader, BlinkenLights } from './retro';

// ══════════════════════════════════════════════════════════════════════════
//  DASHBOARD CONTENT — Full showcase layout
// ══════════════════════════════════════════════════════════════════════════
export function DashboardContent() {
  const X = getX();
  return (
    <div style={{ background: X.bg, minHeight: '100vh', fontFamily: X.f, color: X.text }}>
      {/* HEADER */}
      <header style={{ background: X.surface, borderBottom: `1px solid ${X.border}`, padding: '10px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <XyteLogo />
          <div style={{ width: 1, height: 18, background: X.border }} />
          <span style={{ fontSize: 12, fontWeight: 600, color: X.textSec }}>Connect+</span>
          <M style={{ fontSize: 10, color: X.textMut }}>AV Fleet Dashboard</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <Badge color={X.teal} solid><Dot c="#fff" pulse s={4} />1,247 Online</Badge>
          <Badge color={X.amber}>23 Alerts</Badge>
          <Badge color={X.purple}>v2.0</Badge>
        </div>
      </header>

      {/* HERO */}
      <div style={{ background: X.gradHero, padding: '14px 20px', borderBottom: `1px solid ${X.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, color: X.textBright }}>Conference Room Alpha — Building A, Floor 3</div>
          <M style={{ fontSize: 9, color: X.textSec }}>12 devices · Last activity 2m ago · All nominal</M>
        </div>
        <div style={{ display: 'flex', gap: 4 }}>
          <CmdBtn label="Identify All" color={X.indigo} />
          <CmdBtn label="Power Cycle" color={X.pink} />
        </div>
      </div>

      <main style={{ padding: '20px', maxWidth: 1400, margin: '0 auto' }}>

        <Section title="Fleet Overview" desc="Real-time KPI metrics with sparkline trends.">
          <KPI value={1247} prev={1180} label="Devices Online" color={X.teal} delay={0} />
          <KPI value={98} prev={97} label="Uptime %" color={X.purple} delay={60} />
          <KPI value={23} prev={31} label="Open Alerts" color={X.amber} delay={120} />
          <KPI value={142} prev={89} label="Commands/hr" color={X.indigo} delay={180} />
          <KPI value={847} prev={812} label="Power (W)" color={X.pink} delay={240} />
        </Section>

        <Section title="Device Fleet" desc="Individual device health with signal, temperature, firmware.">
          <DeviceCard name="NEC PA804UL" type="Projector" status="online" signal={95} temp={42} fw="v4.2.1" ip="192.168.1.42" delay={0} />
          <DeviceCard name="Samsung QM85R" type="Display" status="warning" signal={62} temp={68} fw="v3.1.0" ip="192.168.1.43" delay={50} />
          <DeviceCard name="PTZ Optics 30X" type="Camera" status="error" signal={0} temp={31} fw="v2.0.4" ip="192.168.1.46" delay={100} />
          <DeviceCard name="QSC Core 110f" type="Speaker" status="online" signal={88} temp={38} fw="v4.0.2" ip="192.168.1.45" delay={150} />
        </Section>

        <Section title="Telemetry Gauges" desc="Real-time device performance metrics.">
          <Card style={{ display: 'flex', gap: 16, flexWrap: 'wrap', alignItems: 'center', justifyContent: 'center', padding: '16px 20px' }}>
            <Gauge value={72} label="CPU" /><Gauge value={45} label="Memory" color={X.indigo} /><Gauge value={88} label="Temp" unit="°C" color={X.amber} /><Gauge value={31} label="Fan" color={X.teal} /><Gauge value={95} label="Signal" color={X.teal} /><Gauge value={62} label="Load" color={X.pink} />
          </Card>
        </Section>

        <Section title="AV Controls" desc="PTZ camera joystick with focus/iris, 8-channel audio mixer.">
          <PTZControl />
          <Mixer />
          <QuickControls />
        </Section>

        <Section title="Audio" desc="Spectrum analyzer with peak hold, parametric EQ, volume knob.">
          <AudioSpectrum />
          <AudioEQ />
          <Card style={{ display: 'flex', gap: 16, alignItems: 'center', padding: '16px 20px' }}>
            <VolumeKnob label="Master" color={X.purple} />
            <VolumeKnob label="Monitor" color={X.indigo} />
            <VolumeKnob label="Sub" color={X.teal} />
          </Card>
        </Section>

        <Section title="Display & Source" desc="Input switching, display adjustments, color temperature, EDID, resolution, aspect ratio.">
          <InputSelector />
          <DisplayAdjust />
          <ColorTemp />
          <ResolutionPicker />
          <AspectRatio />
          <EDIDManager />
          <DisplayOrientation />
        </Section>

        <Section title="Video Wall & Matrix" desc="Video wall layout with source assignment, crosspoint routing matrix.">
          <VideoWall />
          <CrosspointMatrix />
          <SignalFlow />
        </Section>

        <Section title="Room Automation" desc="Scene presets, power sequencing, macro builder, climate control.">
          <ScenePresets />
          <PowerSequencer />
          <MacroBuilder />
          <ThermostatControl ambientC={22.4} />
          <Climate temp={22.4} hum={45} />
          <Occupancy occ={12} />
        </Section>

        <Section title="Network & Transport" desc="Network stack, bandwidth monitoring, AV-over-IP stats, latency graph.">
          <NetworkInfo j={1.2} lat={2.1} />
          <BandwidthMonitor />
          <AVoIPStats bitrate={42} latency={1.8} drops={0.2} />
          <LatencyGraph />
          <UptimeTimeline />
        </Section>

        <Section title="Power & Infrastructure" desc="Power consumption monitoring, PoE port management, I/O ports.">
          <PowerMonitor />
          <PoEManager />
          <PortStatus />
          <CertStatus />
        </Section>

        <Section title="Remote Commands" desc="Command buttons, toggle switches, bulk actions, code tester, command log.">
          <Card style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              <CmdBtn label="Reboot" color={X.purple} /><CmdBtn label="Power Off" color={X.pink} /><CmdBtn label="Identify" color={X.indigo} /><CmdBtn label="Factory Reset" color={X.red} /><CmdBtn label="Clear Cache" color={X.amber} /><CmdBtn label="Sync Time" color={X.teal} />
            </div>
            <div style={{ height: 1, background: X.borderLight }} />
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <Toggle label="Auto-brightness" /><Toggle label="Standby" color={X.indigo} initial /><Toggle label="Fan Override" color={X.red} /><Toggle label="Net Lock" color={X.teal} initial /><Toggle label="Eco Mode" color={X.teal} /><Toggle label="CEC" color={X.amber} initial />
            </div>
          </Card>
          <BulkActions />
          <CodeTester />
          <CommandLog />
        </Section>

        <Section title="Alerts & Schedule" desc="Alert feed with dismiss, room calendar, device inventory.">
          <AlertFeed />
          <Schedule />
          <DeviceTable />
        </Section>

        <Section title="Firmware & Lifecycle" desc="Multi-phase OTA update tracker, laser life monitor.">
          <FirmwareUpdate />
          <LampLife />
        </Section>

        <Section title="Core Widget Primitives" desc="Foundational widget types — status, metrics, controls, charts, maps.">
          <StatusIndicator />
          <NumericMetric />
          <ValueDisplay />
          <TextDisplay />
          <ToggleSwitch />
          <ActionButton />
          <StateSelector />
          <BarSlider />
          <GaugeWidget />
          <BarWidget />
          <SplineChart />
          <ScatterChart />
          <DeviceMap />
          <StatusTimeline />
          <GroupedToggles />
        </Section>

        <Section title="AI & Analytics" desc="Anomaly detection, predictive maintenance, NLP command parsing.">
          <AnomalyDetector confidence={94} />
          <PredictiveMaintenance />
          <AIInsights />
          <SentimentGauge score={78} />
          <UsageForecaster />
          <ModelPerformance />
          <NLPCommandParser />
        </Section>

        <Section title="Collaboration" desc="Meeting status, screen sharing, chat, whiteboard, polls.">
          <MeetingStatus />
          <ScreenShare fps={30} />
          <ChatFeed />
          <WhiteboardMini />
          <PollWidget />
          <TaskTracker />
        </Section>

        <Section title="Energy Management" desc="Solar, battery, grid status, carbon tracking, cost monitoring.">
          <SolarPanel output={4.8} daily={28.4} efficiency={21.3} />
          <BatteryBank charge={72} rate={1.4} />
          <GridStatus importW={320} freq={50.0} voltage={230} />
          <CarbonTracker dailyCO2={12.4} monthlyCO2={348} reduction={23} />
          <EnergyFlow solarW={4200} gridW={800} battW={1200} loadW={5800} />
          <CostMonitor rate={0.14} dailyCost={8.42} monthlyCost={247} />
        </Section>

        <Section title="Security" desc="Threat map, access log, vulnerability scanning, firewall, encryption, compliance.">
          <ThreatMap liveThreats={57} />
          <AccessLog />
          <VulnerabilityScanner />
          <FirewallRules />
          <EncryptionStatus />
          <ComplianceChecker />
          <SecurityScore />
        </Section>

        <Section title="Digital Signage" desc="Playlist management, content preview, screen zoning, scheduling, proof of play.">
          <PlaylistManager />
          <ContentPreview />
          <ScreenZoning />
          <ScheduleCalendar />
          <ProofOfPlay plays={1842} impressions={24300} completion={94.2} />
          <BrightnessSchedule currentBrightness={75} />
        </Section>

        <Section title="Spatial & Location" desc="Floor plans, zone heatmaps, wayfinding, beacons, asset tracking.">
          <FloorPlan />
          <ZoneHeatmap />
          <WayfindingStatus activeRoutes={12} />
          <BeaconManager />
          <AssetTracker />
          <EnvironmentalSensor temp={22.4} humidity={45} co2={420} noise={38} light={450} />
        </Section>

        <Section title="Agriculture" desc="Soil moisture, irrigation, weather, crop health, drones, harvest.">
          <SoilMoisture />
          <IrrigationControl />
          <WeatherStation temp={24.6} humidity={62} windSpeed={12.3} rainfall={2.4} uvIndex={6.2} pressure={1013.2} />
          <CropHealth />
          <DroneView />
          <HarvestTracker />
        </Section>

        <Section title="Broadcast" desc="Stream health, encoders, multiviewer, tally lights, playout, audio loudness, captions.">
          <StreamHealth bitrate={8500} viewers={12400} frameDrops={0.12} />
          <EncoderStatus />
          <Multiviewer />
          <TallyLight />
          <PlayoutSchedule />
          <AudioLoudness intLufs={-23} />
          <CaptionMonitor wpm={160} delay={1.2} accuracy={97.5} />
        </Section>

        <Section title="Datacenter" desc="Rack thermal, server health, VM density, bandwidth, UPS, cooling, patch panel.">
          <RackThermal />
          <ServerHealth />
          <VMDensity />
          <BandwidthPipe />
          <UPSStatus load={62} runtime={24} inputV={230} outputV={230} />
          <CoolingEfficiency supplyTemp={12.4} returnTemp={22.6} />
          <PatchPanel />
        </Section>

        <Section title="Education" desc="Classroom AV, attendance, bulletin board, bell schedule, library, exam timer.">
          <ClassroomAV audioLevel={72} />
          <AttendanceBoard />
          <DigitalBulletin />
          <BellSchedule />
          <LibraryOccupancy currentOcc={78} noiseLevel={38} />
          <ExamTimer />
        </Section>

        <Section title="Healthcare" desc="Patient monitor, vitals, bed management, nurse call, lab results, pharmacy, triage.">
          <PatientMonitor />
          <VitalsChart />
          <BedManager />
          <NurseCallBoard />
          <LabResults />
          <PharmacyQueue />
          <TriageStatus />
        </Section>

        <Section title="Hospitality" desc="Room status, minibar, guest services, housekeeping, check-in, pool sensors.">
          <RoomStatus />
          <MinibarTracker />
          <GuestServices />
          <HousekeepingBoard />
          <CheckInKiosk queueLen={5} avgTime={4.2} />
          <PoolSensors waterTemp={28.2} pH={7.3} chlorine={1.4} filterPressure={12} />
        </Section>

        <Section title="Logistics" desc="Fleet GPS, route optimizer, warehouse zones, delivery tracker, dock schedule, fuel.">
          <FleetGPS />
          <RouteOptimizer />
          <WarehouseMap />
          <DeliveryTracker />
          <DockSchedule />
          <FuelMonitor />
        </Section>

        <Section title="Manufacturing" desc="Assembly line, OEE, quality gate, PLC, tank levels, conveyor, shift schedule.">
          <AssemblyLine throughput={142} />
          <OEEGauge availability={91.2} performance={84.7} quality={97.3} />
          <QualityGate defectRate={2.48} />
          <PLCStatus cycleTime={24.6} scanRate={4.2} />
          <TankLevel />
          <ConveyorSpeed speed={1.82} tension={342} itemsMin={48} />
          <ShiftSchedule />
        </Section>

        <Section title="Retail" desc="POS analytics, inventory, foot traffic, queue monitor, pricing, shrinkage, loyalty.">
          <POSAnalytics revenue={24380} avgTx={28.8} />
          <InventoryLevel />
          <FootTraffic occupancy={186} />
          <QueueMonitor r1={3} r2={5} r3={1} r4={0} />
          <PriceTag />
          <ShrinkageAlert />
          <LoyaltyDash pointsDist={284000} />
        </Section>

        <Section title="Smart Building" desc="HVAC zones, elevators, parking, water, lighting, access doors, fire panel.">
          <HVACZone temp={22.6} humidity={44} fanSpeed={65} />
          <ElevatorStatus />
          <ParkingOccupancy />
          <WaterMeter flowRate={3.8} dailyUsage={2840} monthlyUsage={68400} pressure={4.2} />
          <LightingScene totalPower={4.2} />
          <AccessDoor />
          <FirePanel />
        </Section>

        <Section title="Aerospace" desc="Flight board, runway status, baggage flow, fuel farm, aircraft maintenance, gate assignment.">
          <FlightBoard />
          <RunwayStatus />
          <BaggageFlow currentRate={142} />
          <FuelFarm dailyConsumption={42.5} />
          <AircraftMaintenance />
          <GateAssignment />
        </Section>

        <Section title="Pharmaceutical" desc="Clean room monitoring, batch reactors, HPLC chromatography, cold chain, quality lab, GxP compliance.">
          <CleanRoom particleCount={85} diffPressure={12.5} temperature={21.0} humidity={45} prevParticle={90} />
          <BatchReactor />
          <Chromatograph runTime={18.4} />
          <ColdChain />
          <QualityLab />
          <ComplianceTracker />
        </Section>

        <Section title="Telecom" desc="Cell towers, spectrum analysis, subscribers, 5G network slicing, SIM management, call quality.">
          <CellTower />
          <SpectrumAnalyzer />
          <SubscriberMetrics activeSessions={184200} />
          <NetworkSlicing />
          <SIMInventory />
          <CallQuality mos={4.2} jitter={12} latency={28} packetLoss={0.3} />
        </Section>

        <Section title="Maritime" desc="Vessel tracking, container yards, tides, crane operations, berth scheduling, cargo manifests.">
          <VesselTracker />
          <ContainerYard />
          <TideMonitor tideLevel={3.8} />
          <CraneOps />
          <BerthSchedule />
          <CargoManifest />
        </Section>

        <Section title="Construction" desc="Site progress, cranes, materials, weather, safety, concrete monitoring, equipment fleet.">
          <SiteProgress />
          <CraneMonitor />
          <MaterialsTracker />
          <WeatherSite temp={82} wind={18} gusts={26} humidity={54} precip={12} />
          <SafetyBoard workersOnSite={84} />
          <ConcreteMonitor slump={4.2} airContent={5.8} concreteTemp={72} />
          <EquipmentFleet />
        </Section>

        <Section title="Mining" desc="Shaft depth, ore grade, ventilation, conveyor loads, blast sequencing, cage winders.">
          <MineShaftDepth currentDepth={520} temperature={34} humidity={78} />
          <OreGradeAnalyzer goldGrade={72} copperGrade={58} ironGrade={81} lithiumGrade={44} />
          <VentilationFan airflow={42} power={18.5} rpm={1200} />
          <ConveyorLoad loadPct={68} speed={2.4} throughput={340} motorTemp={62} />
          <BlastSequencer />
          <CageWinder speed={8.2} depth={420} loadWeight={12.4} ropeStress={62} />
        </Section>

        <Section title="Water Treatment" desc="Flow rates, chemical dosing, filtration banks, tank levels, turbidity, pump stations.">
          <WaterFlowRate flow={42.5} />
          <ChemicalDosing chlorine={1.2} fluoride={0.7} phActual={7.0} />
          <FiltrationBank pressures={[32, 28, 35, 30, 26, 33]} />
          <WaterTankLevel levels={[72, 58, 85, 44]} />
          <TurbidityMeter ntu={2.1} />
          <PumpStation pressures={[42, 38, 45]} flows={[120, 95, 135]} rpms={[1450, 1380, 1520]} />
        </Section>

        <Section title="Robotics" desc="Arm poses, joint torque, vision feeds, task queues, grippers, cycle counters.">
          <RobotArmPose angles={[45, -30, 60, 15, -45, 30, 0, 90]} />
          <JointTorque torques={[24, 18, 32, 15]} />
          <VisionFeed fps={29.8} detections={3} conf={85} />
          <TaskQueue />
          <GripperStatus force={24.6} />
          <CycleCounter cycleRate={12.4} uptime={98.7} />
        </Section>

        <Section title="Nuclear" desc="Reactor status, cooling loops, radiation levels, containment, fuel rods, emergency panels.">
          <ReactorStatus temp={315} />
          <CoolingLoop flowRate={92} inletTemp={285} outletTemp={320} pressure={155} />
          <RadiationLevel level={42} dose={0.12} />
          <ContainmentStatus pressure={1.02} />
          <FuelRodPosition />
          <EmergencyPanel elapsed={0} />
        </Section>

        <Section title="Semiconductor" desc="Clean rooms, wafer yield, lithography, defect maps, etch chambers, wafer transport.">
          <FabCleanRoom temp={21.5} humidity={43} pressure={1.2} />
          <WaferYield waferTemp={22.3} />
          <LithographyStep exposureDose={245} alignOffset={0.8} focusDepth={42} />
          <DefectMap />
          <EtchChamber chamberPressure={85} gasFlow={120} rfPower={750} etchRate={2.4} />
          <WaferTransport speed={1.8} />
        </Section>

        <Section title="Railway" desc="Track occupancy, signals, schedules, pantograph, points switches, platform displays.">
          <TrackOccupancy />
          <SignalHead />
          <TrainSchedule />
          <PantographMonitor voltage={25.0} currentDraw={420} contactForce={78} temperature={52} />
          <PointsSwitch />
          <PlatformDisplay />
        </Section>

        <Section title="Brewing" desc="Fermentation vessels, temp curves, carbonation, mash tun, gravity readings, batch tracking.">
          <FermentationVessel />
          <BrewTempCurve />
          <CarbonationLevel pressure={12.5} volumes={2.4} temp={4.2} />
          <MashTunControl temp={65} />
          <GravityReading sg={1.042} />
          <BatchTracker />
        </Section>

        <Section title="Offshore Oil" desc="Wellhead pressure, BOP status, mud weight, drill depth, gas separators, rig tension.">
          <WellheadPressure psi={3200} temp={185} flowRate={1240} />
          <BOPStatus testPressure={4800} annularPressure={1200} />
          <MudWeight weight={12.4} viscosity={48} pH={9.8} chlorides={18000} />
          <DrillDepth currentDepth={8400} rop={42} wob={28} torque={14200} />
          <GasSeparator gasFlow={320} liquidFlow={180} pressure={85} efficiency={94} />
          <RigTension hookLoad={320} torque={18500} rpm={120} standpipe={3200} />
        </Section>

        <Section title="Stadium & Events" desc="Crowd density, ticket gates, lighting rigs, PA systems, scoreboards, turnstile flow.">
          <CrowdDensity />
          <TicketGate />
          <LightingRig />
          <PASystem />
          <ScoreBoard homeScore={2} awayScore={1} />
          <TurnstileFlow />
        </Section>

        <Section title="Space & Satellite" desc="Orbit tracking, telemetry, solar arrays, link budgets, thruster control, ground stations.">
          <OrbitTracker altitude={408} velocity={7.66} period={92.4} inclination={51.6} />
          <SatTelemetry battery={78} signal={62} temp={22} attitude={0.4} />
          <SolarArrayAngle sunAngle={45} panelAngle={42} power={4.2} efficiency={88} />
          <LinkBudget signalStrength={72} linkMargin={6.2} ber={1e-9} cnr={12.5} dataRate={150} />
          <ThrusterControl fuelLevel={64} pressure={220} totalImpulse={12.4} />
          <GroundStation elevation={42} azimuth={185} snr={18.5} tracking={true} />
        </Section>

        <Section title="Aviation Cockpit" desc="Attitude indicators, altimeters, airspeed, heading compass, vertical speed, annunciator panels.">
          <AttitudeIndicator />
          <Altimeter altitude={24500} />
          <AirspeedIndicator airspeed={165} />
          <HeadingCompass heading={270} wobble={0} />
          <VerticalSpeed vsi={500} />
          <AnnunciatorPanel />
        </Section>

        <Section title="Submarine" desc="Depth gauges, ballast tanks, torpedo status, sonar displays, hull pressure, dive planes.">
          <DepthGauge depth={185} />
          <BallastTank fillPct={65} />
          <TorpedoStatus />
          <SonarDisplay />
          <HullPressure psi={380} />
          <DivePlane planeAngle={12} />
        </Section>

        <Section title="Vintage HiFi" desc="Vacuum tube amps, reel-to-reel, VU meters, graphic EQ, tape counters, transformers.">
          <VacuumTubeAmp powerOut={42} warmup={96} />
          <ReelToReel />
          <VUMeter levelL={-8} levelR={-6} />
          <GraphicEQ />
          <TapeCounter />
          <TransformerHum voltage={240} current={2.4} temp={62} />
        </Section>

        <Section title="Watchmaking" desc="Chronographs, moon phase, power reserve, tourbillon, date wheels, balance wheels.">
          <Chronograph />
          <MoonPhase />
          <PowerReserve liveHours={48} />
          <TourbillonCage oscillationRate={28800} />
          <DateWheel />
          <BalanceWheel amplitude={300} />
        </Section>

        <Section title="Automotive" desc="Speedometers, tachometers, boost gauges, oil temp, fuel gauges, engine diagnostics.">
          <Speedometer speed={95} />
          <Tachometer rpm={3200} />
          <BoostGauge boost={8} />
          <OilTemp temp={92} />
          <FuelGauge fuel={62} />
          <EngDiagnostics rpmVal={2800} coolantVal={92} intakeVal={38} batteryVal={13.8} />
        </Section>

        <Section title="Oscilloscope & Lab" desc="Oscilloscopes, spectrum analyzers, function generators, multimeters, centrifuges, titration.">
          <Oscilloscope />
          <LabSpectrumAnalyzer />
          <FunctionGenerator freq={1000} />
          <Multimeter voltage={12.47} />
          <Centrifuge temperature={4.0} />
          <TitrationApparatus pH={6.8} volume={25.4} />
        </Section>

        <Section title="Weather Station" desc="Barometers, anemometers, rain gauges, wind vanes, hygrometers, storm glasses.">
          <MercuryBarometer pressure={1013} prevPressure={1013} />
          <Anemometer windSpeed={24} />
          <RainGauge rainfall={12.4} rate={2.1} />
          <WindVane direction={225} />
          <Hygrometer dryTemp={24} wetTemp={20} />
          <StormGlass temp={18} />
        </Section>

        <Section title="Steam & Mechanical" desc="Boiler pressure, steam valves, flywheels, governors, pistons, steam whistles.">
          <BoilerPressure psi={145} />
          <SteamValve flow={340} />
          <Flywheel />
          <Governor speed={60} />
          <PistonIndicator />
          <SteamWhistle />
        </Section>

        <Section title="Printing & Typography" desc="Ink density, CMYK registration, paper tension, press cylinders, color separation, drying ovens.">
          <InkDensityMeter densityC={1.42} densityM={1.35} densityY={0.98} densityK={1.78} />
          <CMYKRegistration offset={0.3} />
          <PaperTension tension={65} />
          <PressCylinder speed={8500} pressure={4.2} />
          <ColorSeparation />
          <DryingOven temp={185} feedSpeed={12.5} />
        </Section>

        <Section title="Vintage Computing" desc="Nixie tubes, toggle switches, mag tape reels, core memory, punch cards, blinken lights.">
          <NixieTubeDisplay />
          <ToggleSwitchBank />
          <MagTapeReel />
          <CoreMemoryGrid />
          <PunchCardReader />
          <BlinkenLights />
        </Section>

      </main>

      <footer style={{ background: X.surface, borderTop: `1px solid ${X.border}`, padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <XyteLogo s={11} />
          <M style={{ fontSize: 8, color: X.textMut }}>Connect+ AV Dashboard · 310+ Widget Types · Dark Theme</M>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <M style={{ fontSize: 8, color: X.textMut }}>XYTE Brand System</M>
          <div style={{ display: 'flex', gap: 2 }}>
            {[X.purple, X.indigo, X.teal, X.pink, X.amber].map((c, i) => <div key={i} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />)}
          </div>
        </div>
      </footer>
    </div>
  );
}
