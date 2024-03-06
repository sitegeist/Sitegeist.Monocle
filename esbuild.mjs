import * as esbuild from "esbuild";

const isWatch = process.argv.includes("--watch");

/** @type {import("esbuild").BuildOptions} */
const options = {
    entryPoints: {
        App: "./Resources/Private/JavaScript/index.tsx",
        Grid: "./Resources/Private/JavaScript/layoutGrid.tsx",
    },
    external: ["@neos-project/utils-helpers"],
    sourcemap: true,
    minify: true,
    logLevel: "info",
    target: "es2020",
    color: true,
    bundle: true,
    legalComments: "external",

    outdir: "./Resources/Public/Build",
};

if (isWatch) {
    const context = await esbuild.context(options);
    context.watch();
} else {
    await esbuild.build(options);
}
