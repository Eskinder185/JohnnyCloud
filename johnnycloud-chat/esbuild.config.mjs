import esbuild from "esbuild";

await esbuild.build({
  entryPoints: ["src/handler.mjs"],
  outfile: "dist/index.mjs",
  bundle: true,
  platform: "node",
  target: "node18",
  format: "esm",
  sourcemap: true,
  minify: false,
  banner: {
    js: 'import { createRequire } from "module"; const require = createRequire(import.meta.url);'
  }
});
