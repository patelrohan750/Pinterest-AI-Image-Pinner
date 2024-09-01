const express = require('express');
require('dotenv').config();
const pinRoutes = require('./routes/pinRoutes');
const authRoute = require('./routes/oAuthRoute');
const scrapeRoute = require('./routes/scrapperRoutes');
const { morganMiddleware, logResponseBody, logRequestBody, logError } = require('./middleware/loggingMiddleware');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware for JSON parsing and logging
app.use(express.json());
app.use(morganMiddleware);
app.use(logRequestBody);
app.use(logResponseBody);

// Routes
app.use('/api', pinRoutes);
app.use('/api', authRoute);
app.use('/api', scrapeRoute);


// Middleware for logging response and errors
app.use(logError);

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
