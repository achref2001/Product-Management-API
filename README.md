# My Express.js Product-Management-API

This is a simple REST API built with Express.js. The API provides functionality to manage [products;categories and users]. It uses [mongodb] for data storage and follows a clean architecture structure.

## Table of Contents

- [Installation](#installation)
- [Authentication](#authentication)
- [API Endpoints](#api-endpoints)
- [Environment Variables](#environment-variables)
- [Contributing](#contributing)

## Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/achref2001/Product-Management-API.git
   ```
2. cd Product-Management-API
   ```bash
   npm install
   npm run dev
   ```

## Authentication

To register or log in, send a POST request to /api/auth/register or /api/auth/login with the required fields. For token refresh, send a POST request to /auth/refresh with your refresh token.

## API Endpoints

### Auth Endpoints

1. {{base_url}} => actual base URL of API

- **Register**

  - Method: `POST`
  - URL: `{{base_url}}/auth/register`
  - Body:
    ```json
    {
      "name": "achref bechane admin4",
      "email": "admin4@gmail.com",
      "password": "123456",
      "role": "admin"
    }
    ```

- **Login**

  - Method: `POST`
  - URL: `{{base_url}}/auth/login`
  - Body:
    ```json
    {
      "email": "admin4@gmail.com",
      "password": "123456"
    }
    ```

- **Refresh Token**

  - Method: `POST`
  - URL: `{{base_url}}/auth/refresh`
  - Body:
    ```json
    {
      "refreshToken": "your_refresh_token_here"
    }
    ```

- **Logout**
  - Method: `POST`
  - URL: `{{base_url}}/auth/logout`

### Product Management Endpoints

- **Get All Products**

  - Method: `GET`
  - URL: `{{base_url}}/products`

- **Create Product**

  - Method: `POST`
  - URL: `{{base_url}}/products`
  - Body:

    ```json bearer token
    {
      "name": "Laptop hp",
      "description": "High-performance hp",
      "price": 1500,
      "stock": 500,
      "categoryId": "670656f13f528dd62bed4f87"
    }
    ```

- **Get Product by ID**

  - Method: `GET`
  - URL: `{{base_url}}/products/{product_id}`

- **Update Product**

  - Method: `PUT`
  - URL: `{{base_url}}/products/{product_id}`
  - Body:
    ```json bearer token
    {
      "name": "PC",
      "description": "High-performance PC",
      "price": 1500,
      "category": "Electronics",
      "stock": 50,
      "createdAt": "2024-10-07T22:31:13.358Z"
    }
    ```

- **Delete Product**

  - Method: `DELETE`
  - URL: `{{base_url}}/products/{product_id}`
  - Body:

    ```json bearer token

    ```

- **Restore Product**

  - Method: `PUT`
  - URL: `{{base_url}}/products/{product_id}/restore`
  - Body:

    ```json bearer token

    ```

### Category Management Endpoints

- **Create Category**

  - Method: `POST`
  - URL: `{{base_url}}/categories`
  - Body:

    - Body:
      ```json bearer token
      {
        "name": "phone45",
        "description": "phone category"
      }
      ```

    ```

    ```

- **Get All Categories**

  - Method: `GET`
  - URL: `{{base_url}}/categories`

- **Get Category by ID**

  - Method: `GET`
  - URL: `{{base_url}}/categories/{category_id}`

- **Update Category**

  - Method: `PUT`
  - URL: `{{base_url}}/categories/{category_id}`
  - Body:
    ```json bearer token
    {
      "name": "laptop",
      "description": "Mobile laptop category"
    }
    ```

- **Delete Category**

  - Method: `DELETE`
  - URL: `{{base_url}}/categories/{category_id}`
  - Body:

    ```json bearer token

    ```

- **Restore Category**

  - Method: `PUT`
  - URL: `{{base_url}}/categories/{category_id}/restore`
  - Body:

    ```json bearer token

    ```

### User Management Endpoints

- **Create User**

  - Method: `POST`
  - URL: `{{base_url}}/users`
  - Body:
    ```json
    {
      "name": "Manager 2",
      "email": "manager2@gmail.com",
      "password": "password123",
      "role": "client"
    }
    ```

- **Get All Users**

  - Method: `GET`
  - URL: `{{base_url}}/users`

- **Update User**

  - Method: `PUT`
  - URL: `{{base_url}}/users/{user_id}`
  - Body:
    ```json bearer token
    {
      "name": "hello wolrd",
      "email": "hello@example.com",
      "password": "123456"
    }
    ```

- **Update User role**

  - Method: `PUT`
  - URL: `{{base_url}}/users/{user_id}/role`
  - Body:
    ```json bearer token
    {
      "role": "admin"
    }
    ```

- **Delete Category**

  - Method: `DELETE`
  - URL: `{{base_url}}/users/{user_id}`
  - Body:

    ```json bearer token

    ```

## Environment Variables

  | Variable Name          | Description                                 | Example Value                           |
  | ---------------------- | ------------------------------------------- | --------------------------------------- |
  | `DATABASE_URL`         | Connection string for the database          | `mongodb://localhost:27017/name`        |
  | `JWT_SECRET`           | Secret key for signing JSON Web Tokens      | `your-secret-key`                       |
  | `PORT`                 | The port number the application will run on | `4444`                                  |

## Contributing
1. Also there is a Dockerfile & docker-compose file & grafana promtheus for monitoring purpuses
2. the repo use github actions for continuous integration and continuous delivery (CI/CD)   to automate the build, test, and deployment pipeline. 