const http = require('http');
const { Client, Pool } = require('pg');

const ERRORS = {
  invalidJSON: "Invalid JSON input."
}

const pool = new Pool({
  user: process.env.db_user,
  host: process.env.db_host,
  database: process.env.db_database,
  password: process.env.db_password,
  port: process.env.db_port,
});

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/store-products') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {

        const { products } = JSON.parse(body);
        const vals = products.map(p => [`${p.name}`, `${p.price}`, p.availability]);

        console.log('Connected to PostgreSQL database');
        const client = await pool.connect();
        await client.query('BEGIN');
        pool.query(`INSERT INTO public.products(name, price, availability) 
          VALUES 
          ${vals.map((_, index) => `($${index * 3 + 1}, $${index * 3 + 2}, $${index * 3 + 3})`).join(', ')};`, vals.flat(), async (err) => {
          if (err) {
            await client.query('ROLLBACK');
            res.writeHead(400, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ error: ERRORS.invalidJSON, message: err.message }))
          } else {
            await client.query('COMMIT');
            console.log('Inserted successfully');
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ message: 'Success.' }));
          }
          client.release();

        });

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ file: null, error: ERRORS.invalidJSON }));
      }
    });
  } else if (req.method === 'GET' && req.url === '/list-products') {
    pool.query(`SELECT name, price, availability from public.products;`, (err, queryRes) => {

      if (err) throw err;

      console.log(queryRes.rows, 'Inserted successfully'); // The result of the query
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ products: queryRes.rows }));

    });

  } else {
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not found');
  }
});

const port = 6000;
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
