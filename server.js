const express = require('express');
const request = require('request');

const app = express();

app.use(express.static('public'));
app.use(express.json());

app.get('/', (req, res) => {
  const indexPage = `${__dirname}/public/index.html`;
  res.sendFile(indexPage);
});

app.post('/exchange', (req, res) => {
  const url = 'https://www.koreaexim.go.kr/site/program/financial/exchangeJSON';

  const { searchdate } = req.body;
  const data = {
    authkey: 'kliY8rxDpuxOUUhVm05znmH2ts6FVf2c',
    searchdate,
    data: 'AP01',
  };

  request.post({ url, form: data }, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.writeHead(200, {
        'Content-Type': 'application/json;charset=utf-8',
      });
      res.end(body);
    } else {
      res.status(response.statusCode).end();
      console.error(`error = ${response.statusCode}`);
    }
  });
});

const port = 3000;

app.listen(port, () => console.log(`Server is running at ${port} ...`));
