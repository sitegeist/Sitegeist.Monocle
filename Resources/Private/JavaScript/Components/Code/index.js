import React, {Component, PropTypes} from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter';
import { darkula } from 'react-syntax-highlighter/dist/styles';


export default class Code extends Component {
    static propTypes = {
        content: PropTypes.string,
        language: PropTypes.string
    };

    render() {
        const {content, language} = this.props;
        return <SyntaxHighlighter language={language} style={darkula}>{content}</SyntaxHighlighter>;
    }
}
