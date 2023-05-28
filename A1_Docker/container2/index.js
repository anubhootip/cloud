const express = require('express');
const csv = require('csv-parser');
const fs = require('fs');

const ERRORS = {
  invalidCSV: "Input file not in CSV format."
}

const app = express();
const port = 5000;

app.use(express.json());

app.post('/sum', (req, res) => {
  const { file, product } = req.body;

  const filePath = `/data/${file}`;

  let sum = 0;
  let isCSV = true;

  fs.createReadStream(filePath)
    .pipe(csv())
    .on('data', (row) => {
      // Check if the row has the required columns
      if (!row.product || !row.amount) {
        isCSV = false;
        return;
      }

      // Perform the calculation based on the product and row data
      if (row.product === product) {
        const amount = parseInt(row.amount, 10);
        if (!isNaN(amount)) {
          sum += amount;
        } else {
          isCSV = false;
          return;
        }
      }
    })
    .on('end', () => {
      if (!isCSV) {
        res.status(400).json({ file, error: ERRORS.invalidCSV});
      } else {
        res.json({ file, sum });
      }
    })
    .on('error', (err) => {
      res.status(404).json({ file, error: 'File not found.' });
    });
});

app.listen(port, () => {
  console.log(`Container 2 listening at http://localhost:${port}`);
});
