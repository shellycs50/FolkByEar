import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx", "./packages/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
      colors: {
        custom: {
          darkRed: "#6F1D1B",
          sandyBrown: "#BB9457",
          darkBrown: "#432818",
          amberBrown: "#99582A",
          paleYellow: "#FFE6A7",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;
