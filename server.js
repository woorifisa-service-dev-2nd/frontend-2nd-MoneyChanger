const express = require('express');
const request = require('request');
const fs = require('fs');

const app = express();

app.use(express.static('public'));
app.use(express.json());

const AUTH_KEY = 'kliY8rxDpuxOUUhVm05znmH2ts6FVf2c';

const dateStringFrom = (dateObject) => {
  const year = dateObject.getFullYear(); // year
  const month = dateObject.getMonth() + 1; // month
  const date = dateObject.getDate(); // date

  return `${year}-${month}-${date}`;
};

app.get('/exchangeRate', (req, res) => {
  const { date } = req.query;
  const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${AUTH_KEY}&searchdate=${date}&data=AP01`;

  const options = {
    url,
  };

  request.post(options, (error, response, body) => {
    if (!error && response.statusCode === 200) {
      res.send(body);
    } else {
      try {
        res.status(response.statusCode).send();
      } catch (err) {
        console.error(err);
      }
    }
  });
});

app.get('/getJson', (req, res) => {
  // 어제부터 30일 전까지의 Data 생성
  for (let i = 1; i <= 30; i += 1) {
    const today = new Date();
    today.setDate(today.getDate() - i);
    const useDate = dateStringFrom(today);

    const jsonFilePath = `./data/${useDate}.json`;
    // 해당 날짜의 JSON 파일이 생성되어있지 않는 경우만 실행
    if (!fs.existsSync(jsonFilePath)) {
      setTimeout(async () => {
        const url = `https://www.koreaexim.go.kr/site/program/financial/exchangeJSON?authkey=${AUTH_KEY}&searchdate=${useDate}&data=AP01`;
        const options = {
          url,
        };
        request.post(options, (error, response, body) => {
          if (!error && response.statusCode === 200) {
            const jsonString = JSON.stringify(body);

            // 파일에 JSON 데이터 저장
            fs.writeFile(jsonFilePath, jsonString, (err) => {
              if (err) throw err;
              console.log(`${useDate}일자 환율 데이터가 ${useDate}.json 파일에 저장되었습니다.`);
            });
            res.send();
          } else {
            try {
              res.status(response.statusCode).send();
            } catch (err) {
              console.error(err);
            }
          }
        });
      }, 40 * i);
    }
    res.send();
  }
});

const port = 3000;
app.listen(port, () => console.log(`Server is running at ${port} ...`));
