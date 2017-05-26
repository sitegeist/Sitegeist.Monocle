export default el => {
    const {
        renderPrototypesEndpoint,
        iframeUri,
        previewUri,
        fullscreenUri
    } = el.dataset;

    return {
        renderPrototypesEndpoint,
        iframeUri,
        previewUri,
        fullscreenUri
    };
};
