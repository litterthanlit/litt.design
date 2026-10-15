import nextVitals from "eslint-config-next/core-web-vitals";

const config = [
  ...nextVitals,
  // The litt registry's tested copies (installed by `shadcn add`, never
  // edited here) are vendored code, linted upstream in litt.md.
  { ignores: ["components/litt/**", "lib/litt/**"] },
];

export default config;
