const express = require('express');
const request = require('request');
const fs = require('fs');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const AUTH_KEY = 'kliY8rxDpuxOUUhVm05znmH2ts6FVf2c';
app.get('/exchangeRate', (req, res) => {
  const { date: useDate } = req.query;
  const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${AUTH_KEY}&searchdate=${useDate}&data=AP01`;
  const options = {
    url,
  };
  request.post(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send(body);
    } else {
      res.status(response.statusCode).send();
      console.log(`error = ${response.statusCode}`);
    }
  });
});

app.get('/getJson', (req, res) => {
  let useDate;
  for (let i = 1; i <= 30; i++) {
    setTimeout(async () => {
      useDate = `2023-11-${i}`;
      console.log(`out ${useDate}`);
      const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${AUTH_KEY}&searchdate=${useDate}&data=AP01`;
      const options = {
        url,
      };
      request.post(options, (error, response, body) => {
        if (!error && response.statusCode === 200) {
          const jsonString = JSON.stringify(body);
          console.log(`inner ${useDate}`);
          // 파일에 JSON 데이터 저장
          fs.writeFile(`./data/${useDate}.json`, jsonString, (err) => {
            if (err) throw err;
            console.log('JSON 데이터가 파일에 저장되었습니다.');
          });
        } else {
          res.status(response.statusCode).send();
          console.log(`error = ${response.statusCode}`);
        }
      });
    }, 1000);
  }
});


const port = 3000;
app.listen(port, () => console.log(`Server is running at ${port} ...`));
