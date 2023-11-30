const drawChart = (currencyUnit, responseData) => {
  const context = document.getElementsByClassName('chart-box')[0];
  if (context) {
    context.remove();
  }

  const mainContainer = document.getElementsByClassName('main')[0];
  const chartContainer = document.createElement('canvas');
  chartContainer.setAttribute('class', 'container chart-box boreder-solid');
  mainContainer.appendChild(chartContainer);

  const labels = responseData.map((data) => data.date);
  const ttbData = responseData.map((data) => data.ttb);
  const ttsData = responseData.map((data) => data.tts);
  const dealBasRData = responseData.map((data) => data.deal_bas_r);

  // const max = ttsData.reduce((prev, cur) => prev > cur ? prev : cur);
  // const min = ttbData.reduce((prev, cur) => prev < cur ? prev : cur);

  const data = {
    labels,
    datasets: [{
      label: `전신환(송금)을 ${currencyUnit}로 받을때 환율`,
      data: ttbData,
      fill: false,
      borderColor: 'rgb(75, 192, 192)',
      tension: 0.1,
    },
    {
      label: `전신환(송금)을 ${currencyUnit}로 보낼때 환율`,
      data: ttsData,
      fill: false,
      borderColor: 'rgb(192, 75, 192)',
      tension: 0.1,
    },
    {
      label: '매매 기준율',
      data: dealBasRData,
      fill: false,
      borderColor: 'rgb(192, 192, 75)',
      tension: 0.1,
    }],
  };

  // const options = {
  //   scales: {
  //     y: {
        // beginAtZero: true,
        // max: max * 1.1,
        // min: min * 0.9,
        // ticks: {
        //   stepSize: 500
        // }
  //     }
  //   }
  // };

  const config = {
    type: 'line',
    data,
    // options,
  }

  new Chart(chartContainer, config);
}

function getQueryDate() {
  const useDate = new Date();
  const hour = useDate.getHours();
  // 오전 11시 이전이면 전 날짜로 가져오기
  if (hour < 11) {
    useDate.setDate(useDate.getDate() - 1);
  }

  const year = useDate.getFullYear(); // year
  const month = useDate.getMonth() + 1; // month
  const date = useDate.getDate(); // date

  return `${year}-${month}-${date}`;
}

const makeExchangeRateContainer = (ex) => `<div class='container exchange-name' data-currency-unit='${ex.cur_unit}'>${ex.cur_nm} (${ex.cur_unit})</div>
  <div class='container exchange-receive'>전신환(송금) 받으실때 ${ex.ttb}</div>
  <div class='container exchange-send'>전신환(송금) 보낼때 ${ex.tts}</div>
  <div class='container exchange-trading-base-rate'>매매 기준율 ${ex.deal_bas_r}</div>`;

function getExchangeRate(func, date = getQueryDate()) {
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

const exchangeRateHandler = (event) => {
  const currencyUnitHTML = event.currentTarget.getElementsByClassName('exchange-name')[0];
  const { currencyUnit } = currencyUnitHTML.dataset;

  fetch(`http://localhost:3000/getJson?currency=${currencyUnit}`)
    .then((response) => response.json())
    .then((responseData) => {
      // console.log(responseData);
      drawChart(currencyUnit, responseData);
    })
    .catch((error) => console.error(error));
};

function newExchangeBox(exchangeRateJson) {
  const mainContainer = document.getElementsByClassName('main')[0];
  let containerIdx = -1;

  exchangeRateJson.forEach((ex, idx) => {
    if (idx % 5 === 0) {
      const newContainer = document.createElement('div');
      newContainer.setAttribute('class', 'exchange-rate container');
      mainContainer.appendChild(newContainer);
      containerIdx += 1;
    }
    if (ex.cur_unit !== 'KRW') {
      const exchangeRateContainer = document.getElementsByClassName('exchange-rate')[containerIdx];
      const newContainer = document.createElement('div');
      newContainer.setAttribute('class', 'container flex-direction-column exchange-rate-box boreder-solid');
      newContainer.addEventListener('click', exchangeRateHandler);
      newContainer.innerHTML = makeExchangeRateContainer(ex);
      exchangeRateContainer.appendChild(newContainer);
    }
  });
}

window.onload = () => getExchangeRate(newExchangeBox);
