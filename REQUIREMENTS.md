# API and DB Information

## API Endpoints

#### Login
- POST "/login/"
Send user id and password to get an authentication token.
```
Request Data: { id: string, password: string }
Response Body: JWT Token
```

#### Products
- POST "/product/" (Required Authorization Header)
Create a new product by sending its name and price.
```
Request Data: { name: string, price: number }
Response Body: { id: number, name: string, price: number }
```
- GET "/product/all/"
Receive a list of all the products in the database.
```
Response Body: [{ id: number, name: string, price: number }]
```
- GET "/product/:id/"
Receive details of a product using its id.
```
Response Body: { id: number, name: string, price: number }
```
- PUT "/product/" (Required Authorization Header)
Update a product in the database using its id.
```
Request Data: { id: number, name: string, price: number }
Response Body: { id: number, name: string, price: number }
```
- DELETE "/product/:id/" (Required Authorization Header)
Remove a product from the database using its id. 
```
Response Body: { id: number, name: string, price: number }
```

#### Users
- POST "/user/" (Required Authorization Header SuperUser)
Create a new user by sending its id, firstname, lastname, password and superuser flag.
```
Request Data: { id: string, firstname: string, lastname: string, password: string, superuser: boolean }
Response Body: { id: string, firstname: string, lastname: string, superuser: boolean }
```
- GET "/user/all/" (Required Authorization Header)
Receive a list of all the users in the database.
```
Response Body: [{ id: string, firstname: string, lastname: string, superuser: boolean }]
```
- GET "/user/:id/" (Required Authorization Header)
Receive a user's details using its id.
```
Response Body: { id: string, firstname: string, lastname: string, superuser: boolean }
```
- PUT "/user/" (Required Authorization Header SuperUser/Self)
Update a user in the database using its id.
```
Request Data: { id: string, firstname: string, lastname: string, superuser: boolean }
Response Body: { id: string, firstname: string, lastname: string, superuser: boolean }
```
- DELETE "/user/:id/" (Required Authorization Header SuperUser)
Remove a user from the database using its id.
```
Response Body: { id: string, firstname: string, lastname: string, superuser: boolean }
```

#### Orders
- POST "/order/" (Required Authorization Header SuperUser/Self)
Create an order by sending its status, list of products and the user_id for the order.
```
Request Data: { status: string, products: [{ product_id: number, quantity: number }], user_id: string }
Response Body: { id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }
```
- GET "/order/all/" (Required Authorization Header SuperUser)
Receive a list of all the orders in the database.
```
Response Body: [{ id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }]
```
- GET "/order/:id/" (Required Authorization Header SuperUser)
Receive details of an order using its id.
```
Response Body: { id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }
```
- GET "/order/user/:user_id/" (Required Authorization Header SuperUser)
Receive all the orders for a user using its user_id.
```
Response Body: [{ id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }]
```
- GET "/order/" (Required Authorization Header)
Receive all the orders for the user making the request.
```
Response Body: [{ id: number, status: string, products: [{ product_id: number, quantity: number }], user_id: string }]
```
- PUT "/order/" (Required Authorization Header SuperUser)
Update an order in the database using its id.
```
Request Data: { id: number, status: string, products: number[], quantities: number[], user_id: string }
Response Body: { id: number, status: string, products: number[], quantities: number[], user_id: string }
```
- DELETE "/order/:id/" (Required Authorization Header SuperUser)
Remove an order from the database using its id.
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

CREATE TABLE orders(
  id SERIAL PRIMARY KEY,
  status VARCHAR,
  user_id VARCHAR,
  CONSTRAINT fk_user
    FOREIGN KEY(user_id)
      REFERENCES users(id)
);

CREATE TABLE order_products(
  order_id INT,
  CONSTRAINT fk_order_id FOREIGN KEY(order_id) REFERENCES orders(id),
  product_id INT,
  CONSTRAINT fk_product_id FOREIGN KEY(product_id) REFERENCES products(id),
  quantity INT
);
```

## Data Shapes
```
Product
- id: number
- name: string
- price: number

User
- id: string
- firstname: string
- lastname: string
- password: string
- superuser: boolean

Order
- id: number
- status: string
- products: [{ product_id: number, quantity: number }]
- user_id: string
```
