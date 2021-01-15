export function iframe(): null | HTMLIFrameElement {
    const iframe = document.getElementById('preview-frame');

    if (iframe) {
        return iframe as HTMLIFrameElement;
    }

    return null;
}

export function iframeDocument(): null | Document {
    return iframe()?.contentDocument || null;
}

export function iframeWindow(): null | Window {
    return iframe()?.contentWindow || null;
}

export function find(selector: string): null | HTMLElement {
    const element = iframeDocument()?.querySelector(selector);

    if (element) {
        return element as HTMLElement;
    }

    return null;
}

export function findAll(selector: string): HTMLElement[] {
    return Array.from(iframeDocument()?.querySelectorAll(selector) || []);
}
