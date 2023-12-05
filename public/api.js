// import { getQueryDate } from './utils.js';
// export function getExchangeRate(func, date = getQueryDate()) {
//   const exchangeRateRequest = new XMLHttpRequest();
//   exchangeRateRequest.onreadystatechange = () => {
//     // 데이터를 다 받았고, 응답코드 200(성공)을 받았는지 체크
//     if (exchangeRateRequest.readyState === 4 && exchangeRateRequest.status === 200) {
//       // 응답받은 데이터 체크
//       const body = JSON.parse(exchangeRateRequest.responseText);
//       const filteredBody = body.filter((currency) => currency.cur_unit !== 'KRW');
//       func(filteredBody);
//       return filteredBody;
//     }
//   };
//   exchangeRateRequest.open('GET', `/exchangeRate?date=${date}`, true);
//   exchangeRateRequest.send();
// }


import { getQueryDate } from './utils.js';

export const getExchangeRate =  async (date = getQueryDate()) => {
  let filteredData;
  await fetch(`/exchangeRate?date=${date}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error('Network response was not ok.');
      }
      return response.json();
    })
    .then((data) => {
      filteredData = data.filter((currency) => currency.cur_unit !== 'KRW');
    })
    .catch((error) => {
      console.error('There was a problem with the fetch operation:', error);
    });
    if (!filteredData) {
      filteredData = await getExchangeRate(date);
    }
    return filteredData;
}