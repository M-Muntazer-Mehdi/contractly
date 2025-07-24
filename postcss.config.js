import tailwindcss from "@tailwindcss/postcss7-compat";
import autoprefixer from "autoprefixer";
import postcssImport from "postcss-import";
import postcssNesting from "postcss-nesting";

export default {
  plugins: [
    postcssImport,
    postcssNesting(), // Add postcssNesting as a plugin function
    tailwindcss,
    autoprefixer,
  ],
};
