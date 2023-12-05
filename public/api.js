import { getQueryDate } from './utils.js';
export function getExchangeRate(func, date = getQueryDate()) {
  const exchangeRateRequest = new XMLHttpRequest();
  exchangeRateRequest.onreadystatechange = () => {
    // 데이터를 다 받았고, 응답코드 200(성공)을 받았는지 체크
    if (exchangeRateRequest.readyState === 4 && exchangeRateRequest.status === 200) {
      // 응답받은 데이터 체크
      const body = JSON.parse(exchangeRateRequest.responseText);
      const filteredBody = body.filter((currency) => currency.cur_unit !== 'KRW');
      func(filteredBody);
    }
  };
  exchangeRateRequest.open('GET', `/exchangeRate?date=${date}`, true);
  exchangeRateRequest.send();
}