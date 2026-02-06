# Layout Components

## `src/App.tsx`
Main gallery layout, global state holder, and section composition.

```tsx
import {
  Container,
  MultiSelect,
  SegmentedControl,
  SimpleGrid,
  Stack,
  Text,
  Title,
  MantineProvider,
} from '@mantine/core';
import React, { useMemo, useState } from 'react';

import { SectionTitle } from './components/SectionTitle';
import { ThemeToolbar } from './components/ThemeToolbar';
import { ConnectivityStatusCard } from './components/widgets/ConnectivityStatusCard';
import { DeviceControlsCard } from './components/widgets/DeviceControlsCard';
import { IncidentAgeChart } from './components/widgets/IncidentAgeChart';
import {
  IncidentFeedCardWithData,
} from './components/widgets/IncidentFeedCard';
import { KpiGrid } from './components/widgets/KpiGrid';
import { ResearchSummaryCard } from './components/widgets/ResearchSummaryCard';
import { RoomControlCenterCard } from './components/widgets/RoomControlCenterCard';
import { SpaceTreeCard } from './components/widgets/SpaceTreeCard';
import { TelemetryChartCard } from './components/widgets/TelemetryChartCard';
import { WidgetCatalogCard } from './components/widgets/WidgetCatalogCard';
import { DataLevel, INCIDENT_FEED, KPI_BY_LEVEL } from './data/mockData';
import { buildMantineTheme, XYTE_PRESETS } from './theme/presets';
import './styles.css';

const PRIORITY_OPTIONS = [
  { value: 'critical', label: 'Critical' },
  { value: 'high', label: 'High' },
  { value: 'moderate', label: 'Moderate' },
  { value: 'low', label: 'Low' },
  { value: 'planning', label: 'Planning' },
];

export default function App() {
  const [activeThemeId, setActiveThemeId] = useState(XYTE_PRESETS[0].id);
  const [dataLevel, setDataLevel] = useState<DataLevel>('local');
  const [priorityFilter, setPriorityFilter] = useState<string[]>(
    PRIORITY_OPTIONS.map((option) => option.value)
  );
  const [telemetryDensity, setTelemetryDensity] = useState<'dense' | 'airy'>('dense');

  const theme = useMemo(() => {
    const selectedPreset =
      XYTE_PRESETS.find((preset) => preset.id === activeThemeId) || XYTE_PRESETS[0];
    return buildMantineTheme(selectedPreset);
  }, [activeThemeId]);

  const kpiValues = KPI_BY_LEVEL[dataLevel];

  const filteredIncidents = useMemo(() => {
    return INCIDENT_FEED.filter((incident) => priorityFilter.includes(incident.priority));
  }, [priorityFilter]);

  return (
    <MantineProvider theme={theme} withGlobalStyles withNormalizeCSS>
      <div className={`app-shell telemetry-${telemetryDensity}`}>
        <Container size={1320} py="xl">
          <Stack spacing="lg">
            <ThemeToolbar
              themeId={activeThemeId}
              onThemeChange={setActiveThemeId}
              presets={XYTE_PRESETS}
              dataLevel={dataLevel}
              onDataLevelChange={setDataLevel}
            />

            <Stack spacing={4}>
              <Title order={1} size={42} c="blue_gray.9" fw={800}>
                XYTE Elements Library
              </Title>
              <Text size="md" c="gray.6" maw={920}>
                Gallery for XYTE widgets, controls, telemetry, room/space views, and connectivity surfaces.
                Built in Mantine with multi-theme support and an intentionally modern morphism aesthetic.
              </Text>
            </Stack>

            <SectionTitle
              title="Core Dashboard Cards"
              subtitle="Mirrors the KPI and incident analytics patterns from Overview and Room dashboards."
            />
            <KpiGrid values={kpiValues} />

            <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
              <IncidentAgeChart />
              <TelemetryChartCard />
            </SimpleGrid>

            <SectionTitle
              title="Controls and Room Operations"
              subtitle="Interactive command controls and room-level operations derived from existing XYTE patterns."
              rightSlot={
                <SegmentedControl
                  size="xs"
                  value={telemetryDensity}
                  onChange={(value) => setTelemetryDensity(value as 'dense' | 'airy')}
                  data={[
                    { value: 'dense', label: 'Dense' },
                    { value: 'airy', label: 'Airy' },
                  ]}
                />
              }
            />
            <SimpleGrid cols={2} spacing="md" breakpoints={[{ maxWidth: 'md', cols: 1 }]}>
              <DeviceControlsCard />
              <RoomControlCenterCard />
            </SimpleGrid>

            <SectionTitle
              title="Spaces, Connectivity, and Incidents"
              subtitle="Topology, connector health, and incident list interactions modeled on current operation surfaces."
              rightSlot={
                <MultiSelect
                  size="xs"
                  w={280}
                  data={PRIORITY_OPTIONS}
                  value={priorityFilter}
                  onChange={setPriorityFilter}
                  placeholder="Filter incidents by priority"
                />
              }
            />
            <SimpleGrid cols={3} spacing="md" breakpoints={[{ maxWidth: 'lg', cols: 2 }, { maxWidth: 'md', cols: 1 }]}>
              <SpaceTreeCard />
              <ConnectivityStatusCard />
              <IncidentFeedCardWithData data={filteredIncidents} />
            </SimpleGrid>

            <SectionTitle
              title="Widget Taxonomy"
              subtitle="Directly aligned with your `device-widgets` package naming and structure."
            />
            <WidgetCatalogCard />

            <SectionTitle
              title="Research Baseline"
              subtitle="Captured from ../server/web to keep this gallery grounded in current XYTE product language."
            />
            <ResearchSummaryCard />
          </Stack>
        </Container>
      </div>
    </MantineProvider>
  );
}
```
