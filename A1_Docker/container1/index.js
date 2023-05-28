const http = require('http');
const fs = require('fs');

const ERRORS = {
  invalidJSON: "Invalid JSON input.",
  notFound: "File not found."
}
const container2Url = 'http://container2:5000/sum'; // Assuming the second container is accessible via 'container2' hostname

const server = http.createServer((req, res) => {
  if (req.method === 'POST' && req.url === '/calculate') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {

        const { file, product } = JSON.parse(body);
        try {

          const fileExists = fs.existsSync(`/data/${file}`);
          if (!fileExists) {
            throw new Error(ERRORS.notFound);
          }

          // (async () => {
          const response = await fetch(container2Url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ file, product }),
          });
          const data = await response.json();

          // Send the JSON response
          res.writeHead(response.status, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(data));
          // })();

        } catch (error) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ file: file || null, error: error.message }));

        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ file: null, error: ERRORS.invalidJSON }));

      }
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
