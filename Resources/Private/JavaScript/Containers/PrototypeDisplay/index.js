import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';
import pretty from 'pretty';

import {Frame,Code,IconButton} from 'Components/index';

import styles from './style.css';

@connect(state => {
    return {
        prototypes: state.styleguide.prototypes,
        resources: state.styleguide.resources,
        showRenderedElements: state.displayOptions.renderedElements,
        renderPrototypesEndpoint: state.styleguide.renderPrototypesEndpoint,
        iframeUri: state.styleguide.iframeUri,
        previewUri: state.styleguide.previewUri,
        showSourceCode: state.displayOptions.sourceCode,
        showDescription: state.displayOptions.description,
        viewportWidth: state.viewportOptions.width
    };
})
export default class PrototypeDisplay extends Component {
    static propTypes = {
        prototypeName: PropTypes.string.isRequired,
        prototypes: PropTypes.object.isRequired,
        resources: PropTypes.object.isRequired,
        renderPrototypesEndpoint: PropTypes.string,
        showRenderedElements: PropTypes.bool.isRequired,
        showSourceCode: PropTypes.bool.isRequired,
        showDescription: PropTypes.bool.isRequired,
        viewportWidth: PropTypes.number,
    };

    state = {
        isRendered: false,
        renderedHtml: '',
        renderedCode: '',
        parsedCode: ''
    };

    render() {
        const {
            prototypeName,
            prototypes,
            resources,
            showRenderedElements,
            showSourceCode,
            showDescription,
            viewportWidth,
			iframeUri
        } = this.props;


        const currentPrototype = (prototypes[prototypeName]) ? prototypes[prototypeName] : null;
        const styleSheets = resources['styleSheets'] ? resources['styleSheets'] : null;
        const javaScripts= resources['javaScripts'] ? resources['javaScripts'] : null;

        const iFrameStyle = viewportWidth ? { maxWidth: '' + viewportWidth + 'px'} : {};

        return <div className={styles.prototype}>
            <h1 className={styles.headline}>
				{currentPrototype['title']}
				<small className={styles.subheadline}>prototype({prototypeName})</small>

				<div className={styles.handles}>
					<IconButton type="refresh" className={styles.handle} onClick={() => this.fetchPrototype()} />
					<IconButton type="external-link" className={styles.handle} onClick={() => this.openPreview()} />
				</div>
			</h1>
			{ showDescription ? <p>{currentPrototype['description'] ? currentPrototype['description'] : 'no description found'}</p> : '' }
            { (showRenderedElements && this.state.isRendered) ? <Frame uri={iframeUri} style={iFrameStyle} className={styles.iframe} content={this.state.renderedHtml} styleSheets={styleSheets} javaScripts={javaScripts} />: '' }
            { (showSourceCode && this.state.isRendered) ? <div><h3>Html</h3><Code content={pretty(this.state.renderedHtml)}  language="html" /></div> : '' }
            { (showSourceCode && this.state.isRendered) ?  <div><h3>Fusion</h3><Code content={this.state.renderedCode}  language="vim" /></div> : '' }
            { (showSourceCode && this.state.isRendered) ?  <div><h3>AST</h3><Code content={this.state.parsedCode}  language="yaml" /></div> : '' }
        </div>;
    }

    componentWillMount() {
        if (this.state.isRendered == false) {
            this.fetchPrototype();
        }
    }

    componentDidUpdate(prevProps, prevState) {
        const {prototypeName} = this.props;

        if (prevProps.prototypeName !== prototypeName) {
            this.fetchPrototype();
        }
    }

    fetchPrototype() {
        const {prototypeName, renderPrototypesEndpoint} = this.props;

        this.setState({isRendered: false, renderedHtml: '', renderedCode: '', parsedCode: '' });

        fetch(renderPrototypesEndpoint + '?prototypeName=' + prototypeName , {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json => (
            this.setState({isRendered: true, renderedHtml: json.renderedHtml, renderedCode: json.renderedCode, parsedCode: json.parsedCode})
        ));
    }

	openPreview() {
		const {prototypeName, previewUri} = this.props;
		const previewUriWithParamaters = `${previewUri}?prototypeName=${prototypeName}`;

		window.open(previewUriWithParamaters, '_blank');
	}
}
