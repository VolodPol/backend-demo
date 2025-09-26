import morgan from 'morgan';

export const configureLogger = () => {
    morgan.token('resp', (req,  _) => JSON.stringify(req.body));
    return morgan((tokens, req, res) => {
        return [
            tokens.method(req, res),
            tokens.url(req, res),
            tokens.status(req, res),
            tokens.res(req, res, 'content-length'), '-',
            tokens['response-time'](req, res), 'ms',
            tokens['resp'](req)
        ].join(' ');
    });
};