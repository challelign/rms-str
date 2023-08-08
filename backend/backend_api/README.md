# Overview

This Application is a Rest Apis for creating, retrieving, updating & deleting Customers.

# Getting Started

#### clone the project

```
git clone https://github.com/iMohammedHashem/Nodejs-Express-MySQL-Rest-API.git
```

#### Add table with `Customers.sql` file to your database

#### Insall dependencies

```
 npm install
```

#### Run the server

```
nodemon

#OR

node server.js
```

#### To Testing Application Open `http.rest` file

# Route & Action

| Methods | Route Path   | Actions                   |
| ------- | ------------ | ------------------------- |
| GET     | /customers   | Get all Customers         |
| GET     | /customers/1 | Get Customer with id 1    |
| POST    | /customers   | Add new Customer          |
| PUT     | /customers/1 | Update Customer with id 1 |
| DELETE  | /customers/1 | Remove Customer with id 1 |
| DELETE  | /customers   | Remove all Customers      |

# TOOLS

- ### [REST Client](https://github.com/Huachao/vscode-restclient])

  REST Client allows you to send HTTP request and view the response in Visual Studio Code directly.

- ### [Nodemon](https://www.npmjs.com/package/nodemon)

  nodemon is a tool that helps develop node.js based applications by automatically restarting the node application when file changes in the directory are detected.

# DEPENDENCIES

- ### ExpressJs [download from npm](https://www.npmjs.com/package/express)

  Fast, unopinionated, minimalist web framework for node.

- ### MySql [download from npm](https://www.npmjs.com/package/mysql)

  This is a node.js driver for mysql. It is written in JavaScript, does not require compiling, and is 100% MIT licensed.

- ### BodyParser [download from npm](https://www.npmjs.com/package/body-parser)

  Node.js body parsing middleware.
