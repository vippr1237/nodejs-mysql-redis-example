const express = require('express');
const mysql = require('mysql2');
const redis = require('redis');

const app = express();

// Load environment variables
const mysqlHost = process.env.MYSQL_HOST;
const mysqlUser = process.env.MYSQL_USER;
const mysqlPassword = process.env.MYSQL_PASSWORD;
const mysqlDatabase = process.env.MYSQL_DATABASE;

const redisHost = process.env.REDIS_HOST;
const redisPort = process.env.REDIS_PORT;

// Connect to MySQL
const mysqlConnection = mysql.createPool({
  host: mysqlHost,
  user: mysqlUser,
  password: mysqlPassword,
  database: mysqlDatabase
});

// Connect to Redis
const redisClient = redis.createClient({
  host: redisHost,
  port: redisPort
});

// Example endpoint to get data from MySQL and store it in Redis
app.get('/data', async (req, res) => {
  try {
    // Query data from MySQL
    const [rows] = await mysqlConnection.query('SELECT * FROM your_table');

    // Store data in Redis
    await redisClient.set('data', JSON.stringify(rows));

    res.json({ message: 'Data retrieved and stored successfully.' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error retrieving data.' });
  }
});

// Start the server
app.listen(3000, () => console.log('Server listening on port 3000'));
