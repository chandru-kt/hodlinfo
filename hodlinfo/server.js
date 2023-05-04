
const express = require('express');
const app = express();
const port = 3000;
const { Pool } = require('pg');

const path = require('path');

// Initialize database connection pool
const pool = new Pool({
	user: 'chan',
	host: 'dpg-cfuc26arrk0c831npb1g-a.oregon-postgres.render.com',
	database: 'bank_det',
	password: 'l3AK61KAp0yrosaj2CFvDaiayUYkWTTD',
	port: 5432,
	ssl: 'true',
  });

// Define route to retrieve ticker data from database
app.get('/tickers', async (req, res) => {
  try {
    const client = await pool.connect();
    const result = await client.query('SELECT * FROM ticker LIMIT 10');
    const tickers = result.rows;
    client.release();
    res.json(tickers);
  } catch (err) {
    console.error(err);
    res.send("Error " + err);
  }
});
app.get('/style.css', function(req, res) {
    res.setHeader('Content-Type', 'text/css');
    res.sendFile(path.join(__dirname, 'style.css'));
  });
app.get('/script.js', function(req, res) {
    res.setHeader('Content-Type', 'text/javascript');
    res.sendFile(path.join(__dirname, 'script.js'));
  });
    
// Define route to retrieve the HTML page
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
});

// Start the server
app.listen(port, () => {
  console.log(`Server listening on port ${port}.`);
});

// Retrieve data from API and store it in database
const fetchTickers = async () => {
  try {
    const { default: fetch } = await import('node-fetch');
    const response = await fetch('https://api.wazirx.com/api/v2/tickers');
    const data = await response.json();
    const client = await pool.connect();
    const query = 'INSERT INTO ticker (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)';
    Object.keys(data).slice(0, 10).forEach(async (key) => {
      const ticker = data[key];
      const values = [key, ticker.last, ticker.buy, ticker.sell, ticker.volume, ticker.base_unit];
      await client.query(query, values);
    });
    client.release();
    console.log('Tickers fetched and stored in database.');
  } catch (err) {
    console.error(err);
  }
};

// Fetch ticker data every 5 minutes
fetchTickers();
setInterval(fetchTickers, 1 * 60 * 1000);
