import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import QRCode from 'qrcode';
import mergeClassNames from 'classnames';

import {CopyToClipboard} from 'react-copy-to-clipboard';

import Dialog from '@neos-project/react-ui-components/lib/Dialog';
import Icon from '@neos-project/react-ui-components/lib/Icon';

import {selectors, actions} from 'state';
import {visibility} from 'components';

import style from './style.css';

@connect(state => {
    const url = selectors.navigation.previewUri(state);
    const isVisible = selectors.qrcode.isVisible(state) && Boolean(url);

    return {url, isVisible};
}, {
    hide: actions.qrcode.hide
})
@visibility
export default class QrCode extends PureComponent {
    static propTypes = {
        url: PropTypes.string,
        hide: PropTypes.func.isRequired
    };

    state = {
        qrcode: '',
        copied: false
    };

    componentDidMount() {
        this.generateQRCode(this.props.url);
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.url !== this.props.url) {
            this.generateQRCode(nextProps.url);
        }
    }

    generateQRCode = async url => {
        this.setState({qrcode: ''});

        if (url) {
            const qrcode = await QRCode.toDataURL(url, {
                errorCorrectionLevel: 'H'
            });

            this.setState({qrcode});
        }
    }

    handleClose = () => {
        const {hide} = this.props;

        hide();
    };

    handleCopy = async () => {
        this.setState({copied: true});
        setTimeout(() => this.setState({copied: false}), 600);
    }

    render() {
        const copiedClassNames = mergeClassNames({
            [style.copied]: true,
            [style.copiedVisible]: this.state.copied
        });

        return (
	<Dialog isOpen title="QR Code" onRequestClose={this.handleClose} actions={[]}>
		<div className={style.form}>
			{this.state.qrcode && <img className={style.qrcode} src={this.state.qrcode} alt={this.props.url}/>}
			<div className={style.url}>
				{this.props.url}
				<CopyToClipboard onCopy={this.handleCopy} text={this.props.url}>
					<span className={style.copy} title="Copy URL to clipboard">
						<Icon icon="clipboard"/>
						<span className={copiedClassNames}>
                            Copied!
                        </span>
					</span>
				</CopyToClipboard>
			</div>
		</div>
	</Dialog>
        );
    }
}
