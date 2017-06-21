import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';
import pretty from 'pretty';

import {Frame,Code} from 'Components/index';
import Tabs from '@neos-project/react-ui-components/lib/Tabs';
import IconButton from '@neos-project/react-ui-components/lib/IconButton';

import styles from './style.css';
import tabTheme from './tabTheme.css';
import tabPanelTheme from './tabPanelTheme.css';

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
        visible: PropTypes.bool,
        ready: PropTypes.func,
    };

    state = {
        isRendered: false,
        renderedHtml: '',
        renderedCode: '',
        parsedCode: '',
        showSourceCode: false,
        isFetching: false,
    };

    render() {
        const {
            prototypeName,
            prototypes,
            resources,
            viewportWidth,
            iframeUri,
            visible
        } = this.props;

        const {
            isRendered,
            showSourceCode,
            renderedHtml,
            renderedCode,
            parsedCode,
            isFetching,
        } = this.state;

        if (!isRendered && visible && !isFetching) {
            this.fetch();
        }

        const currentPrototype = prototypes[prototypeName];
        const styleSheets = resources['styleSheets'] ? resources['styleSheets'] : null;
        const javaScripts = resources['javaScripts'] ? resources['javaScripts'] : null;

        const iFrameStyle = viewportWidth ? { maxWidth: '' + viewportWidth + 'px'} : {};
        return <div className={styles.prototype}>
            <h1 className={styles.headline}>
				{currentPrototype['title']}
				<small className={styles.subheadline}>prototype({prototypeName})</small>

				<div className={styles.handles}>
                    <IconButton icon="code" className={styles.handle} isActive={showSourceCode} onClick={() => this.toggleShowSourceCode()} />
					<IconButton icon="refresh" className={styles.handle} onClick={() => this.reload()} />
					<IconButton icon="external-link" className={styles.handle} onClick={() => this.openPreview()} />
				</div>
			</h1>
			<p className={styles.description}>{currentPrototype['description'] ? currentPrototype['description'] : 'no description found'}</p>

                { (isRendered) ? <Frame uri={iframeUri} style={iFrameStyle} className={styles.iframe} content={renderedHtml} styleSheets={styleSheets} javaScripts={javaScripts} />: '' }

            { (showSourceCode && isRendered) ?
                <Tabs className={styles.codeSection} theme={tabTheme}>
                    <Tabs.Panel title="HTML" icon="code" theme={tabPanelTheme}><Code content={pretty(renderedHtml)}  language="html" /></Tabs.Panel>
                    <Tabs.Panel title="Fusion" icon="terminal" theme={tabPanelTheme}><Code content={renderedCode}  language="vim" /></Tabs.Panel>
                    <Tabs.Panel title="Fusion AST" icon="terminal" theme={tabPanelTheme}><Code content={parsedCode}  language="yaml" /></Tabs.Panel>
                </Tabs>
            : '' }
        </div>;
    }

    fetch() {
        this.fetchPrototype();
    }

    componentDidUpdate(prevProps, prevState) {
        const {prototypeName} = this.props;

        if (prevProps.prototypeName !== prototypeName) {
            this.fetchPrototype();
        }

        if (this.state.isRendered !== prevState.isRendered) {
            this.props.ready();
        }
    }

    toggleShowSourceCode() {
        this.setState({showSourceCode: !this.state.showSourceCode});
    }

    fetchPrototype() {
        const {prototypeName, renderPrototypesEndpoint} = this.props;
        this.state.isFetching = true;
        fetch(renderPrototypesEndpoint + '?prototypeName=' + prototypeName , {
            method: 'GET',
            credentials: 'same-origin'
        })
        .then(response => response.json())
        .then(json => (
            this.setState({isRendered: true, renderedHtml: json.renderedHtml, renderedCode: json.renderedCode, parsedCode: json.parsedCode, isFetching: false})
        ));
    }

    reload() {
        this.setState({isRendered: false, renderedHtml: '', renderedCode: '', parsedCode: '' });
    }

	openPreview() {
		const {prototypeName, previewUri} = this.props;
		const previewUriWithParamaters = `${previewUri}?prototypeName=${prototypeName}`;

		window.open(previewUriWithParamaters, '_blank');
	}
}
