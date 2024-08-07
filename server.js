const express = require('express');
const { Pool } = require('pg'); //pulling pool object out of pg library. 

const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const pool = new Pool(
  {
    // TODO: Enter PostgreSQL username
    user: 'postgres',
    // TODO: Enter PostgreSQL password
    password: 'April2you!',
    host: 'localhost',
    database: 'billsbusiness_db' //changed database name 
  },
  console.log(`Connected to Bill's Business Database.`)
)

pool.connect();

//
pool.query('SELECT COUNT(id) AS total_count FROM favorite_books GROUP BY in_stock', function (err, {rows}) {
  console.log(rows);
});

// pool.query('SELECT SUM(quantity) AS total_in_section, MAX(quantity) AS max_quantity, MIN(quantity) AS min_quantity, AVG(quantity) AS avg_quantity FROM favorite_books GROUP BY section', function (err, {rows}) {
//   console.log(rows);
// });

app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
