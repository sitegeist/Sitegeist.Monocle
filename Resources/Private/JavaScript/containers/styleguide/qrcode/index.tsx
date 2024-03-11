import * as React from "react";
import { PureComponent } from "react";
import { connect } from "react-redux";
import QRCode from "qrcode";
import cx from "classnames";

import { CopyToClipboard } from "react-copy-to-clipboard";

import { Dialog, Icon } from "@neos-project/react-ui-components";

import { selectors, actions, State } from "../../../state";
import { visibility } from "../../../components";

import style from "./style.module.css";

interface QrCodeProps {
    url: string
    hide: () => void
}

interface QrCodeState {
    qrcode: string
    copied: boolean
}

class QrCodeC extends PureComponent<QrCodeProps, QrCodeState> {
    state = {
        qrcode: '',
        copied: false
    };

    componentDidMount() {
        this.generateQRCode(this.props.url);
    }

    UNSAFE_componentWillReceiveProps(nextProps: QrCodeProps) {
        if (nextProps.url !== this.props.url) {
            this.generateQRCode(nextProps.url);
        }
    }

    generateQRCode = async (url: string) => {
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

    renderTitle() {
        return (
            <>
                QR Code

                <button className={style.close} onClick={this.handleClose}>
                    <Icon className={style.icon} icon="close" />
                </button>
            </>
        );
    }

    render() {
        const copiedClassNames = cx({
            [style.copied]: true,
            [style.copiedVisible]: this.state.copied
        });

        return (
            <Dialog isOpen title={this.renderTitle()} onRequestClose={this.handleClose} actions={[]}>
                <div className={style.form}>
                    {this.state.qrcode && <img className={style.qrcode} src={this.state.qrcode} alt={this.props.url}/>}
                    <div className={style.url}>
                        {this.props.url}
                        <CopyToClipboard onCopy={this.handleCopy} text={this.props.url}>
                            <span className={style.copy} title="Copy URL to clipboard">
                                <Icon className={style.icon} icon="clipboard"/>
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

export const QrCode = connect((state: State) => {
    const url = selectors.navigation.previewUri(state);
    const isVisible = selectors.qrcode.isVisible(state) && Boolean(url);

    return {url, isVisible};
}, {
    hide: actions.qrcode.hide
})(visibility(QrCodeC));
