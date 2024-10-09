/**********************************************imports************************************************* */
const express = require('express');
const connectDB = require('./infrastructure/database/mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./interfaces/http/routes/auth.routes.js')
const productRoutes = require('./interfaces/http/routes/product.routes.js');
const categoryRoutes = require('./interfaces/http/routes/category.routes');
const userRoutes = require('./interfaces/http/routes/user.routes.js');
const cors = require('cors');
//connectDB();

dotenv.config();
/**********************************************imports************************************************* */
const app = express();
app.use(express.json());
/**********************************************Routes************************************************* */
app.get('/', (req, res) => {res.send('Product Management API');});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/users', userRoutes);
/**********************************************Routes************************************************* */

/**********************************************APP DECLARATION************************************************* */

// CORS Configuration
const allowedOrigins = [
  
  'http://localhost:4001',
  'http://localhost:7000'
];
const corsOptions = {
  origin: function(origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true // Include credentials like cookies in CORS requests
};

/**************************************************************newest changes******************************************************* */

app.use(cors(corsOptions));

/**********************************************metrics************************************************* */

/**********************************************metrics************************************************* */


process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception thrown:', err);
  process.exit(1);
});
if (process.env.NODE_ENV !== 'test') {
    connectDB();
  }
module.exports = app;