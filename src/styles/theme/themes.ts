// 1. import `extendTheme` function
import { extendTheme } from "@chakra-ui/react";
import { mode } from "@chakra-ui/theme-tools";

// 2. Add your color mode config

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

const Container = {
  baseStyle: {
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: 10,
  },
};

const Text = {
  baseStyle: {
    border: "1px solid rgba(0,0,0,0.2)",
    borderRadius: 10,
  },
};

const theme = extendTheme({
  components: {
    Container,
    Text: {
      baseStyle: {
        color: (props: any) => mode("red", "green")(props),
      },
    },
  },
  breakpoints,
  colors: {
    borderLight: "red",
    borderDark: "white",
  },
  config: {
    lightTheme: "light",
    darkTheme: "dark",
    useSystemColorMode: false,
  },
  styles: {
    global: (props) => ({
      body: {
        // fontFamily: `"Open sans", sans-serif`,
        color: mode("black", "whiteAlpha.900")(props),
        bg: mode("#f5f7fa", "#141214")(props),
      },
    }),
  },
});

// export type ThemeType = typeof theme;

// const darkTheme: ThemeType = {
//   primary: "rgba(220,120,95,1)",
//   text: "rgba(241,233,231,1)",
//   textSecondary: "rgba(241,233,231,0.6)",
//   background: "rgba(0,0,0,1)",
//   backgroundVariant: "rgba(28,26,26,1)",
//   border: "rgba(241,233,231,0.15)",
//   borderLight: "rgba(241,233,231,0.05)",
//   breakpoints,
// };

// export type ThemeType = typeof lightTheme;

// export const themes = {
//   light: lightTheme,
//   dark: darkTheme,
// };

export default theme;
