export default el => {
    const {
        loginEndpoint,
        configurationEndpoint,
        prototypeDetailsEndpoint,
        moduleUri,
        iframeUri,
        previewUri,
        fullscreenUri,
        defaultSitePackageKey
    } = el.dataset;

    return {
        loginEndpoint,
        configurationEndpoint,
        prototypeDetailsEndpoint,
        moduleUri,
        iframeUri,
        previewUri,
        fullscreenUri,
        defaultSitePackageKey
    };
};
