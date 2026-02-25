// MongoDB connection configuration

const MongoClient = require('mongodb').MongoClient;

const url = 'mongodb://localhost:27017'; // Replace with your MongoDB URL
const dbName = 'yourDatabaseName'; // Replace with your database name

const client = new MongoClient(url, { useNewUrlParser: true, useUnifiedTopology: true });

async function connect() {
    try {
        await client.connect();
        console.log('Connected to database:', dbName);
        const db = client.db(dbName);
        // You can perform database operations here.
    } catch (err) {
        console.error('Database connection error:', err);
    } finally {
        await client.close();
    }
}

connect();