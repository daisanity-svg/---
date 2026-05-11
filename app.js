const rateText = document.querySelector("#rateText");
const statusText = document.querySelector("#statusText");
const refreshBtn = document.querySelector("#refreshBtn");
const jpyInput = document.querySelector("#jpyInput");
const twdInput = document.querySelector("#twdInput");
const manualRateInput = document.querySelector("#manualRateInput");
const applyManualRateBtn = document.querySelector("#applyManualRateBtn");
const quickButtons = document.querySelectorAll(".quick button");

let rate = null;
let activeInput = "jpy";

const formatRate = (value) => {
  if (!Number.isFinite(value)) return "尚未取得";
  return `1 JPY = ${value.toFixed(6)} TWD`;
};

const setStatus = (message) => {
  statusText.textContent = message;
};

const updateOutputs = () => {
  if (!rate) return;

  const jpy = Number(jpyInput.value || 0);
  const twd = Number(twdInput.value || 0);

  if (activeInput === "jpy") {
    twdInput.value = jpy ? (jpy * rate).toFixed(2) : "";
  } else {
    jpyInput.value = twd ? (twd / rate).toFixed(2) : "";
  }

  rateText.textContent = formatRate(rate);
};

const fetchJson = async (url) => {
  const response = await fetch(url, { cache: "no-store" });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

const getLiveRate = async () => {
  const providers = [
    async () => {
      const data = await fetchJson("https://api.frankfurter.app/latest?from=JPY&to=TWD");
      return {
        rate: Number(data?.rates?.TWD),
        source: "Frankfurter",
        date: data?.date || new Date().toISOString().slice(0, 10)
      };
    },
    async () => {
      const data = await fetchJson("https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/jpy.json");
      return {
        rate: Number(data?.jpy?.twd),
        source: "Currency API CDN",
        date: data?.date || new Date().toISOString().slice(0, 10)
      };
    }
  ];

  let lastError;
  for (const provider of providers) {
    try {
      const result = await provider();
      if (Number.isFinite(result.rate) && result.rate > 0) return result;
    } catch (error) {
      lastError = error;
    }
  }

  throw lastError || new Error("無法取得匯率");
};

const refreshRate = async () => {
  refreshBtn.disabled = true;
  setStatus("正在取得即時匯率...");

  try {
    const result = await getLiveRate();
    rate = result.rate;
    manualRateInput.value = rate.toFixed(6);
    rateText.textContent = formatRate(rate);
    setStatus(`已更新：${result.date}｜來源：${result.source}｜實際成交仍需依銀行買賣匯率為準。`);
    updateOutputs();
  } catch (error) {
    console.error(error);
    setStatus("即時匯率讀取失敗。請展開「手動設定匯率」輸入銀行或換匯所提供的 JPY/TWD 匯率。");
    rateText.textContent = "讀取失敗";
  } finally {
    refreshBtn.disabled = false;
  }
};

jpyInput.addEventListener("input", () => {
  activeInput = "jpy";
  updateOutputs();
});

twdInput.addEventListener("input", () => {
  activeInput = "twd";
  updateOutputs();
});

refreshBtn.addEventListener("click", refreshRate);

applyManualRateBtn.addEventListener("click", () => {
  const manualRate = Number(manualRateInput.value);
  if (!Number.isFinite(manualRate) || manualRate <= 0) {
    setStatus("請輸入正確的匯率，例如：0.20004");
    return;
  }

  rate = manualRate;
  rateText.textContent = formatRate(rate);
  setStatus("已套用手動匯率。");
  updateOutputs();
});

quickButtons.forEach((button) => {
  button.addEventListener("click", () => {
    activeInput = "jpy";
    jpyInput.value = button.dataset.amount;
    updateOutputs();
  });
});

refreshRate();
