export const iframe = () => {
    return document.getElementById('preview-frame');
};

export const iframeDocument = () => {
    const iframeElement = iframe();

    if (iframeElement) {
        return iframeElement.contentDocument;
    }

    return null;
};
export const iframeWindow = () => {
    const iframeElement = iframe();

    if (iframeElement) {
        return iframeElement.contentDocument;
    }

    return null;
};

export const find = selector => {
    const iframeElementDocument = iframeDocument();

    if (iframeElementDocument) {
        return iframeElementDocument.querySelector(selector);
    }

    return null;
};

export const findAll = selector => {
    const iframeElementDocument = iframeDocument();

    if (iframeElementDocument) {
        return [].slice.call(iframeDocument().querySelectorAll(selector));
    }

    return null;
};
