export default el => {
    const {
        loginEndpoint,
        renderPrototypesEndpoint,
        prototypesEndpoint,
        iframeUri,
        previewUri,
        fullscreenUri
    } = el.dataset;

    return {
        loginEndpoint,
        renderPrototypesEndpoint,
        prototypesEndpoint,
        iframeUri,
        previewUri,
        fullscreenUri
    };
};
