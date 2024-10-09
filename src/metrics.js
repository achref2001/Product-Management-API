const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();


const httpRequestDurationMicroseconds = new client.Histogram({
    name: 'http_request_duration_seconds',
    help: 'Duration of HTTP requests in seconds',
    labelNames: ['method', 'route', 'code'],
    // Define buckets for the histogram
    buckets: [0.1, 0.5, 1, 2, 5, 10],
});

// Register the histogram
register.registerMetric(httpRequestDurationMicroseconds);

// Expose the metrics endpoint
const metricsMiddleware = (req, res, next) => {
    res.set('Content-Type', register.contentType);
    res.send(register.metrics());
};

// Middleware to track the duration of HTTP requests
const metricsMiddlewareWithDuration = (req, res, next) => {
    const end = httpRequestDurationMicroseconds.startTimer();
    res.on('finish', () => {
        end({ method: req.method, route: req.path, code: res.statusCode });
    });
    next();
};

module.exports = { metricsMiddleware, metricsMiddlewareWithDuration };
