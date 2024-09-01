const logger = require('../logger');
const morgan = require('morgan');

// Morgan middleware for logging request details
const morganMiddleware = morgan('combined', {
    stream: {
        write: (message) => logger.info(message.trim())
    }
});

const logResponseBody = (req, res, next) => {
    const oldSend = res.send;
    res.send = function (data) {
        logger.info(`Response: ${data}`);
        oldSend.apply(res, arguments);
    };
    next();
};

const logRequestBody = (req, res, next) => {
    logger.info(`API: ${req.method} ${req.originalUrl}`);
    logger.info(`Request: ${JSON.stringify(req.body)}`);
    next();
};

const logError = (err, req, res, next) => {
    logger.error(`Error: ${err.message}`);
    res.status(500).json({ error: err.message });
};

module.exports = {
    morganMiddleware,
    logResponseBody,
    logRequestBody,
    logError
};
