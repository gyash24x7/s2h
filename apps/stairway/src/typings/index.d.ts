import type { DefaultMantineColor, Tuple } from '@mantine/core';

type ExtendedCustomColors =
    "primary"
    | "success"
    | "danger"
    | "warning"
    | "alt"
    | "info"
    | DefaultMantineColor;

declare module '@mantine/core' {
    export interface MantineThemeColorsOverride {
        colors: Record<ExtendedCustomColors, Tuple<string, 10>>;
    }
}