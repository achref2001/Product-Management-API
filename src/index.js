const express = require('express');
const connectDB = require('./infrastructure/database/mongoose');
const dotenv = require('dotenv');
const authRoutes = require('./interfaces/http/routes/auth.routes.js')
const productRoutes = require('./interfaces/http/routes/product.routes.js');
const categoryRoutes = require('./interfaces/http/routes/category.routes');
dotenv.config();


connectDB();

const app = express();


app.use(express.json());

app.get('/', (req, res) => {res.send('Product Management API');});
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
// Start the server
const PORT = process.env.PORT || 4444;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
