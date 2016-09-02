import React, {Component, PropTypes} from 'react';

export default class Frame extends Component {
    static propTypes = {
        style: PropTypes.string,
        className: PropTypes.string,
        content: PropTypes.string,
        styleSheets: PropTypes.array,
        javaScripts: PropTypes.array
    };

    state = {
        style: {
            height: null
        }
    }

    render() {
        const {className, style} = this.props;
        const localStyle = this.state.style;
        const mergedStyles = Object.assign({},style,localStyle);
        return (
			<iframe
				ref="iframe"
				src="/sitegeist.monocle/preview/iframe"
				className={className}
				style={mergedStyles}
				onLoad={() => this.onIframeLoad()}
				/>
		);
    }

	onIframeLoad() {
		const {iframe} = this.refs;
        const frameWindow = iframe.contentWindow || iframe;
        const frameDocument = iframe.contentDocument || iframe.contentWindow.document;

		if (frameDocument && frameDocument.readyState === 'complete') {
			this.initializeFrame();
		} else {
			frameDocument.addEventListener('DOMContentLoaded', () => this.initializeFrame());
		}

		if (frameDocument.fonts) {
            frameDocument.fonts.onloadingdone = () => (this.resizeFrame());
        }

        frameWindow.addEventListener('resize', () => (this.resizeFrame()));
	}

    componentDidUpdate(prevProps, prevState) {
        const {content} = this.props;

        if (prevProps.content !== content) {
            this.renderFrameContents();
        }
    }

    initializeFrame() {
        this._isMounted = true;
        this.renderFrame();
        setTimeout(this.resizeFrame, 5);
    }

    resizeFrame() {
        if (!this._isMounted) {
            return;
        }

        const {iframe} = this.refs;
        const frameDocument = iframe.contentDocument || iframe.contentWindow.document;

        const container = frameDocument.getElementById('iframe_content_container');
        const height = container.clientHeight;

        this.setState(Object.assign({}, this.state, {style: {height: '' + height + 'px'}}));
		frameDocument.body.style.height = `${height}px`;
    }

    renderFrame() {
        if (!this._isMounted) {
            return;
        }
        //this.renderFrameStyleSheets();
        //this.renderFrameJavaScripts()
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

        const container = frameDocument.createElement('div');
        container.setAttribute('id', 'iframe_content_container');
        container.innerHTML = content;

        frameDocument.body.appendChild(container);
		this.resizeFrame();
    }
}
