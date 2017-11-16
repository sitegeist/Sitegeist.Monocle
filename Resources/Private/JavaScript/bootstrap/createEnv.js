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
        uiSettings,
        previewSettings
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
        uiSettings: JSON.parse(uiSettings),
        previewSettings: JSON.parse(previewSettings)
    };
};
