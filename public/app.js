function getToday() {
  const today = new Date();
  const hour = today.getHours();
  // 오전 11시 이전이면 전 날짜로 가져오기
  if (hour < 11) {
    today.setDate(today.getDate() - 1);
  }

  const year = today.getFullYear(); // year
  const month = today.getMonth() + 1; // month
  const date = today.getDate(); // date

  return `${year}-${month}-${date}`;
}

function getExchangeRate(date = getToday(), func) {
  const exchangeRateRequest = new XMLHttpRequest();
  exchangeRateRequest.onreadystatechange = function (event) {
    // 데이터를 다 받았고, 응답코드 200(성공)을 받았는지 체크
    if (exchangeRateRequest.readyState === 4 && exchangeRateRequest.status === 200) {
      // 응답받은 데이터 체크
      const result = JSON.parse(exchangeRateRequest.responseText);
      const body = JSON.parse(result.body);
      const filteredBody = body.filter(currency => currency.cur_unit !== 'KRW');
      console.log(body);
      console.log(filteredBody);
      func(filteredBody);
    }
  };
  exchangeRateRequest.open('GET', `/exchangeRate?date=${date}`, true);
  exchangeRateRequest.send();
}

function newExchangeBox(exchangeRateJson) {
  const mainContainer = document.getElementsByClassName('main')[0];
  let containerIdx = -1;
  exchangeRateJson.forEach((ex, idx) => {
    if (idx % 5 === 0) {
      const newContainer = document.createElement('div');
      newContainer.setAttribute('class', 'exchange-rate container');
      mainContainer.appendChild(newContainer);
      containerIdx++;
    }
    if (ex.cur_unit !== 'KRW') {
      const exchangeRateContainer = document.getElementsByClassName('exchange-rate')[containerIdx];
      const newContainer = document.createElement('div');
      newContainer.setAttribute('class', 'container flex-direction-column exchange-rate-box boreder-solid');
      newContainer.innerHTML = `<div class='container'>${ex.cur_nm}(${ex.cur_unit})</div>
    <div class='container'>전신환(송금) 받으실때${ex.ttb}</div>
    <div class='container'>전신환(송금) 보낼때${ex.tts}</div>
    <div class='container'>매매 기준율 ${ex.deal_bas_r}</div>
    `;
      exchangeRateContainer.appendChild(newContainer);
    }

  });
  const chartContainer = document.createElement('div');
  chartContainer.setAttribute('class', 'container chart-box boreder-solid');
  mainContainer.appendChild(chartContainer);
}

getExchangeRate(getToday(), newExchangeBox);