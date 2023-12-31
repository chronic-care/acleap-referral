import React from 'react'
import ReactDOM from 'react-dom'
import './index.css'
import { AzureAD } from 'react-aad-msal';
import { authProvider } from './authProvider';
import * as serviceWorker from './serviceWorker'
import 'bootstrap/dist/css/bootstrap.min.css'
import Login from './pages/Login/Login';

ReactDOM.render(
    <AzureAD provider={authProvider} forceLogin={true}>
      <Login />
    </AzureAD>,
    document.getElementById('root'),
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister()
