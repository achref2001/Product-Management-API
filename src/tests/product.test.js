// src/tests/product.test.js
const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const request = require('supertest');
const app = require('../app.js'); 
const Product = require("../../src/domain/models/product.model"); 
const Category = require("../../src/domain/models/category.model"); 
const User = require("../../src/domain/models/user.model"); // Ensure you import your User model

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();
  
  await mongoose.connect(uri);

  // Create a test user and log in to get a token
  const user = new User({
    name: 'Admin User',
    email: 'admin@example.com',
    password: 'password123', // Ensure this password is hashed in your actual model
    role: 'admin'
  });
  await user.save();

  const loginRes = await request(app).post('/api/auth/login').send({
    email: 'admin@example.com',
    password: 'password123',
  });

  token = loginRes.body.accessToken; // Capture the token

  // Create a category for the tests
  const category = new Category({ name: "Electronics", description: "Category for electronic products" });
  await category.save();
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe('Product API', () => {
  let categoryId;

  beforeEach(async () => {
    const category = await Category.findOne({ name: "Electronics" });
    categoryId = category._id;
  
    // Create a product for testing
    await Product.create({
      name: "Sample Product",
      description: "Sample product description",
      price: 100,
      stock: 10,
      category: categoryId,
    });
  });

  test('should create a product', async () => {
    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`) // Use the token here
      .send({
        name: "iPhone 13",
        description: "Latest iPhone model",
        price: 999,
        stock: 50,
        categoryId,
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toEqual("iPhone 13");
  });

  test('should get all products', async () => {
    const res = await request(app).get('/api/products').set('Authorization', `Bearer ${token}`);
    
    console.log('Response Body:', res.body);
    console.log('Response Body:', res.body.product); // Add this line for debugging
  
    expect(res.statusCode).toEqual(200);
    expect(Array.isArray(res.body.products)).toBe(true);
  });
  

  test('should get a product by ID', async () => {
    const product = await Product.create({
      name: "MacBook Pro",
      description: "High-performance laptop",
      price: 2000,
      stock: 20,
      category: categoryId,
    });

    const res = await request(app).get(`/api/products/${product._id}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body).toHaveProperty("_id", product._id.toString());
  });

  test('should update a product', async () => {
    const product = await Product.create({
      name: "MacBook Air",
      description: "Lightweight laptop",
      price: 1000,
      stock: 15,
      category: categoryId,
    });

    const res = await request(app)
      .put(`/api/products/${product._id}`)
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: "MacBook Air Updated",
        price: 1100,
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("MacBook Air Updated");
    expect(res.body.price).toEqual(1100);
  });

  test('should soft delete a product', async () => {
    const product = await Product.create({
      name: "MacBook Air",
      description: "Lightweight laptop",
      price: 1000,
      stock: 15,
      category: categoryId,
    });

    const res = await request(app).delete(`/api/products/${product._id}`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Product soft deleted");

    const deletedProduct = await Product.findById(product._id);
    expect(deletedProduct.isDeleted).toBe(true);
  });

  test('should restore a soft deleted product', async () => {
    const product = await Product.create({
      name: "MacBook Air",
      description: "Lightweight laptop",
      price: 1000,
      stock: 15,
      category: categoryId,
      isDeleted: true,
    });

    const res = await request(app).put(`/api/products/${product._id}/restore`).set('Authorization', `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Product restored");

    const restoredProduct = await Product.findById(product._id);
    expect(restoredProduct.isDeleted).toBe(false);
  });
});
