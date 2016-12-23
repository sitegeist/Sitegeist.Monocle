import React, {Component, PropTypes} from 'react';

export default class Frame extends Component {
    static propTypes = {
        style: PropTypes.object,
        className: PropTypes.string,
        content: PropTypes.string,
        uri: PropTypes.string.isRequired
    };

    state = {
        style: {
            height: null
        }
    };

    render() {
        const {className, style, uri} = this.props;
        const localStyle = this.state.style;
        const mergedStyles = Object.assign({},style,localStyle);
        return (
			<iframe
				ref="iframe"
				src={uri}
				className={className}
				style={mergedStyles}
				scrolling="no"
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
        this.renderFrameContents();
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
