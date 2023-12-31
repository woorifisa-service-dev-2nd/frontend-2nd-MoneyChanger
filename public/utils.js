const makeExchangeRateContainer = (ex) => `<div class='container exchange-name' data-currency-unit='${ex.cur_unit}'>${ex.cur_nm} (${ex.cur_unit})</div>
  <div class='container exchange-receive'>전신환(송금) 받으실때 ${ex.ttb}</div>
  <div class='container exchange-send'>전신환(송금) 보낼때 ${ex.tts}</div>
  <div class='container exchange-trading-base-rate'>매매 기준율 ${ex.deal_bas_r}</div>`;

const exchangeRateHandler = (event) => {
  const currencyUnitHTML = event.currentTarget.getElementsByClassName('exchange-name')[0];
  const { currencyUnit } = currencyUnitHTML.dataset;

  fetch(`http://localhost:3000/getJson?currency=${currencyUnit}`)
    .then((response) => response.json())
    .then((responseData) => {
      drawChart(currencyUnit, responseData);
    })
    .catch((error) => console.error(error));
};

export async function newExchangeBox(exchangeRateJson) {
  const mainContainer = document.getElementsByClassName('select')[0];
  let containerIdx = -1;
  exchangeRateJson.forEach((ex, idx) => {
    if (idx % 6 === 0) {
      const newContainer = document.createElement('div');
      newContainer.setAttribute('class', 'exchange-rate container');
      mainContainer.appendChild(newContainer);
      containerIdx += 1;
    }
    if (ex.cur_unit !== 'KRW') {
      const exchangeRateContainer = document.getElementsByClassName('exchange-rate')[containerIdx];
      const newContainer = document.createElement('div');
      newContainer.setAttribute('class', 'container flex-direction-column exchange-rate-box boreder-solid border-radius');
      newContainer.addEventListener('click', exchangeRateHandler);
      newContainer.innerHTML = makeExchangeRateContainer(ex);
      exchangeRateContainer.appendChild(newContainer);
    }
  });
}

const convertToNumber = (stringNumber) => {
  if (!!stringNumber === false) {
    return '';
  }
  return parseFloat(stringNumber.replaceAll(',', ''));
};

const drawChart = (currencyUnit, responseData) => {
  const context = document.getElementsByClassName('chart-box')[0];
  if (context) {
    context.remove();
  }

  const mainContainer = document.getElementsByClassName('chart')[0];
  const chartContainer = document.createElement('canvas');
  chartContainer.setAttribute('class', 'container chart-box boreder-solid shadow');
  mainContainer.appendChild(chartContainer);

  const labels = responseData.map((data) => data.date);
  const ttbData = responseData.map((data) => convertToNumber(data.ttb));
  const ttsData = responseData.map((data) => convertToNumber(data.tts));
  const dealBasRData = responseData.map((data) => convertToNumber(data.deal_bas_r));

  const data = {
    labels,
    datasets: [
      {
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
      },
    ],
  };

  const config = {
    type: 'line',
    data,
  };

  new Chart(chartContainer, config);
};

export function getQueryDate() {
  let useDate = new Date();
  const hour = useDate.getHours();
  // 오전 11시 이전이면 전 날짜로 가져오기
  if (hour < 11) {
    useDate.setDate(useDate.getDate() - 1);
  }

  while (true) {
    // Check if the date is a holiday
    if (0 < useDate.getDay() && useDate.getDay() < 6) {
      const year = useDate.getFullYear();
      const month = useDate.getMonth() + 1;
      const date = useDate.getDate();
      return `${year}-${month < 10 ? '0' : ''}${month}-${date < 10 ? '0' : ''}${date}`;
    }
    useDate.setDate(useDate.getDate() - 1);
  }
}

export const checkDataFolder = async () => {
  const dataFolder = './data';
  const exchangeRateRequest = new XMLHttpRequest();
  exchangeRateRequest.onreadystatechange = () => {
    // 데이터를 다 받았고, 응답코드 200(성공)을 받았는지 체크
    if (exchangeRateRequest.readyState === 4 && exchangeRateRequest.status === 200) {
      console.log('Data folder created');
    }
  };
  exchangeRateRequest.open('GET', '/getJson', true);
  exchangeRateRequest.send();
}