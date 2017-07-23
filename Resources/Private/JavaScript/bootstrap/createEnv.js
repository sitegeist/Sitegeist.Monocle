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
        uiSettings: JSON.parse(uiSettings)
    };
};
