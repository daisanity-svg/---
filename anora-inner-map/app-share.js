(() => {
  const $ = s => document.querySelector(s);
  let lastSignature = '';

  const COPY = {
    '硬撐責任型': {
      title: '你不是不累。\n你只是太習慣\n把事情扛起來。',
      recent: '最近的你，\n很多事情沒有人叫你扛，\n但你就是放不下。\n\n你常常先把事情處理好，\n再回頭才發現，\n自己其實已經很累。',
      power: '你很可靠，也很穩定。\n但可靠不代表\n什麼都要自己撐住。',
      advice: '接下來，少接一件\n不是非你不可的事。\n先把自己留在生活裡。'
    },
    '假裝不在意型': {
      title: '你不是冷淡。\n你只是太久\n沒有被好好理解。',
      recent: '最近的你，\n習慣先消化情緒，\n再假裝自己沒事。\n\n很多事情明明在意，\n卻選擇不說。\n久而久之，別人以為你不需要被照顧。',
      power: '你很清醒，也很敏銳。\n你不是脆弱，\n只是比別人多感受到一些東西。',
      advice: '不用急著讓所有人理解你。\n先允許自己停下來。\n照顧自己，也是一種勇敢。'
    },
    '反覆重播型': {
      title: '你不是想太多。\n你只是太容易\n被細節留下。',
      recent: '最近的你，\n常常被一句話、一個語氣，\n拖進很長的反覆思考裡。\n\n你不是故意鑽牛角尖，\n只是太習慣從細節裡找答案。',
      power: '你敏感、細膩、共感力強。\n這不是缺點，\n只是你需要更溫柔地使用它。',
      advice: '下一次開始亂想時，\n先問自己：\n這是事實，還是我最害怕的劇情？'
    },
    '卡在轉彎型': {
      title: '你不是沒有方向。\n你只是正在\n離開舊的自己。',
      recent: '最近的你，\n知道不能再照以前那樣過，\n卻還沒找到新的步伐。\n\n你不是停住，\n你是在轉彎。',
      power: '你有覺察，也有更新能力。\n能承認自己正在變，\n本身就需要勇氣。',
      advice: '先做一件很小的事。\n小到不會害怕，\n但足夠讓你開始往前。'
    },
    '把話吞回去型': {
      title: '你不是沒情緒。\n你只是太常\n把話吞回去。',
      recent: '最近的你，\n很多時候說沒事，\n其實只是還沒有人讓你安心說真話。\n\n你怕造成麻煩，\n所以最後都麻煩自己。',
      power: '你能忍、能體諒、很懂分寸。\n但你也值得\n被好好聽見。',
      advice: '找一件小事說出來。\n不是為了吵架，\n是讓自己被看見。'
    },
    '先顧別人型': {
      title: '你不是太懂事。\n你只是太少\n把自己放前面。',
      recent: '最近的你，\n總是先照顧別人的感受，\n才回頭處理自己的委屈。\n\n你嘴巴說沒關係，\n但心裡其實有點失望。',
      power: '你的溫柔是真的。\n但溫柔不應該\n變成你被消耗的理由。',
      advice: '答應之前，先停三秒。\n問自己：\n我是願意，還是不敢拒絕？'
    },
    '等一個確定型': {
      title: '你不是要很多。\n你只是想被\n堅定放在心上。',
      recent: '最近的你，\n常常在等一個回應，\n也在等自己終於可以安心。\n\n你不是放不下，\n你只是還在等一個明確。',
      power: '你真誠，也很願意投入。\n只是別把安全感\n全部交給別人的反應。',
      advice: '問自己一句：\n我在這段關係裡，\n真的安心嗎？'
    },
    '怕失控預演型': {
      title: '你不是愛控制。\n你只是太怕\n事情突然壞掉。',
      recent: '最近的你，\n總是先把最壞的情況想完，\n才敢讓自己放鬆一點。\n\n你很努力讓生活穩住，\n只是也把自己逼得太緊。',
      power: '你細心、能規劃、能安定局面。\n這是能力，\n不該只變成壓力。',
      advice: '選一件小事，\n讓它不用完美。\n世界不會因此崩掉。'
    },
    '安靜消化型': {
      title: '你不是不需要人。\n你只是太習慣\n自己消化。',
      recent: '最近的你，\n看起來很安靜，\n其實心裡處理了很多沒有說出口的事。\n\n你不是高傲，\n只是太不想再失望。',
      power: '你獨立、清醒、有自己的節奏。\n也擁有慢慢\n修復自己的能力。',
      advice: '讓一個人多看見你一點。\n不用很多，\n一點點就好。'
    },
    '慢慢安心型': {
      title: '你不是害怕改變。\n你只是需要\n慢慢安心。',
      recent: '最近的你，\n不是不想往前，\n只是需要先確認自己不會再被丟下。\n\n你不是慢，\n你是在等心裡跟上。',
      power: '你穩定、耐心、能長期經營。\n只要找到節奏，\n你會走得很遠。',
      advice: '先做一個小改變。\n小到不害怕，\n但足夠讓你知道：我可以往前。'
    }
  };

  function isVisible() {
    const result = $('#result');
    return result && !result.classList.contains('hidden');
  }

  function getSignature() {
    return (($('#archetypeName')?.innerText || '') + ($('#reportContent')?.innerText || ''));
  }

  function getCopy() {
    const type = $('#archetypeName')?.innerText.trim() || '';
    return COPY[type] || {
      title: '你的內在地圖。\n正在慢慢展開。',
      recent: '最近的你，\n正在學會用更誠實的方式理解自己。\n\n有些答案不用急，\n你可以先把自己放回來。',
      power: '你敏感、真誠，\n也願意面對自己。',
      advice: '不用立刻變好。\n先穩定下來，\n這就已經是開始。'
    };
  }

  function renderCard() {
    if (!isVisible()) return;
    const sig = getSignature();
    if (!sig || sig === lastSignature) return;
    lastSignature = sig;

    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 1080;
    canvas.height = 1920;

    const bg = '#F4EEE4';
    const ink = '#2F473A';
    const muted = '#738076';
    const panel = '#E5DFD2';
    const panel2 = '#ECE6DA';

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, 1080, 1920);

    const grad = ctx.createLinearGradient(0, 0, 1080, 1920);
    grad.addColorStop(0, 'rgba(255,255,255,.28)');
    grad.addColorStop(1, 'rgba(47,71,58,.05)');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, 1080, 1920);

    ctx.strokeStyle = ink;
    ctx.globalAlpha = .28;
    ctx.lineWidth = 1.3;
    ctx.beginPath();
    ctx.moveTo(82, 115);
    ctx.lineTo(82, 1785);
    ctx.stroke();
    ctx.globalAlpha = 1;
    ctx.fillStyle = ink;
    ctx.fillRect(76, 430, 12, 118);

    ctx.font = '400 62px Georgia, Times New Roman, serif';
    ctx.fillText('anōra', 160, 175);
    ctx.font = '400 27px Georgia, Times New Roman, serif';
    ctx.fillText('I N N E R   M A P', 160, 225);
    ctx.font = '400 25px PingFang TC, Noto Serif TC, serif';
    ctx.fillText('心  理  地  圖  分  析', 160, 282);

    const copy = getCopy();

    ctx.fillStyle = ink;
    ctx.font = '700 68px PingFang TC, Noto Serif TC, serif';
    let y = multiline(ctx, copy.title, 160, 460, 800, 88);

    ctx.strokeStyle = ink;
    ctx.globalAlpha = .4;
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(160, y + 32);
    ctx.lineTo(318, y + 32);
    ctx.stroke();
    ctx.globalAlpha = 1;

    y += 120;
    ctx.fillStyle = muted;
    ctx.font = '500 30px PingFang TC, Noto Serif TC, serif';
    ctx.fillText('最近的你', 160, y);
    y += 48;

    ctx.fillStyle = ink;
    ctx.font = '400 34px PingFang TC, Noto Serif TC, serif';
    y = multiline(ctx, copy.recent, 160, y, 765, 47);

    const card1Y = 1255;
    ctx.fillStyle = panel;
    roundRect(ctx, 150, card1Y, 780, 220, 24);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = '500 35px PingFang TC, Noto Serif TC, serif';
    ctx.fillText('你的內在力量', 210, card1Y + 62);
    ctx.font = '400 29px PingFang TC, Noto Serif TC, serif';
    multiline(ctx, copy.power, 210, card1Y + 112, 650, 42);

    const card2Y = 1510;
    ctx.fillStyle = panel2;
    roundRect(ctx, 150, card2Y, 780, 195, 24);
    ctx.fill();
    ctx.fillStyle = ink;
    ctx.font = '500 35px PingFang TC, Noto Serif TC, serif';
    ctx.fillText('給現在的你', 210, card2Y + 58);
    ctx.font = '400 29px PingFang TC, Noto Serif TC, serif';
    multiline(ctx, copy.advice, 210, card2Y + 106, 650, 42);

    ctx.fillStyle = ink;
    ctx.font = '400 28px Georgia, Times New Roman, serif';
    ctx.fillText('anōra INNER MAP', 160, 1792);
    ctx.font = '400 25px PingFang TC, Noto Serif TC, serif';
    ctx.fillText('陪你看見內在的真實地圖', 160, 1840);

    const url = canvas.toDataURL('image/png');
    let wrap = $('#storyCardWrap');
    if (!wrap) {
      wrap = document.createElement('div');
      wrap.id = 'storyCardWrap';
      wrap.style.cssText = 'max-width:420px;margin:0 auto 24px;text-align:center;';
      wrap.innerHTML = `
        <img id="storyCardImg" style="width:100%;border-radius:22px;box-shadow:0 18px 48px rgba(0,0,0,.16);-webkit-touch-callout:default;user-select:auto;-webkit-user-select:auto;">
        <p style="margin:12px 0 0;color:#f3e6de;font-size:14px;opacity:.85;">長按圖片即可儲存</p>
      `;
      $('#reportPaper')?.parentNode?.insertBefore(wrap, $('#reportPaper'));
    }
    $('#storyCardImg').src = url;
    const paper = $('#reportPaper');
    if (paper) paper.style.display = 'none';
  }

  function multiline(ctx, text, x, y, maxWidth, lineHeight) {
    let currentY = y;
    String(text).split('\n').forEach(line => {
      currentY = wrap(ctx, line, x, currentY, maxWidth, lineHeight);
    });
    return currentY;
  }

  function wrap(ctx, text, x, y, maxWidth, lineHeight) {
    let line = '';
    let currentY = y;
    for (const ch of String(text)) {
      const test = line + ch;
      if (ctx.measureText(test).width > maxWidth && line) {
        ctx.fillText(line, x, currentY);
        line = ch;
        currentY += lineHeight;
      } else {
        line = test;
      }
    }
    if (line) ctx.fillText(line, x, currentY);
    return currentY + lineHeight;
  }

  function roundRect(ctx, x, y, width, height, radius) {
    ctx.beginPath();
    ctx.moveTo(x + radius, y);
    ctx.arcTo(x + width, y, x + width, y + height, radius);
    ctx.arcTo(x + width, y + height, x, y + height, radius);
    ctx.arcTo(x, y + height, x, y, radius);
    ctx.arcTo(x, y, x + width, y, radius);
    ctx.closePath();
  }

  const observer = new MutationObserver(() => setTimeout(renderCard, 250));
  window.addEventListener('DOMContentLoaded', () => {
    const result = $('#result');
    if (result) {
      observer.observe(result, { attributes: true, attributeFilter: ['class'], subtree: true, childList: true });
    }
    setTimeout(renderCard, 500);
  });
})();