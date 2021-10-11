import './index.css';

import * as Sentry from '@sentry/react';

import App from './app';
import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN
    });
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
