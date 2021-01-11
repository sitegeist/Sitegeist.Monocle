export function createEnv(el: HTMLElement) {
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

    if (loginEndpoint === undefined) {
        throw new Error(`[Environment]: loginEndpoint must be set!`);
    }

    if (configurationEndpoint === undefined) {
        throw new Error(`[Environment]: configurationEndpoint must be set!`);
    }

    if (prototypeDetailsEndpoint === undefined) {
        throw new Error(`[Environment]: prototypeDetailsEndpoint must be set!`);
    }

    if (moduleUri === undefined) {
        throw new Error(`[Environment]: moduleUri must be set!`);
    }

    if (iframeUri === undefined) {
        throw new Error(`[Environment]: iframeUri must be set!`);
    }

    if (previewUri === undefined) {
        throw new Error(`[Environment]: previewUri must be set!`);
    }

    if (fullscreenUri === undefined) {
        throw new Error(`[Environment]: fullscreenUri must be set!`);
    }

    if (defaultSitePackageKey === undefined) {
        throw new Error(`[Environment]: defaultSitePackageKey must be set!`);
    }

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

export type Environment = ReturnType<typeof createEnv>;
