import * as React from 'react';
import { Component } from 'react';
import SyntaxHighlighter from 'react-syntax-highlighter/dist/cjs/light';
import codeStyle from './codeStyle';

import vim from 'react-syntax-highlighter/dist/cjs/languages/hljs/vim';
import xml from 'react-syntax-highlighter/dist/cjs/languages/hljs/xml';
import yaml from 'react-syntax-highlighter/dist/cjs/languages/hljs/yaml';

SyntaxHighlighter.registerLanguage('vim', vim);
SyntaxHighlighter.registerLanguage('xml', xml);
SyntaxHighlighter.registerLanguage('yaml', yaml);

interface CodeProps {
    content: string,
    language: string,
    style?: React.CSSProperties
}

export class Code extends Component<CodeProps> {
    render() {
        const { content, language, style } = this.props;

        return (
            <SyntaxHighlighter
                customStyle={style}
                language={language}
                style={codeStyle}
                >
                {content}
            </SyntaxHighlighter>
        );
    }
}
