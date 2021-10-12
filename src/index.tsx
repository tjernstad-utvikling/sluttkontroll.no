import * as Sentry from '@sentry/react';

import App from './app';
import { LicenseInfo } from '@mui/x-data-grid-pro';
import React from 'react';
import ReactDOM from 'react-dom';

if (process.env.NODE_ENV === 'production') {
    Sentry.init({
        dsn: process.env.REACT_APP_SENTRY_DSN
    });
}
if (process.env.REACT_APP_MUI_LICENSE_KEY !== undefined) {
    LicenseInfo.setLicenseKey(process.env.REACT_APP_MUI_LICENSE_KEY);
}

ReactDOM.render(
    <React.StrictMode>
        <App />
    </React.StrictMode>,
    document.getElementById('root')
);
