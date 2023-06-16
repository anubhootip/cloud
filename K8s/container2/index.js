const express = require('express');
const csv = require('csv-parse');
const fs = require('fs');
const path = require('path');

const ERRORS = {
  invalidCSV: "Input file not in CSV format."
}

const app = express();
const port = 5000;

app.use(express.json());

app.post('/sum', (req, res) => {
  const { file, product } = req.body;

  const filePath = path.resolve(`/data/${file}`);
  let sum = 0;
  let isCSV = true;

  fs.readFile(filePath, 'utf-8', (err, fileData) => {
    if (err) {
      res.status(404).json({ file, error: ERRORS.invalidCSV });
      return;
    }

    csv.parse(fileData, { columns: true }, (errr, records) => {
      if (errr) {
        res.status(400).json({ file, error: ERRORS.invalidCSV });
        return;
      }

      for (let row of records) {
        if (row.product === product) {
          const amount = parseInt(row.amount, 10);
          if (!isNaN(amount)) {
            sum += amount;
          } else {
            isCSV = false;
            break;
          }
        }
      }

      if (!isCSV) {
        res.status(400).json({ file, error: ERRORS.invalidCSV });
      } else {
        res.json({ file, sum });
      }
    })
  });
});

app.listen(port, () => {
  console.log(`Container 2 listening at http://localhost:${port}`);
});
