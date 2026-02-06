# Shared Components

## `src/components/cards/GlassCard.tsx`
Reusable morphism surface card used by all widgets.

```tsx
import { Paper, PaperProps, createStyles } from '@mantine/core';
import React from 'react';

interface GlassCardProps extends PaperProps {
  children: React.ReactNode;
}

export function GlassCard({ children, className, ...paperProps }: GlassCardProps) {
  const { classes, cx } = useStyles();

  return (
    <Paper
      className={cx(classes.card, className)}
      radius="xl"
      p="lg"
      {...paperProps}
    >
      {children}
    </Paper>
  );
}

const useStyles = createStyles((theme) => ({
  card: {
    position: 'relative',
    overflow: 'hidden',
    background: (theme.other as { cardBackground?: string }).cardBackground ||
      theme.fn.rgba(theme.white, 0.85),
    border: `1px solid ${(theme.other as { cardBorder?: string }).cardBorder || theme.colors.gray[2]}`,
    boxShadow:
      '0px 24px 36px rgba(13, 14, 48, 0.05), 0px 6px 14px rgba(38, 50, 56, 0.09)',
    backdropFilter: 'blur(16px)',
    '&::after': {
      content: '""',
      position: 'absolute',
      inset: 0,
      borderRadius: theme.radius.xl,
      pointerEvents: 'none',
      background:
        'linear-gradient(145deg, rgba(255,255,255,0.25), rgba(255,255,255,0.02) 42%, rgba(255,255,255,0.08) 100%)',
    },
  },
}));
```

## `src/components/ThemeToolbar.tsx`
Global theme/data-level controls.

```tsx
import {
  ActionIcon,
  Badge,
  Group,
  Paper,
  SegmentedControl,
  Select,
  Stack,
  Text,
  Tooltip,
  createStyles,
} from '@mantine/core';
import {
  IconAdjustments,
  IconDeviceAnalytics,
  IconFlask,
} from '@tabler/icons-react';

import { DataLevel } from '../data/mockData';
import { XyteThemePreset } from '../theme/presets';

interface ThemeToolbarProps {
  themeId: string;
  onThemeChange: (value: string) => void;
  presets: XyteThemePreset[];
  dataLevel: DataLevel;
  onDataLevelChange: (value: DataLevel) => void;
}

export function ThemeToolbar({
  themeId,
  onThemeChange,
  presets,
  dataLevel,
  onDataLevelChange,
}: ThemeToolbarProps) {
  const { classes } = useStyles();

  const selectedPreset = presets.find((preset) => preset.id === themeId);

  return (
    <Paper className={classes.toolbar} p="md" radius="xl">
      <Group position="apart" align="flex-start">
        <Stack spacing={6}>
          <Group spacing="xs">
            <IconDeviceAnalytics size={19} stroke={1.7} />
            <Text fw={600} size="sm">
              XYTE Elements Playground
            </Text>
            <Badge color="blue_accent" variant="light">
              Mantine
            </Badge>
          </Group>

          <Text size="xs" c="gray.6" maw={700}>
            {selectedPreset?.description}
          </Text>
        </Stack>

        <Group spacing="sm" align="center">
          <Select
            w={210}
            icon={<IconFlask size={16} />}
            value={themeId}
            onChange={(value) => {
              if (value) {
                onThemeChange(value);
              }
            }}
            data={presets.map((preset) => ({
              value: preset.id,
              label: preset.name,
            }))}
          />

          <SegmentedControl
            value={dataLevel}
            onChange={(value) => onDataLevelChange(value as DataLevel)}
            data={[
              { label: 'Local', value: 'local' },
              { label: 'Global', value: 'global' },
            ]}
          />

          <Tooltip label="Future controls: spacing scale, animation intensity, icon packs">
            <ActionIcon variant="light" color="blue_accent" size="lg">
              <IconAdjustments size={18} />
            </ActionIcon>
          </Tooltip>
        </Group>
      </Group>
    </Paper>
  );
}

const useStyles = createStyles((theme) => ({
  toolbar: {
    background: theme.fn.rgba(
      (theme.other as { cardBackground?: string }).cardBackground || theme.white,
      0.95
    ),
    border: `1px solid ${(theme.other as { cardBorder?: string }).cardBorder || theme.colors.gray[2]}`,
    boxShadow:
      '0px 10px 18px rgba(38, 50, 56, 0.09), inset 0px 1px 0px rgba(255,255,255,0.35)',
    backdropFilter: 'blur(14px)',
  },
}));
```

## `src/components/SectionTitle.tsx`
Section heading utility component.

```tsx
import { Group, Text } from '@mantine/core';
import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle: string;
  rightSlot?: React.ReactNode;
}

export function SectionTitle({ title, subtitle, rightSlot }: SectionTitleProps) {
  return (
    <Group position="apart" align="flex-end" spacing="sm">
      <div>
        <Text size="xl" fw={600} c="blue_gray.9">
          {title}
        </Text>
        <Text size="sm" c="gray.6">
          {subtitle}
        </Text>
      </div>
      {rightSlot}
    </Group>
  );
}
```
