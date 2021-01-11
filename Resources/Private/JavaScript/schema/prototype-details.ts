import * as z from "zod";

interface AnatomyItem {
    prototypeName: string
    children: AnatomyItem[]
}

const anatomyItemSchema: z.Schema<AnatomyItem> = z.lazy(() => z.object({
    prototypeName: z.string(),
    children: z.array(anatomyItemSchema)
}));

export const prototypeDetailsSchema = z.object({
    prototypeName: z.string(),
    renderedCode: z.string(),
    parsedCode: z.string(),
    fusionAst: z.record(z.any()),
    anatomy: z.array(anatomyItemSchema)
});

export type PrototypeDetails = z.infer<typeof prototypeDetailsSchema>;
