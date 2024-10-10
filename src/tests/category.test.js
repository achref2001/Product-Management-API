// src/tests/category.test.js
const mongoose = require("mongoose");
const { MongoMemoryServer } = require("mongodb-memory-server");
const request = require("supertest");
const app = require("../app.js");
const Category = require("../../src/domain/models/category.model");
const User = require("../../src/domain/models/user.model"); // Import the User model for authentication

let mongoServer;
let token;

beforeAll(async () => {
  mongoServer = await MongoMemoryServer.create();
  const uri = mongoServer.getUri();

  await mongoose.connect(uri);

  // Create a test user and log in to get a token
  const user = new User({
    name: "Admin User",
    email: "admin@example.com",
    password: "password123", // Ensure this password is hashed in your actual model
    role: "admin",
  });
  await user.save();

  const loginRes = await request(app).post("/api/auth/login").send({
    email: "admin@example.com",
    password: "password123",
  });

  token = loginRes.body.accessToken; // Capture the token
});

afterAll(async () => {
  await mongoose.disconnect();
  await mongoServer.stop();
});

describe("Category API", () => {
  test("should create a category", async () => {
    const res = await request(app)
      .post("/api/categories")
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Electronics", // Make sure this is unique
        description: "Category for electronic products",
      });

    expect(res.statusCode).toEqual(201);
    expect(res.body).toHaveProperty("_id");
    expect(res.body.name).toEqual("Electronics");
  });

  test("should update a category", async () => {
    // Create a category first
    const category = await Category.create({
      name: `Accessories ${new Date().getTime()}`, // Unique name
      description: "Category for Accessories",
    });

    const res = await request(app)
      .put(`/api/categories/${category._id}`)
      .set("Authorization", `Bearer ${token}`)
      .send({
        name: "Accessories Updated",
      });

    expect(res.statusCode).toEqual(200);
    expect(res.body.name).toEqual("Accessories Updated");
  });

  // Soft delete test
  test("should soft delete a category", async () => {
    const category = await Category.create({
      name: `Accessories ${new Date().getTime()}`, // Unique name
      description: "Category for Accessories",
    });

    const res = await request(app)
      .delete(`/api/categories/${category._id}`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Category soft deleted");

    const deletedCategory = await Category.findById(category._id);
    expect(deletedCategory.isDeleted).toBe(true);
  });

  // Restore test
  test("should restore a soft deleted category", async () => {
    const category = await Category.create({
      name: `Accessories ${new Date().getTime()}`, // Unique name
      description: "Category for Accessories",
      isDeleted: true,
    });

    const res = await request(app)
      .put(`/api/categories/${category._id}/restore`)
      .set("Authorization", `Bearer ${token}`);
    expect(res.statusCode).toEqual(200);
    expect(res.body.message).toEqual("Category restored");

    const restoredCategory = await Category.findById(category._id);
    expect(restoredCategory.isDeleted).toBe(false);
  });
});
