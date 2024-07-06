# Product REST API

This is a simple Product REST API that requires authentication and runs on Docker. It uses JSON Web Tokens (JWT) for authentication and MongoDB for Storage.

## Prerequisites

Ensure you have the following installed:

- Docker
- Node.js (for local development)

## Getting Started

### Environment Variables

The API requires the following environment variables:

```plaintext
PORT=4000
MONGO_URI=mongodb://mongo:27017/
DB_NAME=product-db
JWT_KEY=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

## Running the Application

To run the application, use the following command:

```sh
docker-compose up -d --build
```

The application will be available at [http://localhost:4000](http://localhost:4000).

## API Endpoints

### Authentication

- **POST /auth/login**: User login

### Products

- **GET /products**: Get all products
- **POST /products**: Create a new product
- **GET /products/:id**: Get a product by ID
- **PUT /products/:id**: Update a product by ID 
- **DELETE /products/:id**: Delete a product by ID

## Running Tests

To run the tests, use the following command:

```sh
yarn test
```

## Database Seeder

To seed the database:

```sh
yarn db:seed
```

## Dummy Account for Testing

### Use the following dummy account for login:

- **Email**: user1@gmail.com
- **Password**: password
