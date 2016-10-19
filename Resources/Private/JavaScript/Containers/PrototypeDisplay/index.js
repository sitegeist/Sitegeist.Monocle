import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';
import pretty from 'pretty';

import {Frame,Code} from 'Components/index';
import Tabs from '@neos-project/react-ui-components/lib/Tabs';
import IconButton from '@neos-project/react-ui-components/lib/IconButton';

import styles from './style.css';

@connect(state => {
    return {
        prototypes: state.styleguide.prototypes,
        resources: state.styleguide.resources,
        renderPrototypesEndpoint: state.styleguide.renderPrototypesEndpoint,
        iframeUri: state.styleguide.iframeUri,
        previewUri: state.styleguide.previewUri,
        viewportWidth: state.viewportOptions.width
    };
})
export default class PrototypeDisplay extends Component {
    static propTypes = {
        prototypeName: PropTypes.string.isRequired,
        prototypes: PropTypes.object.isRequired,
        resources: PropTypes.object.isRequired,
        renderPrototypesEndpoint: PropTypes.string,
        viewportWidth: PropTypes.number,
    };

    state = {
        isRendered: false,
        renderedHtml: '',
        renderedCode: '',
        parsedCode: '',
        showSourceCode: false,
    };

    render() {
        const {
            prototypeName,
            prototypes,
            resources,
            viewportWidth,
            iframeUri
        } = this.props;


        const currentPrototype = prototypes[prototypeName];
        const styleSheets = resources['styleSheets'] ? resources['styleSheets'] : null;
        const javaScripts= resources['javaScripts'] ? resources['javaScripts'] : null;

        const iFrameStyle = viewportWidth ? { maxWidth: '' + viewportWidth + 'px'} : {};

        return <div className={styles.prototype}>
            <h1 className={styles.headline}>
				{currentPrototype['title']}
				<small className={styles.subheadline}>prototype({prototypeName})</small>

				<div className={styles.handles}>
                    <IconButton icon="code" className={styles.handle} isActive={this.state.showSourceCode} onClick={() => this.toggleShowSourceCode()} />
					<IconButton icon="refresh" className={styles.handle} onClick={() => this.fetchPrototype()} />
					<IconButton icon="external-link" className={styles.handle} onClick={() => this.openPreview()} />
				</div>
			</h1>
			<p className={styles.description}>{currentPrototype['description'] ? currentPrototype['description'] : 'no description found'}</p>

            { (this.state.isRendered) ? <Frame uri={iframeUri} style={iFrameStyle} className={styles.iframe} content={this.state.renderedHtml} styleSheets={styleSheets} javaScripts={javaScripts} />: '' }

            { (this.state.showSourceCode && this.state.isRendered) ?
                <Tabs>
                    <Tabs.Panel title="HTML" icon="code"><div className={styles.codePanel}><Code content={pretty(this.state.renderedHtml)}  language="html" /></div></Tabs.Panel>
                    <Tabs.Panel title="Fusion" icon="terminal"><div className={styles.codePanel}><Code content={this.state.renderedCode}  language="vim" /></div></Tabs.Panel>
                    <Tabs.Panel title="Fusion AST" icon="terminal"><div className={styles.codePanel}><Code content={this.state.parsedCode}  language="yaml" /></div></Tabs.Panel>
                </Tabs>
            : '' }
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

    toggleShowSourceCode() {
        this.setState({showSourceCode: !this.state.showSourceCode});
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
