import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';

import {redux} from 'Redux/index';

import styles from './style.css';

@connect(state => {
    return {
        prototypes: state.styleguide.prototypes,
        showRenderedElements: state.displayOptions.renderedElements,
        renderPrototypesEndpoint: state.styleguide.renderPrototypesEndpoint,
        showSourceCode: state.displayOptions.sourceCode,
        showDescription: state.displayOptions.description,
    };
})
export default class PrototypeDisplay extends Component {
    static propTypes = {
        prototype: PropTypes.string.isRequired,
        prototypes: PropTypes.object.isRequired,
        renderPrototypesEndpoint: PropTypes.string,
        showRenderedElements: PropTypes.bool.isRequired,
        showSourceCode: PropTypes.bool.isRequired,
        showDescription: PropTypes.bool.isRequired,
    };


    state = {
        isRendered: false,
        renderedHtml: '<div class="foo">bar</div>'
    };


    render() {

        const {
            prototype,
            prototypes,
            renderPrototypesEndpoint,
            showRenderedElements,
            showSourceCode,
            showDescription
        } = this.props;

        // trigger rendering of the prototype
        if (this.state.isRendered == false) {
            // set isRendered to true
            this.setState({isRendered: true, renderedHtml: ''});

            fetch(renderPrototypesEndpoint + '?prototypeName=' + prototype , {
                method: 'GET'
            })
            .then(response => response.text())
            .then(html => (this.setState({isRendered: true, renderedHtml:html})));
        }

        const currentPrototype = (prototypes[prototype]) ? prototypes[prototype] : null;
        return <div className={styles.prototype}>
            <h1 className={styles.headline}>{currentPrototype['title']} - prototype({prototype})</h1>
            { (showRenderedElements && this.state.isRendered) ? <div dangerouslySetInnerHTML={{__html: this.state.renderedHtml}} /> : '' }
            { (showSourceCode && this.state.isRendered) ? <pre><code dangerouslySetInnerHTML={{__html: '<![CDATA[' + this.state.renderedHtml + ']]>'}} /></pre> : '' }
            { showDescription ? <p>{currentPrototype['description'] ? currentPrototype['description'] : 'no description found'}</p> : '' }
        </div>;

    }
}
