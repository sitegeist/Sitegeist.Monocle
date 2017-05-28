export default el => {
    const {
        loginEndpoint,
        renderPrototypesEndpoint,
        prototypesEndpoint,
        viewportPresetsEndpoint,
        sitePackagesEndpoint,
        iframeUri,
        previewUri,
        fullscreenUri,
        defaultSitePackageKey
    } = el.dataset;

    return {
        loginEndpoint,
        renderPrototypesEndpoint,
        prototypesEndpoint,
        viewportPresetsEndpoint,
        sitePackagesEndpoint,
        iframeUri,
        previewUri,
        fullscreenUri,
        defaultSitePackageKey
    };
};
