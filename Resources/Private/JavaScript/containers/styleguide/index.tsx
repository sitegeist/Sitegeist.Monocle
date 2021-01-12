import * as React from "react";
import { Provider } from "react-redux";

import { Store } from "../../bootstrap";

import { Header } from "./header";
import { Main } from "./main";
import { Loader } from "./loader";
import { Login } from "./login";
import { QrCode } from "./qrcode";
import { ErrorMessage } from "./error-message";

import "./style.css";

interface StyleguideProps {
    store: Store
}

export function Styleguide(props: StyleguideProps) {
    return (
        <Provider store={props.store}>
            <div>
                <Header/>
                <Main/>
                <Loader/>
                <Login/>
                <QrCode/>
                <ErrorMessage/>
            </div>
        </Provider>
    );
}
