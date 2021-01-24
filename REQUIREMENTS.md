# API and DB Information

## API Endpoints

#### Login
- POST "/login/"
```
Request Data: { id: string, password: string }
Response Body: JWT Token
```

#### Products
- POST "/product/" (Required Authorization Header)
```
Request Data: { name: string, price: number }
Response Body: { id: number, name: string, price: number }
```
- GET "/product/all/"
```
Response Body: [{ id: number, name: string, price: number }]
```
- GET "/product/:id/"
```
Response Body: { id: number, name: string, price: number }
```
- PUT "/product/" (Required Authorization Header)
```
Request Data: { id: number, name: string, price: number }
Response Body: { id: number, name: string, price: number }
```
- DELETE "/product/:id/" (Required Authorization Header)
```
Response Body: { id: number, name: string, price: number }
```

#### Users
- POST "/user/" (Required Authorization Header SuperUser)
```
Request Data: { id: string, firstname: string, lastname: string, password: string, superuser: boolean }
Response Body: { id: string, firstname: string, lastname: string, superuser: boolean }
```
- GET "/user/all/" (Required Authorization Header)
```
Response Body: [{ id: string, firstname: string, lastname: string, superuser: boolean }]
```
- GET "/user/:id/" (Required Authorization Header)
```
Response Body: { id: string, firstname: string, lastname: string, superuser: boolean }
```
- PUT "/user/" (Required Authorization Header SuperUser/Self)
```
Request Data: { id: string, firstname: string, lastname: string, superuser: boolean }
Response Body: { id: string, firstname: string, lastname: string, superuser: boolean }
```
- DELETE "/user/:id/" (Required Authorization Header SuperUser)
```
Response Body: { id: string, firstname: string, lastname: string, superuser: boolean }
```

#### Orders
- POST "/order/" (Required Authorization Header SuperUser/Self)
```
Request Data: { status: string, products: number[], quantities: number[], user_id: string }
Response Body: { id: number, status: string, products: number[], quantities: number[], user_id: string }
```
- GET "/order/all/" (Required Authorization Header SuperUser)
```
Response Body: [{ id: number, status: string, products: number[], quantities: number[], user_id: string }]
```
- GET "/order/:id/" (Required Authorization Header SuperUser)
```
Response Body: { id: number, status: string, products: number[], quantities: number[], user_id: string }
```
- GET "/order/user/:user_id/" (Required Authorization Header SuperUser)
```
Response Body: [{ id: number, status: string, products: number[], quantities: number[], user_id: string }]
```
- GET "/order/" (Required Authorization Header)
```
Response Body: [{ id: number, status: string, products: number[], quantities: number[], user_id: string }]
```
- PUT "/order/" (Required Authorization Header SuperUser)
```
Request Data: { id: number, status: string, products: number[], quantities: number[], user_id: string }
Response Body: { id: number, status: string, products: number[], quantities: number[], user_id: string }
```
- DELETE "/order/:id/" (Required Authorization Header SuperUser)
```
Response Body: { id: number, status: string, products: number[], quantities: number[], user_id: string }
```

## Database Schema
```postgresql
CREATE TABLE products(
  id SERIAL PRIMARY KEY,
  name VARCHAR,
  price INT
);

CREATE TABLE users(
  id VARCHAR PRIMARY KEY,
  firstname VARCHAR,
  lastname VARCHAR,
  password VARCHAR,
  superuser BOOLEAN
);

CREATE TABLE order(
  id SERIAL PRIMARY KEY,
  products TEXT,
  quantities TEXT,
  status VARCHAR,
  user_id VARCHAR,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES users(id)
);
```
