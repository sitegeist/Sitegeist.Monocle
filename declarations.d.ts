declare module "*.css" {
    const value: { [key: string]: string };
    export default value;
}

declare module "@neos-project/react-ui-components/lib-esm/SelectBox" {
    const SelectBox: React.ComponentType<{
        id: string
        value: any
        options: {
            label: string
            value: any
        }[]
        onValueChange: (value: any) => void
    }>;

    export default SelectBox;
}
