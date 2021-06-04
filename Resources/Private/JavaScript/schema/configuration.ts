import * as z from "zod";

const viewportPresetSchema = z.object({
    label: z.string(),
    width: z.number(),
    height: z.number()
});

export type ViewportPreset = z.infer<typeof viewportPresetSchema>;

const localePresetSchema = z.object({
    label: z.string(),
    fallback: z.array(z.string()).optional().or(z.null())
});

export type LocalePreset = z.infer<typeof localePresetSchema>;

const hotkeysSchema = z.object({
    openNavigation: z.string(),
    closeNavigation: z.string(),
    navigateUp: z.string(),
    navigateDown: z.string(),
    openPreviewInNewWindow: z.string()
});

export type Hotkeys = z.infer<typeof hotkeysSchema>;

const styleguideObjectSchema = z.object({
    title: z.string(),
    path: z.string(),
    description: z.string(),
    options: z.any().optional().or(z.null()),
    propSets: z.array(z.any()).optional().or(z.null()),
    useCases: z.object({}).catchall(z.string()).optional().or(z.null()),
    structure: z.object({
        position: z.number().optional(),
        match: z.string().optional(),
        label: z.string(),
        icon: z.string(),
        color: z.string()
    })
});

export type StyleguideObject = z.infer<typeof styleguideObjectSchema>;

export const configurationSchema = z.object({
    sitePackage: z.string(),
    ui: z.object({
        sitePackages: z.record(z.string()),
        viewportPresets: z.record(viewportPresetSchema.or(z.null())),
        localePresets: z.record(localePresetSchema).or(z.null()),
        hotkeys: hotkeysSchema,
        preview: z.object({
            fusionRootPath: z.string(),
            sourceQuerySelector: z.string(),
            defaultPrototypeName: z.string().optional().or(z.null())
        })
    }),
    styleguideObjects: z.record(styleguideObjectSchema).or(z.array(z.any()))
})

export type Configuration =
    Omit<z.infer<typeof configurationSchema>, 'styleguideObjects'>
    & { styleguideObjects: Record<string, z.infer<typeof styleguideObjectSchema>> };

export function getDefaultPrototypeNameFromConfiguration(configuration: Configuration): string {
    if (configuration.ui.preview.defaultPrototypeName) {
        return configuration.ui.preview.defaultPrototypeName;
    } else {
        const [prototypeName] = Object.keys(configuration.styleguideObjects);

        if (prototypeName) {
            return prototypeName;
        } else {
            console.debug(configuration);
            throw new Error(`Could not determine default prototypeName from remote configuration.`);
        }
    }
}
