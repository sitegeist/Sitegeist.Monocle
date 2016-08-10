import React, {Component, PropTypes} from 'react';

export default class Frame extends Component {
    static propTypes = {
        style: PropTypes.string,
        className: PropTypes.string,
        content: PropTypes.string,
        styleSheets: PropTypes.array,
        javaScripts: PropTypes.array
    };

    render() {
        const {className, style} = this.props;
        return (<iframe ref='iframe' className={className} style={style}/>);
    }

    componentDidMount () {
        const {iframe} = this.refs;
        const frameDocument = iframe.contentDocument || iframe.contentWindow.document;

        if (frameDocument && frameDocument.readyState === 'complete') {
            this.initializeFrame();
        } else {
            iframe.addEventListener('load', () => {
                console.log('load' );
                const frameDocument = iframe.contentDocument || iframe.contentWindow.document;
                if (frameDocument && frameDocument.readyState === 'complete') {
                    this.initializeFrame();
                } else {
                    frameDocument.addEventListener('DOMContentLoaded', () => this.initializeFrame());
                }
            });
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {content, styleSheets, javaScripts} = this.props;

        if (prevProps.content !== content) {
            this.renderFrameContents();
        }

        if (prevProps.styleSheets.join('') !== styleSheets.join('')) {
            this.renderFrameStyleSheets();
        }

        if (prevProps.javaScripts.join('') !== javaScripts.join('')) {
            this.renderFrameJavaScripts();
        }
    }

    initializeFrame() {
        this._isMounted = true;
        this.renderFrame();
    }

    renderFrame() {
        if (!this._isMounted) {
            return;
        }
        this.renderFrameStyleSheets();
        this.renderFrameJavaScripts()
        this.renderFrameContents();
    }

    renderFrameStyleSheets() {
        const {iframe} = this.refs;
        const {styleSheets} = this.props;

        const frameDocument = iframe.contentDocument || iframe.contentWindow.document;
        const styles = [].slice.call(frameDocument.head.querySelectorAll('link'));
        styles.map(link => (link.parentNode.removeChild(link)));


        if (styleSheets && styleSheets.length) {
            styleSheets.map( styleSheet => {
                const link = document.createElement('link');
                link.setAttribute('rel', 'stylesheet');
                link.setAttribute('type', 'text/css');
                link.setAttribute('href', styleSheet);
                frameDocument.head.appendChild(link);
            });
        }
    }

    renderFrameJavaScripts() {
        const {iframe} = this.refs;
        const {javaScripts} = this.props;

        const frameDocument = iframe.contentDocument || iframe.contentWindow.document;
        const scripts = [].slice.call(frameDocument.head.querySelectorAll('script'));
        scripts.map(script => (script.parentNode.removeChild(script)));

        if (javaScripts && javaScripts.length) {
            javaScripts.map( javaScript => {
                const link = document.createElement('script');
                link.setAttribute('type', 'text/javascript');
                link.setAttribute('src', javaScript);
                frameDocument.head.appendChild(link);
            });
        }
    }

    renderFrameContents() {
        const {iframe} = this.refs;
        const {content} = this.props;

        const frameDocument = iframe.contentDocument || iframe.contentWindow.document;
        frameDocument.body.innerHTML = content;
    }
}
