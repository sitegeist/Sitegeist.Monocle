import brand from "@neos-project/brand";

const brandVars = Object.assign(
    {
        //
        // Spacings
        //
        "--goldenUnit": "40px",
        "--spacing": "16px",
        "--halfSpacing": "8px",

        //
        // Sizes
        //
        "--sidebarWidth": "320px",

        //
        // Font sizes
        //
        "--baseFontSize": "14px",
    },
    brand.generateCssVarsObject(brand.config, "brand")
);

const css = /** CSS */ `/**
 * !!! THIS FILE HAS BEEN GENERATED !!!
 * Do not modify it manually!
 */
:root {
    ${Object.entries(brandVars)
        .map(([key, value]) => `${key}: ${value};`)
        .join("\n    ")}
}
`;

process.stdout.write(css);
