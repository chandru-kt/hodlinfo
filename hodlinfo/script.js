const tickersTable = document.querySelector('#tickers');

async function getTickers() {
  try {
    const response = await fetch('/tickers');
    const data = await response.json();
    const tickers = data.map((ticker) => {
      return `
        <tr>
          <td>${ticker.name}</td>
          <td>${ticker.last}</td>
          <td>${ticker.buy}</td>
          <td>${ticker.sell}</td>
          <td>${ticker.volume}</td>
          <td>${ticker.base_unit}</td>
        </tr>
      `;
    });
    tickersTable.innerHTML = tickers.join('');
  } catch (error) {
    console.error(error);
  }
}

getTickers();
