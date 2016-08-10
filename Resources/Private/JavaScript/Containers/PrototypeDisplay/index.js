import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {redux} from 'Redux/index';

import {Frame} from 'Components/index';

import styles from './style.css';

@connect(state => {
    return {
        prototypes: state.styleguide.prototypes,
        resources: state.styleguide.resources,
        showRenderedElements: state.displayOptions.renderedElements,
        renderPrototypesEndpoint: state.styleguide.renderPrototypesEndpoint,
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
        renderedHtml: ''
    };

    render() {

        const {
            prototypeName,
            prototypes,
            resources,
            showRenderedElements,
            showSourceCode,
            showDescription,
            viewportWidth
        } = this.props;


        const currentPrototype = (prototypes[prototypeName]) ? prototypes[prototypeName] : null;
        const styleSheets = resources['styleSheets'] ? resources['styleSheets'] : null;
        const javaScripts= resources['javaScripts'] ? resources['javaScripts'] : null;

        const iFrameStyle = viewportWidth ? { maxWidth: '' + viewportWidth + 'px'} : {};

        return <div className={styles.prototype}>
            <h1 className={styles.headline}>{currentPrototype['title']} - prototype({prototypeName})</h1>
            { (showRenderedElements && this.state.isRendered) ? <Frame style={iFrameStyle} className={styles.iframe} content={this.state.renderedHtml} styleSheets={styleSheets} javaScripts={javaScripts} />: '' }
            { (showSourceCode && this.state.isRendered) ? <pre><code dangerouslySetInnerHTML={{__html: '<![CDATA[' + this.state.renderedHtml + ']]>'}} /></pre> : '' }
            { showDescription ? <p>{currentPrototype['description'] ? currentPrototype['description'] : 'no description found'}</p> : '' }
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

        this.setState({isRendered: false, renderedHtml: ''});

        fetch(renderPrototypesEndpoint + '?prototypeName=' + prototypeName , {
            method: 'GET'
        })
            .then(response => response.json())
            .then(json => (
                this.setState({isRendered: true, renderedHtml: json.renderedHtml})
            ));
    }
}
