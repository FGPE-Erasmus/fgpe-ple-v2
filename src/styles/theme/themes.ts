export const breakpoints: string[] & {
  sm?: string;
  md?: string;
  lg?: string;
  xl?: string;
  xxl?: string;
} = ["360px", "768px", "1024px", "1280px", "1600px"];

breakpoints.sm = breakpoints[0];
breakpoints.md = breakpoints[1];
breakpoints.lg = breakpoints[2];
breakpoints.xl = breakpoints[3];
breakpoints.xxl = breakpoints[4];

const lightTheme = {
  primary: "#009dda",
  text: "rgba(58,52,51,1)",
  textSecondary: "rgba(58,52,51,0.7)",
  background: "#f5f7fa",
  backgroundVariant: "#ffffff",
  border: "rgba(58,52,51,0.12)",
  borderLight: "rgba(58,52,51,0.05)",
  breakpoints,
};

const darkTheme: ThemeType = {
  primary: "rgba(220,120,95,1)",
  text: "rgba(241,233,231,1)",
  textSecondary: "rgba(241,233,231,0.6)",
  background: "rgba(0,0,0,1)",
  backgroundVariant: "rgba(28,26,26,1)",
  border: "rgba(241,233,231,0.15)",
  borderLight: "rgba(241,233,231,0.05)",
  breakpoints,
};

export type ThemeType = typeof lightTheme;

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};
