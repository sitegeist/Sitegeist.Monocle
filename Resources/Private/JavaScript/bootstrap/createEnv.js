export default el => {
    const {
        loginEndpoint,
        configurationEndpoint,
        prototypeDetailsEndpoint,
        renderPrototypesEndpoint,
        prototypesEndpoint,
        viewportPresetsEndpoint,
        localePresetsEndpoint,
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
        configurationEndpoint,
        prototypeDetailsEndpoint,
        renderPrototypesEndpoint,
        prototypesEndpoint,
        viewportPresetsEndpoint,
        localePresetsEndpoint,
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
