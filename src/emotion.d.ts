import "@emotion/react";
import { ThemeType } from "./styles/theme/themes";

declare module "@emotion/react" {
  export interface Theme extends ThemeType {}
}
