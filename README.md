# AfriGlobal Business Management System

A comprehensive Node.js/Express API for managing business operations including orders, customers, suppliers, inventory, and accounting.

## Features

- Order Management
- Customer Management
- Supplier Management
- Inventory Tracking
- Financial Accounting
- Dashboard & Reports
- JWT Authentication

## Tech Stack

- Backend: Node.js + Express.js
- Database: MongoDB
- Authentication: JWT

## Installation & Running

```bash
git clone https://github.com/mosa2023egypt-hash/afriglobal.git
cd afriglobal
npm install
```

Create a `.env` file (see `.env.example`) and set your MongoDB connection string:

```
MONGODB_URI=mongodb://localhost:27017/afriglobal
```

Then start the server:

```bash
npm start
```

Open the ERP UI in your browser:

```
http://localhost:5000/erp.html
```

> **Note:** MongoDB must be running and `MONGODB_URI` must be set before starting the server.

## License

MIT