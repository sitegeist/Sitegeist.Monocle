import React, {PureComponent} from 'react';
import PropTypes from 'prop-types';
import {connect} from 'react-redux';
import QRCode from 'qrcode';

import Dialog from '@neos-project/react-ui-components/lib/Dialog';
import TextInput from '@neos-project/react-ui-components/lib/TextInput';
import Button from '@neos-project/react-ui-components/lib/Button';

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
        qrcode: ''
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

    render() {
        return (
            <Dialog isOpen title="QR Code" onRequestClose={this.handleClose}>
                <div className={style.form}>
                    {this.state.qrcode && <img className={style.qrcode} src={this.state.qrcode} alt={this.props.url}/>}
                </div>
            </Dialog>
        );
    }
}
