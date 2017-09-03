import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import codeStyle from './codeStyle';

export default class Code extends Component {
    static propTypes = {
        content: PropTypes.string,
        language: PropTypes.string
    };

    render() {
        const {content, language} = this.props;
        return <SyntaxHighlighter language={language} style={codeStyle}>{content}</SyntaxHighlighter>;
    }
}
