export default el => {
    const {
        loginEndpoint,
        renderPrototypesEndpoint,
        prototypesEndpoint,
        viewportPresetsEndpoint,
        sitePackagesEndpoint,
        moduleUri,
        iframeUri,
        previewUri,
        fullscreenUri,
        defaultSitePackageKey,
        defaultPrototypeName,
        uiSettings
    } = el.dataset;

    return {
        loginEndpoint,
        renderPrototypesEndpoint,
        prototypesEndpoint,
        viewportPresetsEndpoint,
        sitePackagesEndpoint,
        moduleUri,
        iframeUri,
        previewUri,
        fullscreenUri,
        defaultSitePackageKey,
        defaultPrototypeName: JSON.parse(defaultPrototypeName),
        uiSettings: JSON.parse(uiSettings)
    };
};
