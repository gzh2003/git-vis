import { extendTheme } from "@chakra-ui/react";
import { createBreakpoints } from "@chakra-ui/theme-tools";

const breakpoints = createBreakpoints({
  sm: "320px",
  md: "768px",
  lg: "1100px",
  xl: "1300px",
  "2xl": "1600px",
});

const styles = {
  global: {
    body: {
      bg: "#f4f4f5",
    },
  },
};

const theme = extendTheme({ breakpoints, styles });

export default theme;
