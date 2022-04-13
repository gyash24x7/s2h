import type { MantineThemeOverride } from "@mantine/core";

export const lightTheme: MantineThemeOverride = {
    colorScheme: "light",
    primaryColor: "primary",
    fontFamily: "Montserrat, sans-serif",
    fontSizes: {
        xs: 10,
        sm: 12,
        md: 14,
        lg: 16,
        xl: 20
    },
    colors: {
        primary: [
            "#D3E6FE",
            "#A8CEFE",
            "#84BAFF",
            "#66A9FF",
            "#4C9AFF",
            "#2684FF",
            "#0065FF",
            "#0052CC",
            "#0747A6",
            "#053C8D"
        ],
        danger: [
            "#FFD3C9",
            "#FFC1B2",
            "#FFB29F",
            "#FF9F87",
            "#FF8F73",
            "#FF7452",
            "#FF5630",
            "#DE350B",
            "#BF2600",
            "#A22000",
        ],
        success: [
            "#004930",
            "#003E28",
            "#E3FCEF",
            "#ABF5D1",
            "#79F2C0",
            "#57D9A3",
            "#36B37E",
            "#00875A",
            "#006644",
            "#005639"
        ],
        warning: [
            "#FFFAE6",
            "#FFF0B3",
            "#FFE380",
            "#FFC400",
            "#FFAB00",
            "#FF991F",
            "#FF8B00",
            "#D87600",
            "#B76400",
            "#9B5500"
        ],
        info: [
            "#E6FCFF",
            "#B3F5FF",
            "#79E2F2",
            "#00C7E6",
            "#00B8D9",
            "#00A3BF",
            "#008DA6",
            "#00778D",
            "#006577",
            "#005565"
        ],
        alt: [
            "#EAE6FF",
            "#C0B6F2",
            "#998DD9",
            "#8777D9",
            "#6554C0",
            "#5243AA",
            "#403294",
            "#362A7D",
            "#2D236A",
            "#261D5A"
        ],
    }
}