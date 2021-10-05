import * as Sentry from '@sentry/react';

export const errorHandler = (error: any) => {
    if (process.env.NODE_ENV === 'production') {
        Sentry.captureException(error);
    } else {
        console.error(error);
    }
};
