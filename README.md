# Storefront Backend Project

# Project Title

A StoreFront backend API written in NodeJS for Udacity. This application has APIs for Users, Products, and Orders.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing
purposes.

### Prerequisites

You need the following modules and dependencies installed to run this project:
```
docker-compose   # To run the Postgres database on Docker
node 12          # To run the application
yarn             # For dependency management
```

### Installing

Simply, run the following command to install the project dependencies:
```bash
yarn
```

### Setup environment

First, create a `.env` file with all the required environment variables:
```bash
POSTGRES_PASSWORD="password"
POSTGRES_USER="postgres"
POSTGRES_DB="store"
DATABASE_URL="postgresql://postgres:password@localhost:5432/store"
ROOT_USER_PASSWORD="password"
SALT_ROUNDS="10"
JWT_SECRET="super-secure-jwt-secret"
```

Next, start the Postgres server on Docker:
```bash
docker-compose up
```

Now, check if Postgres has the database `store`, if not create it:
```bash
# Connect to Postgres container
docker exec -it <postgres_container_id> bash

# Login to Postgres
psql -U postgres

# Postgres shell
# This will list out all the databases
\l

# If "store" database is not present
create database store; 
```

Next, you need to run the database migrations:
```bash
yarn migrations up
```

## Running the application

Use the following command to run the application in watch mode:
```bash
yarn run watch
```

Use the following command to run the application in using node:
```bash
yarn start
```

The application will run on http://localhost:8000/.

***Note:** On the first run, the application will create the following root user which you can use to create more users:*
```json
{
  "id": "root",
  "password": "{process.env.ROOT_USER_PASSWORD}",
  "firstname": "Root",
  "lastname": "Root",
  "superuser": true
}
```

## Running the unit tests

Use the following command to run the unit tests:
```bash
yarn test
```

You may also use the Postman collection present in the repository for testing.

## Built With

* [NodeJS](https://nodejs.org/) - The JavaScript runtime
* [Yarn](https://yarnpkg.com/) - The dependency manager
* [db-migrate](https://db-migrate.readthedocs.io/en/latest/) - The database migration tool
* [Express](https://expressjs.com) - The web framework
* [TypeScript](https://www.typescriptlang.org/) - Types JS extension
* [Jasmine](https://jasmine.github.io/) - The unit testing framework

## Authors

* **Surya Kant Bansal** - *Initial work* - [skb1129](https://github.com/skb1129)

## License

This project is licensed under the ISC License - see the [LICENSE.txt](LICENSE.txt) file for details

## Acknowledgments

* The official documentation of `db-migrate`
* The official Documentation of `Jasmine`
