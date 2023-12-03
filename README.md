<div align= "center">
    <img src="https://capsule-render.vercel.app/api?type=waving&color=e8d930&height=240&text=Money%20Changer&animation=scaleIn&fontColor=ffffff&fontSize=70"/>
    </div>
    <div style="text-align: left;">
    <h2 style="border-bottom: 1px solid #d8dee4; color: #282d33;"> 🛠️ Tech Stacks </h2> <br> 
    <div style="margin: ; text-align: left;" "text-align: left;"> <img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=HTML5&logoColor=white">
          <img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=CSS3&logoColor=white">
          <img src="https://img.shields.io/badge/Javascript-F7DF1E?style=for-the-badge&logo=Javascript&logoColor=white">
          <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=Node.js&logoColor=white">
          </div><br>
    </div>
    <div style="text-align: left;">
    <h2 style="border-bottom: 1px solid #D8DEE4; color: #282D33;">1. 주제 및 팀원 소개</h2>
    <div style="font-weight: 700; font-size: 15px; text-align: left; color: #282D33;">
      환율 정보 제공 사이트 (API 활용)<br><br>
      https://www.koreaexim.go.kr/ir/HPHKIR020M01?apino=2&viewtype=C&searchselect=&searchword=<br><br>
      </div>
      <br>
    </div>
      <ul>
        <li>김민선</li>
        <li>문지환</li>
        <li>신승민</li>
        <li>이용진</li>
      </ul><br>
    <div>
        <h2 style="border-bottom: 1px solid #D8DEE4; color: #282D33;">2. 협업 방식</h2>
        <div style="font-weight: 700; font-size: 15px; text-align: left; color: #282D33;">
          <img src="https://img.shields.io/badge/git-F05032?style=for-the-badge&logo=git&logoColor=white">
          <img src="https://img.shields.io/badge/github-181717?style=for-the-badge&logo=github&logoColor=white">
        </div>
    </div><br>
    <div>
        <h2 style="border-bottom: 1px solid #D8DEE4; color: #282D33;">3. 핵심 기능 설명 및 구현 방법</h2>
        <div style="font-weight: 700; font-size: 15px; text-align: left; color: #282D33;">
          
* 조회 기준 일자 설정하기<br><br>
  데이터를 가져오는 날짜를 설정합니다.<br>
  (조회 일자가 당일 오전 11시 이전일 경우, 'null' 값을 반환해주므로 이러한 경우에는 이전 날의 데이터를 요청하도록 설정)
```
function getQueryDate() {
const useDate = new Date();
const hour = useDate.getHours();

if (hour < 11) { useDate.setDate(useDate.getDate() - 1); }

const year = useDate.getFullYear(); // year
const month = useDate.getMonth() + 1; // month
const date = useDate.getDate(); // date

return `${year}-${month}-${date}`; }
```

* 환율 차트 그려주기
```
const drawChart = (currencyUnit, responseData) => {
  const context = document.getElementsByClassName('chart-box')[0];

  if (context) { context.remove(); }

  const mainContainer = document.getElementsByClassName('main')[0];
  const chartContainer = document.createElement('canvas');
  chartContainer.setAttribute('class', 'container chart-box boreder-solid');
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

  Chart(chartContainer, config); };
```

* 환율 정보 받아오기
```
function getExchangeRate(func, date = getQueryDate()) {
  const exchangeRateRequest = new XMLHttpRequest();
  exchangeRateRequest.onreadystatechange = () => {

    if (exchangeRateRequest.readyState === 4 && exchangeRateRequest.status === 200) {
      const body = JSON.parse(exchangeRateRequest.responseText);
      const filteredBody = body.filter((currency) => currency.cur_unit !== 'KRW');
      func(filteredBody);
    } };

  exchangeRateRequest.open('GET', `/exchangeRate?date=${date}`, true);
  exchangeRateRequest.send(); }
```

  </div>
    </div>
    <div>
        <h2 style="border-bottom: 1px solid #D8DEE4; color: #282D33;">4. 트러블 슈팅</h2>
        <div style="font-weight: 700; font-size: 15px; text-align: left; color: #282D33;">
          조회 일자에 따른 'null' 값 반환<br><br>
          API를 제공해주는 한국수출입은행의 영업일이나 영업시간이 아닌 경우, 'null' 값을 반환받게 되었습니다.<br>
          데이터를 요청하는 쿼리문의 오류인줄 알았으나, 이는 한국수출입은행 환율정보 API의 자체적인 규정이며<br>
          이러한 경우에는 조회 일자 기준의 전일로 요청하도록 설정하여 조회 문제를 해결하였습니다.
        </div><br>
    </div>
    <div>
        <h2 style="border-bottom: 1px solid #D8DEE4; color: #282D33;">5. 도메인 용어 정의</h2>
        <div style="font-weight: 700; font-size: 15px; text-align: left; color: #282D33;">
          도메인 용어
        </div><br>
    </div>
    <div>
        <h2 style="border-bottom: 1px solid #D8DEE4; color: #282D33;">6. ESLint 규칙 및 적용 후기</h2>
        <div style="font-weight: 700; font-size: 15px; text-align: left; color: #282D33;">
          Airbnb의 Eslint 규칙을 토대로 약간의 수정 후 적용하였습니다.<br><br>
          * no-undef: off<br>
          : ESlint는 실행 환경이 node이고, node 환경에서는 document 또는 window 객체와 같은 DOM을 사용할 수 없기 때문에 'off' 설정
        </div><br>
    </div>
     <div>
        <h2 style="border-bottom: 1px solid #D8DEE4; color: #282D33;">7. 회고</h2>
        <div style="font-weight: 700; font-size: 15px; text-align: left; color: #282D33;">
        </div>
             <ul>
        <li>김민선</li>
        <li>문지환</li>
        <li>신승민 : 이번 기회에 여러 유용한 API를 제공받을 수 있는 사이트가 많고, 이를 적절히 활용하는 것도 가능하다는 것을 알게 되었습니다. 그리고 서버와 클라이언트가 데이터를 주고 받는 방식에 대해 깊이 이해할 수 있었습니다. 또한 다른 유능한 팀원들에게 도움을 받아 한층 더 성장할 수 있어서 유익한 기회였습니다.</li>
        <li>이용진 : 팀원들과 함께 어떤 Open API로 어떤 서비스를 만들지 함께 고민해나가고, 분업하여 빠르게 완성해나갔습니다. 그 과정에서 함께 문제를 해결해나가는 경험이 좋았습니다.</li>
      </ul>
    </div>
