// const exchangeRateBox = document.getElementsByClassName('exchange-rate-box');
// const curUnitArray = ['USD', 'JPY(100)', 'GBP', 'EUR', 'CNH', 'CAD', 'AUD', 'CHF'];

const getDate = () => {
  const today = new Date();
  const hour = today.getHours();

  if (hour < 11) {
    today.setDate(today.getDate() - 1);
  }

  const year = today.getFullYear();
  const month = today.getMonth() + 1;
  const date = today.getDate();

  return `${year}-${month}-${date}`;
};

const createExchangeRateData = (responseData) => {
  console.log(responseData);
};

const getExchangeRate = () => {
  const searchdate = {
    searchdate: getDate(),
  };
  const url = '/exchange';
  const options = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(searchdate),
  };

  fetch(url, options)
    .then((response) => response.json())
    .then((json) => createExchangeRateData(json))
    .catch((error) => {
      console.error(error);
    });
};

getExchangeRate();
