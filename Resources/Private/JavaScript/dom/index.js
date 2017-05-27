export const iframeDocument = () => {
    return document.getElementById('preview-frame').contentDocument;
};
export const iframeWindow = () => {
    return document.getElementById('preview-frame').contentWindow;
};

export const find = selector => {
    return iframeDocument().querySelector(selector);
};

export const findAll = selector => {
    return [].slice.call(iframeDocument().querySelectorAll(selector));
};
