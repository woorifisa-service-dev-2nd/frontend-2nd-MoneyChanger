const express = require('express');
const request = require('request');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const AUTH_KEY = 'kliY8rxDpuxOUUhVm05znmH2ts6FVf2c';
app.get('/exchangeRate', (req, res) => {
  const date = req.query.date;
  const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${AUTH_KEY}&searchdate=${date}&data=AP01`;
  const options = {
    url: url
  };
  request.post(options, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      res.send(response);
    } else {
      res.status(response.statusCode).end();
      console.log('error = ' + response.statusCode);
    }
  });
});

app.get('/', (req, res) => {
  // html 파일 경로 설정
  const htmlPath = path.resolve(__dirname + './public/index.html');

  // html 파일 보여주기
  res.sendFile(htmlPath);
})


const port = 3000;
app.listen(port, () => console.log(`Server is running at ${port} ...`));
