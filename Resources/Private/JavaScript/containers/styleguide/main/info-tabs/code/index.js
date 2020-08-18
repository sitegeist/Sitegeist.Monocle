import React, {Component} from 'react';
import PropTypes from 'prop-types';
import SyntaxHighlighter from 'react-syntax-highlighter';
import codeStyle from './codeStyle';

export default class Code extends Component {
    static propTypes = {
        content: PropTypes.string,
        language: PropTypes.string,
        style: PropTypes.array
    };

    render() {
        const {content, language, style} = this.props;
        return <SyntaxHighlighter customStyle={style} language={language} style={codeStyle}>{content}</SyntaxHighlighter>;
    }
}
