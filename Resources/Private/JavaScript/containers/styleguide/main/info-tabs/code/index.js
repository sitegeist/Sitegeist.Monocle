import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light';
import codeStyle from './codeStyle';

import vim from 'react-syntax-highlighter/dist/cjs/languages/hljs/vim';
import xml from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml';
import yaml from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml';

SyntaxHighlighter.registerLanguage('vim', vim);
SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('yaml', yaml);

export default class Code extends Component {
    static propTypes = {
        content: PropTypes.string,
        language: PropTypes.string,
        style: PropTypes.object
    };

    render() {
        const {content, language, style} = this.props;
        return <SyntaxHighlighter customStyle={style} language={language} style={codeStyle}>{content}</SyntaxHighlighter>;
    }
}
